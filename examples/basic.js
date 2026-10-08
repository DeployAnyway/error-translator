import {
  translateError,
  renderTranslation,
} from "@deployanyway/error-translator";

const error = Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:3000"), {
  code: "ECONNREFUSED",
});
console.log(renderTranslation(translateError(error)));
