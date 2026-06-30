# Automation Toolkit

This is a safe-first automation toolkit for using GitHub and Sentry as shared memory across computers and across AI tools.

## Files

- scripts/github-ai-worklog.mjs: posts an AI work-log or handoff comment to a GitHub issue or PR.
- scripts/sentry-github-triage.mjs: checks unresolved Sentry issues, searches GitHub for existing records, and suggests or creates GitHub issues.
- .env.example: lists local variables each computer needs.

## Safety Defaults

- github-ai-worklog.mjs uses dry-run unless --post true is passed.
- sentry-github-triage.mjs does not create GitHub issues unless --create-github-issues true is passed and SENTRY_AUTO_CREATE_GITHUB_ISSUES=true is set.
- Neither script closes GitHub issues.
- Neither script resolves Sentry issues.

## Setup On Each Computer

1. Copy .env.example to .env.
2. Fill in local values.
3. Keep .env out of GitHub.
4. Run scripts from the repository root.

## Examples

Preview a GitHub work-log comment:

node scripts/github-ai-worklog.mjs --issue 12 --tool codex --status "ready for review" --summary "Investigated Sentry crash" --verification "Tests not run yet"

Post the comment:

node scripts/github-ai-worklog.mjs --issue 12 --tool codex --status done --summary "Fixed login crash" --verification "npm test" --post true

Preview Sentry-to-GitHub triage:

node scripts/sentry-github-triage.mjs --limit 10 --threshold 5

Allow GitHub issue creation only when explicitly enabled:

SENTRY_AUTO_CREATE_GITHUB_ISSUES=true node scripts/sentry-github-triage.mjs --create-github-issues true --limit 10 --threshold 5

## Recommended Operating Mode

Start with dry-run previews. Once the output looks clean, allow posting work-log comments. Keep automatic issue creation disabled until duplicate detection has proven reliable for your repositories.

## Stage 2-4

See docs/automation-stages.md for the Sentry triage report, GitHub Actions workflow, and conservative auto-creation/close-proposal rollout.
