export type ErrorInput =
  string | Error | { code?: string; name?: string; message?: string };
export interface TranslationOptions {
  mode?: "plain" | "rubber-duck";
}
export interface Translation {
  code: string;
  title: string;
  explanation: string;
  likelyCauses: string[];
  suggestions: string[];
  mode: "plain" | "rubber-duck";
}
export function translateError(
  error: ErrorInput,
  options?: TranslationOptions,
): Translation;
export function translateErrors(
  errors: ErrorInput[],
  options?: TranslationOptions,
): Translation[];
export function renderTranslation(result: Translation): string;
export function listErrors(): string[];
