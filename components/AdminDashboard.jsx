
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService.js';
import { generateRecruiterInsights } from '../services/geminiService.js';
import { 
    Users, Brain, TrendingUp, AlertCircle, BookOpen, 
    Search, Filter, ChevronRight, Mail, MapPin, 
    Calendar, Download, CheckCircle, Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const AdminDashboard = ({ onLogout }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
        const pool = storageService.getTalentPool();
        setCandidates(pool);

        if (pool.length > 0) {
            try {
                const aiInsights = await generateRecruiterInsights(pool);
                setInsights(aiInsights);
            } catch (e) {
                console.error("Failed to generate insights", e);
            }
        }
        setLoading(false);
    };
    loadData();
  }, []);

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.careerAspirations.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: candidates.length,
    avgScore: candidates.length > 0 
        ? Math.round(candidates.reduce((acc, c) => acc + (c.lastAnalysis?.score || 0), 0) / candidates.length) 
        : 0,
    jobReady: candidates.filter(c => (c.lastAnalysis?.score || 0) > 80).length,
    inTraining: candidates.filter(c => (c.lastAnalysis?.score || 0) > 0 && (c.lastAnalysis?.score || 0) <= 80).length
  };

  const pieData = [
    { name: 'Job Ready', value: stats.jobReady, color: '#10b981' },
    { name: 'Learning', value: stats.inTraining, color: '#3b82f6' },
    { name: 'New', value: stats.total - (stats.jobReady + stats.inTraining), color: '#94a3b8' },
  ];

  if (loading) {
      return (
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-bold text-lg">Loading Talent Pipeline...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                    <Brain className="text-white w-5 h-5" />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight">Talent Intelligence</h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Employer Portal</p>
                </div>
            </div>
            <button onClick={onLogout} className="text-sm font-bold bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-all border border-slate-700">
                Switch to Candidate View
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
                { label: 'Total Talent', value: stats.total, icon: Users, color: 'text-blue-600' },
                { label: 'Avg. Readiness', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'text-green-600' },
                { label: 'Job Ready', value: stats.jobReady, icon: CheckCircle, color: 'text-emerald-600' },
                { label: 'In Learning', value: stats.inTraining, icon: Clock, color: 'text-amber-600' }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <stat.icon className={stat.color} size={18} />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                </div>
            ))}
        </div>

        {insights && (
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="text-blue-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Cohort Insights</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">{insights.summary}</h2>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <h3 className="text-sm font-bold text-blue-300 uppercase mb-2">Strategic Recommendation</h3>
                            <p className="text-lg leading-relaxed">{insights.intervention}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <h4 className="text-xs font-bold text-red-400 uppercase mb-3">Critical Gaps</h4>
                            <ul className="space-y-2">
                                {insights.criticalGaps.map((gap, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm font-semibold">
                                        <AlertCircle size={14} className="text-red-400" /> {gap}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <h4 className="text-xs font-bold text-blue-400 uppercase mb-3">Suggested Curriculum</h4>
                            <ul className="space-y-2">
                                {insights.recommendedCurriculum.map((course, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm font-semibold">
                                        <BookOpen size={14} className="text-blue-400" /> {course}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-black text-xl text-slate-900">Talent Pipeline</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search candidates or roles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Candidate</th>
                                <th className="px-6 py-4">Target Role</th>
                                <th className="px-6 py-4">Readiness</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCandidates.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium">
                                        No candidates found in the pipeline yet.
                                    </td>
                                </tr>
                            ) : (
                                filteredCandidates.map((c, i) => (
                                    <tr 
                                        key={i} 
                                        className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${selectedCandidate?.contact === c.contact ? 'bg-blue-50' : ''}`}
                                        onClick={() => setSelectedCandidate(c)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{c.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{c.qualification}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">{c.careerAspirations}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${
                                                            (c.lastAnalysis?.score || 0) > 80 ? 'bg-emerald-500' :
                                                            (c.lastAnalysis?.score || 0) > 50 ? 'bg-blue-500' : 'bg-slate-300'
                                                        }`}
                                                        style={{ width: `${c.lastAnalysis?.score || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-slate-900">{c.lastAnalysis?.score || 0}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ChevronRight size={16} className="text-slate-300" />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
                {selectedCandidate ? (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center pb-6 border-b border-slate-100">
                             <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-black mx-auto mb-4 border-4 border-white shadow-sm">
                                {selectedCandidate.name.charAt(0)}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">{selectedCandidate.name}</h3>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{selectedCandidate.careerAspirations}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                <Mail size={16} className="text-slate-400" /> {selectedCandidate.contact}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                <MapPin size={16} className="text-slate-400" /> {selectedCandidate.location}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Skill Gaps (Current Focus)</h4>
                            <div className="space-y-2">
                                {selectedCandidate.lastAnalysis?.gaps.map((gap, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                        <span className="text-xs font-bold text-slate-700">{gap.gap}</span>
                                        {gap.suggestion.completed ? 
                                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Done</span> :
                                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Learning</span>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            disabled={!selectedCandidate.lastAnalysis}
                        >
                            View Full Analysis Result
                        </button>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                        <Users size={48} className="mb-4" />
                        <p className="font-bold text-slate-500">Select a candidate to view their professional profile and growth metrics.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};
