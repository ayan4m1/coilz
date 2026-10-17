import {
  faExclamationTriangle,
  faNetworkWired
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FormikErrors, useFormik } from 'formik';
import { useState, useCallback, useMemo, Fragment } from 'react';
import { Form, Row, Col, InputGroup, Alert, Button } from 'react-bootstrap';
import {
  LineChart,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

import Card from '../components/Card';
import ResultsCard from '../components/ResultsCard';
import Heading from '../components/Heading';
import { wires } from '../utils';
import type { Wire } from '../types';

const copperDensity = 8.96; // g/cm³
const copperHeatCapacity = 0.385; // J/g·K
const convectionCoefficient = 10; // W/m²·K, still air
const standardTemperature = 20;
const chartSamples = 100;
const chartColors = ['#FFBF00', '#A12300', '#007BFF'];

// Lumped thermal model per meter of conductor with convective loss to air.
// Diameter is in mm and ampacity holds resistance in Ω/m.
const getTempRise = (
  { diameter, ampacity }: Wire,
  current: number,
  time: number
) => {
  const power = Math.pow(current, 2) * ampacity;
  // 1 mm² × 1 m = 1 cm³, so this is grams per meter
  const mass = copperDensity * Math.PI * Math.pow(diameter / 2, 2);
  const heatCapacity = copperHeatCapacity * mass;
  const heatLoss = convectionCoefficient * Math.PI * diameter * 1e-3;
  const timeConstant = heatCapacity / heatLoss;

  return (power / heatLoss) * (1 - Math.exp(-time / timeConstant));
};

interface FormValues {
  wireLength: number;
  maxVoltageDrop: number;
  maxTempRise: number;
  maxCurrent: number;
  puffTime: number;
}

interface Results {
  wireIndex: number;
  voltageDrop: number;
  tempRise: number;
  maxCurrent: number;
  maxTempRise: number;
  puffTime: number;
}

export default function WiringCalculator() {
  const [results, setResults] = useState<Results | null>(null);
  const { errors, values, handleChange, handleSubmit } = useFormik<FormValues>({
    initialValues: {
      wireLength: 0.1,
      maxVoltageDrop: 0.25,
      maxTempRise: 50,
      maxCurrent: 30,
      puffTime: 3
    },
    validate: useCallback(
      ({
        wireLength,
        maxVoltageDrop,
        maxTempRise,
        maxCurrent,
        puffTime
      }: FormValues) => {
        const result: FormikErrors<FormValues> = {};

        if (puffTime <= 0) {
          result.puffTime = 'Puff time must be greater than zero.';
        }

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
      ({
        wireLength,
        maxVoltageDrop,
        maxTempRise,
        maxCurrent,
        puffTime
      }: FormValues) => {
        const wireIndex = wires.findIndex(
          (wire) =>
            maxCurrent * (2 * wireLength * wire.ampacity) < maxVoltageDrop &&
            getTempRise(wire, maxCurrent, puffTime) < maxTempRise
        );

        if (wireIndex === -1) {
          setResults(null);
          return;
        }

        const wire = wires[wireIndex];

        setResults({
          wireIndex,
          voltageDrop: maxCurrent * (2 * wireLength * wire.ampacity),
          tempRise: getTempRise(wire, maxCurrent, puffTime),
          maxCurrent,
          maxTempRise,
          puffTime
        });
      },
      [setResults]
    )
  });

  const chartWires = useMemo(
    () =>
      results
        ? wires.slice(Math.max(0, results.wireIndex - 1), results.wireIndex + 2)
        : [],
    [results]
  );

  const chartData = useMemo(() => {
    if (!results) {
      return [];
    }

    const maxTime = results.puffTime * 2;

    return Array.from({ length: chartSamples + 1 }, (_, i) => {
      const time = (maxTime * i) / chartSamples;
      const point: Record<string, number> = { time };

      for (const wire of chartWires) {
        point[`g${wire.gauge}`] =
          standardTemperature + getTempRise(wire, results.maxCurrent, time);
      }

      return point;
    });
  }, [results, chartWires]);

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
                <Form.Label>Pulse Duration</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.puffTime)}
                    min="0"
                    name="puffTime"
                    onChange={handleChange}
                    step="0.5"
                    type="number"
                    value={values.puffTime}
                  />
                  <InputGroup.Text>s</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.puffTime}
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
          {results && (
            <ResultsCard>
              <Alert variant="warning">
                <FontAwesomeIcon icon={faExclamationTriangle} /> Temperature and
                voltage drop estimates are <em>best-case assumptions</em>.
              </Alert>
              <p>
                You should use <strong>{wires[results.wireIndex].gauge}</strong>{' '}
                AWG wire, which will cause a drop of{' '}
                <strong>{results.voltageDrop.toFixed(2)}</strong> volts and heat
                from <strong>{standardTemperature}</strong> &deg;C to roughly{' '}
                <strong>
                  {(standardTemperature + results.tempRise).toFixed(2)}
                </strong>{' '}
                &deg;C under a <strong>{results.maxCurrent}</strong> amp load
                for <strong>{results.puffTime}</strong> seconds.
              </p>
            </ResultsCard>
          )}
        </Col>
        <Col xs={12}>
          {results && (
            <Card className="my-4">
              <h3>Temperature Over Time</h3>
              <ResponsiveContainer height={400} width="100%">
                <LineChart data={chartData} margin={{ bottom: 20, left: 10 }}>
                  <CartesianGrid />
                  <XAxis
                    dataKey="time"
                    domain={[0, results.puffTime * 2]}
                    label={{
                      value: 'Time (s)',
                      position: 'insideBottom',
                      offset: -10
                    }}
                    tickFormatter={(value: number) => value.toFixed(1)}
                    type="number"
                  />
                  <YAxis
                    label={{
                      value: 'Temperature (°C)',
                      angle: -90,
                      position: 'insideLeft'
                    }}
                    tickFormatter={(value: number) => value.toFixed(0)}
                    type="number"
                  />
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(2)} °C`}
                    labelFormatter={(label) => `${Number(label).toFixed(2)} s`}
                  />
                  <Legend position={'top'} />
                  <ReferenceLine
                    stroke="#FF0303"
                    strokeDasharray="4 4"
                    y={standardTemperature + results.maxTempRise}
                  />
                  <ReferenceLine
                    stroke="#007BFF"
                    strokeDasharray="4 4"
                    x={results.puffTime}
                  />
                  {chartWires.map((wire, i) => {
                    const selected = wire === wires[results.wireIndex];

                    return (
                      <Line
                        dataKey={`g${wire.gauge}`}
                        dot={false}
                        key={wire.gauge}
                        name={`${wire.gauge} AWG${selected ? ' (selected)' : ''}`}
                        stroke={chartColors[i % chartColors.length]}
                        strokeWidth={selected ? 3 : 1.5}
                        type="monotone"
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
