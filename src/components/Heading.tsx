import { Fragment } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useThemeContext } from '../hooks/useThemeContext';

interface HeadingProps {
  icon?: IconDefinition;
  title: string;
}

export default function Heading({ icon, title }: HeadingProps) {
  const { value: theme } = useThemeContext();

  return (
    <Fragment>
      <title>Coilz - {title}</title>
      <h1 className={`mb-4 text-${theme === 'light' ? 'dark' : 'light'}`}>
        {icon && (
          <FontAwesomeIcon
            color={theme === 'light' ? 'black' : 'white'}
            icon={icon}
            size="lg"
          />
        )}{' '}
        {title}
      </h1>
    </Fragment>
  );
}
