import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useState } from 'react';
import {
  Alert,
  Form,
  Badge,
  InputGroup,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import {
  LineChart,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Text
} from 'recharts';
import * as Yup from 'yup';

import Card from 'components/Card';
import ResultsCard from 'components/ResultsCard';
import Heading from 'components/Heading';
import { faBomb } from '@fortawesome/free-solid-svg-icons';

const batteries = [
  {
    name: 'LG HG2',
    capacity: 3000,
    currentLimit: 20
  },
  {
    name: 'Molicel P26A',
    capacity: 2600,
    currentLimit: 35
  },
  {
    name: 'Molicel P28A',
    capacity: 2800,
    currentLimit: 35
  },
  {
    name: 'Molicel P42A',
    capacity: 4000,
    currentLimit: 30
  },
  {
    name: 'Sony VTC5',
    capacity: 2600,
    currentLimit: 20
  },
  {
    name: 'Sony VTC5A',
    capacity: 2500,
    currentLimit: 25
  },
  {
    name: 'Sony VTC5D',
    capacity: 2700,
    currentLimit: 25
  },
  {
    name: 'Sony VTC6',
    capacity: 3000,
    currentLimit: 15
  },
  {
    name: 'Samsung 20S',
    capacity: 2000,
    currentLimit: 30
  },
  {
    name: 'Samsung 25R',
    capacity: 2500,
    currentLimit: 20
  },
  {
    name: 'Samsung 30T',
    capacity: 3000,
    currentLimit: 35
  },
  {
    name: 'Samsung 30Q',
    capacity: 3000,
    currentLimit: 15
  },
  {
    name: 'Samsung 40T',
    capacity: 4000,
    currentLimit: 25
  }
];

const getVariant = (current, currentLimit, safetyMargin) => {
  const actualMargin = (currentLimit - current) / currentLimit;

  if (actualMargin > safetyMargin) {
    return 'success';
  } else if (actualMargin > 0) {
    return 'warning';
  } else {
    return 'danger';
  }
};

function ChartTooltip({ currentLimit, safetyMargin, payload }) {
  if (!payload?.length) {
    return null;
  }

  const [point] = payload;

  return (
    <Alert variant={getVariant(point.value, currentLimit, safetyMargin)}>
      Drawing {point.value.toFixed(2)} A @ {point.payload.resistance.toFixed(2)}{' '}
      &#8486;
    </Alert>
  );
}

ChartTooltip.propTypes = {
  currentLimit: PropTypes.number,
  safetyMargin: PropTypes.number,
  payload: PropTypes.array
};

function ChartLabel({ x, y, angle = 0, label }) {
  return (
    <Text dx={x} dy={y} transform={`rotate(${angle})`} x={0} y={0}>
      {label}
    </Text>
  );
}

ChartLabel.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  angle: PropTypes.number,
  label: PropTypes.string.isRequired
};

const FormSchema = Yup.object().shape({
  type: Yup.string().required(),
  efficiency: Yup.number().min(0).max(100),
  wattage: Yup.number().min(0),
  resistance: Yup.number().required().min(0),
  series: Yup.number().required().min(1),
  safetyMargin: Yup.number().required().min(0)
});

