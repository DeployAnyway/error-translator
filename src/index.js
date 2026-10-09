import { definitions } from "./definitions.js";
export const listErrors = () => Object.keys(definitions);

/** Translate an ordered, bounded batch without mutating input. */
export function translateErrors(errors, options = {}) {
  if (!Array.isArray(errors) || errors.length < 1 || errors.length > 100)
    throw new RangeError("Provide 1–100 errors.");
  return Array.from(errors, (error) => translateError(error, options));
}
const duckLines = {
  EACCES: "The file has a guest list. Your process is not on it.",
  EPERM: "The operating system has declined your ambitious proposal.",
  EEXIST: "The target is already here and has not agreed to be replaced.",
  ENOTDIR: "That hallway is actually a cupboard.",
  EISDIR: "You asked for one file and received the whole neighborhood.",
  ENOTEMPTY: "The directory still has roommates.",
  EMFILE: "Your process opened every door and forgot to close them.",
  ENFILE: "The host has run out of chairs for file handles.",
  ENOSPC: "The disk has eaten the final snack.",
  EROFS: "This filesystem is a museum: look, but do not rearrange.",
  EBUSY: "The resource is in another meeting.",
  EXDEV: "The rename has reached the border and needs a different passport.",
  EPIPE: "The audience left before your stream finished the speech.",
  ECONNRESET: "The other end hung up without the usual pleasantries.",
  ETIMEDOUT: "The operation is late and has not brought a believable excuse.",
  ENOTFOUND: "The hostname is not answering roll call.",
  EAI_AGAIN: "DNS requests a brief intermission, not eternal optimism.",
  EADDRNOTAVAIL: "That address does not live on this machine.",
  ECONNABORTED: "The connection left before the conversation was finished.",
  ENETUNREACH: "The packet has no road to the destination.",
  EHOSTUNREACH:
    "The route exists; the destination is still playing hard to reach.",
  EINVAL: "The argument has failed the entrance interview.",
  ABORT_ERR: "The caller pulled the emergency stop. Ask why before restarting.",
  ERR_INVALID_ARG_TYPE:
    "The parameter ordered a string and received a surprise guest.",
  ERR_INVALID_ARG_VALUE: "The type is correct. Its life choices are not.",
  ERR_OUT_OF_RANGE: "The number wandered beyond the approved fence.",
  ERR_HTTP_HEADERS_SENT:
    "The response left the station. You cannot redecorate its headers now.",
  ERR_HTTP_INVALID_STATUS_CODE:
    "That number is not a useful mood for an HTTP response.",
  ERR_INVALID_URL:
    "The address has syntax ambitions but no navigable destination.",
  ERR_PACKAGE_PATH_NOT_EXPORTED: "You are trying the package staff entrance.",
  ERR_PACKAGE_IMPORT_NOT_DEFINED:
    "The alias has not been introduced to this package.",
  ERR_INVALID_PACKAGE_CONFIG:
    "The package instructions have become abstract art.",
  ERR_UNKNOWN_FILE_EXTENSION: "The loader does not speak this file dialect.",
  ERR_IMPORT_ATTRIBUTE_MISSING:
    "The import arrived without its required name badge.",
  ERR_STREAM_WRITE_AFTER_END:
    "The stream said goodbye. Your callback is still talking.",
  ERR_STREAM_DESTROYED: "The stream has retired. Please respect its notice.",
  ERR_SOCKET_BAD_PORT: "The port number did not pass the harbor inspection.",
  SyntaxError: "The parser has found punctuation with questionable intentions.",
  ReferenceError: "That name is not available for comment in this scope.",
  RangeError: "The value or call stack has climbed over the fence.",
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
        ? `${result.explanation} ${Object.hasOwn(duckLines, matched ?? "") ? duckLines[matched] : "The duck recommends investigating before blaming the compiler."}`
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

/** Read the built-in guidance as independent structured records. */
export function errorCatalog(options = {}) {
  return listErrors().map((code) => translateError({ code }, options));
}
