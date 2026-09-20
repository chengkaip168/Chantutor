# TestQueens — Frontend

Web application for SHSAT test preparation. Students take full-length adaptive mock tests,
timed practice sets, and a diagnostic exam; tutors and administrators manage the question
bank, assign work, and review performance.

Deployed at [testqueens.com](https://testqueens.com). Developed by [Hamana Studio](https://hamana.studio)

## Stack

- **React 19** with **React Router 7** (hash routing)
- **Vite 8** for dev server and builds
- **Tailwind CSS 4** via the Vite plugin
- **Supabase** for auth, Postgres, storage, and edge functions
- **Recharts** for performance charts, **jsPDF** + **html2canvas** for PDF export

Source files use `.tsx`/`.ts`, but the project has no `tsconfig.json` and TypeScript is not
installed. Vite strips type annotations at build time without type checking them — types are
documentation only, and `npm run build` will not catch type errors.

## Prerequisites

- Node.js 20 or newer
- A Supabase project (for running against real data)

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `.env` with the values from your Supabase project under
**Project Settings → API**:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Both variables are required — the app fails to reach the backend without them. They are
embedded into the client bundle at build time, so only ever put the publishable
(anon) key here. Never the service role key.

Signup codes are **not** stored in `.env`. They are validated server-side by the
`create-account` edge function and set as Supabase secrets:

```bash
supabase secrets set STUDENT_CODE=your_student_code
supabase secrets set ADMIN_CODE=your_admin_code
```

## Commands

Run from the `frontend/` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot module replacement |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |

## Project structure

```
src/
  pages/        One component per route (login, home, mock test, results, admin, tutor, parent)
  components/   Shared UI and the question-type renderers
  hooks/        Custom hooks (useELATools — highlighter, notepad, line mask)
  utils/        Scoring, PDF export, passage text parsing, translations
  assets/       Logo, icons, hero image
  supabase-client.ts   Configured Supabase client
```

### Question types

`components/questionRenderer.tsx` dispatches on a question's `type` field to the matching
component. Supported types include multiple choice, grid-in, multi-select, expression editor,
linear graphing, inline dropdown, drag-to-bin, drag-to-categorize, drag-fill, number-line
click, table-row radio, and passage sentence select.

To add a type: create the component, add a `case` to `questionRenderer.tsx`, and add a
matching branch to `checkAnswer` in `pages/mocktest.tsx`.

### Routes and roles

Access is enforced by the `ProtectedRoute` wrapper in `App.tsx`.

| Route | Access |
|---|---|
| `/`, `/signUp`, `/reset-password` | Public |
| `/home`, `/performance`, `/mock/:testID` | Student |
| `/results/:testID`, `/performance/:studentId` | Any signed-in user |
| `/admin` | Admin |
| `/tutor` | Tutor |
| `/parent` | Parent |

## Backend

Supabase assets live in the repository root, not in this directory:

- `supabase/functions/` — six edge functions: `create-account`, `generate-questions`,
  `classify-difficulty`, `analyze-performance`, `get-student-performance`, `parent-api`
- `supabase/migrations/` — schema, row-level security policies, and RPCs

Deploy from the repository root:

```bash
supabase functions deploy <function-name>
supabase db push
```

## Question import pipeline

`scripts/` at the repository root contains the tooling that converts practice-test PDFs into
database rows. Run the steps in order:

1. `extract_tests.py` — renders each PDF page to PNG and uses the Claude vision API to pull
   out question text, choices, type, and answer. Test content is rasterized inside the PDFs,
   so text-based parsing is not an option. Writes CSVs to `scripts/output/`.
2. `import_to_supabase.py` — imports those CSVs into `all_questions` with `status = 'pending'`.
3. `set_difficulty.py` — rates each question easy/medium/hard via Claude and patches the rows.
4. `verify_answers.py` — checks stored answers against the official answer key and emits SQL
   `UPDATE` statements for any mismatch.

Imported questions land as `pending`. Review them in **Admin → Questions** and promote them to
`approved` before they reach students.

These scripts read credentials from the environment and never from a file. Required variables
vary by script:

| Variable | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | `extract_tests.py`, `set_difficulty.py` |
| `SUPABASE_URL` | `import_to_supabase.py`, `set_difficulty.py` |
| `SUPABASE_SERVICE_ROLE_KEY` | `import_to_supabase.py`, `set_difficulty.py` |
| `SUPABASE_SERVICE_KEY` | `verify_answers.py` |

> The service-role key is named inconsistently across scripts — `verify_answers.py` reads
> `SUPABASE_SERVICE_KEY` while the others read `SUPABASE_SERVICE_ROLE_KEY`. Both refer to the
> same key. Worth unifying.

In PowerShell, quote the value so the JWT's dots are not parsed as operators:

```powershell
$env:SUPABASE_SERVICE_KEY = "your-service-key"
python scripts/verify_answers.py
```

## Deployment

Netlify builds from `netlify.toml` at the repository root: base `frontend`, command
`npm run build`, publish `dist`.

`.env` is not committed, so `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` must be
set in **Netlify → Site configuration → Environment variables** or the deployed build will
have no backend connection.
