---
title: "Building Ephemeral GitHub Actions Runners on EC2 with AWS CDK"
date: 2026-04-20
description: "How I built a self-hosted runner fleet that reduced CI wait times from 4 minutes to 45 seconds and cut idle compute costs by 87%."
tags: ["aws", "cdk", "github-actions", "ci-cd", "devops"]
---

GitHub-hosted runners are convenient, but they come with a cold start penalty. For a team pushing multiple PRs per day, waiting 3-4 minutes for a runner to spin up, install dependencies, and start the build adds up fast.

I replaced them with an ephemeral self-hosted runner fleet on EC2, built entirely with AWS CDK in TypeScript.

## The architecture

Each runner registers with GitHub, executes exactly one job, then self-terminates via `aws ec2 terminate-instances` in the user data script. This gives you a clean environment per job (no cross-contamination) and automatic scale-to-zero when idle.

The infrastructure is simple: a dedicated VPC with private subnets, a NAT Gateway for outbound internet, VPC endpoints for SSM, and an Auto Scaling Group that manages the fleet.

## The results

Build wait times dropped from ~4 minutes to ~45 seconds, mostly because the custom AMI has the GitHub runner agent, Node.js, and pnpm pre-installed.

After analyzing 400 scaling events over 3 days, I right-sized the ASG from 64 min / 80 desired to 8 min / 12 desired / 30 max. That's an 87% reduction in idle EC2 cost while maintaining 2x headroom above observed peak concurrency (~15 simultaneous jobs).

## One gotcha: the watchdog

GitHub's runner agent has an auto-update mechanism that spawns child processes outside the main script's process tree. If the parent script exits after the job completes, these orphaned processes can keep the instance running indefinitely.

The fix: a background watchdog process in the user data script that monitors the runner process and forces termination even when child processes are still alive.
