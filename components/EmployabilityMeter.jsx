
import React, { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export const EmployabilityMeter = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
        setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const data = [
    {
      name: 'Readiness',
      value: animatedScore,
      fill: score > 80 ? '#1e293b' : score > 50 ? '#475569' : '#94a3b8',
    },
  ];

  const getBarColor = (s) => {
      if (s > 80) return 'bg-slate-900';
      if (s > 50) return 'bg-slate-600';
      return 'bg-slate-400';
  };

  const getTextColor = (s) => {
      if (s > 80) return 'text-slate-900';
      if (s > 50) return 'text-slate-600';
      return 'text-slate-400';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Career readiness</h2>
        <p className="text-[10px] font-bold text-slate-400 mt-1">How ready are you for your next job?</p>
      </div>

      <div className="relative w-40 h-40 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#f1f5f9' }}
              dataKey="value"
              cornerRadius={10}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-4xl font-bold ${getTextColor(score)} transition-colors duration-500 tracking-tighter`}>
            {score}%
          </span>
          <span className="text-[9px] text-slate-400 font-bold mt-0.5">Ready</span>
        </div>
      </div>

      <div className="w-full px-4">
          <div className="flex justify-between items-end mb-2">
              <span className="text-[9px] font-bold text-slate-400">Progress</span>
              <span className="text-[9px] font-bold text-slate-900 bg-white/50 px-2 py-0.5 rounded-lg border border-slate-100">{score}% ready</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative p-0.5 shadow-inner">
              <div 
                  className={`h-full ${getBarColor(score)} rounded-full transition-all duration-1000 ease-out relative`}
                  style={{ width: `${score}%` }}
              >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              </div>
          </div>
      </div>
      
      <p className="text-[11px] text-slate-500 mt-6 text-center px-4 font-bold leading-relaxed italic">
        "Bridge remaining gaps to reach <span className="text-slate-900 font-bold">100% readiness</span> for your target job."
      </p>
    </div>
  );
};
