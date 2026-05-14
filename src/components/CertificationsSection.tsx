import type { JSX } from 'react';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
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
    <Cards
      header={
        <Header variant="h2" description="Certifications">
          Seven AWS certifications, earned in production
        </Header>
      }
      cardDefinition={{
        header: (item) => (
          <Box fontWeight="bold" fontSize="body-m">{item.name}</Box>
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
  );
}
