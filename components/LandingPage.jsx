
'use client';

import React, { useState } from 'react';
import { Sparkles, Brain, Target, Heart } from 'lucide-react';
import { PricingTier } from '../app/types.js';

// @ts-ignore
import { NavbarSection } from './NavbarSection.jsx';
// @ts-ignore
import { DiscoverySection } from './DiscoverySection.jsx';
// @ts-ignore
import { PlatformSection } from './PlatformSection.jsx';
// @ts-ignore
import { FooterSection } from './FooterSection.jsx';
// @ts-ignore
import { PricingComparisonModal } from './PricingComparisonModal.jsx';
// @ts-ignore
import { OnboardingFlow } from './OnboardingFlow.jsx';

export const LandingPage = ({ onStart, onAdminLogin }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [initialOnboardingTier, setInitialOnboardingTier] = useState(null);
  
  const handleOnboardingComplete = (profile) => {
    onStart(profile);
    setShowOnboarding(false);
  };

  const startOnboardingWithTier = (tier) => {
    setInitialOnboardingTier(tier);
    setShowComparison(false);
    setShowOnboarding(true);
  };

  const handleGetStarted = () => {
    setInitialOnboardingTier(null);
    setShowOnboarding(true);
  };

  const getTierPrices = (region = 'UK') => {
    const symbol = region === 'India' ? '₹' : region === 'Europe' ? '€' : region === 'UK' ? '£' : region === 'Canada' ? 'C$' : '$';
    switch (region) {
      case 'India': return { l: `${symbol}3,999`, a: `${symbol}7,999`, p: `${symbol}12,999` };
      case 'Europe': return { l: `${symbol}45`, a: `${symbol}89`, p: `${symbol}145` };
      case 'UK': return { l: `${symbol}39`, a: `${symbol}79`, p: `${symbol}129` };
      case 'Canada': return { l: `${symbol}59`, a: `${symbol}119`, p: `${symbol}189` };
      default: return { l: `${symbol}49`, a: `${symbol}99`, p: `${symbol}159` };
    }
  };

  // Default region prices for comparison modal
  const prices = getTierPrices('UK');

  if (showOnboarding) {
      return (
          <OnboardingFlow 
            onComplete={handleOnboardingComplete}
            onShowComparison={() => setShowComparison(true)}
            onBack={() => setShowOnboarding(false)}
            initialTier={initialOnboardingTier}
          />
      );
  }

  return (
    <div className="w-full overflow-hidden bg-white selection:bg-slate-900 selection:text-white">
      <NavbarSection 
        onAdminLogin={onAdminLogin} 
        onGetStarted={handleGetStarted} 
      />
      
      <main>
        <DiscoverySection 
          onStartJourney={handleGetStarted} 
          onViewPlans={() => setShowComparison(true)} 
        />
        
        <PlatformSection />
        

      </main>

      <FooterSection />

      <PricingComparisonModal 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
        onSelectTier={startOnboardingWithTier} 
        prices={prices} 
      />
    </div>
  );
};
