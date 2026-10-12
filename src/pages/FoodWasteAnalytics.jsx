import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

const PIE_COLORS = ['#1B4D3E', '#D97706', '#DC2626', '#0284C7', '#7E22CE', '#16A34A'];

export default function FoodWasteAnalytics() {
  const [timeRange, setTimeRange] = useState('Month');
  const { records, wasteLogs, surplusListings, rescueRequests } = useFoodRecords();

  // Dynamic Metrics Calculations
  const {
    totalPrepared,
    totalConsumed,
    totalSurplus,
    totalWaste,
    totalRescued,
    totalDistributed,
    yieldRate,
    rescueRate,
    discardRatio,
    landfillAvoidance,
    purchasingAvoided,
    taxCredit,
    totalSavings
  } = useMemo(() => {
    const prep = records.reduce((acc, r) => acc + (parseFloat(r.foodPrepared) || 0), 0);
    const cons = records.reduce((acc, r) => acc + (parseFloat(r.foodConsumed) || 0), 0);
    const surp = records.reduce((acc, r) => acc + (parseFloat(r.surplus) || 0), 0);
    const wst = records.reduce((acc, r) => acc + (parseFloat(r.waste) || 0), 0);

    const rsc = rescueRequests
      .filter((rq) => ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(rq.status))
      .reduce((acc, rq) => acc + (parseFloat(rq.requestedKg) || 0), 0);

    const dist = rescueRequests
      .filter((rq) => ['Distributed', 'Completed'].includes(rq.status))
      .reduce((acc, rq) => acc + (parseFloat(rq.requestedKg) || 0), 0);

    const yRate = prep > 0 ? (cons / prep) * 100 : 0;
    const rRate = prep > 0 ? (surp / prep) * 100 : 0;
    const dRatio = prep > 0 ? (wst / prep) * 100 : 0;
    const lAvoid = prep > 0 ? ((cons + surp) / prep) * 100 : 0;

    const pAvoided = surp * 5.2 + cons * 0.8;
    const tCred = surp * 4.5;
    const totalImpact = pAvoided + tCred;

    return {
      totalPrepared: prep,
      totalConsumed: cons,
      totalSurplus: surp,
      totalWaste: wst,
      totalRescued: rsc,
      totalDistributed: dist,
      yieldRate: yRate.toFixed(1),
      rescueRate: rRate.toFixed(1),
      discardRatio: dRatio.toFixed(1),
      landfillAvoidance: lAvoid.toFixed(1),
      purchasingAvoided: pAvoided.toFixed(2),
      taxCredit: tCred.toFixed(2),
      totalSavings: totalImpact.toFixed(2)
    };
  }, [records, rescueRequests]);

  // 1. Food Category Breakdown
  const categoryAnalysisData = useMemo(() => {
    const catMap = {};
    records.forEach((r) => {
      const cat = r.foodCategory || 'Other';
      if (!catMap[cat]) {
        catMap[cat] = { category: cat, Prepared: 0, Consumed: 0, Surplus: 0, Waste: 0 };
      }
      catMap[cat].Prepared += parseFloat(r.foodPrepared) || 0;
      catMap[cat].Consumed += parseFloat(r.foodConsumed) || 0;
      catMap[cat].Surplus += parseFloat(r.surplus) || 0;
      catMap[cat].Waste += parseFloat(r.waste) || 0;
    });
    return Object.values(catMap);
  }, [records]);

  // 2. Rescued vs Wasted Data
  const rescuedVsWastedData = useMemo(() => [
    { name: 'Rescued Surplus Food', weight: totalSurplus, fill: '#1B4D3E' },
    { name: 'Organic Discard Waste', weight: totalWaste, fill: '#DC2626' }
  ], [totalSurplus, totalWaste]);

  // 3. Waste by Reason Breakdown Data
  const wasteByReasonData = useMemo(() => {
    const causeMap = {};
    wasteLogs.forEach((w) => {
      const reason = w.cause || w.type || 'Prep Loss';
      causeMap[reason] = (causeMap[reason] || 0) + (parseFloat(w.weight) || 0);
    });
    if (Object.keys(causeMap).length === 0) {
      records.forEach((r) => {
        if (r.waste > 0) {
          const reason = `${r.foodCategory} Scrap`;
          causeMap[reason] = (causeMap[reason] || 0) + r.waste;
        }
      });
    }
    return Object.entries(causeMap).map(([name, value]) => ({ name, value }));
  }, [wasteLogs, records]);

  return (
    <AppLayout pageTitle="Analytics" breadcrumbs={[{ label: 'Executive Analytics' }]}>
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div>
            <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">Food Waste & Rescue Analytics</h1>
            <p className="font-body-md text-base text-[#4A5550]">
              Data-driven executive insights calculated live from food records, marketplace listings, and NGO rescue claims.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/ecological-intelligence"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-label-lg font-bold transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>Ecological Intelligence</span>
            </Link>
          </div>
        </div>

        {/* 4 Dynamic KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Total Prepared Volume</span>
            <span className="text-3xl font-black text-[#1C2421] my-2">{totalPrepared.toFixed(1)} kg</span>
            <span className="text-xs text-[#15803D] font-bold">{records.length} Kitchen Batches Logged</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Patron Yield Rate</span>
            <span className="text-3xl font-black text-[#15803D] my-2">{yieldRate}%</span>
            <span className="text-xs text-[#15803D] font-bold">{totalConsumed.toFixed(1)} kg Consumed</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Surplus Rescued Rate</span>
            <span className="text-3xl font-black text-[#D97706] my-2">{rescueRate}%</span>
            <span className="text-xs text-[#D97706] font-bold">{totalSurplus.toFixed(1)} kg Rescued</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Net Discard Ratio</span>
            <span className="text-3xl font-black text-[#DC2626] my-2">{discardRatio}%</span>
            <span className="text-xs text-[#15803D] font-bold">{landfillAvoidance}% Landfill Avoided</span>
          </div>
        </div>

        {/* 2 Column Layout: Rescued vs Wasted & Waste by Cause */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart 1: Rescued vs Wasted */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
            <div className="border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-[#1C2421]">Rescued Food vs. Wasted Food</h3>
                <p className="text-xs text-[#4A5550]">Surplus diverted to NGOs vs organic discard</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full">
                LIVE BALANCE
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rescuedVsWastedData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D8" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4A5550' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#4A5550' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1C2421', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="weight" radius={[6, 6, 0, 0]} name="Weight (kg)">
                    {rescuedVsWastedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Waste by Reason Pie Chart */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
            <div className="border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-[#1C2421]">Waste Stream Reasons</h3>
                <p className="text-xs text-[#4A5550]">Share of discards by root cause</p>
              </div>
              <span className="text-xs font-mono text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full font-bold">
                ROOT CAUSE
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteByReasonData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {wasteByReasonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1C2421', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
          <div className="border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-lg font-bold text-[#1C2421]">Food Category Mass Balance</h3>
              <p className="text-xs text-[#4A5550]">Category level yield, surplus, and waste metrics</p>
            </div>
            <span className="text-xs font-bold text-[#1B4D3E]">
              {categoryAnalysisData.length} Categories Monitored
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAnalysisData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D8" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#4A5550' }} />
                <YAxis tick={{ fontSize: 11, fill: '#4A5550' }} />
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

      </div>
    </AppLayout>
  );
}
