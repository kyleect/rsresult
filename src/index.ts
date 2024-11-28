export type Ok<T> = { Ok: T };
export type Err<E = unknown> = { Err: E };
export type Result<T, E = unknown> = Ok<T> | Err<E>;

/**
 * Create an ok result value
 * @param value Value to wrap
 * @returns An ok wrapped value result
 */
export function ok<T>(value: T): Result<T> {
  return { Ok: value };
}

/**
 * Create an error result value
 * @param value Value to wrap
 * @returns An error wrapped value result
 */
export function err<E = unknown>(value: E): Result<never, E> {
  return { Err: value };
}

/**
 * Check if value is an ok result
 * @param value Value to check
 * @returns If value is an ok result
 */
export function isOk<T>(value: unknown): value is Ok<T> {
  const keys = Object.keys(value as object);

  return keys.includes("Ok") && keys.length === 1;
}

/**
 * Check if value is an err result
 * @param value Value to check
 * @returns If value is an err result
 */
export function isErr<E = unknown>(value: unknown): value is Err<E> {
  const keys = Object.keys(value as object);

  return keys.includes("Err") && keys.length === 1;
}

/**
 * Conditionally run function if value is an ok result
 * @param value Value to check
 * @param fn Function to run if value is an ok result
 */
export function ifOk<T, F extends (value: T) => void | Promise<void>>(
  value: Result<T>,
  fn: F
): ReturnType<F> | void {
  if (isOk(value)) {
    return fn(value.Ok) as ReturnType<F>;
  }

  return undefined as ReturnType<F>; // Explicitly cast `undefined` to match the type
}

/**
 * Conditionally run ok and err functions if value is an ok or err result
 * @param value Value to check
 * @param okFn Function to run if value is an ok result
 * @param errFn Function to run if value is an err result
 */
export function ifOkOr<
  T,
  F extends (value: T) => void | Promise<void>,
  E extends (value: unknown) => void | Promise<void>,
>(value: Result<T>, okFn: F, errFn: E) {
  if (isOk(value)) {
    return okFn(value.Ok);
  } else {
    return errFn(value.Err);
  }
}

/**
 * Map ok result to new value
 * @param result Result to map
 * @param fn Mapping function to run on ok result
 * @returns Result containing mapped value
 */
export function mapResult<T, U, E = unknown>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (isOk(result)) {
    return { Ok: fn(result.Ok) };
  }
  return result;
}
