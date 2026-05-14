# Astro + CloudScape Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Hugo site with an Astro static site using AWS CloudScape design system, giving sercasti.github.io an AWS Console-inspired aesthetic while remaining readable as a personal portfolio.

**Architecture:** Astro (static output) with React islands for CloudScape components. All sections are React components rendered with `client:only="react"` so CloudScape's theming works correctly. Astro content collections handle blog posts. GitHub Actions deploys the `dist/` folder to GitHub Pages.

**Tech Stack:** Astro 4, React 18, @cloudscape-design/components 3, @cloudscape-design/global-styles, TypeScript

**AWS Color Palette (hardcoded — no token import needed):**
- Header background: `#232F3E`
- Orange accent: `#FF9900`
- Link/active: `#EC7211`
- Light page bg: `#F2F3F3`
- White card bg: `#FFFFFF`
- Muted text: `#5F6B7A`
- Border: `#D1D5DB`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Create | Astro + CloudScape deps, build scripts |
| `astro.config.mjs` | Create | Astro config: React integration, static output, site URL |
| `tsconfig.json` | Create | TypeScript config for Astro + React |
| `src/layouts/BaseLayout.astro` | Create | HTML shell: CloudScape global styles, font, meta |
| `src/components/AppHeader.tsx` | Create | CloudScape TopNavigation — site name + nav links |
| `src/components/HeroSection.tsx` | Create | Dark banner hero + ColumnLayout stats |
| `src/components/MilestonesSection.tsx` | Create | Container + ExpandableSection for 4 milestones |
| `src/components/ExperienceSection.tsx` | Create | Container + custom CSS timeline (9 roles) |
| `src/components/ServicesSection.tsx` | Create | Cards grid for 6 service areas |
| `src/components/CertificationsSection.tsx` | Create | Cards grid for 7 AWS certs |
| `src/components/EducationSection.tsx` | Create | Container + 2 timeline items |
| `src/components/PostsSection.tsx` | Create | Accepts posts array, renders list |
| `src/components/ContactSection.tsx` | Create | Container + Button links |
| `src/content/config.ts` | Create | Astro content collection schema for posts |
| `src/content/posts/datadog-to-aws-observability.md` | Create | Ported blog post (frontmatter adjusted for Astro) |
| `src/content/posts/ephemeral-github-runners-ec2.md` | Create | Ported blog post |
| `src/pages/index.astro` | Create | Homepage: loads posts, composes all sections |
| `src/pages/posts/[slug].astro` | Create | Individual post page |
| `.github/workflows/deploy.yml` | Create | Astro build + GitHub Pages deploy |
| `.github/workflows/hugo.yml` | Delete | Old Hugo workflow (replaced) |

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "sercasti-site",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/react": "^3.6.0",
    "@cloudscape-design/components": "^3.0.0",
    "@cloudscape-design/global-styles": "^1.0.0",
    "astro": "^4.16.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://sercasti.github.io',
  integrations: [react()],
  output: 'static',
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 4: Install dependencies**

```bash
cd "C:/Users/Sergio/dev/sercasti.github.io"
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 5: Create src directory structure**

```bash
mkdir -p src/components src/layouts src/pages/posts src/content/posts public
```

- [ ] **Step 6: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json package-lock.json
git commit -m "feat: scaffold Astro project with CloudScape deps"
```

---

## Task 2: Base layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create favicon**

```bash
cat > public/favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="8" fill="#232F3E"/>
  <text x="50" y="68" font-family="monospace" font-size="52" font-weight="bold" fill="#FF9900" text-anchor="middle">SC</text>
</svg>
EOF
```

- [ ] **Step 2: Create BaseLayout.astro**

