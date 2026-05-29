import type { JSX, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

interface Milestone {
  title: string;
  body: string;
  link?: { href: string; label: string };
}

const milestones: Milestone[] = [
  {
    title: 'Six years at AWS, helping 1,000+ startups',
    body: `As a Senior Solutions Architect at Amazon Web Services (2019–2025), I worked hands-on with over a thousand
startups and enterprises across Latin America, driving cloud adoption, modernization, and serverless
transformation. I delivered $1.8M+ in cumulative cost savings, led the award-winning "Gas Station of the Future"
digital transformation initiative for YPF, and ran workshops, activation days, and deep-dive engagements
across the region. This role gave me a front-row seat to every possible architecture pattern, failure mode,
and scaling challenge a company can face in the cloud.`,
  },
  {
    title: 'AWS re:Invent speaker',
    body: `Selected to present at re:Invent, the largest cloud conference in the world (50,000+ attendees).
Speaking at re:Invent is a recognition reserved for practitioners with deep, real-world expertise,
and it cemented my commitment to sharing technical knowledge with the broader community. I also served
as an AWS evangelist at regional summits and events across Latin America.`,
  },
  {
    title: 'AWS Community Day speaker',
    body: `Presented at AWS Community Day, a practitioner-led event bringing together the AWS community
across the region. Community Day talks are peer-selected and focused on real-world experience over
vendor messaging — the kind of audience that asks the hard questions.`,
    link: {
      href: 'https://docs.google.com/presentation/d/e/2PACX-1vQ8OtdOIu6mpQSZMxOsGVp3pQ1FrgmHh0mUEhO7qSej1fQRhxJ0q0JDk8JjvLDw8yTH3COoIbsjmCqK/pub?start=false&loop=false&delayms=3000&slide=id.g3e49759c3d3_6_195',
      label: 'View presentation slides →',
    },
  },
  {
    title: 'University professor in Data Science',
    body: `In 2023, I was selected by ITBA (Instituto Tecnológico de Buenos Aires), one of Argentina's
top engineering universities, to teach Data Science Engineering to graduate and PhD candidates.
Teaching forces clarity of thought. It made me a better architect, a better communicator, and gave me a
framework for mentoring that I now apply to every team I work with.`,
  },
  {
    title: 'Generalist architect who dives deep',
    body: `I'm not a specialist in one narrow domain. I'm the architect you bring in when you need someone who can
move fluidly between security hardening (CASA Tier 2, OWASP, CSP), cloud infrastructure (Terraform, CDK,
serverless), observability (OpenTelemetry, CloudWatch, Datadog), data engineering, software modernization
(monolith-to-microservices), team culture, agile methodologies, Well-Architected reviews, and GenAI agent
adoption. The common thread is systematic thinking applied to whatever the problem demands.`,
  },
];

export default function MilestonesSection(): JSX.Element {
  return (
    <Container
        header={
          <Header
            variant="h2"
            description="Career-defining moments"
          >
            The milestones that shaped how I think about technology
          </Header>
        }
      >
        <SpaceBetween size="xs">
          {milestones.map((m) => (
            <ExpandableSection key={m.title} headerText={m.title} defaultExpanded>
              <SpaceBetween size="xs">
                <Box color="text-body-secondary" variant="p">
                  {m.body}
                </Box>
                {m.link && (
                  <a
                    href={m.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#FF9900', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {m.link.label}
                  </a>
                )}
              </SpaceBetween>
            </ExpandableSection>
          ))}
        </SpaceBetween>
    </Container>
  );
}
