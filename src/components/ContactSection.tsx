import type { JSX } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';

const services = [
  'Consulting engagements',
  'Architecture reviews',
  'Fractional CTO work',
  'Cloud cost optimization sessions',
  'Custom internal engineering workshops & trainings — cloud solutions, security, resilience, monitoring, and scalability',
  'Conference speaking',
];

export default function ContactSection(): JSX.Element {
  return (
    <section
      aria-label="Contact"
      style={{
        background: '#232F3E',
        borderRadius: '8px',
        padding: '3rem 2.5rem',
        color: '#FFFFFF',
        boxShadow: '0 12px 32px rgba(35, 47, 62, 0.18)',
      }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#FF9900',
          marginBottom: '0.75rem',
          fontWeight: 600,
        }}
      >
        <span role="img" aria-label="Handshake" style={{ marginRight: '0.4rem' }}>🤝</span>
        Let's work together
      </div>

      <h2
        style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: '0.75rem',
          color: '#FFFFFF',
        }}
      >
        Let's build something together
      </h2>

      <p
        style={{
          fontSize: '1.05rem',
          color: '#B0BAC5',
          maxWidth: '62ch',
          lineHeight: 1.7,
          marginBottom: '1.75rem',
        }}
      >
        I help companies architect for the cloud, cut cloud spend, level up their engineering teams,
        and ship resilient systems. Based in Buenos Aires, working globally.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '0.6rem 1.5rem',
          marginBottom: '2rem',
        }}
      >
        {services.map((service) => (
          <div
            key={service}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              color: '#E9EBED',
              lineHeight: 1.5,
            }}
          >
            <span
              aria-hidden="true"
              style={{ color: '#FF9900', fontWeight: 700, flexShrink: 0 }}
            >
              ›
            </span>
            <span>{service}</span>
          </div>
        ))}
      </div>

      <SpaceBetween direction="horizontal" size="s">
        <Button variant="primary" href="mailto:sercasti@gmail.com" iconName="envelope">
          Email me
        </Button>
        <Button href="https://linkedin.com/in/sercasti" target="_blank" iconName="external">
          LinkedIn
        </Button>
        <Button href="https://github.com/sercasti" target="_blank" iconName="external">
          GitHub
        </Button>
        <Button href="https://sessionize.com/sergio-castineyras/" target="_blank" iconName="external">
          Speaking
        </Button>
      </SpaceBetween>
    </section>
  );
}