```astro
---
export interface Props {
  title?: string;
  description?: string;
}
const {
  title = 'Sergio Castiñeyras',
  description = 'Cloud Architect, Engineering Leader & Professor',
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #F2F3F3;
        color: #16191F;
        min-height: 100vh;
      }

      /* CloudScape global-styles ships its own reset — import it via JS */
      #main-content {
        max-width: 1100px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
      }

      .section-gap { margin-top: 1.5rem; }
    </style>
  </head>
  <body>
    <slot name="header" />
    <div id="main-content">
      <slot />
    </div>
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro public/favicon.svg
git commit -m "feat: add base layout and favicon"
```

---

## Task 3: AppHeader component

**Files:**
- Create: `src/components/AppHeader.tsx`

- [ ] **Step 1: Create AppHeader.tsx**

```tsx
import '@cloudscape-design/global-styles/index.css';
import TopNavigation from '@cloudscape-design/components/top-navigation';

export default function AppHeader() {
  return (
    <div id="app-header">
      <TopNavigation
        identity={{
          href: '/',
          title: 'Sergio Castiñeyras',
          logo: {
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='4' fill='%23FF9900'/%3E%3Ctext x='20' y='27' font-family='monospace' font-size='18' font-weight='bold' fill='%23232F3E' text-anchor='middle'%3ESC%3C/text%3E%3C/svg%3E",
            alt: 'SC',
          },
        }}
        utilities={[
          {
            type: 'button',
            text: 'Milestones',
            href: '/#milestones',
          },
          {
            type: 'button',
            text: 'Experience',
            href: '/#experience',
          },
          {
            type: 'button',
            text: 'Posts',
            href: '/posts/',
          },
          {
            type: 'button',
            text: 'Contact',
            href: '/#contact',
          },
          {
            type: 'button',
            iconName: 'external',
            text: 'LinkedIn',
            href: 'https://linkedin.com/in/sercasti',
            externalIconAriaLabel: 'Opens in a new tab',
          },
        ]}
      />
    </div>
  );
}
```

- [ ] **Step 2: Add header to BaseLayout — replace `<slot name="header" />` with the component**

In `src/layouts/BaseLayout.astro`, add the import and render the header:

```astro
---
import AppHeader from '../components/AppHeader';

export interface Props {
  title?: string;
  description?: string;
}
const {
  title = 'Sergio Castiñeyras',
  description = 'Cloud Architect, Engineering Leader & Professor',
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
        background: #F2F3F3;
        color: #16191F;
        min-height: 100vh;
      }
      #main-content {
        max-width: 1100px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
      }
      .section-gap { margin-top: 1.5rem; }
    </style>
  </head>
  <body>
    <AppHeader client:only="react" />
    <div id="main-content">
      <slot />
    </div>
  </body>
</html>
```

- [ ] **Step 3: Create a minimal index.astro to verify the header renders**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <p>Hello CloudScape</p>
</BaseLayout>
```

- [ ] **Step 4: Run dev server and verify header appears**

```bash
npm run dev
```

Expected: Site at http://localhost:4321 with a dark TopNavigation bar showing "Sergio Castiñeyras" and nav links.

- [ ] **Step 5: Commit**

```bash
git add src/components/AppHeader.tsx src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add CloudScape TopNavigation header"
```

---

## Task 4: Hero + Stats section

**Files:**
- Create: `src/components/HeroSection.tsx`

- [ ] **Step 1: Create HeroSection.tsx**

```tsx
import Container from '@cloudscape-design/components/container';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

const stats = [
  { value: '20+', label: 'Years in Software' },
  { value: '1000+', label: 'Startups advised at AWS' },
  { value: '7', label: 'AWS Certifications' },
  { value: '100+', label: 'Engineers led' },
];

