import {
  faExclamationTriangle,
  faNetworkWired
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useState, useCallback, Fragment } from 'react';
import { Form, Row, Col, InputGroup, Alert, Button } from 'react-bootstrap';

import Card from 'components/Card';
import ResultsCard from 'components/ResultsCard';
import Heading from 'components/Heading';
import { wires } from 'utils';

const copperDensity = 8.96;
const copperHeatCapacity = 0.385;
const puffTime = 3.5;
const standardTemperature = 20;

export default function WiringCalculator() {
  const [results, setResults] = useState(null);
  const { errors, values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      wireLength: 0.1,
      maxVoltageDrop: 0.25,
      maxTempRise: 50,
      maxCurrent: 30
    },
    validate: useCallback(
      ({ wireLength, maxVoltageDrop, maxTempRise, maxCurrent }) => {
        const result = {};

        if (wireLength <= 0) {
          result.wireLength = 'Wire length must be greater than zero.';
        }

        if (maxVoltageDrop <= 0) {
          result.maxVoltageDrop = 'Max voltage drop must be greater than zero.';
        }

        if (maxTempRise <= 0) {
          result.maxTempRise = 'Max temp rise must be greater than zero.';
        } else if (maxTempRise >= 250) {
          result.maxTempRise = 'Max temp rise must be less than 250.';
        }

        if (maxCurrent <= 0) {
          result.maxCurrent = 'Max current must be greater than zero.';
        } else if (maxCurrent > 200) {
          result.maxCurrent = 'Max current must be less than 200.';
        }

        return result;
      },
      []
    ),
    onSubmit: useCallback(
      ({ wireLength, maxVoltageDrop, maxTempRise, maxCurrent }) => {
        let wireGauge = NaN,
          voltageDrop = 0,
          tempRise = 0;

        for (const { gauge, diameter, ampacity } of wires) {
          voltageDrop = maxCurrent * (2 * wireLength * ampacity);
          const wastePower = voltageDrop * maxCurrent;
          const wasteEnergy = wastePower / puffTime;
          const wireVolume = Math.PI * Math.pow(diameter / 2, 2) * wireLength;
          const wireMass = copperDensity * wireVolume;

          tempRise = wasteEnergy / (copperHeatCapacity * wireMass);

          if (voltageDrop < maxVoltageDrop && tempRise < maxTempRise) {
            wireGauge = gauge;
            break;
          }
        }

        if (!isNaN(wireGauge)) {
          setResults({
            wireGauge,
            voltageDrop,
            tempRise
          });
        }
      },
      [setResults]
    )
  });

  return (
    <Fragment>
      <Heading icon={faNetworkWired} title="Wiring Size Calculator" />
      <Row>
        <Col md={6} xs={12}>
          <Card>
            <h3>Inputs</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Wire Length</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.wireLength)}
                    min="0"
                    name="wireLength"
                    onChange={handleChange}
                    step="0.01"
                    type="number"
                    value={values.wireLength}
                  />
                  <InputGroup.Text>m</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.wireLength}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Max. Voltage Drop</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.maxVoltageDrop)}
                    min="0"
                    name="maxVoltageDrop"
                    onChange={handleChange}
                    step="0.01"
                    type="number"
                    value={values.maxVoltageDrop}
                  />
                  <InputGroup.Text>V</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.maxVoltageDrop}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Max. Temp Rise</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.maxTempRise)}
                    min="0"
                    name="maxTempRise"
                    onChange={handleChange}
                    step="0.01"
                    type="number"
                    value={values.maxTempRise}
                  />
                  <InputGroup.Text>&deg;C</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.maxTempRise}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Max. Current</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.maxCurrent)}
                    min="0"
                    name="maxCurrent"
                    onChange={handleChange}
                    step="0.01"
                    type="number"
                    value={values.maxCurrent}
                  />
                  <InputGroup.Text>A</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.maxCurrent}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Button className="mt-2" type="submit">
                  Calculate
                </Button>
              </Form.Group>
            </Form>
          </Card>
        </Col>
        <Col sm={6} xs={12}>
          {Boolean(results) && (
            <ResultsCard>
              <Alert variant="warning">
                <FontAwesomeIcon icon={faExclamationTriangle} /> Temperature and
                voltage drop estimates are <em>best-case assumptions</em>.
              </Alert>
              <p>
                You should use <strong>{results.wireGauge}</strong> AWG wire,
                which will cause a drop of{' '}
                <strong>{results.voltageDrop.toFixed(2)}</strong> volts and heat
                from <strong>{standardTemperature}</strong> &deg;C to roughly{' '}
                <strong>
                  {(standardTemperature + results.tempRise).toFixed(2)}
                </strong>{' '}
                &deg;C under a <strong>{values.maxCurrent}</strong> amp load for{' '}
                <strong>{puffTime}</strong> seconds.
              </p>
            </ResultsCard>
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
