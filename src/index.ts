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
 * Check if value is a result value
 * @param value Value to check
 * @returns If value is a result value
 */
export function isResult<T, E = unknown>(
  value: unknown
): value is Result<T, E> {
  return isOk<T>(value) || isErr<E>(value);
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
  value: unknown,
  fn: F
): ReturnType<F> | void {
  if (isResult<T>(value)) {
    if (isOk(value)) {
      return fn(value.Ok) as ReturnType<F>;
    }
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
export function map<T, U, E = unknown>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (isOk(result)) {
    return { Ok: fn(result.Ok) };
  }
  return result;
}

/**
 * Retrieve the value from an ok result
 *
 * Will throw if `result` is an err result
 *
 * @param result Result to unwrap the value from
 * @returns The underlying value of an ok result
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function unwrap<T, E>(result: Ok<T>): T;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function unwrap<T, E>(result: Err<E>): never;
export function unwrap<T, E = unknown>(result: Result<T, E>): T {
  if (isResult<T, E>(result)) {
    if (isErr(result)) {
      throw new Error(
        `Unwrapping an error result: ${JSON.stringify(result.Err)}`
      );
    }

    return result.Ok;
  }

  throw new Error(`Unwrapping a non result value: ${JSON.stringify(result)}`);
}
