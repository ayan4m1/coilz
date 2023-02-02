import {
  faBomb,
  faCalculator,
  faClock,
  faDollarSign,
  faExclamationTriangle,
  faFire,
  faHeart,
  faMagicWandSparkles,
  faNetworkWired,
  faRuler,
  faThermometerFull,
  faSun,
  faMoon
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  icon: PropTypes.object.isRequired,
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
          <NavItem icon={faFire} to="/" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavItem
              icon={faCalculator}
              label="Coils"
              to="/coils"
              tooltip="Calculate coil resistance and heat flux."
            />
            <NavItem
              icon={faThermometerFull}
              label="Materials"
              to="/materials"
              tooltip="Customize coil materials."
            />
            <NavItem
              icon={faMagicWandSparkles}
              label="Mix"
              to="/mix"
              tooltip="Calculate weights for a recipe."
            />
            <NavItem
              icon={faExclamationTriangle}
              label="Nicotine"
              to="/nicotine"
              tooltip="Calculate how long your nicotine supply will last."
            />
            <NavItem
              icon={faClock}
              label="Base"
              to="/base"
              tooltip="Calculate how long your base supply will last."
            />
            <NavItem
              icon={faDollarSign}
              label="Cost"
              to="/cost"
              tooltip="Calculate the cost of your e-liquid from its components."
            />
            <NavItem
              icon={faBomb}
              label="Mod"
              to="/mod"
              tooltip="Calculate amp limit for mechanical and regulated mods."
            />
            <NavItem
              icon={faNetworkWired}
              label="Wiring"
              to="/wiring"
              tooltip="Calculate wire gauge from length and current."
            />
            <NavItem
              icon={faRuler}
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
              <FontAwesomeIcon icon={faHeart} /> Donate
            </Nav.Link>
            <Nav.Item className="d-flex align-items-center">
              <Form.Check checked={darkMode} onChange={toggle} type="switch" />
              <FontAwesomeIcon
                color={darkMode ? 'black' : 'white'}
                fixedWidth
                icon={darkMode ? faSun : faMoon}
                size="lg"
              />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
