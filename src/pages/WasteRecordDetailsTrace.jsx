import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function WasteRecordDetailsTrace() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const { records, rescueRequests, surplusListings, setSelectedRecordId } = useFoodRecords();

  const activeId = recordId || 'DT-F-0001';

  // Find record, listing, and rescue request
  const record = records.find((r) => r.recordId === activeId) || records[0];
  const req = rescueRequests.find((rq) => rq.recordId === record.recordId || rq.surplusId === record.recordId);
  const listing = surplusListings.find((s) => s.recordId === record.recordId || s.id === record.recordId);

  // Status mapping
  const currentStatus = req ? req.status : record.status;

  // Determine which milestone steps are completed
  const isRequested = Boolean(req || ['Requested', 'Pickup Scheduled', 'Picked Up', 'Received', 'Distributed', 'Completed'].includes(currentStatus));
  const isAccepted = Boolean(req && ['Pickup Scheduled', 'Picked Up', 'Received', 'Distributed', 'Completed'].includes(currentStatus));
  const isPickedUp = Boolean(req && ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(currentStatus));
  const isReceived = Boolean(req && ['Received', 'Distributed', 'Completed'].includes(currentStatus));
  const isDistributed = Boolean(req && ['Distributed', 'Completed'].includes(currentStatus));

  // Timestamped Milestones Timeline
  const traceEvents = [
    {
      step: 1,
      title: "Listed for Donation",
      party: listing ? listing.provider : "Food Provider",
      time: `${record.date} at ${record.time || '10:00 AM'}`,
      description: `${record.itemName} (${record.surplus || record.foodPrepared} kg, ~${Math.round((record.surplus || record.foodPrepared) * 2.4)} portions) prepared and published to DigiTrace.`,
      status: "Completed",
      isDone: true,
      icon: "storefront"
    },
    {
      step: 2,
      title: "Rescue Claim Submitted",
      party: req ? req.ngoName : "Partner NGO",
      time: req ? req.requestTime : `${record.date} at 11:30 AM`,
      description: req ? `Claimed ${req.requestedKg} kg (~${req.estimatedMeals} portions) for: ${req.purpose}.` : "Awaiting request from accredited NGO partner.",
      status: isRequested ? "Completed" : "Pending",
      isDone: isRequested,
      icon: "volunteer_activism"
    },
    {
      step: 3,
      title: "Request Accepted & Scheduled",
      party: listing ? listing.provider : "Food Provider",
      time: req ? `Pickup Window: ${req.pickupWindow}` : "Pending Scheduling",
      description: isAccepted ? `Pickup confirmed. Dock pass issued for designated collection window.` : "Donor review and scheduling pending.",
      status: isAccepted ? "Completed" : "Pending",
      isDone: isAccepted,
      icon: "event"
    },
    {
      step: 4,
      title: "Courier / Volunteer Pickup",
      party: req ? (req.courier || "NGO Transport") : "Transport",
      time: isPickedUp ? "Handoff Verified" : "Pending Pickup",
      description: isPickedUp ? "Food collected from donor loading bay. Cold chain verification completed." : "Awaiting courier arrival.",
      status: isPickedUp ? "Completed" : "Pending",
      isDone: isPickedUp,
      icon: "local_shipping"
    },
    {
      step: 5,
      title: "Delivered & Received",
      party: req ? req.ngoName : "Intake Facility",
      time: isReceived ? (req.receivedTime || "Today") : "Pending Delivery",
      description: isReceived ? `Intake verified at recipient community facility. Safe condition confirmed.` : "Awaiting arrival at recipient dining hall.",
      status: isReceived ? "Completed" : "Pending",
      isDone: isReceived,
      icon: "markunread_mailbox"
    },
    {
      step: 6,
      title: "Community Meal Distribution",
      party: req ? req.ngoName : "Dining Program",
      time: isDistributed ? "Completed" : "Pending Service",
      description: isDistributed ? `Served ${req ? (req.distributedMeals || req.estimatedMeals) : 22} warm meals to community beneficiaries.` : "Pending distribution during meal service.",
      status: isDistributed ? "Completed" : "Pending",
      isDone: isDistributed,
      icon: "sentiment_very_satisfied"
    }
  ];

  const statusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      case 'Requested':
        return 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
      case 'Pickup Scheduled':
      case 'Accepted':
        return 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]';
      case 'Picked Up':
        return 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]';
      case 'Received':
      case 'Completed':
      case 'Distributed':
        return 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const quantityKg = record.surplus > 0 ? record.surplus : record.foodPrepared;
  const mealsCount = Math.round(quantityKg * 2.4);

  return (
    <AppLayout pageTitle="Food Tracking" breadcrumbs={[{ label: 'Food Tracking' }, { label: activeId }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header & Record Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0284C7] px-2.5 py-0.5 rounded-full bg-[#E0F2FE]">
                ID: {activeId}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge(currentStatus)}`}>
                {currentStatus}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C2421] tracking-tight">
              Food Rescue Traceability Timeline
            </h1>

            <p className="text-xs sm:text-sm text-[#4A5550]">
              Transparent milestone tracking from kitchen donation to community meal service.
            </p>
          </div>

          {/* Quick Record Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-[#78857E] hidden sm:block">Inspect Batch:</label>
            <select
              value={activeId}
              onChange={(e) => {
                setSelectedRecordId(e.target.value);
                navigate(`/trace/${e.target.value}`);
              }}
              className="h-10 px-3 rounded-xl bg-[#FAF8F5] text-xs font-bold text-[#1C2421] border border-[#E6E2D8] focus:outline-none cursor-pointer"
            >
              {records.map((r) => (
                <option key={r.recordId} value={r.recordId}>
                  {r.recordId} — {r.itemName} ({r.surplus || r.foodPrepared} kg)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Donation Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#78857E] uppercase font-bold">Food Item</span>
            <span className="text-sm font-bold text-[#1C2421] mt-0.5">{record.itemName}</span>
            <span className="text-xs text-[#52796F]">{record.foodCategory}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-[#78857E] uppercase font-bold">Quantity & Meals</span>
            <span className="text-sm font-bold text-[#1B4D3E] mt-0.5">{quantityKg} kg</span>
            <span className="text-xs text-[#4A5550]">~{mealsCount} meal portions</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-[#78857E] uppercase font-bold">Donor Provider</span>
            <span className="text-sm font-bold text-[#1C2421] mt-0.5">
              {listing ? listing.provider : "Pacific Rim Culinary Hub"}
            </span>
            <span className="text-xs text-[#4A5550]">{record.station || 'Dock #2'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-[#78857E] uppercase font-bold">Recipient NGO</span>
            <span className="text-sm font-bold text-[#0284C7] mt-0.5">
              {req ? req.ngoName : "Awaiting Claim"}
            </span>
            <span className="text-xs text-[#4A5550]">
              {req ? req.purpose : "Community meal relief"}
            </span>
          </div>
        </div>

        {/* Milestone Timeline Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E2D8]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1C2421]">Milestone Progress</h2>
              <p className="text-xs text-[#4A5550]">Sequential events recorded across the food rescue journey</p>
            </div>

            <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
              Step-by-Step Chain of Custody
            </span>
          </div>

          <div className="relative flex flex-col gap-6 sm:gap-8 before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-[#E6E2D8]">
            {traceEvents.map((evt) => (
              <div key={evt.step} className="relative flex items-start gap-4 sm:gap-6">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-xs border-2 ${
                    evt.isDone
                      ? 'bg-[#1B4D3E] text-white border-white'
                      : 'bg-white text-[#78857E] border-[#E6E2D8]'
                  }`}
                >
                  {evt.isDone ? (
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  ) : (
                    evt.step
                  )}
                </div>

                {/* Event Card Content */}
                <div
                  className={`flex-1 p-4 sm:p-5 rounded-2xl border transition-all ${
                    evt.isDone
                      ? 'bg-white border-[#E6E2D8] shadow-xs'
                      : 'bg-[#FAF8F5]/60 border-[#E6E2D8]/80 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1C2421]">{evt.title}</span>
                      <span className="text-xs text-[#52796F] font-semibold">• {evt.party}</span>
                    </div>
                    <span className="text-xs text-[#78857E] font-medium">{evt.time}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4A5550] mt-1 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-[#78857E] uppercase">Community Impact</span>
            <div className="my-2">
              <span className="text-2xl font-black text-[#1B4D3E]">~{mealsCount}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">Meals Provided</span>
            </div>
            <span className="text-xs text-[#065F46] font-semibold">
              Wholesome nourishment delivered
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-[#78857E] uppercase">Waste Diverted</span>
            <div className="my-2">
              <span className="text-2xl font-black text-[#0284C7]">{quantityKg}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg Saved</span>
            </div>
            <span className="text-xs text-[#0284C7] font-semibold">
              Zero organic waste to landfill
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-[#78857E] uppercase">Estimated CO2e Mitigated</span>
            <div className="my-2">
              <span className="text-2xl font-black text-[#15803D]">{(quantityKg * 2.2).toFixed(1)}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1">kg CO2e</span>
            </div>
            <span className="text-xs text-[#15803D] font-semibold">
              Estimated @ 2.2 kg CO2e / kg food
            </span>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
