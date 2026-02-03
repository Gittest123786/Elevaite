
import React from 'react';
import { UserPlus, LogIn, ArrowRight } from 'lucide-react';

export const OnboardingStepChoice = ({ onSelectAction }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      {/* New Journey Card */}
      <button 
        onClick={() => onSelectAction(false)}
        className="group relative p-px bg-white/20 rounded-[1.5rem] transition-all hover:scale-[1.01] active:scale-95"
      >
        <div className="relative h-full p-6 bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[1.45rem] text-center overflow-hidden shadow-sm group-hover:shadow-md transition-all">
          <div className="relative z-10">
            <div className="bg-slate-900 p-3 rounded-xl mb-4 mx-auto w-fit shadow-md border border-white/10">
              <UserPlus size={22} className="text-sky-300" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight group-hover:text-indigo-600 transition-colors">New journey</h4>
            <p className="text-slate-500 font-bold text-[9px] leading-relaxed max-w-[150px] mx-auto opacity-70">
              Dissect strengths & grow your leadership career.
            </p>
            <div className="mt-4 flex items-center justify-center gap-1 text-indigo-600 font-bold text-[8px] opacity-0 group-hover:opacity-100 transition-all">
              Begin Exploration <ArrowRight size={8} />
            </div>
          </div>
        </div>
      </button>

      {/* Returning User Card */}
      <button 
        onClick={() => onSelectAction(true)}
        className="group relative p-px bg-white/20 rounded-[1.5rem] transition-all hover:scale-[1.01] active:scale-95"
      >
        <div className="relative h-full p-6 bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[1.45rem] text-center overflow-hidden shadow-sm group-hover:shadow-md transition-all">
          <div className="relative z-10">
            <div className="bg-white p-3 rounded-xl border border-slate-200 mb-4 mx-auto w-fit shadow-sm">
              <LogIn size={22} className="text-slate-900" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight group-hover:text-slate-600 transition-colors">Welcome back</h4>
            <p className="text-slate-500 font-bold text-[9px] leading-relaxed max-w-[150px] mx-auto opacity-70">
              Access your intelligence dashboard instantly.
            </p>
            <div className="mt-4 flex items-center justify-center gap-1 text-slate-900 font-bold text-[8px] opacity-0 group-hover:opacity-100 transition-all">
              Sign In Securely <ArrowRight size={8} />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
