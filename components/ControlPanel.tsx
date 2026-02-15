
import React, { useState } from 'react';
import { AppState, Direction, Easing, GradientPreset } from '../types';
import { GRADIENTS, DIRECTIONS, EASINGS, INITIAL_APP_STATE } from '../constants';
import GradientCreator from './GradientCreator';
import GradientDrawer from './GradientDrawer';

interface ControlPanelProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingGradient, setEditingGradient] = useState<GradientPreset | undefined>();
  
  const FONT_WEIGHTS = ['normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];
  
  // Combine custom gradients (at the start) with presets for the shortlist
  const allGradients = [...state.customGradients, ...GRADIENTS];

  // Show only first 6 gradients from the combined list in main panel
  const mainGradients = allGradients.slice(0, 6);

  const handleSaveGradient = (newGradient: GradientPreset) => {
    // Logic: Remove any existing version of this gradient from custom list and prepend new one
    // This moves edited items to the top of the list
    const otherCustoms = state.customGradients.filter(g => g.id !== newGradient.id);
    const updatedCustoms = [newGradient, ...otherCustoms];
    
    onChange({
      customGradients: updatedCustoms,
      gradientId: newGradient.id
    });
    
    setIsCreatorOpen(false);
    setEditingGradient(undefined);
    setIsDrawerOpen(false);
  };

  const handleOpenCreator = (gradient?: GradientPreset) => {
    setEditingGradient(gradient);
    setIsCreatorOpen(true);
  };

  return (
    <>
      <div className="w-full bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 p-3 sticky top-0 z-50 overflow-x-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-end gap-5 lg:gap-6 min-w-max">
          
          {/* Title Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Text Content</label>
            <input
              type="text"
              value={state.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-44 transition-all"
              placeholder="Enter title..."
            />
          </div>

          {/* Direction Select */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Flow Direction</label>
            <select
              value={state.direction}
              onChange={(e) => onChange({ direction: e.target.value as Direction })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none pr-6 relative w-28"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.4rem center', backgroundSize: '1rem' }}
            >
              {DIRECTIONS.map((dir) => (
                <option key={dir.value} value={dir.value}>{dir.label}</option>
              ))}
            </select>
          </div>

          {/* Typography */}
          <div className="flex gap-4 border-l border-gray-800 pl-4">
            <div className="flex flex-col gap-1 w-20">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Size</label>
                <span className="text-[10px] text-blue-400 font-mono">{state.fontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="200"
                value={state.fontSize}
                onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Weight</label>
              <select
                value={state.fontWeight}
                onChange={(e) => onChange({ fontWeight: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none pr-6 relative"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.4rem center', backgroundSize: '1rem' }}
              >
                {FONT_WEIGHTS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Animation Config */}
          <div className="flex gap-4 border-l border-gray-800 pl-4">
            <div className="flex flex-col gap-1 w-20">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Duration</label>
                <span className="text-[10px] text-blue-400 font-mono">{state.speed}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={state.speed}
                onChange={(e) => onChange({ speed: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1 w-20">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Zoom</label>
                <span className="text-[10px] text-blue-400 font-mono">{state.bgSize}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={state.bgSize}
                onChange={(e) => onChange({ bgSize: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Easing</label>
              <select
                value={state.easing}
                onChange={(e) => onChange({ easing: e.target.value as Easing })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none pr-6 relative"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.4rem center', backgroundSize: '1rem' }}
              >
                {EASINGS.map((easing) => (
                  <option key={easing.value} value={easing.value}>{easing.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reflection Controls */}
          <div className="flex gap-4 border-l border-gray-800 pl-4 h-full items-center">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Reflect</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={state.showReflection}
                  onChange={(e) => onChange({ showReflection: e.target.checked })}
                />
                <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className={`flex flex-col gap-1 w-16 transition-opacity ${state.showReflection ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Blur</label>
              <input
                type="range"
                min="0"
                max="40"
                value={state.reflectionBlur}
                onChange={(e) => onChange({ reflectionBlur: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Palette Shortlist */}
          <div className="flex flex-col gap-1 border-l border-gray-800 pl-4">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Palette</label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {mainGradients.map((g) => (
                  <button
                    key={g.id}
                    title={g.name}
                    onClick={() => onChange({ gradientId: g.id })}
                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                      state.gradientId === g.id ? 'border-white ring-2 ring-blue-500/50' : 'border-gray-800'
                    }`}
                    style={{ background: `linear-gradient(135deg, ${g.colors.join(', ')})` }}
                  />
                ))}
              </div>
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-500 border border-blue-400 flex items-center justify-center text-white transition-all active:scale-90 shadow-lg shadow-blue-500/20"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Global Actions */}
          <div className="flex gap-2 lg:ml-auto">
            <button
              onClick={() => onChange(INITIAL_APP_STATE)}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
            >
              Reset
            </button>
            <button
              onClick={() => onChange({ isFullscreen: true })}
              className="flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all border border-white/10"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Live
            </button>
          </div>

        </div>
      </div>

      {/* Advanced Creator Modal */}
      {isCreatorOpen && (
        <GradientCreator 
          initialGradient={editingGradient}
          onSave={handleSaveGradient} 
          onClose={() => {
            setIsCreatorOpen(false);
            setEditingGradient(undefined);
          }} 
        />
      )}

      {/* Preset Side Drawer */}
      <GradientDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        state={state}
        onSelect={(id) => onChange({ gradientId: id })}
        onOpenCreator={handleOpenCreator}
      />
    </>
  );
};

export default ControlPanel;