export default function HeroSection() {
  return (
    <SpaceBetween size="l">
      {/* Hero banner */}
      <div style={{
        background: '#232F3E',
        borderRadius: '8px',
        padding: '3rem 2.5rem',
        color: '#FFFFFF',
      }}>
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
      </div>

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
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}>
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
```

- [ ] **Step 2: Add HeroSection to index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection';
---
<BaseLayout>
  <HeroSection client:only="react" />
</BaseLayout>
```

- [ ] **Step 3: Verify in browser — dark hero with orange accent + stats row**

```bash
npm run dev
```

Expected: Dark banner with white text, orange label, two buttons, then white stats card below.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroSection.tsx src/pages/index.astro
git commit -m "feat: add hero section with stats"
```

---

## Task 5: Milestones section

**Files:**
- Create: `src/components/MilestonesSection.tsx`

- [ ] **Step 1: Create MilestonesSection.tsx**

```tsx
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

const milestones = [
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

export default function MilestonesSection() {
  return (
    <div id="milestones">
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
              <Box color="text-body-secondary" variant="p">
                {m.body}
              </Box>
            </ExpandableSection>
          ))}
        </SpaceBetween>
      </Container>
    </div>
  );
}
```

- [ ] **Step 2: Add to index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection';
import MilestonesSection from '../components/MilestonesSection';
---
<BaseLayout>
  <HeroSection client:only="react" />
  <div class="section-gap" />
  <MilestonesSection client:only="react" />
</BaseLayout>
```

- [ ] **Step 3: Verify expandable milestone cards render**

- [ ] **Step 4: Commit**

```bash
git add src/components/MilestonesSection.tsx src/pages/index.astro
git commit -m "feat: add milestones section with expandable panels"
```

---

## Task 6: Experience timeline

**Files:**
- Create: `src/components/ExperienceSection.tsx`

- [ ] **Step 1: Create ExperienceSection.tsx**

```tsx
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';

const roles = [
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
    body: 'Early career across Argentina\'s tech ecosystem. SSO and cloud automation at MercadoLibre. Billing platform for Colombia\'s main electric utility generating 1,000,000 bills daily.',
    tags: ['Java', 'MercadoLibre', 'EA'],
    active: false,
  },
];

export default function ExperienceSection() {
  return (
    <div id="experience">
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
              key={i}
              style={{
                paddingLeft: '1.75rem',
                paddingBottom: i < roles.length - 1 ? '2rem' : 0,
                borderLeft: `2px solid ${role.active ? '#FF9900' : '#D1D5DB'}`,
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
                background: role.active ? '#FF9900' : '#FFFFFF',
                border: `2px solid ${role.active ? '#FF9900' : '#D1D5DB'}`,
              }} />

              <div style={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FF9900',
                fontWeight: 600,
                marginBottom: '0.2rem',
              }}>
                {role.date}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.1rem' }}>
                {role.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#5F6B7A', marginBottom: '0.5rem' }}>
                {role.company}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#5F6B7A', lineHeight: 1.7, marginBottom: '0.6rem' }}>
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
    </div>
  );
}
```

- [ ] **Step 2: Add to index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection';
import MilestonesSection from '../components/MilestonesSection';
import ExperienceSection from '../components/ExperienceSection';
---
<BaseLayout>
  <HeroSection client:only="react" />
  <div class="section-gap" />
  <MilestonesSection client:only="react" />
  <div class="section-gap" />
  <ExperienceSection client:only="react" />
</BaseLayout>
```

- [ ] **Step 3: Verify timeline renders with orange dots on active roles**

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperienceSection.tsx src/pages/index.astro
git commit -m "feat: add experience timeline"
```

---

## Task 7: Services, Certifications, and Education sections

**Files:**
- Create: `src/components/ServicesSection.tsx`
- Create: `src/components/CertificationsSection.tsx`
- Create: `src/components/EducationSection.tsx`

- [ ] **Step 1: Create ServicesSection.tsx**

