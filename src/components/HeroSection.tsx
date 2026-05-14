import Container from '@cloudscape-design/components/container';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { JSX } from 'react';

const stats = [
  { value: '20+', label: 'Years in Software' },
  { value: '1000+', label: 'Startups advised at AWS' },
  { value: '7', label: 'AWS Certifications' },
  { value: '100+', label: 'Engineers led' },
];

export default function HeroSection(): JSX.Element {
  return (
    <SpaceBetween size="l">
      {/* Hero banner */}
      <section aria-label="Introduction" style={{ background: '#232F3E', borderRadius: '8px', padding: '3rem 2.5rem', color: '#FFFFFF' }}>
        <div style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#FF9900',
          marginBottom: '0.75rem',
          fontWeight: 600,
        }}>
          Cloud Architect · Engineering Leader · Professor
        </div>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: '1rem',
          color: '#FFFFFF',
        }}>
          I build systems that scale<br />and teams that last
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: '#B0BAC5',
          maxWidth: '58ch',
          lineHeight: 1.75,
          marginBottom: '1.75rem',
        }}>
          20+ years shipping production software across Wall Street, Silicon Valley, AWS, and Latin America.
          Seven AWS certifications. Former re:Invent speaker. University professor in Data Science at ITBA.
          Currently helping companies architect for the cloud and adopt AI-driven engineering practices.
        </p>
        <SpaceBetween direction="horizontal" size="s">
          <Button variant="primary" href="#contact">Work with me</Button>
          <Button variant="normal" href="#experience">See my work</Button>
        </SpaceBetween>
      </section>

      {/* Stats */}
      <Container>
        <ColumnLayout columns={4} variant="text-grid">
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#FF9900',
                lineHeight: 1,
              }}>
                {value}
              </div>
              <Box color="text-body-secondary" fontSize="body-s" variant="p">
                <span style={{ textTransform: 'uppercase' }}>
                  {label}
                </span>
              </Box>
            </div>
          ))}
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
