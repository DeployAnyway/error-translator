import { URL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { translateError, renderTranslation } from "../src/index.js";
test("duck commentary preserves every actionable suggestion and plain default", () => {
  for (const code of [
    "ECONNREFUSED",
    "ENOENT",
    "EADDRINUSE",
    "MODULE_NOT_FOUND",
    "ERR_MODULE_NOT_FOUND",
    "TypeError",
    "CUSTOM",
    "__proto__",
    "constructor",
  ]) {
    const plain = translateError(code);
    const duck = translateError(code, { mode: "rubber-duck" });
    assert.deepEqual(duck.suggestions, plain.suggestions);
    assert.deepEqual(duck.likelyCauses, plain.likelyCauses);
    assert.ok(duck.explanation.startsWith(plain.explanation));
    assert.notEqual(duck.explanation, plain.explanation);
    assert.ok(renderTranslation(duck).includes(duck.explanation));
  }
  const cli = spawnSync(
    process.execPath,
    ["bin/cli.js", "ENOENT", "--mode", "rubber-duck", "--json"],
    { cwd: new URL("..", import.meta.url), encoding: "utf8" },
  );
  assert.equal(cli.status, 0);
  assert.deepEqual(
    JSON.parse(cli.stdout),
    translateError("ENOENT", { mode: "rubber-duck" }),
  );
});
