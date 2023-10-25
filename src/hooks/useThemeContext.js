import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  value: 'light'
});

export const useThemeContext = () => useContext(ThemeContext);
