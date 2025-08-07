import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useRef, useCallback } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { v4 } from 'uuid';

import { useThemeContext } from 'hooks/useThemeContext.js';
import { vendors } from 'utils';

const vendorArray = Object.entries(vendors).map(([key, value]) => ({
  id: key,
  label: `${value} (${key})`,
  value: value
}));

export default function FlavorTable({ flavors, onAddFlavor, onRemoveFlavor }) {
  const { value: theme } = useThemeContext();
  const vendorRef = useRef();
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      vendor: '',
      flavor: '',
      pct: 0
    },
    onSubmit: ({ vendor, flavor, pct }) => {
      if (onAddFlavor) {
        onAddFlavor({
          id: v4(),
          vendor,
          flavor,
          pct: pct / 1e2
        });
      }

      if (vendorRef?.current) {
        vendorRef.current.value = '';
        vendorRef.current.focus();
      }

      setFieldValue('vendor', '');
      setFieldValue('flavor', '');
      setFieldValue('pct', 0);
    }
  });
  const handleRemoveClick = useCallback(
    (id) => {
      if (onRemoveFlavor) {
        onRemoveFlavor(id);
      }
    },
    [onRemoveFlavor]
  );

  if (!flavors) {
    return null;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h4>Flavoring</h4>
      <Table data-bs-theme={theme}>
        <thead>
          <tr>
            <th>Vendor</th>
            <th style={{ width: '40%' }}>Flavor</th>
            <th className="text-end">%</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Boolean(flavors.length) &&
            flavors.map((flavor) => (
              <tr key={flavor.id}>
                <td className="align-middle">{flavor.vendor}</td>
                <td className="align-middle">{flavor.flavor}</td>
                <td className="align-middle text-end">
                  {(flavor.pct * 1e2).toFixed(2)}
                </td>
                <td className="text-center">
                  <Button
                    onClick={() => handleRemoveClick(flavor.id)}
                    title="Remove Flavor"
                    type="button"
                    variant="danger"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Typeahead
                defaultInputValue={values.customVendor}
                id="vendor"
                name="vendor"
                onChange={(selected) =>
                  setFieldValue('vendor', selected[0]?.id)
                }
                onInputChange={(text) => setFieldValue('vendor', text)}
                options={vendorArray}
                ref={vendorRef}
                selected={
                  vendorArray.find((vnd) => vnd.id === values.vendor)
                    ? [vendorArray.find((vnd) => vnd.id === values.vendor)]
                    : []
                }
                type="text"
              />
            </td>
            <td>
              <Form.Control
                name="flavor"
                onChange={handleChange}
                type="text"
                value={values.flavor}
              />
            </td>
            <td>
              <Form.Control
                className="text-end"
                max="100"
                min="0"
                name="pct"
                onChange={handleChange}
                step="0.01"
                type="number"
                value={values.pct}
              />
            </td>
            <td className="text-center">
              <Button title="Add Flavor" type="submit" variant="success">
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Form>
  );
}

FlavorTable.propTypes = {
  flavors: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddFlavor: PropTypes.func.isRequired,
  onRemoveFlavor: PropTypes.func.isRequired
};
