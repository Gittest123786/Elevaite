import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { PricingComparisonModal } from './PricingComparisonModal.jsx';
import { TRUST_INDICATORS } from '../datastore.js';

export const DiscoverySection = ({ prices }) => {
  const [showComparison, setShowComparison] = useState(false);

  const handleStartOnboarding = () => {
    window.location.hash = '#onboarding';
  };

  return (
    <section className="relative pt-44 pb-24 px-10 text-center max-w-7xl mx-auto overflow-visible">
      {/* Glossy Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Version Badge - High Gloss */}
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/60 backdrop-blur-xl rounded-full mb-2 border border-white/50 text-[11px] font-bold tracking-tight text-slate-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] transition-all hover:bg-white/80 hover:shadow-indigo-500/10 cursor-default group">
          <Sparkles size={14} className="text-indigo-600 group-hover:rotate-12 transition-transform duration-500" /> 
          AI Career Intelligence v2.0
        </div>
        
        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] selection:bg-indigo-600 selection:text-white">
            Clear. <span className="relative inline-block text-blue-600">
              Simple.
              <span className="absolute -inset-1 bg-blue-50/50 blur-sm rounded-lg -z-10" />
            </span><br />
            <span className="bg-gradient-to-br from-slate-900 via-indigo-700 to-indigo-900 bg-clip-text text-transparent filter drop-shadow-sm">
              Unyielding.
            </span>
          </h1>
        </div>
        
        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600/90 font-medium leading-relaxed mb-8 tracking-tight">
          An elite career engine that dissects your strengths, bridges industry gaps, and drafts your blueprint to leadership.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-5 pt-2">
          <Button 
            onClick={handleStartOnboarding} 
            className="group relative h-14 bg-slate-900 hover:bg-slate-800 text-white px-10 rounded-full font-bold text-sm tracking-tight flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(15,23,42,0.3)] hover:shadow-indigo-500/30 overflow-hidden border-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10">Start journey</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <Button 
            onClick={() => setShowComparison(true)} 
            variant="outline"
            className="group relative h-14 bg-white/40 backdrop-blur-2xl border-white/60 text-slate-900 px-10 rounded-full font-bold text-sm tracking-tight transition-all hover:bg-white/70 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
          >
            View Plans
          </Button>
        </div>

        {/* Premium Trust Indicators */}
        <div id="features" className="mt-16 pt-12 border-t border-slate-200/60 flex flex-wrap justify-center gap-12 opacity-60">
          {TRUST_INDICATORS.map((indicator, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-default">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
              <div className="text-xs font-bold tracking-tight text-slate-400 group-hover:text-slate-900 transition-colors">{indicator.label}</div>
            </div>
          ))}
        </div>
      </div>

      <PricingComparisonModal 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
        onSelectTier={() => {
          setShowComparison(false);
          handleStartOnboarding();
        }} 
        prices={prices} 
      />
    </section>
  );
};