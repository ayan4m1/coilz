import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

export default function IngredientTable({ items }) {
  if (!items) {
    return null;
  }

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Ingredient</th>
          <th className="text-right" style={{ width: '20%' }}>
            %
          </th>
          <th className="text-right" style={{ width: '20%' }}>
            mL
          </th>
          <th className="text-right" style={{ width: '20%' }}>
            g
          </th>
        </tr>
      </thead>
      <tbody>
        {items.length ? (
          items.map((result) => (
            <tr key={result.name}>
              <td>{result.name}</td>
              <td>{result.pct.toFixed(2)}</td>
              <td>{result.volume.toFixed(2)}</td>
              <td>{result.mass.toFixed(2)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4}>No ingredients.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

IngredientTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object)
};
