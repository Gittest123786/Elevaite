
import React from 'react';
import { JourneyStage } from '../app/types.js';
import { User, Search, BookOpen, FileText, Briefcase, CheckCircle } from 'lucide-react';

export const JourneyTimeline = ({ currentStage }) => {
  const steps = [
    { id: JourneyStage.PROFILE, label: 'Profile', icon: User },
    { id: JourneyStage.ANALYSIS, label: 'Analysis', icon: Search },
    { id: JourneyStage.LEARNING, label: 'Learning', icon: BookOpen },
    { id: JourneyStage.CV_UPDATE, label: 'Update CV', icon: FileText },
    { id: JourneyStage.JOB_READY, label: 'Job Ready', icon: Briefcase },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-stone-200 -z-10 rounded-full"></div>
        <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(currentStage / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = currentStage > step.id;
          const isCurrent = currentStage === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10
                    ${isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : isCurrent 
                            ? 'bg-white border-emerald-600 text-emerald-600 scale-125 shadow-lg shadow-emerald-100' 
                            : 'bg-white border-stone-200 text-stone-300'}
                `}
              >
                {isCompleted ? <CheckCircle size={20} /> : <Icon size={18} />}
              </div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isCurrent ? 'text-emerald-700' : isCompleted ? 'text-emerald-600' : 'text-stone-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
