import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function IncomingRequests() {
  const navigate = useNavigate();
  const { rescueRequests, acceptRequest, rejectRequest, markPickedUp } = useFoodRecords();

  const [activeTab, setActiveTab] = useState('All');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const [pickupWindowInput, setPickupWindowInput] = useState('Today, 02:30 PM - 03:30 PM');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('Safety window expired / batch reallocated.');

  const filteredList = rescueRequests.filter((r) => {
    if (activeTab === 'Pending') return r.status === 'Pending';
    if (activeTab === 'Scheduled') return r.status === 'Pickup Scheduled' || r.status === 'Accepted';
    if (activeTab === 'Completed') return ['Completed', 'Distributed', 'Received', 'Picked Up'].includes(r.status);
    return true;
  });

  const handleOpenAccept = (req) => {
    setSelectedReq(req);
    setPickupWindowInput(req.pickupWindow || 'Today, 02:30 PM - 03:30 PM');
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
    <AppLayout pageTitle="Incoming Requests" breadcrumbs={[{ label: 'My Donations', path: '/food-records' }, { label: 'Incoming Requests' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-[11px] font-bold border border-[#A7F3D0]">
                Food Provider Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
              Incoming Food Requests
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5550]">
              Review claim requests from accredited NGOs and shelters, assign pickup times, and authorize food handoffs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/food-records')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8] text-xs font-bold shadow-xs transition-colors"
            >
              My Donations
            </button>
            <button
              onClick={() => navigate('/add-food-record')}
              className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors"
            >
              + List Surplus Food
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E6E2D8] overflow-x-auto">
          {['All', 'Pending', 'Scheduled', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-[#1C2421] shadow-xs'
                  : 'text-[#4A5550] hover:text-[#1C2421]'
              }`}
            >
              {tab} Requests
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="flex flex-col gap-4">
          {filteredList.map((req) => (
            <div
              key={req.requestId}
              className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#1B4D3E] flex items-center justify-center shrink-0 font-bold">
                  <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
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
                    Requested by: <strong className="text-[#1C2421]">{req.ngoName}</strong> • {req.requestedKg} kg (~{req.estimatedMeals} meals)
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#78857E] mt-1">
                    <span>Purpose: <strong>{req.purpose}</strong></span>
                    <span>Pickup Window: <strong>{req.pickupWindow}</strong></span>
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

                {req.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleOpenReject(req)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] bg-white border border-[#E6E2D8] transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleOpenAccept(req)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1B4D3E] hover:bg-[#155E3D] shadow-xs transition-colors"
                    >
                      Accept Request
                    </button>
                  </>
                )}

                {req.status === 'Pickup Scheduled' && (
                  <button
                    onClick={() => markPickedUp(req.requestId)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#5B21B6] bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-colors"
                  >
                    Confirm Handoff (Picked Up)
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="p-12 rounded-2xl bg-white border border-dashed border-[#E6E2D8] text-center flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-[#78857E]">inbox</span>
              <p className="text-base font-bold text-[#1C2421]">No incoming requests in this tab</p>
              <p className="text-xs text-[#4A5550]">Incoming food claims from NGOs will show up here for your approval.</p>
            </div>
          )}
        </div>

        {/* Accept Modal */}
        {showAcceptModal && (
          <div className="fixed inset-0 bg-[#1C2421]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E6E2D8] max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in">
              <h3 className="text-base font-bold text-[#1C2421]">Accept Food Claim</h3>
              <p className="text-xs text-[#4A5550]">
                Authorize <strong>{selectedReq?.ngoName}</strong> to pick up {selectedReq?.requestedKg} kg of {selectedReq?.itemTitle}.
              </p>

              <form onSubmit={handleConfirmAccept} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Confirmed Pickup Window</label>
                  <input
                    type="text"
                    value={pickupWindowInput}
                    onChange={(e) => setPickupWindowInput(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E2D8]">
                  <button
                    type="button"
                    onClick={() => setShowAcceptModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#4A5550]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold"
                  >
                    Confirm & Schedule Pickup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-[#1C2421]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E6E2D8] max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in">
              <h3 className="text-base font-bold text-[#1C2421]">Decline Food Claim</h3>
              <p className="text-xs text-[#4A5550]">
                Provide a brief reason for declining this request so the NGO is notified.
              </p>

              <form onSubmit={handleConfirmReject} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Reason</label>
                  <textarea
                    rows={3}
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E2D8]">
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#4A5550]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold"
                  >
                    Confirm Decline
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
