# AI Collaboration Folder

This folder keeps the shared work-continuation rules for Claude Code, Codex, GitHub, and Sentry.

Use this folder for human-readable workflow guidance and automation templates.

## Files

- README.md: how work continues across computers and AI tools.
- automation-toolkit.md: how to use the local scripts.
- automation-stages.md: staged rollout for Sentry-to-GitHub automation.
- github-actions-sentry-triage.template.yml: optional GitHub Actions automation template.
- sentry-codex-token-setup.md: how to add a separate Codex Sentry token while keeping Claude Code unchanged.

## Note About GitHub Actions Workflows

GitHub calls scheduled automation files "workflows". That is different from the human work-flow guidance in these docs.

The template in this folder does nothing by itself. To enable scheduled automation, copy it to:

.github/workflows/sentry-triage.yml

Only do that after the GitHub token/account has permission to manage Actions workflow files.
