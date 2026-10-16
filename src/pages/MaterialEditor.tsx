import { faThermometerFull } from '@fortawesome/free-solid-svg-icons';
import { parse } from 'papaparse';
import { type ChangeEvent, Fragment, useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import Heading from '../components/Heading';
import CurveEditor, { type CurvePoint } from '../components/CurveEditor';
import { readFile } from '../utils';

export default function Materials() {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [points, setPoints] = useState<CurvePoint[]>([]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        setCsvData(await readFile(file));
      }
    },
    []
  );

  const handleImportClick = useCallback(() => {
    if (!csvData) {
      return;
    }

    const { data } = parse<CurvePoint>(csvData, {
      dynamicTyping: true,
      header: true,
      transformHeader: (header: string) => {
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
