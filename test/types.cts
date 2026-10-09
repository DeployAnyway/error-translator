import api = require("@deployanyway/error-translator");
api.translateErrors(["ENOENT", new Error("TypeError")], {
  mode: "rubber-duck",
});
// @ts-expect-error invalid literal
api.translateError("x", { mode: "pirate" });
api.errorCatalog({ mode: "plain" })[0].suggestions;
import diagnosis = require("@deployanyway/error-translator");
diagnosis.diagnoseError(new Error("failed")).original;
