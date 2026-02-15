
export type Direction = 'horizontal' | 'vertical' | 'diagonal';
export type Easing = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface GradientPreset {
  id: string;
  name: string;
  classes: string;
  colors: string[];
  stops?: number[]; // Percentages for each color
  isCustom?: boolean;
}

export interface AppState {
  title: string;
  direction: Direction;
  speed: number;
  easing: Easing;
  gradientId: string;
  fontSize: number;
  fontWeight: string;
  isFullscreen: boolean;
  bgSize: number;
  showReflection: boolean;
  reflectionBlur: number;
  reflectionOpacity: number;
  customGradients: GradientPreset[];
}
