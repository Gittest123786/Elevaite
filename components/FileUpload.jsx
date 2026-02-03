
import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, FileText, Target, CheckCircle, Trash2, Wand2, Compass, PenTool, Sparkles } from 'lucide-react';
import mammoth from 'mammoth';
import { cn } from '../lib/utils.js';

export const FileUpload = ({ 
    onAnalyse, 
    onGenerateCV, 
    onSuggestCareers, 
    isLoading, 
    isGeneratingCV, 
    isRecommending,
    initialGoal = ''
}) => {
  const [careerGoal, setCareerGoal] = useState(initialGoal);
  const [textInput, setTextInput] = useState('');
  const [storedFile, setStoredFile] = useState(null);
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'manual'
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialGoal) setCareerGoal(initialGoal);
  }, [initialGoal]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const base64Content = base64String.split(',')[1];
            setStoredFile({
                name: file.name,
                content: base64Content,
                mimeType: file.type
            });
            setTextInput('');
        };
        reader.readAsDataURL(file);
    } 
    else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target?.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                setStoredFile({
                    name: file.name,
                    content: result.value,
                    mimeType: null 
                });
                setTextInput('');
            } catch (err) {
                console.error("Error parsing word document:", err);
                const textReader = new FileReader();
                textReader.onload = (re) => {
                    setStoredFile({
                        name: file.name,
                        content: re.target?.result,
                        mimeType: null
                    });
                };
                textReader.readAsText(file);
            }
        };
        reader.readAsArrayBuffer(file);
    }
    else {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result;
             setStoredFile({
                name: file.name,
                content: text,
                mimeType: null
            });
            setTextInput('');
        };
        reader.readAsText(file);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setStoredFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFinalContent = () => activeMode === 'upload' ? (storedFile ? storedFile.content : '') : textInput;
  const getMimeType = () => activeMode === 'upload' ? (storedFile ? storedFile.mimeType : null) : null;

  const handleCheckCareerClick = () => {
    const finalContent = getFinalContent();
    if ((finalContent.length > 0) && careerGoal.trim().length > 0) {
      onAnalyse(finalContent, getMimeType(), careerGoal);
    }
  };

  const handleGenerateCVClick = () => {
    const finalContent = getFinalContent();
    if ((finalContent.length > 0) && careerGoal.trim().length > 0) {
      onGenerateCV(finalContent, getMimeType(), careerGoal);
    }
  };

  const handleSuggestClick = () => {
    const finalContent = getFinalContent();
    if (finalContent.length > 0) {
        onSuggestCareers(finalContent, getMimeType());
    }
  };

  const hasContent = activeMode === 'upload' ? !!storedFile : textInput.trim().length > 20;
  const isGoalReady = hasContent && careerGoal.trim().length > 2;
  const anyLoading = isLoading || isGeneratingCV || isRecommending;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />

        <div className="mb-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <label className="text-slate-950 font-black flex items-center gap-3 text-xl tracking-tight">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  1. Your Experience
              </label>

              {/* Mode Switcher Tabs */}
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                <button 
                  onClick={() => setActiveMode('upload')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold tracking-tight transition-all duration-300",
                    activeMode === 'upload' 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <UploadCloud size={14} /> Upload CV
                </button>
                <button 
                  onClick={() => setActiveMode('manual')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold tracking-tight transition-all duration-300",
                    activeMode === 'manual' 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <PenTool size={14} /> Write My CV
                </button>
              </div>
            </div>

            <div className="relative">
              {activeMode === 'upload' ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div 
                      className={`relative border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-64
                          ${storedFile 
                              ? 'bg-indigo-50/50 border-indigo-200' 
                              : anyLoading ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50 hover:border-indigo-400 border-slate-200'}
                      `}
                      onClick={() => !storedFile && fileInputRef.current?.click()}
                  >
                      <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef} 
                          accept="image/*,.txt,.md,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileChange}
                      />
                      {storedFile ? (
                          <div className="flex flex-col items-center animate-fade-in">
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-indigo-100 mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                              </div>
                              <span className="text-sm font-black text-slate-900 px-4 truncate max-w-[300px]">{storedFile.name}</span>
                              <button onClick={handleRemoveFile} className="mt-4 text-[10px] flex items-center text-red-500 hover:text-red-700 font-black px-4 py-2 hover:bg-red-50 rounded-xl uppercase tracking-widest transition-colors border border-transparent hover:border-red-100">
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Remove File
                              </button>
                          </div>
                      ) : (
                          <>
                              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-8 h-8 text-slate-300" />
                              </div>
                              <span className="text-sm font-bold text-slate-700">Drop your CV here</span>
                              <span className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">Supports PDF, Word, or Photos</span>
                          </>
                      )}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <textarea 
                        className="w-full h-64 p-8 text-sm border border-slate-200 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none text-slate-900 placeholder:text-slate-400 font-medium bg-slate-50/50 shadow-inner"
                        placeholder="Paste your professional experience, key responsibilities, and achievements here... We'll use this to build or analyze your profile."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        disabled={anyLoading}
                    />
                </div>
              )}
            </div>
        </div>

        <div className="mb-10 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative z-10">
            <label className="block text-slate-950 font-black mb-4 flex items-center gap-3 text-xl tracking-tight">
                <Target className="w-6 h-6 text-indigo-600" />
                2. Target Goal
            </label>
            <div className="flex flex-col gap-4">
                 <input 
                    type="text"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="e.g. Senior Product Manager, Lead Engineer..."
                    disabled={anyLoading}
                    className="w-full p-5 text-lg font-black text-slate-950 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-200 shadow-sm"
                />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">We'll bridge the gap between your history and this goal.</p>
                <button 
                    onClick={handleSuggestClick}
                    disabled={anyLoading || (activeMode === 'upload' && !storedFile) || (activeMode === 'manual' && textInput.length < 20)}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                      ((activeMode === 'upload' && storedFile) || (activeMode === 'manual' && textInput.length >= 20)) && !anyLoading 
                        ? 'text-indigo-600 hover:text-indigo-800' 
                        : 'text-slate-300 cursor-not-allowed'
                    )}
                >
                    <Compass size={14} />
                    Auto-Suggest Careers
                </button>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 relative z-10">
          <button 
              onClick={handleCheckCareerClick}
              disabled={anyLoading || !isGoalReady}
              className={cn(
                "flex-1 py-6 px-10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-3",
                isGoalReady && !anyLoading
                  ? "bg-slate-900 text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-slate-200" 
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              )}
          >
              {isLoading ? (
                  <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Analysing...
                  </>
              ) : (
                <>
                  <Sparkles size={16} className="text-sky-300" />
                  Check my career
                </>
              )}
          </button>
          <button 
              onClick={handleGenerateCVClick}
              disabled={anyLoading || !isGoalReady}
              className={cn(
                "flex-1 py-6 px-10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-2",
                isGoalReady && !anyLoading
                  ? "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-50" 
                  : "bg-white text-slate-200 border-slate-100 cursor-not-allowed"
              )}
          >
             {isGeneratingCV ? (
                  <div className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                      Generating...
                  </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Wand2 size={16} />
                  Engineer New CV
                </div>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};
