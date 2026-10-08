import { URL } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { Readable } from "node:stream";
import { readStdin } from "../src/input.js";
const cli = (args, input = "", extraEnv = {}) => {
  const env = { ...process.env, ...extraEnv };
  if (!Object.hasOwn(extraEnv, "NO_COLOR")) delete env.NO_COLOR;
  return spawnSync(process.execPath, ["bin/cli.js", ...args], {
    cwd: new URL("..", import.meta.url),
    input,
    encoding: "utf8",
    env,
  });
};
test("stdin handles UTF-8 buffers and string chunks, refuses TTY/empty/oversized input", async () => {
  assert.equal(
    await readStdin(Readable.from([Buffer.from("你好"), Buffer.from(" 👋\n")])),
    "你好 👋",
  );
  assert.equal(await readStdin(Readable.from([" hello "])), "hello");
  const tty = Readable.from([]);
  tty.isTTY = true;
  await assert.rejects(readStdin(tty), /Pipe/);
  await assert.rejects(readStdin(Readable.from([" \n"])), /nonempty/);
  await assert.rejects(
    readStdin(Readable.from([Buffer.alloc(262145)])),
    /256 KiB/,
  );
});
import { translateErrors, listErrors, translateError } from "../src/index.js";
test("ordered batches preserve independent results and catalog arrays", () => {
  const input = [
    "ENOENT",
    { code: "ECONNREFUSED" },
    new Error("TypeError: nope"),
  ];
  assert.deepEqual(
    translateErrors(input),
    input.map((x) => translateError(x)),
  );
  const a = listErrors();
  a.length = 0;
  assert.ok(listErrors().includes("ENOENT"));
  const results = translateErrors(["ENOENT", "ENOENT"], {
    mode: "rubber-duck",
  });
  results[0].suggestions.length = 0;
  assert.ok(results[1].suggestions.length);
  for (const bad of [null, {}, [], Array(101).fill("x")])
    assert.throws(() => translateErrors(bad), RangeError);
  assert.throws(() => translateErrors(["ENOENT", null]), TypeError);
  const sparse = Array(1);
  assert.throws(() => translateErrors(sparse), TypeError);
});
test("CLI stdin, argument precedence, batches and catalog JSON", () => {
  assert.equal(JSON.parse(cli(["--json"], "ENOENT").stdout).code, "ENOENT");
  assert.equal(
    JSON.parse(cli(["TypeError", "--json"], "ENOENT").stdout).code,
    "TypeError",
  );
  const batch = cli(
    ["--batch", "--json"],
    JSON.stringify(["ENOENT", "ECONNREFUSED"]),
  );
  assert.equal(batch.status, 0);
  assert.equal(JSON.parse(batch.stdout).length, 2);
  assert.ok(cli(["--batch"], '["ENOENT","TypeError"]').stdout.includes("---"));
  assert.ok(cli(["--list"]).stdout.includes("ENOENT"));
  assert.ok(JSON.parse(cli(["--list", "--json"]).stdout).includes("ENOENT"));
  for (const args of [["--list", "ENOENT"], ["--list", "--batch"], ["--batch"]])
    assert.equal(cli(args, "oops").status, 2);
  assert.equal(cli([], "x".repeat(262145)).status, 2);
});
