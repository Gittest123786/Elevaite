import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { getPricingPlans, PRICING_CRITERIA } from '../datastore.js';

export const PricingComparisonModal = ({
  isOpen,
  onClose,
  onSelectTier,
  prices
}) => {
  if (!isOpen) return null;

  const plans = getPricingPlans(prices);

  return (
    <div className="fixed inset-0 bg-[#1f2937]/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-4xl relative overflow-hidden flex flex-col max-h-[90vh] border border-[#1f2937]/10">
        <div className="p-4 md:p-6 border-b border-[#1f2937]/5 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#1f2937] tracking-tight">Plan comparison</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 border border-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 w-full">
            <div className="hidden md:block bg-[#1f2937] text-[#bae6fd] border-r border-slate-700">
              <div className="h-24 border-b border-slate-700 flex items-center px-6 bg-slate-800/30">
                 <span className="text-[8px] font-bold tracking-wider text-[#bae6fd]/40">Criteria</span>
              </div>
              {PRICING_CRITERIA.map((feature) => (
                <div key={feature} className="h-16 flex items-center px-6 border-b border-white/5 group hover:bg-slate-800 transition-colors">
                  <span className="text-[10px] font-bold text-white/80">{feature}</span>
                </div>
              ))}
            </div>
            {plans.map((p) => (
              <div key={p.tier} className={`border-r border-[#1f2937]/5 flex flex-col transition-colors ${p.highlight ? 'bg-white z-10 shadow-xl relative' : 'bg-slate-50/30'}`}>
                <div className="h-24 flex flex-col items-center justify-center text-center p-3 border-b border-[#1f2937]/5">
                  <h3 className="text-sm font-bold text-[#1f2937] mb-0.5">{p.tier}</h3>
                  <div className="text-base font-bold text-[#1f2937] opacity-70">{p.price}</div>
                </div>
                <div className="divide-y divide-[#1f2937]/5 flex-grow">
                  {p.features.map((feature, i) => (
                    <div key={i} className="h-16 flex flex-col justify-center px-5">
                      <span className="text-[10px] font-bold text-[#4b5563] leading-tight flex items-center gap-2">
                        {p.highlight ? <CheckCircle2 size={10} className="text-[#1f2937] opacity-60" /> : <div className="w-1 h-1 rounded-full bg-slate-200" />}
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <button onClick={() => onSelectTier(p.tier)} className={`w-full py-2.5 rounded-lg text-[9px] font-bold tracking-tight transition-all ${p.highlight ? 'bg-[#1f2937] text-white hover:bg-black' : 'bg-white border border-[#1f2937]/10 text-[#1f2937] hover:bg-slate-50'}`}>
                    {p.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};