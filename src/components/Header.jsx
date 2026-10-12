import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ pageTitle = "Operational Floor", breadcrumbs = [], setMobileOpen }) {
  const { user } = useAuth();
  const nameParts = user?.name?.trim().split(/\s+/) || [];
  const userLabel = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1][0]}.` : nameParts[0] || 'DigiTrace User';

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
      <div className="flex items-center gap-space-md">
        <button
          className="md:hidden p-space-xs text-on-surface-variant hover:text-on-surface"
          onClick={() => setMobileOpen && setMobileOpen(true)}
          aria-label="Open Navigation Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
          <Link to="/dashboard" className="hover:text-on-surface transition-colors cursor-pointer">
            Operational Floor
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-on-surface transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-on-surface font-label-lg text-label-lg font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
          {breadcrumbs.length === 0 && (
            <>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-label-lg text-label-lg font-medium">{pageTitle}</span>
            </>
          )}
        </nav>

        {/* Live Scale Banner Chip */}
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Live Scale Ingestion</span>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        {/* Search */}
        <div className="relative hidden lg:flex items-center">
          <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-[18px]">search</span>
          <input
            className="h-9 pl-9 pr-14 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
            placeholder="Search food lots, audits, logs..."
            type="text"
          />
          <kbd className="absolute right-space-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">⌘K</kbd>
        </div>

        {/* Notifications */}
        <button
          className="relative p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
        </button>

        {/* User Profile Direct Link */}
        <Link to="/profile" className="flex items-center gap-space-sm pl-space-xs hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <span className="hidden xl:block font-label-md text-label-md text-on-surface font-medium">{userLabel}</span>
        </Link>
      </div>
    </header>
  );
}
