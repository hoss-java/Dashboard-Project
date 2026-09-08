// src/components/utils/resolveValue.ts

/**
 * Resolves a value by checking a priority list of candidates.
 * Returns the first defined (non-undefined, non-null) value.
 * If all are undefined, returns the final fallback.
 * 
 * @param candidates - Values to check in priority order
 * @returns First defined value or undefined
 */
export function resolveValue<T>(...candidates: (T | undefined | null)[]): T | undefined {
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      return candidate;
    }
  }
  return undefined;
}
