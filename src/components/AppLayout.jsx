import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, pageTitle, breadcrumbs }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="md:pl-64">
        <Header pageTitle={pageTitle} breadcrumbs={breadcrumbs} setMobileOpen={setMobileOpen} />
        <main className="relative pt-16 w-full px-gutter bg-surface min-h-screen">
          <div className="flex flex-col w-full pb-space-2xl space-y-space-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
