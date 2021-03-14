import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import React, { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';

import { Form, Table, Tabs, Tab } from 'react-bootstrap';

const nicotineStrengths = [48, 72, 100, 250];

const FormSchema = Yup.object().shape({
  consumedPerDay: Yup.number(),
  consumedConcentration: Yup.number().max(1000),
  baseConcentration: Yup.number().max(1000),
  baseVolume: Yup.number(),
  desiredSupply: Yup.number()
});

export default function Nicotine() {
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
      <h1>
        <FontAwesomeIcon icon="exclamation-triangle" size="2x" /> Nicotine
      </h1>
      <Form>
        <Form.Row>
          <Form.Label for="consumedPerDay">mL Consumed Per Day</Form.Label>
          <Form.Control
            id="consumedPerDay"
            name="consumedPerDay"
            value={values.consumedPerDay}
            onChange={handleChange}
            error={touched.consumedPerDay && Boolean(errors.consumedPerDay)}
          />
        </Form.Row>
        <Form.Row>
          <Form.Label for="consumedConcentration">mg/mL Consumed</Form.Label>
          <Form.Control
            id="consumedConcentration"
            name="consumedConcentration"
            value={values.consumedConcentration}
            onChange={handleChange}
            error={
              touched.consumedConcentration &&
              Boolean(errors.consumedConcentration)
            }
          />
        </Form.Row>
        <h4>You consume {consumption} mg per day.</h4>
        <Tabs activeKey={mode} onSelect={(newMode) => setMode(newMode)}>
          <Tab eventKey="lifetime" title="Lifetime">
            <Form.Row>
              <Form.Label for="baseVolume">
                Nicotine Base Volume (mL)
              </Form.Label>
              <Form.Control
                id="baseVolume"
                name="baseVolume"
                value={values.baseVolume}
                onChange={handleChange}
                error={touched.baseVolume && Boolean(errors.baseVolume)}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label for="baseConcentration">
                Nicotine Base Concentration (mg/mL)
              </Form.Label>
              <Form.Control
                id="baseConcentration"
                name="baseConcentration"
                value={values.baseConcentration}
                onChange={handleChange}
                error={
                  touched.baseConcentration && Boolean(errors.baseConcentration)
                }
              />
            </Form.Row>
            <h4>You have {supply} mg of nicotine.</h4>
            <h4>You have {supplyDuration} days of nicotine.</h4>
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
            <Form.Row>
              <Form.Label for="desiredSupply">Desired Supply (Days)</Form.Label>
              <Form.Control
                name="desiredSupply"
                value={values.desiredSupply}
                onChange={handleChange}
                error={touched.desiredSupply && Boolean(errors.desiredSupply)}
              />
            </Form.Row>
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
          </Tab>
        </Tabs>
      </Form>
    </Fragment>
  );
}
