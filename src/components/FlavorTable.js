import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useRef, useCallback } from 'react';
import { uniqueId } from 'lodash-es';

import { Table, Form, Button } from 'react-bootstrap';

export default function FlavorTable({ flavors, onAddFlavor, onRemoveFlavor }) {
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
          id: uniqueId(),
          vendor,
          flavor,
          pct: pct / 1e2
        });
      }

      if (vendorRef?.current) {
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
      <Table striped>
        <thead>
          <tr>
            <th>Vendor</th>
            <th style={{ width: '50%' }}>Flavor</th>
            <th className="text-right">%</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Boolean(flavors.length) &&
            flavors.map((flavor) => (
              <tr key={flavor.id}>
                <td>{flavor.vendor}</td>
                <td>{flavor.flavor}</td>
                <td>{(flavor.pct * 1e2).toFixed(2)}</td>
                <td>
                  <Button
                    onClick={() => handleRemoveClick(flavor.id)}
                    type="button"
                    variant="danger"
                  >
                    <FontAwesomeIcon icon="trash" size="sm" />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Form.Control
                name="vendor"
                onChange={handleChange}
                ref={vendorRef}
                type="text"
                value={values.vendor}
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
                max="100"
                min="0"
                name="pct"
                onChange={handleChange}
                step="0.01"
                type="number"
                value={values.pct}
              />
            </td>
            <td>
              <Button type="submit" variant="success">
                <FontAwesomeIcon icon="plus" />
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