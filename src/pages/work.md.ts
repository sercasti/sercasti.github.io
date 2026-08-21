import type { APIRoute } from 'astro';

const body = `# Recent Client Work & Highlights — Sergio Castiñeyras

A running log of client work over the last six months — AWS migrations and landing zones, cost
optimization, observability, security certifications, and community talks.

## Notifi (SaaS communications platform, Canada)

Ongoing cloud architecture partner across security, data, observability, CI/CD, and incident
response.

- **Feb 2026 — CASA Tier 2 security certification.** Led the application through CASA Tier 2
  security certification, closing the assessment findings and hardening the AWS environment.
- **Mar 2026 — MongoDB 7 → 8 upgrade.** Upgraded the production database from MongoDB 7 to 8
  following the MongoDB Atlas upgrade playbook.
- **Mar 2026 — Datadog → CloudWatch observability migration.** Replaced the costly Datadog stack
  with an AWS-native observability solution on CloudWatch and OpenTelemetry, cutting tooling spend
  while keeping full visibility. See: https://sercasti.github.io/posts/datadog-to-aws-observability/
- **Apr 2026 — Claude Code skill for incident postmortems & RCA.** Built a Claude Code skill that
  assists with production-incident outages, postmortems, and root-cause analysis.
- **May 2026 — Self-hosted GitHub Actions runners.** Migrated GitHub Actions to ephemeral
  self-hosted EC2 runners to cut runner costs and enable AI-based code reviews. See:
  https://sercasti.github.io/posts/ephemeral-github-runners-ec2/

## CompuCom (enterprise IT services)

- **Feb 2026 — VMware → AWS migration plan.** Designed the migration plan to move all of their
  VMware-based servers — roughly 200 — to AWS.

## A US-based energy storage software company (NDA)

- **Mar 2026 — Post-acquisition AWS account consolidation.** Wrote the step-by-step plan to
  consolidate their AWS accounts with those of a company they had recently acquired, into a single
  unified AWS Organization and Control Tower.

## A major US fire & life safety company (NDA)

- **May 2026 — Cloud vendor exit to AWS landing zone.** Wrote the plan to exit their current cloud
  vendor and stand up their own AWS Control Tower landing zone, including the full migration
  process and steps.

## Fravega (one of Argentina's largest retailers)

- **Dec 2025 — VTEX exit strategy.** Presented a year-long plan for Fravega to exit the proprietary
  VTEX platform and run their own e-commerce platform in-house.

## Numaris (startup, Mexico)

- **May 2026 — AWS cost optimization.** Ran a focused cost optimization exercise that brought their
  monthly AWS bill down from roughly $100k to $70k.

## Talks & community

- **Apr 2026 — Claude Code — Explore and Share.** Gave a talk on Claude Code and AI coding agents
  for an Explore and Share session.
- **May 2026 — Cloud security talk, Chile.** Delivered a talk on cloud security to a developer
  community in Chile.

## More

Work with me: https://sercasti.github.io/contact/
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
