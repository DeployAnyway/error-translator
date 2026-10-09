import * as api from "@deployanyway/error-translator";
api.translateErrors(["ENOENT", new Error("TypeError")], {
  mode: "rubber-duck",
});
// @ts-expect-error invalid literal
api.translateError("x", { mode: "pirate" });
import { errorCatalog } from "@deployanyway/error-translator";
errorCatalog({ mode: "rubber-duck" })[0].suggestions;
