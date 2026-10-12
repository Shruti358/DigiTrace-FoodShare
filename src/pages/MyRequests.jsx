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

  const [receiveNotesInput, setReceiveNotesInput] = useState('Intact GN 1/1 containers received in cold chain storage.');
  const [mealsServedInput, setMealsServedInput] = useState('45');
  const [distributionNotesInput, setDistributionNotesInput] = useState('Served hot to shelter residents during evening meal service.');

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
    setMealsServedInput(req.estimatedMeals || '30');
    setShowDistributeModal(true);
  };

  const handleConfirmDistribute = (e) => {
    e.preventDefault();
    if (selectedReq) {
      recordDistribution(selectedReq.requestId, parseInt(mealsServedInput), distributionNotesInput);
    }
    setShowDistributeModal(false);
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

  const filteredRequests = rescueRequests.filter((r) => {
    if (activeTab === 'Active') return r.status === 'Pending' || r.status === 'Pickup Scheduled' || r.status === 'Picked Up';
    if (activeTab === 'Received') return r.status === 'Received';
    if (activeTab === 'Completed') return r.status === 'Completed' || r.status === 'Distributed';
    return true;
  });

  return (
    <AppLayout pageTitle="My Surplus Food Requests" breadcrumbs={[{ label: 'Surplus Marketplace', path: '/surplus-food' }, { label: 'My Requests' }]}>
      <div className="flex flex-col gap-8">
        
        {/* Top NGO Context Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
              </div>
              <div>
                <h1 className="font-headline-lg text-2xl font-extrabold text-[#1C2421] tracking-tight">My Surplus Food Requests</h1>
                <p className="font-body-md text-sm text-[#4A5550]">
                  Track claims, dispatch courier pickups, manage custody handoffs, and record meal distribution outcomes for your non-profit organization.
                </p>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/surplus-food')} className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-bold text-xs shadow-xs shrink-0">
            + Request More Surplus
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 bg-[#F4F1E8] p-1.5 rounded-2xl border border-[#E6E2D8] overflow-x-auto">
          {['All', 'Active', 'Received', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-white text-[#1C2421] shadow-xs' : 'text-[#4A5550] hover:text-[#1C2421]'
              }`}
            >
              {tab} Requests ({rescueRequests.length})
            </button>
          ))}
        </div>

        {/* Requisition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
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
                <p className="text-xs text-[#4A5550]">Organization: <strong>{req.ngoName}</strong></p>
                <p className="text-xs text-[#4A5550]">Purpose: <i>"{req.purpose}"</i></p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] my-1">
                  <div>
                    <span className="text-[10px] text-[#4A5550] uppercase font-bold block">Claim Quantity</span>
                    <span className="text-base font-extrabold text-[#1B4D3E]">{req.requestedKg} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A5550] uppercase font-bold block">Est. Meals</span>
                    <span className="text-base font-extrabold text-[#D97706]">~{req.estimatedMeals} Servings</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between">
                <button onClick={() => navigate(`/handover/${req.requestId}`)} className="text-[#0284C7] font-bold text-xs hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">qr_code</span>
                  <span>Handover Pass Code</span>
                </button>

                {req.status === 'Pickup Scheduled' && (
                  <button onClick={() => handleOpenReceive(req)} className="px-4 py-1.5 rounded-xl bg-[#1B4D3E] text-white font-bold text-xs hover:bg-[#155E3D]">
                    Confirm Cold Intake
                  </button>
                )}

                {req.status === 'Received' && (
                  <button onClick={() => handleOpenDistribute(req)} className="px-4 py-1.5 rounded-xl bg-[#D97706] text-white font-bold text-xs hover:bg-[#B45309]">
                    Record Meal Service
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="col-span-full p-12 rounded-2xl bg-white border border-dashed border-[#E6E2D8] text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px]">volunteer_activism</span>
              </div>
              <p className="font-headline-sm text-lg font-bold text-[#1C2421]">No rescue requests yet.</p>
              <p className="font-body-sm text-xs text-[#4A5550]">Submit surplus claims from the marketplace to track food rescue journey.</p>
              <button onClick={() => navigate('/surplus-food')} className="px-5 py-2.5 bg-[#1B4D3E] text-white text-xs font-bold rounded-xl mt-2">
                Browse Surplus Marketplace
              </button>
            </div>
          )}
        </div>

        {/* Intake Modal */}
        {showReceiveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E6E2D8] flex flex-col gap-4">
              <h3 className="font-bold text-lg text-[#1C2421]">Confirm Cold Chain Intake</h3>
              <p className="text-xs text-[#4A5550]">Verify thermal seal integrity and load into NGO refrigeration facilities.</p>
              
              <form onSubmit={handleConfirmReceive} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Intake Notes</label>
                  <textarea
                    rows="3"
                    value={receiveNotesInput}
                    onChange={(e) => setReceiveNotesInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2D8]">
                  <button type="button" onClick={() => setShowReceiveModal(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#155E3D]">Confirm Intake</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
