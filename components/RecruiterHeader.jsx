import React from 'react';
import { 
  Building2, Users, Sparkles, BarChart3, LogOut 
} from 'lucide-react';
import { RECRUITER_NAV_ITEMS } from '../datastore.js';

const ICON_MAP = {
  'Talent Registry': Users,
  'Clients & Placements': Building2,
  'Matching Engine': Sparkles,
  'CPD Analytics': BarChart3
};

export const RecruiterHeader = ({ activeView, setActiveView, onLogout }) => {
  const handleExit = () => {
    window.location.hash = '';
    if (onLogout) onLogout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full px-6 py-6 pointer-events-none">
      <nav className="max-w-[1800px] mx-auto h-16 px-6 flex items-center justify-between rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl pointer-events-auto">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = ''}>
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tighter">
            elev<span className="text-indigo-500">AIte</span> <span className="text-slate-400 font-medium ml-2 text-sm italic">Talent Pool</span>
          </span>
        </div>
        
        {/* Navigation Items */}
        <div className="hidden lg:flex items-center gap-1">
          {RECRUITER_NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.label] || Users;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id)} 
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeView === item.id 
                    ? 'bg-white text-slate-900 shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleExit} 
          className="px-6 py-2 rounded-full text-xs font-bold text-white border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut size={14} />
          Exit Portal
        </button>
      </nav>
    </header>
  );
};