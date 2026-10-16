import { type PropsWithChildren, useCallback, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import type { Theme } from '../types';
import { ThemeContext } from '../hooks/useThemeContext';

export default function DarkModeProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useLocalStorageState<Theme>('theme', {
    defaultValue: 'light'
  });
  const enable = useCallback(() => setValue('dark'), [setValue]);
  const disable = useCallback(() => setValue('light'), [setValue]);
  const toggle = useCallback(
    () => setValue((val) => (val === 'light' ? 'dark' : 'light')),
    [setValue]
  );
  const sync = useCallback(
    (query: MediaQueryList | MediaQueryListEvent) =>
      query.matches ? enable() : disable(),
    [enable, disable]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', sync);
    sync(mediaQuery);

    return () => mediaQuery.removeEventListener('change', sync);
  }, [sync]);

  useEffect(() => {
    if (value === 'light') {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    } else if (value === 'dark') {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    }
  }, [value]);

  return (
    <ThemeContext.Provider
      value={{
        value,
        enable,
        disable,
        toggle
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
