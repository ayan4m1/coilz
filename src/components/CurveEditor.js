import PropTypes from 'prop-types';
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
    <LineChart data={points} height={chartHeight} width={chartWidth}>
      <CartesianGrid />
      <XAxis dataKey="temp" domain={chartXRange} type="number" />
      <YAxis domain={chartYRange} type="number" />
      <Tooltip />
      <Legend />
      <Line dataKey="tcr" type="linear" />
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
