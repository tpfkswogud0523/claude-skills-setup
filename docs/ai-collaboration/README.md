# AI Collaboration Workflow

This document explains how to keep work continuous across multiple computers and across AI tools such as Codex and Claude Code.

## What This Solves

Computer A and Computer B do not share private assistant chat history by default. Codex and Claude Code also do not automatically share their internal memory.

To make work resumable, shared systems must hold the durable memory:

- GitHub for work items, branches, pull requests, code review, and implementation history.
- Sentry for runtime errors, stack traces, releases, and impact.
- Docs, Notion, or Obsidian for durable knowledge and decisions.

The assistant should read these shared systems at the start of work and write useful handoff notes at the end.

## Recommended Setup

Keep these files in the root of each important GitHub repository:

- AGENTS.md: shared rules for Codex and other coding agents.
- CLAUDE.md: Claude Code entrypoint that points back to the shared rules.
- docs/ai-collaboration-workflow.md: longer workflow explanation.
- .env.example: local environment variable template.
- .gitignore: excludes local secrets and machine files.

Each computer should keep real secrets and paths locally.

## Local Versus Shared State

Shared through GitHub:

- Code.
- Issues.
- Pull requests.
- Review comments.
- Durable workflow rules.
- Non-secret examples.

Shared through Sentry:

- Runtime errors.
- Stack traces.
- Affected releases.
- Error status.
- Links between incidents and fixes.

Shared through Notion or Obsidian:

- Long-form notes.
- Product thinking.
- Research.
- Decision logs.
- Human-readable project memory.

Local to each computer:

- API tokens.
- OAuth sessions.
- Obsidian vault path.
- Local .env.
- Uncommitted experiments.
- Tool-specific login state.

## Normal Work Flow

1. User asks for work.
2. Assistant checks provided links.
3. Assistant searches GitHub for existing issues and PRs.
4. If the task involves an error, assistant checks Sentry.
5. Assistant summarizes the known context.
6. Assistant creates or uses a task branch.
7. Assistant makes changes.
8. Assistant verifies the work.
9. Assistant writes a handoff note to the GitHub issue or PR.

## Error Work Flow

Use this for crashes, exceptions, failed jobs, production bugs, and regressions.

1. Find the related Sentry issue.
2. Capture the Sentry issue URL, error type, message, stack frame, release, and affected environment.
3. Search GitHub for an existing linked issue or PR.
4. If none exists, ask before creating a GitHub issue.
5. Fix on a branch.
6. Link the PR to the GitHub issue and Sentry issue.
7. Do not resolve the Sentry issue until the fix is merged or the user confirms.

## Improvement Work Flow

Use this for features, refactors, design changes, and ideas.

1. Search GitHub issues and PRs for similar requests.
2. Reuse the existing issue if one exists.
3. Ask before creating a new issue if the work is nontrivial.
4. Implement on a branch.
5. Open or update a PR.
6. Leave a clear summary and verification notes.

## Handoff Note Template

Use this in GitHub issue or PR comments when handing work to another AI tool, another computer, or a human.

```markdown
AI handoff

Tool:
Computer:
Branch:
Related GitHub:
Related Sentry:

What I found:
-

What I changed:
-

Verification:
-

Still needed:
-

Risks:
-
```

## Sentry Handling Rules

- Sentry is the error source of truth, not the code source of truth.
- GitHub remains the code and task source of truth.
- Link Sentry issues to GitHub issues or PRs when code work is needed.
- Do not mark Sentry issues resolved just because code was changed locally.
- Prefer resolving Sentry after merge, deploy, or explicit user confirmation.

## Automated Error Capture

For application errors, Sentry can be the automatic detector and GitHub can be the durable fix log.

Recommended automated flow:

1. The app captures an exception or failed transaction with the Sentry SDK.
2. Sentry groups the event into a Sentry issue.
3. An assistant or automation checks whether a GitHub issue or PR already links to the Sentry issue.
4. If a GitHub issue exists, the assistant comments there with updated context.
5. If no GitHub issue exists, the assistant asks before creating one unless the repository has enabled automatic issue creation.
6. Code work happens on a separate branch.
7. The PR links the GitHub issue and the Sentry issue.
8. After merge and deploy, the assistant or user verifies whether the Sentry issue stopped recurring.
9. Sentry resolve and GitHub close happen only after deploy confirmation, user confirmation, or a repository-specific rule.

