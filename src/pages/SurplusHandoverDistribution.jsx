import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function SurplusHandoverDistribution() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { rescueRequests, markPickedUp, confirmReceived, recordDistribution } = useFoodRecords();

  const req = rescueRequests.find((r) => r.requestId === requestId || r.recordId === requestId || r.surplusId === requestId) || rescueRequests[0];

  const [perspective, setPerspective] = useState('donor'); // donor | ngo
  const [simulatedStep, setSimulatedStep] = useState(
    req.status === 'Pending' ? 1 :
    req.status === 'Pickup Scheduled' ? 3 :
    req.status === 'Picked Up' ? 4 :
    req.status === 'Received' ? 5 :
    req.status === 'Distributed' ? 6 :
    req.status === 'Completed' ? 7 : 4
  );

  const handleSimulateStepChange = (stepNum) => {
    setSimulatedStep(stepNum);
    if (stepNum === 4 && req.status !== 'Picked Up') {
      markPickedUp(req.requestId);
    } else if (stepNum === 5 && req.status !== 'Received') {
      confirmReceived(req.requestId, 'Intake verification completed.');
    } else if ((stepNum === 6 || stepNum === 7) && req.status !== 'Completed') {
      recordDistribution(req.requestId, req.estimatedMeals, 'Meal service distributed to community.');
    }
  };

  const steps = [
    { num: 1, title: '1. Requested', sub: 'Verified Claim', icon: 'assignment' },
    { num: 2, title: '2. Accepted', sub: 'Donor Auth', icon: 'check_circle' },
    { num: 3, title: '3. Scheduled', sub: 'Dock Access Window', icon: 'event' },
    { num: 4, title: '4. Picked Up', sub: 'Courier Loading Bay', icon: 'local_shipping' },
    { num: 5, title: '5. Received', sub: 'NGO Intake Dock #1', icon: 'inventory_2' },
    { num: 6, title: '6. Distributed', sub: 'Meal Service Log', icon: 'restaurant' },
    { num: 7, title: '7. Delivered', sub: 'Distribution Receipt', icon: 'verified_user' }
  ];

  return (
    <AppLayout pageTitle="Surplus Handover & Custody" breadcrumbs={[{ label: 'Surplus Marketplace', path: '/surplus-food' }, { label: 'Handover Studio' }]}>
      <div className="flex flex-col gap-8">
        
        {/* Top Control Hub */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#4A5550]">
                <span>Surplus Exchange</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-[#1B4D3E] font-bold">Surplus Handover & Custody Studio</span>
              </div>
              <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight mt-1">
                Handover & Cold Chain Custody Studio
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#4A5550]">View Mode:</span>
              <div className="inline-flex rounded-xl p-1 bg-[#F4F1E8] border border-[#E6E2D8]">
                <button
                  onClick={() => setPerspective('donor')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${perspective === 'donor' ? 'bg-white text-[#1B4D3E] shadow-xs' : 'text-[#4A5550]'}`}
                >
                  Donor View
                </button>
                <button
                  onClick={() => setPerspective('ngo')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${perspective === 'ngo' ? 'bg-white text-[#1B4D3E] shadow-xs' : 'text-[#4A5550]'}`}
                >
                  NGO View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Step Horizontal Custody Stepper */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Custody Progression Stepper</span>
            <span className="text-xs font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full">
              Requisition: {req.requestId}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {steps.map((s) => {
              const active = simulatedStep >= s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => handleSimulateStepChange(s.num)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    active ? 'bg-[#FAF8F5] border-[#16A34A]' : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#4A5550]">{s.num}</span>
                    <span className={`material-symbols-outlined text-[16px] ${active ? 'text-[#15803D]' : 'text-gray-400'}`}>{s.icon}</span>
                  </div>
                  <span className="font-bold text-xs text-[#1C2421] truncate">{s.title}</span>
                  <span className="text-[10px] text-[#4A5550] truncate">{s.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pass Details & Handoff Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#1C2421]">{req.surplusTitle}</h3>
                <p className="text-xs text-[#4A5550]">Claimed by <strong>{req.ngoName}</strong> • Requested: {req.requestedKg} kg (~{req.estimatedMeals} meals)</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold">
                Dock Code: #{req.dockAccessCode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                <span className="text-[10px] text-[#4A5550] uppercase font-bold block">Pickup Window</span>
                <span className="font-bold text-sm text-[#1C2421]">{req.pickupWindow}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                <span className="text-[10px] text-[#4A5550] uppercase font-bold block">Courier Vehicle</span>
                <span className="font-bold text-sm text-[#1C2421]">{req.courier}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#DCFCE7] text-[#15803D] border border-[#A7F3D0] text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>Cold chain probe verified &lt; 38°F. Handoff authorized under Good Samaritan Food Donation Act.</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] text-[#1B4D3E] flex items-center justify-center mx-auto border border-[#E6E2D8]">
              <span className="material-symbols-outlined text-[32px]">qr_code_2</span>
            </div>
            <div>
              <h4 className="font-bold text-base text-[#1C2421]">Dock Pass Code</h4>
              <p className="font-mono text-xl font-extrabold text-[#1B4D3E] mt-1">{req.dockAccessCode}</p>
              <p className="text-xs text-[#4A5550] mt-1">Scan at Loading Dock #2 terminal for gate release.</p>
            </div>
            <button onClick={() => navigate(`/trace/${req.recordId || 'DT-F-0001'}`)} className="w-full py-2.5 bg-[#1B4D3E] text-white rounded-xl text-xs font-bold hover:bg-[#155E3D]">
              Inspect Full Audit Trail
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
