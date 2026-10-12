import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';
import { foodRecordsApi } from '../services/api';

export default function FoodRecords() {
  const navigate = useNavigate();
  const {
    updateFoodRecord: updateLocalFoodRecord,
    deleteFoodRecord: deleteLocalFoodRecord,
    setSelectedRecordId,
  } = useFoodRecords();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Category Icon Map
  const categoryIconMap = {
    'Bakery': { icon: 'bakery_dining', color: 'bg-[#FEF3C7] text-[#D97706]' },
    'Proteins': { icon: 'restaurant', color: 'bg-[#FEE2E2] text-[#DC2626]' },
    'Grains': { icon: 'rice_bowl', color: 'bg-[#E0F2FE] text-[#0284C7]' },
    'Salad': { icon: 'spa', color: 'bg-[#DCFCE7] text-[#15803D]' },
    'Dairy': { icon: 'local_cafe', color: 'bg-[#F3E8FF] text-[#7E22CE]' }
  };

  // Filter States
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [mealFilter, setMealFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    mealType: 'Lunch',
    foodCategory: 'Rice',
    itemName: '',
    foodPrepared: '0',
    foodConsumed: '0',
    surplus: '0',
    waste: '0'
  });
  const [editErrors, setEditErrors] = useState({});

  // Delete Confirmation Modal State
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const loadFoodRecords = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const response = await foodRecordsApi.list();
      setRecords(response?.data?.records || []);
    } catch (error) {
      setLoadError(error.message || 'Unable to load food records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFoodRecords();
  }, []);

  // Apply Filters
  const filteredRecords = records.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      r.itemName.toLowerCase().includes(searchLower) ||
      r.recordId.toLowerCase().includes(searchLower) ||
      (r.station && r.station.toLowerCase().includes(searchLower));

    const matchesDate = !dateFilter || r.date === dateFilter;
    const matchesMeal = mealFilter === 'ALL' || r.mealType === mealFilter;
    const matchesCategory = categoryFilter === 'ALL' || r.foodCategory === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesDate && matchesMeal && matchesCategory && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearch('');
    setDateFilter('');
    setMealFilter('ALL');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setEditForm({
      date: rec.date,
      mealType: rec.mealType || 'Lunch',
      foodCategory: rec.foodCategory || 'Rice',
      itemName: rec.itemName,
      foodPrepared: rec.foodPrepared.toString(),
      foodConsumed: rec.foodConsumed.toString(),
      surplus: rec.surplus.toString(),
      waste: rec.waste.toString()
    });
    setEditErrors({});
  };

  const validateEdit = () => {
    const errs = {};
    const prep = parseFloat(editForm.foodPrepared) || 0;
    const cons = parseFloat(editForm.foodConsumed) || 0;
    const sur = parseFloat(editForm.surplus) || 0;
    const wst = parseFloat(editForm.waste) || 0;

    if (!editForm.date) errs.date = 'Date is required.';
    if (!editForm.itemName.trim()) errs.itemName = 'Item name is required.';
    for (const [field, value, label] of [
      ['foodPrepared', editForm.foodPrepared, 'Prepared'],
      ['foodConsumed', editForm.foodConsumed, 'Consumed'],
      ['surplus', editForm.surplus, 'Surplus'],
      ['waste', editForm.waste, 'Waste'],
    ]) {
      if (value.trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0) {
        errs[field] = `${label} quantity must be a finite non-negative number.`;
      }
    }
    if (cons > prep) errs.consumed = `Consumed (${cons} kg) cannot exceed prepared (${prep} kg).`;

    const remaining = prep - cons;
    if (!errs.foodPrepared && !errs.foodConsumed && !errs.surplus && !errs.waste && cons <= prep && (sur + wst > remaining + 0.01)) {
      errs.reconciliation = `Surplus (${sur} kg) + Waste (${wst} kg) exceeds remaining unconsumed food (${remaining.toFixed(1)} kg).`;
    }

    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!validateEdit()) return;

    setIsSavingEdit(true);
    setActionError('');
    try {
      const response = await foodRecordsApi.update(editingRecord.recordId, {
        ...editForm,
        foodPrepared: Number(editForm.foodPrepared),
        foodConsumed: Number(editForm.foodConsumed),
        surplus: Number(editForm.surplus),
        waste: Number(editForm.waste),
      });
      const updatedRecord = response.data.record;
      setRecords((prev) => prev.map((record) =>
        record.recordId === updatedRecord.recordId ? updatedRecord : record
      ));
      updateLocalFoodRecord(updatedRecord.recordId, updatedRecord);
      setEditingRecord(null);
      triggerToast(`Record #${updatedRecord.recordId} updated successfully.`);
    } catch (error) {
      setActionError(error.message || 'Unable to update this food record.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingRecord) return;
    setIsDeleting(true);
    setActionError('');
    try {
      await foodRecordsApi.delete(deletingRecord.recordId);
      deleteLocalFoodRecord(deletingRecord.recordId);
      setRecords((prev) => prev.filter((record) => record.recordId !== deletingRecord.recordId));
      triggerToast(`Record #${deletingRecord.recordId} deleted from ledger.`);
      setDeletingRecord(null);

      if (paginatedRecords.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      setActionError(error.message || 'Unable to delete this food record.');
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const totalPrepKg = records.reduce((s, r) => s + (parseFloat(r.foodPrepared) || 0), 0);
  const totalSurpKg = records.reduce((s, r) => s + (parseFloat(r.surplus) || 0), 0);
  const totalWasteKg = records.reduce((s, r) => s + (parseFloat(r.waste) || 0), 0);

  return (
    <AppLayout pageTitle="Food Records" breadcrumbs={[{ label: 'Food Records & Ledger' }]}>
      <div className="flex flex-col gap-8">

        {actionError && (
          <div role="alert" className="p-4 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-bold border border-red-200">
            {actionError}
          </div>
        )}

        {loadError && (
          <div role="alert" className="p-4 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-bold border border-red-200 flex items-center justify-between gap-4">
            <span>{loadError}</span>
            <button onClick={loadFoodRecords} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-red-200">Retry</button>
          </div>
        )}
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 p-4 rounded-2xl bg-white shadow-xl border-l-4 border-[#1B4D3E] border-[#E6E2D8]">
            <span className="material-symbols-outlined text-[#1B4D3E] text-[20px]">info</span>
            <span className="font-label-md font-bold text-[#1C2421] text-xs">{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div>
            <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">Food Records & Audit Ledger</h1>
            <p className="font-body-md text-base text-[#4A5550]">
              Comprehensive inventory of prepared food, consumption yields, surplus rescue logs, and waste streams.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/add-food-record')}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white font-label-lg font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Add Food Record</span>
            </button>
          </div>
        </div>

        {/* Summary KPI Cards Above Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Total Prepared</span>
            <span className="text-3xl font-extrabold text-[#1C2421] my-1">{totalPrepKg.toFixed(1)} kg</span>
            <span className="text-xs text-[#4A5550]">Across all kitchen stations</span>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Identified Surplus</span>
            <span className="text-3xl font-extrabold text-[#D97706] my-1">{totalSurpKg.toFixed(1)} kg</span>
            <span className="text-xs text-[#D97706] font-bold">Available for NGO rescue</span>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Total Discarded Waste</span>
            <span className="text-3xl font-extrabold text-[#DC2626] my-1">{totalWasteKg.toFixed(1)} kg</span>
            <span className="text-xs text-[#DC2626] font-bold">Tracked via IoT scales</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#4A5550] text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search record ID, item name, station..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#FAF8F5] text-[#1C2421] placeholder:text-[#4A5550] font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-[#1B4D3E] border border-[#E6E2D8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 rounded-xl bg-[#FAF8F5] text-[#1C2421] font-body-sm text-xs focus:outline-none border border-[#E6E2D8] cursor-pointer"
            />

            <select
              value={mealFilter}
              onChange={(e) => { setMealFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 rounded-xl bg-[#FAF8F5] text-[#1C2421] font-body-sm text-xs focus:outline-none border border-[#E6E2D8] cursor-pointer font-bold"
            >
              <option value="ALL">All Meals</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>

            <button onClick={handleResetFilters} className="h-10 px-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#E6E2D8] text-xs font-bold text-[#4A5550] border border-[#E6E2D8]">
              Reset
            </button>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="rounded-2xl bg-white shadow-xs overflow-hidden border border-[#E6E2D8] flex flex-col">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse font-body-md text-sm">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#4A5550] font-label-sm text-xs uppercase tracking-wider border-b border-[#E6E2D8]">
                  <th className="py-3.5 px-6">Record ID</th>
                  <th className="py-3.5 px-6">Item & Category</th>
                  <th className="py-3.5 px-6">Date & Meal</th>
                  <th className="py-3.5 px-6 text-right">Prepared</th>
                  <th className="py-3.5 px-6 text-right">Consumed</th>
                  <th className="py-3.5 px-6 text-right">Surplus</th>
                  <th className="py-3.5 px-6 text-right">Waste</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8] font-body-md text-[#1C2421]">
                {!isLoading && !loadError && paginatedRecords.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-12 px-6 text-center text-sm text-[#4A5550]">
                      No food records yet. Add a record to begin the ledger.
                    </td>
                  </tr>
                )}
                {isLoading && (
                  <tr>
                    <td colSpan="9" className="py-12 px-6 text-center text-sm text-[#4A5550]">Loading food records...</td>
                  </tr>
                )}
                {paginatedRecords.map((r) => {
                  const catMeta = categoryIconMap[r.foodCategory] || { icon: 'restaurant', color: 'bg-gray-100 text-gray-700' };
                  return (
                    <tr key={r.recordId} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 px-6 font-mono text-xs font-bold text-[#0284C7]">{r.recordId}</td>
                      
                      <td className="py-3.5 px-6 font-bold">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${catMeta.color} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined text-[18px]">{catMeta.icon}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm text-[#1C2421] truncate">{r.itemName}</span>
                            <span className="text-[11px] text-[#4A5550]">{r.foodCategory} • {r.station || 'Prep Station'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-6 text-xs text-[#4A5550] font-medium">
                        {r.date} <span className="text-[11px] text-[#1B4D3E] font-bold">({r.mealType})</span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold">{r.foodPrepared} kg</td>
                      <td className="py-3.5 px-6 text-right font-mono text-[#15803D] font-bold">{r.foodConsumed} kg</td>
                      <td className="py-3.5 px-6 text-right font-mono text-[#D97706] font-bold">{r.surplus} kg</td>
                      <td className="py-3.5 px-6 text-right font-mono text-[#DC2626] font-bold">{r.waste} kg</td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${r.statusBg || 'bg-gray-100 text-gray-800'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right space-x-1">
                        <button
                          onClick={() => {
                            setSelectedRecordId(r.recordId);
                            navigate(`/trace/${r.recordId}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E6E2D8] text-xs font-bold border border-[#E6E2D8]"
                          title="View Trace"
                        >
                          Trace
                        </button>
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 rounded-lg text-[#4A5550] hover:text-[#1B4D3E] hover:bg-[#FAF8F5]"
                          title="Edit Record"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingRecord(r)}
                          className="p-1.5 rounded-lg text-[#4A5550] hover:text-[#DC2626] hover:bg-[#FEE2E2]"
                          title="Delete Record"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-[#FAF8F5] border-t border-[#E6E2D8] flex items-center justify-between text-xs text-[#4A5550]">
            <span>Page {currentPage} of {totalPages} ({filteredRecords.length} records)</span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E6E2D8] font-bold disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E6E2D8] font-bold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Edit Record Modal */}
        {editingRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E6E2D8] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-3">
                <h3 className="font-bold text-lg text-[#1C2421]">Edit Food Record #{editingRecord.recordId}</h3>
                <button onClick={() => setEditingRecord(null)} className="text-[#4A5550]">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="flex flex-col gap-3 text-xs">
                {editErrors.reconciliation && (
                  <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] font-bold">
                    {editErrors.reconciliation}
                  </div>
                )}

                {Object.entries(editErrors).filter(([key]) => key !== 'reconciliation').map(([key, message]) => (
                  <div key={key} className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] font-bold">{message}</div>
                ))}

                {actionError && (
                  <div role="alert" className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] font-bold">{actionError}</div>
                )}

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Audit Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    required
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C2421] mb-1">Item Name</label>
                  <input
                    type="text"
                    value={editForm.itemName}
                    onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1C2421] mb-1">Prepared (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={editForm.foodPrepared}
                      onChange={(e) => setEditForm({ ...editForm, foodPrepared: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1C2421] mb-1">Consumed (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={editForm.foodConsumed}
                      onChange={(e) => setEditForm({ ...editForm, foodConsumed: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1C2421] mb-1">Surplus (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={editForm.surplus}
                      onChange={(e) => setEditForm({ ...editForm, surplus: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1C2421] mb-1">Waste (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={editForm.waste}
                      onChange={(e) => setEditForm({ ...editForm, waste: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#1C2421]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E6E2D8] flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingRecord(null)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSavingEdit} className="px-5 py-2 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#155E3D] disabled:opacity-60">
                    {isSavingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E6E2D8] flex flex-col gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">warning</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1C2421]">Delete Record?</h3>
                <p className="text-xs text-[#4A5550] mt-1">
                  Are you sure you want to delete <strong>#{deletingRecord.recordId} ({deletingRecord.itemName})</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button onClick={() => setDeletingRecord(null)} className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-[#1C2421]">
                  Cancel
                </button>
                <button onClick={handleConfirmDelete} disabled={isDeleting} className="px-5 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-bold hover:bg-red-700 disabled:opacity-60">
                  {isDeleting ? 'Deleting...' : 'Delete Record'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
