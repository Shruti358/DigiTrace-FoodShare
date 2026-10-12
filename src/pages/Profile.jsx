import React from 'react';
import AppLayout from '../components/AppLayout';

export default function Profile() {
  return (
    <AppLayout pageTitle="User Profile" breadcrumbs={[{ label: 'Profile' }]}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1 pb-4 border-b border-[#E6E2D8]">
          <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">User Profile & Roles</h1>
          <p className="font-body-md text-base text-[#4A5550]">
            Personnel credentials, station assignments, and audit authorization permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* User Card */}
          <div className="lg:col-span-4 p-8 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col items-center text-center gap-4 card-hover">
            <div className="w-24 h-24 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold shadow-md">
              <span className="material-symbols-outlined text-[48px]">person</span>
            </div>
            <div>
              <h2 className="font-bold text-xl text-[#1C2421]">Shruti Sharma</h2>
              <p className="font-bold text-xs text-[#15803D] mt-0.5">Kitchen Operations Lead</p>
              <p className="text-xs text-[#4A5550] mt-1">shruti@pacificrim-dining.org</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold border border-[#A7F3D0]">
              Authorized Personnel #402
            </span>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-8 p-8 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
            <h3 className="font-bold text-lg text-[#1C2421] border-b border-[#E6E2D8] pb-3">Station & Access Rights</h3>
            
            <div className="flex flex-col gap-3 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#4A5550]">Primary Workstation:</span>
                <span className="font-bold text-[#1B4D3E]">Station #4 Line Alpha (Scale Hub)</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#4A5550]">Organization:</span>
                <span className="font-bold text-[#1C2421]">Pacific Rim Culinary Center</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#4A5550]">Audit Signing Privilege:</span>
                <span className="font-bold text-[#0284C7]">ISO-14001 Level 2 Inspector</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#4A5550]">Rescue Handoff Authorization:</span>
                <span className="font-bold text-[#15803D]">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
