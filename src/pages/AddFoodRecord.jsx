import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';
import { foodRecordsApi, surplusApi } from '../services/api';

export default function AddFoodRecord() {
  const navigate = useNavigate();
  const { addNewFoodRecord } = useFoodRecords();

  // Form Field State
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [mealType, setMealType] = useState('Lunch');
  const [foodCategory, setFoodCategory] = useState('Rice');
  const [itemName, setItemName] = useState('Steamed Basmati Rice #B-201');
  const [foodPrepared, setFoodPrepared] = useState('100.0');
  const [foodConsumed, setFoodConsumed] = useState('72.0');
  const [surplus, setSurplus] = useState('18.0');
  const [waste, setWaste] = useState('10.0');
  const [wasteType, setWasteType] = useState('Organic');
  const [wasteReason, setWasteReason] = useState('Overproduction');
  const [handlingStream, setHandlingStream] = useState('compost');
  const [kitchenNotes, setKitchenNotes] = useState('Lunch traffic on target; excess yield auto-routed to surplus staging.');

  // Feedback State
  const [errors, setErrors] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [listingError, setListingError] = useState('');
  const [savedRecord, setSavedRecord] = useState(null);
  const [isPostingListing, setIsPostingListing] = useState(false);

  // Numerical Parsing
  const preparedNum = parseFloat(foodPrepared) || 0;
  const consumedNum = parseFloat(foodConsumed) || 0;
  const surplusNum = parseFloat(surplus) || 0;
  const wasteNum = parseFloat(waste) || 0;

  // Live Calculations
  const calculatedRemaining = preparedNum - consumedNum;
  const totalAllocated = surplusNum + wasteNum;
  const deltaUnaccounted = calculatedRemaining - totalAllocated;
  const isBalanced = Math.abs(deltaUnaccounted) < 0.01;

  // Percentage Calculations for Summary Bar
  const pctConsumed = preparedNum > 0 ? Math.round((consumedNum / preparedNum) * 100) : 0;
  const pctSurplus = preparedNum > 0 ? Math.round((surplusNum / preparedNum) * 100) : 0;
  const pctWaste = preparedNum > 0 ? Math.round((wasteNum / preparedNum) * 100) : 0;

  // Quick Presets
  const handleApplyPreset = (type) => {
    setErrors({});
    if (type === 'lunch') {
      setFoodCategory('Rice');
      setItemName('Steamed Basmati Rice #B-201');
      setMealType('Lunch');
      setFoodPrepared('100.0');
      setFoodConsumed('72.0');
      setSurplus('18.0');
      setWaste('10.0');
    } else if (type === 'banquet') {
      setFoodCategory('Proteins');
      setItemName('Executive Banquet Poultry & Fish');
      setMealType('Event');
      setFoodPrepared('250.0');
      setFoodConsumed('180.0');
      setSurplus('50.0');
      setWaste('20.0');
    } else if (type === 'breakfast') {
      setFoodCategory('Bakery');
      setItemName('Morning Pastry & Baguette Setup');
      setMealType('Breakfast');
      setFoodPrepared('60.0');
      setFoodConsumed('48.0');
      setSurplus('10.0');
      setWaste('2.0');
    }
  };

  // Form Validation Logic
  const validateForm = () => {
    const errs = {};

    if (!date) errs.date = 'Audit date is required.';
    if (!itemName.trim()) errs.itemName = 'Item description or batch serial is required.';
    for (const [field, value, label] of [
      ['foodPrepared', foodPrepared, 'Prepared'],
      ['foodConsumed', foodConsumed, 'Consumed'],
      ['surplus', surplus, 'Surplus'],
      ['waste', waste, 'Waste'],
    ]) {
      if (value.trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0) {
        errs[field] = `${label} quantity must be a finite non-negative number.`;
      }
    }
    if (consumedNum > preparedNum) errs.consumedExceeds = `Food consumed (${consumedNum} kg) cannot exceed prepared amount (${preparedNum} kg).`;

    if (!errs.foodPrepared && !errs.foodConsumed && !errs.surplus && !errs.waste && consumedNum <= preparedNum) {
      if (totalAllocated > calculatedRemaining + 0.01) {
        errs.reconciliation = `Surplus (${surplusNum} kg) + Waste (${wasteNum} kg) = ${totalAllocated} kg, which exceeds remaining unconsumed food (${calculatedRemaining.toFixed(1)} kg).`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const postSurplusListing = async (recordId) => {
    setListingError('');
    setIsPostingListing(true);
    try {
      await surplusApi.create({ recordId });
      navigate('/food-records');
    } catch (error) {
      setListingError(error.message || 'Food record was saved, but its surplus listing could not be posted.');
    } finally {
      setIsPostingListing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    if (!validateForm()) return;

    setIsSaving(true);
    const recordInput = {
      date,
      mealType,
      foodCategory,
      itemName: itemName.trim(),
      foodPrepared: preparedNum,
      foodConsumed: consumedNum,
      surplus: surplusNum,
      waste: wasteNum,
      wasteType,
      wasteReason,
      handlingStream,
      kitchenNotes,
    };

    try {
      const response = await foodRecordsApi.create(recordInput);
      const createdRecord = response.data.record;
      addNewFoodRecord({ ...recordInput, recordId: createdRecord.recordId, time: createdRecord.time, station: createdRecord.station });
      setNewlyCreatedId(createdRecord.recordId);
      setSavedRecord(createdRecord);
      setSavedSuccess(true);
      if (createdRecord.surplus > 0) {
        await postSurplusListing(createdRecord.recordId);
      } else {
        setTimeout(() => navigate('/food-records'), 700);
      }
    } catch (error) {
      setSaveError(error.message || 'Unable to save this food record. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout pageTitle="Add Food Record" breadcrumbs={[{ label: 'Food Records', path: '/food-records' }, { label: 'New Record' }]}>
      <div className="flex flex-col gap-8">
        
        {/* Toast Notification */}
        {savedSuccess && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 p-4 rounded-2xl bg-white shadow-xl border-l-4 border-[#1B4D3E]">
            <span className="material-symbols-outlined text-[#1B4D3E] text-[24px]">check_circle</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#1C2421]">Record Ledger Stored!</span>
              <span className="text-xs text-[#4A5550]">Audit Batch #{newlyCreatedId} committed. Redirecting...</span>
            </div>
          </div>
        )}

        {saveError && (
          <div role="alert" className="p-4 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-bold border border-red-200">
            {saveError}
          </div>
        )}

        {listingError && (
          <div role="alert" className="p-4 rounded-xl bg-[#FEF3C7] text-[#92400E] text-xs font-bold border border-[#FDE68A] flex flex-wrap items-center justify-between gap-3">
            <span>{listingError} The food record itself is already saved.</span>
            <div className="flex gap-2">
              <button type="button" disabled={isPostingListing} onClick={() => postSurplusListing(savedRecord.recordId)} className="px-3 py-1.5 rounded-lg bg-white border border-[#FDE68A] disabled:opacity-60">
                {isPostingListing ? 'Retrying...' : 'Retry Listing'}
              </button>
              <button type="button" onClick={() => navigate('/food-records')} className="px-3 py-1.5 rounded-lg bg-white border border-[#FDE68A]">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EFE7] text-[#1B4D3E] text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>STANDARD AUDIT PROTOCOL</span>
            </div>
            <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">Add Food Record</h1>
            <p className="font-body-md text-base text-[#4A5550] mt-1">
              Log prepared food, patron consumption, surplus yield, and waste discards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4A5550]">Presets:</span>
            <button onClick={() => handleApplyPreset('lunch')} type="button" className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8] text-xs font-bold">
              Lunch Rush
            </button>
            <button onClick={() => handleApplyPreset('banquet')} type="button" className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8] text-xs font-bold">
              Banquet
            </button>
          </div>
        </div>

        {/* Main Form Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-6">
            <h2 className="font-bold text-lg text-[#1C2421] border-b border-[#E6E2D8] pb-3">Basic Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C2421] mb-1">Audit Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C2421] mb-1">Food Category</label>
                <select
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                >
                  <option value="Rice">Grains & Rice</option>
                  <option value="Vegetables">Fresh Produce</option>
                  <option value="Bakery">Bakery & Pastry</option>
                  <option value="Proteins">Proteins</option>
                  <option value="Dairy">Dairy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C2421] mb-1">Item Description / Serial</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#1C2421] mb-1">Prepared (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={foodPrepared}
                  onChange={(e) => setFoodPrepared(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-bold text-[#1C2421]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#15803D] mb-1">Consumed (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={foodConsumed}
                  onChange={(e) => setFoodConsumed(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-bold text-[#15803D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D97706] mb-1">Surplus (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={surplus}
                  onChange={(e) => setSurplus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-bold text-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#DC2626] mb-1">Waste (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={waste}
                  onChange={(e) => setWaste(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-bold text-[#DC2626]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6E2D8] flex items-center justify-end gap-3">
              <button type="button" onClick={() => navigate('/food-records')} className="px-4 py-2.5 rounded-xl bg-gray-100 text-xs font-bold text-[#1C2421]">
                Cancel
              </button>
              <button type="submit" disabled={isSaving || Boolean(savedRecord)} className="px-6 py-2.5 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold hover:bg-[#155E3D] shadow-xs disabled:opacity-60 disabled:cursor-not-allowed">
                {isSaving ? 'Saving Record...' : savedRecord ? 'Record Saved' : 'Commit Entry to Ledger'}
              </button>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col gap-4">
            <h3 className="font-bold text-base text-[#1C2421] border-b border-[#E6E2D8] pb-3">Mass Balance Audit</h3>
            
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between">
                <span>Consumed Yield:</span>
                <strong className="text-[#15803D]">{pctConsumed}% ({consumedNum} kg)</strong>
              </div>
              <div className="flex justify-between">
                <span>Surplus Rescue:</span>
                <strong className="text-[#D97706]">{pctSurplus}% ({surplusNum} kg)</strong>
              </div>
              <div className="flex justify-between">
                <span>Organic Waste:</span>
                <strong className="text-[#DC2626]">{pctWaste}% ({wasteNum} kg)</strong>
              </div>
            </div>

            <div className={`p-4 rounded-xl text-xs font-bold border ${isBalanced ? 'bg-[#DCFCE7] text-[#15803D] border-[#A7F3D0]' : 'bg-[#FEE2E2] text-[#DC2626] border-red-300'}`}>
              {isBalanced ? '✓ Balanced Entry Ready for Sign-off' : `⚠ Reconciliation Delta: ${deltaUnaccounted.toFixed(1)} kg`}
            </div>
          </div>

        </form>

      </div>
    </AppLayout>
  );
}