```tsx
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';

const services = [
  {
    name: 'Cloud Architecture & Migration',
    description: 'AWS infrastructure design, multi-account strategy, region migrations, hybrid/multi-cloud networking, Well-Architected reviews, cost optimization. I\'ve done this for 1,000+ companies.',
  },
  {
    name: 'Security & Compliance',
    description: 'CASA certification, OWASP/ASVS assessments, CSP hardening, WAF tuning, private subnet architecture, SCPs, CloudTrail governance. Security is not a feature, it\'s a foundation.',
  },
  {
    name: 'Observability & Reliability',
    description: 'OpenTelemetry instrumentation, CloudWatch Application Signals, Datadog, distributed tracing, SLO design, incident postmortem culture. If you can\'t measure it, you can\'t improve it.',
  },
  {
    name: 'Software Modernization',
    description: 'Monolith decomposition, serverless adoption, CI/CD pipeline design, IaC (Terraform/CDK), containerization strategy. I\'ve guided dozens of companies through this transition.',
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

export default function ServicesSection() {
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
```

- [ ] **Step 2: Create CertificationsSection.tsx**

```tsx
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';

const certs = [
  { year: '2025', name: 'AWS Certified AI Practitioner' },
  { year: '2025', name: 'AWS Certified Data Engineer Associate' },
  { year: '2023', name: 'AWS Certified Security Specialty' },
  { year: '2022', name: 'AWS Certified Solutions Architect Professional' },
  { year: '2021', name: 'AWS Certified SysOps Administrator' },
  { year: '2020', name: 'AWS Certified Developer Associate' },
  { year: '2018', name: 'AWS Certified Solutions Architect Associate' },
];

export default function CertificationsSection() {
  return (
    <Container
      header={
        <Header variant="h2" description="Certifications">
          Seven AWS certifications, earned in production
        </Header>
      }
    >
      <Cards
        cardDefinition={{
          header: (item) => (
            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</div>
          ),
          sections: [
            {
              id: 'year',
              content: (item) => <Badge color="blue">{item.year}</Badge>,
            },
          ],
        }}
        cardsPerRow={[{ cards: 1 }, { minWidth: 400, cards: 2 }, { minWidth: 700, cards: 3 }]}
        items={certs}
        trackBy="name"
      />
    </Container>
  );
}
```

- [ ] **Step 3: Create EducationSection.tsx**

```tsx
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
    body: 'Teaching graduate and PhD candidates in one of Argentina\'s top engineering programs.',
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

export default function EducationSection() {
  return (
    <Container
      header={
        <Header variant="h2" description="Education & Teaching">
          Learning and giving back
        </Header>
      }
    >
      <SpaceBetween size="l">
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
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
```

- [ ] **Step 4: Add all three to index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection';
import MilestonesSection from '../components/MilestonesSection';
import ExperienceSection from '../components/ExperienceSection';
import ServicesSection from '../components/ServicesSection';
import CertificationsSection from '../components/CertificationsSection';
import EducationSection from '../components/EducationSection';
---
<BaseLayout>
  <HeroSection client:only="react" />
  <div class="section-gap" />
  <MilestonesSection client:only="react" />
  <div class="section-gap" />
  <ExperienceSection client:only="react" />
  <div class="section-gap" />
  <ServicesSection client:only="react" />
  <div class="section-gap" />
  <CertificationsSection client:only="react" />
  <div class="section-gap" />
  <EducationSection client:only="react" />
</BaseLayout>
```

- [ ] **Step 5: Verify all three sections render correctly in browser**

- [ ] **Step 6: Commit**

```bash
git add src/components/ServicesSection.tsx src/components/CertificationsSection.tsx src/components/EducationSection.tsx src/pages/index.astro
git commit -m "feat: add services, certifications, and education sections"
```

---

## Task 8: Blog posts with Astro content collections

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/datadog-to-aws-observability.md`
- Create: `src/content/posts/ephemeral-github-runners-ec2.md`
- Create: `src/components/PostsSection.tsx`
- Create: `src/pages/posts/index.astro`
- Create: `src/pages/posts/[slug].astro`

- [ ] **Step 1: Create content collection schema**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: Copy blog post content**

Copy `content/posts/datadog-to-aws-observability/index.md` to `src/content/posts/datadog-to-aws-observability.md` and adjust the frontmatter date format (Hugo uses `2026-05-14`, Astro needs it as-is — both work).

