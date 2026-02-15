
import { GradientPreset, Direction, Easing, AppState } from './types';

export const GRADIENTS: GradientPreset[] = [
  { id: 'ocean', name: 'Arctic Ocean', classes: 'from-blue-600 via-cyan-400 to-blue-600', colors: ['#2563eb', '#22d3ee', '#2563eb'] },
  { 
    id: 'prism', 
    name: 'Prism Flow', 
    classes: '', 
    colors: ['#4f46e5', '#c084fc', '#ffffff', '#9972d7', '#4f46e5'],
    stops: [0, 50, 52, 57, 100]
  },
  { id: 'sunset', name: 'Vibrant Sunset', classes: 'from-orange-500 via-rose-500 to-orange-500', colors: ['#f97316', '#f43f5e', '#f97316'] },
  { id: 'lavender', name: 'Cosmic Lavender', classes: 'from-indigo-600 via-purple-400 to-indigo-600', colors: ['#4f46e5', '#c084fc', '#4f46e5'] },
  { id: 'mint', name: 'Fresh Mint', classes: 'from-emerald-500 via-teal-300 to-emerald-500', colors: ['#10b981', '#5eead4', '#10b981'] },
  { id: 'aurora', name: 'Aurora Borealis', classes: 'from-green-400 via-blue-500 to-purple-600', colors: ['#4ade80', '#3b82f6', '#9333ea'] },
  { id: 'fire', name: 'Magma Flow', classes: 'from-red-600 via-amber-500 to-red-600', colors: ['#dc2626', '#f59e0b', '#dc2626'] },
  { id: 'midnight', name: 'Midnight Glass', classes: 'from-slate-400 via-slate-100 to-slate-400', colors: ['#94a3b8', '#f1f5f9', '#94a3b8'] },
  { id: 'electric', name: 'Electric Violet', classes: 'from-violet-600 via-fuchsia-400 to-violet-600', colors: ['#7c3aed', '#e879f9', '#7c3aed'] },
  { id: 'neon', name: 'Neon Jungle', classes: 'from-lime-500 via-emerald-400 to-cyan-500', colors: ['#84cc16', '#34d399', '#06b6d4'] },
  { id: 'tropical', name: 'Tropical Dream', classes: 'from-yellow-400 via-orange-500 to-pink-500', colors: ['#facc15', '#f97316', '#ec4899'] },
  { id: 'mist', name: 'Silver Mist', classes: 'from-gray-300 via-slate-200 to-gray-400', colors: ['#d1d5db', '#e2e8f0', '#9ca3af'] },
  { id: 'golden', name: 'Golden Hour', classes: 'from-amber-400 via-orange-400 to-yellow-600', colors: ['#fbbf24', '#fb923c', '#ca8a04'] },
  { id: 'cherry', name: 'Cherry Blossom', classes: 'from-pink-300 via-rose-300 to-pink-400', colors: ['#f9a8d4', '#fda4af', '#f472b6'] },
  { id: 'deepsea', name: 'Deep Sea', classes: 'from-blue-900 via-indigo-800 to-blue-700', colors: ['#1e3a8a', '#3730a3', '#1d4ed8'] },
  { id: 'forest', name: 'Forest Edge', classes: 'from-green-800 via-emerald-600 to-lime-700', colors: ['#064e3b', '#059669', '#4d7c0f'] },
  { id: 'desert', name: 'Desert Sands', classes: 'from-amber-200 via-orange-200 to-amber-400', colors: ['#fde68a', '#fed7aa', '#fbbf24'] },
  { id: 'cyber', name: 'Cyberpunk', classes: 'from-pink-500 via-purple-600 to-cyan-400', colors: ['#ec4899', '#9333ea', '#22d3ee'] },
  { id: 'quartz', name: 'Rose Quartz', classes: 'from-rose-100 via-pink-100 to-rose-200', colors: ['#ffe4e6', '#fdf2f8', '#fecdd3'] },
  { id: 'slate', name: 'Slate Blue', classes: 'from-slate-700 via-indigo-400 to-slate-800', colors: ['#334155', '#818cf8', '#1e293b'] },
  { id: 'lime', name: 'Lime Twist', classes: 'from-lime-300 via-green-400 to-lime-500', colors: ['#bef264', '#4ade80', '#84cc16'] }
];

export const DIRECTIONS: { label: string; value: Direction }[] = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
  { label: 'Diagonal', value: 'diagonal' }
];

export const EASINGS: { label: string; value: Easing }[] = [
  { label: 'Ease', value: 'ease' },
  { label: 'Linear', value: 'linear' },
  { label: 'Ease In-Out', value: 'ease-in-out' },
  { label: 'Ease In', value: 'ease-in' },
  { label: 'Ease Out', value: 'ease-out' }
];

export const INITIAL_APP_STATE: AppState = {
  title: 'Super Flow Title',
  direction: 'diagonal',
  speed: 8,
  easing: 'ease-in-out',
  gradientId: 'ocean',
  fontSize: 96,
  fontWeight: 'black',
  isFullscreen: false,
  bgSize: 400,
  showReflection: true,
  reflectionBlur: 8,
  reflectionOpacity: 0.3,
  customGradients: []
};
