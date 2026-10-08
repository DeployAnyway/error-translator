import { definitions } from "./definitions.js";
const duckLines = {
  ECONNREFUSED: "Your app knocked. The service has apparently gone for coffee.",
  ENOENT: "The file is playing hide-and-seek. It is currently winning.",
  EADDRINUSE: "Two servers reserved the same chair. Only one gets to sit.",
  MODULE_NOT_FOUND:
    "The dependency missed roll call. Check its invitation to node_modules.",
  ERR_MODULE_NOT_FOUND:
    "The module took a wrong turn. Extensions are street signs, not decorations.",
  TypeError: "JavaScript received a surprise guest and forgot how to behave.",
};

/**
 * Translate a nonempty string, Error, or error-like object with a code/name/message.
 * Explicit codes take precedence over names and message matching.
 * @param {string | Error | {code?: string, name?: string, message?: string}} error
 * @param {{mode?: 'plain' | 'rubber-duck'}} [options]
 * @returns {{code: string, title: string, explanation: string, likelyCauses: string[], suggestions: string[], mode: string}}
 */
export function translateError(error, options = {}) {
  if (!options || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Options must be an object.");
  }
  const mode = options.mode ?? "plain";
  if (!["plain", "rubber-duck"].includes(mode))
    throw new RangeError("Supported modes: plain, rubber-duck.");
  let code;
  let name;
  let message;
  if (typeof error === "string") {
    message = error.trim();
  } else if (error && typeof error === "object" && !Array.isArray(error)) {
    for (const field of ["code", "name", "message"]) {
      if (error[field] !== undefined && typeof error[field] !== "string") {
        throw new TypeError(`Error ${field} must be a string.`);
      }
    }
    code = error.code?.trim();
    name = error.name?.trim();
    message = error.message?.trim();
  } else {
    throw new TypeError(
      "Provide a nonempty error string or error-like object.",
    );
  }
  if (!code && !name && !message)
    throw new TypeError(
      "Provide a nonempty error string or error-like object.",
    );
  const matched =
    code ||
    (Object.hasOwn(definitions, name ?? "") ? name : undefined) ||
    Object.keys(definitions).find((key) =>
      new RegExp(`\\b${key}\\b`).test(message ?? ""),
    );
  const definition = Object.hasOwn(definitions, matched ?? "")
    ? definitions[matched]
    : undefined;
  const fallback = {
    title: "Unrecognized error",
    explanation: "No built-in translation matches this error yet.",
    likelyCauses: [],
    suggestions: [
      "Read the original error and inspect the first relevant line in its stack trace.",
      "Check the documentation for the component that reported the error.",
    ],
  };
  const result = definition ?? fallback;
  return {
    code: matched ?? "UNKNOWN",
    ...result,
    explanation:
      mode === "rubber-duck"
        ? `${result.explanation} ${duckLines[matched] ?? "The duck recommends investigating before blaming the compiler."}`
        : result.explanation,
    likelyCauses: [...result.likelyCauses],
    suggestions: [...result.suggestions],
    mode,
  };
}

/** Render a structured translation as readable text without logging or exiting. */
export function renderTranslation(result) {
  if (
    !result ||
    typeof result.title !== "string" ||
    typeof result.explanation !== "string" ||
    !Array.isArray(result.likelyCauses) ||
    !Array.isArray(result.suggestions) ||
    ![...result.likelyCauses, ...result.suggestions].every(
      (item) => typeof item === "string",
    )
  ) {
    throw new TypeError("Provide a structured translation result.");
  }
  return [
    result.title,
    `What happened:\n${result.explanation}`,
    ...(result.likelyCauses.length
      ? [
          `Likely causes:\n${result.likelyCauses.map((item) => `- ${item}`).join("\n")}`,
        ]
      : []),
    ...(result.suggestions.length
      ? [`Try:\n${result.suggestions.map((item) => `- ${item}`).join("\n")}`]
      : []),
  ].join("\n\n");
}
