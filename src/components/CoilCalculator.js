import { Formik, Form as FormikForm, Field } from 'formik';
import { Fragment, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Card, Button, Row, Col } from 'react-bootstrap';

const awg2mm = (n) => 0.127 * Math.pow(92, (36 - n) / 39);
// const crossSectionalArea = (d) => (Math.PI / 4) * Math.pow(d, 2);
const wrapSpacing = 0.05;
const calculateCoilLength = (
  outerDiameter,
  coreDiameter,
  strands,
  wraps,
  legLength
) => {
  const circumference = Math.PI * outerDiameter;
  const wrapWidth = coreDiameter * strands + wrapSpacing;
  const wrapLength = Math.sqrt(
    Math.pow(wrapWidth, 2) + Math.pow(circumference, 2)
  );
  const coilLength = wrapLength * wraps + legLength;

  return coilLength;
};

const materials = [
  {
    id: 'ka1',
    name: 'Kanthal A1',
    resistivity: 1.45,
    heatCapacity: 0.46,
    density: 7.1
  },
  {
    id: 'ss316l',
    name: 'SS 316L',
    resistivity: 0.75,
    heatCapacity: 0.5,
    density: 8
  },
  {
    id: 'n80',
    name: 'Nichrome N80 (A)',
    resistivity: 1.09,
    heatCapacity: 0.447,
    density: 8.31
  },
  {
    id: 'n90',
    name: 'Nichrome N90',
    resistivity: 0.75,
    heatCapacity: 0.44,
    density: 8.7
  },
  {
    id: 'ss430',
    name: 'SS 430',
    resistivity: 0.6,
    heatCapacity: 0.46,
    density: 7.74
  }
];

const coilTypes = {
  SINGLE: 'Single',
  CLAPTON: 'Clapton'
};

export default function CoilCalculator() {
  const initialValues = {
    coilType: coilTypes.SINGLE,
    strands: 1,
    wraps: 5,
    coreWireGauge: 30,
    claptonWireGauge: 40,
    innerDiameter: 3,
    legLength: 5,
    material: 'ss316l'
  };

  const [coil, setCoil] = useState();

  const handleSubmit = useCallback(
    (values) => {
      const {
        coilType,
        strands,
        wraps,
        innerDiameter,
        legLength,
        coreWireGauge,
        claptonWireGauge,
        material
      } = values;

      let coreDiameter = awg2mm(coreWireGauge);
      const claptonDiameter = awg2mm(claptonWireGauge);

      if (coilType === coilTypes.CLAPTON) {
        coreDiameter += 2 * claptonDiameter;
      }

      const outerDiameter = parseFloat(
        (innerDiameter + 2 * coreDiameter).toFixed(2)
      );
      const coilLength = calculateCoilLength(
        outerDiameter,
        coreDiameter,
        strands,
        wraps,
        legLength
      );

      let crossSectionArea;

      switch (coilType) {
        case coilTypes.SINGLE:
          crossSectionArea = Math.PI * Math.pow(coreDiameter / 2, 2) * strands;
          break;
        case coilTypes.CLAPTON:
          crossSectionArea =
            Math.PI * Math.pow(coreDiameter / 2, 2) * strands +
            Math.PI * Math.pow(claptonDiameter / 2, 2);
          break;
        default:
          crossSectionArea = 0;
          break;
      }

      let surfaceArea = Math.PI * coilLength * coreDiameter;

      if (coilType === coilTypes.CLAPTON) {
        const claptonWraps = coilLength / (1 / coreDiameter);

        surfaceArea +=
          Math.PI *
          calculateCoilLength(
            coreDiameter,
            claptonDiameter,
            1,
            claptonWraps,
            0
          ) *
          claptonDiameter;
      }

      const matchedMaterial = materials.find((mat) => material === mat.id);
      const resistivityPerUnitLength =
        matchedMaterial.resistivity / crossSectionArea;
      const resistance = (resistivityPerUnitLength * coilLength) / 1e3;

      // eslint-disable-next-line
      console.dir(coreDiameter);
      // eslint-disable-next-line
      console.dir(innerDiameter);
      // eslint-disable-next-line
      console.dir(outerDiameter);
      // eslint-disable-next-line
      console.dir(coilLength);

      setCoil({
        wireDiameter: coreDiameter,
        innerDiameter,
        outerDiameter,
        length: coilLength,
        crossSectionArea,
        surfaceArea,
        resistivityPerUnitLength,
        resistance
      });
    },
    [setCoil]
  );

  return (
    <Fragment>
      <h1>
        <FontAwesomeIcon icon="calculator" size="2x" /> Coil Calculator
      </h1>
      <h2>Input</h2>
      <Row>
        <Col md={6}>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isValidating, values }) => (
              <FormikForm>
                <Field name="coilType">
                  {({ field }) => (
                    <Form.Group>
                      <Form.Label>Coil Type</Form.Label>
                      <Form.Control as="select" {...field}>
                        {Object.entries(coilTypes).map(([key, value]) => (
                          <option key={key} value={value}>
                            {value}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  )}
                </Field>
                <Field name="material">
                  {({ field }) => (
                    <Form.Group>
                      <Form.Label>Material</Form.Label>
                      <Form.Control as="select" {...field}>
                        {materials.map((material) => (
                          <option key={material.id} value={material.id}>
                            {material.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  )}
                </Field>
                <Form.Group>
                  <Form.Label>Parallel Strands</Form.Label>
                  <Form.Control as={Field} type="number" name="strands" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Wraps</Form.Label>
                  <Form.Control as={Field} type="number" name="wraps" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Inner diameter</Form.Label>
                  <Form.Control as={Field} type="number" name="innerDiameter" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Leg length</Form.Label>
                  <Form.Control as={Field} type="number" name="legLength" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Core wire gauge (AWG)</Form.Label>
                  <Form.Control as={Field} type="number" name="coreWireGauge" />
                </Form.Group>
                {values.coilType === coilTypes.CLAPTON && (
                  <Form.Group>
                    <Form.Label>Clapton wire gauge (AWG)</Form.Label>
                    <Form.Control
                      as={Field}
                      type="number"
                      name="claptonWireGauge"
                    />
                  </Form.Group>
                )}
                <Form.Group className="my-3">
                  <Button type="submit" disabled={isValidating}>
                    Update
                  </Button>
                </Form.Group>
              </FormikForm>
            )}
          </Formik>
        </Col>
        <Col md={6}>
          <h2>Outputs</h2>
          {coil && (
            <Card body>
              <dl>
                <dt>Wire Diameter</dt>
                <dd>{coil.wireDiameter.toFixed(3)} mm</dd>
                <dt>Inner Diameter</dt>
                <dd>{coil.innerDiameter.toFixed(2)} mm</dd>
                <dt>Outer Diameter</dt>
                <dd>{coil.outerDiameter.toFixed(2)} mm</dd>
                <dt>Length</dt>
                <dd>{coil.length.toFixed(2)} mm</dd>
                <dt>Surface Area</dt>
                <dd>
                  {coil.surfaceArea.toFixed(2)} mm<sup>2</sup>
                </dd>
                <dt>Cross Section Area</dt>
                <dd>
                  {coil.crossSectionArea.toFixed(2)} mm<sup>2</sup>
                </dd>
                <dt>Ohms per meter</dt>
                <dd>
                  {coil.resistivityPerUnitLength.toFixed(2)} Ohms/m<sup></sup>
                </dd>
                <dt>Resistance</dt>
                <dd>
                  {coil.resistance.toFixed(3)} Ohms<sup></sup>
                </dd>
              </dl>
            </Card>
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
