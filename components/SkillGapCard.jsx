
import React from 'react';
import { BookOpen, CheckCircle, Clock, ExternalLink, AlertCircle, Sparkles, Star, Info } from 'lucide-react';

export const SkillGapCard = ({ gapData, onComplete, index, isStarter = false }) => {
  const { gap, gapDescription, suggestion } = gapData;
  const isCompleted = suggestion.completed;

  const handleLinkClick = (e) => {
    if (!isCompleted && !isStarter) {
       onComplete(suggestion.id);
    }
  };

  return (
    <div className={`relative group rounded-[2.5rem] shadow-sm border transition-all duration-500 overflow-hidden flex flex-col h-full ${isCompleted ? 'border-[#1f2937]/20 bg-white/80 shadow-[#1f2937]/5' : 'border-[#1f2937]/5 bg-white hover:shadow-2xl hover:border-[#1f2937]/20'} animate-fade-in`} style={{ animationDelay: `${index * 150}ms` }}>
      {isCompleted && (
        <div className="absolute top-0 right-0 p-5">
            <div className="bg-[#1f2937] text-[#bae6fd] p-2.5 rounded-2xl shadow-xl animate-pulse"><Star size={18} fill="currentColor" /></div>
        </div>
      )}
      <div className="p-10 flex-grow flex flex-col relative z-10">
        <div className={`mb-8 pb-8 border-b border-dashed ${isCompleted ? 'border-[#1f2937]/20' : 'border-[#1f2937]/5'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                    {isCompleted ? (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-black tracking-widest text-[#bae6fd] bg-[#1f2937] rounded-full uppercase shadow-lg"><Sparkles size={12} /> Mastered</span>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-black tracking-widest text-slate-500 bg-slate-50 rounded-full uppercase border border-[#1f2937]/10"><AlertCircle size={12} /> {isStarter ? 'Skill Target' : 'Skill to Learn'}</span>
                    )}
                </div>
            </div>
            <h3 className={`text-2xl font-black mb-3 tracking-tighter ${isCompleted ? 'text-[#1f2937]' : 'text-slate-900'}`}>{gap}</h3>
            <p className={`text-base leading-relaxed font-bold ${isCompleted ? 'text-[#1f2937]/60' : 'text-slate-500 uppercase tracking-tight'}`}>{isCompleted ? `Success! You've improved this skill through learning.` : gapDescription}</p>
        </div>
        <div className="flex-grow">
          <div className={`flex items-center text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#1f2937]`}>
            {isStarter ? <Info className="w-4 h-4 mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />}
            {isStarter ? 'Recommended Direction' : 'Recommended Course'}
          </div>
          <h4 className={`font-black text-xl mb-3 leading-tight text-[#1f2937]`}>{suggestion.title}</h4>
          <p className={`text-base leading-relaxed mb-8 font-medium text-[#4b5563]`}>{suggestion.description}</p>
          {!isStarter && (
            <div className={`flex items-center text-[11px] font-black uppercase tracking-widest mb-8 p-4 rounded-[1.5rem] border ${isCompleted ? 'bg-white/60 border-[#1f2937]/10 text-[#1f2937]' : 'bg-slate-50 border-[#1f2937]/5 text-slate-400'}`}>
              <Clock className="w-4 h-4 mr-2" />
              <span className="mr-6">{suggestion.duration}</span>
              <span className="text-slate-800">• {suggestion.provider}</span>
            </div>
          )}
        </div>
        {!isStarter && (
            <div className="mt-auto">
                {isCompleted ? (
                    <div className="w-full py-5 px-8 rounded-[1.5rem] flex items-center justify-center text-xs font-black bg-sky-100 text-[#1f2937] border border-[#1f2937]/10 tracking-widest uppercase shadow-sm">Course Done <CheckCircle className="ml-2 w-5 h-5" /></div>
                ) : (
                    <a href={suggestion.url} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} className="w-full py-5 px-8 rounded-[1.5rem] flex items-center justify-center text-xs font-black bg-[#1f2937] text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-[#1f2937]/20 tracking-widest uppercase">Start Course <ExternalLink className="ml-2 w-5 h-5" /></a>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
