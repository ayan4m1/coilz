import PropTypes from 'prop-types';
import { Row, Col, Container } from 'react-bootstrap';

import Card from 'components/Card';

export default function ResultsCard({ title = 'Outputs', results, children }) {
  if (!results?.length && !children) {
    return null;
  }

  return (
    <Card>
      <h3>{title}</h3>
      <Container fluid>
        {results?.length > 0 &&
          results.map(([name, content]) => (
            <Row key={name}>
              <Col xs={3}>
                <strong>{name}</strong>
              </Col>
              <Col xs={9}>{content}</Col>
            </Row>
          ))}
        {children}
      </Container>
    </Card>
  );
}

ResultsCard.propTypes = {
  title: PropTypes.string,
  results: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  children: PropTypes.node
};
