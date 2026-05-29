---
title: "Hardening AWS Accounts at Scale with AI Agents: A Practical Guide"
date: 2026-05-30
description: "How I run a weekly security loop on AWS accounts using AI agents, no dedicated security specialist required. From my talk at AWS Community Day Chile 2026."
tags: ["aws", "aws-security", "ai-agents", "security", "devops"]
---

I gave a talk at AWS Community Day Chile 2026 about how the role of a cloud security engineer is changing. The short version: you no longer need a dedicated security specialist with bespoke tooling to keep an AWS organization in good shape. One engineer running the right loop, with two AI agents, can do the work that used to take a team.

This post is the practical version of that talk, condensed into something you can act on this week. The companion repo with all the code, prompts, specs, and playbooks lives at [github.com/sercasti/aws-hardening](https://github.com/sercasti/aws-hardening).

## What changed in the last 18 months

Three shifts pushed AWS hardening from "important eventually" to "we cannot defer this anymore":

1. Attackers now map your IAM in 30 seconds. What used to take a researcher two days, an LLM does with a dump and a prompt.
2. Credential leaks get prioritized. The bot that finds your key in a 3-year-old commit also reads the README and scores it before trying it.
3. Phishing in LATAM no longer sounds translated. The "if it sounds weird, ignore it" advice we gave users is dead.

Defenders got the same superpowers, but most security teams have not scaled. The math is broken unless we change how we work.

## The thesis: one engineer plus two agents

The pattern I keep using on client engagements and personal projects looks like this:

1. An **audit agent** reads the AWS account against a spec and emits a structured baseline.
2. An LLM **prioritizes** the gaps using the spec and the maturity model as context.
3. A **fix agent** generates concrete changes, either CLI commands for low-risk items or pull requests for risky ones.
4. A second agent (or a human) **reviews** the PR before merge.

Run that loop weekly. The maturity score climbs. The work that used to be a quarterly project becomes a 45-minute Monday morning routine.

## The flywheel

Scan, then prioritize, then fix, then merge, then scan again. The trick is not the individual steps. The trick is closing the loop so the next iteration starts from a better baseline than the last.

Two principles keep this safe:

- **Specs are the contract.** Without a spec, the agent decides what "secure" means using generic defaults that may not match your context. With a spec, the agent has a target it can verify against.
- **The human stays in the loop.** Agents propose, humans merge. The cost of an over-eager agent is much higher than the cost of a 30-second review.

## The maturity model in four levels

I structured the work against the [AWS Security Maturity Model](https://maturitymodel.security.aws.dev) by Darío Goldfarb. Four levels, each with a boss fight:

- **Level 1, The Awakening.** Quick wins. One day. Zero dollars. Boss: no orphan accounts.
- **Level 2, The Foundations.** Foundational controls. One week. Zero dollars. Boss: ship your first SCP without breaking production.
- **Level 3, The Watchtower.** Continuous surveillance. One month. Some spend. Boss: automate your first incident response playbook end to end.
- **Level 4, The Citadel.** Continuous program. One quarter and beyond. More spend. Boss: a real red team and blue team running on cadence.

Most organizations I work with are somewhere between zero and Level 2. That is not a failure. It is the industry average. The whole point of the loop is to climb without needing a hero.

## Tools that make this practical

The pattern is tool-agnostic. I tested it with three setups and any of them works:

- **Kiro** for spec-first work. You write what you want, Kiro generates the plan, you approve, it executes.
- **Claude Code** for multi-step autonomous work. Great for IR runbooks and refactors that span many files.
- **Cursor** for inline edits when you want to drive the diff yourself.

Underneath there is an assessment CLI written in Python that checks 13 controls across the four levels and emits a JSON or markdown report. It runs in under a minute against an AWS account with read-only credentials. The LLM consumes that JSON as context, and that is where the loop starts.

## AWS validated the pattern

While I was preparing this talk, AWS announced [Security Agent](https://aws.amazon.com/security-agent/). It does the same three things I had been showing: design review against organizational specs, code review on pull requests, and on-demand penetration testing.

This does not make the talk obsolete. It validates it. The pattern is becoming standard enough that AWS is now productizing it. If you have budget for Security Agent when it goes GA, use it. If you do not, or if you want to understand the pattern from the inside before buying, you can assemble the same loop with Claude Code, Kiro, or Cursor today. The tool changes. The pattern is the asset.

## Three things to do Monday morning

If you only take three things away from this:

1. Enable MFA on root in every account where it is missing. 90 seconds per account.
2. Pick one Level 2 item and put it on next sprint's backlog. 10 minutes of writing.
3. Run a security review prompt against your repo with whatever AI agent you already use. There is one ready in [prompts/security-review.md](https://github.com/sercasti/aws-hardening/blob/main/prompts/security-review.md). The output is your starting baseline.

None of these require budget. All of them take less than an hour. They will not make you secure, but they will show you exactly where you are, which is the only honest starting point.

## The takeaway

Security used to be a blocking project that needed a specialist. With the loop in place, it becomes a practice. Any engineer on your team can run it. The output gets better every week, not because the agents got smarter, but because your specs got sharper and your guardrails got better.

If you are stuck at Level 1 or Level 2 in your organization, the bottleneck is almost never technical. It is process: getting the first SCP through review, getting the first IAM cleanup approved, getting the first incident playbook automated. The agents help with the first 80% of the work. Your time goes into the last 20%, which is the part that actually matters.

The companion repo has the assessment CLI, specs by level, IR playbooks, SCP templates, and worked demos with all three agents. Fork it, adapt it to your org, send PRs back if you find improvements.

If you are working on this in your organization and want a second opinion, write to me on [LinkedIn](https://linkedin.com/in/sercasti). I answer.
