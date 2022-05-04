import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { Fragment, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';

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
    pgRatio: 100 - localStorage.getItem('vgRatio') || 20,
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
      <h1>
        <FontAwesomeIcon icon="clock" size="2x" /> Base Lifetime
      </h1>
      <Card className="my-4">
        <Card.Body>
          <Card.Title>
            <h2>Inputs</h2>
          </Card.Title>
          <Form>
            <Form.Group>
              <Form.Label htmlFor="consumedPerDay">
                mL Consumed Per Day
              </Form.Label>
              <Form.Control
                id="consumedPerDay"
                name="consumedPerDay"
                type="number"
                value={values.consumedPerDay}
                onChange={handleChange}
                error={touched.consumedPerDay && Boolean(errors.consumedPerDay)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="vgRatio">VG %</Form.Label>
              <Form.Control
                id="vgRatio"
                name="vgRatio"
                type="number"
                min={0}
                max={100}
                value={values.vgRatio}
                onChange={handleChange}
                error={touched.vgRatio && Boolean(errors.vgRatio)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="pgRatio">PG %</Form.Label>
              <Form.Control
                id="pgRatio"
                name="pgRatio"
                type="number"
                min={0}
                max={100}
                value={100 - values.vgRatio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="vgVolume">VG Volume (mL)</Form.Label>
              <Form.Control
                id="vgVolume"
                name="vgVolume"
                type="number"
                min={0}
                value={values.vgVolume}
                onChange={handleChange}
                error={touched.vgVolume && Boolean(errors.vgVolume)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="pgVolume">PG Volume (mL)</Form.Label>
              <Form.Control
                id="pgVolume"
                name="pgVolume"
                type="number"
                min={0}
                value={values.pgVolume}
                onChange={handleChange}
                error={touched.pgVolume && Boolean(errors.pgVolume)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      {!isNaN(vgDays) && !isNaN(pgDays) && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>
              <h2>Outputs</h2>
            </Card.Title>
            <h4>Your VG will last {Math.round(vgDays)} days.</h4>
            <h4>Your PG will last {Math.round(pgDays)} days.</h4>
          </Card.Body>
        </Card>
      )}
    </Fragment>
  );
}
