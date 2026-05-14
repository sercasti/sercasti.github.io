import type { JSX } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';

const services = [
  {
    name: 'Cloud Architecture & Migration',
    description: "AWS infrastructure design, multi-account strategy, region migrations, hybrid/multi-cloud networking, Well-Architected reviews, cost optimization. I've done this for 1,000+ companies.",
  },
  {
    name: 'Security & Compliance',
    description: "CASA certification, OWASP/ASVS assessments, CSP hardening, WAF tuning, private subnet architecture, SCPs, CloudTrail governance. Security is not a feature, it's a foundation.",
  },
  {
    name: 'Observability & Reliability',
    description: "OpenTelemetry instrumentation, CloudWatch Application Signals, Datadog, distributed tracing, SLO design, incident postmortem culture. If you can't measure it, you can't improve it.",
  },
  {
    name: 'Software Modernization',
    description: "Monolith decomposition, serverless adoption, CI/CD pipeline design, IaC (Terraform/CDK), containerization strategy. I've guided dozens of companies through this transition.",
  },
  {
    name: 'Engineering Culture & Leadership',
    description: 'Team scaling (10 to 100+), agile methodology adoption, technical hiring frameworks, documentation practices, peer review systems. Technology is delivered by people.',
  },
  {
    name: 'GenAI & Agent Adoption',
    description: 'Practical AI integration into engineering workflows. Claude Code, MCP servers, AI-assisted architecture, prompt engineering for development teams. Not hype, just leverage.',
  },
];

export default function ServicesSection(): JSX.Element {
  return (
    <Container
      header={
        <Header variant="h2" description="What I can help with">
          Architecture, modernization, and everything in between
        </Header>
      }
    >
      <Cards
        cardDefinition={{
          header: (item) => (
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#16191F' }}>
              {item.name}
            </div>
          ),
          sections: [
            {
              id: 'description',
              content: (item) => (
                <Box color="text-body-secondary" variant="p" fontSize="body-s">
                  {item.description}
                </Box>
              ),
            },
          ],
        }}
        cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 900, cards: 3 }]}
        items={services}
        trackBy="name"
      />
    </Container>
  );
}
