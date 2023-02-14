import {
  faCompress,
  faExclamationTriangle,
  faExpand,
  faMagicWandSparkles
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useCallback, useState, Fragment } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import useLocalStorageState from 'use-local-storage-state';

import Card from 'components/Card';
import Heading from 'components/Heading';
import FlavorTable from 'components/FlavorTable';
import IngredientTable from 'components/IngredientTable';
import SplitSlider from 'components/SplitSlider';

const densities = {
  vg: 1.26,
  pg: 1.04,
  vgNic: 1.235,
  pgNic: 1.035
};

export default function MixCalculator() {
  const [resultsCollapsed, setResultsCollapsed] = useState(false);
  const [settings, setSettings] = useLocalStorageState('mixSettings', {
    defaultValue: {
      useNic: false,
      nicBaseStrength: 100,
      nicBaseVg: 50,
      nicBatchStrength: 3,
      maxVg: false,
      batchVg: 50,
      batchMl: 30
    }
  });
  const [flavors, setFlavors] = useState([]);
  const [results, setResults] = useState(null);
  const { errors, values, handleSubmit, handleChange, setFieldError } =
    useFormik({
      initialValues: settings,
      onSubmit: ({
        useNic,
        nicBaseStrength,
        nicBaseVg,
        nicBatchStrength,
        maxVg,
        batchVg,
        batchMl
      }) => {
        setResults(null);
        setFlavors([]);

        const items = [];
        const flavorItems = [];

        let totalPgPct = 0,
          totalVgPct = 0,
          totalMass = 0;

        for (const flavor of flavors) {
          const flavorMl = flavor.pct * batchMl;
          const flavorGrams = flavorMl * densities.pg;

          totalPgPct += flavor.pct;
          totalMass += flavorGrams;

          flavorItems.push({
            name: `${flavor.vendor} ${flavor.flavor}`,
            pct: flavor.pct * 1e2,
            volume: flavorMl,
            mass: flavorGrams
          });
        }

        if (useNic) {
          const nicMg = nicBatchStrength * batchMl;
          const nicMl = nicMg / nicBaseStrength;
          const nicFactor = nicMl / batchMl;

          if (nicMl > batchMl) {
            return setFieldError(
              'batchVg',
              'The desired nicotine strength is too high.'
            );
          }

          const nicBaseVgPct = nicBaseVg / 1e2;
          const nicBasePgPct = 1 - nicBaseVgPct;
          const nicDensity =
            nicBaseVgPct * densities.vgNic + nicBasePgPct * densities.pgNic;
          const nicGrams = nicMl * nicDensity;

          totalVgPct += nicBaseVgPct * nicFactor;
          totalPgPct += nicBasePgPct * nicFactor;
          totalMass += nicGrams;

          items.push({
            name: `${nicBaseStrength}mg/mL Nicotine Base`,
            pct: (nicMl / batchMl) * 1e2,
            volume: nicMl,
            mass: nicGrams
          });
        }

        const batchVgPct = maxVg
          ? 1 - totalPgPct - totalVgPct
          : batchVg / 1e2 - totalVgPct;
        const batchPgPct = maxVg ? 0 : 1 - batchVg / 1e2 - totalPgPct;

        if (totalVgPct > batchVgPct) {
          return setFieldError(
            'batchVg',
            'The selected VG/PG ratio cannot be achieved for this mix.'
          );
        }

        if (batchVgPct > 0) {
          const vgMl = batchVgPct * batchMl;
          const vgGrams = vgMl * densities.vg;

          totalMass += vgGrams;

          items.push({
            name: 'VG',
            pct: batchVgPct * 1e2,
            volume: vgMl,
            mass: vgGrams
          });
        }
        if (batchPgPct > 0) {
          const pgMl = batchPgPct * batchMl;
          const pgGrams = pgMl * densities.pg;

          totalMass += pgGrams;

          items.push({
            name: 'PG',
            pct: batchPgPct * 1e2,
            volume: pgMl,
            mass: pgGrams
          });
        }

        setResults([
          ...items,
          ...flavorItems,
          {
            name: 'Total',
            pct: 100,
            volume: batchMl,
            mass: totalMass
          }
        ]);
        setSettings({
          useNic,
          nicBaseStrength,
          nicBaseVg,
          nicBatchStrength,
          maxVg,
          batchVg,
          batchMl
        });
      }
    });
  const handleFlavorAdd = useCallback(
    (flavor) => setFlavors((flvs) => [...flvs, flavor]),
    [setFlavors]
  );
  const handleFlavorRemove = useCallback(
    (id) => setFlavors((flvs) => flvs.filter((flv) => flv.id !== id)),
    [setFlavors]
  );
  const handleCollapseToggle = useCallback(
    () => setResultsCollapsed((collapsed) => !collapsed),
    [setResultsCollapsed]
  );

  return (
    <Fragment>
      <Heading icon={faMagicWandSparkles} title="Mix Calculator" />
      <Row className="mb-2">
        <Col>
          <Card className="mix-input-form">
            <Row>
              <Col sm={6} xs={12}>
                <Form onSubmit={handleSubmit}>
                  <h4>Options</h4>
                  <Form.Group>
                    <Form.Label>Use Nicotine</Form.Label>
                    <Form.Check
                      checked={values.useNic}
                      name="useNic"
                      onChange={handleChange}
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
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                        onChange={handleChange}
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
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {!values.maxVg && (
                    <Form.Group>
                      <Form.Label>VG/PG Ratio</Form.Label>
                      <SplitSlider
                        initialValue={values.batchVg}
                        name="batchVg"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  )}
                  <Form.Group>
                    <Form.Label>Size (mL)</Form.Label>
                    <Form.Control
                      max="10000"
                      min="1"
                      name="batchMl"
                      onChange={handleChange}
                      step="1"
                      type="number"
                      value={values.batchMl}
                    />
                  </Form.Group>
                  <Form.Group className="mt-2">
                    {Boolean(errors.batchVg) && (
                      <Card bg="warning" body className="my-2">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                        {errors.batchVg}
                      </Card>
                    )}
                    <Button type="submit" variant="primary">
                      Calculate
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
              <Col sm={6} xs={12}>
                <h4>Flavoring</h4>
                <FlavorTable
                  flavors={flavors}
                  onAddFlavor={handleFlavorAdd}
                  onRemoveFlavor={handleFlavorRemove}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {Boolean(results) && (
        <Row>
          <Col>
            <Card>
              <Row>
                <Col xs={9}>
                  <h3>Results</h3>
                </Col>
                <Col className="d-flex justify-content-end" xs={3}>
                  <Button
                    onClick={handleCollapseToggle}
                    type="button"
                    variant="primary"
                  >
                    <FontAwesomeIcon
                      icon={resultsCollapsed ? faExpand : faCompress}
                    />
                  </Button>
                </Col>
                <Col xs={resultsCollapsed ? 6 : 12}>
                  <IngredientTable items={results} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </Fragment>
  );
}
