
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const OnboardingStepForm = ({ 
  isReturning, 
  formData, 
  onChange, 
  onSubmit, 
  error 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xs mx-auto relative">
      <form 
        onSubmit={onSubmit} 
        className="relative bg-white/70 backdrop-blur-3xl p-6 rounded-[2rem] border border-white shadow-md space-y-4 overflow-hidden"
      >
        <div className="text-center space-y-0.5 mb-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {isReturning ? 'Secure access' : 'Create profile'}
          </h3>
          <p className="text-[8px] font-bold text-slate-400 opacity-70">Personalized Intelligence Suite</p>
        </div>
        
        {error && (
          <div className="bg-red-50/50 p-2 rounded-lg border border-red-100 flex items-center gap-1.5 text-red-600 text-[8px] font-bold">
            <AlertCircle size={10} /> {error}
          </div>
        )}

        <div className="space-y-2">
          {!isReturning && (
            <input 
              required 
              value={formData.name} 
              onChange={e => onChange('name', e.target.value)} 
              placeholder="Full name" 
              className="w-full px-3 py-2.5 text-slate-900 rounded-lg bg-white border border-slate-100 font-bold text-[10px] outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" 
            />
          )}
          
          <input 
            required 
            type="email"
            value={formData.contact} 
            onChange={e => onChange('contact', e.target.value)} 
            placeholder="Email address" 
            className="w-full px-3 py-2.5 text-slate-900 rounded-lg bg-white border border-slate-100 font-bold text-[10px] outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" 
          />

          <div className="relative">
            <input 
              required 
              type={showPassword ? "text" : "password"}
              value={formData.password} 
              onChange={e => onChange('password', e.target.value)} 
              placeholder="Password" 
              className="w-full px-3 py-2.5 text-slate-900 rounded-lg bg-white border border-slate-100 font-bold text-[10px] outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 p-1"
            >
              {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>

          {!isReturning && (
            <input 
              required 
              value={formData.careerAspirations} 
              onChange={e => onChange('careerAspirations', e.target.value)} 
              placeholder="Target job title" 
              className="w-full px-3 py-2.5 text-slate-900 rounded-lg bg-white border border-slate-100 font-bold text-[10px] outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" 
            />
          )}
        </div>

        <button 
          type="submit" 
          className="group relative w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-[9px] tracking-widest flex items-center justify-center gap-1.5 hover:bg-black transition-all shadow-md active:scale-98"
        >
          <span className="relative z-10">{isReturning ? 'Access Dashboard' : 'Go to payment'}</span> 
          <ArrowRight size={12} className="relative z-10" />
        </button>
        
        <div className="flex items-center justify-center gap-1 text-[7px] font-bold text-slate-400 opacity-60">
          <ShieldCheck size={9} className="text-emerald-500" /> AES-256 Encrypted
        </div>
      </form>
    </div>
  );
};