## Automatic GitHub Issue Creation Criteria

Automatic issue creation is optional. Enable it only for repositories where noisy issue creation is acceptable.

Create or suggest a GitHub issue when:

- The Sentry issue is new in the current release.
- The issue affects production users.
- The issue repeats above the configured event threshold.
- The issue is tied to a clear regression.
- No existing GitHub issue or PR already covers it.

Do not automatically create a GitHub issue when:

- The Sentry issue is from local development only.
- The issue is already linked to an open GitHub issue or PR.
- The event is a known third-party outage with no code action.
- The event is low signal, noisy, or intentionally ignored.
- The assistant cannot identify the owning repository or project.

## Suggested Sentry Event Tags

If the application is instrumented with Sentry, use tags that make cross-tool lookup easier:

- release: deployed version or commit SHA.
- environment: production, staging, preview, or development.
- github_repo: owner/name when known.
- github_issue: linked GitHub issue number when known.
- github_pr: linked GitHub PR number when known.
- ai_tool: codex, claude-code, or manual when the event is workflow-related.
- workflow_event: true only for AI coordination events.

## AI Workflow Conflict Events

Sentry can also record AI workflow coordination problems, but only if the project explicitly instruments them.

Useful workflow event names:

- AI_WORKFLOW_CONFLICT: generic coordination conflict.
- DUPLICATE_GITHUB_ISSUE_PREVENTED: an assistant found an existing issue and avoided a duplicate.
- SHARED_BRANCH_CONFLICT_DETECTED: two tools or users appear to be editing the same branch.
- UNRESOLVED_HANDOFF_FOUND: an assistant found prior work without a clear next step.
- SENTRY_GITHUB_LINK_MISSING: an error fix exists without a linked Sentry or GitHub record.

Treat these as operational breadcrumbs, not application defects. They help another computer or assistant understand what happened.

## Resolve And Close Policy

Use this conservative default:

- The assistant may propose resolving a Sentry issue after a fix is merged and deployed.
- The assistant may propose closing a GitHub issue after the linked PR is merged and verification is recorded.
- The assistant must ask before resolving or closing unless the user has explicitly enabled automatic state changes.
- If an error recurs after resolve, reopen or comment on the existing GitHub issue instead of creating a duplicate.

## GitHub Handling Rules

- Search before creating issues.
- Use existing issues when possible.
- Use branches for code changes.
- Use PRs for review and cross-computer continuation.
- Do not force-push shared branches without explicit permission.
- Do not close or relabel important issues without confirmation.

## Obsidian And Notion

Notion is account-based. If both tools are connected to the same workspace, they can read the same shared notes.

Obsidian is file-based. If the vault is stored in OneDrive, Dropbox, iCloud, Git, or Obsidian Sync, other computers can see the same notes after sync. Each computer still needs its local vault path configured.

Use Obsidian or Notion for durable human-readable notes, not for secrets.

## Can This Prevent All Conflicts?

No setup can mathematically prevent every conflict if two tools edit the same branch or state at the same time.

This setup greatly reduces conflicts by making both tools:

- Read shared state first.
- Avoid duplicate issues.
- Use separate branches.
- Ask before state-changing actions.
- Leave handoff notes.

For high-risk work, keep one active owner per issue or branch.

## New Project Intake

For every new project or first-time repository setup, the assistant should ask whether to enable:

- Sentry runtime error logging.
- GitHub work-log and handoff rules.
- Shared AI collaboration docs.

Recommended prompt:

새 프로젝트라서 먼저 확인할게요. 이 프로젝트도 오류가 나면 Sentry에 자동 기록되게 하고, 작업 내역은 GitHub에 이어받기 좋게 남기도록 세팅할까요?

This prevents the common mistake where a user asks to remember errors in Sentry, but the project has no Sentry project, DSN, or SDK installed yet.
