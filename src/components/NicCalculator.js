import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Table,
  Tabs,
  Tab,
  InputGroup,
  Row,
  Col,
  Container
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';

import ResultsCard from 'components/ResultsCard';

const nicotineStrengths = [48, 72, 100, 250];

const FormSchema = Yup.object().shape({
  consumedPerDay: Yup.number(),
  consumedConcentration: Yup.number().max(1000),
  baseConcentration: Yup.number().max(1000),
  baseVolume: Yup.number(),
  desiredSupply: Yup.number()
});

export default function NicCalculator() {
  const [mode, setMode] = useState('lifetime');
  const [units, setUnits] = useState('metric');

  const { errors, touched, handleChange, values } = useFormik({
    initialValues: {
      consumedPerDay: localStorage.getItem('consumedPerDay') || 0,
      consumedConcentration: localStorage.getItem('consumedConcentration') || 0,
      baseConcentration: 0,
      baseVolume: 0,
      desiredSupply: 0
    },
    validationSchema: FormSchema
  });

  const consumption = values.consumedPerDay * values.consumedConcentration;
  const supply = values.baseVolume * values.baseConcentration;

  let targetVolumes = [],
    supplyDuration = 0;

  if (mode === 'target' && !isNaN(values.desiredSupply)) {
    targetVolumes = nicotineStrengths.map((strength) => {
      const volume = (consumption * values.desiredSupply) / strength;

      return {
        strength,
        volume: units === 'metric' ? volume : volume * 0.033814
      };
    });
  }

  if (
    mode === 'lifetime' &&
    consumption !== null &&
    consumption !== 0 &&
    supply !== null
  ) {
    supplyDuration = Math.floor(supply / consumption);
  }

  useEffect(() => {
    localStorage.setItem('consumedPerDay', values.consumedPerDay);
    localStorage.setItem('consumedConcentration', values.consumedConcentration);
  }, [values]);

  return (
    <Container fluid>
      <Helmet title="Nicotine Calculator" />
      <h1>
        <FontAwesomeIcon icon="exclamation-triangle" size="2x" /> Nicotine
        Calculator
      </h1>
      <Row>
        <Col xs={12} sm={6}>
          <Card body>
            <Card.Title>Inputs</Card.Title>
            <Form>
              <Form.Group>
                <Form.Label>Daily Consumption</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="consumedPerDay"
                    value={values.consumedPerDay}
                    onChange={handleChange}
                    error={
                      touched.consumedPerDay && Boolean(errors.consumedPerDay)
                    }
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Nicotine Concentration</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="consumedConcentration"
                    value={values.consumedConcentration}
                    onChange={handleChange}
                    error={
                      touched.consumedConcentration &&
                      Boolean(errors.consumedConcentration)
                    }
                  />
                  <InputGroup.Text>mg/mL</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Tabs
                className="my-3"
                activeKey={mode}
                onSelect={(newMode) => setMode(newMode)}
              >
                <Tab eventKey="lifetime" title="Lifetime">
                  <Form.Group>
                    <Form.Label>Nicotine Base Volume</Form.Label>
                    <InputGroup>
                      <Form.Control
                        name="baseVolume"
                        value={values.baseVolume}
                        onChange={handleChange}
                        error={touched.baseVolume && Boolean(errors.baseVolume)}
                      />
                      <InputGroup.Text>mL</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Nicotine Base Concentration</Form.Label>
                    <InputGroup>
                      <Form.Control
                        name="baseConcentration"
                        value={values.baseConcentration}
                        onChange={handleChange}
                        error={
                          touched.baseConcentration &&
                          Boolean(errors.baseConcentration)
                        }
                      />
                      <InputGroup.Text>mg/mL</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Tab>
                <Tab eventKey="target" title="Target">
                  <Form.Check
                    type="radio"
                    label="Metric"
                    checked={units === 'metric'}
                    onChange={() => setUnits('metric')}
                  />
                  <Form.Check
                    type="radio"
                    label="Imperial"
                    checked={units === 'imperial'}
                    onChange={() => setUnits('imperial')}
                  />
                  <Form.Group>
                    <Form.Label>Desired Supply (Days)</Form.Label>
                    <Form.Control
                      name="desiredSupply"
                      value={values.desiredSupply}
                      onChange={handleChange}
                      error={
                        touched.desiredSupply && Boolean(errors.desiredSupply)
                      }
                    />
                  </Form.Group>
                </Tab>
              </Tabs>
            </Form>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <ResultsCard>
            <p>
              You consume <strong>{consumption.toLocaleString()}</strong> mg of
              nicotine per day (
              <strong>
                {((consumption * 365.25) / 1000).toLocaleString()}
              </strong>{' '}
              g per year).
            </p>
            {mode === 'lifetime' && (
              <p>
                You have <strong>{supplyDuration.toLocaleString()}</strong> days
                (<strong>{(supplyDuration / 365.25).toFixed(1)}</strong> years)
                of nicotine.
              </p>
            )}
            {mode === 'target' && (
              <Table>
                <thead>
                  <tr>
                    <th>Strength (mg/mL)</th>
                    <th>Volume ({units === 'metric' ? 'mL' : 'oz'})</th>
                  </tr>
                </thead>
                <tbody>
                  {targetVolumes.map(({ strength, volume }) => (
                    <tr key={strength}>
                      <td>{strength}</td>
                      <td>{volume.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </ResultsCard>
        </Col>
      </Row>
    </Container>
  );
}
