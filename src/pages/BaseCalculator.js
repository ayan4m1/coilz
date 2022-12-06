import { faClock } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import { useEffect, useCallback, useState, Fragment } from 'react';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import * as Yup from 'yup';

import Card from 'components/Card';
import ResultsCard from 'components/ResultsCard';
import Heading from 'components/Heading';

const FormSchema = Yup.object().shape({
  consumedPerDay: Yup.number().min(
    0,
    'Daily consumption must be greater than zero.'
  ),
  vgRatio: Yup.number()
    .min(0, 'Percentage must be greater than zero.')
    .max(100, 'Percentage must be less than 100.'),
  vgVolume: Yup.number().positive('Volume must be greater than zero.'),
  pgVolume: Yup.number().positive('Volume must be greater than zero.')
});

export default function BaseCalculator() {
  const [results, setResults] = useState(null);
  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      consumedPerDay: localStorage.getItem('consumedPerDay') || 0,
      vgRatio: localStorage.getItem('vgRatio') || 80,
      pgRatio: 100 - (localStorage.getItem('vgRatio') || 80),
      vgVolume: 0,
      pgVolume: 0
    },
    validationSchema: FormSchema,
    onSubmit: useCallback(
      ({ consumedPerDay, vgRatio, vgVolume, pgVolume }) => {
        const vgDays = vgVolume / (consumedPerDay * (vgRatio / 100));
        const pgDays = pgVolume / (consumedPerDay * ((100 - vgRatio) / 100));

        setResults([
          ['VG', `${vgDays} days`],
          ['PG', `${pgDays} days`]
        ]);
      },
      [setResults]
    )
  });

  useEffect(() => {
    localStorage.setItem('consumedPerDay', values.consumedPerDay);
    localStorage.setItem('vgRatio', values.vgRatio);
  }, [values]);

  return (
    <Fragment>
      <Heading icon={faClock} title="Base Lifetime Calculator" />
      <Row>
        <Col sm={6} xs={12}>
          <Card>
            <h3>Inputs</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Daily Consumption</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.consumedPerDay)}
                    name="consumedPerDay"
                    onChange={handleChange}
                    type="number"
                    value={values.consumedPerDay}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.consumedPerDay}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>VG</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.vgRatio)}
                    max={100}
                    min={0}
                    name="vgRatio"
                    onChange={handleChange}
                    type="number"
                    value={values.vgRatio}
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.vgRatio}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>PG</Form.Label>
                <InputGroup>
                  <Form.Control
                    disabled
                    isInvalid={Boolean(errors.pgRatio)}
                    max={100}
                    min={0}
                    name="pgRatio"
                    onChange={handleChange}
                    type="number"
                    value={Math.min(100, Math.max(0, 100 - values.vgRatio))}
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.pgRatio}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>VG Volume</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.vgVolume)}
                    min={0}
                    name="vgVolume"
                    onChange={handleChange}
                    type="number"
                    value={values.vgVolume}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.vgVolume}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>PG Volume</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={Boolean(errors.pgVolume)}
                    min={0}
                    name="pgVolume"
                    onChange={handleChange}
                    type="number"
                    value={values.pgVolume}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.pgVolume}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Button className="my-2" type="submit">
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
