
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export const OnboardingStepPaymentSummary = ({ selectedPrice, onInitiatePayment }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      if (onInitiatePayment) {
        onInitiatePayment();
      }
      setIsRedirecting(false);
    }, 400);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[280px] mx-auto relative">
      <div className="relative bg-white/70 backdrop-blur-3xl p-8 rounded-[2rem] border border-white shadow-lg text-center overflow-hidden">
        <div className="inline-flex p-3 bg-indigo-50 rounded-xl mb-4 border border-white">
          <CreditCard size={20} className="text-indigo-600" />
        </div>

        <div className="text-[9px] font-bold text-slate-400 mb-1 tracking-tight">
          Summary Total
        </div>
        
        <div className="relative inline-block mb-6">
          <div className="text-4xl font-bold text-slate-950 tracking-tighter">
            {selectedPrice}
          </div>
        </div>

        <button
          type="button"
          disabled={isRedirecting}
          onClick={handleClick}
          className="group relative w-full py-4 bg-slate-950 text-white rounded-xl font-bold text-[9px] tracking-widest transition-all shadow-md hover:bg-indigo-600 active:scale-95 disabled:opacity-80"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isRedirecting ? (
              <>
                <Loader2 size={12} className="animate-spin text-sky-300" />
                Initializing...
              </>
            ) : (
              <>
                Secure Payment
                <ArrowRight size={14} className="text-sky-400" />
              </>
            )}
          </div>
        </button>

        <div className="mt-6 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 tracking-tight opacity-60">
            <ShieldCheck size={10} className="text-emerald-500" />
            PCI Level 1 Security
          </div>
          <p className="text-[7px] font-bold text-slate-300 tracking-tight">
            Encrypted by elevAIte Gateway
          </p>
        </div>
      </div>
    </div>
  );
};
