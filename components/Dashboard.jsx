
import React, { useState, useEffect } from 'react';
import { JourneyStage, PricingTier } from '../app/types.js';
import { EmployabilityMeter } from './EmployabilityMeter.jsx';
import { JourneyTimeline } from './JourneyTimeline.jsx';
import { LearningPath } from './LearningPath.jsx';
import { CVPreview } from './CVPreview.jsx';
import { MarketInsightsPanel } from './MarketInsights.jsx';
import { storageService } from '../services/storageService.js';
import { generateUCASStatement } from '../services/geminiService.js';
import { PaymentModal } from './PaymentModal.jsx';
import { Sparkles, ArrowRight, Target, Brain, Globe, Map, Briefcase, BarChart3, ChevronRight, Cpu, Loader2, MessageSquare, ShieldAlert, ShieldCheck, Activity, ArrowUpRight, TrendingUp, Zap, Award, CreditCard, ChevronUp, Server, Heart, BookOpen, PenTool, Lightbulb, TrendingDown, GraduationCap, FileText, CheckCircle2, X, Download, Copy, Check, Clock, AlertTriangle, Layers, Rocket } from 'lucide-react';

export const Dashboard = ({
  userProfile,
  analysisResult,
  marketInsights,
  generatedCV,
  isAnalysing,
  isGeneratingCV,
  onAnalyse,
  onGenerateCV,
  onSuggestCareers,
  onUpdateTier,
  onReset
}) => {
  const isStarter = userProfile.selectedTier === PricingTier.STARTER;
  const isPro = userProfile.selectedTier === PricingTier.PRO;
  const isElite = userProfile.selectedTier === PricingTier.ELITE;

  const [stage, setStage] = useState(userProfile.currentStage ?? JourneyStage.PROFILE);
  const [localResult, setLocalResult] = useState(analysisResult);
  const [showUpgradeModal, setShowUpgradeModal] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentTier, setPaymentTier] = useState(userProfile.selectedTier);
  const [isRenewal, setIsRenewal] = useState(false);
  
  const [isGeneratingUCAS, setIsGeneratingUCAS] = useState(false);
  const [ucasStatement, setUcasStatement] = useState(userProfile.ucasStatement || null);
  const [showFullUCAS, setShowFullUCAS] = useState(false);
  const [partnerVacancies, setPartnerVacancies] = useState([]);
  const [copied, setCopied] = useState(false);

  const maxTemplates = isStarter ? 1 : isPro ? 3 : 5;
  const attemptsUsed = userProfile.cvAttemptsUsed || 0;
  const attemptsLeft = Math.max(0, maxTemplates - attemptsUsed);

  useEffect(() => {
    if (analysisResult) {
        setLocalResult(analysisResult);
        if (stage < JourneyStage.LEARNING) {
            updateStage(JourneyStage.LEARNING);
        }
    }
    setPartnerVacancies(storageService.getVacancies());
  }, [analysisResult]);

  const updateStage = (newStage) => {
    setStage(newStage);
    storageService.updateCandidateStatus(userProfile.contact, { currentStage: newStage });
  };

  const handleUCASGenerate = async () => {
      setIsGeneratingUCAS(true);
      try {
          const result = await generateUCASStatement(userProfile);
          setUcasStatement(result);
          storageService.updateCandidateStatus(userProfile.contact, { ucasStatement: result });
      } catch (e) { console.error(e); }
      finally { setIsGeneratingUCAS(false); }
  };

  const handleCopyUCAS = () => {
    if (ucasStatement) {
        navigator.clipboard.writeText(ucasStatement.statementBody);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCourseComplete = (courseId) => {
    if (!localResult || !analysisResult || isStarter) return;
    const newGaps = localResult.gaps.map(g => g.suggestion.id === courseId ? { ...g, suggestion: { ...g.suggestion, completed: true } } : g);
    const completedCount = newGaps.filter(g => g.suggestion.completed).length;
    
    const newCpd = (userProfile.totalCpdHours || 0) + 2;
    storageService.updateCandidateStatus(userProfile.contact, { totalCpdHours: newCpd });
    
    const currentScore = Math.min(100, Math.round(analysisResult.score + (completedCount / newGaps.length) * (100 - analysisResult.score)));
    const newResult = { ...localResult, gaps: newGaps, score: currentScore };
    setLocalResult(newResult);
    if (completedCount === newGaps.length && stage < JourneyStage.CV_UPDATE) updateStage(JourneyStage.CV_UPDATE);
  };

  const regionalPrices = {
    UK: { symbol: '£', starter: 39, pro: 79, elite: 129 },
    USA: { symbol: '$', starter: 49, pro: 99, elite: 159 },
    Europe: { symbol: '€', starter: 45, pro: 89, elite: 145 },
    India: { symbol: '₹', starter: 3999, pro: 7999, elite: 12999 },
    Canada: { symbol: 'C$', starter: 59, pro: 119, elite: 189 },
    Global: { symbol: '$', starter: 49, pro: 99, elite: 159 }
  }[userProfile.region || 'UK'];

  const getUpgradeCost = (target) => {
    const current = userProfile.selectedTier;
    let cost = 0;
    if (current === PricingTier.STARTER) {
      if (target === PricingTier.PRO) cost = regionalPrices.pro - regionalPrices.starter;
      if (target === PricingTier.ELITE) cost = regionalPrices.elite - regionalPrices.starter;
    } else if (current === PricingTier.PRO) {
      if (target === PricingTier.ELITE) cost = regionalPrices.elite - regionalPrices.pro;
    }
    return `${regionalPrices.symbol}${cost}`;
  };

  const getRenewalCost = () => {
    const base = userProfile.selectedTier === PricingTier.STARTER ? regionalPrices.starter 
               : userProfile.selectedTier === PricingTier.PRO ? regionalPrices.pro 
               : regionalPrices.elite;
    const discounted = Math.round(base * 0.8);
    return `${regionalPrices.symbol}${discounted}`;
  };

  const triggerRenewalPayment = () => {
    setIsRenewal(true);
    setPaymentAmount(getRenewalCost());
    setPaymentTier(userProfile.selectedTier);
    setShowPayment(true);
  };

  const triggerUpgradePayment = (target) => {
    setIsRenewal(false);
    setPaymentAmount(getUpgradeCost(target));
    setPaymentTier(target);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (isRenewal) {
        storageService.updateCandidateStatus(userProfile.contact, {
            lastPaymentDate: Date.now(),
            cvAttemptsUsed: 0
        });
    } else {
        onUpdateTier(paymentTier);
        storageService.updateCandidateStatus(userProfile.contact, {
            lastPaymentDate: Date.now(),
            cvAttemptsUsed: 0
        });
        setShowUpgradeModal(null);
    }
    // Now close the modal to reveal the dashboard in its loading/analysing state
    setShowPayment(false);
  };

  const handleStartAnalysis = () => {
      // Logic to trigger the combined payment/upload flow
      setIsRenewal(false);
      setPaymentAmount(regionalPrices[userProfile.selectedTier.toLowerCase()] || '0');
      setPaymentTier(userProfile.selectedTier);
      setShowPayment(true);
  };

  const formattedPrices = {
    l: `${regionalPrices.symbol}${regionalPrices.starter}`,
    a: `${regionalPrices.symbol}${regionalPrices.pro}`,
    p: `${regionalPrices.symbol}${regionalPrices.elite}`
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in py-6 selection:bg-slate-900 selection:text-blue-100 bg-slate-50">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">Usage monitor</h3>
                    <Layers size={16} className="text-slate-300" />
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                            <span>CV templates</span>
                            <span className="text-slate-900">{attemptsUsed}/{maxTemplates} used</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full rounded-full transition-all duration-1000 bg-slate-900" style={{ width: `${(attemptsUsed/maxTemplates)*100}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900"></div>
                {localResult ? <EmployabilityMeter score={localResult.score} /> : (
                    <div className="py-12">
                         <div className="bg-blue-50 w-24 h-24 rounded-2xl mb-8 mx-auto flex items-center justify-center border-2 border-white shadow-sm">
                            {isAnalysing ? <Loader2 className="text-slate-900 animate-spin" size={40} /> : <Activity className="text-slate-300" size={40} />}
                         </div>
                         <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Your progress</h2>
                         <p className="text-slate-400 mt-4 max-w-[200px] mx-auto leading-relaxed text-[10px] font-bold">
                            {isAnalysing ? 'AI is checking your path...' : 'Ready to begin?'}
                         </p>
                    </div>
                )}
            </div>

            {isStarter && (
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap size={20} className="text-slate-900" />
                        <h3 className="text-lg font-bold tracking-tight leading-none">Uni draft</h3>
                    </div>
                    {ucasStatement ? (
                        <div className="space-y-3">
                            <p className="text-[11px] font-bold text-slate-500 line-clamp-3 italic leading-relaxed">"{ucasStatement.statementBody}"</p>
                            <button 
                                onClick={() => setShowFullUCAS(true)}
                                className="text-[10px] font-bold text-slate-900 flex items-center gap-1.5 hover:translate-x-1 transition-transform"
                            >
                                Read full draft <ArrowRight size={12}/>
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleUCASGenerate} 
                            disabled={isGeneratingUCAS}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-[11px] hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                            {isGeneratingUCAS ? <Loader2 className="animate-spin" size={12} /> : <><PenTool size={12} /> Draft UCAS statement</>}
                        </button>
                    )}
                </div>
            )}

            {partnerVacancies.length > 0 && (
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles size={20} className="text-slate-900" />
                        <h3 className="text-lg font-bold tracking-tight leading-none">Partner roles</h3>
                    </div>
                    <div className="space-y-4">
                        {partnerVacancies.slice(0, 3).map((v, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-blue-50 transition-all cursor-pointer">
                                <h4 className="font-bold text-xs text-slate-900">{v.roleTitle}</h4>
                                <p className="text-[9px] font-bold text-slate-400 mt-1">Matched by elevAIte</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-slate-500">View details</span>
                                    <ArrowRight size={12} className="text-slate-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">Your plan</span>
                        <div className="flex items-center gap-2">
                            <Award className={`w-4 h-4 ${isElite ? 'text-slate-900' : 'text-slate-400'}`} />
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{userProfile.selectedTier}</h3>
                        </div>
                    </div>
                </div>
                {!isElite && (
                    <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                            <p className="text-[10px] font-bold text-blue-700 leading-relaxed">
                                {isStarter ? 'Upgrade to Pro for full review & interview prep.' : 'Upgrade to Elite for exec audit & career coach.'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {isStarter && (
                                <button onClick={() => setShowUpgradeModal(PricingTier.PRO)} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl transition-all shadow-sm">
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-slate-900">Pro</div>
                                        <div className="text-[9px] font-bold text-slate-400">{formattedPrices.a} upgrade</div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-400" />
                                </button>
                            )}
                            {(isStarter || isPro) && (
                                <button onClick={() => setShowUpgradeModal(PricingTier.ELITE)} className="w-full flex items-center justify-between p-3.5 bg-slate-900 hover:bg-black border border-slate-800 rounded-xl transition-all text-white shadow-md">
                                    <div className="text-left">
                                        <div className="text-xs font-bold">Elite</div>
                                        <div className="text-[9px] font-bold text-blue-200/60">{formattedPrices.p} upgrade</div>
                                    </div>
                                    <ChevronUp size={14} className="text-blue-300" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8">
                <JourneyTimeline currentStage={stage} />
            </div>
// write career suggestions component and market intelligence+Generate CV

        </div>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl text-center relative overflow-hidden border border-slate-200">
                <ChevronUp size={36} className="text-slate-900 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Confirm upgrade</h3>
                <div className="bg-blue-50 p-6 rounded-2xl mb-6 border border-blue-100">
                  <p className="text-slate-400 font-bold text-[10px] mb-1">Upgrade amount (difference only)</p>
                  <div className="text-4xl font-bold text-slate-900 tracking-tight">{getUpgradeCost(showUpgradeModal)}</div>
                </div>
                <p className="text-slate-500 font-bold text-[11px] mb-8">Switching from <span className="text-slate-900">{userProfile.selectedTier}</span> to <span className="text-slate-900">{showUpgradeModal}</span>.</p>
                <div className="flex gap-4">
                    <button onClick={() => setShowUpgradeModal(null)} className="flex-1 py-4 font-bold text-[11px] text-slate-400">Cancel</button>
                    <button onClick={() => triggerUpgradePayment(showUpgradeModal)} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold text-[11px] shadow-lg flex items-center justify-center gap-2">
                      Pay & upgrade <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
      )}

      {showPayment && (
        <PaymentModal 
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          amount={paymentAmount}
          tier={paymentTier}
          isUpgrade={!isRenewal}
          // Pass the core logic handlers to the internal FileUpload
          onAnalyse={onAnalyse}
          onGenerateCV={onGenerateCV}
          onSuggestCareers={onSuggestCareers}
          initialGoal={userProfile.careerAspirations}
        />
      )}

      {showFullUCAS && ucasStatement && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your uni draft</h2>
                        <p className="text-slate-400 font-bold text-[10px] mt-1">UCAS Personal Statement Draft</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleCopyUCAS} className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all text-blue-700 border border-blue-200 flex items-center gap-2 px-4 text-[11px] font-bold">
                            {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy draft</>}
                        </button>
                        <button onClick={() => setShowFullUCAS(false)} className="p-3 hover:bg-slate-100 rounded-xl transition-all text-slate-400 border border-slate-100">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex-grow overflow-auto p-10 bg-slate-50/50">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 max-w-2xl mx-auto">
                        <div className="mb-8 pb-8 border-b border-slate-100">
                            <span className="text-[9px] font-bold text-slate-400">Course focus</span>
                            <h4 className="text-xl font-bold text-slate-900">{ucasStatement.courseChoice}</h4>
                        </div>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-base leading-relaxed text-slate-700 font-bold italic whitespace-pre-wrap">
                                "{ucasStatement.statementBody}"
                            </p>
                        </div>
                        <div className="mt-12 space-y-4 pt-8 border-t border-slate-100">
                            <span className="text-[9px] font-bold text-slate-400">Structure guidance</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {ucasStatement.structureGuidance.map((guide, i) => (
                                    <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="bg-slate-900 text-white w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[9px] shrink-0">{i+1}</div>
                                        <p className="text-[10px] font-bold text-slate-600 leading-tight">{guide}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
