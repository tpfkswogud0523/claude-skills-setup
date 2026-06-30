#!/usr/bin/env node
const args = parseArgs(process.argv.slice(2));
const sentryToken = process.env.SENTRY_AUTH_TOKEN;
const sentryOrg = args.sentryOrg || process.env.SENTRY_ORG;
const sentryProject = args.sentryProject || process.env.SENTRY_PROJECT;
const sentryEnvironment = args.environment || process.env.SENTRY_ENVIRONMENT || 'production';
const threshold = Number(args.threshold || process.env.SENTRY_EVENT_THRESHOLD || 1);
const githubToken = process.env.GITHUB_TOKEN;
const owner = args.owner || process.env.GITHUB_DEFAULT_OWNER || process.env.GITHUB_REPOSITORY_OWNER;
const repo = args.repo || process.env.GITHUB_DEFAULT_REPO || (process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '');
const allowCreate = args['create-github-issues'] === 'true' && process.env.SENTRY_AUTO_CREATE_GITHUB_ISSUES === 'true';
const postReportIssue = args['comment-issue'] || process.env.AI_TRIAGE_REPORT_ISSUE || '';
const reportPath = args.report || process.env.AI_TRIAGE_REPORT_PATH || 'reports/sentry-triage.md';
const limit = Number(args.limit || 10);
const reportRows = [];

if (!sentryToken) fail('Missing SENTRY_AUTH_TOKEN.');
if (!sentryOrg) fail('Missing SENTRY_ORG.');
if (!githubToken) fail('Missing GITHUB_TOKEN.');
if (!owner || !repo) fail('Missing GitHub repo. Set GITHUB_DEFAULT_OWNER and GITHUB_DEFAULT_REPO.');

const issues = await fetchSentryIssues();
const candidates = issues.filter(issue => Number(issue.count || 0) >= threshold);

for (const issue of candidates) {
  const summary = summarizeSentryIssue(issue);
  const matches = await searchGitHub(buildGitHubSearchQuery(issue));
  if (matches.total_count > 0) {
    const urls = matches.items.slice(0, 3).map(item => item.html_url);
    console.log('MATCH: ' + summary.title);
    console.log('Sentry: ' + summary.url);
    console.log('GitHub: ' + urls.join(', '));
    console.log('Action: comment on existing GitHub record if new information is useful.\n');
    reportRows.push({ status: 'matched', summary, github: urls, action: 'Use existing GitHub record.' });
    continue;
  }
  console.log('NEW_CANDIDATE: ' + summary.title);
  console.log('Sentry: ' + summary.url);
  console.log('Events: ' + summary.count + '; Environment: ' + sentryEnvironment);
  if (!allowCreate) {
    console.log('Action: suggest creating a GitHub issue. Automatic creation is disabled.\n');
    reportRows.push({ status: 'candidate', summary, github: [], action: 'Suggest creating GitHub issue. Automatic creation disabled.' });
    continue;
  }
  const created = await createGitHubIssue(summary);
  console.log('Created GitHub issue: ' + created.html_url + '\n');
  reportRows.push({ status: 'created', summary, github: [created.html_url], action: 'Created GitHub issue.' });
}

const report = buildReport({ issues, candidates, reportRows });
await writeReport(reportPath, report);
console.log('Wrote report: ' + reportPath);
if (postReportIssue) {
  const posted = await postGitHubComment(postReportIssue, report);
  console.log('Posted triage report comment: ' + posted.html_url);
}

async function fetchSentryIssues() {
  const params = new URLSearchParams({ query: 'is:unresolved environment:' + sentryEnvironment, limit: String(limit), statsPeriod: args.statsPeriod || '14d' });
  if (sentryProject) params.set('project', sentryProject);
  const url = 'https://sentry.io/api/0/organizations/' + encodeURIComponent(sentryOrg) + '/issues/?' + params;
  const res = await fetch(url, { headers: { Authorization: 'Bearer ' + sentryToken, Accept: 'application/json' } });
  if (!res.ok) fail('Sentry fetch failed: HTTP ' + res.status + ' ' + await res.text());
  return await res.json();
}

