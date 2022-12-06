import { faRuler } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import { useCallback, useState, Fragment } from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import * as Yup from 'yup';

import Card from 'components/Card';
import Heading from 'components/Heading';
import ResultsCard from 'components/ResultsCard';
import { getMaterial, getWire, materials } from 'utils';

const FormSchema = Yup.object().shape({
  material: Yup.string().required('Material is required.').nullable(),
  gauge: Yup.number()
    .min(8, 'Gauge must be greater than 8.')
    .max(40, 'Gauge must be less than 40.'),
  emptyMass: Yup.number().min(0, 'Mass must be greater than zero.'),
  currentMass: Yup.number().min(0, 'Mass must be greater than zero.')
});

export default function SpoolCalculator() {
  const [results, setResults] = useState(null);
  const { errors, values, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      material: null,
      gauge: 28,
      emptyMass: 20,
      currentMass: 50
    },
    validationSchema: FormSchema,
    onSubmit: useCallback(
      ({ material: rawMaterial, gauge, emptyMass, currentMass }) => {
        const material = getMaterial(rawMaterial);
        const wire = getWire(gauge);

        if (material && wire) {
          const wireMass = currentMass - emptyMass;
          const wireVolume = wireMass / material.density;
          const wireLength =
            (wireVolume / (Math.PI * Math.pow(wire.diameter / 2, 2))) * 10;

          setResults([
            [
              'Wire Volume',
              <span key="volume">
                {wireVolume.toFixed(2)} cm<sup>3</sup>
              </span>
            ],
            ['Wire Length', `${wireLength.toFixed(2)} cm`]
          ]);
        }
      },
      [setResults]
    )
  });

  return (
    <Fragment>
      <Heading icon={faRuler} title="Remaining Spool Calculator" />
      <Row>
        <Col sm={6} xs={12}>
          <Card>
            <h3>Inputs</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Material</Form.Label>
                <Form.Select
                  isInvalid={Boolean(errors.material)}
                  name="material"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.material}
                >
                  <option>Select One</option>
                  {materials.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.material}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Wire Gauge</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.gauge)}
                    max="40"
                    min="8"
                    name="gauge"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    step="2"
                    type="number"
                    value={values.gauge}
                  />
                  <InputGroup.Text>AWG</InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.gauge}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Empty Spool Mass</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.emptyMass)}
                    name="emptyMass"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="number"
                    value={values.emptyMass}
                  />
                  <InputGroup.Text>g</InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.emptyMass}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Current Spool Mass</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.currentMass)}
                    name="currentMass"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="number"
                    value={values.currentMass}
                  />
                  <InputGroup.Text>g</InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.currentMass}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Button className="mt-2" type="submit">
                  Calculate
                </Button>
              </Form.Group>
            </Form>
          </Card>
        </Col>
        <Col sm={6} xs={12}>
          {results && <ResultsCard results={results} />}
        </Col>
      </Row>
    </Fragment>
  );
}
