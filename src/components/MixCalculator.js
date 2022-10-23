import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useCallback, useState, Fragment } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import useLocalStorageState from 'use-local-storage-state';

import FlavorTable from './FlavorTable';
import IngredientTable from './IngredientTable';
import SplitSlider from './SplitSlider';

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
        batchVg,
        batchMl
      }) => {
        setResults(null);
        setFlavors([]);

        const items = [];
        const flavorItems = [];

        let batchVgPct = batchVg / 1e2;

        let batchPgPct = 1 - batchVgPct;

        let batchVgMlNeeded = batchVgPct * batchMl;

        let batchPgMlNeeded = batchPgPct * batchMl;

        if (useNic) {
          const nicMg = nicBatchStrength * batchMl;
          const nicMl = nicMg / nicBaseStrength;

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

          batchVgPct -= nicBaseVgPct * (nicMl / batchMl);
          batchPgPct -= nicBasePgPct * (nicMl / batchMl);
          batchVgMlNeeded -= nicBaseVgPct * nicMl;
          batchPgMlNeeded -= nicBasePgPct * nicMl;

          if (batchVgPct < 0 || batchPgPct < 0) {
            return setFieldError(
              'batchVg',
              'The selected VG/PG ratio cannot be achieved for this mix.'
            );
          }

          items.push({
            name: `${nicBaseStrength}mg/mL Nicotine Base`,
            pct: (nicMl / batchMl) * 1e2,
            volume: nicMl,
            mass: nicGrams
          });
        }

        if (batchVgMlNeeded < 0 || batchPgMlNeeded < 0) {
          return setFieldError(
            'batchVg',
            'The selected VG/PG ratio cannot be achieved for this mix.'
          );
        }

        for (const flavor of flavors) {
          batchPgPct -= flavor.pct;
          batchPgMlNeeded -= flavor.pct * batchMl;

          if (batchPgPct < 0) {
            return setFieldError(
              'batchVg',
              'The selected VG/PG ratio cannot be achieved for this mix.'
            );
          }

          flavorItems.push({
            name: `${flavor.vendor} ${flavor.flavor}`,
            pct: flavor.pct * 1e2,
            volume: 0,
            mass: 0
          });
        }

        items.push({
          name: 'VG',
          pct: batchVgPct * 1e2,
          volume: batchVgMlNeeded,
          mass: batchVgMlNeeded * densities.vg
        });
        items.push({
          name: 'PG',
          pct: batchPgPct * 1e2,
          volume: batchPgMlNeeded,
          mass: batchPgMlNeeded * densities.pg
        });

        setResults([...items, ...flavorItems]);
        setSettings({
          useNic,
          nicBaseStrength,
          nicBaseVg,
          nicBatchStrength,
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
    <Container fluid>
      <Helmet title="Mix Calculator" />
      <h1>
        <FontAwesomeIcon icon="magic-wand-sparkles" /> Mix Calculator
      </h1>
      <Row className="mb-2">
        <Col>
          <Card body>
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
                    <Form.Label>VG/PG Ratio</Form.Label>
                    <SplitSlider
                      initialValue={values.batchVg}
                      name="batchVg"
                      onChange={handleChange}
                    />
                  </Form.Group>
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
                        <FontAwesomeIcon icon="exclamation-triangle" />
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
      <Row>
        <Col>
          <Card body>
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
                    icon={resultsCollapsed ? 'expand' : 'compress'}
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
    </Container>
  );
}
