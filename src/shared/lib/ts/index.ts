/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Cast value type to T
 * @param value
 */
export function cast<T = unknown>(value: any): T {
  return value;
}
