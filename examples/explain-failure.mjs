import { readFileSync } from "node:fs";
import { diagnoseError, renderDiagnosis } from "@deployanyway/error-translator";
const file = process.argv[2] ?? "missing-config.json";
try {
  readFileSync(file, "utf8");
  console.log("Config read successfully.");
} catch (cause) {
  const failure = new Error("Application config could not be read", { cause });
  console.error(renderDiagnosis(diagnoseError(failure)));
  process.exitCode = 1;
}
