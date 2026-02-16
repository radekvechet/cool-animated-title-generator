
import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewArea from './components/PreviewArea';
import CodeExporter from './components/CodeExporter';
import { AppState } from './types';
import { INITIAL_APP_STATE } from './constants';

const STORAGE_KEY = 'cool-title-generator-state-v1';

const loadSavedState = (): AppState => {
  if (typeof window === 'undefined') return INITIAL_APP_STATE;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return INITIAL_APP_STATE;
  try {
    const parsed = JSON.parse(saved);
    return { 
      ...INITIAL_APP_STATE, 
      ...parsed, 
      isFullscreen: false
    };
  } catch (e) {
    console.error("Failed to load state from local storage", e);
    return INITIAL_APP_STATE;
  }
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadSavedState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, []);

  // Persistence effect: save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleStateChange = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Keyboard shortcut to exit/toggle fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if the user is typing in an input or textarea
      const isTyping = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isTyping) return;

      if (e.key === 'Escape' && state.isFullscreen) {
        handleStateChange({ isFullscreen: false });
      }
      
      // Toggle fullscreen with 'f'
      if (e.key.toLowerCase() === 'f') {
        handleStateChange({ isFullscreen: !state.isFullscreen });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isFullscreen]);

  return (
    <div className={`flex flex-col min-h-screen bg-gray-950 text-gray-100 selection:bg-blue-500/30 transition-colors duration-500 ${state.isFullscreen ? 'bg-black' : ''} ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 1s ease-out' }}>
      
      {/* Header / Brand - Hidden in Fullscreen */}
      {!state.isFullscreen && (
        <div className="bg-gray-950 flex items-center justify-between px-6 py-4 border-b border-gray-900 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
              <span className={`font-extrabold tracking-tight text-base block leading-none transition-all duration-1000 ${isLoaded ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>Cool Title Gen</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/radekvechet/cool-animated-title-generator" 
              target="_blank" 
              title="Github repo"
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
              Radek Věchet
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
