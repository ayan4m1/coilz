import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useState } from 'react';
import {
  Alert,
  Card,
  Form,
  Row,
  Col,
  Badge,
  InputGroup
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import {
  LineChart,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';

const batteries = [
  {
    name: 'Sony VTC6',
    capacity: 3000,
    currentLimit: 15
  },
  {
    name: 'Samsung 30Q',
    capacity: 3000,
    currentLimit: 15
  },
  {
    name: 'LG HG2',
    capacity: 3000,
    currentLimit: 20
  },
  {
    name: 'Molicel P26A',
    capacity: 2600,
    currentLimit: 25
  },
  {
    name: 'Murata VTC5D',
    capacity: 2700,
    currentLimit: 25
  },
  {
    name: 'Sony VTC5A',
    capacity: 2500,
    currentLimit: 25
  },
  {
    name: 'Samsung 25R',
    capacity: 2500,
    currentLimit: 20
  },
  {
    name: 'Samsung 20S',
    capacity: 2000,
    currentLimit: 30
  },
  {
    name: 'Samsung 30T',
    capacity: 3000,
    currentLimit: 35
  },
  {
    name: 'Molicel P42A',
    capacity: 4000,
    currentLimit: 30
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

export default function ModCalculator() {
  const [type, setType] = useState('mechanical');
  const [efficiency, setEfficiency] = useState(95);
  const [wattage, setWattage] = useState(0);
  const [resistance, setResistance] = useState(0.5);
  const [series, setSeries] = useState(1);
  const [batteryIndex, setBatteryIndex] = useState(0);
  const [capacity, setCapacity] = useState(batteries[0].capacity);
  const [currentLimit, setCurrentLimit] = useState(batteries[0].currentLimit);
  const [safetyMargin, setSafetyMargin] = useState(50);

  const handleTypeChange = useCallback(
    (event) => {
      const { value } = event.target;

      setType(value);
    },
    [setType]
  );
  const handleResistanceChange = useCallback(
    (event) => {
      const { value } = event.target;

      setResistance(parseFloat(value));
    },
    [setResistance]
  );
  const handleSeriesChange = useCallback(
    (event) => {
      const { value } = event.target;

      setSeries(parseInt(value, 10));
    },
    [setSeries]
  );
  const handleCurrentLimitChange = useCallback(
    (event) => {
      const { value } = event.target;

      if (value === 'CUSTOM') {
        return setBatteryIndex(-1);
      }

      const index = batteries.findIndex((batt) => batt.name === value);

      if (index === -1) {
        return;
      }

      setBatteryIndex(index);
      setCapacity(batteries[index].capacity);
      setCurrentLimit(batteries[index].currentLimit);
    },
    [setCurrentLimit]
  );
  const handleCustomCapacityChange = useCallback(
    (event) => {
      const { value } = event.target;

      setCapacity(parseInt(value, 10));
    },
    [setCapacity]
  );
  const handleCustomCurrentLimitChange = useCallback(
    (event) => {
      const { value } = event.target;

      setCurrentLimit(parseInt(value, 10));
    },
    [setCurrentLimit]
  );
  const handleSafetyMarginChange = useCallback(
    (event) => {
      const { value } = event.target;

      setSafetyMargin(parseInt(value, 10));
    },
    [setSafetyMargin]
  );
  const handleEfficiencyChange = useCallback((event) => {
    const { value } = event.target;

    setEfficiency(parseInt(value, 10));
  });
  const handleWattageChange = useCallback((event) => {
    const { value } = event.target;

    setWattage(parseInt(value, 10));
  });

  const voltage = series * 4.2;

  let current = voltage / resistance,
    power = 0;

  if (type === 'regulated') {
    power = wattage;
    current *= 1 + (1 - efficiency / 100);
  } else {
    power = voltage * current;
  }

  const runtime = (capacity / 1000 / current) * 60;
  const maxPower = currentLimit * voltage;
  const headroom = currentLimit - current;
  const calculatedMargin = (headroom / currentLimit) * 100;
  const marginLimit = currentLimit - currentLimit * (safetyMargin / 100);

  const dangerX = voltage / currentLimit;
  const marginX = marginLimit > 0 ? voltage / marginLimit : 0;

  const chartXRange = [0, Math.max(1, marginX)];
  const chartData = [];

  for (let res = 0.04; res <= chartXRange[1]; res += 0.02) {
    const pointCurrent = voltage / res;

    chartData.push({
      resistance: res,
      current: pointCurrent
    });
  }

  return (
    <Fragment>
      <Helmet title="Mod Calculator" />
      <h1>
        <FontAwesomeIcon icon="bomb" size="2x" /> Mod Calculator
      </h1>
      <Card className="my-4">
        <Card.Body>
          <Card.Title>
            <h2>Inputs</h2>
          </Card.Title>
          <Form>
            <Form.Group>
              <Form.Label>Mod Type</Form.Label>
              <Form.Control
                as="select"
                onChange={handleTypeChange}
                value={type}
              >
                <option value="regulated">Regulated</option>
                <option value="mechanical">Mechanical</option>
              </Form.Control>
            </Form.Group>
            {type === 'regulated' && (
              <Fragment>
                <Form.Group>
                  <Form.Label>Regulator Efficiency</Form.Label>
                  <Form.Range
                    min="75"
                    max="95"
                    step="5"
                    onChange={handleEfficiencyChange}
                    value={efficiency}
                  />
                  <InputGroup>
                    <Form.Control disabled value={efficiency} />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Mod Wattage</Form.Label>
                  <Form.Control
                    type="number"
                    min="5"
                    max="2000"
                    step="0.1"
                    onChange={handleWattageChange}
                    value={wattage}
                  />
                </Form.Group>
              </Fragment>
            )}
            <Form.Group>
              <Form.Label>Coil Resistance (&#8486;)</Form.Label>
              <Form.Control
                type="number"
                min="0.01"
                max="10"
                step="0.05"
                onChange={handleResistanceChange}
                value={resistance}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label># Cells in Series</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="6"
                step="1"
                onChange={handleSeriesChange}
                value={series}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Battery</Form.Label>
              <Form.Control
                as="select"
                onChange={handleCurrentLimitChange}
                value={
                  batteryIndex === -1 ? 'CUSTOM' : batteries[batteryIndex].name
                }
              >
                {batteries.map((battery) => (
                  <option key={battery.name} value={battery.name}>
                    {battery.name} ({battery.capacity} mAh /{' '}
                    {battery.currentLimit} A)
                  </option>
                ))}
                <option value="CUSTOM">Custom...</option>
              </Form.Control>
            </Form.Group>
            {batteryIndex === -1 && (
              <Fragment>
                <h3>Custom Battery</h3>
                <Form.Group>
                  <Form.Label>Capacity (mAh)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="50000"
                    step="50"
                    onChange={handleCustomCapacityChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Current Limit (A)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    onChange={handleCustomCurrentLimitChange}
                  />
                </Form.Group>
              </Fragment>
            )}
            <Form.Group>
              <Form.Label>Safety Margin (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="1"
                onChange={handleSafetyMarginChange}
                value={safetyMargin}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            <h2>Outputs</h2>
          </Card.Title>
          <Row>
            <Col xs={3}>Voltage</Col>
            <Col xs={9}>{voltage.toFixed(1)} V</Col>
          </Row>
          <Row>
            <Col xs={3}>Current</Col>
            <Col xs={9}>{current.toFixed(2)} A</Col>
          </Row>
          <Row>
            <Col xs={3}>Runtime</Col>
            <Col xs={9}>{Math.round(runtime)} min</Col>
          </Row>
          <Row>
            <Col xs={3}>Power</Col>
            <Col xs={9}>
              <Badge bg={getVariant(current, currentLimit, safetyMargin / 100)}>
                {power.toFixed(2)} / {maxPower.toFixed(2)} W
              </Badge>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>Headroom</Col>
            <Col xs={9}>
              <Badge bg={headroom > 0 ? 'success' : 'danger'}>
                {headroom.toFixed(2)} A
              </Badge>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>Calculated Safety Margin</Col>
            <Col xs={9}>{calculatedMargin.toFixed(2)} %</Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            <h2>Chart</h2>
          </Card.Title>
          <ResponsiveContainer height={400} width="100%">
            <LineChart data={chartData}>
              <CartesianGrid />
              <XAxis
                dataKey="resistance"
                type="number"
                tickCount={40}
                domain={chartXRange}
              />
              <YAxis type="number" />
              <Tooltip
                content={
                  <ChartTooltip
                    currentLimit={currentLimit}
                    safetyMargin={safetyMargin / 100}
                  />
                }
              />
              <ReferenceLine x={dangerX} stroke="#FF0303" />
              <ReferenceLine x={marginX} stroke="#FFBF00" />
              <ReferenceLine x={resistance} stroke="#007BFF" />
              <Line
                type="monotone"
                dataKey="current"
                dot={false}
                strokeWidth={2}
                stroke="#A12300"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Fragment>
  );
}
