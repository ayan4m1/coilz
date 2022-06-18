import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import {
  Container,
  Card,
  Form,
  InputGroup,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import ResultsCard from 'components/ResultsCard';

export default function CostCalculator() {
  const [results, setResults] = useState(null);
  const { handleChange, handleSubmit, values } = useFormik({
    initialValues: {
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
    },
    onSubmit: useCallback(
      ({
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
      }) => {
        const nicotinePct = nicotineStrengthDesired / nicotineStrengthBase;
        const nicotineCost =
          nicotinePct * totalVolume * (nicotinePrice / nicotineVolume);
        const vgPct = vgRatio / 1e2;
        const vgCost = vgPct * totalVolume * (vgPrice / vgVolume);
        const pgPct = 1 - vgPct;
        const pgCost = pgPct * totalVolume * (pgPrice / pgVolume);
        const flavorPct = flavorPercent / 1e2;
        const flavorCost =
          flavorPct * totalVolume * (flavorPrice / flavorVolume);
        const cost = nicotineCost + vgCost + pgCost + flavorCost;

        setResults([
          ['Nic Cost', `$${nicotineCost.toFixed(2)}`],
          ['VG Cost', `$${vgCost.toFixed(2)}`],
          ['PG Cost', `$${pgCost.toFixed(2)}`],
          ['Flavor Cost', `$${flavorCost.toFixed(2)}`],
          ['Total Cost', `$${cost.toFixed(2)}`],
          ['Cost per mL', `$${(cost / totalVolume).toFixed(2)}`]
        ]);
      },
      [setResults]
    )
  });

  return (
    <Container fluid>
      <Helmet title="Cost Calculator" />
      <h1>
        <FontAwesomeIcon icon="dollar-sign" size="2x" /> Cost Calculator
      </h1>
      <Row>
        <Col sm={6} xs={12}>
          <Card body>
            <Card.Title>Inputs</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Desired Volume</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="totalVolume"
                    onChange={handleChange}
                    type="number"
                    value={values.totalVolume}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Desired VG</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="vgRatio"
                    onChange={handleChange}
                    type="number"
                    value={values.vgRatio}
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Total Flavor</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="flavorPercent"
                    onChange={handleChange}
                    type="number"
                    value={values.flavorPercent}
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Base Nicotine Strength</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="nicotineStrengthBase"
                    onChange={handleChange}
                    type="number"
                    value={values.nicotineStrengthBase}
                  />
                  <InputGroup.Text>mg/mL</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Desired Nicotine Strength</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="nicotineStrengthDesired"
                    onChange={handleChange}
                    type="number"
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
                    name="nicotinePrice"
                    onChange={handleChange}
                    type="text"
                    value={values.nicotinePrice}
                  />
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    name="nicotineVolume"
                    onChange={handleChange}
                    type="text"
                    value={values.nicotineVolume}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    readOnly
                    type="number"
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
                    name="pgPrice"
                    onChange={handleChange}
                    type="text"
                    value={values.pgPrice}
                  />
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    name="pgVolume"
                    onChange={handleChange}
                    type="text"
                    value={values.pgVolume}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    readOnly
                    type="number"
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
                    name="vgPrice"
                    onChange={handleChange}
                    type="text"
                    value={values.vgPrice}
                  />
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    name="vgVolume"
                    onChange={handleChange}
                    type="text"
                    value={values.vgVolume}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    readOnly
                    type="number"
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
                    name="flavorPrice"
                    onChange={handleChange}
                    type="text"
                    value={values.flavorPrice}
                  />
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    name="flavorVolume"
                    onChange={handleChange}
                    type="text"
                    value={values.flavorVolume}
                  />
                  <InputGroup.Text>mL</InputGroup.Text>
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    readOnly
                    type="number"
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
                <Button className="mt-2" type="submit" variant="primary">
                  Calculate
                </Button>
              </Form.Group>
            </Form>
          </Card>
        </Col>
        <Col sm={6} xs={12}>
          <ResultsCard results={results} />
        </Col>
      </Row>
    </Container>
  );
}
