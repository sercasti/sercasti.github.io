import type { APIRoute } from 'astro';

const body = `# Contact Sergio Castiñeyras

I help companies architect for the cloud, cut cloud spend, level up their engineering teams, and
ship resilient systems. Based in Buenos Aires, Argentina, working with clients globally across
time zones.

## How to reach me

The fastest way to reach me is email. I read every message personally and typically reply within
one to two business days.

- Email: sercasti@gmail.com
- LinkedIn: https://linkedin.com/in/sercasti
- GitHub: https://github.com/sercasti
- Speaking & talks: https://sessionize.com/sergio-castineyras/
- Location: Buenos Aires, Argentina (GMT-3), available for remote and on-site engagements worldwide

## What to reach out about

- Consulting engagements and fractional CTO work
- Cloud architecture reviews and AWS Well-Architected assessments
- Cloud cost optimization (FinOps) sessions
- Security and compliance reviews (CASA, OWASP/ASVS, WAF)
- Custom internal engineering workshops and trainings — cloud solutions, security, resilience,
  monitoring, and scalability
- Conference speaking and community talks on cloud architecture, observability, and AI-assisted
  engineering
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
