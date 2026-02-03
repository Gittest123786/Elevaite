
import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, Loader2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { FileUpload } from './FileUpload.jsx';

/**
 * PaymentModal Component
 * Now includes a Post-Payment Upload flow.
 */
export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount, 
  tier,
  isUpgrade = false,
  // Added handlers for the internal FileUpload component
  onAnalyse,
  onGenerateCV,
  onSuggestCareers,
  initialGoal = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showUploadStep, setShowUploadStep] = useState(false);

  if (!isOpen) return null;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call to payment gateway
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      
      // Instead of auto-closing, we transition to the upload step after 1.5s
      setTimeout(() => {
        setShowUploadStep(true);
      }, 1500);
    }, 2000);
  };

  const handleActionComplete = () => {
    // When an action (analyse/generate) is triggered from FileUpload, 
    // we notify parent and close modal. This reveals the dashboard.
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-[#1f2937]/80 backdrop-blur-2xl z-[300] flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className={`bg-white/90 backdrop-blur-3xl w-full ${showUploadStep ? 'max-w-3xl' : 'max-w-md'} rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.2)] relative overflow-hidden border border-white selection:bg-[#1f2937] selection:text-[#bae6fd] transition-all duration-500`}>
        
        {/* Subtle Gloss Reflection Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full -mr-12 -mt-12 blur-2xl opacity-60"></div>

        {/* Header Section */}
        <div className="bg-white/50 p-6 border-b border-slate-100 flex justify-between items-center relative z-10">
          <div>
            <h3 className="text-lg font-bold text-[#1f2937] tracking-tight">
              {showUploadStep ? 'Intelligence Upload' : isPaid ? 'Payment Confirmed' : isUpgrade ? 'Upgrade Account' : 'Complete Purchase'}
            </h3>
            <p className="text-[9px] font-bold text-slate-400 tracking-tight mt-0.5 flex items-center gap-1.5 opacity-80">
              <Lock size={10} className="text-emerald-500" /> Secure Encryption
            </p>
          </div>
          {(!isProcessing || showUploadStep) && (
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-slate-50 rounded-full transition-all text-slate-300 border border-slate-100 shadow-sm"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="p-6 md:p-8 relative z-10">
          {showUploadStep ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 rounded-full border border-sky-100 mb-2">
                    <Sparkles size={10} className="text-sky-600" />
                    <span className="text-[8px] font-bold text-sky-700 uppercase tracking-widest">Post-Payment Step</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">Ready to analyze</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">Please provide your CV to begin the intelligence process.</p>
               </div>
               <FileUpload 
                  onAnalyse={(...args) => { onAnalyse?.(...args); handleActionComplete(); }} 
                  onGenerateCV={(...args) => { onGenerateCV?.(...args); handleActionComplete(); }} 
                  onSuggestCareers={(...args) => { onSuggestCareers?.(...args); handleActionComplete(); }} 
                  isLoading={false} 
                  isGeneratingCV={false} 
                  isRecommending={false} 
                  initialGoal={initialGoal} 
               />
            </div>
          ) : isPaid ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl animate-bounce-subtle border border-white/20">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-[#1f2937] tracking-tighter">Success!</h4>
                <p className="text-slate-500 font-bold text-[11px]">Preparing your upload portal...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              {/* Order Summary Card - High Gloss */}
              <div className="bg-white/40 p-5 rounded-2xl border border-slate-100 flex justify-between items-center mb-2 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Selected Plan</span>
                  <div className="text-sm font-bold text-[#1f2937] tracking-tight">
                    {tier} {isUpgrade && <span className="text-sky-600">(Upgrade)</span>}
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Amount due</span>
                  <div className="text-xl font-bold text-[#1f2937] tracking-tighter">{amount}</div>
                </div>
              </div>

              {/* Secure Card Inputs */}
              <div className="space-y-3">
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    required 
                    type="text"
                    placeholder="Card Number" 
                    className="w-full pl-10 pr-4 py-3.5 bg-white/50 border border-slate-100 rounded-xl font-bold focus:ring-4 focus:ring-slate-100/50 focus:bg-white focus:border-sky-200 outline-none transition-all text-[#1f2937] text-[11px] shadow-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    required 
                    type="text"
                    placeholder="MM / YY" 
                    className="w-full px-4 py-3.5 bg-white/50 border border-slate-100 rounded-xl font-bold focus:ring-4 focus:ring-slate-100/50 focus:bg-white focus:border-sky-200 outline-none transition-all text-[#1f2937] text-[11px] shadow-sm" 
                  />
                  <input 
                    required 
                    type="password"
                    maxLength="4"
                    placeholder="CVC" 
                    className="w-full px-4 py-3.5 bg-white/50 border border-slate-100 rounded-xl font-bold focus:ring-4 focus:ring-slate-100/50 focus:bg-white focus:border-sky-200 outline-none transition-all text-[#1f2937] text-[11px] shadow-sm" 
                  />
                </div>
                <input 
                  required 
                  type="text"
                  placeholder="Cardholder Name" 
                  className="w-full px-4 py-3.5 bg-white/50 border border-slate-100 rounded-xl font-bold focus:ring-4 focus:ring-slate-100/50 focus:bg-white focus:border-sky-200 outline-none transition-all text-[#1f2937] text-[11px] shadow-sm" 
                />
              </div>

              {/* Action Button */}
              <button 
                disabled={isProcessing}
                className="group relative w-full bg-[#1f2937] text-white py-4.5 rounded-2xl font-bold tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-2.5 transition-all hover:bg-black hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:pointer-events-none overflow-hidden mt-2"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Validating...
                  </>
                ) : (
                  <>
                    Confirm & Proceed <ArrowRight size={14} className="text-sky-400" />
                  </>
                )}
              </button>

              {/* Security Footer */}
              <div className="flex items-center justify-center gap-3 opacity-40 pt-4">
                <ShieldCheck size={18} />
                <span className="text-[7px] font-bold tracking-widest uppercase text-slate-400">Merchant Secure Gateway v2</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
