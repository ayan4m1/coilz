import PropTypes from 'prop-types';
import { Card as BsCard } from 'react-bootstrap';

import { useThemeContext } from 'hooks/useThemeContext';

export default function Card({ children, ...props }) {
  const { value: theme } = useThemeContext();

  return (
    <BsCard body {...props} data-bs-theme={theme}>
      {children}
    </BsCard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired
};
