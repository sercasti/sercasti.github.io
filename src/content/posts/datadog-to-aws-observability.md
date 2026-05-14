---
title: "Migrating from Datadog to AWS-Native Observability: A Practical Guide"
date: 2026-05-14
description: "How I replaced Datadog APM with OpenTelemetry, ADOT, and CloudWatch Application Signals on a production Node.js platform with zero downtime."
tags: ["aws", "observability", "opentelemetry", "cloudwatch", "datadog"]
---

One of the more interesting projects I worked on recently was a full observability stack migration: replacing Datadog APM, Logs, and RUM with an AWS-native stack built on OpenTelemetry, ADOT collectors, and CloudWatch Application Signals.

The key constraint was zero downtime. The platform serves real users, and we couldn't afford a gap in visibility during the transition.

## The approach: a runtime killswitch

Instead of a hard cutover, I built a `TRACER_BACKEND` factory in the application's tracing module that supports three modes: `datadog`, `otel`, and `both`. The mode is controlled via SSM Parameter Store, so switching between backends requires zero code changes and zero redeploys.

This meant we could run both tracers in parallel during validation, compare trace data side by side, and cut over with confidence.

## What the AWS-native stack looks like

- **ADOT v0.47.0** deployed as a sidecar collector on each EC2 instance via CodeDeploy lifecycle hooks
- **12 OpenTelemetry packages** plus `aws-embedded-metrics` for custom metrics
- OTel `trace_id`/`span_id` injected into every Winston log entry for trace-to-log correlation
- A global Mongoose pre-hook that stamps the active `traceId` as a `$comment` on every MongoDB query
- CloudWatch Application Signals SLOs for p95 latency, plus p99 and error rate alarms across all environments

## Lessons learned

The biggest surprise was a breaking API change in `@opentelemetry/resources` v2.x that caused crash loops. The constructor-based resource API was replaced with `resourceFromAttributes()`, and this wasn't well documented at the time. The initial deployment triggered ASG lifecycle ABANDON loops, required a hotfix, a full revert, infrastructure fixes, and then a clean re-implementation across 10+ PRs.

The takeaway: observability migrations are infrastructure projects, not library upgrades. Treat them accordingly.
