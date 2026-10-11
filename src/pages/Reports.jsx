import React, { useState, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function Reports() {
  const { records, rescueRequests } = useFoodRecords();
  const [downloading, setDownloading] = useState(false);

  const metrics = useMemo(() => {
    const surplusKg = records.reduce((acc, r) => acc + (parseFloat(r.surplus) || 0), 0);
    const wasteKg = records.reduce((acc, r) => acc + (parseFloat(r.waste) || 0), 0);

    const completedDonations = rescueRequests.filter((rq) =>
      ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(rq.status)
    ).length;

    const mealsCount = Math.round(surplusKg * 2.4);
    const co2eMitigated = (surplusKg * 2.2).toFixed(1);

    return { surplusKg, wasteKg, completedDonations, mealsCount, co2eMitigated };
  }, [records, rescueRequests]);

  const reportItems = [
    {
      id: "RPT-2026-001",
      title: "Monthly Food Rescue & Donation Summary",
      type: "Rescue Summary",
      period: "October 2026",
      desc: "Detailed ledger of all surplus food batches claimed by verified NGO recipients."
    },
    {
      id: "RPT-2026-002",
      title: "Community Meal Distribution Outcome Receipt",
      type: "NGO Receipt",
      period: "Q3 - Q4 2026",
      desc: "Record of portions delivered and served across community shelter dining programs."
    },
    {
      id: "RPT-2026-003",
      title: "Landfill Diversion & Organic Waste Reduction Report",
      type: "Impact Ledger",
      period: "Last 30 Days",
      desc: "Analysis of food waste prevented and kilograms of methane/CO2e emissions mitigated."
    },
    {
      id: "RPT-2026-004",
      title: "Food Donation Receipt for Tax Exemption Records",
      type: "Donation Manifest",
      period: "Fiscal Year 2026",
      desc: "Verified record of non-profit surplus donations for accounting and corporate CSR records."
    }
  ];

  const handleDownload = (report) => {
    setDownloading(report.id);
    setTimeout(() => {
      setDownloading(false);
      const csvContent =
        "data:text/csv;charset=utf-8,Report_ID,Report_Title,Period,Food_Rescued_kg,Estimated_Meals,CO2e_Mitigated_kg,Completed_Handoffs\n" +
        `${report.id},"${report.title}","${report.period}",${metrics.surplusKg},${metrics.mealsCount},${metrics.co2eMitigated},${metrics.completedDonations}\n`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${report.title.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 400);
  };

  return (
    <AppLayout pageTitle="Impact & Reports" breadcrumbs={[{ label: 'Impact & Reports' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-1 pb-4 border-b border-[#E6E2D8]">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
            Impact Summary & Rescue Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5550]">
            Export verified donation receipts, community impact ledgers, and waste reduction certificates.
          </p>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] font-bold text-[#4A5550] uppercase tracking-wider">Total Food Rescued</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#1B4D3E]">{metrics.surplusKg.toFixed(1)}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg</span>
            </div>
            <span className="text-xs text-[#065F46] font-semibold">Redirected from waste</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] font-bold text-[#4A5550] uppercase tracking-wider">Community Meals</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#D97706]">~{metrics.mealsCount}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">meals</span>
            </div>
            <span className="text-xs text-[#92400E] font-semibold">Delivered to shelters</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] font-bold text-[#4A5550] uppercase tracking-wider">Completed Donations</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#0284C7]">{metrics.completedDonations}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">handoffs</span>
            </div>
            <span className="text-xs text-[#0284C7] font-semibold">Verified NGO receipts</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-[11px] font-bold text-[#4A5550] uppercase tracking-wider">CO2e Emissions Avoided</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#15803D]">{metrics.co2eMitigated}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg</span>
            </div>
            <span className="text-xs text-[#15803D] font-semibold">Avoided landfill methane</span>
          </div>
        </div>

        {/* Reports Download List */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#E6E2D8] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#E6E2D8] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1C2421]">Available Impact Documents</h3>
              <p className="text-xs text-[#4A5550]">Download certified CSV receipts for accounting and social impact verification</p>
            </div>
          </div>

          <div className="divide-y divide-[#E6E2D8]">
            {reportItems.map((rpt) => (
              <div key={rpt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#1B4D3E] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1C2421]">{rpt.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#52796F] border border-[#E6E2D8]">
                        {rpt.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A5550]">{rpt.desc}</p>
                    <span className="text-[11px] text-[#78857E] mt-0.5">Period: {rpt.period}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(rpt)}
                  disabled={downloading === rpt.id}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1B4D3E] border border-[#E6E2D8] text-xs font-bold shadow-xs transition-colors self-start sm:self-auto shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>{downloading === rpt.id ? 'Generating...' : 'Export CSV'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
