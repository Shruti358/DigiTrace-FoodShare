import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';
import { mockDashboardMetrics } from '../data/mockData';

export default function WasteTracking() {
  const navigate = useNavigate();
  const { wasteLogs, records } = useFoodRecords();
  const metrics = mockDashboardMetrics;

  const totalWasteDivertedKg = wasteLogs.reduce((sum, w) => sum + (parseFloat(w.weight) || 0), 0) || records.reduce((sum, r) => sum + (parseFloat(r.waste) || 0), 0);
  const co2eAvoided = (totalWasteDivertedKg * 2.2).toFixed(1);

  // Waste Cause Data
  const wasteReasonData = [
    { cause: 'Over-Preparation', weight: 42.5, fill: '#DC2626' },
    { cause: 'Prep Inedibles', weight: 28.0, fill: '#D97706' },
    { cause: 'Trimming/Scraps', weight: 18.5, fill: '#0284C7' },
    { cause: 'Expiration/Storage', weight: 12.0, fill: '#7E22CE' }
  ];

  return (
    <AppLayout pageTitle="Waste Tracking" breadcrumbs={[{ label: 'Waste Tracking' }]}>
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] font-label-sm text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
              <span>DISCARD TELEMETRY & CAUSE LEDGER</span>
            </div>
            <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">Understand Where Food Waste Happens</h1>
            <p className="font-body-md text-base text-[#4A5550] mt-1">
              Real-time station discard monitoring, root-cause analysis, and zero-landfill organic stream routing.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/add-food-record')}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-label-lg font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Log Waste Record</span>
            </button>
          </div>
        </div>

        {/* Waste Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Total Discarded Waste</span>
            <span className="text-3xl font-black text-[#DC2626] my-2">{totalWasteDivertedKg.toFixed(1)} kg</span>
            <span className="text-xs text-[#15803D] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">eco</span> 98.2% Landfill Diversion Rate
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Avoidable Waste</span>
            <span className="text-3xl font-black text-[#D97706] my-2">{(totalWasteDivertedKg * 0.65).toFixed(1)} kg</span>
            <span className="text-xs text-[#D97706] font-bold">Over-production & buffet excess</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Unavoidable Waste</span>
            <span className="text-3xl font-black text-[#0284C7] my-2">{(totalWasteDivertedKg * 0.35).toFixed(1)} kg</span>
            <span className="text-xs text-[#0284C7]">Inedible prep peels, bones & scraps</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">CO2e Emissions Avoided</span>
            <span className="text-3xl font-black text-[#15803D] my-2">{co2eAvoided} kg</span>
            <span className="text-xs text-[#15803D] font-bold">EPA Scope 3 Methane Verified</span>
          </div>
        </div>

        {/* Chart & Waste Reduction Insight Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
            <div className="border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-[#1C2421]">Waste Causes Breakdown</h3>
                <p className="text-xs text-[#4A5550]">Primary causes recorded at prep station scales</p>
              </div>
              <span className="text-xs font-mono text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-full font-bold">
                SCALE: {metrics.scaleId}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteReasonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D8" />
                  <XAxis dataKey="cause" tick={{ fontSize: 11, fill: '#4A5550' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#4A5550' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1C2421', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="weight" radius={[6, 6, 0, 0]} name="Weight (kg)" fill="#DC2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Reduction Insight Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#1C2421] to-[#2D3834] text-white shadow-md border border-[#16A34A] flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-extrabold self-start">
                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                <span>WASTE REDUCTION INSIGHT</span>
              </div>

              <h3 className="font-bold text-xl text-white mt-1">
                Over-preparation is driving 65% of daily food discards.
              </h3>
              
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Most waste is currently coming from over-preparation during the weekday lunch service. Implementing batch-cooking adjustments on Line Alpha could save up to <strong>28.5 kg</strong> per week.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/15 flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-[#DCFCE7]">
                <span>Target Waste Reduction:</span>
                <span className="font-bold">-15% by next audit</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Recommended Action:</span>
                <span className="font-bold text-white">Adjust batch size to 35 portions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Discard Telemetry Table */}
        <div className="rounded-2xl bg-white shadow-xs overflow-hidden border border-[#E6E2D8] flex flex-col">
          <div className="p-6 bg-[#FAF8F5] flex items-center justify-between border-b border-[#E6E2D8]">
            <h3 className="font-headline-sm text-lg text-[#1C2421] font-bold">Discard Telemetry Stream</h3>
            <span className="font-mono text-xs text-[#4A5550]">AUDIT HASH: 8F2A-09</span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse font-body-md text-sm">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#4A5550] font-label-sm text-xs uppercase tracking-wider border-b border-[#E6E2D8]">
                  <th className="py-3.5 px-6">Log ID</th>
                  <th className="py-3.5 px-6">Item Description</th>
                  <th className="py-3.5 px-6">Station</th>
                  <th className="py-3.5 px-6 text-right">Weight</th>
                  <th className="py-3.5 px-6">Root Cause</th>
                  <th className="py-3.5 px-6">Handling Stream</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8] font-body-md text-[#1C2421]">
                {wasteLogs.map((log) => (
                  <tr key={log.logId} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-[#1B4D3E]">{log.logId}</td>
                    <td className="py-3.5 px-6 font-bold">{log.item}</td>
                    <td className="py-3.5 px-6 text-xs text-[#4A5550]">{log.station}</td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-[#DC2626]">{log.weight} kg</td>
                    <td className="py-3.5 px-6 text-xs text-[#4A5550]">{log.cause}</td>
                    <td className="py-3.5 px-6 text-xs font-bold text-[#1C2421]">{log.stream}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${log.statusBg || 'bg-gray-100 text-gray-800'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => navigate(`/trace/${log.recordId || 'DT-F-0001'}`)}
                        className="px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E6E2D8] text-xs font-bold border border-[#E6E2D8] text-[#1C2421]"
                      >
                        Trace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
