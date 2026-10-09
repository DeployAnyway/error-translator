import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { spawnSync } from "node:child_process";
import { diagnoseError, renderDiagnosis } from "@deployanyway/error-translator";

test("real filesystem failure remains intact while cause guidance explains the underlying failure", () => {
  let cause;
  try {
    readFileSync(
      new URL("./definitely-missing-v1-fixture.txt", import.meta.url),
    );
  } catch (error) {
    cause = error;
  }
  const original = new Error("Could not load application config", { cause });
  const result = diagnoseError(original);
  assert.equal(result.original, original);
  assert.equal(original.cause, cause);
  assert.equal(result.chain[1].code, "ENOENT");
  assert.match(result.chain[1].translation.suggestions.join(" "), /path/);
  assert.equal(result.chain[0].translation.code, "UNKNOWN");
  assert.equal(result.chain[0].stack, undefined);
  assert.doesNotThrow(() => JSON.stringify(result));
  assert.doesNotMatch(JSON.stringify(result), /"original"/);
  assert.match(renderDiagnosis(result), /Caused by: Error \[ENOENT\]/);
  assert.equal(
    diagnoseError(original, { includeStack: true }).chain[1].stack,
    cause.stack,
  );
});
test("bounded cycle traversal and unknown primitive causes remain explicit", () => {
  const cycle = new Error("outer");
  cycle.cause = cycle;
  const result = diagnoseError(cycle);
  assert.equal(result.stopped, "cycle");
  assert.equal(result.chain.length, 1);
  assert.match(renderDiagnosis(result), /cycle/);
  assert.doesNotThrow(() => JSON.stringify(result));
  const chain = new Error("one", {
    cause: new Error("two", { cause: new Error("three") }),
  });
  assert.equal(diagnoseError(chain, { maxDepth: 2 }).stopped, "depth-limit");
  for (const cause of [
    null,
    42,
    false,
    ["odd"],
    { message: "Unknown", code: "CUSTOM" },
  ]) {
    const diagnosed = diagnoseError(new Error("wrapper", { cause }));
    assert.equal(diagnosed.chain.length, 2);
    assert.equal(diagnosed.chain[1].translation.title, "Unrecognized error");
  }
  assert.equal(diagnoseError("ENOENT").chain[0].translation.code, "ENOENT");
  assert.match(
    renderDiagnosis(
      diagnoseError(
        { name: "TypeError", message: "Bad value", stack: "private stack" },
        { includeStack: true, mode: "rubber-duck" },
      ),
    ),
    /Original stack/,
  );
});
test("invalid options/root/rendering fail and diagnose CLI handles JSON cause input", () => {
  for (const maxDepth of [0, 33, 1.5, "2"])
    assert.throws(() => diagnoseError("x", { maxDepth }), RangeError);
  assert.throws(() => diagnoseError("x", { includeStack: 1 }), TypeError);
  assert.throws(() => diagnoseError("x", null), TypeError);
  assert.throws(() => diagnoseError({}), TypeError);
  assert.throws(() => renderDiagnosis({ chain: [] }), TypeError);
  const run = (args) =>
    spawnSync(process.execPath, ["bin/cli.js", ...args], {
      input: JSON.stringify({
        name: "Error",
        message: "Fetch failed",
        cause: { code: "ECONNREFUSED", message: "No listener" },
      }),
      encoding: "utf8",
    });
  const cli = run(["--diagnose", "--json"]);
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(JSON.parse(cli.stdout).chain[1].code, "ECONNREFUSED");
  assert.equal(run(["--diagnose", "--batch"]).status, 2);
  assert.equal(run(["--max-depth", "2"]).status, 2);
});
