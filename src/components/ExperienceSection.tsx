import type { JSX } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';

const ORANGE = '#FF9900';
const GRAY = '#687078';
const MUTED = '#5F6B7A';

interface Role {
  date: string;
  title: string;
  company: string;
  body: string;
  tags: string[];
  active: boolean;
}

const roles: Role[] = [
  {
    date: 'Feb 2026 – Present',
    title: 'Principal Solutions Architect',
    company: 'Caylent — Premier AWS Partner',
    body: 'Leading end-to-end migration assessments and architecture design for enterprise clients moving from Azure to AWS. Architecting multi-cloud networking, PCI-DSS compliant VPC designs, and post-acquisition environment consolidation across 29 accounts and two AWS Organizations.',
    tags: ['AWS MGN', 'Transit Gateway', 'PCI-DSS', 'Multi-cloud'],
    active: true,
  },
  {
    date: 'May 2025 – Feb 2026',
    title: 'Senior Cloud Architect',
    company: 'Notifi / SwiftBel Inc.',
    body: 'Hands-on cloud architecture for a SaaS communications platform. Migrated observability from Datadog to AWS-native stack (ADOT, OpenTelemetry, CloudWatch Application Signals). Built ephemeral CI runners on EC2 via CDK, cutting build times from 4 min to 45 sec. Led CASA Tier 2 security certification. Established Terraform/Terragrunt IaC from scratch across 3 environments.',
    tags: ['Terraform', 'CDK', 'OpenTelemetry', 'CASA', 'WAF'],
    active: true,
  },
  {
    date: 'May 2025 – Feb 2026',
    title: 'Technical Director',
    company: 'Fravega Tech — Buenos Aires',
    body: 'Led 50 engineers through a strategic platform migration away from VTEX, enabling custom marketplace solutions. Established engineering documentation practices and peer-review systems that reduced incidents.',
    tags: ['Team leadership', 'Platform migration', 'Agile'],
    active: false,
  },
  {
    date: 'Aug 2019 – May 2025',
    title: 'Senior Solutions Architect',
    company: 'Amazon Web Services (AWS)',
    body: 'Modernized infrastructure for 30+ enterprise clients, achieving $1.8M in cumulative cost savings. Led the "Gas Station of the Future" initiative for YPF. Delivered workshops and engagement programs across Latin America. Served as AWS evangelist at re:Invent and regional summits.',
    tags: ['Serverless', 'Modernization', 'Well-Architected', 're:Invent speaker'],
    active: false,
  },
  {
    date: 'Mar 2018 – Aug 2019',
    title: 'Technical Director',
    company: 'GlobalLogic — Buenos Aires',
    body: 'Directed 100+ engineers through 20+ product launches with 99% on-time delivery. Secured multimillion-dollar contracts through presales architecture work.',
    tags: ['Engineering leadership', 'Presales', 'Delivery'],
    active: false,
  },
  {
    date: 'Dec 2015 – Mar 2018',
    title: 'Technical Manager',
    company: 'Globant / GlobalLogic — New York & Buenos Aires',
    body: 'Built and scaled distributed agile teams for AIG, Banco Macro, and Digital River. Reduced production downtime by 35% through optimized incident response.',
    tags: ['AIG', 'Microservices', 'CI/CD'],
    active: false,
  },
  {
    date: 'Apr 2013 – Dec 2015',
    title: 'Senior Architect, IRD Risk Management',
    company: 'Morgan Stanley — New York',
    body: 'Engineered a distributed calculation grid at NYSE handling 2 million daily tasks for FX risk operations.',
    tags: ['Distributed systems', 'FX risk', 'Zookeeper'],
    active: false,
  },
  {
    date: '2008 – 2013',
    title: 'Technical Lead / Architect',
    company: 'Razorfish — USA (AT&T, State Farm, PapaJohns)',
    body: 'Designed the AT&T Digital Life platform reaching 20,000+ users. Led multi-client platform architectures.',
    tags: ['AT&T', 'SOA', 'High-volume systems'],
    active: false,
  },
  {
    date: '2005 – 2009',
    title: 'Senior Developer',
    company: 'MercadoLibre, Electronic Arts, GESFOR, Synapsis',
    body: "Early career across Argentina's tech ecosystem. SSO and cloud automation at MercadoLibre. Billing platform for Colombia's main electric utility generating 1,000,000 bills daily.",
    tags: ['Java', 'MercadoLibre', 'EA'],
    active: false,
  },
];

export default function ExperienceSection(): JSX.Element {
  return (
    <Container
        header={
          <Header variant="h2" description="Professional timeline">
            Two decades of building, leading, and shipping
          </Header>
        }
      >
        <div style={{ paddingTop: '0.5rem' }}>
          {roles.map((role, i) => (
            <div
              key={role.title + role.date}
              style={{
                paddingLeft: '1.75rem',
                paddingBottom: i < roles.length - 1 ? '2rem' : 0,
                borderLeft: `2px solid ${role.active ? ORANGE : GRAY}`,
                position: 'relative',
              }}
            >
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: '-7px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: role.active ? ORANGE : '#FFFFFF',
                border: `2px solid ${role.active ? ORANGE : GRAY}`,
              }} />

              <div style={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: ORANGE,
                fontWeight: 600,
                marginBottom: '0.2rem',
              }}>
                {role.date}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.1rem' }}>
                {role.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: MUTED, marginBottom: '0.5rem' }}>
                {role.company}
              </div>
              <div style={{ fontSize: '0.88rem', color: MUTED, lineHeight: 1.7, marginBottom: '0.6rem' }}>
                {role.body}
              </div>
              <SpaceBetween direction="horizontal" size="xxs">
                {role.tags.map((tag) => (
                  <Badge key={tag} color="grey">{tag}</Badge>
                ))}
              </SpaceBetween>
            </div>
          ))}
        </div>
    </Container>
  );
}
