# Sentry Error Logging

This repository is mapped to the Sentry project `claude-skills-setup` in organization `park-company-dy`.

The project now includes a default public Sentry DSN so unhandled runtime errors can be sent to Sentry without manually looking up the DSN on each PC. You can override it with `SENTRY_DSN` in local or deployment environment variables.

Local values you may set:

```env
SENTRY_DSN=https://a1ced3aa495ac6654be29f6bc8d6d6ef@o4511540280360960.ingest.us.sentry.io/4511654050070528
SENTRY_PROJECT=claude-skills-setup
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0
```

Run `pip install -r requirements.txt` after pulling this change so `sentry-sdk` is installed.
