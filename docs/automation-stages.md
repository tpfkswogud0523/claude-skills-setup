# Automation Stages 2-4

## Stage 2: Sentry To GitHub Triage Report

Implemented by scripts/sentry-github-triage.mjs.

What it does:
- Reads unresolved Sentry issues.
- Filters by event threshold and environment.
- Searches GitHub for existing related issues or PRs.
- Writes reports/sentry-triage.md.
- Suggests new GitHub issues when no match exists.
- Creates GitHub issues only when explicitly enabled.

## Stage 3: GitHub Actions Scheduled Automation

Implemented by .github/workflows/sentry-triage.yml.

What it does:
- Runs manually or on a daily schedule.
- Uses GitHub Secrets for Sentry credentials.
- Uploads the triage report as an artifact.
- On manual runs, commits reports/sentry-triage.md if it changed.

Required GitHub Secrets:
- SENTRY_AUTH_TOKEN
- SENTRY_ORG
- SENTRY_PROJECT

Optional GitHub Variables:
- SENTRY_ENVIRONMENT
- SENTRY_EVENT_THRESHOLD
- SENTRY_AUTO_CREATE_GITHUB_ISSUES
- AI_TRIAGE_REPORT_ISSUE

## Stage 4: Conservative Auto-Creation And Close Proposal

Implemented by safeguards in scripts/sentry-github-triage.mjs and scripts/propose-resolve-close.mjs.

Allowed automation:
- Create GitHub issue only when workflow input and repository variable both opt in.
- Comment or report existing matches.
- Propose resolve/close steps.

Still manual by default:
- Closing GitHub issues.
- Resolving Sentry issues.
- Bulk label changes.
- Production configuration changes.

## Recommended Rollout

1. Run Stage 2 locally in report-only mode.
2. Enable Stage 3 workflow with report-only schedule.
3. Review duplicate detection quality for a week.
4. Enable automatic GitHub issue creation only if reports are clean.
5. Keep resolve/close as proposal-only until the workflow is trusted.
