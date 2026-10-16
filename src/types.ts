export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  value: Theme;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
}

export interface Material {
  id: string;
  name: string;
  resistivity: number;
  heatCapacity: number;
  density: number;
}

export interface Wire {
  gauge: number;
  diameter: number;
  ampacity: number;
}

export interface MixPreset {
  id: string;
  name: string;
  useNic: boolean;
  nicBaseStrength: number;
  nicBaseVg: number;
  nicBatchStrength: number;
  maxVg: boolean;
  batchVg: number;
  batchMl: number;
}

export interface Flavor {
  id: string;
  vendor: string;
  flavor: string;
  pct: number;
}

export interface MixIngredient {
  name: string;
  pct: number;
  volume: number;
  mass: number;
}

export interface NamedValueChangeEvent<T> {
  target: {
    name: string;
    value: T;
  };
}
