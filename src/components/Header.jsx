import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ pageTitle = "DigiTrace", breadcrumbs = [], setMobileOpen }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-5 md:px-8 border-b border-[#E6E2D8]">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-1.5 text-[#4A5550] hover:text-[#1C2421] rounded-lg hover:bg-[#FAF8F5]"
          onClick={() => setMobileOpen && setMobileOpen(true)}
          aria-label="Open Navigation Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-2 text-xs text-[#4A5550] font-medium">
          <Link to="/dashboard" className="hover:text-[#1B4D3E] transition-colors font-semibold">
            DigiTrace
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="material-symbols-outlined text-[13px] text-[#A3B18A]">chevron_right</span>
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-[#1B4D3E] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#1C2421] font-bold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
          {breadcrumbs.length === 0 && (
            <>
              <span className="material-symbols-outlined text-[13px] text-[#A3B18A]">chevron_right</span>
              <span className="text-[#1C2421] font-bold">{pageTitle}</span>
            </>
          )}
        </nav>

        {/* Platform Status Chip */}
        <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-bold border border-[#A7F3D0]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span>Rescue Network Active</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#78857E] text-[18px]">search</span>
          <input
            className="h-9 pl-9 pr-4 rounded-xl bg-[#FAF8F5] text-[#1C2421] placeholder:text-[#78857E] text-xs border border-[#E6E2D8] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E] focus:border-[#1B4D3E] w-56 lg:w-72"
            placeholder="Search surplus food, requests, tracking IDs..."
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/surplus-food?q=${encodeURIComponent(e.target.value.trim())}`);
              }
            }}
          />
        </div>

        {/* Direct Action Link */}
        <Link
          to="/surplus-food"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4F1E8] text-[#1B4D3E] border border-[#E6E2D8] text-xs font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span>Find Food</span>
        </Link>

        {/* User Profile Direct Link */}
        <Link to="/profile" className="flex items-center gap-2 pl-1 hover:opacity-85 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#1B4D3E] flex items-center justify-center text-white font-bold">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
          <span className="hidden xl:block text-xs text-[#1C2421] font-bold">Shruti S.</span>
        </Link>
      </div>
    </header>
  );
}
