import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function MyRequests() {
  const navigate = useNavigate();
  const { rescueRequests, confirmReceived, recordDistribution } = useFoodRecords();

  const [activeTab, setActiveTab] = useState('All');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const [receiveNotesInput, setReceiveNotesInput] = useState('Food inspected and verified intact in clean containers.');
  const [mealsServedInput, setMealsServedInput] = useState('30');
  const [distributionNotesInput, setDistributionNotesInput] = useState('Served hot to shelter beneficiaries during dinner service.');

  const handleOpenReceive = (req) => {
    setSelectedReq(req);
    setShowReceiveModal(true);
  };

  const handleConfirmReceive = (e) => {
    e.preventDefault();
    if (selectedReq) {
      confirmReceived(selectedReq.requestId, receiveNotesInput);
    }
    setShowReceiveModal(false);
  };

  const handleOpenDistribute = (req) => {
    setSelectedReq(req);
    setMealsServedInput(req.estimatedMeals ? req.estimatedMeals.toString() : '30');
    setShowDistributeModal(true);
  };

  const handleConfirmDistribute = (e) => {
    e.preventDefault();
    if (selectedReq) {
      recordDistribution(selectedReq.requestId, parseInt(mealsServedInput) || selectedReq.estimatedMeals, distributionNotesInput);
    }
    setShowDistributeModal(false);
  };

  const filteredRequests = rescueRequests.filter((r) => {
    if (activeTab === 'Pending') return r.status === 'Pending';
    if (activeTab === 'In Progress') return ['Pickup Scheduled', 'Picked Up'].includes(r.status);
    if (activeTab === 'Received') return r.status === 'Received';
    if (activeTab === 'Completed') return ['Completed', 'Distributed'].includes(r.status);
    return true;
  });

  const statusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
      case 'Pickup Scheduled':
      case 'Accepted':
        return 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]';
      case 'Picked Up':
        return 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]';
      case 'Received':
        return 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]';
      case 'Completed':
      case 'Distributed':
        return 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <AppLayout pageTitle="My Requests" breadcrumbs={[{ label: 'My Requests' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F0F9FF] text-[#0369A1] text-[11px] font-bold border border-[#BAE6FD]">
                Recipient & NGO Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
              My Food Rescue Claims
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5550]">
              Track your NGO's claimed food donations, coordinate pickup schedules, verify safe receipt, and record community distribution.
            </p>
          </div>

          <button
            onClick={() => navigate('/surplus-food')}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>+ Find More Food</span>
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E6E2D8] overflow-x-auto">
          {['All', 'Pending', 'In Progress', 'Received', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-[#1C2421] shadow-xs'
                  : 'text-[#4A5550] hover:text-[#1C2421]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Request Cards */}
        <div className="flex flex-col gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.requestId}
              className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#1B4D3E] flex items-center justify-center shrink-0 font-bold">
                  <span className="material-symbols-outlined text-[20px]">assignment</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0284C7]">{req.requestId}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge(req.status)}`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-[#78857E]">• {req.requestTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#1C2421]">{req.itemTitle}</h3>

                  <p className="text-xs text-[#4A5550]">
                    Donor: <strong className="text-[#1C2421]">{req.provider}</strong> • {req.requestedKg} kg (~{req.estimatedMeals} meals)
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#78857E] mt-1">
                    <span>Pickup Window: <strong>{req.pickupWindow}</strong></span>
                    {req.distributedMeals && (
                      <span className="text-[#166534] font-bold">✓ {req.distributedMeals} Meals Served</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#E6E2D8]">
                <button
                  onClick={() => navigate(`/trace/${req.recordId || 'DT-F-0001'}`)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#4A5550] hover:text-[#1C2421] bg-[#FAF8F5] border border-[#E6E2D8]"
                >
                  Trace
                </button>

                {req.status === 'Picked Up' && (
                  <button
                    onClick={() => handleOpenReceive(req)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D655E] shadow-xs transition-colors"
                  >
                    Confirm Delivery (Received)
                  </button>
                )}

                {req.status === 'Received' && (
                  <button
                    onClick={() => handleOpenDistribute(req)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1B4D3E] hover:bg-[#155E3D] shadow-xs transition-colors"
                  >
                    Record Meals Distributed
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="p-12 rounded-2xl bg-white border border-dashed border-[#E6E2D8] text-center flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-[#78857E]">search_off</span>
              <p className="text-base font-bold text-[#1C2421]">No requests in this category</p>
              <p className="text-xs text-[#4A5550]">Browse the surplus food directory to request batches for your community.</p>
              <button
                onClick={() => navigate('/surplus-food')}
                className="px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold rounded-xl mt-2"
              >
                Find Surplus Food
              </button>
            </div>
          )}
        </div>

        {/* Confirm Received Modal */}
        {showReceiveModal && (
          <div className="fixed inset-0 bg-[#1C2421]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E6E2D8] max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in">
              <h3 className="text-base font-bold text-[#1C2421]">Confirm Delivery Receipt</h3>
              <p className="text-xs text-[#4A5550]">
                Verify that <strong>{selectedReq?.itemTitle}</strong> has safely arrived at your intake facility.
              </p>

              <form onSubmit={handleConfirmReceive} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Receipt & Quality Notes</label>
                  <textarea
                    rows={3}
                    value={receiveNotesInput}
                    onChange={(e) => setReceiveNotesInput(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E2D8]">
                  <button
                    type="button"
                    onClick={() => setShowReceiveModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#4A5550]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D655E] text-white text-xs font-bold"
                  >
                    Confirm Intake
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Record Distribution Modal */}
        {showDistributeModal && (
          <div className="fixed inset-0 bg-[#1C2421]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E6E2D8] max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in">
              <h3 className="text-base font-bold text-[#1C2421]">Record Meal Distribution</h3>
              <p className="text-xs text-[#4A5550]">
                Log the community meal outcome for <strong>{selectedReq?.itemTitle}</strong>.
              </p>

              <form onSubmit={handleConfirmDistribute} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Total Meals Served to Community</label>
                  <input
                    type="number"
                    value={mealsServedInput}
                    onChange={(e) => setMealsServedInput(e.target.value)}
                    required
                    min="1"
                    className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Distribution Notes</label>
                  <textarea
                    rows={3}
                    value={distributionNotesInput}
                    onChange={(e) => setDistributionNotesInput(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E2D8]">
                  <button
                    type="button"
                    onClick={() => setShowDistributeModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#4A5550]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold"
                  >
                    Complete & Seal Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
