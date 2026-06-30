# AI Collaboration Rules

These rules are the shared operating contract for Codex, Claude Code, and any other AI coding assistant working on this project.

## Primary Goal

Make work resumable across computers and tools by treating GitHub, Sentry, and project docs as the source of truth.

AI assistants should not rely on private chat history as durable memory. Before changing code or project state, they should read the shared records first and continue from there.

## Sources Of Truth

- GitHub issues: feature requests, bugs, improvements, decisions that require code work.
- GitHub pull requests: code review, implementation notes, test evidence, release-facing summaries.
- Sentry issues: production/runtime errors, stack traces, affected releases, user impact.
- Project docs: stable workflow rules, architecture notes, setup instructions, recurring decisions.
- Local .env: machine-specific secrets and paths only.

## Start-Of-Work Checklist

Before making changes, the assistant must:

1. Check whether the user provided a GitHub issue, PR, Sentry issue, branch, commit, or release link.
2. Search existing GitHub issues and PRs for the same request or bug when no link was provided.
3. Search Sentry when the work involves crashes, runtime errors, production behavior, or regressions.
4. Reuse existing issues instead of creating duplicates.
5. State what existing context was found before writing or changing anything significant.

## Write Safety

The assistant may read GitHub and Sentry freely when credentials allow it.

The assistant must ask before:

- Creating GitHub issues for nontrivial work.
- Closing, reopening, labeling, assigning, locking, or deleting GitHub issues or PRs.
- Marking Sentry issues resolved, ignored, archived, or assigned.
- Creating releases or changing release metadata.
- Pushing commits to a shared branch.
- Editing secrets, tokens, billing settings, auth settings, or production configuration.

## Branch Rules

- Use a separate branch for each coding task.
- Do not commit unrelated local changes.
- Do not overwrite or reset user work.
- If another AI assistant or human has active work on the same branch, stop and ask before continuing.
- Prefer PRs as the handoff point between tools and computers.

## Duplicate Prevention

Before creating a new GitHub issue, the assistant must search for:

- Similar title or keywords.
- Linked Sentry issue ID.
- Same stack trace or error message.
- Same feature area.
- Recently closed issues that may already cover the request.

If a matching issue exists, add a comment or continue in that issue instead of creating a new one.

## Sentry And GitHub Linking

When a Sentry issue leads to code work:

1. Record the Sentry issue URL or ID in the related GitHub issue or PR.
2. Record the GitHub issue or PR URL in the investigation notes when possible.
3. Do not mark the Sentry issue resolved until the fix is merged or the user confirms.
4. Include release/version information when available.

## Sentry-To-GitHub Automation

Sentry may automatically detect runtime errors. GitHub should record the investigation and code fix.

When an assistant sees a Sentry issue:

1. Search GitHub for an existing issue or PR that already mentions the Sentry issue ID, error message, stack trace, release, or affected feature.
2. If a match exists, continue there instead of creating a new issue.
3. If no match exists, ask before creating a GitHub issue unless the user has explicitly enabled automatic issue creation.
4. Put the Sentry issue URL, error type, environment, release, and first relevant stack frame in the GitHub issue.
5. Link the fixing PR back to both the GitHub issue and the Sentry issue.
6. Do not close the GitHub issue or resolve the Sentry issue until the fix is merged, deployed, or explicitly confirmed by the user.

Workflow conflicts may be logged as Sentry events only when the project has explicitly added AI workflow instrumentation. These events should use names such as:

- AI_WORKFLOW_CONFLICT
- DUPLICATE_GITHUB_ISSUE_PREVENTED
- SHARED_BRANCH_CONFLICT_DETECTED
- UNRESOLVED_HANDOFF_FOUND

These workflow events are coordination signals, not application bugs.

## Work Log Format

When leaving a GitHub issue or PR comment, use this format:

```markdown
AI work log

Tool: Codex or Claude Code
Status: investigating | in progress | blocked | ready for review | done
Context checked:
- GitHub:
- Sentry:
- Docs:

Changes:
-

Verification:
-

Next handoff:
-
```

## Handoff Rules

At the end of meaningful work, the assistant should leave enough shared context for another computer or assistant to continue:

- Current branch name.
- Related GitHub issue/PR.
- Related Sentry issue.
- Files changed.
- Tests run and results.
- Remaining risks or TODOs.
- Any user decisions still needed.

## Local Machine Configuration

Secrets and paths are not shared through GitHub. Each computer should keep them in local environment variables or a local .env file.

Expected local variables are listed in .env.example.

Never commit real values for:

- API tokens.
- Personal access tokens.
- OAuth secrets.
- Webhook secrets.
- Private keys.
- Local-only absolute paths that contain personal account details unless they are only examples.

## Conflict Policy

If the assistant detects a possible conflict between Codex, Claude Code, or human work:

1. Stop before writing.
2. Summarize the conflicting records.
3. Ask which source should win.
4. Prefer preserving both histories over overwriting either one.

## Default Behavior

When unsure:

- Read first.
- Reuse existing issues.
- Create branches instead of direct commits.
- Comment instead of changing state.
- Ask before destructive or externally visible changes.

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
