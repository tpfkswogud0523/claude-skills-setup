# Codex Sentry Token Setup

This guide keeps the existing Claude Code Sentry connection intact and adds a separate Sentry token for Codex.

## Goal

- Claude Code continues using its existing Sentry MCP/OAuth connection.
- Codex uses a separate Sentry API token.
- Both tools read the same Sentry organization and project.
- GitHub remains the shared work log for fixes, PRs, and handoffs.

## Recommended Token Model

Use separate tokens per tool instead of sharing one token everywhere.

- Claude Code: existing Sentry connection stays as-is.
- Codex: new token stored locally as SENTRY_AUTH_TOKEN.
- Other PCs: create their own token or copy a token through a secure password manager.

## Minimum Suggested Access

Start read-only when possible:

- Read organization/project metadata.
- Read Sentry issues/events.
- Do not grant resolve/delete/admin permissions at first.

Exact scope names can vary by Sentry token type and UI. Choose the narrowest scopes that allow issue and event lookup for the target organization/project.

## Local .env Values

Create a local .env file on each computer. Do not commit it.

SENTRY_AUTH_TOKEN=your_codex_sentry_token
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=your_project_slug_or_id
SENTRY_ENVIRONMENT=production
SENTRY_AUTO_CREATE_GITHUB_ISSUES=false
SENTRY_EVENT_THRESHOLD=5

## Verify

After setting .env, run Sentry triage in report-only mode:

node scripts/sentry-github-triage.mjs --limit 10 --threshold 5

Expected result:

- The script reads unresolved Sentry issues.
- It searches GitHub for existing issues/PRs.
- It writes reports/sentry-triage.md.
- It does not create GitHub issues unless explicitly enabled.

## Safe Defaults

- Keep SENTRY_AUTO_CREATE_GITHUB_ISSUES=false at first.
- Do not let Codex resolve Sentry issues automatically.
- Do not let Codex close GitHub issues automatically.
- Use GitHub issue/PR comments for durable handoff logs.

## What To Tell Codex Or Claude Code

Use this prompt when starting error-related work:

Follow AGENTS.md and docs/ai-collaboration. Check GitHub and Sentry first. Do not create duplicate issues. When finished, leave a GitHub issue or PR handoff log.