export default function ModCalculator() {
  const [chartData, setChartData] = useState(null);
  const [results, setResults] = useState(null);
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      type: 'mechanical',
      efficiency: 95,
      wattage: 0,
      resistance: 0.5,
      series: 1,
      battery: batteries[0].name,
      customCapacity: batteries[0].capacity,
      customCurrentLimit: batteries[0].currentLimit,
      safetyMargin: 50
    },
    validationSchema: FormSchema,
    onSubmit: useCallback(
      ({
        type,
        efficiency,
        wattage,
        resistance,
        series,
        battery: batteryName,
        customCapacity,
        customCurrentLimit,
        safetyMargin
      }) => {
        const voltage = series * 4.2;

        let current = voltage / resistance,
          power = 0;

        if (type === 'regulated') {
          power = wattage * (1 + (1 - efficiency / 100));
          current = power / voltage;
        } else {
          power = voltage * current;
        }

        const battery =
          batteryName === 'custom'
            ? { capacity: customCapacity, currentLimit: customCurrentLimit }
            : batteries.find((bat) => bat.name === batteryName);

        const runtime = (battery.capacity / 1000 / current) * 60;
        const maxPower = battery.currentLimit * voltage;
        const headroom = battery.currentLimit - current;
        const calculatedMargin = (headroom / battery.currentLimit) * 100;
        const marginLimit =
          battery.currentLimit - battery.currentLimit * (safetyMargin / 100);

        const dangerX = voltage / battery.currentLimit;
        const marginX = marginLimit > 0 ? voltage / marginLimit : 0;

        const range = [0.04, Math.max(1, marginX)];
        const data = [];

        for (let res = 0.04; res <= range[1]; res += 0.02) {
          const pointCurrent = voltage / res;

          data.push({
            resistance: res,
            current: pointCurrent
          });
        }

        setChartData({ points: data, marginX, dangerX, range });
        setResults([
          ['Voltage', `${voltage.toFixed(1)} V`],
          ['Current', `${current.toFixed(2)} A`],
          ['Runtime', `${Math.round(runtime)} min`],
          [
            'Power',
            <Badge
              bg={getVariant(current, battery.currentLimit, safetyMargin / 100)}
              key="power"
            >
              {power.toFixed(2)} / {maxPower.toFixed(2)} W
            </Badge>
          ],
          [
            'Headroom',
            <Badge bg={headroom > 0 ? 'success' : 'danger'} key="headroom">
              {headroom.toFixed(2)} A
            </Badge>
          ],
          ['Safety Margin', `${calculatedMargin.toFixed(2)} %`]
        ]);
      },
      [setResults, setChartData]
    )
  });

  return (
    <Fragment>
      <Heading icon={faBomb} title="Mod Calculator" />
      <Row>
        <Col sm={6} xs={12}>
          <Card>
            <h3>Inptus</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Mod Type</Form.Label>
                <Form.Select
                  name="type"
                  onChange={handleChange}
                  value={values.type}
                >
                  <option value="regulated">Regulated</option>
                  <option value="mechanical">Mechanical</option>
                </Form.Select>
              </Form.Group>
              {values.type === 'regulated' && (
                <Fragment>
                  <Form.Group>
                    <Form.Label>Regulator Efficiency</Form.Label>
                    <Form.Range
                      max="95"
                      min="75"
                      name="efficiency"
                      onChange={handleChange}
                      step="5"
                      value={values.efficiency}
                    />
                    <InputGroup>
                      <Form.Control disabled value={values.efficiency} />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Mod Wattage</Form.Label>
                    <InputGroup>
                      <Form.Control
                        max="2000"
                        min="5"
                        name="wattage"
                        onChange={handleChange}
                        step="0.1"
                        type="number"
                        value={values.wattage}
                      />
                      <InputGroup.Text>W</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Fragment>
              )}
              <Form.Group>
                <Form.Label>Coil Resistance (&#8486;)</Form.Label>
                <Form.Control
                  max="10"
                  min="0.01"
                  name="resistance"
                  onChange={handleChange}
                  step="0.01"
                  type="number"
                  value={values.resistance}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label># Cells in Series</Form.Label>
                <Form.Control
                  max="6"
                  min="1"
                  onChange={handleChange}
                  step="1"
                  type="number"
                  value={values.series}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Battery</Form.Label>
                <Form.Select
                  name="battery"
                  onChange={handleChange}
                  value={values.battery}
                >
                  {batteries.map((battery) => (
                    <option key={battery.name} value={battery.name}>
                      {battery.name} ({battery.capacity} mAh /{' '}
                      {battery.currentLimit} A)
                    </option>
                  ))}
                  <option value="custom">Custom...</option>
                </Form.Select>
              </Form.Group>
              {values.battery === 'custom' && (
                <Fragment>
                  <Form.Group>
                    <Form.Label>Custom Battery Capacity</Form.Label>
                    <InputGroup>
                      <Form.Control
                        max="50000"
                        min="0"
                        name="customCapacity"
                        onChange={handleChange}
                        step="50"
                        type="number"
                      />
                      <InputGroup.Text>mAh</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Custom Battery Current Limit</Form.Label>
                    <InputGroup>
                      <Form.Control
                        max="100"
                        min="0"
                        name="customCurrentLimit"
                        onChange={handleChange}
                        step="1"
                        type="number"
                      />
                      <InputGroup.Text>A</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Fragment>
              )}
              <Form.Group>
                <Form.Label>Safety Margin (%)</Form.Label>
                <Form.Control
                  max="100"
                  min="0"
                  name="safetyMargin"
                  onChange={handleChange}
                  step="1"
                  type="number"
                  value={values.safetyMargin}
                />
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
          {Boolean(results) && <ResultsCard results={results} />}
        </Col>
        <Col xs={12}>
          {Boolean(chartData) && (
            <Card className="my-4">
              <h3>Chart</h3>
              <ResponsiveContainer height={400} width="100%">
                <LineChart data={chartData.points} margin={{ bottom: 10 }}>
                  <CartesianGrid />
                  <XAxis
                    dataKey="resistance"
                    domain={chartData.range}
                    label={
                      <ChartLabel
                        angle={-90}
                        label="Current (Amp)"
                        x={-350}
                        y={30}
                      />
                    }
                    tickCount={40}
                    type="number"
                  />
                  <YAxis
                    label={
                      <ChartLabel label="Resistance (Ohm)" x={70} y={394} />
                    }
                    type="number"
                  />
                  <Tooltip
                    content={
                      <ChartTooltip
                        currentLimit={values.currentLimit}
                        safetyMargin={values.safetyMargin / 100}
                      />
                    }
                  />
                  <ReferenceLine stroke="#FF0303" x={chartData.dangerX} />
                  <ReferenceLine stroke="#FFBF00" x={chartData.marginX} />
                  <ReferenceLine stroke="#007BFF" x={values.resistance} />
                  <Line
                    dataKey="current"
                    dot={false}
                    stroke="#A12300"
                    strokeWidth={2}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
