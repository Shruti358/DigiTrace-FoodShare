import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { mockAnalyticsData } from '../data/mockData';

export default function EcologicalIntelligence() {
  const navigate = useNavigate();
  const recommendations = mockAnalyticsData.aiRecommendations;

  return (
    <AppLayout pageTitle="Ecological Intelligence" breadcrumbs={[{ label: 'Analytics', path: '/analytics' }, { label: 'Ecological Intelligence' }]}>
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EFE7] text-[#1B4D3E] font-label-sm text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>AI PREDICTIVE CULINARY OPTIMIZATION</span>
            </div>
            <h1 className="font-display-lg text-3xl font-extrabold text-[#1C2421] tracking-tight">Ecological Intelligence Engine</h1>
            <p className="font-body-md text-base text-[#4A5550] max-w-2xl mt-1">
              Machine-learning telemetry forecasting overproduction, carbon footprint reduction, and prep scheduling optimizations.
            </p>
          </div>
          <button onClick={() => navigate('/analytics')} className="h-10 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#1C2421] text-xs font-bold transition-colors">
            Back to Analytics
          </button>
        </div>

        {/* AI Recommendation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-6 rounded-2xl bg-white shadow-xs border border-[#E6E2D8] flex flex-col justify-between gap-4 card-hover">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[26px]">lightbulb</span>
                </div>
                <h3 className="font-bold text-lg text-[#1C2421]">{rec.title}</h3>
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
