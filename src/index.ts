/**
 * A successful result
 *
 * @template T - The value type of the `Ok` result.
 */
type Ok<T> = { Ok: T };

/**
 * An errored result
 *
 * @template E - The error type of the `Err` result.
 */
type Err<E> = { Err: E };

/**
 * The result of a failable operation
 *
 * @template T - The value type of the `Ok` result.
 * @template E - The error type of the `Err` result.
 */
export type Result<T, E = unknown> = Ok<T> | Err<E>;

/**
 * Creates an `Ok` result value.
 *
 * @template T - The value type of the `Ok` result.
 * @param {T} value - The successful value.
 * @returns {Ok<T>} An `Ok` result with the successful value.
 */
export function ok<T>(value: T): Ok<T> {
  return { Ok: value };
}

/**
 * Create an error result value
 *
 * @template E - The error type of the `Err` result.
 * @param value Value to wrap
 * @returns An error wrapped value result
 */
export function err<E = unknown>(value: E): Err<E> {
  return { Err: value };
}

/**
 * Check if value is a result
 *
 * @param value Value to check
 * @returns If value is a result value
 */
export function isResult(value: unknown): value is Result<unknown, unknown> {
  return isOk<unknown>(value) || isErr<unknown>(value);
}

/**
 * Check if value is an ok result
 *
 * @template T - The value type of the `Ok` result.
 * @param value Value to check
 * @returns If value is an ok result
 */
export function isOk<T>(value: unknown): value is Ok<T> {
  const keys = Object.keys(value as object);

  return keys.includes("Ok") && keys.length === 1;
}

/**
 * Check if value is an err result
 *
 * @template E - The error type of the `Err` result.
 * @param value Value to check
 * @returns If value is an err result
 */
export function isErr<E = unknown>(value: unknown): value is Err<E> {
  const keys = Object.keys(value as object);

  return keys.includes("Err") && keys.length === 1;
}

/**
 * Conditionally run function if value is an ok result
 *
 * @template T - The value type of the `Ok` result.
 * @param value Value to check
 * @param fn Function to run if value is an ok result
 */
export function ifOk<T>(
  value: Result<T>,
  fn: (value: T) => void | Promise<void>
): ReturnType<typeof fn> | void {
  if (isOk<T>(value)) {
    return fn(value.Ok) as ReturnType<typeof fn>;
  }
}

/**
 * Conditionally run ok and err functions if value is an ok or err result
 *
 * @template T - The value type of the `Ok` result.
 * @template E - The error type of the `Err` result.
 * @param value Value to check
 * @param okFn Function to run if value is an ok result
 * @param errFn Function to run if value is an err result
 */
export function ifOkOr<T>(
  value: Result<T>,
  okFn: (value: T) => void | Promise<void>,
  errFn: (value: unknown) => void | Promise<void>
) {
  return isOk(value) ? okFn(value.Ok) : errFn(value.Err);
}

/**
 * Map ok result to new value
 *
 * @template T - The value type of the `Ok` result.
 * @template U - The value type of the new `Ok` result.
 * @template E - The error type of the new `Err` result.
 * @param result Result to map
 * @param fn Mapping function to run on ok result.  The `value` parameter will be of type `T`.
 * @returns Result containing mapped value
 */
export function map<T, U, E = unknown>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (isOk(result)) {
    return ok(fn(result.Ok));
  }

  return result;
}

/**
 * Retrieve the value from an `Err` result.
 *
 * This override documents that an error is thrown when unwrapping an `Err` result.
 *
 * @param result An `Err` result value
 * @returns Never
 */
export function unwrap(result: Result<never, unknown>): never;

/**
 * Retrieve the value from an `Ok` result.
 *
 * This override is required for type safety for `Ok` results.
 *
 * @template T - The value type of the `Ok` result.
 * @param result Result to unwrap the value from
 * @returns The successful value of `T` result
 */
export function unwrap<T>(result: Result<T, never>): T;

/**
 * Retrieve the value from an ok result
 *
 * Will throw if `result` is an err result
 *
 * @template T - The value type of the `Ok` result.
 * @template E - The error type of the `Err` result.
 * @param result Result to unwrap the value from
 * @returns The underlying value of an ok result
 */
export function unwrap<T, E = unknown>(result: Result<T, E>): T {
  if (!isResult(result)) {
    throw new Error(`Unwrapping a non-result value: ${JSON.stringify(result)}`);
  }

  if (isErr(result)) {
    throw new Error(
      `Unwrapping an error result: ${JSON.stringify(result.Err)}`
    );
  }

  return result.Ok;
}
