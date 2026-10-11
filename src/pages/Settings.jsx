import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';

export default function Settings() {
  const [orgName, setOrgName] = useState('Pacific Rim Culinary Center & Banquets');
  const [pickupBay, setPickupBay] = useState('Loading Dock #2, North Service Bay');
  const [leadTime, setLeadTime] = useState('3 Hours');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pickupReminders, setPickupReminders] = useState(true);
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout pageTitle="Settings" breadcrumbs={[{ label: 'Settings' }]}>
      <div className="flex flex-col gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col gap-1 pb-4 border-b border-[#E6E2D8]">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
            Platform Preferences & Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5550]">
            Configure donation defaults, pickup instructions, and notification alerts for incoming NGO claims.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-2 text-xs font-bold shadow-xs">
            <span className="material-symbols-outlined text-[20px] text-[#10B981]">check_circle</span>
            <span>Settings updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
          {/* Section 1: Facility Defaults */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-[#1C2421] pb-2 border-b border-[#E6E2D8]">
              Donation & Facility Defaults
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Organization Display Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Default Pickup Location</label>
                <input
                  type="text"
                  value={pickupBay}
                  onChange={(e) => setPickupBay(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-[#1C2421] mb-1">Default Pickup Window Duration</label>
              <select
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                className="w-full sm:w-1/2 h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421] font-semibold focus:outline-none"
              >
                <option value="2 Hours">2 Hours Lead Time</option>
                <option value="3 Hours">3 Hours Lead Time (Standard)</option>
                <option value="4 Hours">4 Hours Lead Time</option>
                <option value="Same Day">Same Day Evening Window</option>
              </select>
            </div>
          </div>

          {/* Section 2: Notifications */}
          <div className="flex flex-col gap-4 pt-2">
            <h2 className="text-base font-bold text-[#1C2421] pb-2 border-b border-[#E6E2D8]">
              Rescue Network Notifications
            </h2>

            <div className="flex flex-col gap-3 text-xs">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] cursor-pointer hover:bg-[#FAF8F5]/80">
                <div>
                  <span className="font-bold text-[#1C2421] block">New NGO Claim Alerts</span>
                  <span className="text-[11px] text-[#4A5550]">Notify immediately when an NGO requests a surplus food batch</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-5 h-5 rounded text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] cursor-pointer hover:bg-[#FAF8F5]/80">
                <div>
                  <span className="font-bold text-[#1C2421] block">Pickup Arrival Reminders</span>
                  <span className="text-[11px] text-[#4A5550]">Alert 30 minutes before courier or volunteer arrival window</span>
                </div>
                <input
                  type="checkbox"
                  checked={pickupReminders}
                  onChange={(e) => setPickupReminders(e.target.checked)}
                  className="w-5 h-5 rounded text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] cursor-pointer hover:bg-[#FAF8F5]/80">
                <div>
                  <span className="font-bold text-[#1C2421] block">Freshness Deadline Warnings</span>
                  <span className="text-[11px] text-[#4A5550]">Send reminder 1 hour before safety holding window expires</span>
                </div>
                <input
                  type="checkbox"
                  checked={expirationAlerts}
                  onChange={(e) => setExpirationAlerts(e.target.checked)}
                  className="w-5 h-5 rounded text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-end pt-4 border-t border-[#E6E2D8]">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>

      </div>
    </AppLayout>
  );
}
