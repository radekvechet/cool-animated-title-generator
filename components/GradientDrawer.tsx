
import React from 'react';
import { AppState, GradientPreset } from '../types';
import { GRADIENTS } from '../constants';

interface GradientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onSelect: (gradientId: string) => void;
  onOpenCreator: (gradient?: GradientPreset) => void;
}

const GradientDrawer: React.FC<GradientDrawerProps> = ({ 
  isOpen, 
  onClose, 
  state, 
  onSelect, 
  onOpenCreator 
}) => {
  // Combine custom gradients (at the start) with presets
  const allGradients = [...state.customGradients, ...GRADIENTS];

  return (
    <div 
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div 
        className={`absolute inset-y-0 right-0 w-80 bg-gray-950 border-l border-gray-800 shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">All Presets</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
          {/* Create Custom Button */}
          <button 
            onClick={() => onOpenCreator()}
            className="w-full p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-blue-600/20 transition-all group mb-4"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Design Custom Gradient</span>
          </button>

          {allGradients.map((g) => {
            const gradientCSS = `linear-gradient(135deg, ${
              g.stops 
                ? g.colors.map((c, i) => `${c} ${g.stops![i]}%`).join(', ')
                : g.colors.join(', ')
            })`;

            return (
              <div
                key={g.id}
                className={`w-full group relative transition-all p-2 rounded-xl border ${
                  state.gradientId === g.id ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10' : 'border-gray-800 bg-gray-900/40'
                }`}
              >
                <div 
                  className="w-full h-16 rounded-lg mb-2 overflow-hidden relative group"
                  style={{ background: gradientCSS }}
                >
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 px-4">
                    <button
                      onClick={() => {
                        onSelect(g.id);
                        onClose();
                      }}
                      className="flex-1 bg-white text-black text-[9px] font-black uppercase tracking-widest py-1.5 rounded-md hover:scale-105 active:scale-95 transition-all"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => onOpenCreator(g)}
                      className="flex-1 bg-white/20 text-white text-[9px] font-black uppercase tracking-widest py-1.5 rounded-md hover:bg-white/30 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className={`text-[11px] font-bold tracking-wider ${state.gradientId === g.id ? 'text-blue-400' : 'text-gray-300'}`}>
                    {g.name}
                  </span>
                  {g.isCustom && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase">Custom</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradientDrawer;
