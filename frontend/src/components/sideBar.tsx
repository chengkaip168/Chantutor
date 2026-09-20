import { icons } from '../assets/icons.tsx';
import SideNavIcons from './sideNavIcons.tsx';
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from '../supabase-client.ts';
import { LogoMark } from "../assets/logo";
import { useContext } from 'react';
import { UserContext } from './userContext.ts';

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useContext(UserContext);
  const isAdmin = user?.role === 'admin';

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="flex flex-col justify-between py-4 h-screen md:w-56 w-14 bg-white border-r border-slate-200 shrink-0">
      <div className="flex flex-col gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 pb-5 mb-2 border-b border-slate-100">
          <LogoMark className="h-5 w-auto shrink-0" />
          <span className="md:inline hidden brand-name text-base text-slate-800">TestQueens</span>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-0.5 px-2">
          <SideNavIcons
            icon={icons.home}
            label="Home"
            onClick={() => navigate("/home")}
            active={location.pathname === "/home"}
          />
          <SideNavIcons
            icon={icons.performance}
            label="Performance"
            onClick={() => navigate("/performance")}
            active={location.pathname === "/performance"}
          />
          {isAdmin && (
            <SideNavIcons
              icon={icons.table}
              label="Admin"
              onClick={() => navigate("/admin")}
              active={location.pathname === "/admin"}
            />
          )}
        </div>
      </div>

      {/* Sign out */}
      <div className="px-2">
        <SideNavIcons icon={icons.logout} label="Sign Out" onClick={signOut} />
      </div>
    </div>
  );
}
