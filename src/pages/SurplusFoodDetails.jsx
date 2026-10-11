import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function SurplusFoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surplusListings, requestSurplusFood, rescueRequests } = useFoodRecords();

  // Find listing by id or recordId
  const listing = surplusListings.find((s) => s.id === id || s.recordId === id) || surplusListings[0];
  const existingReq = rescueRequests.find((r) => r.surplusId === listing.id || r.recordId === listing.recordId);

  // High quality food image mapping
  const foodImageMap = {
    'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    'Proteins': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
    'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    'Grains': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    'Dairy': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80'
  };
  const foodImg = foodImageMap[listing.category] || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80';

  // Request Modal State
  const [showModal, setShowModal] = useState(false);
  const [ngoName, setNgoName] = useState('Hope Harbor Community Kitchen');
  const [requestedPortions, setRequestedPortions] = useState(listing.servings ? listing.servings.toString() : '20');
  const [purpose, setPurpose] = useState('Evening Meal Service for Shelter Residents');
  const [pickupWindow, setPickupWindow] = useState('Today, 02:30 PM - 03:30 PM');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    requestSurplusFood(listing.id, {
      ngoName,
      requestedKg: (parseFloat(requestedPortions) / 2.4).toFixed(1),
      purpose,
      pickupWindow,
      courier: `${ngoName} Van Dispatch`
    });
    setShowModal(false);
    navigate('/my-requests');
  };

  // 5-Stage Workflow Progress
  const workflowSteps = [
    { key: 'Available', label: '1. Available', desc: 'Listed by provider', icon: 'storefront', done: true },
    { key: 'Requested', label: '2. Requested', desc: existingReq ? `Claimed by ${existingReq.ngoName}` : 'NGO request received', icon: 'volunteer_activism', done: Boolean(existingReq || listing.status !== 'Available') },
    { key: 'Accepted', label: '3. Accepted', desc: 'Pickup scheduled', icon: 'check_circle', done: ['Pickup Scheduled', 'Picked Up', 'Received', 'Distributed', 'Completed'].includes(listing.status) },
    { key: 'Picked Up', label: '4. Picked Up', desc: 'En route with courier', icon: 'local_shipping', done: ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(listing.status) },
    { key: 'Delivered', label: '5. Delivered', desc: 'Meals served', icon: 'task_alt', done: ['Received', 'Distributed', 'Completed'].includes(listing.status) }
  ];

  return (
    <AppLayout pageTitle="Donation Details" breadcrumbs={[{ label: 'Surplus Food', path: '/surplus-food' }, { label: listing.title }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
          <Link
            to="/surplus-food"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A5550] hover:text-[#1C2421] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Surplus Food Directory</span>
          </Link>

          <button
            onClick={() => navigate(`/trace/${listing.recordId || 'DT-F-0001'}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6E2D8] text-xs font-bold text-[#1B4D3E] hover:bg-[#FAF8F5]"
          >
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            <span>View Lifecycle Trace</span>
          </button>
        </div>

        {/* 5-Stage Visual Workflow Tracker */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#78857E]">
            Food Rescue Progress
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                  step.done
                    ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                    : 'bg-[#FAF8F5] border-[#E6E2D8] text-[#78857E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{step.label}</span>
                  <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                </div>
                <span className="text-[11px] leading-tight text-[#4A5550]">{step.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left: Food Photo & Quick Attributes */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-3xl overflow-hidden shadow-sm border border-[#E6E2D8] bg-white relative">
              <img
                src={foodImg}
                alt={listing.title}
                className="w-full h-72 sm:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#1C2421] shadow-xs border border-white">
                Category: {listing.category}
              </div>
              <div className="absolute top-4 right-4 bg-[#1B4D3E] text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                Status: {listing.status}
              </div>
            </div>

            {/* Description & Packaging Notes */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-3">
              <h3 className="text-base font-bold text-[#1C2421]">Food Description & Handling</h3>
              <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
                {listing.description || 'Freshly prepared surplus portion packaged in sealed, food-grade storage containers. Held under safe refrigeration conditions according to standard food safety practices.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E6E2D8]">
                {listing.dietary && listing.dietary.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#1B4D3E] border border-[#E6E2D8] text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Key Donation Specs & Action */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-5">
              <div>
                <span className="text-[11px] font-bold text-[#78857E] uppercase tracking-wider">Donation Batch #{listing.id}</span>
                <h2 className="text-xl font-black text-[#1C2421] mt-1">{listing.title}</h2>
                <p className="text-xs text-[#1B4D3E] font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  {listing.provider}
                </p>
              </div>

              {/* Quantity Highlight */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                <div>
                  <span className="text-[10px] text-[#78857E] uppercase font-bold block">Available Quantity</span>
                  <span className="text-xl font-extrabold text-[#1B4D3E]">{listing.quantityKg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#78857E] uppercase font-bold block">Meal Portions</span>
                  <span className="text-xl font-extrabold text-[#1C2421]">~{listing.servings} meals</span>
                </div>
              </div>

              {/* Timing & Location Details */}
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]/80">
                  <span className="text-[#4A5550] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">schedule</span>
                    Prepared At:
                  </span>
                  <span className="font-bold text-[#1C2421]">{listing.prepTime || 'Today at 09:45 AM'}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
                  <span className="text-[#92400E] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">timer</span>
                    Pickup Deadline:
                  </span>
                  <span className="font-extrabold text-[#92400E]">
                    {listing.expiryWindow ? `Within ${listing.expiryWindow}` : 'Today by 4:00 PM'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]/80">
                  <span className="text-[#4A5550] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0284C7]">location_on</span>
                    Pickup Address:
                  </span>
                  <span className="font-bold text-[#1C2421] text-right truncate max-w-[180px]">
                    {listing.pickupAddress || 'Loading Dock #2'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {listing.status === 'Available' ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-3.5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                  <span>Request This Food</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-center">
                  <span className="text-xs font-bold text-[#065F46] block">
                    Claimed / In Progress ({listing.status})
                  </span>
                  <button
                    onClick={() => navigate('/my-requests')}
                    className="text-xs text-[#1B4D3E] font-bold underline mt-1 block w-full"
                  >
                    View in My Requests →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-[#1C2421]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E6E2D8] max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
                <h3 className="text-base font-bold text-[#1C2421]">Submit Food Request</h3>
                <button onClick={() => setShowModal(false)} className="text-[#78857E] hover:text-[#1C2421]">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Requesting NGO / Organization</label>
                  <input
                    type="text"
                    value={ngoName}
                    onChange={(e) => setNgoName(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Meals / Portions Needed</label>
                  <input
                    type="number"
                    value={requestedPortions}
                    onChange={(e) => setRequestedPortions(e.target.value)}
                    max={listing.servings}
                    min="1"
                    required
                    className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Purpose</label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Pickup Window</label>
                  <input
                    type="text"
                    value={pickupWindow}
                    onChange={(e) => setPickupWindow(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E2D8]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#4A5550]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold"
                  >
                    Submit Request
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
