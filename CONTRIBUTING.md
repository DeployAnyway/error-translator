# Contributing

Welcome! Useful first, funny second. Keep guidance accurate and workplace-safe.

Use Node 22 or 24. Fork the repository, create a feature branch, and run:

```sh
npm ci
npm run lint
npm run format:check
npm test
```

Add error definitions to `src/definitions.js`. Include a clear explanation,
likely causes, actionable suggestions, and tests for matching and edge cases.
Avoid recommending blanket permission changes or stopping unidentified processes.
Run `npm run format` before opening a PR. Describe the behavior change and checks.

Open an issue to discuss new modes or larger API changes first. No AI service,
telemetry, or production dependency is required for the MVP.
