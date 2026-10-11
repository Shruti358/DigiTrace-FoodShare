import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function FoodRecords() {
  const navigate = useNavigate();
  const { records, deleteFoodRecord, setSelectedRecordId } = useFoodRecords();

  // Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);

  // Apply Filters
  const filteredRecords = records.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      r.itemName.toLowerCase().includes(searchLower) ||
      r.recordId.toLowerCase().includes(searchLower) ||
      (r.foodCategory && r.foodCategory.toLowerCase().includes(searchLower));

    const matchesCategory = categoryFilter === 'ALL' || r.foodCategory.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'ALL' || r.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteFoodRecord(deletingId);
      setDeletingId(null);
    }
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
        return 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      case 'Composted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <AppLayout pageTitle="My Donations" breadcrumbs={[{ label: 'My Donations' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
              My Donations & Surplus Listings
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5550]">
              Manage all food records and surplus batches listed by your organization, track requests, and monitor lifecycles.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/incoming-requests')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8] text-xs font-bold shadow-xs transition-colors"
            >
              Incoming Claims
            </button>
            <button
              onClick={() => navigate('/add-food-record')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Donate Surplus Food</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-xs border border-[#E6E2D8]">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#78857E] text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search by food name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-[#FAF8F5] rounded-xl text-xs text-[#1C2421] placeholder:text-[#78857E] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E] border border-[#E6E2D8]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3 bg-[#FAF8F5] rounded-xl text-xs font-semibold text-[#1C2421] border border-[#E6E2D8] focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Proteins">Proteins</option>
              <option value="Bakery">Bakery</option>
              <option value="Grains">Grains</option>
              <option value="Salad">Salad</option>
              <option value="Dairy">Dairy</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 bg-[#FAF8F5] rounded-xl text-xs font-semibold text-[#1C2421] border border-[#E6E2D8] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Requested">Requested</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#E6E2D8] overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#4A5550] uppercase tracking-wider font-bold border-b border-[#E6E2D8]">
                  <th className="py-3.5 px-5">ID</th>
                  <th className="py-3.5 px-5">Food Item & Category</th>
                  <th className="py-3.5 px-5">Prep Date</th>
                  <th className="py-3.5 px-5 text-right">Surplus (kg)</th>
                  <th className="py-3.5 px-5 text-right">Portions</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8] text-[#1C2421]">
                {filteredRecords.map((r) => (
                  <tr key={r.recordId} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#0284C7]">{r.recordId}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#1C2421]">{r.itemName}</span>
                        <span className="text-[11px] text-[#78857E]">{r.foodCategory} • {r.mealType || 'Meal'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#4A5550]">
                      {r.date} <span className="text-[10px] text-[#78857E]">({r.time || 'Morning'})</span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-extrabold text-[#1B4D3E]">
                      {r.surplus} kg
                    </td>
                    <td className="py-3.5 px-5 text-right font-semibold text-[#1C2421]">
                      ~{Math.round((r.surplus || 0) * 2.4)} meals
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedRecordId(r.recordId);
                            navigate(`/trace/${r.recordId}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E6E2D8] text-[#1B4D3E] font-bold border border-[#E6E2D8] transition-colors"
                          title="Trace Food Journey"
                        >
                          Trace
                        </button>
                        <button
                          onClick={() => setDeletingId(r.recordId)}
                          className="p-1 text-[#78857E] hover:text-[#DC2626] rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-[#78857E]">inventory_2</span>
              <p className="text-sm font-bold text-[#1C2421]">No food records found</p>
              <p className="text-xs text-[#4A5550]">Click "Donate Surplus Food" to list your first batch.</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-[#1C2421]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E6E2D8] max-w-sm w-full p-6 flex flex-col gap-4 animate-in fade-in">
              <h3 className="text-base font-bold text-[#1C2421]">Delete Food Record?</h3>
              <p className="text-xs text-[#4A5550]">
                Are you sure you want to delete <strong>{deletingId}</strong>? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6E2D8]">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 text-xs font-bold text-[#4A5550]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
