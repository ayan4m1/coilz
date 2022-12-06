import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import { useCallback, useState, Fragment } from 'react';
import {
  Form,
  InputGroup,
  Button,
  Row,
  Col,
  ProgressBar
} from 'react-bootstrap';
import * as Yup from 'yup';

import Card from 'components/Card';
import ResultsCard from 'components/ResultsCard';
import Heading from 'components/Heading';

const FormSchema = Yup.object().shape({
  totalVolume: Yup.number().required().positive(),
  nicotineStrengthDesired: Yup.number().required(),
  nicotineStrengthBase: Yup.number().required().positive(),
  nicotinePrice: Yup.number().required(),
  nicotineVolume: Yup.number().required(),
  vgPrice: Yup.number().required(),
  vgVolume: Yup.number().required(),
  pgPrice: Yup.number().required(),
  pgVolume: Yup.number().required(),
  flavorPrice: Yup.number().required(),
  flavorVolume: Yup.number().required(),
  flavorPercent: Yup.number().required(),
  vgRatio: Yup.number().required().min(0).max(100)
});

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
    validationSchema: FormSchema,
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
        let nicotinePct = 0,
          nicotineCost = 0;

        if (nicotineStrengthBase > 0 && nicotineVolume > 0) {
          nicotinePct = nicotineStrengthDesired / nicotineStrengthBase;
          nicotineCost =
            nicotinePct * totalVolume * (nicotinePrice / nicotineVolume);
        }

        const vgPct = vgRatio / 1e2;
        const vgCost = vgPct * totalVolume * (vgPrice / vgVolume);
        const flavorPct = flavorPercent / 1e2;
        const flavorCost =
          flavorPct * totalVolume * (flavorPrice / flavorVolume);
        const pgPct = 1 - vgPct - flavorPct;
        const pgCost = pgPct * totalVolume * (pgPrice / pgVolume);
        const cost = nicotineCost + vgCost + pgCost + flavorCost;

        setResults([
          [
            'By Volume',
            <ProgressBar key="mixing">
              <ProgressBar
                label="Nic"
                now={nicotinePct * 100}
                variant="danger"
              />
              <ProgressBar label="VG" now={vgPct * 100} variant="warning" />
              <ProgressBar label="PG" now={pgPct * 100} variant="success" />
              <ProgressBar
                label="Flv"
                now={flavorPct * 100}
                variant="primary"
              />
            </ProgressBar>
          ],
          [
            'By Cost',
            <ProgressBar key="cost">
              <ProgressBar
                label="Nic"
                now={(nicotineCost / cost) * 100}
                variant="danger"
              />
              <ProgressBar
                label="VG"
                now={(vgCost / cost) * 100}
                variant="warning"
              />
              <ProgressBar
                label="PG"
                now={(pgCost / cost) * 100}
                variant="success"
              />
              <ProgressBar
                label="Flv"
                now={(flavorCost / cost) * 100}
                variant="primary"
              />
            </ProgressBar>
          ],
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
    <Fragment>
      <Heading icon={faDollarSign} title="Cost Calculator" />
      <Row>
        <Col sm={6} xs={12}>
          <Card>
            <h3>Inputs</h3>
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
    </Fragment>
  );
}
