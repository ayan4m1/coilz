import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Form,
  Navbar,
  Nav,
  OverlayTrigger,
  Tooltip,
  Container
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useDarkMode from 'hooks/useDarkMode';

const NavItem = ({ to, icon, label, tooltip }) =>
  tooltip ? (
    <OverlayTrigger
      overlay={(props) => <Tooltip {...props}>{tooltip}</Tooltip>}
      placement="bottom"
      trigger="hover"
    >
      <Nav.Link as={Link} to={to}>
        <FontAwesomeIcon icon={icon} />
        {Boolean(label) && ` ${label}`}
      </Nav.Link>
    </OverlayTrigger>
  ) : (
    <Nav.Link as={Link} to={to}>
      <FontAwesomeIcon icon={icon} />
      {Boolean(label) && ` ${label}`}
    </Nav.Link>
  );

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string,
  tooltip: PropTypes.string
};

export default function Header() {
  const { value: darkMode, toggle } = useDarkMode();

  return (
    <Navbar
      bg={darkMode ? 'light' : 'dark'}
      className="mb-4"
      expand="lg"
      variant={darkMode ? 'light' : 'dark'}
    >
      <Container>
        <Navbar.Brand>
          <NavItem icon="fire" to="/" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavItem
              icon="calculator"
              label="Coils"
              to="/coils"
              tooltip="Calculate coil resistance and heat flux."
            />
            <NavItem
              icon="thermometer-full"
              label="Materials"
              to="/materials"
              tooltip="Customize coil materials."
            />
            <NavItem
              icon="magic-wand-sparkles"
              label="Mix"
              to="/mix"
              tooltip="Calculate weights for a recipe."
            />
            <NavItem
              icon="exclamation-triangle"
              label="Nicotine"
              to="/nicotine"
              tooltip="Calculate how long your nicotine supply will last."
            />
            <NavItem
              icon="clock"
              label="Base"
              to="/base"
              tooltip="Calculate how long your base supply will last."
            />
            <NavItem
              icon="dollar-sign"
              label="Cost"
              to="/cost"
              tooltip="Calculate the cost of your e-liquid from its components."
            />
            <NavItem
              icon="bomb"
              label="Mod"
              to="/mod"
              tooltip="Calculate amp limit for mechanical and regulated mods."
            />
            <NavItem
              icon="network-wired"
              label="Wiring"
              to="/wiring"
              tooltip="Calculate wire gauge from length and current."
            />
            <NavItem
              icon="ruler"
              label="Spool"
              to="/spool"
              tooltip="Calculate the remaining length of a wire spool."
            />
          </Nav>
          <Nav className="ms-auto me-2" color="inherit">
            <Nav.Link
              href="https://paypal.me/ayan4m1"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon="heart" /> Donate
            </Nav.Link>
            <Nav.Item className="d-flex align-items-center">
              <Form.Check checked={darkMode} onChange={toggle} type="switch" />
              <FontAwesomeIcon
                color={darkMode ? 'black' : 'white'}
                fixedWidth
                icon={darkMode ? 'sun' : 'moon'}
                size="lg"
              />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
