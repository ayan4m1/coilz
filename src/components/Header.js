import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Navbar.Brand>
        <Nav.Item as={Link} to="/">
          <FontAwesomeIcon icon="fire" size="2x" />
        </Nav.Item>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav>
          <Nav.Link as={Link} to="/coils">
            <FontAwesomeIcon icon="calculator" size="2x" /> Coils
          </Nav.Link>
          <Nav.Link as={Link} to="/materials">
            <FontAwesomeIcon icon="thermometer-full" size="2x" /> Materials
          </Nav.Link>
          <Nav.Link as={Link} to="/settings">
            <FontAwesomeIcon icon="cog" size="2x" /> Settings
          </Nav.Link>
          <Nav.Link as={Link} to="/nicotine">
            <FontAwesomeIcon icon="exclamation-triangle" size="2x" /> Nicotine
          </Nav.Link>
          <Nav.Link as={Link} to="/base">
            <FontAwesomeIcon icon="clock" size="2x" /> Base Lifetime
          </Nav.Link>
          <Nav.Link as={Link} to="/mech">
            <FontAwesomeIcon icon="bomb" size="2x" /> Mech
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
