import useDarkMode from 'hooks/useDarkMode';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

export default function IngredientTable({ items }) {
  const { value: darkMode } = useDarkMode();

  if (!items) {
    return null;
  }

  return (
    <Table className={darkMode ? 'text-light' : 'text-dark'}>
      <thead>
        <tr>
          <th>Ingredient</th>
          <th className="text-end" style={{ width: '20%' }}>
            %
          </th>
          <th className="text-end" style={{ width: '20%' }}>
            mL
          </th>
          <th className="text-end" style={{ width: '20%' }}>
            g
          </th>
        </tr>
      </thead>
      <tbody>
        {items.length ? (
          items.map((result) => (
            <tr key={result.name}>
              <td>{result.name}</td>
              <td className="text-end">{result.pct.toFixed(2)}</td>
              <td className="text-end">{result.volume.toFixed(2)}</td>
              <td className="text-end">{result.mass.toFixed(2)}</td>
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
