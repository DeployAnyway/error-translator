# error-translator

> **Version 0.3.0:** install from npm with Node 22.13+ or Node 24. See MIGRATION.md for changes from 0.2.0.

[![npm version](https://img.shields.io/npm/v/%40deployanyway%2Ferror-translator)](https://www.npmjs.com/package/@deployanyway/error-translator)
[![CI](https://github.com/DeployAnyway/error-translator/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/DeployAnyway/error-translator/actions/workflows/ci.yml)

Plain-English Node.js error explanations and debugging tips, because the stack trace has chosen violence.

```text
Connection refused

What happened:
The application tried to connect to a service, but nothing accepted the connection.

Likely causes:
- The service is not running
- The host or port is incorrect
- A firewall actively rejected the connection

Try:
- Confirm that the service is running and listening on the configured host and port.
- Check connection settings and firewall rules.
```

## Installation

Available on npm. Requires Node 22 or later.
You can also run from source with Node 22 or 24:

```sh
git clone https://github.com/DeployAnyway/error-translator.git
cd error-translator
git checkout main
npm ci
node bin/cli.js ECONNREFUSED
```

Install from npm:

```sh
npm install @deployanyway/error-translator
```

## Quick start

```js
import {
  translateError,
  renderTranslation,
} from "@deployanyway/error-translator";

const result = translateError("ECONNREFUSED");
console.log(result.suggestions);
console.log(renderTranslation(result));
```

## CLI example

```sh
node bin/cli.js "TypeError: value is not a function" --json
```

Run with npx: `npx @deployanyway/error-translator ECONNREFUSED`.

## API and options

### `translateError(error, { mode = 'plain' } = {})`

Accepts a nonempty string, an Error, or an object with string `code`, `name`,
or `message` fields. Returns a fresh structured object with `code`, `title`,
`explanation`, `likelyCauses` (string array), `suggestions` (string array), and `mode`.

An explicit code takes precedence, followed by a recognized name, then a
case-sensitive whole-word match in the message. Unknown errors return general
guidance with code `UNKNOWN`, or preserve an explicit unknown code.
Invalid input throws TypeError; unsupported modes throw RangeError.
Modes: `plain` (default) and `rubber-duck`, which preserves the guidance and adds commentary.

### `renderTranslation(result)`

Returns readable text. Does not print, mutate the result, or exit the process.
Invalid result shapes throw TypeError.

### Built-in errors

| Code/name            | Guidance                                   |
| -------------------- | ------------------------------------------ |
| ECONNREFUSED         | Service availability, host, port, firewall |
| ENOENT               | Missing paths and working directories      |
| EADDRINUSE           | Port conflicts and duplicate instances     |
| MODULE_NOT_FOUND     | CommonJS dependencies and paths            |
| ERR_MODULE_NOT_FOUND | ES module dependencies, paths, extensions  |
| TypeError            | Unexpected types and null/undefined values |

Translations describe likely causes, not a diagnosis. Keep the original error
and stack trace for context. No AI API or remote service is used.

## CLI reference

`error-translator <code or message> [options]`

| Option            | Behavior                         |
| ----------------- | -------------------------------- |
| `--help`, `-h`    | Show usage                       |
| `--version`, `-v` | Show package version             |
| `--json`          | Print structured JSON            |
| `--mode plain`    | Select plain or rubber-duck mode |

Quote messages containing spaces or shell punctuation. Use `--` before a message
beginning with a dash. No stdin support is included in the MVP.
Exit code 0 means translation/help/version succeeded, including unknown errors.
Exit code 2 means invalid arguments. The library never exits.

## Examples and development

```sh
npm ci
node examples/basic.js
npm test
npm run lint
npm run format:check
npm pack --dry-run
```

ES modules, Node's test runner, zero production dependencies. CI checks Node 22
and 24. Error definitions live in `src/definitions.js`; API and renderer in
`src/index.js`; CLI in `bin/cli.js`. Only runtime files, README, MIT license,
changelog, and package metadata are packaged.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Accurate, actionable guidance and tests
are welcome.

## License

[MIT](LICENSE).

## More from DeployAnyway

**Tools for developers who probably know better.**

- [error-translator](https://github.com/DeployAnyway/error-translator)
- [excuse-js](https://github.com/DeployAnyway/excuse-js)
- [doggo-log](https://github.com/DeployAnyway/doggo-log)
- [ship-it-meter](https://github.com/DeployAnyway/ship-it-meter)
- [bro-say](https://github.com/DeployAnyway/bro-say)

## Rubber-duck translations

Keep the debugging guidance, add workplace-safe rubber-duck commentary. Plain output remains the default.

```sh
npx @deployanyway/error-translator ECONNREFUSED --mode rubber-duck
```

API (import the named functions from this package):

```js
translateError("ENOENT", { mode: "rubber-duck" });
```

## Ordered error batches and pipes

```js
import { translateErrors, listErrors } from "@deployanyway/error-translator";
const results = translateErrors(["ENOENT", { code: "ECONNREFUSED" }], {
  mode: "rubber-duck",
});
console.log(results[0].suggestions);
console.log(listErrors());
```

Batches accept 1–100 errors in order, fail on malformed entries and return independent arrays. This is deterministic guidance, not diagnosis. Unknown errors remain unknown: keep the original stack.

```sh
echo "ECONNREFUSED" | node bin/cli.js --mode rubber-duck
node bin/cli.js --batch --json < errors.json
node bin/cli.js --list --json
```

Without arguments, read UTF-8 stdin (maximum 256 KiB). Arguments take precedence. --batch expects a JSON array; --json emits an array of results. --list catalogs supported codes. Status 0 means translated, including unknown errors; status 2 means invalid input.

## Run from source

```sh
git clone --branch main https://github.com/DeployAnyway/error-translator.git
cd error-translator
npm ci
npm run build
node bin/cli.js --help
```

## Candidate quality standard

Version 0.3 provides useful declaration types, ESM/CommonJS exports, installed-archive checks, and coverage gates (90% statements/lines/functions, 85% branches). CI covers Linux Node 22/24 and Windows/macOS Node 24. Node 22.13+ is required. No runtime dependencies, telemetry or network requests.

From a source checkout: npm ci, npm run build, npm run coverage, npm run test:types, npm run verify:package. Pack verification installs a temporary local archive and checks module entries, types, executable and offline npm exec.

[Contribution guide](CONTRIBUTING.md) · [Conduct](CODE_OF_CONDUCT.md) · [Security](SECURITY.md) · [Roadmap](ROADMAP.md) · [Migration](MIGRATION.md).

**Tools for developers who probably know better.** Software nobody requested, built with questionable priorities, and shipped with absolute confidence!
