import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroImage = "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80";
  const volunteerImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80";

  const partnerNgos = [
    { name: "Helping Hands Foundation", location: "Lucknow", meals: "420 meals received", status: "Verified 501(c)(3)" },
    { name: "Robin Hood Army", location: "Delhi NCR", meals: "1,850 meals received", status: "Verified Partner" },
    { name: "Food For All Relief Trust", location: "Kanpur", meals: "640 meals received", status: "Verified NGO" },
    { name: "Akshaya Community Kitchen", location: "Varanasi", meals: "920 meals received", status: "Verified NGO" }
  ];

  return (
    <div className="bg-[#FAF8F5] font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E2D8] shadow-xs">
        <div className="h-20 max-w-[1600px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-lg">
            <Link to="/" className="flex items-center gap-space-sm">
              <Logo className="h-9 w-auto" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-[#1C2421] font-extrabold leading-tight">DigiTrace</span>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#1B4D3E] font-bold">Food Rescue & Waste Platform</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-space-xl ml-space-xl">
              <Link to="/" className="transition-colors text-[#1B4D3E] font-label-lg font-bold">Home</Link>
              <a href="#features" className="font-label-lg text-[#4A5550] hover:text-[#1C2421] transition-colors">Platform Features</a>
              <a href="#how-it-works" className="font-label-lg text-[#4A5550] hover:text-[#1C2421] transition-colors">Rescue Lifecycle</a>
              <a href="#partners" className="font-label-lg text-[#4A5550] hover:text-[#1C2421] transition-colors">Rescue Partners</a>
              <Link to="/surplus-food" className="font-label-lg text-[#D97706] hover:text-[#B45309] font-bold transition-colors">Surplus Marketplace</Link>
            </nav>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-space-sm">
              <Link to="/login" className="inline-flex items-center justify-center px-space-md py-space-xs font-label-lg text-[#1C2421] hover:text-[#1B4D3E] transition-colors font-semibold">
                Login
              </Link>
              <Link to="/dashboard" className="inline-flex items-center justify-center px-space-md py-2 rounded-xl bg-[#1B4D3E] text-white font-label-lg hover:bg-[#155E3D] transition-colors shadow-sm font-semibold">
                Start Tracking
              </Link>
            </div>
            
            <Link to="/profile" className="w-9 h-9 rounded-full bg-[#1B4D3E] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>

            <button 
              aria-label="Toggle Mobile Menu" 
              className="lg:hidden p-space-xs text-[#4A5550] hover:text-[#1C2421] flex items-center justify-center" 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E6E2D8] px-margin-mobile py-space-md flex flex-col gap-space-sm shadow-lg">
            <Link to="/" className="py-2 text-[#1B4D3E] font-bold" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <a href="#features" className="py-2 text-[#4A5550]" onClick={() => setMobileMenuOpen(false)}>Platform Features</a>
            <a href="#how-it-works" className="py-2 text-[#4A5550]" onClick={() => setMobileMenuOpen(false)}>Rescue Lifecycle</a>
            <a href="#partners" className="py-2 text-[#4A5550]" onClick={() => setMobileMenuOpen(false)}>Rescue Partners</a>
            <Link to="/surplus-food" className="py-2 text-[#D97706] font-bold" onClick={() => setMobileMenuOpen(false)}>Surplus Marketplace</Link>
            <Link to="/dashboard" className="py-2 text-[#1B4D3E] font-bold" onClick={() => setMobileMenuOpen(false)}>Executive Dashboard</Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E6E2D8]">
              <Link to="/login" className="w-full text-center py-2 bg-[#F4F1E8] rounded-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/dashboard" className="w-full text-center py-2 bg-[#1B4D3E] text-white rounded-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Start Tracking</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-[#FAF8F5] min-h-[calc(100vh-280px)]">
        <div className="flex flex-col w-full">
          {/* SECTION 1: HERO SECTION */}
          <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4F8F5] to-[#FAF8F5] py-space-2xl lg:py-24 border-b border-[#E6E2D8]">
            {/* Subtle leaf accent background glow */}
            <div className="absolute -top-24 right-10 w-[600px] h-[600px] bg-[#1B4D3E]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
            
            <div className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Side: Hero Copy */}
                <div className="lg:col-span-6 flex flex-col gap-space-lg">
                  <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#E2EFE7] text-[#1B4D3E] font-label-sm text-xs font-bold border border-[#A7F3D0]">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                    <span>FOOD RESCUE & CIRCULAR SUSTAINABILITY PLATFORM</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-[#1B4D3E] font-extrabold text-lg tracking-wider uppercase">DigiTrace Platform</span>
                    <h1 className="font-display-lg text-4xl lg:text-[48px] lg:leading-[56px] text-[#1C2421] font-black tracking-tight">
                      Track Food. <span className="text-[#1B4D3E]">Rescue Surplus.</span> <span className="text-[#D97706]">Reduce Waste.</span>
                    </h1>
                  </div>

                  <p className="font-body-lg text-body-lg text-[#4A5550] max-w-xl leading-relaxed">
                    DigiTrace connects food providers with verified rescue organizations and NGOs, providing end-to-end food lifecycle tracking from kitchen prep to distribution and zero-landfill audit outcomes.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B4D3E] text-white font-label-lg shadow-md hover:bg-[#155E3D] transition-all font-bold text-base">
                      <span>Start Tracking</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                    
                    <Link to="/surplus-food" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#D97706] border border-[#FDE68A] shadow-xs hover:bg-[#FEF3C7] transition-all font-bold text-base">
                      <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                      <span>Explore Food Rescue</span>
                    </Link>
                  </div>

                  {/* Highlight Metric Badges */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E6E2D8] mt-2">
                    <div className="flex flex-col p-4 rounded-xl bg-white border border-[#E6E2D8] shadow-xs">
                      <span className="font-headline-lg text-2xl text-[#1B4D3E] font-extrabold">1,240 kg</span>
                      <span className="font-label-sm text-xs text-[#4A5550] font-semibold mt-0.5">Food Rescued</span>
                    </div>
                    <div className="flex flex-col p-4 rounded-xl bg-white border border-[#E6E2D8] shadow-xs">
                      <span className="font-headline-lg text-2xl text-[#D97706] font-extrabold">86 Active</span>
                      <span className="font-label-sm text-xs text-[#4A5550] font-semibold mt-0.5">NGO Partners</span>
                    </div>
                    <div className="flex flex-col p-4 rounded-xl bg-white border border-[#E6E2D8] shadow-xs">
                      <div className="flex items-center gap-1 text-[#16A34A]">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span className="font-headline-lg text-2xl text-[#1C2421] font-extrabold">94.2%</span>
                      </div>
                      <span className="font-label-sm text-xs text-[#4A5550] font-semibold mt-0.5">Waste Diverted</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Visual Food-Rescue Card Container */}
                <div className="lg:col-span-6 relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white card-hover">
                    <img 
                      src={heroImage} 
                      alt="Fresh surplus food packed for rescue" 
                      className="w-full h-[460px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Floating Overlay Badge 1 (Top Left) */}
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
                      </div>
                      <div>
                        <span className="block font-bold text-xs uppercase tracking-wide text-[#4A5550]">Rescue Network</span>
                        <span className="block font-bold text-sm text-[#1C2421]">Fresh Meals Saved Daily</span>
                      </div>
                    </div>

                    {/* Floating Overlay Badge 2 (Bottom Right) */}
                    <div className="absolute bottom-6 right-6 left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                        </div>
                        <div>
                          <span className="block font-bold text-xs uppercase tracking-wide text-[#854D0E]">Active Dispatch</span>
                          <span className="block font-extrabold text-base text-[#1C2421]">Hope Harbor Community Kitchen</span>
                          <span className="block text-xs text-[#4A5550]">Pickup ETA: 25 mins • 45.0 kg surplus</span>
                        </div>
                      </div>
                      <Link to="/surplus-food" className="px-4 py-2 bg-[#1B4D3E] text-white rounded-xl text-xs font-bold hover:bg-[#155E3D] transition-colors shrink-0">
                        View Marketplace
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SECTION 2: 4 CORE FEATURE CARDS */}
          <section id="features" className="w-full bg-white py-20 border-b border-[#E6E2D8]">
            <div className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin flex flex-col gap-12">
              <div className="flex flex-col gap-2 max-w-2xl">
                <span className="font-label-sm text-xs uppercase tracking-wider text-[#1B4D3E] font-bold">POWERFUL CAPABILITIES</span>
                <h2 className="font-headline-lg text-3xl lg:text-[36px] text-[#1C2421] font-bold tracking-tight">
                  Comprehensive Food Waste & Rescue Ecosystem
                </h2>
                <p className="font-body-md text-base text-[#4A5550]">
                  DigiTrace brings precision tracking, automated NGO surplus matching, full chain-of-custody traceability, and executive impact analytics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Feature 1: Food Rescue */}
                <Link to="/surplus-food" className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] shadow-xs flex flex-col justify-between group hover:border-[#1B4D3E] hover:bg-white transition-all card-hover">
                  <div className="flex flex-col gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[32px]">volunteer_activism</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-headline-sm text-xl text-[#1C2421] font-bold">Food Rescue</h3>
                      <p className="font-body-md text-sm text-[#4A5550] leading-relaxed">
                        Redirect wholesome, safe surplus food to local community centers and hunger-relief agencies in real time.
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-[#E6E2D8] flex items-center justify-between text-[#D97706] font-bold text-sm">
                    <span>Surplus Marketplace</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </Link>

                {/* Feature 2: Waste Tracking */}
                <Link to="/waste-tracking" className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] shadow-xs flex flex-col justify-between group hover:border-[#1B4D3E] hover:bg-white transition-all card-hover">
                  <div className="flex flex-col gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[32px]">delete_sweep</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-headline-sm text-xl text-[#1C2421] font-bold">Waste Tracking</h3>
                      <p className="font-body-md text-sm text-[#4A5550] leading-relaxed">
                        Log prep discards and line waste by cause, weight, and station to eliminate avoidable over-preparation.
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-[#E6E2D8] flex items-center justify-between text-[#15803D] font-bold text-sm">
                    <span>Discard Ledger</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </Link>

                {/* Feature 3: Food Traceability */}
                <Link to="/trace/DT-F-0001" className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] shadow-xs flex flex-col justify-between group hover:border-[#1B4D3E] hover:bg-white transition-all card-hover">
                  <div className="flex flex-col gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[32px]">account_tree</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-headline-sm text-xl text-[#1C2421] font-bold">Food Traceability</h3>
                      <p className="font-body-md text-sm text-[#4A5550] leading-relaxed">
                        Visual step-by-step chain-of-custody journey tracking food from preparation through donation or composting.
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-[#E6E2D8] flex items-center justify-between text-[#0284C7] font-bold text-sm">
                    <span>Lifecycle Timeline</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </Link>

                {/* Feature 4: Impact Analytics */}
                <Link to="/analytics" className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] shadow-xs flex flex-col justify-between group hover:border-[#1B4D3E] hover:bg-white transition-all card-hover">
                  <div className="flex flex-col gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[32px]">monitoring</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-headline-sm text-xl text-[#1C2421] font-bold">Impact Analytics</h3>
                      <p className="font-body-md text-sm text-[#4A5550] leading-relaxed">
                        Measure CO2e mitigation, landfill avoidance percentage, tax deductions, and financial purchasing savings.
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-[#E6E2D8] flex items-center justify-between text-[#7E22CE] font-bold text-sm">
                    <span>Executive Analytics</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 3: RESCUE LIFECYCLE BREAKDOWN */}
          <section id="how-it-works" className="w-full bg-[#FAF8F5] py-20 border-b border-[#E6E2D8]">
            <div className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin flex flex-col gap-12">
              <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
                <span className="font-label-sm text-xs uppercase tracking-wider text-[#1B4D3E] font-extrabold">VERIFIED AUDIT FLOW</span>
                <h2 className="font-headline-lg text-3xl lg:text-[38px] text-[#1C2421] font-bold tracking-tight">
                  The DigiTrace Food Rescue Journey
                </h2>
                <p className="font-body-md text-base text-[#4A5550]">
                  How DigiTrace seamlessly turns kitchen surplus into community meals and verified zero-landfill impact.
                </p>
              </div>

              {/* Horizontal Lifecycle Steps */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
                {[
                  { step: "01", title: "FOOD PREPARED", desc: "Batch cooked & logged at kitchen station", icon: "skillet", color: "bg-[#E2EFE7] text-[#1B4D3E]" },
                  { step: "02", title: "SURPLUS IDENTIFIED", desc: "Edible excess tagged with safety window", icon: "fact_check", color: "bg-[#FEF3C7] text-[#D97706]" },
                  { step: "03", title: "LISTED FOR RESCUE", desc: "Posted to DigiTrace NGO Marketplace", icon: "storefront", color: "bg-[#E0F2FE] text-[#0284C7]" },
                  { step: "04", title: "NGO REQUESTED", desc: "Claimed by verified partner NGO", icon: "volunteer_activism", color: "bg-[#F3E8FF] text-[#7E22CE]" },
                  { step: "05", title: "COURIER PICKUP", desc: "Temperature checked & handed over", icon: "local_shipping", color: "bg-[#FFEDD5] text-[#C2410C]" },
                  { step: "06", title: "COMMUNITY IMPACT", desc: "Served as meals to people in need", icon: "sentiment_very_satisfied", color: "bg-[#DCFCE7] text-[#15803D]" }
                ].map((s, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs flex flex-col justify-between gap-4 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#4A5550]">{s.step}</span>
                      <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C2421] leading-tight mb-1">{s.title}</h4>
                      <p className="text-xs text-[#4A5550] leading-snug">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: NGO PARTNER TRUST SECTION */}
          <section id="partners" className="w-full bg-white py-20">
            <div className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin flex flex-col gap-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2 max-w-xl">
                  <span className="font-label-sm text-xs uppercase tracking-wider text-[#D97706] font-bold">TRUSTED COMMUNITY NETWORK</span>
                  <h2 className="font-headline-lg text-3xl lg:text-[34px] text-[#1C2421] font-bold tracking-tight">
                    Verified Rescue Partners
                  </h2>
                  <p className="font-body-md text-base text-[#4A5550]">
                    DigiTrace connects commercial food operations directly with accredited local non-profit organizations.
                  </p>
                </div>
                
                <Link to="/surplus-food" className="inline-flex items-center gap-2 text-[#1B4D3E] font-bold hover:underline">
                  <span>View All Partner Claims</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {partnerNgos.map((ngo, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] shadow-xs flex flex-col justify-between gap-4 hover:border-[#1B4D3E] transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-lg shrink-0">
                        {ngo.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-base text-[#1C2421] truncate">{ngo.name}</h3>
                        <span className="text-xs text-[#4A5550] flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px] text-[#D97706]">location_on</span>
                          {ngo.location}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E6E2D8] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                        {ngo.status}
                      </span>
                      <span className="text-xs font-bold text-[#1C2421]">
                        {ngo.meals}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1C2421] text-white py-12 border-t border-[#2D3834]">
        <div className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto" />
            <span className="font-bold text-white text-base">DigiTrace</span>
            <span>• Food Rescue & Waste Management Platform</span>
          </div>
          <p>© 2026 DigiTrace Platform. All rights reserved. Zero Landfill Initiative.</p>
        </div>
      </footer>
    </div>
  );
}
