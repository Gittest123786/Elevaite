
import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, Loader2 } from 'lucide-react';
import { PricingTier, CandidateCategory } from '../app/types.js';
import { PaymentModal } from './PaymentModal.jsx';
import { PricingComparisonModal } from './PricingComparisonModal.jsx';
import { storageService } from '../services/storageService.js';
import { analyseCV, generateTailoredCV, suggestCareers } from '../services/geminiService.js';

// Sub-components
import { OnboardingStepChoice } from './onboarding/OnboardingStepChoice.jsx';
import { OnboardingStepPricing } from './onboarding/OnboardingStepPricing.jsx';
import { OnboardingStepForm } from './onboarding/OnboardingStepForm.jsx';
import { OnboardingStepPaymentSummary } from './onboarding/OnboardingStepPaymentSummary.jsx';

export const OnboardingFlow = ({ 
  onComplete, 
  onBack,
  initialTier = null,
  prices
}) => {
  const [step, setStep] = useState(initialTier ? 3 : 1);
  const [isReturning, setIsReturning] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', 
    contact: '', 
    password: '',
    location: 'Remote', 
    qualification: 'N/A', 
    careerAspirations: '', 
    candidateCategory: CandidateCategory.ASPIRING,
    selectedTier: initialTier || PricingTier.STARTER,
    region: 'UK',
    cvAttemptsUsed: 0,
    lastPaymentDate: 0,
    createdAt: Date.now()
  });

  useEffect(() => {
    if (initialTier) {
      setFormData(prev => ({ ...prev, selectedTier: initialTier }));
      if (step < 3) setStep(3);
    }
  }, [initialTier, step]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const selectedPrice = formData.selectedTier === PricingTier.STARTER ? prices.l 
                       : formData.selectedTier === PricingTier.PRO ? prices.a 
                       : prices.p;

  const handleActionSelect = (returning) => {
    setIsReturning(returning);
    if (initialTier) {
      setStep(3);
    } else {
      setStep(returning ? 3 : 2);
    }
  };

  const handlePricingSelect = (tier) => {
    handleChange('selectedTier', tier);
    setStep(3);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (isReturning) {
      const pool = storageService.getTalentPool();
      const existing = pool.find(p => p.contact === formData.contact && p.password === formData.password);
      
      if (existing) {
        setIsFinishing(true);
        setTimeout(() => onComplete(existing), 1200);
      } else {
        setError("Account not found or password incorrect. Please check your details.");
      }
    } else {
      setStep(4);
    }
  };

  const handlePaymentSuccess = () => {
    // Note: The modal now handles the upload flow internally.
    // Once the upload/analyse action is finished in the modal, it calls this.
    setShowPayment(false); 
    setIsFinishing(true);
    const now = Date.now();
    const finalData = { 
      ...formData, 
      lastPaymentDate: now, 
      updatedAt: now,
      cvAttemptsUsed: 1, // Assumes they uploaded one
      createdAt: formData.createdAt || now
    };
    
    storageService.saveCandidate(finalData);
    
    setTimeout(() => {
        onComplete(finalData);
    }, 1500);
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/20 via-white to-blue-50/20 -z-10" />
        <div className="relative z-10 flex flex-col items-center p-4 text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-white/20">
              <Loader2 className="w-8 h-8 text-sky-300 animate-spin" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Syncing intelligence...</h2>
            <p className="text-slate-400 font-bold text-[8px] tracking-tight">Initializing secure career nodes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-600 selection:text-white relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-indigo-50/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-blue-50/15 blur-[80px] rounded-full" />
      </div>

      <button 
        onClick={onBack}
        className="fixed top-6 left-6 z-50 group flex items-center gap-2.5 px-3.5 py-1.5 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-full shadow-sm hover:shadow-lg hover:border-slate-900 hover:scale-105 active:scale-98 transition-all duration-300"
      >
        <div className="bg-slate-900 p-1 rounded-full text-white">
          <ChevronLeft size={10} />
        </div>
        <span className="text-[8px] font-bold text-slate-500 group-hover:text-slate-900 tracking-tight">Return</span>
      </button>

      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl px-4 py-8">
        <div className="text-center mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="relative inline-flex mb-4">
            <div className="relative bg-slate-900 p-3 rounded-xl shadow-md border border-white/10">
              <Sparkles className="text-sky-300" size={18} />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-0.5 lowercase italic">elev<span className="text-indigo-600 not-italic">AIte</span></h2>
          <div className="flex items-center justify-center gap-1.5">
            <p className="text-slate-400 font-bold text-[7px] tracking-widest uppercase">The Intelligence Standard</p>
          </div>
        </div>

        <div className="w-full relative z-10">
          {step === 1 && <OnboardingStepChoice onSelectAction={handleActionSelect} />}
          {step === 2 && <OnboardingStepPricing prices={prices} onSelectTier={handlePricingSelect} onShowComparison={() => setShowComparison(true)} />}
          {step === 3 && <OnboardingStepForm isReturning={isReturning} formData={formData} onChange={handleChange} onSubmit={handleProfileSubmit} error={error} />}
          {step === 4 && <OnboardingStepPaymentSummary selectedPrice={selectedPrice} onInitiatePayment={() => setShowPayment(true)} />}
        </div>
      </div>

      {showPayment && (
        <PaymentModal 
          isOpen={showPayment} 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess} 
          amount={selectedPrice} 
          tier={formData.selectedTier} 
          // During onboarding, we need to pass temporary handlers since the user isn't logged in yet
          onAnalyse={(text, mime, goal) => analyseCV(text, mime, goal, formData)}
          onGenerateCV={(text, mime, goal, res) => generateTailoredCV(text, mime, goal, formData, res)}
          onSuggestCareers={(text, mime) => suggestCareers(text, mime, formData.region)}
          initialGoal={formData.careerAspirations}
        />
      )}

      <PricingComparisonModal 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
        onSelectTier={handlePricingSelect} 
        prices={prices} 
      />
    </div>
  );
};
