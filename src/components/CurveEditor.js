import PropTypes from 'prop-types';
import React from 'react';
import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function CurveEditor({ points }) {
  const chartWidth = 800;
  const chartHeight = 300;
  const chartXRange = [-40, 300];
  const chartYRange = [0.7, 1.4];

  return (
    <LineChart width={chartWidth} height={chartHeight} data={points}>
      <CartesianGrid />
      <XAxis dataKey="temp" type="number" domain={chartXRange} />
      <YAxis type="number" domain={chartYRange} />
      <Tooltip />
      <Legend />
      <Line type="linear" dataKey="tcr" />
    </LineChart>
  );
}

CurveEditor.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      temp: PropTypes.number,
      tfr: PropTypes.number
    })
  ).isRequired
};
