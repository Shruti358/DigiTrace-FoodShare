import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function AddFoodRecord() {
  const navigate = useNavigate();
  const { addNewFoodRecord } = useFoodRecords();

  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [mealType, setMealType] = useState('Lunch');
  const [foodCategory, setFoodCategory] = useState('Proteins');
  const [itemName, setItemName] = useState('Herb-Roasted Lemon Chicken');
  const [surplusKg, setSurplusKg] = useState('18.5');
  const [prepTime, setPrepTime] = useState('09:45 AM');
  const [pickupDeadline, setPickupDeadline] = useState('Today by 3:30 PM');
  const [pickupLocation, setPickupLocation] = useState('Loading Dock #2, North Bay');
  const [storageType, setStorageType] = useState('Chilled (Food-Grade Containers)');
  const [dietaryTags, setDietaryTags] = useState('Gluten-Free, Halal-Compliant');
  const [notes, setNotes] = useState('Intact cooked chicken batch with roasted root vegetables, sealed in stainless containers.');

  const [errors, setErrors] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick Presets
  const handleApplyPreset = (type) => {
    setErrors({});
    if (type === 'lunch') {
      setFoodCategory('Proteins');
      setItemName('Herb-Roasted Lemon Chicken & Veggies');
      setMealType('Lunch');
      setSurplusKg('18.5');
      setStorageType('Chilled (Food-Grade Containers)');
      setDietaryTags('Gluten-Free, Halal-Compliant');
      setNotes('High quality roasted chicken portions prepared for lunch service.');
    } else if (type === 'bakery') {
      setFoodCategory('Bakery');
      setItemName('Fresh Brioche Breads & Artisan Baguettes');
      setMealType('Breakfast');
      setSurplusKg('12.0');
      setStorageType('Ambient Bakery Packaging');
      setDietaryTags('Vegetarian');
      setNotes('Freshly baked morning artisan bread batch.');
    } else if (type === 'buffet') {
      setFoodCategory('Grains');
      setItemName('Brown Rice & Steamed Quinoa Grain Bowls');
      setMealType('Dinner');
      setSurplusKg('15.0');
      setStorageType('Chilled (Sealed GN Pans)');
      setDietaryTags('Vegan, Gluten-Free');
      setNotes('Unserved buffet grain preparation in thermal containers.');
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!itemName.trim()) errs.itemName = 'Food item name is required.';
    const num = parseFloat(surplusKg);
    if (isNaN(num) || num <= 0) errs.surplusKg = 'Surplus quantity must be a positive number.';
    if (!pickupDeadline.trim()) errs.pickupDeadline = 'Pickup deadline is required to ensure food safety.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const numKg = parseFloat(surplusKg) || 10;
    // Call context to add food record and surplus listing
    addNewFoodRecord({
      date,
      mealType,
      foodCategory,
      itemName,
      foodPrepared: (numKg * 2.5).toFixed(1),
      foodConsumed: (numKg * 1.5).toFixed(1),
      surplus: numKg,
      waste: 0,
      station: pickupLocation
    });

    setSavedSuccess(true);
    setTimeout(() => {
      navigate('/surplus-food');
    }, 900);
  };

  const portionsCount = Math.round((parseFloat(surplusKg) || 0) * 2.4);

  return (
    <AppLayout pageTitle="Donate Surplus Food" breadcrumbs={[{ label: 'My Donations', path: '/food-records' }, { label: 'Donate Surplus Food' }]}>
      <div className="flex flex-col gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col gap-1 pb-4 border-b border-[#E6E2D8]">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
            Donate Surplus Food
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5550]">
            List excess prepared meals or ingredients on the DigiTrace network for immediate rescue by local non-profit partners.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E6E2D8] shadow-xs">
          <span className="text-xs font-bold text-[#4A5550]">Quick Sample Presets:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('lunch')}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-[#FAF8F5] text-[#1B4D3E] border border-[#E6E2D8] hover:bg-[#E6E2D8]"
            >
              Roasted Chicken
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('bakery')}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-[#FAF8F5] text-[#1B4D3E] border border-[#E6E2D8] hover:bg-[#E6E2D8]"
            >
              Artisan Breads
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('buffet')}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-[#FAF8F5] text-[#1B4D3E] border border-[#E6E2D8] hover:bg-[#E6E2D8]"
            >
              Grain Bowls
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#10B981]">check_circle</span>
            <div>
              <p className="font-bold text-sm">Surplus Food Successfully Listed!</p>
              <p className="text-xs">Publishing batch to the rescue directory and redirecting...</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
          {/* Section 1: Item Details */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-[#1C2421] pb-2 border-b border-[#E6E2D8]">
              1. Food Batch Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Food Item Name *</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Herb-Roasted Lemon Chicken"
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#1C2421] text-xs focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                />
                {errors.itemName && <span className="text-[#DC2626] text-[11px] font-bold mt-1 block">{errors.itemName}</span>}
              </div>

              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Food Category</label>
                <select
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#1C2421] text-xs font-semibold focus:outline-none"
                >
                  <option value="Proteins">Cooked Proteins & Poultry</option>
                  <option value="Bakery">Bakery & Breads</option>
                  <option value="Grains">Grains & Rice</option>
                  <option value="Salad">Salad & Fresh Produce</option>
                  <option value="Dairy">Dairy & Prepared Chilled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Surplus Quantity (kg) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={surplusKg}
                  onChange={(e) => setSurplusKg(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#1C2421] text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                />
                {errors.surplusKg && <span className="text-[#DC2626] text-[11px] font-bold mt-1 block">{errors.surplusKg}</span>}
              </div>

              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Estimated Portions</label>
                <div className="h-10 px-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center text-[#065F46] font-bold text-xs">
                  ~{portionsCount} Meals (0.42 kg/portion)
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Meal Prep Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-[#1C2421] text-xs focus:outline-none"
                >
                  <option value="Breakfast">Breakfast Service</option>
                  <option value="Lunch">Lunch Service</option>
                  <option value="Dinner">Dinner Service</option>
                  <option value="Event">Event / Banquet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Safety & Pickup Details */}
          <div className="flex flex-col gap-4 pt-2">
            <h2 className="text-base font-bold text-[#1C2421] pb-2 border-b border-[#E6E2D8]">
              2. Freshness, Safety & Pickup Logistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Preparation Date & Time</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-1/2 h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs"
                  />
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g. 09:45 AM"
                    className="w-1/2 h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Pickup Deadline Window *</label>
                <input
                  type="text"
                  value={pickupDeadline}
                  onChange={(e) => setPickupDeadline(e.target.value)}
                  placeholder="e.g. Today by 3:30 PM (Within 3h)"
                  className="w-full h-10 px-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-bold text-xs"
                />
                {errors.pickupDeadline && <span className="text-[#DC2626] text-[11px] font-bold mt-1 block">{errors.pickupDeadline}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Pickup Location & Instructions</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Loading Dock #2, North Service Bay"
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C2421] mb-1">Packaging Condition</label>
                <input
                  type="text"
                  value={storageType}
                  onChange={(e) => setStorageType(e.target.value)}
                  placeholder="e.g. Chilled (Food-Grade Sealed Containers)"
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-[#1C2421] mb-1">Dietary & Allergen Tags</label>
              <input
                type="text"
                value={dietaryTags}
                onChange={(e) => setDietaryTags(e.target.value)}
                placeholder="e.g. Dairy-Free, Gluten-Free, Halal-Compliant, Vegetarian"
                className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs"
              />
            </div>

            <div className="text-xs">
              <label className="block font-bold text-[#1C2421] mb-1">Handling & Quality Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific instructions for recipient NGOs or couriers..."
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E2D8]">
            <button
              type="button"
              onClick={() => navigate('/surplus-food')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#4A5550] hover:text-[#1C2421]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Publish to Rescue Marketplace
            </button>
          </div>
        </form>

      </div>
    </AppLayout>
  );
}
