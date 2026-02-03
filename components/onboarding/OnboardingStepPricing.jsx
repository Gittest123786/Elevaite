
import React from 'react';
import { PricingTier } from '../../app/types.js';
import { ChevronRight } from 'lucide-react';

export const OnboardingStepPricing = ({ prices, onSelectTier, onShowComparison }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-sm mx-auto">
      <div className="text-center space-y-0.5">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Select your plan</h3>
        <p className="text-[8px] font-bold text-indigo-600 opacity-80">Elite Intelligence Access</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {[
          { t: PricingTier.STARTER, p: prices.l, n: 'Starter', desc: 'Core features' },
          { t: PricingTier.PRO, p: prices.a, n: 'Pro', desc: 'Advanced analysis', highlight: true },
          { t: PricingTier.ELITE, p: prices.p, n: 'Elite', desc: 'Full executive suite' }
        ].map(tier => (
          <button 
            key={tier.t} 
            onClick={() => onSelectTier(tier.t)} 
            className="group relative p-px rounded-xl transition-all hover:scale-[1.01] active:scale-98"
          >
            <div className={`
              relative flex items-center justify-between px-4 py-3 rounded-[0.7rem] border backdrop-blur-2xl transition-all
              ${tier.highlight 
                ? 'bg-white/90 shadow-md border-indigo-200' 
                : 'bg-white/40 border-white/80 shadow-sm hover:bg-white/60'}
            `}>
              <div className="flex flex-col items-start relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[8px] font-bold ${tier.highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {tier.n}
                  </span>
                  {tier.highlight && (
                    <span className="bg-indigo-600 text-white text-[6px] font-bold px-1.5 py-0.5 rounded-full tracking-tight">Best Value</span>
                  )}
                </div>
                <div className="text-[8px] font-bold text-slate-500 opacity-80">{tier.desc}</div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <div className="text-base font-bold text-slate-900 tracking-tight">{tier.p}</div>
                <div className="p-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100">
                  <ChevronRight size={10} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button 
          onClick={onShowComparison} 
          className="group relative inline-flex items-center gap-1 text-[8px] font-bold text-slate-400 hover:text-indigo-600 transition-all"
        >
          Detailed Comparison
        </button>
      </div>
    </div>
  );
};
