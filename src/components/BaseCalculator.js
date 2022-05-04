import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { Fragment, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';

import ResultsCard from 'components/ResultsCard';

const FormSchema = Yup.object().shape({
  consumedPerDay: Yup.number(),
  vgRatio: Yup.number().min(0).max(100),
  vgVolume: Yup.number().min(0),
  pgVolume: Yup.number().min(0)
});

export default function BaseCalculator() {
  const initialValues = {
    consumedPerDay: localStorage.getItem('consumedPerDay') || 0,
    vgRatio: localStorage.getItem('vgRatio') || 80,
    pgRatio: 100 - (localStorage.getItem('vgRatio') || 20),
    vgVolume: 0,
    pgVolume: 0
  };
  const { handleChange, values, touched, errors } = useFormik({
    initialValues,
    validationSchema: FormSchema
  });

  useEffect(() => {
    localStorage.setItem('consumedPerDay', values.consumedPerDay);
    localStorage.setItem('vgRatio', values.vgRatio);
  }, [values]);

  const vgDays =
    values.vgVolume / (values.consumedPerDay * (values.vgRatio / 100));
  const pgDays =
    values.pgVolume / (values.consumedPerDay * ((100 - values.vgRatio) / 100));

  return (
    <Fragment>
      <Helmet title="Base Calculator" />
      <h1 className="my-4">
        <FontAwesomeIcon icon="clock" size="2x" /> Base Lifetime
      </h1>
      <Card body>
        <Card.Title>
          <h2>Inputs</h2>
        </Card.Title>
        <Form>
          <Form.Group>
            <Form.Label htmlFor="consumedPerDay">
              mL Consumed Per Day
            </Form.Label>
            <Form.Control
              name="consumedPerDay"
              type="number"
              value={values.consumedPerDay}
              onChange={handleChange}
              isInvalid={
                touched.consumedPerDay && Boolean(errors.consumedPerDay)
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.consumedPerDay}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="vgRatio">VG %</Form.Label>
            <Form.Control
              name="vgRatio"
              type="number"
              min={0}
              max={100}
              value={values.vgRatio}
              onChange={handleChange}
              isInvalid={touched.vgRatio && Boolean(errors.vgRatio)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.vgRatio}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="pgRatio">PG %</Form.Label>
            <Form.Control
              name="pgRatio"
              type="number"
              min={0}
              max={100}
              value={100 - values.vgRatio}
              onChange={handleChange}
              isInvalid={touched.pgRatio && Boolean(errors.pgRatio)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.pgRatio}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="vgVolume">VG Volume (mL)</Form.Label>
            <Form.Control
              name="vgVolume"
              type="number"
              min={0}
              value={values.vgVolume}
              onChange={handleChange}
              isInvalid={touched.vgVolume && Boolean(errors.vgVolume)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.vgVolume}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="pgVolume">PG Volume (mL)</Form.Label>
            <Form.Control
              name="pgVolume"
              type="number"
              min={0}
              value={values.pgVolume}
              onChange={handleChange}
              isInvalid={touched.pgVolume && Boolean(errors.pgVolume)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.pgVolume}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Card>
      {!isNaN(vgDays) && !isNaN(pgDays) && (
        <ResultsCard>
          <h4>Your VG will last {Math.round(vgDays)} days.</h4>
          <h4>Your PG will last {Math.round(pgDays)} days.</h4>
        </ResultsCard>
      )}
    </Fragment>
  );
}
