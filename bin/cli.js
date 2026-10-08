#!/usr/bin/env node
import { parseArgs } from "node:util";
import { URL } from "node:url";
import { readFileSync } from "node:fs";
import { translateError, renderTranslation } from "../src/index.js";

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      json: { type: "boolean" },
      mode: { type: "string", default: "plain" },
    },
  });
  if (values.help) {
    console.log(
      'Usage: error-translator <error code or quoted message> [--json] [--mode plain]\n\nTranslate errors into human-readable guidance.\n\nOptions:\n  -h, --help     Show help\n  -v, --version  Show version\n  --json         Print a structured JSON result\n  --mode plain   Translation mode (MVP: plain only)\n\nExamples:\n  error-translator ECONNREFUSED\n  error-translator "TypeError: value is not a function" --json\n\nExit codes: 0 translation/help/version; 2 invalid arguments.',
    );
  } else if (values.version) {
    console.log(
      JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
      ).version,
    );
  } else {
    const result = translateError(positionals.join(" "), { mode: values.mode });
    console.log(
      values.json ? JSON.stringify(result, null, 2) : renderTranslation(result),
    );
  }
} catch (error) {
  console.error(
    `error-translator: ${error.message}\nRun with --help for usage.`,
  );
  process.exitCode = 2;
}
