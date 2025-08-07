import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { ThemeContext } from 'hooks/useThemeContext.js';

export default function DarkModeProvider({ children }) {
  const [value, setValue] = useLocalStorageState('theme', {
    defaultValue: 'light'
  });
  const enable = useCallback(() => setValue('dark'), [setValue]);
  const disable = useCallback(() => setValue('light'), [setValue]);
  const toggle = useCallback(
    () => setValue((val) => (val === 'light' ? 'dark' : 'light')),
    [setValue]
  );
  const sync = useCallback(
    (query) => (query.matches ? enable() : disable()),
    [enable, disable]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = mediaQuery.addEventListener('change', sync);

    sync(mediaQuery);

    return () => mediaQuery.removeEventListener('change', listener);
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

DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired
};
