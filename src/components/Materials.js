import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Papa from 'papaparse';
import React, { Fragment, useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import CurveEditor from 'components/CurveEditor';
import { readFile } from 'utils';

export default function Materials() {
  const [csvData, setCsvData] = useState(null);
  const [points, setPoints] = useState([]);

  const handleFileChange = useCallback(async (event) => {
    setCsvData(await readFile(event.target.files[0]));
  }, []);

  const handleImportClick = useCallback(() => {
    if (!csvData) {
      return;
    }

    const { data } = Papa.parse(csvData, {
      dynamicTyping: true,
      header: true,
      transformHeader: (header) => {
        switch (header) {
          case 'Temperature (degF)':
            return 'temp';
          case 'Electrical Resistivity':
            return 'tcr';
          default:
            return header;
        }
      }
    });

    if (!data) {
      return;
    }

    setPoints(data);
  }, [csvData, setPoints]);

  return (
    <Fragment>
      <h1>
        <FontAwesomeIcon icon="thermometer-full" size="2x" /> Materials
      </h1>
      <Form>
        <Form.Row>
          <input type="file" onChange={handleFileChange} />
        </Form.Row>
        <Form.Row>
          <Button onClick={handleImportClick}>Import</Button>
        </Form.Row>
      </Form>
      <CurveEditor points={points} />
    </Fragment>
  );
}
