import { useCallback, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export default function useDarkMode(initialState) {
  const [value, setValue] = useLocalStorageState('darkMode', {
    defaultValue: initialState
  });
  const enable = useCallback(() => setValue(true), [setValue]);
  const disable = useCallback(() => setValue(true), [setValue]);
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

  return {
    value,
    enable,
    disable,
    toggle
  };
}
