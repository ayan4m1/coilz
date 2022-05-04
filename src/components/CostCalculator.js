import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { Fragment } from 'react';
import { Card, Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

export default function CostCalculator() {
  const [costs, setCosts] = useState(null);
  const initialValues = {
    totalVolume: 1000,
    nicotineStrengthDesired: 6,
    nicotineStrengthBase: 250,
    nicotinePrice: 80,
    nicotineVolume: 125,
    vgPrice: 25,
    vgVolume: 3785,
    pgPrice: 35,
    pgVolume: 3785,
    flavorPrice: 5,
    flavorVolume: 15,
    flavorPercent: 10,
    vgRatio: 50
  };
  const onSubmit = useCallback(
    (values) => {
      const {
        totalVolume,
        nicotineStrengthBase,
        nicotineStrengthDesired,
        nicotinePrice,
        nicotineVolume,
        vgPrice,
        vgVolume,
        pgPrice,
        pgVolume,
        flavorPrice,
        flavorVolume,
        flavorPercent,
        vgRatio
      } = values;

      const nicotinePct = nicotineStrengthDesired / nicotineStrengthBase;
      const nicotineCost =
        nicotinePct * totalVolume * (nicotinePrice / nicotineVolume);
      const vgPct = vgRatio / 1e2;
      const vgCost = vgPct * totalVolume * (vgPrice / vgVolume);
      const pgPct = 1 - vgPct;
      const pgCost = pgPct * totalVolume * (pgPrice / pgVolume);
      const flavorPct = flavorPercent / 1e2;
      const flavorCost = flavorPct * totalVolume * (flavorPrice / flavorVolume);
      const cost = nicotineCost + vgCost + pgCost + flavorCost;

      setCosts({
        nicotine: nicotineCost,
        vg: vgCost,
        pg: pgCost,
        flavor: flavorCost,
        total: cost
      });
    },
    [setCosts]
  );
  const { handleChange, handleSubmit, values } = useFormik({
    initialValues,
    onSubmit
  });

  return (
    <Fragment>
      <Helmet title="Cost Calculator" />
      <Card body>
        <Card.Title>Inputs</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Desired Volume</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="totalVolume"
                onChange={handleChange}
                value={values.totalVolume}
              />
              <InputGroup.Text>mL</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Desired VG</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="vgRatio"
                onChange={handleChange}
                value={values.vgRatio}
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Flavor</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="flavorPercent"
                onChange={handleChange}
                value={values.flavorPercent}
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Base Nicotine Strength</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="nicotineStrengthBase"
                onChange={handleChange}
                value={values.nicotineStrengthBase}
              />
              <InputGroup.Text>mg/mL</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Desired Nicotine Strength</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                name="nicotineStrengthDesired"
                onChange={handleChange}
                value={values.nicotineStrengthDesired}
              />
              <InputGroup.Text>mg/mL</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Price of Nicotine</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="text"
                name="nicotinePrice"
                onChange={handleChange}
                value={values.nicotinePrice}
              />
            </InputGroup>
            <InputGroup>
              <Form.Control
                type="text"
                name="nicotineVolume"
                onChange={handleChange}
                value={values.nicotineVolume}
              />
              <InputGroup.Text>mL</InputGroup.Text>
            </InputGroup>
            <InputGroup>
              <Form.Control
                type="number"
                readOnly
                value={
                  values.nicotineVolume > 0
                    ? values.nicotinePrice / values.nicotineVolume
                    : 0
                }
              />
              <InputGroup.Text>$/mL</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Price of PG</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="text"
                name="pgPrice"
                onChange={handleChange}
                value={values.pgPrice}
              />
            </InputGroup>
            <InputGroup>
              <Form.Control
                type="text"
                name="pgVolume"
                onChange={handleChange}
                value={values.pgVolume}
              />
              <InputGroup.Text>mL</InputGroup.Text>
            </InputGroup>
            <InputGroup>
              <Form.Control
                type="number"
                readOnly
                value={
                  values.pgVolume > 0 ? values.pgPrice / values.pgVolume : 0
                }
              />
              <InputGroup.Text>$/mL</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Price of VG</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="text"
                name="vgPrice"
                onChange={handleChange}
                value={values.vgPrice}
              />
            </InputGroup>
            <InputGroup>
              <Form.Control
                type="text"
                name="vgVolume"
                onChange={handleChange}
                value={values.vgVolume}
              />
              <InputGroup.Text>mL</InputGroup.Text>
            </InputGroup>
            <InputGroup>
              <Form.Control
                type="number"
                readOnly
                value={
                  values.vgVolume > 0 ? values.vgPrice / values.vgVolume : 0
                }
              />
              <InputGroup.Text>$/mL</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Price of Flavoring</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="text"
                name="flavorPrice"
                onChange={handleChange}
                value={values.flavorPrice}
              />
            </InputGroup>
            <InputGroup>
              <Form.Control
                type="text"
                name="flavorVolume"
                onChange={handleChange}
                value={values.flavorVolume}
              />
              <InputGroup.Text>mL</InputGroup.Text>
            </InputGroup>
            <InputGroup>
              <Form.Control
                type="number"
                readOnly
                value={
                  values.flavorVolume > 0
                    ? values.flavorPrice / values.flavorVolume
                    : 0
                }
              />
              <InputGroup.Text>$/mL</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Calculate
            </Button>
          </Form.Group>
        </Form>
      </Card>
      {Boolean(costs) && (
        <Card body className="my-4">
          <Card.Title>Outputs</Card.Title>
          <Row>
            <Col xs={3}>Nic Cost</Col>
            <Col xs={9}>${costs.nicotine.toFixed(2)}</Col>
          </Row>
          <Row>
            <Col xs={3}>VG Cost</Col>
            <Col xs={9}>${costs.vg.toFixed(2)}</Col>
          </Row>
          <Row>
            <Col xs={3}>PG Cost</Col>
            <Col xs={9}>${costs.pg.toFixed(2)}</Col>
          </Row>
          <Row>
            <Col xs={3}>Flavor Cost</Col>
            <Col xs={9}>${costs.flavor.toFixed(2)}</Col>
          </Row>
          <Row>
            <Col xs={3}>Total Cost</Col>
            <Col xs={9}>${costs.total.toFixed(2)}</Col>
          </Row>
          <Row>
            <Col xs={3}>Cost per mL</Col>
            <Col xs={9}>${(costs.total / values.totalVolume).toFixed(2)}</Col>
          </Row>
        </Card>
      )}
    </Fragment>
  );
}
