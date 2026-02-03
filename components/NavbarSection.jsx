import React, { useState, useEffect } from 'react';
import { Sparkles, LayoutGrid } from 'lucide-react';
import { Button } from "./ui/button.jsx";
import { RecruiterPortal } from './RecruiterPortal.jsx';
import { OnboardingFlow } from './OnboardingFlow.jsx';
import { storageService } from '../services/storageService.js';
import { JourneyStage, getTierPrices } from '../datastore.js';

export const NavbarSection = () => {
  const [showRecruiter, setShowRecruiter] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const prices = getTierPrices('UK');

  // Listen for hash changes to support "Start Journey" buttons in other sections (like DiscoverySection)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#onboarding') {
        setShowOnboarding(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    // Initial check
    if (window.location.hash === '#onboarding') setShowOnboarding(true);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOnboardingComplete = (profile) => {
    const pool = storageService.getTalentPool();
    const existing = pool.find(p => p.contact === profile.contact);
    const finalProfile = existing ? { ...existing, ...profile } : { ...profile, currentStage: JourneyStage.PROFILE };
    
    localStorage.setItem('career_lift_profile', JSON.stringify(finalProfile));
    storageService.saveCandidate(finalProfile);
    
    // Reset state and clear hash to return to main view
    setShowOnboarding(false);
    window.location.hash = '';
    // Force a reload or state refresh in Home is handled by the hashchange listener in app/page.jsx
  };

  const handleBack = () => {
    setShowOnboarding(false);
    window.location.hash = '';
  };

  // Helper to get current user contact for the Recruiter Portal logic
  const getContact = () => {
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('career_lift_profile') : null;
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed ? parsed.contact : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  if (showRecruiter) {
    return (
      <div className="fixed inset-0 z-[200] bg-white overflow-y-auto">
        <RecruiterPortal 
          onLogout={() => setShowRecruiter(false)} 
          currentUserContact={getContact()} 
        />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="fixed inset-0 z-[200] bg-white overflow-y-auto">
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          onBack={handleBack}
          prices={prices}
          initialTier={null}
        />
      </div>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full px-6 py-6 pointer-events-none">
      <nav className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl pointer-events-auto">
        
        {/* Logo Section */}
        <div 
          className="flex items-center gap-2 z-10 cursor-pointer group" 
          onClick={() => { window.location.hash = ''; setShowOnboarding(false); setShowRecruiter(false); }}
        >
          <div className="p-2 bg-indigo-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tighter">
            elev<span className="text-indigo-500">AIte</span>
          </span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <a 
            href="#features" 
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 no-underline"
          >
            The Engine
          </a>
          <a 
            href="#plans" 
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 no-underline"
          >
            Registry
          </a>
          <a 
            href="#security" 
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 no-underline"
          >
            Security
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 z-10">
          <button 
            onClick={() => setShowRecruiter(true)} 
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white hover:text-indigo-400 transition-colors px-4 py-2 no-underline bg-transparent border-none cursor-pointer"
          >
            <LayoutGrid size={16} /> 
            <span>Recruiter Portal</span>
          </button>
          <Button 
            onClick={() => setShowOnboarding(true)} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 rounded-full shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 text-xs"
          >
            Get started
          </Button>
        </div>
      </nav>
    </header>
  );
};