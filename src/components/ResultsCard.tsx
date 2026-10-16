import type { PropsWithChildren, ReactNode } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import Card from './Card';

export type ResultRow = [name: string, content: ReactNode];

interface ResultsCardProps {
  title?: string;
  results?: ResultRow[] | null;
}

export default function ResultsCard({
  title = 'Outputs',
  results,
  children
}: PropsWithChildren<ResultsCardProps>) {
  if (!results?.length && !children) {
    return null;
  }

  return (
    <Card>
      <h3>{title}</h3>
      <Container fluid>
        {Boolean(results?.length) &&
          results?.map(([name, content]) => (
            <Row key={name}>
              <Col xs={3}>
                <strong>{name}</strong>
              </Col>
              <Col xs={9}>{content}</Col>
            </Row>
          ))}
        {children}
      </Container>
    </Card>
  );
}
