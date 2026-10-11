import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function FoodWasteAnalytics() {
  const { records, rescueRequests } = useFoodRecords();

  const {
    totalSurplusKg,
    totalRescuedKg,
    totalMeals,
    co2AvoidedKg,
    categoryData
  } = useMemo(() => {
    const surplus = records.reduce((sum, r) => sum + (parseFloat(r.surplus) || 0), 0);
    const rescued = rescueRequests
      .filter((rq) => ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(rq.status))
      .reduce((sum, rq) => sum + (parseFloat(rq.requestedKg) || 0), 0) || surplus;

    const meals = Math.round(rescued * 2.4);
    const co2 = (rescued * 2.2).toFixed(1);

    // Group surplus by category
    const catMap = {};
    records.forEach((r) => {
      const cat = r.foodCategory || 'Other';
      if (!catMap[cat]) catMap[cat] = 0;
      catMap[cat] += parseFloat(r.surplus) || 0;
    });

    const catData = Object.entries(catMap).map(([category, weight]) => ({
      category,
      weight: parseFloat(weight.toFixed(1)),
      portions: Math.round(weight * 2.4)
    }));

    return {
      totalSurplusKg: surplus,
      totalRescuedKg: rescued,
      totalMeals: meals,
      co2AvoidedKg: co2,
      categoryData: catData
    };
  }, [records, rescueRequests]);

  return (
    <AppLayout pageTitle="Impact Analytics" breadcrumbs={[{ label: 'Impact Analytics' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-1 pb-4 border-b border-[#E6E2D8]">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
            Food Rescue & Impact Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5550]">
            Overview of redirected surplus food volumes, community meal deliveries, and environmental savings.
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] font-bold text-[#4A5550] uppercase tracking-wider">Total Surplus Listed</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#1B4D3E]">{totalSurplusKg.toFixed(1)}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg</span>
            </div>
            <span className="text-xs text-[#065F46] font-semibold">Ready or delivered</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] font-bold text-[#4A5550] uppercase tracking-wider">Rescued by NGOs</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#0284C7]">{totalRescuedKg.toFixed(1)}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg</span>
            </div>
            <span className="text-xs text-[#0284C7] font-semibold">Active claim fulfillment</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] font-bold text-[#4A5550] uppercase tracking-wider">Meals Provided</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#D97706]">~{totalMeals}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">meals</span>
            </div>
            <span className="text-xs text-[#92400E] font-semibold">Community dining support</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] font-bold text-[#4A5550] uppercase tracking-wider">Methane Mitigated</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#15803D]">{co2AvoidedKg}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg CO2e</span>
            </div>
            <span className="text-xs text-[#15803D] font-semibold">Avoided landfill decay</span>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
            <div>
              <h3 className="text-base font-bold text-[#1C2421]">Surplus by Food Category</h3>
              <p className="text-xs text-[#4A5550]">Kilograms rescued by food type across the DigiTrace network</p>
            </div>
            <span className="text-xs font-bold text-[#1B4D3E] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
              Category Analysis
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D8" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#4A5550' }} />
                <YAxis tick={{ fontSize: 11, fill: '#4A5550' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C2421', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="weight" fill="#1B4D3E" radius={[6, 6, 0, 0]} name="Weight (kg)" />
                <Bar dataKey="portions" fill="#52796F" radius={[6, 6, 0, 0]} name="Portions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
