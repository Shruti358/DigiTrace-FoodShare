import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import AppLayout from '../components/AppLayout';
import { useFoodRecords } from '../context/FoodRecordsContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { records, surplusListings, rescueRequests } = useFoodRecords();

  // 1. Calculate the 4 core summary card values
  const {
    availableDonationsCount,
    availableDonationsKg,
    pendingRequestsCount,
    completedDonationsCount,
    foodRescuedKg,
    mealsRescuedCount
  } = useMemo(() => {
    // Available donations currently listed and ready for rescue
    const availableItems = surplusListings.filter((s) => s.status === 'Available');
    const availKg = availableItems.reduce((sum, s) => sum + (parseFloat(s.quantityKg) || 0), 0);

    // Pending requests from NGOs awaiting approval
    const pendingReqs = rescueRequests.filter((r) => r.status === 'Pending').length;

    // Completed deliveries / distributions
    const completedReqs = rescueRequests.filter((r) => ['Completed', 'Distributed', 'Received'].includes(r.status)).length;

    // Total food rescued in kg (from approved/delivered rescue requests or total surplus saved)
    let rescuedKg = rescueRequests
      .filter((r) => ['Picked Up', 'Received', 'Distributed', 'Completed'].includes(r.status))
      .reduce((sum, r) => sum + (parseFloat(r.requestedKg) || 0), 0);

    if (rescuedKg === 0) {
      rescuedKg = records.reduce((sum, r) => sum + (parseFloat(r.surplus) || 0), 0);
    }

    return {
      availableDonationsCount: availableItems.length,
      availableDonationsKg: availKg,
      pendingRequestsCount: pendingReqs,
      completedDonationsCount: completedReqs,
      foodRescuedKg: rescuedKg,
      mealsRescuedCount: Math.round(rescuedKg * 2.4)
    };
  }, [records, surplusListings, rescueRequests]);

  // 2. Small, useful impact chart data (Daily Food Rescued kg)
  const rescueChartData = useMemo(() => {
    const dayMap = {
      'Mon': 28.5,
      'Tue': 34.0,
      'Wed': 22.0,
      'Thu': 45.0,
      'Fri': 38.5,
      'Sat': 42.0,
      'Today': foodRescuedKg > 0 ? parseFloat((foodRescuedKg % 50 + 15).toFixed(1)) : 31.5
    };

    return Object.entries(dayMap).map(([day, kg]) => ({
      day,
      rescuedKg: kg,
      meals: Math.round(kg * 2.4)
    }));
  }, [foodRescuedKg]);

  // 3. Compact Recent Activity Events
  const recentActivities = [
    {
      id: 1,
      title: "Grand Hotel Banquets listed Herb-Roasted Lemon Chicken",
      detail: "18.5 kg available • Loading Dock #2",
      time: "25m ago",
      badge: "Listed",
      badgeStyle: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
      icon: "storefront"
    },
    {
      id: 2,
      title: "Hope Harbor Community Kitchen requested Baguettes & Brioche",
      detail: "9.0 kg (~22 meals) for evening shelter service",
      time: "1h ago",
      badge: "Requested",
      badgeStyle: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
      icon: "volunteer_activism"
    },
    {
      id: 3,
      title: "Pickup completed by City Mission Dispatch",
      detail: "3.0 kg grain bowls collected for senior meal handoff",
      time: "3h ago",
      badge: "Picked Up",
      badgeStyle: "bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]",
      icon: "local_shipping"
    },
    {
      id: 4,
      title: "St. Jude Youth Center distributed dinner meals",
      detail: "14.0 kg delivered & served to 32 youth attendees",
      time: "Yesterday",
      badge: "Delivered",
      badgeStyle: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
      icon: "check_circle"
    }
  ];

  return (
    <AppLayout pageTitle="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Welcome Section with 2 Primary Actions */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
              Good day, Shruti!
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5550]">
              Connect surplus food with verified community recipients and track meals in real time.
            </p>
          </div>

          {/* Two Clear Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/add-food-record')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Donate Surplus Food</span>
            </button>

            <button
              onClick={() => navigate('/surplus-food')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8] text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#1B4D3E]">search</span>
              <span>Find Food</span>
            </button>
          </div>
        </section>

        {/* 4 Useful Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Available Donations */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#4A5550] uppercase font-bold tracking-wider">Available Donations</span>
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
            </div>
            <div className="my-2.5">
              <span className="text-2xl sm:text-3xl font-black text-[#1C2421]">{availableDonationsCount}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1.5">Batches</span>
            </div>
            <span className="text-xs text-[#065F46] font-semibold">
              {availableDonationsKg.toFixed(1)} kg ready for pickup
            </span>
          </div>

          {/* Card 2: Pending Requests */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#4A5550] uppercase font-bold tracking-wider">Pending Requests</span>
              <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#92400E] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
              </div>
            </div>
            <div className="my-2.5">
              <span className="text-2xl sm:text-3xl font-black text-[#92400E]">{pendingRequestsCount}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1.5">Requests</span>
            </div>
            <span className="text-xs text-[#92400E] font-semibold">
              Awaiting provider confirmation
            </span>
          </div>

          {/* Card 3: Completed Donations */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#4A5550] uppercase font-bold tracking-wider">Completed Donations</span>
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FF] text-[#0369A1] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
              </div>
            </div>
            <div className="my-2.5">
              <span className="text-2xl sm:text-3xl font-black text-[#0369A1]">{completedDonationsCount}</span>
              <span className="text-xs font-bold text-[#4A5550] ml-1.5">Deliveries</span>
            </div>
            <span className="text-xs text-[#0369A1] font-semibold">
              Handoffs verified by recipients
            </span>
          </div>

          {/* Card 4: Food Rescued */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1B4D3E] to-[#155E3D] text-white shadow-xs border border-[#16A34A] flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#DCFCE7] uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></span>
                Food Rescued
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
              </div>
            </div>
            <div className="my-2.5">
              <span className="text-2xl sm:text-3xl font-black text-white">{foodRescuedKg.toFixed(1)}</span>
              <span className="text-xs font-bold text-[#DCFCE7] ml-1.5">kg</span>
            </div>
            <span className="text-xs text-[#DCFCE7] font-bold">
              ~{mealsRescuedCount} Meals Served to Community
            </span>
          </div>
        </section>

        {/* Middle Section: Small Impact Chart & Compact Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Small Impact Chart */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <h3 className="text-base font-bold text-[#1C2421]">Weekly Rescue Trend</h3>
                <p className="text-xs text-[#4A5550]">Kilograms of surplus food redirected (Sample 7-Day Trend)</p>
              </div>
              <span className="text-xs font-bold text-[#1B4D3E] bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
                Active Cycle
              </span>
            </div>

            <div className="h-56 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rescueChartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D8" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#4A5550' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#4A5550' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C2421', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }}
                    formatter={(val) => [`${val} kg`, 'Food Rescued']}
                  />
                  <Bar dataKey="rescuedKg" fill="#1B4D3E" radius={[6, 6, 0, 0]} name="Food Rescued (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compact Recent Activity Feed */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#E6E2D8] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <h3 className="text-base font-bold text-[#1C2421]">Recent Activity</h3>
                <p className="text-xs text-[#4A5550]">Latest food rescue events</p>
              </div>
              <button
                onClick={() => navigate('/my-requests')}
                className="text-xs font-bold text-[#1B4D3E] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]/60">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E6E2D8] flex items-center justify-center text-[#1B4D3E] shrink-0">
                    <span className="material-symbols-outlined text-[18px]">{act.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1C2421] truncate">{act.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${act.badgeStyle}`}>
                        {act.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#4A5550] truncate">{act.detail}</span>
                    <span className="text-[10px] text-[#78857E] mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Food Listings & Status Section */}
        <section className="bg-white rounded-2xl shadow-xs border border-[#E6E2D8] overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E2D8]">
            <div>
              <h3 className="text-base font-bold text-[#1C2421]">Active Surplus Food Batches</h3>
              <p className="text-xs text-[#4A5550]">Current donations in the DigiTrace network ready for claim or in progress</p>
            </div>

            <button
              onClick={() => navigate('/surplus-food')}
              className="text-xs font-bold text-[#1B4D3E] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore Marketplace</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#4A5550] uppercase tracking-wider font-bold border-b border-[#E6E2D8]">
                  <th className="py-3 px-5">Food Item</th>
                  <th className="py-3 px-5">Provider</th>
                  <th className="py-3 px-5">Quantity / Meals</th>
                  <th className="py-3 px-5">Pickup Deadline</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8] text-[#1C2421]">
                {surplusListings.slice(0, 4).map((listing) => (
                  <tr key={listing.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-5 font-bold">
                      <div className="flex flex-col">
                        <span>{listing.title}</span>
                        <span className="text-[10px] text-[#78857E] font-mono">{listing.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-[#4A5550]">{listing.provider}</td>
                    <td className="py-3 px-5 font-semibold">
                      {listing.quantityKg} kg <span className="text-[#78857E] font-normal">(~{listing.servings} meals)</span>
                    </td>
                    <td className="py-3 px-5 text-[#4A5550]">{listing.expiryWindow || 'Today'}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        listing.status === 'Available' ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' :
                        listing.status === 'Requested' ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]' :
                        listing.status === 'Pickup Scheduled' ? 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]' :
                        'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => navigate(`/trace/${listing.recordId || 'DT-F-0001'}`)}
                        className="px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E6E2D8] text-[#1B4D3E] font-bold border border-[#E6E2D8] transition-colors text-xs"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
