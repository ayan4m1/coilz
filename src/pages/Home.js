import { Fragment } from 'react';
import { ListGroup } from 'react-bootstrap';

import Card from 'components/Card.js';
import Heading from 'components/Heading.js';
import { useThemeContext } from 'hooks/useThemeContext.js';

export default function Home() {
  const { value: theme } = useThemeContext();

  return (
    <Fragment>
      <Heading title="Welcome to Coilz" />
      <h2 className="mb-4" data-bs-theme={theme}>
        Your Vape Toolkit
      </h2>
      <Card>
        <h3 data-bs-theme={theme}>Features</h3>
        <ListGroup>
          <ListGroup.Item variant={theme}>
            Calculate coil resistance
          </ListGroup.Item>
          <ListGroup.Item variant={theme}>
            Define custom coil materials
          </ListGroup.Item>
          <ListGroup.Item variant={theme}>
            Find nicotine/base supply lifetime
          </ListGroup.Item>
          <ListGroup.Item variant={theme}>
            Determine cost to produce e-liquid
          </ListGroup.Item>
          <ListGroup.Item variant={theme}>
            Find best gauge of wire for a given load
          </ListGroup.Item>
          <ListGroup.Item variant={theme}>
            Get nicotine volume for target supply lifetime
          </ListGroup.Item>
          <ListGroup.Item variant={theme}>
            Determine amount of wire remaining on spool
          </ListGroup.Item>
          <ListGroup.Item variant={theme}>
            View amp safety chart for regulated and mechanical mods
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Fragment>
  );
}
