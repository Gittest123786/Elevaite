import React from 'react';
import { Cpu, Target, BarChart3, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { PLATFORM_VALUES } from '../datastore.js';

// Premium Light Glossy Card
const Card = ({ className, children }) => (
  <div className={cn(
    "relative rounded-xl border border-slate-200/60 bg-white/40 backdrop-blur-xl overflow-hidden group transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:border-slate-300/80",
    className
  )}>
    {/* Subtle gloss reflection highlight */}
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
    {children}
  </div>
);

const ICON_MAP = {
  'Strategic AI': Cpu,
  'Gap Analysis': Target,
  'Placement Focus': BarChart3
};

export const PlatformSection = () => {
  return (
    <section id="features" className="py-12 bg-[#f8fafc]/80 text-slate-900 relative overflow-hidden">
      {/* Soft ambient background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/40 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-bold text-indigo-600 tracking-tight block mb-1">
            The infrastructure
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-slate-900">
            Transcending the <br />
            <span className="text-slate-400">traditional resume.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Hero Content Area */}
          <div className="space-y-6">
            <Card className="p-6 border-white/80 bg-gradient-to-br from-white/80 to-slate-50/50">
              <p className="text-base md:text-lg text-slate-800 font-bold leading-snug tracking-tight">
                "In the age of intelligence, your career trajectory shouldn't be left to chance. We provide the diagnostic data needed to dominate your market."
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-0.5 w-6 bg-indigo-500 rounded-full" />
                <span className="text-[9px] font-bold text-slate-400 tracking-tight">Perspective</span>
              </div>
            </Card>

            <div className="flex gap-6 px-1">
              <div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">98%</div>
                <div className="text-[9px] font-bold tracking-tight text-slate-400">Placement rate</div>
              </div>
              <div className="w-px h-5 bg-slate-200 self-center" />
              <div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">4.0</div>
                <div className="text-[9px] font-bold tracking-tight text-slate-400">Model engine</div>
              </div>
            </div>
          </div>

          {/* Feature Cards Area */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-400 tracking-tight block mb-1 px-1">
              Strategic assets
            </span>
            
            {PLATFORM_VALUES.map((item, i) => {
              const Icon = ICON_MAP[item.t] || Cpu;
              return (
                <Card key={i} className="hover:translate-x-1 duration-300">
                  <div className="flex gap-3 items-center p-3">
                    <div className="flex-shrink-0 p-2 bg-white rounded-lg text-indigo-600 border border-slate-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Icon size={16} strokeWidth={2.5} />
                    </div>
                    
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.t}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 leading-normal">
                        {item.d}
                      </p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                      <ChevronRight size={12} className="text-slate-300" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};