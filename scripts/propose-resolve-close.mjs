#!/usr/bin/env node
const args = parseArgs(process.argv.slice(2));
const issue = args.issue || '';
const sentry = args.sentry || '';
const pr = args.pr || '';
if (!issue && !pr) fail('Pass --issue <number> or --pr <number>.');
const target = issue ? 'issue #' + issue : 'PR #' + pr;
const lines = ['Resolve/close proposal', '', 'Target: ' + target, 'Sentry: ' + (sentry || 'not provided'), '', 'Recommended checks:', '- Fix PR is merged.', '- Deployment containing the fix is live.', '- Sentry issue has not recurred after deploy window.', '- Verification evidence is recorded.', '', 'This script intentionally does not close GitHub issues or resolve Sentry issues.'];
console.log(lines.join('\n'));
function parseArgs(argv) { const out = {}; for (let i = 0; i < argv.length; i++) { const raw = argv[i]; if (!raw.startsWith('--')) continue; const key = raw.slice(2); const next = argv[i + 1]; if (!next || next.startsWith('--')) out[key] = 'true'; else out[key] = argv[++i]; } return out; }
function fail(message) { console.error(message); process.exit(1); }
