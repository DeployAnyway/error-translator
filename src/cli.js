import { parseArgs } from "node:util";
import { URL } from "node:url";
import { readFileSync } from "node:fs";
import {
  translateError,
  renderTranslation,
  translateErrors,
  listErrors,
  errorCatalog,
} from "./index.js";

import { readStdin } from "./input.js";

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      json: { type: "boolean" },
      batch: { type: "boolean" },
      list: { type: "boolean" },
      catalog: { type: "boolean" },
      mode: { type: "string", default: "plain" },
    },
  });
  if (values.help) {
    console.log(
      'Usage: error-translator <error code or quoted message> [--json] [--mode plain|rubber-duck]\n\nTranslate errors into human-readable guidance. Without arguments, read stdin (256 KiB). --batch reads a JSON array of 1–100 errors. --list lists supported codes. --catalog prints all explanations and checks.\n\nOptions:\n  -h, --help     Show help\n  -v, --version  Show version\n  --json         Print a structured JSON result\n  --mode plain|rubber-duck   Keep useful guidance; add duck commentary\n\nExamples:\n  error-translator ECONNREFUSED\n  error-translator "TypeError: value is not a function" --json\n\nExit codes: 0 translation/help/version; 2 invalid arguments.',
    );
  } else if (values.version) {
    console.log(
      JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
      ).version,
    );
  } else if (values.catalog) {
    if (positionals.length || values.batch || values.list)
      throw new TypeError(
        "--catalog does not accept input, --batch or --list.",
      );
    const catalog = errorCatalog({ mode: values.mode });
    console.log(
      values.json
        ? JSON.stringify(catalog, null, 2)
        : catalog
            .map((item) => item.code + " — " + renderTranslation(item))
            .join("\n\n---\n\n"),
    );
  } else if (values.list) {
    if (positionals.length || values.batch)
      throw new TypeError("--list does not accept input or --batch.");
    console.log(
      values.json ? JSON.stringify(listErrors()) : listErrors().join("\n"),
    );
  } else {
    const text = positionals.length ? positionals.join(" ") : await readStdin();
    const result = values.batch
      ? translateErrors(JSON.parse(text), { mode: values.mode })
      : translateError(text, { mode: values.mode });
    console.log(
      values.json
        ? JSON.stringify(result, null, 2)
        : Array.isArray(result)
          ? result.map(renderTranslation).join("\n\n---\n\n")
          : renderTranslation(result),
    );
  }
} catch (error) {
  console.error(
    `error-translator: ${error.message}\nRun with --help for usage.`,
  );
  process.exitCode = 2;
}
