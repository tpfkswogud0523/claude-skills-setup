# Sentry Error Logging

This repository is mapped to the Sentry project `claude-skills-setup` in organization `park-company-dy`.

Runtime errors are sent to Sentry when `SENTRY_DSN` is set in the local or deployment environment. The real DSN should stay out of GitHub commits.

Required local values:

```env
SENTRY_DSN=your-project-dsn
SENTRY_PROJECT=claude-skills-setup
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0
```

Run `pip install -r requirements.txt` after pulling this change so `sentry-sdk` is installed.