function buildGitHubSearchQuery(issue) {
  const terms = ['repo:' + owner + '/' + repo, 'is:issue'];
  if (issue.shortId || issue.id) terms.push(JSON.stringify(issue.shortId || issue.id));
  if (issue.title) terms.push(JSON.stringify(issue.title));
  if (issue.culprit) terms.push(JSON.stringify(issue.culprit));
  return terms.join(' ');
}

async function searchGitHub(q) {
  const url = 'https://api.github.com/search/issues?q=' + encodeURIComponent(q) + '&per_page=5';
  const res = await fetch(url, { headers: { Authorization: 'Bearer ' + githubToken, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } });
  if (!res.ok) fail('GitHub search failed: HTTP ' + res.status + ' ' + await res.text());
  return await res.json();
}

function summarizeSentryIssue(issue) {
  return {
    title: '[Sentry] ' + (issue.title || issue.culprit || issue.shortId || issue.id),
    url: issue.permalink || issue.url || '',
    shortId: issue.shortId || issue.id || '',
    count: issue.count || 'unknown',
    level: issue.level || 'unknown',
    project: (issue.project && issue.project.slug) || sentryProject || 'unknown',
    culprit: issue.culprit || '',
    firstSeen: issue.firstSeen || '',
    lastSeen: issue.lastSeen || '',
  };
}

async function createGitHubIssue(summary) {
  const body = ['Sentry issue detected', '', 'Sentry: ' + summary.url, 'Sentry ID: ' + summary.shortId, 'Project: ' + summary.project, 'Level: ' + summary.level, 'Events: ' + summary.count, 'Environment: ' + sentryEnvironment, 'First seen: ' + (summary.firstSeen || 'unknown'), 'Last seen: ' + (summary.lastSeen || 'unknown'), 'Culprit: ' + (summary.culprit || 'unknown'), '', 'Next steps:', '- Investigate stack trace in Sentry.', '- Reproduce if possible.', '- Fix on a separate branch.', '- Link the fixing PR back to this issue and the Sentry issue.'].join('\n');
  const res = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/issues', { method: 'POST', headers: { Authorization: 'Bearer ' + githubToken, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }, body: JSON.stringify({ title: summary.title, body, labels: ['sentry', 'bug', 'triage'] }) });
  if (!res.ok) fail('GitHub issue create failed: HTTP ' + res.status + ' ' + await res.text());
  return await res.json();
}

async function postGitHubComment(issueNumber, body) {
  const res = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber + '/comments', { method: 'POST', headers: { Authorization: 'Bearer ' + githubToken, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }, body: JSON.stringify({ body }) });
  if (!res.ok) fail('GitHub report comment failed: HTTP ' + res.status + ' ' + await res.text());
  return await res.json();
}

async function writeReport(target, content) {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, 'utf8');
}

function buildReport(data) {
  const lines = ['# Sentry Triage Report', '', 'Generated: ' + new Date().toISOString(), 'Repository: ' + owner + '/' + repo, 'Sentry org: ' + sentryOrg, 'Sentry project: ' + (sentryProject || 'all visible projects'), 'Environment: ' + sentryEnvironment, 'Threshold: ' + threshold, '', 'Fetched issues: ' + data.issues.length, 'Candidates over threshold: ' + data.candidates.length, ''];
  if (data.reportRows.length === 0) lines.push('No candidates found.');
  for (const row of data.reportRows) {
    lines.push('## ' + row.status.toUpperCase() + ': ' + row.summary.title);
    lines.push('');
    lines.push('- Sentry: ' + (row.summary.url || 'unknown'));
    lines.push('- Sentry ID: ' + row.summary.shortId);
    lines.push('- Project: ' + row.summary.project);
    lines.push('- Level: ' + row.summary.level);
    lines.push('- Events: ' + row.summary.count);
    lines.push('- First seen: ' + (row.summary.firstSeen || 'unknown'));
    lines.push('- Last seen: ' + (row.summary.lastSeen || 'unknown'));
    lines.push('- Action: ' + row.action);
    if (row.github.length) lines.push('- GitHub: ' + row.github.join(', '));
    lines.push('');
  }
  return lines.join('\n');
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const raw = argv[i];
    if (!raw.startsWith('--')) continue;
    const key = raw.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[key] = 'true';
    else out[key] = argv[++i];
  }
  return out;
}

function fail(message) { console.error(message); process.exit(1); }
