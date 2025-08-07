import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { ListGroup } from 'react-bootstrap';

import Card from 'components/Card.js';
import Heading from 'components/Heading.js';
import { useThemeContext } from 'hooks/useThemeContext.js';

export default function Home() {
  const { value: theme } = useThemeContext();

  const ListGroupItem = ({ children }) => (
    <ListGroup.Item variant={theme}>{children}</ListGroup.Item>
  );

  ListGroupItem.propTypes = {
    children: PropTypes.node.isRequired
  };

  return (
    <Fragment>
      <Heading title="Welcome to Coilz" />
      <h2 className="mb-4" data-bs-theme={theme}>
        Your Vape Toolkit
      </h2>
      <Card>
        <h3 data-bs-theme={theme}>Features</h3>
        <ListGroup>
          <ListGroupItem>Calculate coil resistance</ListGroupItem>
          <ListGroupItem>Define custom coil materials</ListGroupItem>
          <ListGroupItem>Find nicotine/base supply lifetime</ListGroupItem>
          <ListGroupItem>Determine cost to produce e-liquid</ListGroupItem>
          <ListGroupItem>
            Find best gauge of wire for a given load
          </ListGroupItem>
          <ListGroupItem>
            Get nicotine volume for target supply lifetime
          </ListGroupItem>
          <ListGroupItem>
            Determine amount of wire remaining on spool
          </ListGroupItem>
          <ListGroupItem>
            View amp safety chart for regulated and mechanical mods
          </ListGroupItem>
        </ListGroup>
      </Card>
    </Fragment>
  );
}
