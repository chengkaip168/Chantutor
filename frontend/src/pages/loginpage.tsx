import { supabase } from "../supabase-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoLockup, LogoMark } from "../assets/logo";
import "./loginpage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  async function sendResetEmail(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
      redirectTo: window.location.origin,
    });
    setForgotLoading(false);
    setForgotSent(true);
  }

  async function signIn() {
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        const isNetwork = authError.message.toLowerCase().includes("fetch") ||
                          authError.message.toLowerCase().includes("network") ||
                          (authError as { status?: number }).status === 0;
        setError(isNetwork
          ? "Connection failed. Check your internet connection and try again."
          : "Invalid email or password.");
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        navigate(profile?.role === "admin" ? "/admin" : profile?.role === "tutor" ? "/tutor" : profile?.role === "parent" ? "/parent" : "/home");
      } else {
        navigate("/home");
      }
    } catch {
      setError("Connection failed. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tq-login">
      {/* Decorative background — shapes deliberately cross the card's edge */}
      <div className="tq-bg" aria-hidden="true" />
      <div className="tq-shape tq-shape-1" aria-hidden="true" />
      <div className="tq-shape tq-shape-2" aria-hidden="true" />
      <div className="tq-shape tq-shape-3" aria-hidden="true" />
      <div className="tq-grain" aria-hidden="true" />

      <div className="tq-shell">
      {/* Left panel — branding */}
      <div className="tq-brandzone">
        <div className="tq-brand-inner">
          <h1 className="tq-a-lockup">
            <LogoLockup className="tq-lockup" />
          </h1>
          <p className="tq-tagline tq-a-tagline">
            Master the SHSAT with smart,<br />personalized practice.
          </p>
          <hr className="tq-rule tq-a-rule" aria-hidden="true" />
          <div className="tq-bullets">
            {[
              "Adaptive diagnostic testing",
              "AI-powered performance insights",
              "Targeted practice by topic",
            ].map((f, i) => (
              <div key={f} className={`tq-bullet tq-a-b${i + 1}`}>
                <div className="tq-bullet-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="tq-formzone">
        <div className="tq-card tq-a-card">
          <div className="tq-mobile-brand">
            <LogoMark className="h-6 w-auto" />
            <span className="brand-name text-2xl text-slate-900">TestQueens</span>
          </div>
          <div className="tq-card-head">
            <h2 className="tq-h2">Welcome back</h2>
            <p className="tq-sub">Sign in to continue your practice.</p>
          </div>
          {showForgot ? (
            /* ── Forgot password inline form ── */
            forgotSent ? (
              <div className="tq-sent">
                <div className="tq-sent-badge">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="tq-h3">Check your inbox</h3>
                  <p className="tq-sent-copy">
                    If <span className="tq-sent-em">{forgotEmail}</span> has an account,
                    you'll receive a reset link shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                  className="tq-link"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form className="tq-form" onSubmit={sendResetEmail}>
                <div className="tq-card-head">
                  <h2 className="tq-h2">Forgot password?</h2>
                  <p className="tq-sub">Enter your email and we'll send a reset link.</p>
                </div>
                <label className="tq-field">
                  <span className="tq-label">Email</span>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    required
                    className="tq-input"
                  />
                </label>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="tq-btn"
                >
                  {forgotLoading ? "Sending…" : "Send reset link"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="tq-link tq-link-quiet"
                >
                  Back to sign in
                </button>
              </form>
            )
          ) : (
            /* ── Normal sign-in form ── */
            <>
              <form className="tq-form" onSubmit={(e) => { e.preventDefault(); signIn(); }}>
                <label className="tq-field tq-a-f1">
                  <span className="tq-label">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="tq-input"
                  />
                </label>
                <label className="tq-field tq-a-f2">
                  <div className="tq-field-row">
                    <span className="tq-label">Password</span>
                    <button
                      type="button"
                      onClick={() => { setShowForgot(true); setForgotEmail(email); }}
                      className="tq-link tq-link-sm"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="tq-input"
                  />
                </label>
                {error && (
                  <p className="tq-error">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="tq-btn tq-a-f3"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>
              <p className="tq-foot tq-a-f4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signUp")}
                  className="tq-link"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default LoginPage;
