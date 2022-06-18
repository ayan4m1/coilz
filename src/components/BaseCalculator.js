import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { Card, Container, Form, Row, Col, InputGroup } from 'react-bootstrap';
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
    pgRatio: 100 - (localStorage.getItem('vgRatio') || 80),
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
    <Container fluid>
      <Helmet title="Base Lifetime Calculator" />
      <h1>
        <FontAwesomeIcon icon="clock" size="2x" /> Base Lifetime Calculator
      </h1>
      <Row>
        <Col sm={6} xs={12}>
          <Card body>
            <Card.Title>Inputs</Card.Title>
            <Form>
              <Form.Group>
                <Form.Label>Daily Consumption</Form.Label>
                <InputGroup>
                  <Form.Control
                    isInvalid={
                      touched.consumedPerDay && Boolean(errors.consumedPerDay)
                    }
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
                    isInvalid={touched.vgRatio && Boolean(errors.vgRatio)}
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
                    isInvalid={touched.pgRatio && Boolean(errors.pgRatio)}
                    max={100}
                    min={0}
                    name="pgRatio"
                    onChange={handleChange}
                    type="number"
                    value={100 - values.vgRatio}
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
                    isInvalid={touched.vgVolume && Boolean(errors.vgVolume)}
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
                    isInvalid={touched.pgVolume && Boolean(errors.pgVolume)}
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
            </Form>
          </Card>
        </Col>
        <Col sm={6} xs={12}>
          {!isNaN(vgDays) && !isNaN(pgDays) && (
            <ResultsCard>
              <p>
                Your VG will last <strong>{Math.round(vgDays)}</strong> days.
              </p>
              <p>
                Your PG will last <strong>{Math.round(pgDays)}</strong> days.
              </p>
            </ResultsCard>
          )}
        </Col>
      </Row>
    </Container>
  );
}
