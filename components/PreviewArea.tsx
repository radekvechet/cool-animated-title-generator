
import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';
import { GRADIENTS } from '../constants';

interface PreviewAreaProps {
  state: AppState;
  onExitFullscreen?: () => void;
  onEnterFullscreen?: () => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ state, onExitFullscreen, onEnterFullscreen }) => {
  const [showHint, setShowHint] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);
  
  const allGradients = [...state.customGradients, ...GRADIENTS];
  const selectedGradient = allGradients.find(g => g.id === state.gradientId) || GRADIENTS[0];

  const animationClass = {
    horizontal: 'animate-gradient-x',
    vertical: 'animate-gradient-y',
    diagonal: 'animate-gradient-xy',
  }[state.direction];

  // Use inline style if custom OR if specific stops are defined (for complex default gradients)
  const isUsingManualGradient = selectedGradient.isCustom || !!selectedGradient.stops;

  const gradientBackground = isUsingManualGradient 
    ? `linear-gradient(135deg, ${
        selectedGradient.stops 
          ? selectedGradient.colors.map((c, i) => `${c} ${selectedGradient.stops![i]}%`).join(', ')
          : selectedGradient.colors.join(', ')
      })`
    : undefined;

  const dynamicBgStyle = { 
    '--speed': `${state.speed}s`, 
    '--ease': state.easing,
    backgroundSize: `${state.bgSize}% ${state.bgSize}%`,
    fontSize: `${state.fontSize}px`,
    fontWeight: state.fontWeight === 'black' ? '900' : state.fontWeight,
    lineHeight: 1.1,
    backgroundImage: gradientBackground,
  } as React.CSSProperties;

  const handleMouseEnter = () => {
    if (state.isFullscreen) return;
    hoverTimerRef.current = window.setTimeout(() => {
      setShowHint(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setShowHint(false);
  };

  const handleClick = () => {
    if (!state.isFullscreen && onEnterFullscreen) {
      onEnterFullscreen();
      setShowHint(false);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  return (
    <div 
      className={`flex-1 flex flex-col items-center justify-center min-h-[500px] p-8 relative overflow-hidden transition-all duration-500 cursor-pointer group/area ${state.isFullscreen ? 'fixed inset-0 z-[100] bg-black cursor-default' : ''}`}
      onClick={handleClick}
    >
      
      {/* Exit Fullscreen Button */}
      {state.isFullscreen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExitFullscreen?.();
          }}
          className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 text-white transition-all group active:scale-90"
          title="Exit Fullscreen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Background Decorative Element */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${state.isFullscreen ? 'opacity-40' : 'opacity-20'}`}>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[120px] rounded-full transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${selectedGradient.colors[Math.floor(selectedGradient.colors.length/2)]}55 0%, transparent 70%)` }}
        />
      </div>

      <div 
        className={`z-10 text-center w-full transition-all duration-500 ${state.isFullscreen ? 'scale-110' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative group inline-block">
          <h1 
            className={`font-black bg-clip-text text-transparent transition-all duration-300 select-none whitespace-pre-wrap ${!isUsingManualGradient ? `bg-gradient-to-br ${selectedGradient.classes}` : ''} ${animationClass}`}
            style={dynamicBgStyle}
          >
            {state.title || "Flowing Wave"}
          </h1>
          
          {/* Reflection */}
          {state.showReflection && (
            <h1 
              className={`absolute top-full left-0 right-0 font-black bg-clip-text text-transparent transition-all duration-300 scale-y-[-0.8] translate-y-[70%] origin-top select-none pointer-events-none whitespace-pre-wrap ${!isUsingManualGradient ? `bg-gradient-to-br ${selectedGradient.classes}` : ''} ${animationClass}`}
              style={{
                ...dynamicBgStyle,
                opacity: state.reflectionOpacity,
                filter: `blur(${state.reflectionBlur}px)`,
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
              }}
            >
              {state.title || "Flowing Wave"}
            </h1>
          )}
        </div>
      </div>

      {/* Fullscreen Hint Label */}
      {!state.isFullscreen && (
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 pointer-events-none z-20 ${showHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Preview in Fullscreen</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
