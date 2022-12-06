import { faThermometerFull } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';
import { Fragment, useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import CurveEditor from 'components/CurveEditor';
import { readFile } from 'utils';
import Heading from 'components/Heading';

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
      <Heading icon={faThermometerFull} title="Material Editor" />
      <Form>
        <Form.Group>
          <input onChange={handleFileChange} type="file" />
        </Form.Group>
        <Form.Group className="my-3">
          <Button onClick={handleImportClick}>Import</Button>
        </Form.Group>
      </Form>
      <CurveEditor points={points} />
    </Fragment>
  );
}
