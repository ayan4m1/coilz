import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { ListGroup } from 'react-bootstrap';

import Card from 'components/Card';
import Heading from 'components/Heading';
import useDarkMode from 'hooks/useDarkMode';

export default function Home() {
  const { value: darkMode } = useDarkMode();

  const ListGroupItem = ({ children }) => (
    <ListGroup.Item variant={darkMode ? 'dark' : ''}>{children}</ListGroup.Item>
  );

  ListGroupItem.propTypes = {
    children: PropTypes.node.isRequired
  };

  return (
    <Fragment>
      <Heading title="Welcome to Coilz" />
      <h2 className="mb-4">Your Vape Toolkit</h2>
      <Card>
        <h3>Features</h3>
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
