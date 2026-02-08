import PropTypes from 'prop-types';
import { formatISO } from 'date-fns';
import {
  faExpand,
  faCompress,
  faPrint
} from '@fortawesome/free-solid-svg-icons';
import { useState, useCallback } from 'react';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Card from 'components/Card.js';
import MixProgressBar from 'components/MixProgressBar.js';
import MixIngredients from 'components/MixIngredients.js';

export default function MixResults({ results }) {
  const [resultsCollapsed, setResultsCollapsed] = useState(false);
  const handleCollapseToggle = useCallback(
    () => setResultsCollapsed((collapsed) => !collapsed),
    [setResultsCollapsed]
  );

  if (!results) {
    return null;
  }

  return (
    <Card className="mb-2">
      <Row>
        <Col xs={9}>
          <h3>Results</h3>
          <p className="show-print">Created {formatISO(new Date())}</p>
        </Col>
        <Col className="d-flex justify-content-end" xs={3}>
          <ButtonGroup>
            <Button
              onClick={handleCollapseToggle}
              title={resultsCollapsed ? 'Expand' : 'Collapse'}
              type="button"
              variant="primary"
            >
              <FontAwesomeIcon
                icon={resultsCollapsed ? faExpand : faCompress}
              />
            </Button>
            <Button
              onClick={() => window.print()}
              title="Print"
              type="button"
              variant="secondary"
            >
              <FontAwesomeIcon icon={faPrint} />
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="my-2 hide-print">
        <Col xs={resultsCollapsed ? 6 : 12}>
          <MixProgressBar results={results} />
        </Col>
      </Row>
      <Row>
        <Col xs={resultsCollapsed ? 6 : 12}>
          <MixIngredients results={results} />
        </Col>
      </Row>
    </Card>
  );
}

MixResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object)
};