```bash
cp "content/posts/datadog-to-aws-observability/index.md" "src/content/posts/datadog-to-aws-observability.md"
cp "content/posts/ephemeral-github-runners-ec2/index.md" "src/content/posts/ephemeral-github-runners-ec2.md"
```

Remove Hugo-specific frontmatter fields that aren't in the schema (`categories`). Edit the two files to remove the `categories:` line from each frontmatter block.

- [ ] **Step 3: Create PostsSection.tsx**

```tsx
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime?: number;
}

interface Props {
  posts: Post[];
}

export default function PostsSection({ posts }: Props) {
  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Writing"
          actions={<Link href="/posts/">View all posts →</Link>}
        >
          Recent posts
        </Header>
      }
    >
      <SpaceBetween size="m">
        {posts.map((post) => (
          <div key={post.slug} style={{
            borderBottom: '1px solid #E9EBED',
            paddingBottom: '1rem',
          }}>
            <Link href={`/posts/${post.slug}/`} fontSize="heading-s">
              {post.title}
            </Link>
            <Box color="text-body-secondary" fontSize="body-s" variant="p" padding={{ top: 'xxs' }}>
              {post.date}
            </Box>
            <Box color="text-body-secondary" fontSize="body-s" variant="p">
              {post.description}
            </Box>
          </div>
        ))}
      </SpaceBetween>
    </Container>
  );
}
```

- [ ] **Step 4: Create posts listing page**

```astro
---
// src/pages/posts/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostsSection from '../../components/PostsSection';

const allPosts = (await getCollection('posts'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const posts = allPosts.map((p) => ({
  slug: p.slug,
  title: p.data.title,
  date: p.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  description: p.data.description,
}));
---
<BaseLayout title="Posts — Sergio Castiñeyras">
  <PostsSection posts={posts} client:only="react" />
</BaseLayout>
```

- [ ] **Step 5: Create individual post page**

```astro
---
// src/pages/posts/[slug].astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<BaseLayout title={`${post.data.title} — Sergio Castiñeyras`} description={post.data.description}>
  <div style="max-width: 72ch; margin: 0 auto;">
    <div style="margin-bottom: 0.5rem; font-size: 0.8rem; color: #5F6B7A; text-transform: uppercase; letter-spacing: 0.08em;">
      {post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
    <h1 style="font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem;">{post.data.title}</h1>
    <div class="prose">
      <Content />
    </div>
  </div>
  <style>
    .prose { line-height: 1.8; color: #16191F; }
    .prose h2 { font-size: 1.4rem; font-weight: 700; margin: 2rem 0 0.75rem; }
    .prose h3 { font-size: 1.15rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
    .prose p { margin-bottom: 1.25rem; }
    .prose pre { background: #232F3E; color: #F8F8F2; padding: 1.25rem; border-radius: 6px; overflow-x: auto; margin-bottom: 1.5rem; font-size: 0.875rem; }
    .prose code { background: #E9EBED; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.875em; }
    .prose pre code { background: none; padding: 0; }
    .prose ul, .prose ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
    .prose li { margin-bottom: 0.4rem; }
    .prose a { color: #0972D3; text-decoration: underline; }
    .prose blockquote { border-left: 3px solid #FF9900; margin: 1.5rem 0; padding-left: 1rem; color: #5F6B7A; font-style: italic; }
  </style>
</BaseLayout>
```

- [ ] **Step 6: Wire PostsSection into homepage**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection';
import MilestonesSection from '../components/MilestonesSection';
import ExperienceSection from '../components/ExperienceSection';
import ServicesSection from '../components/ServicesSection';
import CertificationsSection from '../components/CertificationsSection';
import EducationSection from '../components/EducationSection';
import PostsSection from '../components/PostsSection';

