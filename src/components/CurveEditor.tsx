import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export interface CurvePoint {
  temp: number;
  tcr: number;
}

interface CurveEditorProps {
  points: CurvePoint[];
}

export default function CurveEditor({ points }: CurveEditorProps) {
  const chartWidth = 800;
  const chartHeight = 300;
  const chartXRange: [number, number] = [-40, 300];
  const chartYRange: [number, number] = [0.7, 1.4];

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
