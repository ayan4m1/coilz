import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import Helmet from 'react-helmet';

import ResultsCard from 'components/ResultsCard';
import { useFormik } from 'formik';
import { getMaterial, getWire, materials } from 'utils';

export default function SpoolCalculator() {
  const { values, handleChange, handleBlur } = useFormik({
    initialValues: {
      material: null,
      gauge: 28,
      emptyMass: 20,
      currentMass: 50
    }
  });

  const results = [];
  const material = getMaterial(values.material);
  const wire = getWire(values.gauge);

  if (material && wire) {
    const wireMass = values.currentMass - values.emptyMass;
    const wireVolume = wireMass / material.density;
    const wireLength = wireVolume / (Math.PI * Math.pow(wire.diameter / 2, 2));

    results.push(
      ['Wire Volume', `${wireVolume.toFixed(2)} cm^3`],
      ['Wire Length', `${wireLength.toFixed(2)} cm`]
    );
  }

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
                  value={values.material}
                >
                  <option>Select One</option>
                  {materials.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Gauge</Form.Label>
                <Form.Control
                  max="40"
                  min="8"
                  name="gauge"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  step="2"
                  type="number"
                  value={values.gauge}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Empty Spool Mass</Form.Label>
                <Form.Control
                  name="emptyMass"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="number"
                  value={values.emptyMass}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Current Spool Mass</Form.Label>
                <Form.Control
                  name="currentMass"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="number"
                  value={values.currentMass}
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
