# Claude Code Project Rules

Claude Code should follow the shared AI collaboration rules in AGENTS.md.

## Required Startup Behavior

At the start of any task, read:

1. AGENTS.md
2. docs/ai-collaboration-workflow.md
3. Any linked GitHub issue, PR, Sentry issue, or project document provided by the user

If a task involves errors, production behavior, crashes, or regressions, check Sentry before making code changes.

If a task involves feature work, improvements, refactors, or requests, check GitHub issues and PRs before creating new records.

## Durable Memory Rule

Do not treat Claude chat history as the durable record.

Important findings, decisions, and handoffs should be written to one of:

- GitHub issue comment
- Pull request description or comment
- Project documentation
- Obsidian or Notion, when the user explicitly wants long-form notes

## Safety Rule

Ask before closing, resolving, deleting, force-pushing, changing labels in bulk, changing assignments, or modifying production-related settings.
