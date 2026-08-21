import type { APIRoute } from 'astro';

const body = `# About Sergio Castiñeyras

Cloud Architect, Engineering Leader, and Professor. I build systems that scale and teams that last.

## Background

I'm Sergio Castiñeyras, a Cloud Architect and Engineering Leader based in Buenos Aires, Argentina,
working with clients globally. Over more than 20 years I've shipped production software across
Wall Street, Silicon Valley, Amazon Web Services, and Latin America — as an individual contributor,
an architect, and a leader of engineering organizations from 10 to 100+ people.

I hold seven AWS certifications, including Solutions Architect Professional, Security Specialty,
Data Engineer Associate, and AI Practitioner. I was a Senior Solutions Architect at AWS from 2019
to 2025, where I worked hands-on with over 1,000 startups and enterprises across Latin America,
delivered $1.8M in cumulative cost savings, and led the "Gas Station of the Future" digital
transformation initiative for YPF. I've spoken at AWS re:Invent, the largest cloud conference in
the world, and at regional community events across Chile and Argentina.

I'm currently a Principal Solutions Architect at Caylent, a Premier AWS Partner, leading enterprise
Azure-to-AWS migrations and multi-account architecture design, including PCI-DSS compliant VPC and
Transit Gateway topologies. I'm also a university professor in Data Science Engineering at ITBA
(Instituto Tecnológico de Buenos Aires), one of Argentina's top engineering universities, where
I've taught graduate and PhD candidates since 2023. I hold a Bachelor's degree in Computer Science
and Computer Engineering from UADE.

## Areas of expertise

- **Cloud architecture & migration** — AWS infrastructure design, multi-account strategy, region
  migrations, hybrid and multi-cloud networking, Well-Architected reviews, and cost optimization.
- **Security & compliance** — CASA Tier 2 certification, OWASP/ASVS assessments, CSP hardening,
  WAF tuning, private subnet architecture, SCPs, and CloudTrail governance.
- **Observability & reliability** — OpenTelemetry instrumentation, CloudWatch Application Signals,
  distributed tracing, SLO design, and incident postmortem culture.
- **Software modernization** — Monolith decomposition, serverless adoption, CI/CD pipeline design,
  infrastructure as code with Terraform and CDK, and containerization strategy.
- **Engineering leadership** — Team scaling from 10 to 100+ engineers, agile methodology adoption,
  technical hiring frameworks, documentation practices, and peer review systems.
- **GenAI & agent adoption** — Practical AI integration into engineering workflows, Claude Code,
  MCP servers, AI-assisted architecture, and prompt engineering for development teams.

## Contact

- Email: sercasti@gmail.com
- Website: https://sercasti.github.io/contact/
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
