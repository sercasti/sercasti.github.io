import type { JSX } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Badge from '@cloudscape-design/components/badge';

const certs = [
  { year: '2025', name: 'AWS Certified AI Practitioner' },
  { year: '2025', name: 'AWS Certified Data Engineer Associate' },
  { year: '2023', name: 'AWS Certified Security Specialty' },
  { year: '2022', name: 'AWS Certified Solutions Architect Professional' },
  { year: '2021', name: 'AWS Certified SysOps Administrator' },
  { year: '2020', name: 'AWS Certified Developer Associate' },
  { year: '2018', name: 'AWS Certified Solutions Architect Associate' },
];

export default function CertificationsSection(): JSX.Element {
  return (
    <Container
      header={
        <Header variant="h2" description="Certifications">
          Seven AWS certifications, earned in production
        </Header>
      }
    >
      <Cards
        cardDefinition={{
          header: (item) => (
            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</div>
          ),
          sections: [
            {
              id: 'year',
              content: (item) => <Badge color="blue">{item.year}</Badge>,
            },
          ],
        }}
        cardsPerRow={[{ cards: 1 }, { minWidth: 400, cards: 2 }, { minWidth: 700, cards: 3 }]}
        items={certs}
        trackBy="name"
      />
    </Container>
  );
}
