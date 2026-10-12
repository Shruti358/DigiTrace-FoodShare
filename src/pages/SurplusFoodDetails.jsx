import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { surplusApi } from '../services/api';

export default function SurplusFoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadListing = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const response = await surplusApi.get(id);
        if (isMounted) setListing(response?.data?.listing || null);
      } catch (error) {
        if (isMounted) setLoadError(error.message || 'Unable to load this surplus listing.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadListing();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const existingReq = listing?.currentUserRequest || requestSuccess;

  // Food images
  const foodImageMap = {
    'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    'Proteins': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
    'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    'Grains': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    'Dairy': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80'
  };
  const foodImg = foodImageMap[listing?.category] || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80';

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [ngoName] = useState(user?.organizationName || user?.name || '');
  const [requestedKg, setRequestedKg] = useState('');
  const [purpose, setPurpose] = useState('Evening Meal Service for Shelter Residents');
  const [pickupWindow, setPickupWindow] = useState('02:30 PM - 03:30 PM');
  const [courier, setCourier] = useState('Hope Harbor Express Van #4');
  useEffect(() => {
    if (listing) setRequestedKg(String(listing.availableKg || listing.quantityKg));
  }, [listing]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess(null);
    setIsRequesting(true);
    try {
      const response = await surplusApi.request(listing.id, {
        requestedKg: Number(requestedKg),
        purpose,
        pickupWindow,
        courier,
      });
      setListing(response.data.listing);
      setRequestSuccess(response.data.request);
      setShowModal(false);
    } catch (error) {
      setRequestError(error.message || 'Unable to submit this surplus request.');
    } finally {
      setIsRequesting(false);
    }
  };

  const statusBgMap = {
    Available: 'bg-[#DCFCE7] text-[#15803D] border-[#A7F3D0]',
    Requested: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    'Pickup Scheduled': 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    'Picked Up': 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]',
    Received: 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]',
    Distributed: 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]',
    Completed: 'bg-gray-100 text-gray-800 border-gray-300',
    Expired: 'bg-red-100 text-red-800 border-red-300'
  };

  // 8-stage progress steps
  const journeySteps = [
    { title: 'Surplus Identified', desc: 'Identified at prep kitchen', icon: 'fact_check', completed: true },
    { title: 'Listed', desc: 'Posted to DigiTrace Network', icon: 'storefront', completed: true },
    { title: 'NGO Requested', desc: existingReq ? `Claimed by ${existingReq.ngoName}` : 'Awaiting an NGO request', icon: 'volunteer_activism', completed: Boolean(existingReq) },
    { title: 'Accepted', desc: 'Donor dock pass issued', icon: 'verified', completed: ['Accepted', 'Pickup Scheduled', 'Picked Up', 'Received', 'Distributed', 'Completed'].includes(listing?.status) },
    { title: 'Pickup Scheduled', desc: 'Refrigerated van routed', icon: 'event', completed: ['Pickup Scheduled', 'Picked Up', 'Received', 'Distributed', 'Completed'].includes(listing?.status) },
    { title: 'Picked Up', desc: 'Handoff complete at Dock #2', icon: 'local_shipping', completed: ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(listing?.status) },
    { title: 'Received', desc: 'Cold chain intake verified', icon: 'markunread_mailbox', completed: ['Received', 'Distributed', 'Completed'].includes(listing?.status) },
    { title: 'Distributed', desc: 'Served as meals to community', icon: 'sentiment_very_satisfied', completed: ['Distributed', 'Completed'].includes(listing?.status) }
  ];

  return (
    <AppLayout pageTitle="Surplus Details" breadcrumbs={[{ label: 'Surplus Marketplace', path: '/surplus-food' }, { label: listing?.title || 'Surplus Details' }]}>
      {isLoading ? (
        <div className="p-8 rounded-2xl bg-white border border-[#E6E2D8] text-center text-sm text-[#4A5550]">Loading surplus listing...</div>
      ) : !listing ? (
        <div role="alert" className="p-8 rounded-2xl bg-white border border-[#E6E2D8] text-center text-sm text-[#DC2626]">
          {loadError || 'Surplus listing not found.'}
          <div className="mt-4"><Link to="/surplus-food" className="text-[#1B4D3E] font-bold">Back to marketplace</Link></div>
        </div>
      ) : (
      <div className="flex flex-col gap-8">

        {requestError && (
          <div role="alert" className="p-4 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-bold border border-red-200">{requestError}</div>
        )}

        {requestSuccess && (
          <div role="status" className="p-4 rounded-xl bg-[#DCFCE7] text-[#15803D] text-xs font-bold border border-[#A7F3D0]">
            Request {requestSuccess.requestId} submitted. Current request status: {requestSuccess.status}.
          </div>
        )}
        
        {/* Navigation & Listing Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/surplus-food" className="inline-flex items-center gap-2 text-[#4A5550] hover:text-[#1C2421] font-label-md text-xs font-bold transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Surplus Marketplace</span>
          </Link>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-xs border border-[#E6E2D8]">
            <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold">Listing Status:</span>
            <span className={`px-3 py-1 rounded-full border text-xs font-bold ${statusBgMap[listing.status] || 'bg-gray-100 text-gray-800'}`}>{listing.status}</span>
          </div>
        </div>

        {/* Requested Alert Banner */}
        {listing.status !== 'Available' && (
          <div className="p-5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-2xl shadow-xs flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#D97706] text-[24px]">verified</span>
              <div>
                <p className="font-label-lg text-sm font-bold">Rescue Request Active</p>
                <p className="font-body-sm text-xs text-[#B45309]">
                  {existingReq ? <>Claim registered by <strong>{existingReq.ngoName}</strong>. Request status: {existingReq.status}.</> : `This listing is currently ${listing.status.toLowerCase()}.`}
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/incoming-requests')} className="px-4 py-2 bg-[#D97706] text-white rounded-xl text-xs font-bold hover:bg-[#B45309] shrink-0">
              Manage Inbound Claim
            </button>
          </div>
        )}

        {/* Large Visual Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Large Food Image & Specifications */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white">
              <img 
                src={foodImg} 
                alt={listing.title} 
                className="w-full h-80 lg:h-[380px] object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1C2421] shadow-xs">
                Batch ID: {listing.id}
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs ${statusBgMap[listing.status] || statusBgMap.Available}`}>
                  {listing.status}
                </span>
              </div>
            </div>

            {/* Food Specifications */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-4">
              <h2 className="font-headline-sm text-lg font-bold text-[#1C2421] border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
                <span>Food Specifications</span>
                <span className="text-xs font-mono text-[#4A5550]">HACCP: {listing.haccpCode}</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                  <span className="text-[11px] text-[#4A5550] uppercase font-bold block">Category</span>
                  <span className="text-base font-bold text-[#1C2421]">{listing.category}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                  <span className="text-[11px] text-[#4A5550] uppercase font-bold block">Net Weight & Portion</span>
                  <span className="text-base font-bold text-[#1B4D3E]">{listing.quantityKg} kg (~{listing.servings} meals)</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                  <span className="text-[11px] text-[#4A5550] uppercase font-bold block">Prep Date & Window</span>
                  <span className="text-base font-bold text-[#1C2421]">{listing.prepTime} • {listing.expiryWindow}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                  <span className="text-[11px] text-[#4A5550] uppercase font-bold block">Cold Chain Temp</span>
                  <span className="text-base font-bold text-[#15803D]">{listing.temp} (Safe &lt; 41°F)</span>
                </div>
              </div>

              {/* Dietary Tags */}
              <div className="pt-2 border-t border-[#E6E2D8]">
                <span className="text-xs font-bold text-[#4A5550] block mb-2">Dietary Profile</span>
                <div className="flex flex-wrap gap-2">
                  {listing.dietary.map((d, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold border border-[#A7F3D0]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Item Overview & Action Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#D97706] block mb-1">Surplus Listing</span>
                <h1 className="font-display-lg text-2xl font-extrabold text-[#1C2421]">{listing.title}</h1>
                <p className="font-body-sm text-sm text-[#4A5550] mt-1">Provided by <strong>{listing.provider}</strong></p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex flex-col gap-2 text-xs text-[#4A5550]">
                <div className="flex justify-between py-1 border-b border-[#E6E2D8]">
                  <span>Pickup Dock:</span>
                  <strong className="text-[#1C2421]">{listing.pickupAddress}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E6E2D8]">
                  <span>Facility ID:</span>
                  <strong className="text-[#1C2421]">{listing.facilityId}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Audit Record ID:</span>
                  <strong className="text-[#0284C7] font-mono">{listing.recordId}</strong>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setRequestError(''); setShowModal(true); }}
                  disabled={user?.role !== 'NGO' || listing.status !== 'Available' || listing.availableKg <= 0}
                  className={`w-full py-3.5 rounded-xl font-label-lg text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    user?.role === 'NGO' && listing.status === 'Available' && listing.availableKg > 0
                      ? 'bg-[#1B4D3E] hover:bg-[#155E3D] text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                  <span>{user?.role !== 'NGO' ? 'NGO Account Required' : listing.status === 'Available' ? 'Request Food Batch' : `Status: ${listing.status}`}</span>
                </button>

                <button
                  onClick={() => navigate(`/trace/${listing.recordId}`)}
                  className="w-full py-3 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8] text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">account_tree</span>
                  <span>View Full Traceability Timeline</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rescue Journey Timeline Below */}
        <section className="bg-white p-8 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
          <div className="border-b border-[#E6E2D8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-headline-lg text-xl font-bold text-[#1C2421]">Rescue Journey Timeline</h2>
              <p className="font-body-sm text-xs text-[#4A5550]">End-to-end chain of custody tracking for this food batch</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#1B4D3E] bg-[#DCFCE7] px-3 py-1 rounded-full">
              Audit Hash Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {journeySteps.map((step, idx) => (
              <div key={idx} className={`p-4 rounded-xl border transition-all ${step.completed ? 'bg-[#FAF8F5] border-[#16A34A]' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#4A5550]">Step 0{idx + 1}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.completed ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-gray-200 text-gray-500'}`}>
                    <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#1C2421] mb-0.5">{step.title}</h4>
                <p className="text-xs text-[#4A5550]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Request Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E6E2D8] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-3">
                <h3 className="font-bold text-lg text-[#1C2421]">Request Food Rescue Batch</h3>
                <button onClick={() => setShowModal(false)} className="text-[#4A5550] hover:text-[#1C2421]">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">NGO / Organization Name</label>
                  <input
                    type="text"
                    value={ngoName}
                    readOnly
                    required
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Requested Quantity (kg)</label>
                  <input
                    type="number"
                    min="0.001"
                    max={listing.availableKg}
                    step="any"
                    value={requestedKg}
                    onChange={(e) => setRequestedKg(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Service Purpose</label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Pickup Courier Vehicle</label>
                  <input
                    type="text"
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-gray-100 font-bold text-[#1C2421]">
                    Cancel
                  </button>
                  <button type="submit" disabled={isRequesting} className="px-5 py-2 rounded-xl bg-[#1B4D3E] text-white font-bold hover:bg-[#155E3D] disabled:opacity-60">
                    {isRequesting ? 'Submitting...' : 'Submit Claim Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
      )}
    </AppLayout>
  );
}
