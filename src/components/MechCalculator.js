import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useState } from 'react';
import { Alert, Card, Form, Row, Col, Badge } from 'react-bootstrap';
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

function MechTooltip({ currentLimit, safetyMargin, payload }) {
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

MechTooltip.propTypes = {
  currentLimit: PropTypes.number,
  safetyMargin: PropTypes.number,
  payload: PropTypes.array
};

export default function MechCalculator() {
  const chartData = [];

  const [resistance, setResistance] = useState(0.5);
  const [series, setSeries] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [safetyMargin, setSafetyMargin] = useState(50);
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

      setCurrentLimit(parseFloat(value));
    },
    [setCurrentLimit]
  );
  const handleSafetyMarginChange = useCallback(
    (event) => {
      const { value } = event.target;

      setSafetyMargin(parseInt(value, 10));
    },
    [safetyMargin]
  );

  const voltage = series * 4.2;
  const current = voltage / resistance;
  const power = voltage * current;
  const headroom = currentLimit - current;
  const calculatedMargin = (headroom / currentLimit) * 100;
  const marginLimit = currentLimit - currentLimit * (safetyMargin / 100);

  const dangerX = voltage / currentLimit;
  const marginX = marginLimit > 0 ? voltage / marginLimit : 0;

  const chartXRange = [0, Math.max(1, marginX)];

  for (let res = 0.04; res <= chartXRange[1]; res += 0.02) {
    const pointCurrent = voltage / res;

    chartData.push({
      resistance: res,
      current: pointCurrent
    });
  }

  return (
    <Fragment>
      <h1>
        <FontAwesomeIcon icon="bomb" size="2x" /> Mech Calculator
      </h1>
      <Card className="my-4">
        <Card.Header>
          <Card.Title>
            <h2>Inputs</h2>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Form.Label>Resistance (&#8486;)</Form.Label>
              <Form.Control
                type="number"
                min="0.01"
                max="10"
                step="0.05"
                onChange={handleResistanceChange}
                value={resistance}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label># Cells in Series</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="6"
                step="1"
                onChange={handleSeriesChange}
                value={series}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label>Current Limit (Amps)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="1"
                onChange={handleCurrentLimitChange}
                value={currentLimit}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label>Safety Margin (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="1"
                onChange={handleSafetyMarginChange}
                value={safetyMargin}
              />
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Header>
          <Card.Title>
            <h2>Outputs</h2>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col xs={3}>Voltage</Col>
            <Col xs={9}>{voltage.toFixed(1)} V</Col>
          </Row>
          <Row>
            <Col xs={3}>Current</Col>
            <Col xs={9}>{current.toFixed(2)} A</Col>
          </Row>
          <Row>
            <Col xs={3}>Power</Col>
            <Col xs={9}>
              <Badge
                variant={getVariant(current, currentLimit, safetyMargin / 100)}
              >
                {power.toFixed(2)} W
              </Badge>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>Headroom</Col>
            <Col xs={9}>{headroom.toFixed(2)} A</Col>
          </Row>
          <Row>
            <Col xs={3}>Calculated Safety Margin</Col>
            <Col xs={9}>{calculatedMargin.toFixed(2)} %</Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Header>
          <Card.Title>
            <h2>Chart</h2>
          </Card.Title>
        </Card.Header>
        <Card.Body>
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
                  <MechTooltip
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
