import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import { useEffect, useState, Fragment } from 'react';
import { Form, Table, Tabs, Tab, InputGroup, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';

import Card from 'components/Card';
import ResultsCard from 'components/ResultsCard';
import Heading from 'components/Heading';
import useDarkMode from 'hooks/useDarkMode';

const nicotineStrengths = [48, 72, 100, 250];

const FormSchema = Yup.object().shape({
  consumedPerDay: Yup.number(),
  consumedConcentration: Yup.number().max(1000),
  baseConcentration: Yup.number().max(1000),
  baseVolume: Yup.number(),
  desiredSupply: Yup.number()
});

export default function NicCalculator() {
  const { value: darkMode } = useDarkMode();

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
    <Fragment>
      <Heading icon={faExclamationTriangle} title="Nicotine Calculator" />
      <Row>
        <Col sm={6} xs={12}>
          <Card>
            <h3>Inputs</h3>
            <Form>
              <Form.Group>
                <Form.Label>Daily Consumption</Form.Label>
                <InputGroup>
                  <Form.Control
                    error={
                      touched.consumedPerDay && Boolean(errors.consumedPerDay)
                    }
                    name="consumedPerDay"
                    onChange={handleChange}
                    value={values.consumedPerDay}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Nicotine Concentration</Form.Label>
                <InputGroup>
                  <Form.Control
                    error={
                      touched.consumedConcentration &&
                      Boolean(errors.consumedConcentration)
                    }
                    name="consumedConcentration"
                    onChange={handleChange}
                    value={values.consumedConcentration}
                  />
                  <InputGroup.Text>mg/mL</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Tabs
                activeKey={mode}
                className="my-3"
                onSelect={(newMode) => setMode(newMode)}
              >
                <Tab eventKey="lifetime" title="Lifetime">
                  <Form.Group>
                    <Form.Label>Nicotine Base Volume</Form.Label>
                    <InputGroup>
                      <Form.Control
                        error={touched.baseVolume && Boolean(errors.baseVolume)}
                        name="baseVolume"
                        onChange={handleChange}
                        value={values.baseVolume}
                      />
                      <InputGroup.Text>mL</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Nicotine Base Concentration</Form.Label>
                    <InputGroup>
                      <Form.Control
                        error={
                          touched.baseConcentration &&
                          Boolean(errors.baseConcentration)
                        }
                        name="baseConcentration"
                        onChange={handleChange}
                        value={values.baseConcentration}
                      />
                      <InputGroup.Text>mg/mL</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Tab>
                <Tab eventKey="target" title="Target">
                  <Form.Check
                    checked={units === 'metric'}
                    label="Metric"
                    onChange={() => setUnits('metric')}
                    type="radio"
                  />
                  <Form.Check
                    checked={units === 'imperial'}
                    label="Imperial"
                    onChange={() => setUnits('imperial')}
                    type="radio"
                  />
                  <Form.Group>
                    <Form.Label>Desired Supply (Days)</Form.Label>
                    <Form.Control
                      error={
                        touched.desiredSupply && Boolean(errors.desiredSupply)
                      }
                      name="desiredSupply"
                      onChange={handleChange}
                      value={values.desiredSupply}
                    />
                  </Form.Group>
                </Tab>
              </Tabs>
            </Form>
          </Card>
        </Col>
        <Col sm={6} xs={12}>
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
              <Table className={darkMode ? 'text-light' : 'text-dark'}>
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
    </Fragment>
  );
}
