
import React, { useState, useEffect, useRef } from 'react';
import { GradientPreset } from '../types';

interface GradientCreatorProps {
  initialGradient?: GradientPreset;
  onSave: (gradient: GradientPreset) => void;
  onClose: () => void;
}

interface Stop {
  color: string;
  position: number;
  id: string;
}

const ADJECTIVES = ['Ethereal', 'Cyber', 'Neon', 'Cosmic', 'Vibrant', 'Misty', 'Golden', 'Electric', 'Arctic', 'Midnight'];
const NOUNS = ['Aura', 'Flow', 'Drift', 'Pulse', 'Wave', 'Vibe', 'Core', 'Glow', 'Nova', 'Bloom'];

const GradientCreator: React.FC<GradientCreatorProps> = ({ initialGradient, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [stops, setStops] = useState<Stop[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialGradient) {
      setName(initialGradient.name);
      const newStops = initialGradient.colors.map((color, i) => ({
        color,
        position: initialGradient.stops ? initialGradient.stops[i] : (i / (initialGradient.colors.length - 1)) * 100,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setStops(newStops);
    } else {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      setName(`${adj} ${noun}`);
      setStops([
        { color: '#3b82f6', position: 0, id: '1' },
        { color: '#8b5cf6', position: 50, id: '2' },
        { color: '#3b82f6', position: 100, id: '3' },
      ]);
    }
  }, [initialGradient]);

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const gradientString = `linear-gradient(to right, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')})`;

  const handleUpdateStop = (id: string, updates: Partial<Stop>) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleAddStop = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setStops([...stops, { color: '#ffffff', position: 50, id: newId }]);
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter(s => s.id !== id));
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!draggingId || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = 'touches' in e ? (e as unknown as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const pos = Math.max(0, Math.min(100, Math.round(((x - rect.left) / rect.width) * 100)));
    handleUpdateStop(draggingId, { position: pos });
  };

  const handleMouseUp = () => setDraggingId(null);

  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId]);

  const handleSave = () => {
    const finalStops = [...stops].sort((a, b) => a.position - b.position);
    onSave({
      // Maintain ID if editing a custom one, otherwise create new custom ID
      id: initialGradient?.isCustom ? initialGradient.id : `custom-${Date.now()}`,
      name: name || 'Custom Gradient',
      classes: '',
      colors: finalStops.map(s => s.color),
      stops: finalStops.map(s => s.position),
      isCustom: true,
    });
  };

  if (stops.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-sm">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Gradient Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-xl font-black text-white focus:outline-none w-full placeholder:text-gray-800"
                placeholder="Name your creation..."
              />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Large Preview */}
          <div className="space-y-4">
            <div 
              className="w-full h-40 rounded-2xl shadow-inner relative group"
              style={{ background: gradientString }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Draggable Track */}
            <div className="relative pt-6 pb-2 px-2">
              <div 
                ref={trackRef}
                className="h-3 w-full bg-gray-800 rounded-full relative"
              >
                {stops.map((stop) => (
                  <div
                    key={stop.id}
                    onMouseDown={() => setDraggingId(stop.id)}
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-20 transition-transform ${draggingId === stop.id ? 'scale-125' : 'hover:scale-110'}`}
                    style={{ left: `${stop.position}%` }}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-white shadow-xl" style={{ backgroundColor: stop.color }} />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-[9px] font-bold text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">
                      {stop.position}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stop List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Color Anchors</label>
              <button 
                onClick={handleAddStop}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add Anchor
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {stops.map((stop) => (
                <div key={stop.id} className="bg-gray-800/40 border border-gray-800 rounded-xl p-3 grid grid-cols-3 items-center gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <input 
                      type="color" 
                      value={stop.color} 
                      onChange={(e) => handleUpdateStop(stop.id, { color: e.target.value })}
                      className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer outline-none flex-shrink-0"
                    />
                    <span className="text-[9px] font-mono text-gray-500 uppercase truncate">{stop.color}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 font-bold">%</span>
                    <input 
                      type="number" 
                      min="0" max="100" 
                      value={stop.position} 
                      onChange={(e) => handleUpdateStop(stop.id, { position: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[11px] font-bold text-white focus:outline-none"
                    />
                  </div>
                  <button 
                    disabled={stops.length <= 2}
                    onClick={() => handleRemoveStop(stop.id)}
                    className="ml-auto p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button 
              onClick={onClose}
              className="flex-1 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              {initialGradient ? 'Save gradient' : 'Create gradient'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientCreator;
