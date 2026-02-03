
import React from 'react';
import { TrendingUp, Users, Briefcase, ExternalLink, MapPin, Globe, ArrowUpRight, Zap, Target } from 'lucide-react';

export const MarketInsightsPanel = ({ data, region }) => {
  const getCompetitionColor = (level) => {
    if (!level || typeof level !== 'string') return 'text-slate-700 bg-slate-50 border-slate-200';
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel.includes('low')) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (normalizedLevel.includes('medium')) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (normalizedLevel.includes('high')) return 'text-orange-700 bg-orange-50 border-orange-200';
    if (normalizedLevel.includes('very high')) return 'text-red-700 bg-red-50 border-red-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  const getCurrencySymbol = (r) => {
    switch (r) {
      case 'UK': return '£';
      case 'USA': return '$';
      case 'Canada': return 'C$';
      case 'India': return '₹';
      case 'Europe': return '€';
      default: return '$';
    }
  };

  const competitionLabel = (data && data.competitionLevel) ? String(data.competitionLevel).toUpperCase() : 'CALCULATING...';
  const currencySymbol = getCurrencySymbol(region);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="text-xl font-black text-slate-950 tracking-tight">Market Intelligence</h3>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
            <Globe size={12} className="text-blue-600" />
            <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest">{region || 'Global'} Standard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            {/* Competition Card */}
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-3 mb-4">
                 <Users className="w-5 h-5 text-slate-400" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Competition</span>
               </div>
               <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black border mb-4 uppercase tracking-widest ${getCompetitionColor(data.competitionLevel)}`}>
                 {competitionLabel}
               </div>
               <p className="text-sm text-slate-600 leading-relaxed font-bold">{data.competitionDescription || "Ecosystem competition data is currently being synthesized for your trajectory."}</p>
            </div>

            {/* Benchmark Card */}
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-5 h-5 flex items-center justify-center font-black text-slate-400 text-xs">{currencySymbol}</div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Benchmark</span>
               </div>
               <div className="text-4xl font-black text-slate-950 mb-2 tracking-tighter">{data.salaryRange?.avg || 'N/A'}</div>
               <div className="w-full bg-slate-200 h-2.5 rounded-full mt-4 relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 left-0 h-full bg-slate-300 w-full"></div>
                  <div className="absolute top-0 left-[30%] right-[30%] h-full bg-blue-600 opacity-90 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
               </div>
               <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-black uppercase tracking-widest">
                 <span>Min: {data.salaryRange?.min || '0'}</span>
                 <span>Max: {data.salaryRange?.max || '0'}</span>
               </div>
            </div>
        </div>

        <div className="space-y-6">
            {/* Trend Card */}
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-blue-50/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                    <ArrowUpRight size={64} className="text-blue-600" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-5 h-5 text-blue-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Demand Trend</span>
                    </div>
                    <div className="text-2xl font-black text-slate-950 mb-2 flex items-center gap-2">
                        {data.demandTrend || 'Calculating...'}
                        <ArrowUpRight className="text-emerald-500 animate-bounce-subtle" size={24} />
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{data.demandTrendDescription || 'Market velocity analysis pending.'}</p>
                </div>
            </div>

            {/* Skills Demand Card */}
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Target className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In-Demand Capabilities</span>
                </div>
                <div className="space-y-4">
                    {data.topSkills?.map((skill, idx) => (
                        <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                <span>{skill.name}</span>
                                <span className="text-blue-600">{skill.demand}% demand</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                                <div 
                                    className="h-full bg-slate-900 rounded-full transition-all duration-1000" 
                                    style={{ width: `${skill.demand}%` }}
                                />
                            </div>
                        </div>
                    )) || <p className="text-xs text-slate-400 font-bold italic">Gathering skill demand metrics...</p>}
                </div>
            </div>
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
            <Briefcase size={18} className="text-blue-500" /> Strategic Vacancies
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.jobListings?.map((job, idx) => (
                <a key={idx} href={job.url} target="_blank" rel="noopener noreferrer" className="block group p-6 rounded-[1.5rem] border border-slate-100 hover:border-blue-300 hover:shadow-xl hover:bg-white transition-all bg-white shadow-sm">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Briefcase size={16} />
                            </div>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 transition-all" />
                        </div>
                        <h5 className="text-base font-black text-slate-950 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1">{job.title}</h5>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{job.company}</p>
                        
                        <div className="mt-6 pt-6 border-t border-slate-50 space-y-2">
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                                <MapPin size={10} className="text-blue-400" /> {job.location}
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-900 uppercase">
                                <div className="w-2.5 h-2.5 flex items-center justify-center text-blue-500">{currencySymbol}</div> {job.salaryRange}
                            </div>
                        </div>
                    </div>
                </a>
            )) || <p className="text-sm text-slate-400 font-black uppercase tracking-widest italic text-center py-8 col-span-3">No active job listings found for this profile.</p>}
        </div>
      </div>
    </div>
  );
};
