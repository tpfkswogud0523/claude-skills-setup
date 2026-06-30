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

## New Project Intake Question

When starting a new project, opening a new repository for the first time, or substantially changing an existing automation project, the assistant must ask this before implementation work:

> Should I set up Sentry error logging and GitHub work-record rules for this project now?

If the user says yes, the assistant should:

1. Check whether the repository already has Sentry SDK, SENTRY_DSN, AGENTS.md, CLAUDE.md, and ai-collaboration docs.
2. If Sentry is missing, offer to create or guide creation of a Sentry project and DSN.
3. Add Sentry error capture to the project code once the DSN is available.
4. Add .env.example entries without committing real secrets.
5. Add or update GitHub work-log and handoff rules.
6. Record the setup in GitHub so another computer or assistant can continue later.

If the user says no or later, continue the requested work but mention that runtime errors will not be automatically captured by Sentry until this setup is done.

Use this short Korean prompt when helpful:

> 새 프로젝트라서 먼저 확인할게요. 이 프로젝트도 오류가 나면 Sentry에 자동 기록되게 하고, 작업 내역은 GitHub에 이어받기 좋게 남기도록 세팅할까요?
