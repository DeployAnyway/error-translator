import api = require("@deployanyway/error-translator");
api.translateErrors(["ENOENT", new Error("TypeError")], {
  mode: "rubber-duck",
});
// @ts-expect-error invalid literal
api.translateError("x", { mode: "pirate" });
