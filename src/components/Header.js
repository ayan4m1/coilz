import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavItem = ({ to, icon, label }) => (
  <Nav.Link as={Link} to={to}>
    <FontAwesomeIcon icon={icon} size="2x" />
    {Boolean(label) && ` ${label}`}
  </Nav.Link>
);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string
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
          <NavItem to="/coils" icon="calculator" label="Coils" />
          <NavItem to="/materials" icon="thermometer-full" label="Materials" />
          <NavItem
            to="/nicotine"
            icon="exclamation-triangle"
            label="Nicotine"
          />
          <NavItem to="/cost" icon="dollar-sign" label="Cost" />
          <NavItem to="/base" icon="clock" label="Base" />
          <NavItem to="/mod" icon="bomb" label="Mod" />
          <NavItem to="/wiring" icon="network-wired" label="Wiring" />
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
