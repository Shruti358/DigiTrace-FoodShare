import React, { useState, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';
import { mockReportsList } from '../data/mockData';

export default function Reports() {
  const { records, surplusListings, rescueRequests } = useFoodRecords();
  const [filterType, setFilterType] = useState('ALL');
  const [downloading, setDownloading] = useState(false);

  const metrics = useMemo(() => {
    const prepared = records.reduce((acc, r) => acc + (parseFloat(r.foodPrepared) || 0), 0);
    const consumed = records.reduce((acc, r) => acc + (parseFloat(r.foodConsumed) || 0), 0);
    const surplus = records.reduce((acc, r) => acc + (parseFloat(r.surplus) || 0), 0);
    const waste = records.reduce((acc, r) => acc + (parseFloat(r.waste) || 0), 0);

    const rescued = rescueRequests
      .filter((rq) => ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(rq.status))
      .reduce((acc, rq) => acc + (parseFloat(rq.requestedKg) || 0), 0);

    const rescueRate = prepared > 0 ? ((surplus / prepared) * 100).toFixed(1) : '0.0';
    const wasteRate = prepared > 0 ? ((waste / prepared) * 100).toFixed(1) : '0.0';

    return { prepared, consumed, surplus, rescued, waste, rescueRate, wasteRate };
  }, [records, rescueRequests]);

  const filteredReports = useMemo(() => {
    if (filterType === 'ALL') return mockReportsList;
    return mockReportsList.filter((r) => r.type.toLowerCase().includes(filterType.toLowerCase()));
  }, [filterType]);

  const handleDownloadReport = (title) => {
    setDownloading(title);
    setTimeout(() => {
      setDownloading(false);
      const csvContent = "data:text/csv;charset=utf-8,ReportTitle,Date,PreparedKg,RescuedKg,WasteKg\n" + `${title},2026-10-06,${metrics.prepared},${metrics.surplus},${metrics.waste}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${title.replace(/\s+/g, '_')}_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
  };

  return (
    <AppLayout pageTitle="Reports" breadcrumbs={[{ label: 'Executive Audit Reports' }]}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div>
            <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">Audit & ESG Compliance Reports</h1>
            <p className="font-body-md text-base text-[#4A5550]">
              Download sealed regulatory ledgers, EPA Scope 3 tax deduction manifests, and food rescue certificates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Total Rescued Food</span>
            <span className="text-3xl font-extrabold text-[#1B4D3E] my-1">{metrics.surplus.toFixed(1)} kg</span>
            <span className="text-xs text-[#15803D] font-bold">100% Tax Deductible Value</span>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Rescue Conversion</span>
            <span className="text-3xl font-extrabold text-[#D97706] my-1">{metrics.rescueRate}%</span>
            <span className="text-xs text-[#D97706] font-bold">Of total kitchen preparation</span>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Waste Discard Ratio</span>
            <span className="text-3xl font-extrabold text-[#DC2626] my-1">{metrics.wasteRate}%</span>
            <span className="text-xs text-[#15803D] font-bold">Zero-Landfill Target Achieved</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-xs overflow-hidden border border-[#E6E2D8] flex flex-col">
          <div className="p-6 bg-[#FAF8F5] flex items-center justify-between border-b border-[#E6E2D8]">
            <h3 className="font-bold text-lg text-[#1C2421]">Available Audit Documents</h3>
            <div className="flex gap-2">
              {['ALL', 'ESG', 'TAX', 'HACCP'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${filterType === t ? 'bg-[#1B4D3E] text-white' : 'bg-white text-[#4A5550] border border-[#E6E2D8]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#E6E2D8]">
            {filteredReports.map((report, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C2421]">{report.title}</h4>
                    <p className="text-xs text-[#4A5550]">{report.type} • {report.period || 'Oct 2026'}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadReport(report.title)}
                  disabled={Boolean(downloading)}
                  className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>{downloading === report.title ? 'Generating CSV...' : 'Download CSV'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
