import PropTypes from 'prop-types';
import { Card as BsCard } from 'react-bootstrap';

import useDarkMode from 'hooks/useDarkMode';

export default function Card({ children, ...props }) {
  const { value: darkMode } = useDarkMode();

  return (
    <BsCard bg={darkMode ? 'dark' : 'light'} body {...props}>
      {children}
    </BsCard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired
};
