import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useRef, useCallback } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { Typeahead, type TypeaheadRef } from 'react-bootstrap-typeahead';
import type { Option } from 'react-bootstrap-typeahead/types/types';
import { v4 } from 'uuid';

import { useThemeContext } from '../hooks/useThemeContext';
import type { Flavor } from '../types';
import { vendors } from '../utils';

interface VendorOption {
  id: string;
  label: string;
  value: string;
}

interface FlavorTableProps {
  flavors: Flavor[];
  onAddFlavor: (flavor: Flavor) => void;
  onRemoveFlavor: (id: string) => void;
}

const vendorArray: VendorOption[] = Object.entries(vendors).map(
  ([key, value]) => ({
    id: key,
    label: `${value} (${key})`,
    value: value
  })
);

export default function FlavorTable({
  flavors,
  onAddFlavor,
  onRemoveFlavor
}: FlavorTableProps) {
  const { value: theme } = useThemeContext();
  const vendorRef = useRef<TypeaheadRef>(null);
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

      if (vendorRef.current) {
        vendorRef.current.clear();
        vendorRef.current.focus();
      }

      setFieldValue('vendor', '');
      setFieldValue('flavor', '');
      setFieldValue('pct', 0);
    }
  });
  const handleRemoveClick = useCallback(
    (id: string) => {
      if (onRemoveFlavor) {
        onRemoveFlavor(id);
      }
    },
    [onRemoveFlavor]
  );

  if (!flavors) {
    return null;
  }

  const selectedVendor = vendorArray.find((vnd) => vnd.id === values.vendor);

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
                defaultInputValue={values.vendor}
                id="vendor"
                inputProps={{ name: 'vendor', type: 'text' }}
                onChange={(selected: Option[]) =>
                  setFieldValue(
                    'vendor',
                    (selected[0] as VendorOption | undefined)?.id ?? ''
                  )
                }
                onInputChange={(text) => setFieldValue('vendor', text)}
                options={vendorArray}
                ref={vendorRef}
                selected={selectedVendor ? [selectedVendor] : []}
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
