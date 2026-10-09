# 1.0.0 — Explain This Failure: real errors and cause chains

Explain real Node.js errors and cause chains with practical debugging checks. The stack trace has chosen violence; the duck brought context.

diagnoseError/renderDiagnosis and diagnostic CLI flags are additive. Explicit code precedence and existing catalog/batch behavior remain. Use diagnosis.original to hand the same error to your existing handler; serializing a diagnosis omits that reference.

Install: `npm install @deployanyway/error-translator@1.0.0`

See README for runnable API/CLI examples, supported formats, defaults and limitations. Existing catalogs remain. Core APIs require no online services. Root demo: https://deployanyway.github.io/.

Validation is recorded in the v1 release report after final CI and installed-package verification.
