'use client';

import React, { useState, useEffect } from 'react';
import { AppState, getTierPrices } from '../datastore.js';
import { storageService } from '../services/storageService.js';

// Global Views
import { AuthenticatedView } from '../components/AuthenticatedView.jsx';

// Landing Page Components
import { NavbarSection } from '../components/NavbarSection.jsx';
import { DiscoverySection } from '../components/DiscoverySection.jsx';
import { PlatformSection } from '../components/PlatformSection.jsx';
import { FooterSection } from '../components/FooterSection.jsx';

const Home = () => {
  const [appState, setAppState] = useState(AppState.LANDING);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem('career_lift_profile');
      if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            setUserProfile(parsed);
            setAppState(AppState.IDLE);
          } catch(e) {
            console.error("Session parse error", e);
          }
      } else {
          setUserProfile(null);
          setAppState(AppState.LANDING);
      }
    };

    checkSession();
    // Listen for hash changes specifically to refresh state if needed 
    window.addEventListener('hashchange', checkSession);
    return () => window.removeEventListener('hashchange', checkSession);
  }, []);

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('career_lift_profile', JSON.stringify(updatedProfile));
    storageService.saveCandidate(updatedProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('career_lift_profile');
    setUserProfile(null);
    setAppState(AppState.LANDING);
  };

  const prices = getTierPrices('UK');

  // 1. Authenticated Dashboard View
  if (appState === AppState.IDLE && userProfile) {
    return (
      <AuthenticatedView 
        userProfile={userProfile} 
        onLogout={handleLogout} 
        onUpdateProfile={handleUpdateProfile}
      />
    );
  }

  // 2. Default: Landing Page View
  return (
    <div className="w-full overflow-hidden bg-white selection:bg-slate-900 selection:text-white">
      <NavbarSection />
      
      <main>
        <DiscoverySection prices={prices} />
        <PlatformSection />
      </main>

      <FooterSection />
    </div>
  );
};

export default Home;