
import React from 'react';
import { X, Trash2, Calendar, ChevronRight, Clock, FileText, BarChart2 } from 'lucide-react';

export const HistorySidebar = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelect, 
  onDelete 
}) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            History
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 hover:text-stone-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)] p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              <p className="font-medium">No history yet.</p>
              <p className="text-sm mt-2 text-stone-400">Your analysis results and CV versions will be saved here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="group relative bg-white border border-stone-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer" onClick={() => onSelect(item)}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${item.type === 'GENERATED_CV' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                        {item.type === 'GENERATED_CV' ? 'CV Version' : 'Analysis'}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="text-stone-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-stone-800 mb-1 flex items-center gap-2 line-clamp-1">
                   {item.type === 'GENERATED_CV' ? <FileText size={14} className="text-amber-600 shrink-0" /> : <BarChart2 size={14} className="text-emerald-600 shrink-0" />}
                   {item.careerGoal}
                </h3>
                <div className="flex items-center justify-between mt-3">
                   <div className="flex items-center gap-2">
                      {item.type === 'ANALYSIS' && item.analysisResult && (
                        <div className={`px-2 py-0.5 rounded text-xs font-bold ${item.analysisResult.score > 80 ? 'bg-emerald-100 text-emerald-800' : item.analysisResult.score > 50 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                            Score: {item.analysisResult.score}
                        </div>
                      )}
                      {item.type === 'GENERATED_CV' && <div className="text-xs text-stone-500 italic font-medium">Ready to print</div>}
                   </div>
                   <ChevronRight size={16} className="text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
