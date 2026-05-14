import type { JSX } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';

const items = [
  {
    date: '2023 – Present',
    title: 'University Professor, Data Science Engineering',
    institution: 'ITBA (Instituto Tecnológico de Buenos Aires)',
    body: "Teaching graduate and PhD candidates in one of Argentina's top engineering programs.",
    active: true,
  },
  {
    date: '2000 – 2004',
    title: 'Bachelor in Computer Science & Computer Engineering',
    institution: 'Universidad Argentina de la Empresa (UADE)',
    body: 'Dual degree program in CS and Computer Engineering.',
    active: false,
  },
];

export default function EducationSection(): JSX.Element {
  return (
    <Container
      header={
        <Header variant="h2" description="Education & Teaching">
          Learning and giving back
        </Header>
      }
    >
      <SpaceBetween size="l">
        {items.map((item) => (
          <div key={item.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ minWidth: '8px', marginTop: '6px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: item.active ? '#FF9900' : '#D1D5DB',
                border: `2px solid ${item.active ? '#FF9900' : '#D1D5DB'}`,
              }} />
            </div>
            <div>
              <Badge color={item.active ? 'blue' : 'grey'}>{item.date}</Badge>
              <div style={{ fontWeight: 600, marginTop: '0.4rem' }}>{item.title}</div>
              <Box color="text-body-secondary" fontSize="body-s" variant="p">{item.institution}</Box>
              <Box color="text-body-secondary" fontSize="body-s" variant="p">{item.body}</Box>
            </div>
          </div>
        ))}
      </SpaceBetween>
    </Container>
  );
}
