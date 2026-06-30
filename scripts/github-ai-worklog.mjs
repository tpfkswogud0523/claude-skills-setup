#!/usr/bin/env node
const args = parseArgs(process.argv.slice(2));
const owner = args.owner || process.env.GITHUB_DEFAULT_OWNER;
const repo = args.repo || process.env.GITHUB_DEFAULT_REPO;
const token = process.env.GITHUB_TOKEN;
const issue = args.issue || args.pr;
const dryRun = args['dry-run'] !== 'false' && args.post !== 'true';
if (!owner || !repo) fail('Missing repo. Set GITHUB_DEFAULT_OWNER and GITHUB_DEFAULT_REPO, or pass --owner and --repo.');
if (!issue) fail('Missing target. Pass --issue <number> or --pr <number>.');
if (!dryRun && !token) fail('Missing GITHUB_TOKEN. Required when posting.');
const body = buildWorkLog({
  tool: args.tool || 'codex',
  status: args.status || 'ready for review',
  github: args.github || owner + '/' + repo + '#' + issue,
  sentry: args.sentry || '',
  docs: args.docs || 'AGENTS.md, docs/ai-collaboration-workflow.md',
  summary: args.summary || '',
  changes: args.changes || '',
  verification: args.verification || '',
  next: args.next || '',
});
if (dryRun) { console.log('[dry-run] Would post this GitHub comment:\n'); console.log(body); process.exit(0); }
const url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issue + '/comments';
const res = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }, body: JSON.stringify({ body }) });
if (!res.ok) fail('GitHub comment failed: HTTP ' + res.status + ' ' + await res.text());
const json = await res.json();
console.log('Posted AI work log: ' + json.html_url);
function buildWorkLog(input) { return ['AI work log', '', 'Tool: ' + input.tool, 'Status: ' + input.status, 'Context checked:', '- GitHub: ' + input.github, '- Sentry: ' + (input.sentry || 'not checked or not applicable'), '- Docs: ' + input.docs, '', 'Changes:', bullet(input.changes || input.summary || 'No change summary provided.'), '', 'Verification:', bullet(input.verification || 'Not recorded.'), '', 'Next handoff:', bullet(input.next || 'No next step recorded.'), ''].join('\n'); }
function bullet(text) { return String(text).split(/\r?\n/).filter(Boolean).map(line => '- ' + line).join('\n'); }
function parseArgs(argv) { const out = {}; for (let i = 0; i < argv.length; i++) { const raw = argv[i]; if (!raw.startsWith('--')) continue; const key = raw.slice(2); const next = argv[i + 1]; if (!next || next.startsWith('--')) out[key] = 'true'; else out[key] = argv[++i]; } return out; }
function fail(message) { console.error(message); process.exit(1); }
