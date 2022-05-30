import PropTypes from 'prop-types';
import { Card, Row, Col, Container } from 'react-bootstrap';

export default function ResultsCard({ title = 'Outputs', results, children }) {
  if (!results?.length && !children) {
    return null;
  }

  return (
    <Card body>
      <Card.Title>{title}</Card.Title>
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
