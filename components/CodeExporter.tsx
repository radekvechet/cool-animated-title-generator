
import React, { useState } from 'react';
import { AppState } from '../types';
import { GRADIENTS } from '../constants';

interface CodeExporterProps {
  state: AppState;
}

type ExportFormat = 'tailwind' | 'styled' | 'framer' | 'vanilla';

const CodeExporter: React.FC<CodeExporterProps> = ({ state }) => {
  const [format, setFormat] = useState<ExportFormat>('tailwind');
  const [copiedType, setCopiedType] = useState<'primary' | 'secondary' | null>(null);
  
  const allGradients = [...state.customGradients, ...GRADIENTS];
  const selectedGradient = allGradients.find(g => g.id === state.gradientId) || GRADIENTS[0];

  const animationClass = {
    horizontal: 'animate-gradient-x',
    vertical: 'animate-gradient-y',
    diagonal: 'animate-gradient-xy',
  }[state.direction];

  const handleCopy = (text: string, type: 'primary' | 'secondary') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const isUsingManualGradient = selectedGradient.isCustom || !!selectedGradient.stops;

  const getGradientCSS = () => {
    if (isUsingManualGradient) {
      const stopsStr = selectedGradient.stops 
        ? selectedGradient.colors.map((c, i) => `${c} ${selectedGradient.stops![i]}%`).join(', ')
        : selectedGradient.colors.join(', ');
      return `linear-gradient(135deg, ${stopsStr})`;
    }
    return `linear-gradient(135deg, var(--tw-gradient-stops))`; // Standard tailwind
  };

  const gradientClasses = isUsingManualGradient ? '' : `bg-gradient-to-br ${selectedGradient.classes}`;

  // --- TAILWIND SNIPPETS ---
  const tailwindJsx = `import React from 'react';

const FlowingTitle = () => {
  return (
    <div className="relative group w-full flex justify-center py-20">
      <h1 
        className="${animationClass} bg-clip-text text-transparent ${gradientClasses} transition-all duration-300 select-none"
        style={{
          fontSize: '${state.fontSize}px',
          fontWeight: '${state.fontWeight === 'black' ? '900' : state.fontWeight}',
          backgroundSize: '${state.bgSize}% ${state.bgSize}%',
          '--speed': '${state.speed}s',
          '--ease': '${state.easing}'${isUsingManualGradient ? `,\n          backgroundImage: '${getGradientCSS()}'` : ''}
        } as React.CSSProperties}
      >
        ${state.title || "Flowing Wave"}
      </h1>
      ${state.showReflection ? `
      {/* Reflection */}
      <h1 
        className="absolute top-full left-0 right-0 ${animationClass} bg-clip-text text-transparent ${gradientClasses} origin-top select-none pointer-events-none"
        style={{
          fontSize: '${state.fontSize}px',
          fontWeight: '${state.fontWeight === 'black' ? '900' : state.fontWeight}',
          backgroundSize: '${state.bgSize}% ${state.bgSize}%',
          opacity: ${state.reflectionOpacity},
          filter: 'blur(${state.reflectionBlur}px)',
          transform: 'scaleY(-0.8) translateY(70%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
          '--speed': '${state.speed}s',
          '--ease': '${state.easing}'${isUsingManualGradient ? `,\n          backgroundImage: '${getGradientCSS()}'` : ''}
        } as React.CSSProperties}
      >
        ${state.title || "Flowing Wave"}
      </h1>` : ''}
    </div>
  );
};`;

  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'gradient-x': { '0%, 100%': { 'background-position': '0% 50%' }, '50%': { 'background-position': '100% 50%' } },
        'gradient-y': { '0%, 100%': { 'background-position': '50% 0%' }, '50%': { 'background-position': '50% 100%' } },
        'gradient-xy': { '0%, 100%': { 'background-position': '0% 0%' }, '50%': { 'background-position': '100% 100%' } },
      },
      animation: {
        'gradient-x': 'gradient-x var(--speed, 8s) var(--ease, ease) infinite',
        'gradient-y': 'gradient-y var(--speed, 8s) var(--ease, ease) infinite',
        'gradient-xy': 'gradient-xy var(--speed, 8s) var(--ease, ease) infinite',
      },
    },
  },
}`;

  // --- STYLED COMPONENTS SNIPPETS ---
  const styledCode = `import styled, { keyframes } from 'styled-components';

