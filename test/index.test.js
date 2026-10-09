import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import {
  translateError,
  renderTranslation,
} from "@deployanyway/error-translator";

const cliPath = fileURLToPath(new URL("../bin/cli.js", import.meta.url));
const cli = (...args) =>
  spawnSync(process.execPath, [cliPath, ...args], { encoding: "utf8" });
for (const code of [
  "ECONNREFUSED",
  "ENOENT",
  "EADDRINUSE",
  "MODULE_NOT_FOUND",
  "ERR_MODULE_NOT_FOUND",
  "TypeError",
]) {
  test(`translates ${code} from code and message`, () => {
    for (const input of [code, { code }, `Error: ${code}: details`]) {
      const result = translateError(input);
      assert.equal(result.code, code);
      assert.equal(result.mode, "plain");
      assert.ok(result.explanation.length > 20);
      assert.ok(result.likelyCauses.length);
      assert.ok(result.suggestions.length);
    }
  });
}
test("native errors and explicit code precedence", () => {
  assert.equal(translateError(new TypeError("bad value")).code, "TypeError");
  assert.equal(
    translateError({ code: "ENOENT", name: "TypeError" }).code,
    "ENOENT",
  );
  assert.equal(
    translateError({ code: "CUSTOM", message: "ENOENT" }).code,
    "CUSTOM",
  );
});
test("unknown and prototype names fall back safely", () => {
  for (const input of [
    "something failed",
    "XENOENTY",
    { code: "toString" },
    { code: "__proto__" },
  ]) {
    const result = translateError(input);
    assert.equal(result.title, "Unrecognized error");
    assert.deepEqual(result.likelyCauses, []);
    assert.ok(renderTranslation(result).includes("Try:"));
  }
});
test("deterministic fresh results", () => {
  const original = translateError("ENOENT");
  assert.deepEqual(original, translateError("ENOENT"));
  original.suggestions.length = 0;
  assert.ok(translateError("ENOENT").suggestions.length);
});
test("invalid input, options, and modes", () => {
  for (const input of [
    null,
    undefined,
    42,
    [],
    {},
    "",
    "  ",
    { code: 5 },
    { message: false },
  ])
    assert.throws(() => translateError(input), TypeError);
  for (const options of [null, [], "plain"])
    assert.throws(() => translateError("ENOENT", options), TypeError);
  assert.throws(() => translateError("ENOENT", { mode: "pirate" }), RangeError);
  assert.throws(() => renderTranslation({}), TypeError);
});
test("text sections contain actionable guidance", () => {
  const text = renderTranslation(translateError("ECONNREFUSED"));
  assert.ok(text.startsWith("Connection refused\n\nWhat happened:"));
  assert.ok(text.includes("Likely causes:\n- The service is not running"));
  assert.ok(text.includes("Try:\n- Confirm"));
});
test("CLI text, JSON, help, version, unknown errors", () => {
  assert.equal(cli("ENOENT").status, 0);
  assert.ok(cli("ENOENT").stdout.includes("File or directory not found"));
  assert.equal(
    JSON.parse(cli("TypeError: x is not a function", "--json").stdout).code,
    "TypeError",
  );
  assert.equal(cli("--help").status, 0);
  assert.ok(cli("--help").stdout.includes("Usage:"));
  assert.equal(cli("--version").stdout.trim(), "1.0.0");
  assert.equal(cli("custom error").status, 0);
});
test("CLI invalid arguments exit 2 with stderr", () => {
  for (const args of [
    [],
    ["--wat"],
    ["--mode"],
    ["ENOENT", "--mode", "pirate"],
    [" "],
  ]) {
    const result = cli(...args);
    assert.equal(result.status, 2);
    assert.equal(result.stdout, "");
    assert.ok(result.stderr.includes("--help"));
  }
});
