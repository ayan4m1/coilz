import type { PropsWithChildren } from 'react';
import { Card as BsCard, type CardProps } from 'react-bootstrap';

import { useThemeContext } from '../hooks/useThemeContext';

export default function Card({
  children,
  ...props
}: PropsWithChildren<CardProps>) {
  const { value: theme } = useThemeContext();

  return (
    <BsCard body {...props} data-bs-theme={theme}>
      {children}
    </BsCard>
  );
}