const flowX = keyframes\`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
\`;

const Title = styled.h1\`
  font-size: ${state.fontSize}px;
  font-weight: ${state.fontWeight === 'black' ? '900' : state.fontWeight};
  background: ${getGradientCSS()};
  background-size: ${state.bgSize}% ${state.bgSize}%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: \${flowX} ${state.speed}s ${state.easing} infinite;
  user-select: none;
\`;

${state.showReflection ? `const Reflection = styled(Title)\`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  opacity: ${state.reflectionOpacity};
  filter: blur(${state.reflectionBlur}px);
  transform: scaleY(-0.8) translateY(70%);
  mask-image: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0));
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0));
\`;` : ''}`;

  // --- FRAMER MOTION SNIPPETS ---
  const framerCode = `import { motion } from 'framer-motion';

const FlowingTitle = () => {
  return (
    <motion.h1
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ 
        duration: ${state.speed}, 
        ease: "${state.easing}", 
        repeat: Infinity 
      }}
      style={{
        fontSize: "${state.fontSize}px",
        fontWeight: "${state.fontWeight === 'black' ? '900' : state.fontWeight}",
        background: "${getGradientCSS()}",
        backgroundSize: "${state.bgSize}% ${state.bgSize}%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      ${state.title}
    </motion.h1>
  );
};`;

  // --- VANILLA CSS SNIPPETS ---
  const vanillaHtml = `<div class="flow-container">
  <h1 class="flow-title">${state.title}</h1>
  ${state.showReflection ? '<h1 class="flow-title reflection">' + state.title + '</h1>' : ''}
</div>`;

  const vanillaCss = `.flow-title {
  font-size: ${state.fontSize}px;
  font-weight: ${state.fontWeight === 'black' ? '900' : state.fontWeight};
  background: ${getGradientCSS()};
  background-size: ${state.bgSize}% ${state.bgSize}%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: flow ${state.speed}s ${state.easing} infinite;
}

@keyframes flow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.reflection {
  position: absolute;
  top: 100%;
  opacity: ${state.reflectionOpacity};
  filter: blur(${state.reflectionBlur}px);
  transform: scaleY(-0.8) translateY(70%);
  -webkit-mask-image: linear-gradient(to top, black, transparent);
}`;

  const renderExporter = () => {
    switch (format) {
      case 'tailwind':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeBox title="React Component" code={tailwindJsx} onCopy={() => handleCopy(tailwindJsx, 'primary')} isCopied={copiedType === 'primary'} color="blue" />
            <CodeBox title="tailwind.config.js" code={tailwindConfig} onCopy={() => handleCopy(tailwindConfig, 'secondary')} isCopied={copiedType === 'secondary'} color="cyan" />
          </div>
        );
      case 'styled':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <CodeBox title="Styled Components" code={styledCode} onCopy={() => handleCopy(styledCode, 'primary')} isCopied={copiedType === 'primary'} color="pink" />
          </div>
        );
      case 'framer':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <CodeBox title="Framer Motion" code={framerCode} onCopy={() => handleCopy(framerCode, 'primary')} isCopied={copiedType === 'primary'} color="purple" />
          </div>
        );
      case 'vanilla':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeBox title="HTML Structure" code={vanillaHtml} onCopy={() => handleCopy(vanillaHtml, 'primary')} isCopied={copiedType === 'primary'} color="orange" />
            <CodeBox title="CSS Styles" code={vanillaCss} onCopy={() => handleCopy(vanillaCss, 'secondary')} isCopied={copiedType === 'secondary'} color="yellow" />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Format Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {(['tailwind', 'styled', 'framer', 'vanilla'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
              format === f 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105' 
                : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            {f === 'tailwind' && 'Tailwind CSS'}
            {f === 'styled' && 'Styled Components'}
            {f === 'framer' && 'Framer Motion'}
            {f === 'vanilla' && 'Vanilla CSS'}
          </button>
        ))}
      </div>

      {renderExporter()}
    </div>
  );
};

const CodeBox = ({ title, code, onCopy, isCopied, color }: { title: string, code: string, onCopy: () => void, isCopied: boolean, color: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    cyan: 'bg-cyan-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-800/50 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colorMap[color] || 'bg-blue-500'}`} />
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">{title}</span>
        </div>
        <button 
          onClick={onCopy}
          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all ${
            isCopied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-5 overflow-x-auto custom-scrollbar flex-1 relative group">
        <pre className="text-[11px] font-mono text-gray-400 leading-relaxed whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeExporter;
