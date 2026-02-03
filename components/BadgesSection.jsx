
import React, { useState } from 'react';
import { Award, X, Sparkles, Clock } from 'lucide-react';

export const BadgesSection = ({ badges }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  if (badges.length === 0) return null;

  return (
    <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 mb-6">
      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
        <Award size={18} className="text-blue-600" /> Achievements Unlocked
      </h4>
      <div className="flex flex-wrap gap-4">
        {badges.map((badge) => (
          <button 
            key={badge.id} 
            onClick={() => setSelectedBadge(badge)}
            className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-4 rounded-[1.5rem] animate-fade-in group hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl shadow-sm border border-blue-200 group-hover:rotate-12 group-hover:scale-110 transition-all">
               {badge.icon}
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-slate-900 tracking-tight">{badge.name}</div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">View Details</div>
            </div>
          </button>
        ))}
      </div>

      {selectedBadge && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400 group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>

            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30 text-5xl animate-bounce-subtle">
                {selectedBadge.icon}
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 mb-4">
                <Sparkles size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Credential</span>
              </div>

              <h2 className="text-3xl font-black text-slate-950 tracking-tighter mb-4">{selectedBadge.name}</h2>
              <p className="text-slate-500 font-bold leading-relaxed mb-8">
                {selectedBadge.description}
              </p>

              <div className="flex items-center justify-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-widest border-t border-slate-50 pt-8">
                <Clock size={16} /> Earned {new Date(selectedBadge.earnedAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
