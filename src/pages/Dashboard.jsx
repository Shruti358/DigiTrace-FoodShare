import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { records, surplusListings, rescueRequests } = useFoodRecords();
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic calculations based on centralized context state
  const {
    totalPrepared,
    totalConsumed,
    totalSurplus,
    totalRescued,
    totalDistributed,
    totalWaste,
    pendingNgoRequests,
    consumedPct,
    surplusPct,
    wastePct,
    co2eMitigated
  } = useMemo(() => {
    const prep = records.reduce((sum, r) => sum + (parseFloat(r.foodPrepared) || 0), 0);
    const cons = records.reduce((sum, r) => sum + (parseFloat(r.foodConsumed) || 0), 0);
    const surp = records.reduce((sum, r) => sum + (parseFloat(r.surplus) || 0), 0);
    const wst = records.reduce((sum, r) => sum + (parseFloat(r.waste) || 0), 0);

    const rsc = rescueRequests
      .filter((rq) => ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(rq.status))
      .reduce((sum, rq) => sum + (parseFloat(rq.requestedKg) || 0), 0);

    const dist = rescueRequests
      .filter((rq) => ['Distributed', 'Completed'].includes(rq.status))
      .reduce((sum, rq) => sum + (parseFloat(rq.requestedKg) || 0), 0);

    const pendingReqs = rescueRequests.filter((rq) => rq.status === 'Pending').length;

    const cPct = prep > 0 ? (cons / prep) * 100 : 0;
    const sPct = prep > 0 ? (surp / prep) * 100 : 0;
    const wPct = prep > 0 ? (wst / prep) * 100 : 0;
    const co2 = (wst * 3.6 + surp * 1.8);

    return {
      totalPrepared: prep,
      totalConsumed: cons,
      totalSurplus: surp,
      totalRescued: rsc,
      totalDistributed: dist,
      totalWaste: wst,
      pendingNgoRequests: pendingReqs,
      consumedPct: cPct,
      surplusPct: sPct,
      wastePct: wPct,
      co2eMitigated: co2
    };
  }, [records, rescueRequests]);

  // Dynamic Chart Data aggregated by Date
  const dateTrendChartData = useMemo(() => {
    const dateMap = {};
    [...records].reverse().forEach((r) => {
      const d = r.date || 'Today';
      if (!dateMap[d]) {
        dateMap[d] = { date: d, Prepared: 0, Consumed: 0, Surplus: 0, Waste: 0 };
      }
      dateMap[d].Prepared += parseFloat(r.foodPrepared) || 0;
      dateMap[d].Consumed += parseFloat(r.foodConsumed) || 0;
      dateMap[d].Surplus += parseFloat(r.surplus) || 0;
      dateMap[d].Waste += parseFloat(r.waste) || 0;
    });
    return Object.values(dateMap);
  }, [records]);

  // Filter records for recent logs table
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      return (
        r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.recordId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.foodCategory && r.foodCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [records, searchQuery]);

  // Activity Timeline
  const recentActivities = [
    { title: "Restaurant listed 45.0 kg surplus chicken", time: "10:15 AM", step: "Listed", icon: "storefront", color: "bg-[#FEF3C7] text-[#D97706]" },
    { title: "Hope Harbor NGO requested 45.0 kg for dinner service", time: "10:42 AM", step: "Requested", icon: "volunteer_activism", color: "bg-[#E0F2FE] text-[#0284C7]" },
    { title: "Dock access pass code #DOCK-882 issued to courier", time: "11:10 AM", step: "Scheduled", icon: "qr_code", color: "bg-[#F3E8FF] text-[#7E22CE]" },
    { title: "Courier completed pickup at Loading Dock #2", time: "11:45 AM", step: "Picked Up", icon: "local_shipping", color: "bg-[#DCFCE7] text-[#15803D]" }
  ];

  return (
    <AppLayout pageTitle="Dashboard" breadcrumbs={[{ label: 'Executive Dashboard' }]}>
      <div className="flex flex-col gap-8">
        
        {/* Top Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div className="flex flex-col gap-1">
            <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">
              Good morning! Here's your food impact overview.
            </h1>
            <p className="font-body-md text-sm text-[#4A5550]">
              Real-time food waste management, rescue exchange network, and circular sustainability metrics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/add-food-record')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-label-lg font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Add Food Record</span>
            </button>
            <button
              onClick={() => navigate('/surplus-food')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-[#F4F1E8] text-[#1C2421] border border-[#E6E2D8] font-label-lg font-bold transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
              <span>Surplus Marketplace</span>
            </button>
          </div>
        </section>

        {/* 4 Impact Summary Cards - Visually Prominent Food Rescued Card */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Food Prepared */}
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Food Prepared</span>
              <div className="w-10 h-10 rounded-xl bg-[#F4F1E8] text-[#1C2421] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">skillet</span>
              </div>
            </div>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-[#1C2421]">{totalPrepared.toFixed(1)}</span>
              <span className="text-sm font-semibold text-[#4A5550] ml-1">kg</span>
            </div>
            <span className="text-xs text-[#4A5550] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#16A34A]">trending_up</span> 100% Kitchen Volume
            </span>
          </div>

          {/* Card 2: Food Rescued (PROMINENT HIGHLIGHT) */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1B4D3E] to-[#155E3D] text-white shadow-md border border-[#16A34A] flex flex-col justify-between card-hover relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-[#DCFCE7] uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                Food Rescued ★
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
              </div>
            </div>
            <div className="my-3">
              <span className="text-3xl font-black text-white">{totalRescued.toFixed(1)}</span>
              <span className="text-sm font-semibold text-[#DCFCE7] ml-1">kg</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#DCFCE7] font-bold">
              <span>{Math.round(totalRescued * 2.4)} Meals Served</span>
              <span className="px-2 py-0.5 rounded-full bg-[#22C55E] text-[#052E16] text-[11px]">Active Rescue</span>
            </div>
          </div>

          {/* Card 3: Food Waste */}
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Food Waste</span>
              <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
              </div>
            </div>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-[#DC2626]">{totalWaste.toFixed(1)}</span>
              <span className="text-sm font-semibold text-[#4A5550] ml-1">kg</span>
            </div>
            <span className="text-xs text-[#DC2626] font-bold">
              {wastePct.toFixed(1)}% Discard Ratio
            </span>
          </div>

          {/* Card 4: Active Rescue Listings */}
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Active Rescue Listings</span>
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
            </div>
            <div className="my-3">
              <span className="text-3xl font-extrabold text-[#D97706]">{surplusListings.length}</span>
              <span className="text-sm font-semibold text-[#4A5550] ml-1">Batches</span>
            </div>
            <span className="text-xs text-[#D97706] font-bold">
              {pendingNgoRequests} Pending NGO Claims
            </span>
          </div>
        </section>

        {/* Large Visual Section: Your Food Rescue Impact Chart & Timeline */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E2D8] pb-4">
              <div>
                <h3 className="font-headline-sm text-lg text-[#1C2421] font-extrabold">Your Food Rescue Impact</h3>
                <p className="font-body-sm text-xs text-[#4A5550]">Mass balance metrics: Prepared vs Consumed vs Surplus vs Waste</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-label-sm text-xs font-bold border border-[#A7F3D0]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                Live Audit Synced
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dateTrendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D8" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#4A5550' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#4A5550' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1C2421', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Prepared" fill="#1B4D3E" radius={[6, 6, 0, 0]} name="Prepared (kg)" />
                  <Bar dataKey="Consumed" fill="#16A34A" radius={[6, 6, 0, 0]} name="Consumed (kg)" />
                  <Bar dataKey="Surplus" fill="#D97706" radius={[6, 6, 0, 0]} name="Surplus (kg)" />
                  <Bar dataKey="Waste" fill="#DC2626" radius={[6, 6, 0, 0]} name="Waste (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Rescue Activity Timeline */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between gap-6">
            <div className="border-b border-[#E6E2D8] pb-4">
              <h3 className="font-headline-sm text-lg text-[#1C2421] font-extrabold">Recent Rescue Activity</h3>
              <p className="font-body-sm text-xs text-[#4A5550]">Real-time rescue lifecycle events</p>
            </div>

            <div className="flex flex-col gap-4">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${act.color} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[18px]">{act.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#1C2421]">{act.title}</span>
                    <span className="text-[11px] text-[#4A5550]">{act.time} • Step: {act.step}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E6E2D8]">
              <button onClick={() => navigate('/surplus-food')} className="w-full py-2.5 bg-[#FAF8F5] hover:bg-[#F4F1E8] text-[#1B4D3E] rounded-xl text-xs font-bold transition-colors">
                Explore Full Rescue Feed →
              </button>
            </div>
          </div>
        </section>

        {/* Recent Food & Rescue Ledger Table */}
        <section className="rounded-2xl bg-white shadow-xs overflow-hidden flex flex-col border border-[#E6E2D8]">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6E2D8]">
            <div>
              <h3 className="font-headline-sm text-lg text-[#1C2421] font-bold">Recent Food & Rescue Ledger</h3>
              <p className="font-body-sm text-xs text-[#4A5550]">Live audit entries synced from central context state.</p>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#4A5550] text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter logs by item or ID..."
                className="h-9 pl-9 pr-3 rounded-xl bg-[#FAF8F5] text-[#1C2421] placeholder:text-[#4A5550] font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-[#1B4D3E] border border-[#E6E2D8] w-48 sm:w-60"
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse font-body-md text-sm">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#4A5550] font-label-sm text-xs uppercase tracking-wider border-b border-[#E6E2D8]">
                  <th className="py-3.5 px-6">Record ID</th>
                  <th className="py-3.5 px-6">Item Name</th>
                  <th className="py-3.5 px-6 text-right">Prepared</th>
                  <th className="py-3.5 px-6 text-right">Consumed</th>
                  <th className="py-3.5 px-6 text-right">Surplus</th>
                  <th className="py-3.5 px-6 text-right">Waste</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8] font-body-md text-[#1C2421]">
                {filteredRecords.slice(0, 5).map((r) => (
                  <tr key={r.recordId} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-[#0284C7]">{r.recordId}</td>
                    <td className="py-3.5 px-6 font-bold">{r.itemName}</td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold">{r.foodPrepared} kg</td>
                    <td className="py-3.5 px-6 text-right font-mono text-[#15803D] font-bold">{r.foodConsumed} kg</td>
                    <td className="py-3.5 px-6 text-right font-mono text-[#D97706] font-bold">{r.surplus} kg</td>
                    <td className="py-3.5 px-6 text-right font-mono text-[#DC2626] font-bold">{r.waste} kg</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${r.statusBg || 'bg-gray-100 text-gray-800'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button onClick={() => navigate(`/trace/${r.recordId}`)} className="px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E6E2D8] text-xs font-bold border border-[#E6E2D8] text-[#1C2421]">
                        Trace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
