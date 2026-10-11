import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

export default function EcologicalIntelligence() {
  const navigate = useNavigate();

  const recommendations = [
    {
      id: "REC-1",
      title: "Optimize Batch Sizing for Lunch Service",
      desc: "Weekly donation records indicate a recurring surplus of poultry preparations on Thursday afternoons. Reducing batch cooking by 5 kg aligns with immediate demand while keeping surplus fresh.",
      savings: "~12 kg/week saved",
      icon: "trending_down"
    },
    {
      id: "REC-2",
      title: "Fast-Track Bakery Surplus Pickup",
      desc: "Artisan breads and brioche batches have the highest claim speed when posted before 11:30 AM, ensuring local shelters receive items for midday distribution.",
      savings: "98% Claim Match Rate",
      icon: "schedule"
    },
    {
      id: "REC-3",
      title: "Community Outreach Recognition",
      desc: "Your organization reached a milestone of 1,240 kg rescued food, redirecting wholesome meals to four local partner non-profits and preventing landfill methane emissions.",
      savings: "Community Verified",
      icon: "verified"
    }
  ];

  return (
    <AppLayout pageTitle="Rescue Insights" breadcrumbs={[{ label: 'Impact & Reports', path: '/reports' }, { label: 'Rescue Insights' }]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-bold self-start border border-[#A7F3D0]">
              <span className="material-symbols-outlined text-[16px]">tips_and_updates</span>
              <span>SMART RESCUE OPTIMIZATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] tracking-tight">
              Food Waste Reduction Insights
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5550] max-w-2xl">
              Practical recommendations to minimize overproduction and maximize the rescue impact of surplus food.
            </p>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="h-10 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#1C2421] text-xs font-bold transition-colors shrink-0"
          >
            Back to Reports
          </button>
        </div>

        {/* Recommendation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between gap-4 card-hover"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#1B4D3E] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">{rec.icon}</span>
                </div>
                <h3 className="font-bold text-base text-[#1C2421]">{rec.title}</h3>
                <p className="text-xs text-[#4A5550] leading-relaxed">
                  {rec.desc}
                </p>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F5] text-[#1B4D3E] border border-[#E6E2D8] self-start">
                {rec.savings}
              </span>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  );
}
