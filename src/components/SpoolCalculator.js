import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button
} from 'react-bootstrap';
import Helmet from 'react-helmet';
import * as Yup from 'yup';

import ResultsCard from 'components/ResultsCard';
import { getMaterial, getWire, materials } from 'utils';

const FormSchema = Yup.object().shape({
  material: Yup.string().required(),
  gauge: Yup.number().min(8).max(40),
  emptyMass: Yup.number().min(0),
  currentMass: Yup.number().min(0)
});

export default function SpoolCalculator() {
  const [results, setResults] = useState(null);
  const { values, handleChange, handleBlur } = useFormik({
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
    <Container fluid>
      <Helmet title="Remaining Spool Calculator" />
      <h1>
        <FontAwesomeIcon icon="ruler" size="2x" /> Remaining Spool Calculator
      </h1>
      <Row>
        <Col sm={6} xs={12}>
          <Card body>
            <Card.Title>Inputs</Card.Title>
            <Form>
              <Form.Group>
                <Form.Label>Material</Form.Label>
                <Form.Select
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
              </Form.Group>
              <Form.Group>
                <Form.Label>Wire Gauge</Form.Label>
                <InputGroup>
                  <Form.Control
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
              </Form.Group>
              <Form.Group>
                <Form.Label>Empty Spool Mass</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="emptyMass"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="number"
                    value={values.emptyMass}
                  />
                  <InputGroup.Text>g</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Current Spool Mass</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="currentMass"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="number"
                    value={values.currentMass}
                  />
                  <InputGroup.Text>g</InputGroup.Text>
                </InputGroup>
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
    </Container>
  );
}
