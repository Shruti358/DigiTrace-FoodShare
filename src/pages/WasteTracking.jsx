import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function WasteTracking() {
  const navigate = useNavigate();
  const { wasteLogs, records } = useFoodRecords();

  const totalWasteDivertedKg = wasteLogs.reduce((sum, w) => sum + (parseFloat(w.weight) || 0), 0) || records.reduce((sum, r) => sum + (parseFloat(r.waste) || 0), 0);
  const totalSurplusRescuedKg = records.reduce((sum, r) => sum + (parseFloat(r.surplus) || 0), 0);

  // Waste Reduction Cause Data
  const wasteReasonData = [
    { cause: 'Over-Preparation', weight: 42.5, fill: '#1B4D3E' },
    { cause: 'Prep Inedibles', weight: 28.0, fill: '#52796F' },
    { cause: 'Trimming/Scraps', weight: 18.5, fill: '#0284C7' },
    { cause: 'Storage Window', weight: 12.0, fill: '#D97706' }
  ];

  return (
    <AppLayout pageTitle="Waste Prevention" breadcrumbs={[{ label: 'Waste Prevention' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
              Food Waste Prevention & Diversion
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5550]">
              Track kitchen scrap diversion and identify preventable excess to channel surplus food into community donations.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/add-food-record')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Donate Surplus Food</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] text-[#4A5550] uppercase font-bold tracking-wider">Surplus Rescued</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#1B4D3E]">{totalSurplusRescuedKg.toFixed(1)}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg</span>
            </div>
            <span className="text-xs text-[#065F46] font-semibold">
              Redirected to partner NGOs
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] text-[#4A5550] uppercase font-bold tracking-wider">Organic Inedibles Diverted</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#0284C7]">{totalWasteDivertedKg.toFixed(1)}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg</span>
            </div>
            <span className="text-xs text-[#0284C7] font-semibold">
              Composted & bio-digested
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] text-[#4A5550] uppercase font-bold tracking-wider">Landfill Diversion Rate</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#15803D]">94.2%</span>
            </div>
            <span className="text-xs text-[#15803D] font-semibold">
              Zero organic waste to landfill
            </span>
          </div>
        </div>

        {/* Prevention Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
            <div>
              <h3 className="text-base font-bold text-[#1C2421]">Food Loss Root-Cause Breakdown</h3>
              <p className="text-xs text-[#4A5550]">Primary drivers of kitchen food scraps (Sample analysis)</p>
            </div>
            <span className="text-xs font-bold text-[#1B4D3E] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
              Prevention Insights
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteReasonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D8" />
                <XAxis dataKey="cause" tick={{ fontSize: 11, fill: '#4A5550' }} />
                <YAxis tick={{ fontSize: 11, fill: '#4A5550' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C2421', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }}
                  formatter={(val) => [`${val} kg`, 'Quantity']}
                />
                <Bar dataKey="weight" fill="#1B4D3E" radius={[6, 6, 0, 0]} name="Weight (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diversion Logs Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#E6E2D8] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#E6E2D8]">
            <h3 className="text-base font-bold text-[#1C2421]">Organic Diversion & Compost Log</h3>
            <p className="text-xs text-[#4A5550]">Record of prep trimmings channeled into composting or municipal animal feed</p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#4A5550] uppercase font-bold border-b border-[#E6E2D8]">
                  <th className="py-3 px-5">Log ID</th>
                  <th className="py-3 px-5">Item / Scrap Type</th>
                  <th className="py-3 px-5">Weight (kg)</th>
                  <th className="py-3 px-5">Diversion Stream</th>
                  <th className="py-3 px-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8] text-[#1C2421]">
                {wasteLogs.map((log) => (
                  <tr key={log.logId} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-5 font-mono text-[#0284C7] font-bold">{log.logId}</td>
                    <td className="py-3 px-5 font-bold">{log.item}</td>
                    <td className="py-3 px-5 font-extrabold text-[#1B4D3E]">{log.weight} kg</td>
                    <td className="py-3 px-5 text-[#4A5550]">{log.stream || 'Organic Compost'}</td>
                    <td className="py-3 px-5 text-[#78857E]">{log.date}</td>
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
