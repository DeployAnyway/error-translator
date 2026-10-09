import { extraDefinitions } from "./extra-definitions.js";
// Keep technical guidance here so contributors can add errors without changing logic.
export const definitions = {
  ...extraDefinitions,
  ECONNREFUSED: {
    title: "Connection refused",
    explanation:
      "The application tried to connect to a service, but nothing accepted the connection.",
    likelyCauses: [
      "The service is not running",
      "The host or port is incorrect",
      "A firewall actively rejected the connection",
    ],
    suggestions: [
      "Confirm that the service is running and listening on the configured host and port.",
      "Check connection settings and firewall rules.",
    ],
  },
  ENOENT: {
    title: "File or directory not found",
    explanation:
      "The application tried to use a filesystem path that does not exist.",
    likelyCauses: [
      "The path is misspelled",
      "The file was moved or deleted",
      "A relative path is being resolved from an unexpected working directory",
    ],
    suggestions: [
      "Check the full path and the current working directory.",
      "Create the required file or directory if it should exist.",
    ],
  },
  EADDRINUSE: {
    title: "Address already in use",
    explanation:
      "The application tried to listen on an address and port that another listener already uses.",
    likelyCauses: [
      "Another instance of the application is running",
      "Another service uses the same port",
    ],
    suggestions: [
      "Identify the process using the port before stopping it.",
      "Choose a different available port or stop the duplicate instance.",
    ],
  },
  MODULE_NOT_FOUND: {
    title: "Module not found",
    explanation:
      "Node.js could not resolve a module requested by the application.",
    likelyCauses: [
      "A dependency is missing",
      "The module path is incorrect",
      "A dependency references a missing module",
    ],
    suggestions: [
      "Check the missing module name and the require stack.",
      "Install declared dependencies with npm install and verify local paths.",
    ],
  },
  ERR_MODULE_NOT_FOUND: {
    title: "ES module not found",
    explanation: "Node.js could not resolve an imported ES module.",
    likelyCauses: [
      "A dependency is missing",
      "The import path or file extension is incorrect",
    ],
    suggestions: [
      "Install declared dependencies and verify the import path.",
      "Include the file extension for relative Node.js ES module imports.",
    ],
  },
  TypeError: {
    title: "Unexpected value type",
    explanation:
      "An operation received a value it cannot use, such as calling a non-function or reading a property of undefined.",
    likelyCauses: [
      "A value is null or undefined",
      "A value has a different type than expected",
    ],
    suggestions: [
      "Inspect the value at the first relevant line in the stack trace.",
      "Check inputs and return values before accessing properties or calling functions.",
    ],
  },
};
