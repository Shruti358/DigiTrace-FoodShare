import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function IncomingRequests() {
  const navigate = useNavigate();
  const { rescueRequests, acceptRequest, rejectRequest } = useFoodRecords();

  const [activeTab, setActiveTab] = useState('All');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const [pickupWindowInput, setPickupWindowInput] = useState('02:30 PM - 03:30 PM');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('Holding window expired / allocated elsewhere.');

  // Filter requests
  const pendingRequests = rescueRequests.filter((r) => r.status === 'Pending');
  const acceptedRequests = rescueRequests.filter((r) => r.status === 'Pickup Scheduled' || r.status === 'Accepted');
  const activeDispatches = rescueRequests.filter((r) => r.status === 'Picked Up' || r.status === 'Received');
  const completedRequests = rescueRequests.filter((r) => r.status === 'Completed' || r.status === 'Distributed');

  const filteredList = rescueRequests.filter((r) => {
    if (activeTab === 'Pending') return r.status === 'Pending';
    if (activeTab === 'Scheduled') return r.status === 'Pickup Scheduled' || r.status === 'Accepted';
    if (activeTab === 'Completed') return r.status === 'Completed' || r.status === 'Distributed' || r.status === 'Received';
    return true;
  });

  const handleOpenAccept = (req) => {
    setSelectedReq(req);
    setPickupWindowInput(req.pickupWindow || '02:30 PM - 03:30 PM');
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = (e) => {
    e.preventDefault();
    if (selectedReq) {
      acceptRequest(selectedReq.requestId, pickupWindowInput);
    }
    setShowAcceptModal(false);
  };

  const handleOpenReject = (req) => {
    setSelectedReq(req);
    setShowRejectModal(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (selectedReq) {
      rejectRequest(selectedReq.requestId, rejectionReasonInput);
    }
    setShowRejectModal(false);
  };

  const statusBgMap = {
    Pending: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    'Pickup Scheduled': 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    'Picked Up': 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]',
    Received: 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]',
    Distributed: 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]',
    Completed: 'bg-gray-100 text-gray-800 border-gray-300',
    Rejected: 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <AppLayout pageTitle="Incoming Rescue Requests" breadcrumbs={[{ label: 'Surplus Marketplace', path: '/surplus-food' }, { label: 'Incoming Requests' }]}>
      <div className="flex flex-col gap-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-[#FAF8F5] text-[#1C2421] font-mono text-xs font-bold border border-[#E6E2D8]">NODE-04</span>
              <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-label-sm text-xs font-bold border border-[#A7F3D0]">
                Food Provider Console
              </span>
            </div>
            <h1 className="font-headline-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">Incoming Surplus & Rescue Claims</h1>
            <p className="font-body-md text-base text-[#4A5550]">
              Manage non-profit and food bank requests for prepared batches. Authorize dock passes and cold chain handoffs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => navigate('/surplus-food')} className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8] text-xs font-bold shadow-xs">
              View Available Listings
            </button>
          </div>
        </div>

        {/* 4 Operational KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Pending Approval</span>
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-[#D97706]">{pendingRequests.length}</span>
              <span className="text-xs text-[#4A5550] ml-1">Requisitions</span>
            </div>
            <span className="text-xs font-bold text-[#D97706]">Requires Donor Action</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Scheduled Pickups</span>
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">event</span>
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-[#0284C7]">{acceptedRequests.length}</span>
              <span className="text-xs text-[#4A5550] ml-1">Couriers En Route</span>
            </div>
            <span className="text-xs font-bold text-[#0284C7]">Dock Access Pass Active</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Active Dispatches</span>
              <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-[#7E22CE]">{activeDispatches.length}</span>
              <span className="text-xs text-[#4A5550] ml-1">Vehicles Tracked</span>
            </div>
            <span className="text-xs font-bold text-[#7E22CE]">Refrigerated Van Probe</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Completed Servings</span>
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-[#15803D]">{completedRequests.length}</span>
              <span className="text-xs text-[#4A5550] ml-1">Batches Handed Over</span>
            </div>
            <span className="text-xs font-bold text-[#15803D]">100% Tax Deductible</span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 bg-[#F4F1E8] p-1.5 rounded-2xl border border-[#E6E2D8] overflow-x-auto">
          {['All', 'Pending', 'Scheduled', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-white text-[#1C2421] shadow-xs' : 'text-[#4A5550] hover:text-[#1C2421]'
              }`}
            >
              {tab} Requests
            </button>
          ))}
        </div>

        {/* Claims Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((req) => (
            <div key={req.requestId} className="bg-white rounded-2xl p-6 shadow-xs border border-[#E6E2D8] flex flex-col justify-between gap-4 card-hover">
              <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0284C7]">{req.requestId}</span>
                  <span className="text-xs text-[#4A5550]">({req.requestTime})</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBgMap[req.status] || 'bg-gray-100'}`}>
                  {req.status}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg text-[#1C2421]">{req.surplusTitle}</h3>
                <p className="text-xs text-[#4A5550]">NGO Claim: <strong>{req.ngoName}</strong></p>
                <p className="text-xs text-[#4A5550]">Purpose: <i>"{req.purpose}"</i></p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] my-1">
                  <div>
                    <span className="text-[10px] text-[#4A5550] uppercase font-bold block">Requested Weight</span>
                    <span className="text-base font-extrabold text-[#1B4D3E]">{req.requestedKg} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A5550] uppercase font-bold block">Estimated Meals</span>
                    <span className="text-base font-extrabold text-[#D97706]">~{req.estimatedMeals} Meals</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between">
                <button onClick={() => navigate(`/handover/${req.requestId}`)} className="text-[#0284C7] font-bold text-xs hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">qr_code</span>
                  <span>Handover Pass</span>
                </button>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenReject(req)} className="px-3 py-1.5 rounded-xl bg-[#FEE2E2] text-[#DC2626] font-bold text-xs hover:bg-red-200">
                      Reject
                    </button>
                    <button onClick={() => handleOpenAccept(req)} className="px-4 py-1.5 rounded-xl bg-[#1B4D3E] text-white font-bold text-xs hover:bg-[#155E3D]">
                      Authorize Claim
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Accept Modal */}
        {showAcceptModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E6E2D8] flex flex-col gap-4">
              <h3 className="font-bold text-lg text-[#1C2421]">Authorize Rescue Requisition</h3>
              <p className="text-xs text-[#4A5550]">Assign dispatch staging window and generate dock access pass code for courier vehicle.</p>
              
              <form onSubmit={handleConfirmAccept} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Pickup Window</label>
                  <input
                    type="text"
                    value={pickupWindowInput}
                    onChange={(e) => setPickupWindowInput(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2D8]">
                  <button type="button" onClick={() => setShowAcceptModal(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#155E3D]">Issue Pass & Confirm</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
