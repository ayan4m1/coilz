import { useFormik } from 'formik';
import { Fragment } from 'react';
import { Card, Form } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { wires } from 'utils';

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
    <Fragment>
      <Helmet title="Wiring Size Calculator" />
      <h1>Wiring Size Calculator</h1>
      <Form>
        <Form.Group>
          <Form.Label>Wire Length (m)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            name="wireLength"
            value={values.wireLength}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Max. Voltage Drop (V)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            name="maxVoltageDrop"
            value={values.maxVoltageDrop}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Max. Temp Rise (&deg;C)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            name="maxTempRise"
            value={values.maxTempRise}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Max. Current (A)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            name="maxCurrent"
            value={values.maxCurrent}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
      {!isNaN(wireGauge) && (
        <Card body className="my-4">
          <Card.Title>Results</Card.Title>
          <p>
            You should use {wireGauge} AWG wire, which will cause a drop of{' '}
            {voltageDrop.toFixed(2)} volts and heat to roughly{' '}
            {(standardTemperature + tempRise).toFixed(2)} &deg;C under a{' '}
            {values.maxCurrent} amp load.
          </p>
        </Card>
      )}
    </Fragment>
  );
}
