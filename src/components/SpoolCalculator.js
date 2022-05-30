import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import Helmet from 'react-helmet';

import ResultsCard from 'components/ResultsCard';
import { useFormik } from 'formik';

export default function SpoolCalculator() {
  const results = [];

  const { values, handleChange, handleBlur } = useFormik({
    initialValues: {
      material: null,
      gauge: 28
    }
  });

  return (
    <Container fluid>
      <Helmet title="Spool Calculator" />
      <h1>Spool Calculator</h1>
      <Row>
        <Col sm={6} xs={12}>
          <Card body>
            <Card.Title>Inputs</Card.Title>
            <Form>
              <Form.Group>
                <Form.Label>Material</Form.Label>
                <Form.Select
                  name="material"
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  <option>Select One</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Gauge</Form.Label>
                <Form.Control
                  name="gauge"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.gauge}
                />
              </Form.Group>
            </Form>
          </Card>
        </Col>
        <Col sm={6} xs={12}>
          {results && <ResultsCard results={results} />}
        </Col>
      </Row>
    </Container>
  );
}
