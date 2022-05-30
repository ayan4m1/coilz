import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import Helmet from 'react-helmet';
import { Container, Card, Form, Row, Col } from 'react-bootstrap';

import { wires } from 'utils';
import ResultsCard from './ResultsCard';

const copperDensity = 8.96;
const copperHeatCapacity = 0.385;
const puffTime = 3.5;
const standardTemperature = 20;

export default function WiringCalculator() {
  const initialValues = {
    wireLength: 0.1,
    maxVoltageDrop: 0.25,
    maxTempRise: 50,
    maxCurrent: 30
  };
  const { values, handleChange } = useFormik({
    initialValues
  });

  let wireGauge = NaN,
    voltageDrop = 0,
    tempRise = 0;

  for (const { gauge, diameter, ampacity } of wires) {
    voltageDrop = values.maxCurrent * (2 * values.wireLength * ampacity);
    const wastePower = voltageDrop * values.maxCurrent;
    const wasteEnergy = wastePower / puffTime;
    const wireVolume = Math.PI * Math.pow(diameter / 2, 2) * values.wireLength;
    const wireMass = copperDensity * wireVolume;

    tempRise = wasteEnergy / (copperHeatCapacity * wireMass);

    if (voltageDrop < values.maxVoltageDrop && tempRise < values.maxTempRise) {
      wireGauge = gauge;
      break;
    }
  }

  return (
    <Container fluid>
      <Helmet title="Wiring Size Calculator" />
      <h1>
        <FontAwesomeIcon icon="network-wired" size="2x" /> Wiring Size
        Calculator
      </h1>
      <Row>
        <Col md={6} xs={12}>
          <Card body>
            <Card.Title>Inputs</Card.Title>
            <Form>
              <Form.Group>
                <Form.Label>Wire Length (m)</Form.Label>
                <Form.Control
                  min="0"
                  name="wireLength"
                  onChange={handleChange}
                  type="number"
                  value={values.wireLength}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Max. Voltage Drop (V)</Form.Label>
                <Form.Control
                  min="0"
                  name="maxVoltageDrop"
                  onChange={handleChange}
                  type="number"
                  value={values.maxVoltageDrop}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Max. Temp Rise (&deg;C)</Form.Label>
                <Form.Control
                  min="0"
                  name="maxTempRise"
                  onChange={handleChange}
                  type="number"
                  value={values.maxTempRise}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Max. Current (A)</Form.Label>
                <Form.Control
                  min="0"
                  name="maxCurrent"
                  onChange={handleChange}
                  type="number"
                  value={values.maxCurrent}
                />
              </Form.Group>
            </Form>
          </Card>
        </Col>
        <Col sm={6} xs={12}>
          {!isNaN(wireGauge) && (
            <ResultsCard>
              <p>
                You should use <strong>{wireGauge}</strong> AWG wire, which will
                cause a drop of <strong>{voltageDrop.toFixed(2)}</strong> volts
                and heat to roughly{' '}
                <strong>{(standardTemperature + tempRise).toFixed(2)}</strong>{' '}
                &deg;C under a {values.maxCurrent} amp load.
              </p>
            </ResultsCard>
          )}
        </Col>
      </Row>
    </Container>
  );
}