const allPosts = (await getCollection('posts'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 4);

const posts = allPosts.map((p) => ({
  slug: p.slug,
  title: p.data.title,
  date: p.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  description: p.data.description,
}));
---
<BaseLayout>
  <HeroSection client:only="react" />
  <div class="section-gap" />
  <MilestonesSection client:only="react" />
  <div class="section-gap" />
  <ExperienceSection client:only="react" />
  <div class="section-gap" />
  <ServicesSection client:only="react" />
  <div class="section-gap" />
  <CertificationsSection client:only="react" />
  <div class="section-gap" />
  <EducationSection client:only="react" />
  <div class="section-gap" />
  <PostsSection posts={posts} client:only="react" />
</BaseLayout>
```

- [ ] **Step 7: Verify blog post pages work**

Navigate to http://localhost:4321/posts/ and click through to an individual post.

- [ ] **Step 8: Commit**

```bash
git add src/content/ src/components/PostsSection.tsx src/pages/posts/ src/pages/index.astro
git commit -m "feat: add blog posts with Astro content collections"
```

---

## Task 9: Contact section + final homepage

**Files:**
- Create: `src/components/ContactSection.tsx`

- [ ] **Step 1: Create ContactSection.tsx**

```tsx
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';

export default function ContactSection() {
  return (
    <div id="contact">
      <Container
        header={
          <Header variant="h2" description="Get in touch">
            Let's build something together
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box color="text-body-secondary" variant="p">
            Available for consulting engagements, architecture reviews, fractional CTO work,
            workshops, and speaking. Based in Buenos Aires, working globally.
          </Box>
          <SpaceBetween direction="horizontal" size="s">
            <Button href="mailto:sercasti@gmail.com" iconName="envelope">Email</Button>
            <Button href="https://linkedin.com/in/sercasti" target="_blank" iconName="external">LinkedIn</Button>
            <Button href="https://github.com/sercasti" target="_blank" iconName="external">GitHub</Button>
          </SpaceBetween>
        </SpaceBetween>
      </Container>
    </div>
  );
}
```

- [ ] **Step 2: Add ContactSection to index.astro (final version)**

Add `import ContactSection from '../components/ContactSection';` to imports and append:

```astro
<div class="section-gap" />
<ContactSection client:only="react" />
```

- [ ] **Step 3: Full visual review of all sections at http://localhost:4321**

Check: header, hero, stats, milestones, experience, services, certs, education, posts, contact. Verify anchor links (`#milestones`, `#experience`, `#contact`) scroll correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/ContactSection.tsx src/pages/index.astro
git commit -m "feat: add contact section, complete homepage"
```

---

## Task 10: GitHub Actions deployment + cleanup

**Files:**
- Create: `.github/workflows/deploy.yml`
- Delete: `.github/workflows/hugo.yml`

- [ ] **Step 1: Create Astro deploy workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy Astro site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Build with Astro
        env:
          SITE: ${{ steps.pages.outputs.base_url }}
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Remove old Hugo workflow**

```bash
rm .github/workflows/hugo.yml
```

- [ ] **Step 3: Run a production build locally to verify it passes**

```bash
npm run build
```

Expected: `dist/` directory created with `index.html`, `posts/` directory, no build errors.

- [ ] **Step 4: Preview the production build**

```bash
npm run preview
```

Visit http://localhost:4321 and verify it looks identical to `npm run dev`.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml
git rm .github/workflows/hugo.yml
git commit -m "feat: replace Hugo deployment with Astro GitHub Actions workflow"
```

---

## Self-Review

**Spec coverage:**
- ✅ Astro + CloudScape stack
- ✅ AWS Console-inspired aesthetic (dark header, orange accents, CloudScape components)
- ✅ "Inspired by" not "full clone" — personal site readable as portfolio
- ✅ All sections ported: hero, stats, milestones, experience, services, certs, education, posts, contact
- ✅ Local preview via `npm run dev`
- ✅ GitHub Pages deployment
- ✅ Blog posts with full individual post pages

**Placeholder scan:** No TBDs or "implement later" in any task.

**Type consistency:** `Post` interface defined in PostsSection.tsx matches what index.astro and posts/index.astro pass in. All CloudScape component imports are consistent.
