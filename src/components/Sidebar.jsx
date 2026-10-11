import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { label: 'Surplus Food / Find Food', path: '/surplus-food', icon: 'storefront' },
    { label: 'My Donations', path: '/food-records', icon: 'volunteer_activism' },
    { label: 'My Requests', path: '/my-requests', icon: 'assignment' },
    { label: 'Food Tracking', path: '/trace/DT-F-0001', icon: 'account_tree' },
    { label: 'Impact & Reports', path: '/reports', icon: 'monitoring' },
  ];

  const accountNavItems = [
    { label: 'Profile', path: '/profile', icon: 'person' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path.startsWith('/trace')) return location.pathname.startsWith('/trace') || location.pathname.startsWith('/waste-record-details');
    const basePath = path.split('/')[1];
    return location.pathname.startsWith(`/${basePath}`);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-[#1C2421]/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto border-r border-[#E6E2D8]`}>
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between bg-white border-b border-[#E6E2D8] shrink-0">
            <Link to="/dashboard" className="flex items-center gap-3">
              <Logo className="h-8 w-8 shrink-0 text-[#1B4D3E]" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-base text-[#1C2421] leading-tight font-extrabold tracking-tight">DigiTrace</span>
                <span className="font-label-sm text-[11px] text-[#1B4D3E] leading-none font-bold">Food Rescue & Trace</span>
              </div>
            </Link>
            <button 
              className="md:hidden p-1 text-[#4A5550] hover:text-[#1C2421]" 
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-6 px-3.5 my-4">
            {/* MAIN Group */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-[#78857E] font-bold px-3 py-1">
                PLATFORM
              </span>
              {mainNavItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
                      active
                        ? 'bg-[#1B4D3E] text-white font-bold shadow-xs'
                        : 'text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#1C2421] font-semibold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* ACCOUNT Group */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-[#78857E] font-bold px-3 py-1">
                ACCOUNT
              </span>
              {accountNavItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
                      active
                        ? 'bg-[#1B4D3E] text-white font-bold shadow-xs'
                        : 'text-[#4A5550] hover:bg-[#FAF8F5] hover:text-[#1C2421] font-semibold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-3.5 bg-white border-t border-[#E6E2D8] shrink-0">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
            <Link to="/profile" className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1B4D3E] flex items-center justify-center text-white shrink-0 font-bold">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-[#1C2421] truncate font-bold">Shruti Sharma</span>
                <span className="text-[11px] text-[#52796F] truncate font-medium">Food Provider Lead</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#4A5550] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors shrink-0"
              title="Log out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
