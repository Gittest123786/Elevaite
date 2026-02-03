
import React from 'react';
import { Briefcase, Check, ArrowRight, X } from 'lucide-react';

export const CareerSuggestions = ({ careers, onSelect }) => {
  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Recommended Career Paths</h2>
        <p className="text-slate-600 text-lg font-medium">Based on your skills and experience, here are 3 strong directions for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {careers.map((career, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
            onClick={() => onSelect(career.role)}
          >
            <div className="bg-slate-50 p-6 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                     <div className="flex justify-between items-start mb-2">
                         <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            {career.matchScore}% Match
                         </div>
                         <Briefcase className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 leading-tight">{career.role}</h3>
                </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <p className="text-slate-700 text-sm mb-6 leading-relaxed font-medium">
                    {career.reasoning}
                </p>

                <div className="space-y-4 mb-6">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Matching Skills</span>
                        <div className="flex flex-wrap gap-2">
                            {career.skillsFound.map((skill, i) => (
                                <span key={i} className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded flex items-center gap-1 font-semibold border border-green-100">
                                    <Check size={10} className="text-green-600" /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {career.missingSkills.length > 0 && (
                         <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Skills to Build</span>
                            <div className="flex flex-wrap gap-2">
                                {career.missingSkills.map((skill, i) => (
                                    <span key={i} className="text-xs bg-orange-50 text-orange-800 px-2 py-1 rounded border border-orange-200 font-medium">
                                         {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onSelect(career.role); }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-blue-400 hover:text-blue-700 transition-all"
                    >
                        Explore this Path <ArrowRight size={16} />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
