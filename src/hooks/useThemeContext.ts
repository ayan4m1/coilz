import { createContext, useContext } from 'react';

import type { ThemeContextValue } from '../types';

export const ThemeContext = createContext<ThemeContextValue>({
  value: 'light',
  enable: () => {},
  disable: () => {},
  toggle: () => {}
});

export const useThemeContext = () => useContext(ThemeContext);
