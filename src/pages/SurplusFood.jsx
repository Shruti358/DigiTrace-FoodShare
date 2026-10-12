import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { surplusApi } from '../services/api';

export default function SurplusFood() {
  const navigate = useNavigate();
  const [surplusListings, setSurplusListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = ['All', 'Proteins', 'Bakery', 'Grains', 'Salad', 'Dairy'];

  // Food image placeholders mapped to listings
  const foodImageMap = {
    'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    'Proteins': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    'Grains': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    'Dairy': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80'
  };

  const defaultFoodImg = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80';

  const loadListings = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const response = await surplusApi.list();
      setSurplusListings(response?.data?.listings || []);
    } catch (error) {
      setLoadError(error.message || 'Unable to load surplus listings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const partnerNgos = [
    { name: "Helping Hands Foundation", location: "Lucknow", meals: "420 meals received", status: "Verified 501(c)(3)" },
    { name: "Robin Hood Army", location: "Delhi NCR", meals: "1,850 meals received", status: "Verified Partner" },
    { name: "Food For All Relief Trust", location: "Kanpur", meals: "640 meals received", status: "Verified NGO" },
    { name: "Akshaya Community Kitchen", location: "Varanasi", meals: "920 meals received", status: "Verified NGO" }
  ];

  const filteredListings = surplusListings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalSurplusAvailableKg = surplusListings.filter(s => s.status === 'Available').reduce((sum, s) => sum + s.quantityKg, 0);
  const activeRequestsCount = surplusListings.filter((listing) =>
    listing.currentUserRequest
      ? ['Pending', 'Accepted', 'Pickup Scheduled'].includes(listing.currentUserRequest.status)
      : listing.status === 'Requested'
  ).length;

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

  return (
    <AppLayout pageTitle="Rescue Surplus Food" breadcrumbs={[{ label: 'Rescue Surplus Food' }]}>
      <div className="flex flex-col gap-8">

        {loadError && (
          <div role="alert" className="p-4 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-bold border border-red-200 flex items-center justify-between gap-4">
            <span>{loadError}</span>
            <button onClick={loadListings} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-red-200">Retry</button>
          </div>
        )}
        
        {/* Strong Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] font-label-sm text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
              <span>SURPLUS RESCUE MARKETPLACE</span>
            </div>
            <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">Rescue Surplus Food</h1>
            <p className="font-body-md text-base text-[#4A5550] mt-1">
              Give surplus food a second purpose instead of sending it to waste. Connect commercial kitchens with accredited NGOs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/add-food-record')}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-label-lg font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Post Surplus Batch</span>
            </button>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="flex items-center gap-2 bg-[#F4F1E8] p-1.5 rounded-2xl overflow-x-auto border border-[#E6E2D8]">
          <button className="px-4 py-2 rounded-xl bg-white text-[#1C2421] shadow-xs font-label-md font-bold whitespace-nowrap">
            Marketplace Listings ({surplusListings.length})
          </button>
          <button onClick={() => navigate('/incoming-requests')} className="px-4 py-2 rounded-xl text-[#4A5550] hover:text-[#1C2421] font-label-md font-medium transition-colors whitespace-nowrap flex items-center gap-2">
            <span>Incoming Claims (Donors)</span>
            {activeRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#D97706] text-white font-label-sm font-bold text-xs">{activeRequestsCount}</span>
            )}
          </button>
          <button onClick={() => navigate('/my-requests')} className="px-4 py-2 rounded-xl text-[#4A5550] hover:text-[#1C2421] font-label-md font-medium transition-colors whitespace-nowrap">
            My Requests (NGOs)
          </button>
          <button onClick={() => navigate('/handover/REQ-2026-001')} className="px-4 py-2 rounded-xl text-[#4A5550] hover:text-[#1C2421] font-label-md font-medium transition-colors whitespace-nowrap">
            Handover Studio
          </button>
        </div>

        {/* 3 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Available Surplus</span>
            <span className="text-3xl font-black text-[#1B4D3E] my-2">{totalSurplusAvailableKg.toFixed(1)} kg</span>
            <span className="text-xs text-[#15803D] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span> 100% HACCP Food Grade Safe
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Estimated Rescue Meals</span>
            <span className="text-3xl font-black text-[#D97706] my-2">~{Math.round(totalSurplusAvailableKg * 2.4)} Meals</span>
            <span className="text-xs text-[#4A5550]">Calculated @ 0.42 kg/portion</span>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="font-label-sm text-xs text-[#4A5550] uppercase font-bold tracking-wider">Active NGO Claims</span>
            <span className="text-3xl font-black text-[#0284C7] my-2">{activeRequestsCount} Claims</span>
            <span className="text-xs text-[#0284C7] font-bold">Verified Cold Chain Handoff</span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#4A5550] text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search surplus food items, providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#FAF8F5] rounded-xl font-body-sm text-xs text-[#1C2421] placeholder:text-[#4A5550] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E] border border-[#E6E2D8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1B4D3E] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#4A5550] hover:text-[#1C2421] border border-[#E6E2D8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Visually Attractive Food Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full p-8 rounded-2xl bg-white border border-[#E6E2D8] text-center text-sm text-[#4A5550]">
              Loading surplus listings...
            </div>
          )}
          {filteredListings.map((item) => {
            const itemImg = foodImageMap[item.category] || defaultFoodImg;
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-xs border border-[#E6E2D8] overflow-hidden flex flex-col justify-between group hover:border-[#1B4D3E] transition-all card-hover">
                {/* Food Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={itemImg} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#1C2421] shadow-xs">
                    ID: {item.id}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${statusBgMap[item.status] || 'bg-gray-100'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#D97706]">{item.category}</span>
                    <h3 className="font-headline-sm text-lg font-bold text-[#1C2421] leading-snug">{item.title}</h3>
                    <p className="font-body-sm text-xs text-[#4A5550] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">storefront</span>
                      {item.provider}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] my-1">
                    <div>
                      <span className="text-[10px] text-[#4A5550] uppercase font-bold block">Available Weight</span>
                      <span className="text-base font-extrabold text-[#1B4D3E]">{item.quantityKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#4A5550] uppercase font-bold block">Est. Portions</span>
                      <span className="text-base font-extrabold text-[#1C2421]">~{item.servings} Meals</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-[#4A5550] pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#D97706]">schedule</span>
                      Safety ETA: 3h Window
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#0284C7]">location_on</span>
                      Dock #2
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-[#FAF8F5] border-t border-[#E6E2D8] flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/trace/${item.recordId}`)}
                    className="text-[#4A5550] hover:text-[#1B4D3E] transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">account_tree</span>
                    <span>Trace</span>
                  </button>

                  <button
                    onClick={() => navigate(`/surplus-food/${item.id}`)}
                    className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-label-md text-xs font-bold transition-all shadow-xs"
                  >
                    View Details & Claim
                  </button>
                </div>
              </div>
            );
          })}

          {!isLoading && !loadError && filteredListings.length === 0 && surplusListings.length === 0 && (
            <div className="col-span-full p-12 rounded-2xl bg-white border border-dashed border-[#E6E2D8] text-center flex flex-col items-center gap-3">
              <p className="font-headline-sm text-lg font-bold text-[#1C2421]">No surplus listings yet.</p>
              <p className="font-body-sm text-xs text-[#4A5550]">Add a food record with surplus to publish the batch here.</p>
              <button onClick={() => navigate('/add-food-record')} className="px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold rounded-xl mt-2">
                Add Food Record
              </button>
            </div>
          )}

          {!isLoading && !loadError && filteredListings.length === 0 && surplusListings.length > 0 && (
            <div className="col-span-full p-12 rounded-2xl bg-white border border-dashed border-[#E6E2D8] text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px]">storefront</span>
              </div>
              <p className="font-headline-sm text-lg font-bold text-[#1C2421]">Ready to rescue surplus food?</p>
              <p className="font-body-sm text-xs text-[#4A5550]">No listings match your search criteria. Post a new surplus batch or clear search filters.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold rounded-xl mt-2">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Section 7: Verified Rescue Partners */}
        <div className="p-8 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col gap-6 mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#E6E2D8] pb-4">
            <div>
              <h3 className="font-headline-sm text-xl font-bold text-[#1C2421]">Verified Rescue Partners</h3>
              <p className="font-body-sm text-xs text-[#4A5550]">NGOs and shelters receiving surplus food from the DigiTrace Network</p>
            </div>
            <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full">
              HACCP Chain Accredited
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {partnerNgos.map((ngo, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-base shrink-0">
                  {ngo.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-[#1C2421] truncate">{ngo.name}</span>
                  <span className="text-xs text-[#4A5550]">{ngo.location} • {ngo.meals}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
