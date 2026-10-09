import { translateError, renderTranslation } from "./index.js";

/** Snapshot a bounded cause chain; preserve the original without serializing it. */
export function diagnoseError(error, options = {}) {
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new TypeError("Options must be an object.");
  const maxDepth = options.maxDepth ?? 8,
    includeStack = options.includeStack ?? false;
  if (!Number.isInteger(maxDepth) || maxDepth < 1 || maxDepth > 32)
    throw new RangeError("maxDepth must be an integer from 1 to 32.");
  if (typeof includeStack !== "boolean")
    throw new TypeError("includeStack must be a boolean.");
  // Validate the root using the established translation contract.
  translateError(error, options);
  const seen = new Set(),
    chain = [];
  let current = error,
    stopped = "complete";
  while (current !== undefined) {
    if (chain.length === maxDepth) {
      stopped = "depth-limit";
      break;
    }
    if (current !== null && typeof current === "object") {
      if (seen.has(current)) {
        stopped = "cycle";
        break;
      }
      seen.add(current);
    }
    const object =
      current !== null && typeof current === "object" && !Array.isArray(current)
        ? current
        : undefined;
    const raw = typeof current === "string" ? current : object?.message;
    const message = typeof raw === "string" ? raw : String(current);
    const name = typeof object?.name === "string" ? object.name : "Error";
    const code = typeof object?.code === "string" ? object.code : undefined;
    const translation = translateError(
      { name, message, ...(code ? { code } : {}) },
      options,
    );
    chain.push({
      depth: chain.length,
      name,
      message,
      ...(code ? { code } : {}),
      translation,
      ...(includeStack && typeof object?.stack === "string"
        ? { stack: object.stack }
        : {}),
    });
    current = object?.cause;
  }
  const result = { chain, stopped, truncated: stopped !== "complete" };
  Object.defineProperty(result, "original", {
    value: error,
    enumerable: false,
  });
  return result;
}
export function renderDiagnosis(result) {
  if (
    !result ||
    !Array.isArray(result.chain) ||
    !result.chain.length ||
    !["complete", "cycle", "depth-limit"].includes(result.stopped)
  )
    throw new TypeError("Provide a diagnosis result.");
  return (
    result.chain
      .map(
        (item, index) =>
          `${index === 0 ? "Failure" : "Caused by"}: ${item.name}${item.code ? " [" + item.code + "]" : ""}: ${item.message}\n${renderTranslation(item.translation)}${item.stack ? "\n\nOriginal stack:\n" + item.stack : ""}`,
      )
      .join("\n\n---\n\n") +
    (result.truncated ? `\n\nCause traversal stopped: ${result.stopped}.` : "")
  );
}
