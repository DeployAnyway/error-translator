export interface ErrorRecord {
  code?: string;
  name?: string;
  message?: string;
  stack?: string;
  cause?: unknown;
}
export type ErrorInput = string | Error | ErrorRecord;
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

export function errorCatalog(options?: TranslationOptions): Translation[];
export interface DiagnosisOptions extends TranslationOptions {
  maxDepth?: number;
  includeStack?: boolean;
}
export interface DiagnosticLayer {
  depth: number;
  name: string;
  message: string;
  code?: string;
  translation: Translation;
  stack?: string;
}
export interface Diagnosis {
  readonly original: ErrorInput;
  chain: DiagnosticLayer[];
  stopped: "complete" | "cycle" | "depth-limit";
  truncated: boolean;
}
export function diagnoseError(
  error: ErrorInput,
  options?: DiagnosisOptions,
): Diagnosis;
export function renderDiagnosis(result: Diagnosis): string;
