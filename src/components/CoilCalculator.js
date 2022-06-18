import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { Fragment, useCallback, useState } from 'react';
import { Form, Card, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { materials } from 'utils';

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

const coilTypes = {
  SINGLE: 'Single',
  CLAPTON: 'Clapton'
};

export default function CoilCalculator() {
  const [coil, setCoil] = useState();
  const { isValidating, handleChange, handleSubmit, values } = useFormik({
    initialValues: {
      coilType: coilTypes.SINGLE,
      strands: 1,
      wraps: 5,
      coreWireGauge: 30,
      claptonWireGauge: 40,
      innerDiameter: 3,
      legLength: 5,
      material: 'ss316l'
    },
    validate: useCallback(({ strands, wraps }) => {
      const result = {};

      if (strands < 1) {
        result.strands = 'Strands cannot be less than one.';
      }

      if (wraps < 1) {
        result.wraps = 'Wraps cannot be less than one.';
      }

      return result;
    }, []),
    onSubmit: useCallback(
      ({
        coilType,
        strands,
        wraps,
        innerDiameter,
        legLength,
        coreWireGauge,
        claptonWireGauge,
        material
      }) => {
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
            crossSectionArea =
              Math.PI * Math.pow(coreDiameter / 2, 2) * strands;
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
    )
  });

  return (
    <Fragment>
      <Helmet title="Coil Calculator" />
      <h1>
        <FontAwesomeIcon icon="calculator" size="2x" /> Coil Calculator
      </h1>
      <Row>
        <Col sm={6} xs={12}>
          <Card body>
            <Card.Title>Inputs</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Coil Type</Form.Label>
                <Form.Select
                  name="coilType"
                  onChange={handleChange}
                  value={values.coilType}
                >
                  {Object.entries(coilTypes).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Material</Form.Label>
                <Form.Select
                  name="material"
                  onChaneg={handleChange}
                  value={values.material}
                >
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Parallel Strands</Form.Label>
                <Form.Control
                  name="strands"
                  onChange={handleChange}
                  type="number"
                  value={values.strands}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Wraps</Form.Label>
                <Form.Control
                  name="wraps"
                  onChange={handleChange}
                  type="number"
                  value={values.wraps}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Inner diameter</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="innerDiameter"
                    onChange={handleChange}
                    type="number"
                    value={values.innerDiameter}
                  />
                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Leg length</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="legLength"
                    onChange={handleChange}
                    type="number"
                    value={values.legLength}
                  />
                  <InputGroup.Text>mm</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Core wire gauge</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="coreWireGauge"
                    onChange={handleChange}
                    type="number"
                    value={values.coreWireGauge}
                  />
                  <InputGroup.Text>AWG</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {values.coilType === coilTypes.CLAPTON && (
                <Form.Group>
                  <Form.Label>Clapton wire gauge</Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="claptonWireGauge"
                      onChange={handleChange}
                      type="number"
                      value={values.claptonWireGauge}
                    />
                    <InputGroup.Text>AWG</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              )}
              <Form.Group>
                <Button className="mt-2" disabled={isValidating} type="submit">
                  Calculate
                </Button>
              </Form.Group>
            </Form>
          </Card>
        </Col>
        <Col sm={6} xs={12}>
          {coil && (
            <Card body>
              <Card.Title>Outputs</Card.Title>
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
