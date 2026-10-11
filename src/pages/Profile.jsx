import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function Profile() {
  const navigate = useNavigate();
  const { records, surplusListings, rescueRequests } = useFoodRecords();

  const totalBatches = records.length;
  const totalSurplusKg = records.reduce((sum, r) => sum + (parseFloat(r.surplus) || 0), 0);
  const activeClaims = rescueRequests.filter((r) => r.status === 'Pending').length;

  return (
    <AppLayout pageTitle="User Profile" breadcrumbs={[{ label: 'Profile' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-1 pb-4 border-b border-[#E6E2D8]">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
            Organization Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5550]">
            Manage your food provider account, facility pickup coordinates, and contact details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* User Card */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col items-center text-center gap-4 card-hover">
            <div className="w-20 h-20 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[40px]">person</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C2421]">Shruti Sharma</h2>
              <p className="text-xs font-bold text-[#1B4D3E] mt-0.5">Kitchen Operations & Food Provider Lead</p>
              <p className="text-xs text-[#78857E] mt-1">shruti@pacificrim-dining.org</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-bold border border-[#A7F3D0]">
              Verified Food Donor Node
            </span>

            <div className="w-full pt-4 border-t border-[#E6E2D8] flex items-center justify-around text-center">
              <div>
                <span className="text-lg font-black text-[#1C2421] block">{totalBatches}</span>
                <span className="text-[10px] text-[#78857E] uppercase font-bold">Batches</span>
              </div>
              <div>
                <span className="text-lg font-black text-[#1B4D3E] block">{totalSurplusKg.toFixed(0)} kg</span>
                <span className="text-[10px] text-[#78857E] uppercase font-bold">Donated</span>
              </div>
              <div>
                <span className="text-lg font-black text-[#D97706] block">{activeClaims}</span>
                <span className="text-[10px] text-[#78857E] uppercase font-bold">Pending</span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <h3 className="text-base font-bold text-[#1C2421]">Facility & Organization Details</h3>
              <button
                onClick={() => navigate('/settings')}
                className="text-xs font-bold text-[#1B4D3E] hover:underline"
              >
                Edit in Settings
              </button>
            </div>
            
            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#78857E]">Organization Name:</span>
                <span className="font-bold text-[#1C2421]">Pacific Rim Culinary Center & Banquets</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#78857E]">Account Type:</span>
                <span className="font-bold text-[#1B4D3E]">Commercial Kitchen / Food Donor</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#78857E]">Default Pickup Loading Bay:</span>
                <span className="font-bold text-[#1C2421]">Loading Dock #2, North Service Bay</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#78857E]">Contact Phone:</span>
                <span className="font-bold text-[#1C2421]">+1 (555) 234-5678</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between">
                <span className="font-bold text-[#78857E]">Rescue Partner Network Status:</span>
                <span className="font-bold text-[#10B981]">Active & Connected (86 Partner NGOs)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => navigate('/add-food-record')}
                className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs font-bold shadow-xs transition-colors"
              >
                + List New Surplus Food
              </button>
              <button
                onClick={() => navigate('/surplus-food')}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E6E2D8] text-[#1C2421] text-xs font-bold border border-[#E6E2D8] transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
