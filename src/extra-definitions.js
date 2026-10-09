// Original explanations and practical checks; no automatic remediation.
export const extraDefinitions = {
  EACCES: {
    title: "Permission denied",
    explanation: "The process lacks permission for the requested operation.",
    likelyCauses: [
      "A directory or file belongs to another account",
      "The application runs under a restricted service identity",
    ],
    suggestions: [
      "Check the service identity and permissions on each parent directory.",
      "Grant only the access the application needs; avoid running everything as administrator.",
    ],
  },
  EPERM: {
    title: "Operation not permitted",
    explanation:
      "The operating system rejected an operation even though the target may exist.",
    likelyCauses: [
      "A protected resource or locked file",
      "An operation forbidden by the current platform or identity",
    ],
    suggestions: [
      "Inspect the operation, ownership and platform restrictions.",
      "Close the process holding the resource and retry only if the operation is intended.",
    ],
  },
  EEXIST: {
    title: "Target already exists",
    explanation:
      "A creation operation requires a new target, but that target already exists.",
    likelyCauses: ["A repeated initialization step", "A filename collision"],
    suggestions: [
      "Check the target before creating it and make initialization idempotent.",
      "Use a distinct name rather than deleting an existing target blindly.",
    ],
  },
  ENOTDIR: {
    title: "Expected a directory",
    explanation:
      "A path component used as a directory is actually another kind of file.",
    likelyCauses: [
      "A file appears in the middle of the path",
      "A configuration value points to the wrong target",
    ],
    suggestions: [
      "Inspect each path component and its type.",
      "Correct the directory configuration before retrying.",
    ],
  },
  EISDIR: {
    title: "Expected a file",
    explanation: "The operation received a directory where it expected a file.",
    likelyCauses: [
      "The filename is missing from a configured path",
      "A directory was passed to a file operation",
    ],
    suggestions: [
      "Check the complete path and inspect the target type.",
      "Use the appropriate directory API when working with directories.",
    ],
  },
  ENOTEMPTY: {
    title: "Directory is not empty",
    explanation:
      "A directory operation requires an empty target, but entries remain.",
    likelyCauses: [
      "Generated files remain in the directory",
      "Another process is still writing files",
    ],
    suggestions: [
      "List the remaining entries and identify their owner.",
      "Remove only confirmed disposable content or choose a new directory.",
    ],
  },
  EMFILE: {
    title: "Too many open files",
    explanation: "The process has exhausted its available file descriptors.",
    likelyCauses: [
      "Handles are not closed",
      "Too many files or sockets are opened concurrently",
    ],
    suggestions: [
      "Close handles in cleanup paths and bound concurrent work.",
      "Inspect descriptor usage before considering a higher process limit.",
    ],
  },
  ENFILE: {
    title: "System file table exhausted",
    explanation: "The system cannot allocate another file handle.",
    likelyCauses: [
      "Many processes hold open files",
      "The host has reached a system resource limit",
    ],
    suggestions: [
      "Inspect host-wide handle usage and identify runaway processes.",
      "Reduce concurrency and resolve leaks before changing system limits.",
    ],
  },
  ENOSPC: {
    title: "No space left",
    explanation:
      "The filesystem cannot allocate the space or resources required by the operation.",
    likelyCauses: [
      "The volume is full",
      "Filesystem quotas or resource limits are exhausted",
    ],
    suggestions: [
      "Check free space, quotas and the volume receiving the write.",
      "Clear verified disposable data and investigate rapid growth.",
    ],
  },
  EROFS: {
    title: "Read-only filesystem",
    explanation: "The target filesystem does not permit writes.",
    likelyCauses: [
      "A read-only container mount",
      "A protected or recovery-mounted volume",
    ],
    suggestions: [
      "Inspect mount settings and choose an intended writable data location.",
      "Change mount configuration only when the write is part of the deployment design.",
    ],
  },
  EBUSY: {
    title: "Resource busy",
    explanation:
      "A resource cannot complete the requested operation while another operation holds it.",
    likelyCauses: [
      "A mounted or open resource",
      "A concurrent operation has not finished",
    ],
    suggestions: [
      "Identify the process or operation holding the resource.",
      "Wait for its completion or coordinate ownership instead of looping without a limit.",
    ],
  },
  EXDEV: {
    title: "Cross-device operation",
    explanation:
      "An operation such as a rename crosses filesystem boundaries that it cannot cross directly.",
    likelyCauses: [
      "Temporary and destination files live on different volumes",
      "A container mount creates a filesystem boundary",
    ],
    suggestions: [
      "Create temporary files on the destination filesystem when atomic rename is required.",
      "Use an intentional copy-and-cleanup workflow when atomic movement is unnecessary.",
    ],
  },
  EPIPE: {
    title: "Broken pipe",
    explanation:
      "The application wrote to a stream whose receiving end has closed.",
    likelyCauses: [
      "A downstream command exited",
      "A peer disconnected before the write completed",
    ],
    suggestions: [
      "Handle stream errors and stop producing data when the consumer closes.",
      "Distinguish an expected pipeline close from an unexpected connection failure.",
    ],
  },
  ECONNRESET: {
    title: "Connection reset",
    explanation:
      "A connection was forcibly closed while the application was using it.",
    likelyCauses: [
      "The remote peer closed the connection",
      "An intermediary interrupted the session",
    ],
    suggestions: [
      "Inspect peer logs, timeout settings and recent connection changes.",
      "Retry only safe operations with a bounded backoff and avoid duplicate side effects.",
    ],
  },
  ETIMEDOUT: {
    title: "Operation timed out",
    explanation:
      "A connection or operation did not finish within its allowed time.",
    likelyCauses: [
      "An unreachable or slow peer",
      "A timeout shorter than the expected operation",
    ],
    suggestions: [
      "Check network reachability, service latency and the configured timeout.",
      "Use bounded retries only for operations that are safe to repeat.",
    ],
  },
  ENOTFOUND: {
    title: "Name lookup failed",
    explanation:
      "The requested hostname could not be resolved by the lookup operation.",
    likelyCauses: [
      "A misspelled hostname",
      "Resolver configuration or lookup resources failed",
    ],
    suggestions: [
      "Check the exact hostname and DNS behavior from the same runtime environment.",
      "Do not assume every lookup failure proves the hostname does not exist.",
    ],
  },
  EAI_AGAIN: {
    title: "Temporary name lookup failure",
    explanation: "Name resolution reported a temporary failure.",
    likelyCauses: [
      "A resolver is temporarily unavailable",
      "A transient network or DNS problem",
    ],
    suggestions: [
      "Check the resolver and network from the affected host.",
      "Apply bounded retry with backoff and report persistent failures.",
    ],
  },
  EADDRNOTAVAIL: {
    title: "Local address unavailable",
    explanation:
      "The application tried to use an address that is not available on the local system.",
    likelyCauses: [
      "Binding to an address on another host",
      "An interface address changed",
    ],
    suggestions: [
      "Inspect local interfaces and the configured bind address.",
      "Use the intended local interface rather than a remote destination address.",
    ],
  },
  ECONNABORTED: {
    title: "Connection aborted",
    explanation: "A connection was aborted before the operation completed.",
    likelyCauses: [
      "A connection failure during setup or transfer",
      "A local or intermediary cancellation",
    ],
    suggestions: [
      "Inspect the failure timing and both ends of the connection.",
      "Handle cancellation separately from application errors when appropriate.",
    ],
  },
  ENETUNREACH: {
    title: "Network unreachable",
    explanation: "The host has no usable route to the requested network.",
    likelyCauses: [
      "Missing route or disconnected interface",
      "Network isolation in a container or host",
    ],
    suggestions: [
      "Inspect connectivity and routing in the application environment.",
      "Confirm the destination network is intended to be reachable.",
    ],
  },
  EHOSTUNREACH: {
    title: "Host unreachable",
    explanation:
      "The destination host could not be reached through the available network path.",
    likelyCauses: [
      "The destination is unavailable",
      "Routing or filtering blocks the path",
    ],
    suggestions: [
      "Check the destination address and routing from the affected host.",
      "Inspect network policy rather than disabling protection blindly.",
    ],
  },
  EINVAL: {
    title: "Invalid argument",
    explanation: "The operating system rejected an argument to the operation.",
    likelyCauses: [
      "A value outside the operation contract",
      "A platform-specific unsupported value",
    ],
    suggestions: [
      "Inspect the syscall and the exact values passed to it.",
      "Validate values against the API and platform requirements.",
    ],
  },
  ABORT_ERR: {
    title: "Operation aborted",
    explanation: "An operation was cancelled through an abort mechanism.",
    likelyCauses: [
      "An AbortSignal was triggered",
      "A caller timeout cancelled the operation",
    ],
    suggestions: [
      "Inspect who owns the abort controller and when cancellation occurred.",
      "Treat expected cancellation separately and clean up resources.",
    ],
  },
  ERR_INVALID_ARG_TYPE: {
    title: "Wrong argument type",
    explanation: "A Node API received an argument of the wrong type.",
    likelyCauses: [
      "A missing or incorrect value",
      "An unexpected return type passed to another API",
    ],
    suggestions: [
      "Read the parameter name in the error and inspect its actual value.",
      "Validate the argument at the boundary where it enters your application.",
    ],
  },
  ERR_INVALID_ARG_VALUE: {
    title: "Invalid argument value",
    explanation: "An argument has a value the API does not accept.",
    likelyCauses: [
      "A valid type with an unsupported value",
      "An invalid option combination",
    ],
    suggestions: [
      "Inspect the named parameter and documented accepted values.",
      "Validate options before calling the API.",
    ],
  },
  ERR_OUT_OF_RANGE: {
    title: "Value outside allowed range",
    explanation: "A numeric or size argument falls outside the API range.",
    likelyCauses: [
      "An invalid offset or length",
      "A computed limit exceeds the supported bounds",
    ],
    suggestions: [
      "Check the reported minimum and maximum and the calculation producing the value.",
      "Add boundary tests for zero, limits and oversized input.",
    ],
  },
  ERR_HTTP_HEADERS_SENT: {
    title: "Headers already sent",
    explanation:
      "The server tried to change headers after the response headers had been sent.",
    likelyCauses: [
      "Two code paths respond to the same request",
      "An asynchronous callback runs after the response is complete",
    ],
    suggestions: [
      "Trace every response path and return after sending the response.",
      "Coordinate asynchronous work so only one path owns the final response.",
    ],
  },
  ERR_HTTP_INVALID_STATUS_CODE: {
    title: "Invalid HTTP status",
    explanation: "The response status code is outside the accepted API range.",
    likelyCauses: [
      "An undefined value becomes a status",
      "A business code is mistaken for an HTTP status",
    ],
    suggestions: [
      "Check the status value before assigning or sending it.",
      "Keep internal result codes separate from HTTP status codes.",
    ],
  },
  ERR_INVALID_URL: {
    title: "Invalid URL",
    explanation: "The URL parser cannot interpret the supplied URL.",
    likelyCauses: [
      "A malformed absolute URL",
      "A relative URL without a valid base",
    ],
    suggestions: [
      "Inspect the original input and supply an explicit base for relative paths.",
      "Validate user-controlled URL inputs before making requests.",
    ],
  },
  ERR_PACKAGE_PATH_NOT_EXPORTED: {
    title: "Package path not exported",
    explanation: "A package exports map does not expose the requested subpath.",
    likelyCauses: [
      "Importing an internal package file",
      "A dependency changed its public entry points",
    ],
    suggestions: [
      "Inspect the package exports and use a documented public entry.",
      "Upgrade or pin compatible dependencies instead of relying on private paths.",
    ],
  },
  ERR_PACKAGE_IMPORT_NOT_DEFINED: {
    title: "Package import not defined",
    explanation: "A package imports map has no matching internal specifier.",
    likelyCauses: [
      "A missing imports mapping",
      "A specifier is used outside its intended package scope",
    ],
    suggestions: [
      "Check package.json imports and the exact specifier.",
      "Keep internal import aliases inside the package that defines them.",
    ],
  },
  ERR_INVALID_PACKAGE_CONFIG: {
    title: "Invalid package configuration",
    explanation: "Node could not use the package configuration.",
    likelyCauses: ["Malformed package.json", "An invalid configuration field"],
    suggestions: [
      "Read the named package.json and validate its JSON and relevant fields.",
      "Check the first configuration error before reinstalling dependencies.",
    ],
  },
  ERR_UNKNOWN_FILE_EXTENSION: {
    title: "Unknown module file extension",
    explanation:
      "The module loader does not recognize the file extension in this context.",
    likelyCauses: [
      "An unsupported file type is imported",
      "The required build or loader is missing",
    ],
    suggestions: [
      "Check the imported extension and the runtime module configuration.",
      "Compile to a supported format or use a documented loader setup.",
    ],
  },
  ERR_IMPORT_ATTRIBUTE_MISSING: {
    title: "Required import attribute missing",
    explanation: "A module import requires an attribute that was not provided.",
    likelyCauses: [
      "A JSON import lacks the required type attribute",
      "An import was copied from a different runtime version",
    ],
    suggestions: [
      "Check the module type and import syntax for your supported Node version.",
      "Use the required import attributes or an appropriate file-reading API.",
    ],
  },
  ERR_STREAM_WRITE_AFTER_END: {
    title: "Write after stream end",
    explanation: "Data was written after the writable stream had ended.",
    likelyCauses: [
      "A late callback writes to a closed stream",
      "Multiple owners end and write the same stream",
    ],
    suggestions: [
      "Trace the stream lifecycle and coordinate the writer with completion.",
      "Test delayed callbacks and ensure end is called once work is complete.",
    ],
  },
  ERR_STREAM_DESTROYED: {
    title: "Stream destroyed",
    explanation: "An operation used a stream after it had been destroyed.",
    likelyCauses: [
      "A prior error destroyed the stream",
      "Cleanup ran while work was still pending",
    ],
    suggestions: [
      "Inspect the original stream error and cancellation timing.",
      "Stop dependent work when the stream closes or is destroyed.",
    ],
  },
  ERR_SOCKET_BAD_PORT: {
    title: "Invalid socket port",
    explanation: "A socket port value is not accepted by the API.",
    likelyCauses: [
      "A malformed environment variable",
      "A number outside the port range",
    ],
    suggestions: [
      "Validate and parse the port configuration before creating the connection.",
      "Do not substitute a silent default for a visibly invalid production setting.",
    ],
  },
  SyntaxError: {
    title: "Invalid JavaScript syntax",
    explanation: "The parser cannot interpret the source or input syntax.",
    likelyCauses: [
      "Malformed JavaScript or JSON",
      "Syntax unsupported by the current runtime",
    ],
    suggestions: [
      "Read the first reported location and inspect nearby delimiters and tokens.",
      "Confirm the input format and runtime version before changing unrelated code.",
    ],
  },
  ReferenceError: {
    title: "Name is not available",
    explanation:
      "An expression refers to a binding that is not available in its current scope or initialization state.",
    likelyCauses: [
      "A misspelled or out-of-scope variable",
      "Access before initialization",
    ],
    suggestions: [
      "Inspect the referenced name and its scope at the reported line.",
      "Check initialization order and add a focused regression test.",
    ],
  },
  RangeError: {
    title: "Value exceeds a permitted range",
    explanation:
      "An operation received a value outside its allowed range or exhausted a range-related resource.",
    likelyCauses: [
      "An invalid numeric size or index",
      "Excessive recursion or allocation",
    ],
    suggestions: [
      "Read the exact message to distinguish numeric bounds from stack exhaustion.",
      "Inspect boundary values and recursion termination rather than treating every RangeError alike.",
    ],
  },
};
