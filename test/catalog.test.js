import { URL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { listErrors, translateError } from "../src/index.js";
test("expanded technical catalog covers practical errors without pretending to recognize unknown codes", () => {
  assert.equal(listErrors().length, 46);
  for (const code of listErrors()) {
    const result = translateError({ code });
    assert.equal(result.code, code);
    assert.ok(result.likelyCauses.length >= 2);
    assert.ok(result.suggestions.length >= 2);
    result.suggestions.pop();
    assert.ok(translateError(code).suggestions.length >= 2);
  }
  assert.match(
    translateError("ERR_HTTP_HEADERS_SENT").suggestions.join(" "),
    /response/,
  );
  assert.match(translateError("ENOSPC").suggestions.join(" "), /space/);
  assert.match(translateError("EACCES").suggestions.join(" "), /permissions/);
  assert.equal(
    translateError({ code: "CUSTOM", message: "ENOENT" }).title,
    "Unrecognized error",
  );
  assert.equal(
    translateError("ERR_STREAM_WRITE_AFTER_END: write after end").code,
    "ERR_STREAM_WRITE_AFTER_END",
  );
});
import { errorCatalog } from "../src/index.js";
import { spawnSync } from "node:child_process";
test("structured catalogs are independent and CLI JSON agrees with API", () => {
  const catalog = errorCatalog({ mode: "rubber-duck" });
  assert.equal(catalog.length, 46);
  catalog[0].suggestions.pop();
  assert.equal(errorCatalog()[0].suggestions.length, 2);
  assert.throws(() => errorCatalog({ mode: "unknown" }), RangeError);
  const run = (args) =>
    spawnSync(process.execPath, ["bin/cli.js", ...args], {
      cwd: new URL("..", import.meta.url),
      encoding: "utf8",
    });
  let result = run(["--catalog", "--json"]);
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), errorCatalog());
  assert.match(run(["--catalog"]).stdout, /EACCES/);
  assert.equal(run(["--catalog", "ENOENT"]).status, 2);
});
