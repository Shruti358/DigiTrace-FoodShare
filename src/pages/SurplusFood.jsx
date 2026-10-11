import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function SurplusFood() {
  const navigate = useNavigate();
  const location = useLocation();
  const { surplusListings, requestSurplusFood } = useFoodRecords();

  // Search and Filter State
  const initialQuery = new URLSearchParams(location.search).get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  // Quick Request Modal State
  const [requestModalItem, setRequestModalItem] = useState(null);
  const [ngoName, setNgoName] = useState('Hope Harbor Community Kitchen');
  const [requestedPortions, setRequestedPortions] = useState('');
  const [purpose, setPurpose] = useState('Evening Meal Service for Shelter Residents');
  const [pickupWindow, setPickupWindow] = useState('Today, 02:30 PM - 03:30 PM');
  const [requestSuccess, setRequestSuccess] = useState(false);

  const categories = ['All', 'Proteins', 'Bakery', 'Grains', 'Salad', 'Dairy'];

  // High quality food image mapping
  const foodImageMap = {
    'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
    'Proteins': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80',
    'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
    'Grains': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
    'Dairy': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80'
  };
  const defaultFoodImg = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80';

  // Filter listings
  const filteredListings = useMemo(() => {
    return surplusListings.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        (item.pickupAddress && item.pickupAddress.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

      let matchesAvail = true;
      if (selectedAvailability === 'Available') {
        matchesAvail = item.status === 'Available';
      } else if (selectedAvailability === 'Claimed') {
        matchesAvail = item.status !== 'Available';
      }

      return matchesSearch && matchesCat && matchesAvail;
    });
  }, [surplusListings, searchQuery, selectedCategory, selectedAvailability]);

  // Handle Quick Food Request submission
  const handleOpenRequest = (item) => {
    setRequestModalItem(item);
    setRequestedPortions(item.servings ? item.servings.toString() : '20');
    setRequestSuccess(false);
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();
    if (!requestModalItem) return;

    const reqKg = (parseFloat(requestedPortions) / 2.4).toFixed(1);
    requestSurplusFood(requestModalItem.id, {
      ngoName,
      requestedKg: reqKg,
      purpose,
      pickupWindow,
      courier: `${ngoName} Van / Volunteer Dispatch`
    });

    setRequestSuccess(true);
    setTimeout(() => {
      setRequestModalItem(null);
      setRequestSuccess(false);
      navigate('/my-requests');
    }, 800);
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      case 'Requested':
        return 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
      case 'Pickup Scheduled':
        return 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]';
      case 'Picked Up':
        return 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]';
      case 'Completed':
      case 'Distributed':
        return 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <AppLayout pageTitle="Find Surplus Food" breadcrumbs={[{ label: 'Find Surplus Food' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
              Surplus Food Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5550]">
              Browse available surplus food listings from restaurants and providers, ready for immediate rescue and distribution.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/add-food-record')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ List Surplus Food</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#78857E] text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search food by name, restaurant, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-[#FAF8F5] rounded-xl text-xs text-[#1C2421] placeholder:text-[#78857E] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E] border border-[#E6E2D8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#78857E] hover:text-[#1C2421]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Availability Filter Toggle */}
            <div className="inline-flex rounded-xl p-1 bg-[#FAF8F5] border border-[#E6E2D8] self-start sm:self-auto shrink-0">
              {['All', 'Available', 'Claimed'].map((avail) => (
                <button
                  key={avail}
                  onClick={() => setSelectedAvailability(avail)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedAvailability === avail
                      ? 'bg-white text-[#1B4D3E] shadow-xs'
                      : 'text-[#4A5550] hover:text-[#1C2421]'
                  }`}
                >
                  {avail === 'Available' ? 'Available Now' : avail === 'Claimed' ? 'Claimed' : 'All Statuses'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5">
            <span className="text-[11px] font-bold text-[#78857E] uppercase tracking-wider shrink-0 mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

        {/* Clean Food Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => {
            const itemImg = foodImageMap[item.category] || defaultFoodImg;
            const isAvailable = item.status === 'Available';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-xs border border-[#E6E2D8] overflow-hidden flex flex-col justify-between group hover:border-[#1B4D3E] transition-all card-hover"
              >
                {/* Food Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img
                    src={itemImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-[#1C2421] shadow-xs border border-white">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold text-[#1C2421] leading-snug">{item.title}</h3>
                    <p className="text-xs text-[#4A5550] flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[15px] text-[#1B4D3E]">storefront</span>
                      <span className="font-semibold">{item.provider}</span>
                    </p>
                    <p className="text-[11px] text-[#78857E] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#0284C7]">location_on</span>
                      <span>{item.pickupAddress || 'Central Kitchen Dock #2'}</span>
                    </p>
                  </div>

                  {/* Quantity & Portions Highlight */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] my-1">
                    <div>
                      <span className="text-[10px] text-[#78857E] uppercase font-bold block">Available Quantity</span>
                      <span className="text-base font-extrabold text-[#1B4D3E]">{item.quantityKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78857E] uppercase font-bold block">Estimated Portions</span>
                      <span className="text-base font-extrabold text-[#1C2421]">~{item.servings} meals</span>
                    </div>
                  </div>

                  {/* Freshness & Pickup Deadline */}
                  <div className="flex flex-col gap-1 text-xs pt-1 border-t border-[#E6E2D8]/60">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#4A5550] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#10B981]">schedule</span>
                        Freshness: {item.prepTime || 'Prepared Today'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#92400E] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        Pickup Deadline: {item.expiryWindow ? `Within ${item.expiryWindow}` : 'Today by 4:00 PM'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-[#FAF8F5] border-t border-[#E6E2D8] flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/trace/${item.recordId || 'DT-F-0001'}`)}
                    className="text-[#4A5550] hover:text-[#1B4D3E] transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">account_tree</span>
                    <span>Track</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/surplus-food/${item.id}`)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#4A5550] hover:text-[#1C2421] bg-white border border-[#E6E2D8]"
                    >
                      Details
                    </button>

                    {isAvailable ? (
                      <button
                        onClick={() => handleOpenRequest(item)}
                        className="px-4 py-1.5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Request Food
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-semibold">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredListings.length === 0 && (
            <div className="col-span-full p-12 rounded-2xl bg-white border border-dashed border-[#E6E2D8] text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#ECFDF5] text-[#1B4D3E] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">restaurant</span>
              </div>
              <p className="text-base font-bold text-[#1C2421]">No food listings found</p>
              <p className="text-xs text-[#4A5550] max-w-sm">
                No items match your selected search or category filters. Try resetting filters or post a new surplus batch.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedAvailability('All');
                }}
                className="px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold rounded-xl mt-2"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Quick Food Request Modal */}
        {requestModalItem && (
          <div className="fixed inset-0 bg-[#1C2421]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E6E2D8] max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#065F46] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1C2421]">Request Surplus Food</h3>
                    <p className="text-[11px] text-[#4A5550]">Submit a claim to the food donor</p>
                  </div>
                </div>
                <button
                  onClick={() => setRequestModalItem(null)}
                  className="text-[#78857E] hover:text-[#1C2421]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {requestSuccess ? (
                <div className="p-6 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">check_circle</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1C2421]">Request Submitted!</h4>
                  <p className="text-xs text-[#4A5550]">
                    Redirecting to your requests tracker...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmRequest} className="flex flex-col gap-3 text-xs">
                  {/* Item Summary */}
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                    <span className="font-bold text-[#1C2421] block text-sm">{requestModalItem.title}</span>
                    <span className="text-[#4A5550] block mt-0.5">
                      Offered by: <strong>{requestModalItem.provider}</strong> ({requestModalItem.quantityKg} kg • ~{requestModalItem.servings} meals)
                    </span>
                  </div>

                  {/* NGO Name */}
                  <div>
                    <label className="block font-bold text-[#1C2421] mb-1">Requesting Organization / NGO</label>
                    <input
                      type="text"
                      value={ngoName}
                      onChange={(e) => setNgoName(e.target.value)}
                      required
                      className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                    />
                  </div>

                  {/* Portions Needed */}
                  <div>
                    <label className="block font-bold text-[#1C2421] mb-1">Meals / Portions Needed</label>
                    <input
                      type="number"
                      value={requestedPortions}
                      onChange={(e) => setRequestedPortions(e.target.value)}
                      max={requestModalItem.servings}
                      min="1"
                      required
                      className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                    />
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block font-bold text-[#1C2421] mb-1">Distribution Purpose</label>
                    <input
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                      className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                    />
                  </div>

                  {/* Pickup Window */}
                  <div>
                    <label className="block font-bold text-[#1C2421] mb-1">Proposed Pickup Window</label>
                    <input
                      type="text"
                      value={pickupWindow}
                      onChange={(e) => setPickupWindow(e.target.value)}
                      required
                      className="w-full h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E2D8]">
                    <button
                      type="button"
                      onClick={() => setRequestModalItem(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#4A5550] hover:text-[#1C2421]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Submit Food Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
