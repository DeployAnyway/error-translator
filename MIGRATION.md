# 0.3.0 migration

Node 22.13+ is required. Existing core APIs remain available; TypeScript declarations and CommonJS exports are new. The CLI now lives in src/cli.js behind the same executable path. Input/stdout behavior for new options is documented in README.

Install 0.3.0 with npm. Seeds and exact humorous wording are version-specific. Do not treat jokes or heuristic scores as production evidence.

## 0.3.0 to 0.4.0

46 distinct error definitions with explanations, causes and practical checks; original duck commentary for each; structured errorCatalog API and --catalog CLI.

Default behavior is retained except that the expanded error catalog now recognizes additional errors. New rotation and release-plan features are opt-in.
