import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faEdit,
  faTrash,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

import Card from 'components/Card';
import SplitSlider from 'components/SplitSlider';

export default function MixOptions({
  onSubmit,
  onChange,
  values,
  errors,
  presets,
  onPresetAdd,
  onPresetRemove,
  onPresetRename,
  onPresetSelect,
  onPresetUpdate,
  currentPreset
}) {
  return (
    <Form onSubmit={onSubmit}>
      <h4>Active Preset</h4>
      <InputGroup className="mb-2">
        <Form.Select defaultValue={currentPreset?.id} onChange={onPresetSelect}>
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </Form.Select>
        <Button
          onClick={onPresetAdd}
          title="Duplicate"
          type="button"
          variant="success"
        >
          <FontAwesomeIcon icon={faCopy} />
        </Button>
        <Button onClick={onPresetRename} title="Rename" type="button">
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button
          disabled={presets.length < 2}
          onClick={onPresetRemove}
          title="Remove"
          type="button"
          variant="danger"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </InputGroup>
      <h4>Options</h4>
      <Form.Group>
        <Form.Label>Use Nicotine</Form.Label>
        <Form.Check
          checked={values.useNic}
          name="useNic"
          onChange={onPresetUpdate}
        />
      </Form.Group>
      {values.useNic && (
        <Fragment>
          <h5>Nic Base</h5>
          <Form.Group>
            <Form.Label>Strength (mg/mL)</Form.Label>
            <Form.Control
              max="1000"
              min="0"
              name="nicBaseStrength"
              onChange={onPresetUpdate}
              step="0.1"
              type="number"
              value={values.nicBaseStrength}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>VG/PG Ratio</Form.Label>
            <SplitSlider
              initialValue={values.nicBaseVg}
              name="nicBaseVg"
              onChange={onPresetUpdate}
            />
          </Form.Group>
        </Fragment>
      )}
      <h4>Batch</h4>
      {values.useNic && (
        <Form.Group>
          <Form.Label>Nic Strength (mg/mL)</Form.Label>
          <Form.Control
            max="1000"
            min="0"
            name="nicBatchStrength"
            onChange={onChange}
            step="0.1"
            type="number"
            value={values.nicBatchStrength}
          />
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label>Max VG</Form.Label>
        <Form.Check
          checked={values.maxVg}
          name="maxVg"
          onChange={onPresetUpdate}
        />
      </Form.Group>
      {!values.maxVg && (
        <Form.Group>
          <Form.Label>VG/PG Ratio</Form.Label>
          <SplitSlider
            initialValue={values.batchVg}
            name="batchVg"
            onChange={onPresetUpdate}
          />
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label>Size (mL)</Form.Label>
        <Form.Control
          max="10000"
          min="1"
          name="batchMl"
          onChange={onPresetUpdate}
          step="1"
          type="number"
          value={values.batchMl}
        />
      </Form.Group>
      <Form.Group className="mt-2">
        {Boolean(errors.batchVg) && (
          <Card bg="warning" className="my-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {errors.batchVg}
          </Card>
        )}
      </Form.Group>
      <Form.Group className="d-flex justify-content-end">
        <Button type="submit" variant="primary">
          Calculate
        </Button>
      </Form.Group>
    </Form>
  );
}

MixOptions.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  currentPreset: PropTypes.object,
  presets: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPresetAdd: PropTypes.func.isRequired,
  onPresetRemove: PropTypes.func.isRequired,
  onPresetRename: PropTypes.func.isRequired,
  onPresetSelect: PropTypes.func.isRequired,
  onPresetUpdate: PropTypes.func.isRequired
};
