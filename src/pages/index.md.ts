import type { APIRoute } from 'astro';

const body = `# Sergio Castiñeyras — Cloud Architect & Engineering Leader

I build systems that scale and teams that last. With over 20 years of experience shipping
production software across Wall Street, Silicon Valley, Amazon Web Services, and Latin America,
I specialize in cloud architecture, engineering leadership, and AI-driven development practices.
I hold seven AWS certifications including Solutions Architect Professional, Security Specialty,
Data Engineer Associate, and AI Practitioner.

## Services

Available for consulting engagements, cloud architecture reviews, fractional CTO work, cloud cost
optimization sessions, and custom engineering workshops. Based in Buenos Aires, working with
clients globally.

- **Cloud Architecture & Migration** — AWS infrastructure design, multi-account strategy, region
  migrations, hybrid and multi-cloud networking, Well-Architected reviews, and cost optimization.
- **Security & Compliance** — CASA Tier 2 certification, OWASP/ASVS assessments, CSP hardening,
  WAF tuning, private subnet architecture, SCPs, and CloudTrail governance.
- **Observability & Reliability** — OpenTelemetry instrumentation, CloudWatch Application Signals,
  distributed tracing, SLO design, and incident postmortem culture.
- **Software Modernization** — Monolith decomposition, serverless adoption, CI/CD pipeline design,
  infrastructure as code with Terraform and CDK, and containerization strategy.
- **Engineering Leadership** — Team scaling from 10 to 100+ engineers, agile methodology adoption,
  technical hiring frameworks, documentation practices, and peer review systems.
- **GenAI & Agent Adoption** — Practical AI integration into engineering workflows, Claude Code,
  MCP servers, AI-assisted architecture, and prompt engineering for development teams.

## Experience

Currently Principal Solutions Architect at Caylent, a Premier AWS Partner, leading enterprise
Azure-to-AWS migrations and multi-account architecture design including PCI-DSS compliant VPC and
Transit Gateway topologies. Previously Senior Solutions Architect at Amazon Web Services
(2019–2025), working hands-on with over 1,000 startups across Latin America and delivering $1.8M
in cumulative cost savings. Speaker at AWS re:Invent and AWS Community Day Chile 2026.

## Education & Teaching

University professor in Data Science Engineering at ITBA (Instituto Tecnológico de Buenos Aires),
one of Argentina's top engineering universities, teaching graduate and PhD candidates since 2023.
Bachelor's degree in Computer Science and Computer Engineering from UADE.

## More

- About: https://sercasti.github.io/about/
- Recent work: https://sercasti.github.io/work/
- Posts: https://sercasti.github.io/posts/
- Contact: https://sercasti.github.io/contact/
- Agent guide: https://sercasti.github.io/llms.txt
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
