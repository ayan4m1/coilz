import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import { useThemeContext } from 'hooks/useThemeContext';

export default function MixIngredients({ results }) {
  const { value: theme } = useThemeContext();

  if (!results) {
    return null;
  }

  return (
    <Table data-bs-theme={theme}>
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
        {results.length ? (
          results.map((result) => (
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

MixIngredients.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired
};
