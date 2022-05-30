import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavItem = ({ to, icon, label, tooltip }) =>
  tooltip ? (
    <OverlayTrigger
      trigger="focus"
      placement="bottom"
      overlay={(props) => <Tooltip {...props}>{tooltip}</Tooltip>}
    >
      <Nav.Link as={Link} to={to}>
        <FontAwesomeIcon icon={icon} size="2x" />
        {Boolean(label) && ` ${label}`}
      </Nav.Link>
    </OverlayTrigger>
  ) : (
    <Nav.Link as={Link} to={to}>
      <FontAwesomeIcon icon={icon} size="2x" />
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
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Navbar.Brand>
        <NavItem to="/" icon="fire" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav>
          <NavItem
            to="/coils"
            icon="calculator"
            label="Coils"
            tooltip="Calculate coil resistance and heat flux."
          />
          <NavItem
            to="/materials"
            icon="thermometer-full"
            label="Materials"
            tooltip="Customize coil materials."
          />
          <NavItem
            to="/nicotine"
            icon="exclamation-triangle"
            label="Nicotine"
            tooltip="Calculate how long your nicotine supply will last."
          />
          <NavItem
            to="/base"
            icon="clock"
            label="Base"
            tooltip="Calculate how long your base supply will last."
          />
          <NavItem
            to="/cost"
            icon="dollar-sign"
            label="Cost"
            tooltip="Calculate the cost of your e-liquid from its components."
          />
          <NavItem
            to="/mod"
            icon="bomb"
            label="Mod"
            tooltip="Calculate amp limit for mechanical and regulated mods."
          />
          <NavItem
            to="/wiring"
            icon="network-wired"
            label="Wiring"
            tooltip="Calculate wire gauge from length and current."
          />
        </Nav>
        <Nav className="ms-auto me-2">
          <Nav.Link
            href="https://paypal.me/ayan4m1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon="heart" /> Donate
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
