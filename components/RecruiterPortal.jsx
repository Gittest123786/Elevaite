
import React, { useState, useEffect, useRef } from 'react';
import { JourneyStage, CandidateCategory, PricingTier } from '../types.js';
import { storageService } from '../services/storageService.js';
import { generateRecruiterInsights, rankCandidatesForJob } from '../services/geminiService.js';
import { 
    Users, Brain, TrendingUp, Search, ChevronRight, Globe,
    Target, Zap, Briefcase, Award, Star, ShieldCheck, X, ArrowRight, Loader2,
    Building2, LayoutGrid, Layers, GraduationCap, Upload, FileText, Sparkles,
    BarChart3, Plus, UserPlus, DollarSign, BookOpen, Crown
} from 'lucide-react';
import { SkillRadar } from './SkillRadar.jsx';
import { RecruiterHeader } from './RecruiterHeader.jsx';
import mammoth from 'mammoth';

export const RecruiterPortal = ({ onLogout, currentUserContact }) => {
  const [activeView, setActiveView] = useState('REGISTRY');
  const [clients, setClients] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', industry: '', region: 'UK' });
  const fileInputRef = useRef(null);

  const isElite = candidates.find(c => c.contact === currentUserContact)?.selectedTier === PricingTier.ELITE;

  useEffect(() => {
    const loadData = async () => {
        const pool = storageService.getTalentPool();
        const storedClients = storageService.getClients();
        setCandidates(pool);
        setClients(storedClients);
        setLoading(false);
    };
    loadData();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const arrayBuffer = event.target?.result;
            const result = await mammoth.extractRawText({ arrayBuffer });
            setJobDescription(result.value);
        };
        reader.readAsArrayBuffer(file);
    } else {
        const reader = new FileReader();
        reader.onload = (event) => {
            setJobDescription(event.target?.result);
        };
        reader.readAsText(file);
    }
  };

  const handleMandateSearch = async () => {
    if (!jobDescription.trim()) return;
    setMatching(true);
    setMatches([]);
    try {
        const results = await rankCandidatesForJob(jobDescription, candidates, 'UK');
        const top5 = results
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5);
        setMatches(top5);
    } catch (e) { console.error(e); }
    finally { setMatching(false); }
  };

  const handleAddClient = () => {
      const client = {
          id: `client_${Date.now()}`,
          name: newClient.name,
          industry: newClient.industry,
          region: newClient.region,
          activeMandates: [],
          totalBusinessBrought: 0,
          placementsCount: 0
      };
      storageService.saveClient(client);
      setClients(storageService.getClients());
      setShowAddClient(false);
      setNewClient({ name: '', industry: '', region: 'UK' });
  };

  const handlePlaceCandidate = (candidateContact, clientId) => {
      const fee = 5000;
      storageService.placeCandidateWithClient(candidateContact, clientId, fee);
      setCandidates(storageService.getTalentPool());
      setClients(storageService.getClients());
      alert("Candidate Placed Successfully!");
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="text-[#1f2937] animate-spin" size={64} /></div>;

  const totalBusiness = clients.reduce((acc, c) => acc + (c.totalBusinessBrought || 0), 0);
  const totalCPD = candidates.reduce((acc, c) => acc + (c.totalCpdHours || 0), 0);

  return (
    <div className="min-h-screen bg-white font-sans pb-40 selection:bg-[#1f2937] selection:text-[#bae6fd]">
      <RecruiterHeader 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={onLogout} 
      />

      <main className="max-w-[1800px] mx-auto px-16 py-24 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-[#1f2937]/5 shadow-lg flex flex-col justify-center">
                <span className="text-[9px] font-bold tracking-tight text-slate-400 mb-1">Total Managed Talent</span>
                <div className="text-4xl font-bold text-[#1f2937] tracking-tighter">{candidates.length}</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-[#1f2937]/5 shadow-lg flex flex-col justify-center">
                <span className="text-[9px] font-bold tracking-tight text-slate-400 mb-1">Business Value Generated</span>
                <div className="text-4xl font-bold text-[#1f2937] tracking-tighter">£{totalBusiness.toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-[#1f2937]/5 shadow-lg flex flex-col justify-center">
                <span className="text-[9px] font-bold tracking-tight text-slate-400 mb-1">Cohort Placements</span>
                <div className="text-4xl font-bold text-[#1f2937] tracking-tighter">{clients.reduce((acc, c) => acc + (c.placementsCount || 0), 0)}</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-[#1f2937]/5 shadow-lg flex flex-col justify-center">
                <span className="text-[9px] font-bold tracking-tight text-slate-400 mb-1">Cohort CPD Hours</span>
                <div className="text-4xl font-bold text-[#1f2937] tracking-tighter">{totalCPD}</div>
            </div>
        </div>

        {activeView === 'REGISTRY' && (
            <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden animate-fade-in">
                <div className="p-12 border-b border-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-3xl font-bold tracking-tighter text-[#1f2937]">Talent Registry</h3>
                        <p className="text-[10px] font-bold tracking-tight text-slate-400 mt-1">Shared repository of all elevaite candidates</p>
                    </div>
                    <div className="relative">
                        <input placeholder="Search People..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-10 py-5 bg-slate-50 rounded-full w-80 font-bold tracking-tight text-[#1f2937] outline-none focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-[#1f2937]/30 text-sm" />
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-[#1f2937]/20" size={20} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[9px] font-bold tracking-tight text-slate-400">
                            <tr><th className="px-12 py-6">Candidate Name</th><th className="px-12 py-6">Role Aspirations</th><th className="px-12 py-6">Readiness Score</th><th className="px-12 py-6">Placement Status</th><th className="px-12 py-6 text-right">Profile</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {candidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((c, i) => {
                                const isCurrentUser = c.contact === currentUserContact;
                                return (
                                    <tr 
                                        key={i} 
                                        className={`transition-all cursor-pointer ${isCurrentUser ? 'bg-[#1f2937] text-[#bae6fd] hover:bg-black scale-[1.01] shadow-2xl z-10' : 'bg-white opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-slate-50'}`} 
                                        onClick={() => setSelectedCandidate(c)}
                                    >
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isCurrentUser ? 'bg-sky-400 text-[#1f2937]' : 'bg-slate-100 text-[#1f2937]'}`}>
                                                    {isCurrentUser ? <Crown size={18} /> : c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className={`font-bold text-lg tracking-tight ${isCurrentUser ? 'text-white' : 'text-[#1f2937]'}`}>
                                                        {c.name} {isCurrentUser && <span className="text-[7px] bg-sky-400 text-[#1f2937] px-2 py-0.5 rounded ml-2 font-bold">Active Coaching</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-12 py-8 font-bold text-xs ${isCurrentUser ? 'text-sky-200' : 'text-slate-600'}`}>{c.careerAspirations}</td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-20 h-1.5 rounded-full overflow-hidden ${isCurrentUser ? 'bg-white/10' : 'bg-slate-100'}`}>
                                                    <div className={`h-full ${isCurrentUser ? 'bg-sky-400' : 'bg-[#1f2937]'}`} style={{ width: `${c.lastAnalysis?.score || 0}%` }} />
                                                </div>
                                                <span className={`font-bold text-xs ${isCurrentUser ? 'text-white' : 'text-[#1f2937]'}`}>{c.lastAnalysis?.score || 0}%</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            {c.placedWithClientId ? (
                                                <span className={`px-3 py-1.5 rounded-full font-bold text-[9px] tracking-tight border flex items-center gap-1.5 w-fit ${isCurrentUser ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                                    <ShieldCheck size={12} /> Placed
                                                </span>
                                            ) : (
                                                <span className={`px-3 py-1.5 rounded-full font-bold text-[9px] tracking-tight border w-fit ${isCurrentUser ? 'bg-sky-500/10 text-sky-300 border-sky-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>In Pipeline</span>
                                            )}
                                        </td>
                                        <td className="px-12 py-8 text-right"><ChevronRight size={20} className={`${isCurrentUser ? 'text-white/20' : 'text-[#1f2937]/10'} ml-auto`} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};
