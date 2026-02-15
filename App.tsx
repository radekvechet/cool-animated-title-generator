
import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewArea from './components/PreviewArea';
import CodeExporter from './components/CodeExporter';
import { AppState } from './types';
import { INITIAL_APP_STATE } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_APP_STATE);

  const handleStateChange = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Keyboard shortcut to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isFullscreen) {
        handleStateChange({ isFullscreen: false });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isFullscreen]);

  return (
    <div className={`flex flex-col min-h-screen bg-gray-950 text-gray-100 selection:bg-blue-500/30 transition-colors duration-500 ${state.isFullscreen ? 'bg-black' : ''}`}>
      
      {/* Header / Brand - Hidden in Fullscreen */}
      {!state.isFullscreen && (
        <div className="bg-gray-950 flex items-center justify-between px-6 py-4 border-b border-gray-900 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-lg shadow-blue-500/20 animate-pulse flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-none">Cool Title Gen</span>
              
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <span>GitHub</span>
              <svg className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.412-4.041-1.412-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      )}

      {/* Control Panel - Hidden in Fullscreen */}
      {!state.isFullscreen && (
        <ControlPanel state={state} onChange={handleStateChange} />
      )}
      
      <main className="flex-1 flex flex-col relative">
        <PreviewArea 
          state={state} 
          onEnterFullscreen={() => handleStateChange({ isFullscreen: true })}
          onExitFullscreen={() => handleStateChange({ isFullscreen: false })} 
        />

        {!state.isFullscreen && (
          <CodeExporter state={state} />
        )}
      </main>

      {/* Footer info - Hidden in Fullscreen */}
      {!state.isFullscreen && (
        <footer className="bg-gray-950 border-t border-gray-900 py-6 px-6 text-center animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black">
              Crafted with Precision for Modern Web Experiences
            </p>
            <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-blue-500"/> Tailwind CSS</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-purple-500"/> React 19</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500"/> Gemini AI</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
