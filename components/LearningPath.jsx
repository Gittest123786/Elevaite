
import React from 'react';
import { SkillGapCard } from './SkillGapCard.jsx';
import { Trophy, ArrowRight, Sparkles, CheckCircle, Loader2, ListTodo, Zap, Heart } from 'lucide-react';

export const LearningPath = ({ 
    gaps, 
    onComplete, 
    onGenerateCV, 
    canGenerateCV, 
    isGeneratingCV = false, 
    isStarter = false 
}) => {
  const completedCount = gaps.filter(g => g.suggestion.completed).length;
  const isAllCompleted = completedCount === gaps.length;

  const technicalGaps = gaps.filter(g => g.category === 'Technical');
  const softGaps = gaps.filter(g => g.category === 'Soft');

  return (
    <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                    {isStarter ? <ListTodo className="text-slate-900" size={28} /> : <Trophy className="text-slate-900" size={28} />}
                    {isStarter ? 'Your skill guide' : 'Skill builder'}
                </h3>
                <p className="text-slate-500 font-bold mt-1 text-sm">
                    {isStarter ? 'Recommended focus areas to boost your career potential.' : 'Short courses to help you get your next job.'}
                </p>
            </div>
            {!isStarter && (
                <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400">Your progress</span>
                        <span className="text-sm font-bold text-slate-900">{completedCount}/{gaps.length} done</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shadow-inner border border-blue-100">
                        {isAllCompleted ? <Sparkles size={20} /> : <CheckCircle size={20} />}
                    </div>
                </div>
            )}
        </div>

        {isStarter && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm group hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-slate-900 p-2 rounded-xl text-white"><Zap size={16} fill="currentColor" /></div>
                        <h4 className="text-base font-bold text-slate-900 tracking-tight">Technical skills focus</h4>
                    </div>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                        {technicalGaps.length > 0 ? `Focus on mastering: ${technicalGaps.map(g => g.gap).join(', ')}. Strengthening these foundations will make your profile stand out to recruiters.` : 'Continue refining your current technical foundation to stay competitive in your chosen field.'}
                    </p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm group hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-slate-50 p-2 rounded-xl text-slate-900 border border-slate-200"><Heart size={16} fill="currentColor" /></div>
                        <h4 className="text-base font-bold text-slate-900 tracking-tight">Soft skills focus</h4>
                    </div>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                        {softGaps.length > 0 ? `Work on your: ${softGaps.map(g => g.gap).join(', ')}. These "human skills" are often the deciding factor in modern hiring decisions.` : 'Your soft skill foundation looks promising. Keep exercising your communication and teamwork traits.'}
                    </p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gaps.map((gap, idx) => (
                <div key={idx} className="h-full">
                    <SkillGapCard gapData={gap} index={idx} onComplete={onComplete} isStarter={isStarter} />
                </div>
            ))}
        </div>

        {canGenerateCV && (
            <div className={`mt-10 rounded-[2.5rem] p-12 text-center shadow-sm animate-fade-in relative overflow-hidden group transition-all duration-500 bg-slate-900 text-white`}>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px] transform transition-transform group-hover:scale-110 duration-1000"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3 group-hover:rotate-6 transition-transform duration-500 ${isAllCompleted ? 'bg-white text-slate-900' : 'bg-slate-800 text-white border border-white/10'}`}>
                        {isAllCompleted ? <CheckCircle size={32} /> : <Sparkles size={32} />}
                    </div>
                    <h2 className="text-3xl font-bold mb-4 tracking-tight leading-tight">{isAllCompleted ? 'Expert status reached' : 'Your new CV'}</h2>
                    <p className="text-blue-100/70 text-base mb-10 font-bold tracking-tight leading-relaxed">
                        {isStarter ? "We've mapped your potential! Now let's build a fresh CV that highlights your new direction." : isAllCompleted ? "Skills mastered! Your CV will now reflect your certified expertise and professional growth." : "Ready to update your CV? We'll include your new target skills to show employers your active focus."}
                    </p>
                    <button onClick={onGenerateCV} disabled={isGeneratingCV} className={`px-10 py-4 rounded-xl font-bold text-xs transition-all shadow-lg active:scale-95 flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed bg-white text-slate-900 hover:bg-blue-50`}>
                        {isGeneratingCV ? <><Loader2 className="animate-spin" size={16} /> Building your {isAllCompleted ? 'certified' : 'target'} CV...</> : <>{isAllCompleted ? 'Build certified CV' : 'Build target CV'} <ArrowRight size={20} /></>}
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};
