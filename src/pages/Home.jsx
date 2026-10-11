import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // High quality curated food rescue photography
  const heroFoodImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80";

  const partnerNgos = [
    { name: "Helping Hands Kitchen", location: "Community Shelter", meals: "420 meals received" },
    { name: "Robin Hood Food Network", location: "City Relief Center", meals: "1,850 meals received" },
    { name: "Food For All Trust", location: "Youth Dining Hall", meals: "640 meals received" },
    { name: "Akshaya Community Meals", location: "Elderly Care Center", meals: "920 meals received" }
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#1C2421] min-h-screen flex flex-col justify-between selection:bg-[#1B4D3E] selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E2D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-[#1B4D3E]" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#1C2421] tracking-tight leading-tight">DigiTrace</span>
              <span className="text-[11px] text-[#1B4D3E] font-bold uppercase tracking-wider">Food Rescue & Trace</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4A5550]">
            <Link to="/surplus-food" className="hover:text-[#1B4D3E] transition-colors">Find Food</Link>
            <a href="#how-it-works" className="hover:text-[#1B4D3E] transition-colors">How It Works</a>
            <a href="#impact" className="hover:text-[#1B4D3E] transition-colors">Impact</a>
            <Link to="/dashboard" className="hover:text-[#1B4D3E] transition-colors">Dashboard</Link>
          </nav>

          {/* CTA Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-[#4A5550] hover:text-[#1C2421] transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-sm font-bold shadow-xs transition-colors"
            >
              Open Platform
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#4A5550] hover:text-[#1C2421]"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E6E2D8] px-6 py-4 flex flex-col gap-3 shadow-md">
            <Link to="/surplus-food" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-bold text-[#1C2421]">Find Food</Link>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm text-[#4A5550]">How It Works</a>
            <a href="#impact" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm text-[#4A5550]">Impact</a>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-bold text-[#1B4D3E]">Dashboard</Link>
            <div className="flex items-center gap-2 pt-2 border-t border-[#E6E2D8]">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2 text-center text-sm font-bold bg-[#FAF8F5] rounded-xl border border-[#E6E2D8]">Log in</Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2 text-center text-sm font-bold bg-[#1B4D3E] text-white rounded-xl">Open Platform</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-bold border border-[#A7F3D0]">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span>Connecting Food Donors & Verified NGOs</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C2421] tracking-tight leading-[1.15]">
                Rescuing Surplus Food. <br />
                <span className="text-[#1B4D3E]">Feeding Communities.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#4A5550] leading-relaxed max-w-xl">
                DigiTrace bridges restaurants with local NGOs to redirect edible surplus food to people in need, with transparent tracking from kitchen to delivery.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/add-food-record"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B4D3E] hover:bg-[#155E3D] text-white text-sm font-bold shadow-xs transition-all hover:translate-y-[-1px]"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Donate Surplus Food</span>
                </Link>

                <Link
                  to="/surplus-food"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C2421] border border-[#E6E2D8] text-sm font-bold shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#1B4D3E]">search</span>
                  <span>Find Food</span>
                </Link>
              </div>

              {/* Trust Subtext */}
              <div className="flex items-center gap-6 pt-3 text-xs text-[#52796F] font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                  Freshness Windows
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                  Verified Non-Profits
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                  Chain of Custody
                </span>
              </div>
            </div>

            {/* Right Food Photo Card */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E6E2D8] bg-white relative">
                <img
                  src={heroFoodImage}
                  alt="Food rescue distribution to community"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                {/* Floating summary badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#1C2421]">Active Community Rescue</span>
                      <span className="block text-[11px] text-[#4A5550]">Batches ready for immediate pickup</span>
                    </div>
                  </div>
                  <Link
                    to="/surplus-food"
                    className="px-3 py-1.5 bg-[#1B4D3E] text-white text-xs font-bold rounded-lg hover:bg-[#155E3D] transition-colors"
                  >
                    View Food
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS IN 3 STEPS */}
        <section id="how-it-works" className="py-16 bg-white border-y border-[#E6E2D8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-10">
            <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#1B4D3E]">SIMPLE WORKFLOW</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">How DigiTrace Works</h2>
              <p className="text-sm text-[#4A5550]">
                A seamless process connecting excess food with accredited recipients in three clear steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] flex flex-col justify-between gap-4 card-hover">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">restaurant</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1C2421] mb-1">List Surplus Food</h3>
                  <p className="text-xs text-[#4A5550] leading-relaxed">
                    Food providers post wholesome surplus with portions, preparation time, and designated pickup deadlines.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-[#52796F] font-bold">
                  Fast 1-minute listing form
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] flex flex-col justify-between gap-4 card-hover">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#92400E] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1C2421] mb-1">Match & Request</h3>
                  <p className="text-xs text-[#4A5550] leading-relaxed">
                    Accredited NGOs and food pantries browse nearby donations and submit claim requests for distribution.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-[#92400E] font-bold">
                  Direct donor confirmation
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] flex flex-col justify-between gap-4 card-hover">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#0369A1] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">route</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1C2421] mb-1">Track & Distribute</h3>
                  <p className="text-xs text-[#4A5550] leading-relaxed">
                    Follow the donation journey step-by-step from kitchen pickup to verified delivery and meal distribution.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-[#0369A1] font-bold">
                  Transparent chain of custody
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPACT IMPACT SECTION */}
        <section id="impact" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-[#1B4D3E]">MEASURABLE OUTCOMES</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight mt-1">Platform Impact</h2>
                <p className="text-xs sm:text-sm text-[#4A5550] mt-0.5">
                  Real project figures and verified sample metrics recorded across active rescue cycles.
                </p>
              </div>
              <Link
                to="/reports"
                className="text-xs font-bold text-[#1B4D3E] hover:underline flex items-center gap-1"
              >
                <span>View Impact Reports</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Food Rescued</span>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#1B4D3E]">1,240</span>
                  <span className="text-xs font-bold text-[#4A5550] ml-1">kg</span>
                </div>
                <span className="text-[11px] text-[#065F46] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">eco</span> Diverted from landfills
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Meals Provided</span>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#D97706]">~2,950</span>
                  <span className="text-xs font-bold text-[#4A5550] ml-1">meals</span>
                </div>
                <span className="text-[11px] text-[#4A5550] font-semibold">
                  Standard 0.42 kg/portion
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">Partner NGOs</span>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#0284C7]">86</span>
                  <span className="text-xs font-bold text-[#4A5550] ml-1">orgs</span>
                </div>
                <span className="text-[11px] text-[#0284C7] font-semibold">
                  Verified community networks
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">CO2e Mitigated</span>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#15803D]">2,728</span>
                  <span className="text-xs font-bold text-[#4A5550] ml-1">kg</span>
                </div>
                <span className="text-[11px] text-[#15803D] font-semibold">
                  Methane emissions avoided
                </span>
              </div>
            </div>

            {/* Compact Community Partners Row */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6E2D8] flex flex-col gap-4">
              <span className="text-xs font-bold text-[#4A5550] uppercase tracking-wider">
                Partner Non-Profit Organizations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {partnerNgos.map((ngo, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {ngo.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-[#1C2421] truncate">{ngo.name}</span>
                      <span className="text-[11px] text-[#4A5550]">{ngo.meals}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1C2421] text-white py-8 border-t border-[#2D3834]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-auto text-white" />
            <span className="font-bold text-white">DigiTrace</span>
            <span>— Food Waste Reduction & Rescue Platform</span>
          </div>
          <p>© 2026 DigiTrace. B.Tech Final Year CSE Capstone.</p>
        </div>
      </footer>
    </div>
  );
}
