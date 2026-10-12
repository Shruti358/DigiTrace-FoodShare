import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { label: 'Food Records', path: '/food-records', icon: 'inventory_2' },
    { label: 'Surplus & Rescue', path: '/surplus-food', icon: 'volunteer_activism' },
    { label: 'Waste Tracking', path: '/waste-tracking', icon: 'delete_sweep' },
    { label: 'Trace', path: '/trace/DT-F-0001', icon: 'account_tree' },
    { label: 'Analytics', path: '/analytics', icon: 'monitoring' },
    { label: 'Reports', path: '/reports', icon: 'description' },
  ];

  const accountNavItems = [
    { label: 'Profile', path: '/profile', icon: 'person' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    const basePath = path.split('/')[1];
    return location.pathname.startsWith(`/${basePath}`);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login', { replace: true });
  };

  const roleLabel = {
    FOOD_PROVIDER: 'Food Provider',
    NGO: 'NGO',
    ADMIN: 'Administrator',
  }[user?.role] || 'DigiTrace User';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto border-r border-surface-container-low`}>
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between bg-surface-container-lowest border-b border-surface-container-low shrink-0">
            <Link to="/dashboard" className="flex items-center gap-space-sm">
              <Logo className="h-8 w-8 shrink-0" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">DigiTrace</span>
                <span className="font-label-sm text-label-sm text-primary leading-none font-semibold">Food Waste & Rescue</span>
              </div>
            </Link>
            <button 
              className="md:hidden p-1 text-on-surface-variant hover:text-on-surface" 
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-space-lg px-space-md my-space-md">
            {/* MAIN Group */}
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold px-3 py-1">
                MAIN
              </span>
              {mainNavItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-space-sm px-3 py-2 rounded-lg font-label-md text-label-md transition-colors ${
                      active
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* ACCOUNT Group */}
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold px-3 py-1">
                ACCOUNT
              </span>
              {accountNavItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-space-sm px-3 py-2 rounded-lg font-label-md text-label-md transition-colors ${
                      active
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-space-md bg-surface-container-lowest border-t border-surface-container-low shrink-0">
          <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
            <Link to="/profile" className="flex items-center gap-space-sm flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 font-bold">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-md text-label-md text-on-surface truncate font-bold">{user?.name || user?.email || 'DigiTrace User'}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{roleLabel}</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-space-xs text-on-surface-variant hover:text-error hover:bg-surface-container-high rounded transition-colors shrink-0"
              title="Log out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
