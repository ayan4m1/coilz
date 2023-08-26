import { useCallback, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export default function useDarkMode() {
  const [value, setValue] = useLocalStorageState('darkMode', {
    defaultValue: false
  });
  const enable = useCallback(() => setValue(true), [setValue]);
  const disable = useCallback(() => setValue(false), [setValue]);
  const toggle = useCallback(() => setValue((val) => !val), [setValue]);

  useEffect(() => {
    if (value) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [value]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = mediaQuery.addEventListener('change', (e) =>
      e.matches ? enable() : disable()
    );

    if (mediaQuery.matches) {
      enable();
    } else {
      disable();
    }

    return () => mediaQuery.removeEventListener('change', listener);
  }, [disable, enable]);

  return {
    value,
    enable,
    disable,
    toggle
  };
}
