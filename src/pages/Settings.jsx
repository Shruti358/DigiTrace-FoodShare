import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';

export default function Settings() {
  const [scaleIp, setScaleIp] = useState('192.168.1.104');
  const [autoTare, setAutoTare] = useState(true);
  const [auditMode, setAuditMode] = useState('ISO-14001');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout pageTitle="Settings" breadcrumbs={[{ label: 'Settings' }]}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1 pb-4 border-b border-[#E6E2D8]">
          <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">System & Telemetry Settings</h1>
          <p className="font-body-md text-base text-[#4A5550]">
            Configure connected scale hardware, telemetry network parameters, and regulatory compliance presets.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-[#DCFCE7] text-[#15803D] font-bold text-xs shadow-xs flex items-center gap-2 border border-[#A7F3D0]">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>System configuration updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
            <h2 className="font-bold text-lg text-[#1C2421] border-b border-[#E6E2D8] pb-3">IoT Scale Telemetry Configuration</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Connected Scale Station</label>
                <input
                  type="text"
                  value="Scale Station #STN-04 (Line Alpha)"
                  disabled
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] text-[#1C2421] opacity-70 cursor-not-allowed border border-[#E6E2D8]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Scale IP Address / Serial</label>
                <input
                  type="text"
                  value={scaleIp}
                  onChange={(e) => setScaleIp(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
              <div>
                <span className="font-bold text-xs text-[#1C2421] block">Automatic Container Tare</span>
                <span className="text-[11px] text-[#4A5550]">Deduct standard 0.45kg bin weight automatically on weigh-in</span>
              </div>
              <input
                type="checkbox"
                checked={autoTare}
                onChange={(e) => setAutoTare(e.target.checked)}
                className="w-5 h-5 rounded text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C2421] mb-1">Compliance Audit Protocol</label>
              <select
                value={auditMode}
                onChange={(e) => setAuditMode(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] text-[#1C2421] text-xs font-bold border border-[#E6E2D8]"
              >
                <option value="ISO-14001">ISO 14001 Environmental Management</option>
                <option value="SB-1383">California SB 1383 Organic Waste Mandate</option>
                <option value="EPA-Scope3">EPA Scope 3 Methane Diversion Standard</option>
              </select>
            </div>

            <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold hover:bg-[#155E3D] shadow-xs self-start">
              Save System Settings
            </button>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-4">
            <h3 className="font-bold text-base text-[#1C2421] border-b border-[#E6E2D8] pb-3">System Status</h3>
            <div className="flex flex-col gap-2 text-xs text-[#4A5550]">
              <div className="flex justify-between py-1 border-b border-[#E6E2D8]">
                <span>DigiTrace Version:</span>
                <strong className="text-[#1C2421] font-mono">v4.2.0-STITCH</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E6E2D8]">
                <span>Scale Connection:</span>
                <strong className="text-[#15803D]">Connected (12ms)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Local Buffer Status:</span>
                <strong className="text-[#1C2421]">Synced (0 pending)</strong>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
