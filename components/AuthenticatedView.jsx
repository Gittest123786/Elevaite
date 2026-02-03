
import React, { useState, useEffect } from 'react';
import { AppState, JourneyStage, PricingTier } from '../app/types.js';
import { analyseCV, generateTailoredCV, suggestCareers, fetchMarketInsights } from '../services/geminiService.js';
import { storageService } from '../services/storageService.js';
import { generateDocxCV } from '../services/docxService.js';
import { Dashboard } from './Dashboard.jsx';
import { HistorySidebar } from './HistorySidebar.jsx';
import { Sparkles, History, LogOut } from 'lucide-react';

export const AuthenticatedView = ({ userProfile, onLogout, onUpdateProfile }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedCV, setGeneratedCV] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);
  
  const [uploadedContent, setUploadedContent] = useState(null);
  const [uploadedMimeType, setUploadedMimeType] = useState(null);

  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);

  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    // Load history
    const savedHistory = localStorage.getItem('career_lift_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    // Initial load of analysis if exists in profile
    if (userProfile?.lastAnalysis) {
        setAnalysisResult(userProfile.lastAnalysis);
        fetchMarketInsights(userProfile.careerAspirations, userProfile.region).then(setMarketInsights);
    }
  }, [userProfile]);

  const handleUpdateTier = (newTier) => {
    const updatedProfile = { ...userProfile, selectedTier: newTier };
    onUpdateProfile(updatedProfile);
  };

  const handleAnalyse = async (text, mimeType, careerGoal) => {
    setIsAnalysing(true);
    setUploadedContent(text);
    setUploadedMimeType(mimeType);
    try {
        const [analysis, market] = await Promise.all([
            analyseCV(text, mimeType, careerGoal, userProfile || undefined),
            fetchMarketInsights(careerGoal, userProfile?.region)
        ]);
        setAnalysisResult(analysis);
        setMarketInsights(market);
        
        const updatedProfile = { 
            ...userProfile, 
            lastAnalysis: analysis, 
            currentStage: Math.max(userProfile.currentStage ?? 0, JourneyStage.LEARNING) 
        };
        onUpdateProfile(updatedProfile);

        const newItem = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            careerGoal,
            type: 'ANALYSIS',
            analysisResult: analysis,
            marketInsights: market
        };
        addToHistory(newItem);
    } catch (e) {
        console.error("Analysis Error:", e);
    } finally {
        setIsAnalysing(false);
    }
  };

  const handleGenerateCV = async (text, mimeType, careerGoal, currentAnalysis) => {
    setIsGeneratingCV(true);
    const finalContent = uploadedContent || text;
    const finalMime = uploadedMimeType || mimeType;

    try {
        const cv = await generateTailoredCV(finalContent, finalMime, careerGoal, userProfile || undefined, currentAnalysis);
        setGeneratedCV(cv);
        
        await generateDocxCV(cv);
        
        const updatedProfile = { 
            ...userProfile, 
            currentStage: JourneyStage.JOB_READY,
            cvAttemptsUsed: (userProfile.cvAttemptsUsed || 0) + 1
        };
        onUpdateProfile(updatedProfile);

        const newItem = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            careerGoal,
            type: 'GENERATED_CV',
            generatedCV: cv
        };
        addToHistory(newItem);
    } catch (e) {
         console.error("CV Generation Error:", e);
    } finally {
        setIsGeneratingCV(false);
    }
  };

  const handleSuggestCareers = async (text, mimeType) => {
    try {
        const suggestions = await suggestCareers(text, mimeType, userProfile?.region);
        console.log("Career Suggestions:", suggestions);
    } catch (e) {
        console.error("Career Suggestions Error:", e);
    }
  };

  const addToHistory = (item) => {
    setHistory(prev => {
        const newHistory = [item, ...prev];
        localStorage.setItem('career_lift_history', JSON.stringify(newHistory));
        return newHistory;
    });
  };

  const handleHistorySelect = (item) => {
    if (item.type === 'ANALYSIS' && item.analysisResult) {
        setAnalysisResult(item.analysisResult);
        setMarketInsights(item.marketInsights || null);
        setGeneratedCV(null);
    } else if (item.type === 'GENERATED_CV' && item.generatedCV) {
        setGeneratedCV(item.generatedCV);
    }
    setIsHistoryOpen(false);
  };
  
  const handleHistoryDelete = (id) => {
    setHistory(prev => {
        const newHistory = prev.filter(h => h.id !== id);
        localStorage.setItem('career_lift_history', JSON.stringify(newHistory));
        return newHistory;
    });
  };

  return (
    <div className="min-h-screen font-jakarta text-slate-900 pb-20 bg-slate-50 selection:bg-slate-900 selection:text-white">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {
              setAnalysisResult(null); 
              setGeneratedCV(null);
          }}>
            <div className="bg-slate-900 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-slate-200">
              <Sparkles className="text-white w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-950">elevAIte</span>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden md:flex items-center text-xs text-slate-500">
                <span className="font-bold text-slate-900 mr-2">{userProfile.name}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${userProfile.selectedTier === PricingTier.ELITE ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  {userProfile.selectedTier}
                </span>
              </div>
            )}
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all relative group"
              title="History"
            >
              <History size={18} className="group-hover:rotate-12 transition-transform" />
              {history.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-white"></span>}
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Dashboard 
          userProfile={userProfile}
          analysisResult={analysisResult}
          marketInsights={marketInsights}
          generatedCV={generatedCV}
          isAnalysing={isAnalysing}
          isGeneratingCV={isGeneratingCV}
          onAnalyse={handleAnalyse}
          onGenerateCV={handleGenerateCV}
          onSuggestCareers={handleSuggestCareers}
          onUpdateTier={handleUpdateTier}
          onReset={() => {
              setAnalysisResult(null);
              setGeneratedCV(null);
          }}
        />
      </main>
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryDelete}
      />
    </div>
  );
};
