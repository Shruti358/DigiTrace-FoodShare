import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function WasteRecordDetailsTrace() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const { records, rescueRequests, getSelectedTraceDetails, setSelectedRecordId } = useFoodRecords();

  const activeId = recordId || 'DT-F-0001';
  const trace = getSelectedTraceDetails();

  // Find record object
  const record = records.find((r) => r.recordId === activeId) || records[0];
  const req = rescueRequests.find((rq) => rq.recordId === record.recordId || rq.surplusId === record.recordId);

  // Pathway Toggle: 'rescue' or 'waste'
  const [activePath, setActivePath] = useState(record.surplus > 0 ? 'rescue' : 'waste');

  const rescueSteps = [
    { phase: '1. PREPARATION', title: 'Food Prepared & Logged', desc: `${record.itemName} prepared (${record.foodPrepared} kg). Station: ${record.station}.`, time: `${record.date} ${record.time || '11:30 AM'}`, icon: 'skillet' },
    { phase: '2. CONSUMPTION', title: 'Kitchen Service & Consumption', desc: `Consumed: ${record.foodConsumed} kg (${Math.round((record.foodConsumed / record.foodPrepared) * 100)}% yield rate). Surplus identified: ${record.surplus} kg.`, time: `${record.date} 12:00 PM`, icon: 'restaurant' },
    { phase: '3. SURPLUS IDENTIFIED & LISTED', title: 'HACCP Staging & Marketplace Listing', desc: `Packaged in stainless GN food pans. Published to DigiTrace Surplus Network with 3h safety window.`, time: `${record.date} 12:30 PM`, icon: 'storefront' },
    { phase: '4. REQUESTED', title: req ? `Claimed by ${req.ngoName}` : 'NGO Requisition Claim', desc: req ? `Requested ${req.requestedKg} kg (~${req.estimatedMeals} meals) for ${req.purpose}.` : 'Requisition claim received from verified 501(c)(3) NGO.', time: req ? req.requestTime : 'Pending', icon: 'volunteer_activism' },
    { phase: '5. ACCEPTED & PICKUP SCHEDULED', title: 'Donor Dock Authorization', desc: req ? `Donor authorized claim. Dock pass code ${req.dockAccessCode} issued for ${req.pickupWindow}.` : 'Awaiting donor authorization.', time: 'Pickup Scheduled', icon: 'event' },
    { phase: '6. PICKED UP', title: 'Courier Handoff & Dispatch', desc: 'Refrigerated van loaded at Loading Dock #2. Temperature probe audit logged.', time: 'En Route', icon: 'local_shipping' },
    { phase: '7. RECEIVED', title: 'NGO Intake Confirmation', desc: 'Received at community dining facility. Temperature and seal integrity verified.', time: req ? (req.receivedTime || 'Received') : 'Intake', icon: 'markunread_mailbox' },
    { phase: '8. DISTRIBUTED & COMPLETED', title: 'Community Meal Service Outcome', desc: `${req ? req.distributedMeals || req.estimatedMeals : Math.round(record.surplus * 2.4)} meals served. EPA SB 1383 landfill avoidance ledger sealed.`, time: 'Completed', icon: 'sentiment_very_satisfied' }
  ];

  const wasteSteps = [
    { phase: '1. PREPARATION', title: 'Food Prepared & Logged', desc: `${record.itemName} prepared (${record.foodPrepared} kg). Station: ${record.station}.`, time: `${record.date} ${record.time || '11:30 AM'}`, icon: 'skillet' },
    { phase: '2. CONSUMPTION', title: 'Service & Remaining Portion', desc: `Consumed: ${record.foodConsumed} kg. Remaining surplus/scrap identified.`, time: `${record.date} 01:00 PM`, icon: 'restaurant' },
    { phase: '3. WASTE IDENTIFIED', title: 'IoT Scale Ingestion & Tare Audit', desc: `Inedible prep scrap / loss recorded: ${record.waste} kg. Cause: Overproduction / Prep Inedibles.`, time: `${record.date} 01:30 PM`, icon: 'scale' },
    { phase: '4. WASTE STREAM SEGREGATION', title: 'Contamination Sorting & Stream Tagging', desc: 'Organic waste segregated into Aerobic Digester Bin #4.', time: `${record.date} 02:00 PM`, icon: 'delete_sweep' },
    { phase: '5. WASTE MANAGEMENT HANDOFF', title: 'Handoff to Municipal Bio-Digester', desc: 'Transported to regional anaerobic facility for biogas capture and compost creation.', time: `${record.date} 03:30 PM`, icon: 'local_shipping' },
    { phase: '6. FINAL OUTCOME', title: 'EPA Scope 3 Methane Diversion Sealed', desc: `Mitigated ${(record.waste * 1.8).toFixed(1)} kg CO2e emissions. Digital audit ledger sealed.`, time: 'Sealed', icon: 'verified' }
  ];

  const currentTimeline = activePath === 'rescue' ? rescueSteps : wasteSteps;

  return (
    <AppLayout pageTitle="Food Lifecycle Traceability" breadcrumbs={[{ label: 'Traceability', path: '/food-records' }, { label: activeId }]}>
      <div className="flex flex-col gap-8">
        
        {/* Header & Record Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#0284C7] px-3 py-1 rounded-full bg-[#E0F2FE]">
                Record ID: {activeId}
              </span>
              <span className="font-mono text-xs font-bold text-[#15803D] px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#A7F3D0]">
                Audit Hash: {trace.auditHash}
              </span>
            </div>

            <h1 className="font-headline-lg text-2xl font-extrabold text-[#1C2421] tracking-tight">
              Food Lifecycle & Chain of Custody Trace
            </h1>

            <p className="font-body-md text-sm text-[#4A5550]">
              Item: <strong>{record.itemName}</strong> | Prepared: <strong>{record.foodPrepared} kg</strong> | Consumed: <strong>{record.foodConsumed} kg</strong> | Surplus: <strong className="text-[#1B4D3E]">{record.surplus} kg</strong> | Waste: <strong className="text-[#DC2626]">{record.waste} kg</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <select
              value={activeId}
              onChange={(e) => {
                setSelectedRecordId(e.target.value);
                navigate(`/trace/${e.target.value}`);
              }}
              className="h-10 px-4 rounded-xl bg-[#FAF8F5] text-[#1C2421] font-body-sm text-xs font-bold border border-[#E6E2D8] focus:outline-none cursor-pointer"
            >
              {records.map((r) => (
                <option key={r.recordId} value={r.recordId}>
                  {r.recordId} - {r.itemName} ({r.surplus > 0 ? `Surplus: ${r.surplus}kg` : `Waste: ${r.waste}kg`})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dual Path Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#E6E2D8]">
            <button
              onClick={() => setActivePath('rescue')}
              className={`px-5 py-2 rounded-xl font-label-md text-xs font-bold transition-all flex items-center gap-2 ${
                activePath === 'rescue' ? 'bg-[#1B4D3E] text-white shadow-xs' : 'text-[#4A5550] hover:text-[#1C2421]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
              <span>Food Rescue Journey Path</span>
              {record.surplus > 0 && <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold">{record.surplus} kg</span>}
            </button>

            <button
              onClick={() => setActivePath('waste')}
              className={`px-5 py-2 rounded-xl font-label-md text-xs font-bold transition-all flex items-center gap-2 ${
                activePath === 'waste' ? 'bg-[#DC2626] text-white shadow-xs' : 'text-[#4A5550] hover:text-[#1C2421]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              <span>Waste Stream Path</span>
              {record.waste > 0 && <span className="px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold">{record.waste} kg</span>}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#4A5550]">
            <span>Landfill Avoidance: <strong className="text-[#15803D]">{trace.landfillAvoidancePct}%</strong></span>
            <span>•</span>
            <span>CO2e Mitigated: <strong className="text-[#15803D]">{trace.co2eMitigatedKg} kg</strong></span>
          </div>
        </div>

        {/* Mass Balance Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <span className="font-label-sm text-xs font-bold text-[#4A5550] uppercase tracking-wider block mb-2">Mass Balance Breakdown</span>
          
          <div className="h-6 w-full rounded-full overflow-hidden flex bg-[#FAF8F5] border border-[#E6E2D8]">
            <div
              style={{ width: `${(record.foodConsumed / record.foodPrepared) * 100}%` }}
              className="bg-[#16A34A] h-full text-white text-[11px] font-bold flex items-center justify-center transition-all"
            >
              Consumed {Math.round((record.foodConsumed / record.foodPrepared) * 100)}%
            </div>
            {record.surplus > 0 && (
              <div
                style={{ width: `${(record.surplus / record.foodPrepared) * 100}%` }}
                className="bg-[#D97706] h-full text-white text-[11px] font-bold flex items-center justify-center transition-all"
              >
                Surplus {Math.round((record.surplus / record.foodPrepared) * 100)}%
              </div>
            )}
            {record.waste > 0 && (
              <div
                style={{ width: `${(record.waste / record.foodPrepared) * 100}%` }}
                className="bg-[#DC2626] h-full text-white text-[11px] font-bold flex items-center justify-center transition-all"
              >
                Waste {Math.round((record.waste / record.foodPrepared) * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Vertical Connected Lifecycle Timeline */}
        <div className="bg-white p-8 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-4">
            <h2 className="font-headline-sm text-xl font-extrabold text-[#1C2421]">
              {activePath === 'rescue' ? 'Food Rescue Chain of Custody Timeline' : 'Waste Diversion & Bio-Digester Audit Timeline'}
            </h2>
            <span className="font-mono text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full">
              EPA SB 1383 VERIFIED
            </span>
          </div>

          <div className="flex flex-col gap-6 relative before:absolute before:left-5 before:top-6 before:bottom-6 before:w-1 before:bg-[#E6E2D8]">
            {currentTimeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 relative z-10 pl-1">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                  activePath === 'rescue' ? 'bg-[#1B4D3E] text-white' : 'bg-[#DC2626] text-white'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                </div>

                <div className="flex-1 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E6E2D8] flex flex-col gap-1 hover:border-[#1B4D3E] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-xs font-extrabold uppercase text-[#D97706]">{step.phase}</span>
                    <span className="font-mono text-xs text-[#4A5550]">{step.time}</span>
                  </div>
                  <h4 className="font-headline-sm text-base font-bold text-[#1C2421] mt-0.5">{step.title}</h4>
                  <p className="font-body-sm text-xs text-[#4A5550] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
