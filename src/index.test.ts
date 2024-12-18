import { test, expect, describe, vi, expectTypeOf } from "vitest";
import * as RsResult from ".";

/**
 * Test suite for parsing a JSON string into an RsResult object with an unknown
 * type.
 */
describe("result parsed from json", () => {
  const expectedResult = RsResult.ok(123);
  const inputJson = JSON.stringify(expectedResult);
  const result: unknown = JSON.parse(inputJson);

  test("is equal to expected result", () => {
    expect(result).toStrictEqual(expectedResult);
  });

  test("has correct type", () => {
    expectTypeOf(result).toMatchTypeOf<unknown>();
  });

  describe("with extra keys", () => {
    const inputJson = JSON.stringify(
      Object.assign({}, RsResult.ok(123), { extraKey: true })
    );

    const result: RsResult.Result<number, never> = JSON.parse(inputJson);

    test("is not result", () => {
      expect(RsResult.isResult(result)).toBeFalsy();
    });

    test("is not ok", () => {
      expect(RsResult.isOk(result)).toBeFalsy();
    });
  });

  test("is result", () => {
    expect(RsResult.isResult(result)).toBeTruthy();
  });

  test("has correct type with isResult", () => {
    if (RsResult.isResult(result)) {
      expectTypeOf(result).toMatchTypeOf<RsResult.Result<unknown, unknown>>();
    } else {
      test.fails("Expected input to be a result");
    }
  });

  test("is ok", () => {
    expect(RsResult.isOk(result)).toBeTruthy();
  });

  test("is not err", () => {
    expect(RsResult.isErr(result)).toBeFalsy();
  });

  test("maps to new value", () => {
    expect(
      RsResult.map(
        // @ts-expect-error Test
        result,
        (value) =>
          // @ts-expect-error Test
          value * 2
      )
    ).toStrictEqual(RsResult.ok(246));
  });

  test("unwraps with value", () => {
    expect(
      RsResult.unwrap(
        // @ts-expect-error Test
        result
      )
    ).toBe(123);
  });

  describe("ifOk", () => {
    test("runs callback", () => {
      const fn = vi.fn((value) => value);

      RsResult.ifOk(
        // @ts-expect-error Test
        result,
        fn
      );

      expect(fn).toBeCalledWith(123);
    });
  });

  describe("ifOkOr", () => {
    test("runs callback", () => {
      const okFn = vi.fn();
      const errFn = vi.fn();

      RsResult.ifOkOr(
        // @ts-expect-error Test
        result,
        okFn,
        errFn
      );

      expect(okFn).toBeCalledWith(123);
      expect(errFn).not.toBeCalled();
    });
  });
});

describe("ok input", () => {
  const expectedResult: RsResult.Ok<number> = RsResult.ok(123);
  const inputJson = JSON.stringify(expectedResult);
  const inputResult: RsResult.Ok<number> = JSON.parse(inputJson);

  test("is equal to expected result", () => {
    expect(inputResult).toStrictEqual(expectedResult);
  });

  test("has correct type (Result)", () => {
    expectTypeOf(expectedResult).toMatchTypeOf<
      RsResult.Result<number, never>
    >();

    expectTypeOf(inputResult).toMatchTypeOf<RsResult.Result<number, never>>();
  });

  test("has correct type (Ok)", () => {
    expectTypeOf(expectedResult).toMatchTypeOf<RsResult.Ok<number>>();

    expectTypeOf(inputResult).toMatchTypeOf<RsResult.Ok<number>>();
  });

  describe("with extra keys", () => {
    const inputJson = JSON.stringify(
      Object.assign({}, RsResult.ok(123), { extraKey: true })
    );
    const inputResult: RsResult.Result<number, never> = JSON.parse(inputJson);

    test("is not ok", () => {
      expect(RsResult.isOk(inputResult)).toBeFalsy();
    });
  });

  test("is result", () => {
    expect(RsResult.isResult(inputResult)).toBeTruthy();
  });

  test("has correct type with isResult", () => {
    if (RsResult.isResult(inputResult)) {
      expectTypeOf(inputResult).toMatchTypeOf<
        RsResult.Result<unknown, unknown>
      >();
    } else {
      test.fails("Expected input to be a result");
    }
  });

  test("is ok", () => {
    expect(RsResult.isOk(inputResult)).toBeTruthy();
  });

  test("is not err", () => {
    expect(RsResult.isErr(inputResult)).toBeFalsy();
  });

  test("maps to new value", () => {
    expect(RsResult.map(inputResult, (value) => value * 2)).toStrictEqual(
      RsResult.ok(246)
    );
  });

  test("does not map to error", () => {
    expect(RsResult.mapErr(inputResult, (value) => value)).toBe(inputResult);
  });

  test("unwraps with value", () => {
    expect(RsResult.unwrap(inputResult)).toBe(123);
  });

  test("expecting returns value", () => {
    expect(RsResult.expect(inputResult, "Custom error message")).toBe(123);
  });

  test("unwrapping error throws", () => {
    try {
      const result = RsResult.unwrapErr(inputResult);

      expectTypeOf(result).toMatchTypeOf<never>();

      // Ensure that unwrapErr throws
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(new Error(`Unwrapping an ok result: 123`));
    }
  });

  describe("ifOk", () => {
    test("runs callback", () => {
      const fn = vi.fn((value) => value);

      RsResult.ifOk(inputResult, fn);

      expect(fn).toBeCalledWith(123);
    });
  });

  describe("ifOkOr", () => {
    test("runs callback", () => {
      const okFn = vi.fn();
      const errFn = vi.fn();

      RsResult.ifOkOr(inputResult, okFn, errFn);

      expect(okFn).toBeCalledWith(123);
      expect(errFn).not.toBeCalled();
    });
  });
});

describe("err input", () => {
  const expectedResult = RsResult.err("error message");
  const inputJson = JSON.stringify(expectedResult);
  const inputResult: RsResult.Result<never, string> = JSON.parse(inputJson);

  test("is equal to expected result", () => {
    expect(inputResult).toStrictEqual(expectedResult);
  });

  test("has correct type (Result)", () => {
    expectTypeOf(expectedResult).toMatchTypeOf<
      RsResult.Result<never, string>
    >();
  });

  test("has correct type (Err)", () => {
    expectTypeOf(expectedResult).toMatchTypeOf<RsResult.Err<string>>();
  });

  describe("with extra keys", () => {
    const inputJson = JSON.stringify(
      Object.assign({}, RsResult.err("error message"), { extraKey: true })
    );
    const inputResult: RsResult.Err<string> = JSON.parse(inputJson);

    test("is not err", () => {
      expect(RsResult.isErr(inputResult)).toBeFalsy();
    });
  });

  test("is result", () => {
    expect(RsResult.isResult(inputResult)).toBeTruthy();
  });

  test("has correct type with isResult", () => {
    if (RsResult.isResult(inputResult)) {
      expectTypeOf(inputResult).toMatchTypeOf<
        RsResult.Result<unknown, unknown>
      >();
    } else {
      test.fails("Expected input to be a result");
    }
  });

  test("is err", () => {
    expect(RsResult.isErr(inputResult)).toBeTruthy();
  });

  test("is not ok", () => {
    expect(RsResult.isOk(inputResult)).toBeFalsy();
  });

  test("doesn't map", () => {
    const newResult = RsResult.map(inputResult, (value) => value * 2);

    expect(Object.is(inputResult, newResult)).toBeTruthy();
  });

  test("does map to new error", () => {
    const newError = RsResult.mapErr(inputResult, (value) =>
      value.length.toString()
    );

    expect(newError).toStrictEqual(RsResult.err("13"));
  });

  test("unwrapping throws", () => {
    try {
      const result = RsResult.unwrap(inputResult);

      expectTypeOf(result).toMatchTypeOf<never>();

      // Ensure that unwrap throws
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(
        new Error(`Unwrapping an error result: "error message"`)
      );
    }
  });

  test("expecting throws", () => {
    try {
      const result = RsResult.expect(inputResult, "Custom error message");

      expectTypeOf(result).toMatchTypeOf<never>();

      // Ensure that expect throws
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(
        new Error(`Custom error message: "error message"`)
      );
    }
  });

  test("unwraps error", () => {
    expect(RsResult.unwrapErr(inputResult)).toStrictEqual("error message");
  });

  describe("ifOk", () => {
    test("doesn't run callback", () => {
      const fn = vi.fn((value) => value);

      RsResult.ifOk(inputResult, fn);

      expect(fn).not.toBeCalled();
    });
  });

  describe("ifOkOr", () => {
    test("runs callback", () => {
      const okFn = vi.fn();
      const errFn = vi.fn();

      RsResult.ifOkOr(inputResult, okFn, errFn);

      expect(okFn).not.toBeCalled();
      expect(errFn).toBeCalledWith("error message");
    });
  });
});

describe.each([
  {
    title: "object",
    value: {},
    string: "{}",
  },
  {
    title: "number",
    value: 123,
    string: "123",
  },
])("non result input: $title", ({ value, string }) => {
  test("is not ok", () => {
    expect(RsResult.isOk(value)).toBeFalsy();
  });

  test("unwrapping throws", () => {
    try {
      const result = RsResult.unwrap(
        // @ts-expect-error Invalid typed value for the test
        value
      );

      expectTypeOf(result).toMatchTypeOf<never>();

      // Ensure that unwrap throws
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(
        new Error(`Unwrapping a non-result value: ${string}`)
      );
    }
  });

  test("expecting throws", () => {
    try {
      const result = RsResult.expect(
        // @ts-expect-error Invalid typed value for the test
        value,
        "Custom error message"
      );

      expectTypeOf(result).toMatchTypeOf<never>();

      // Ensure that unwrap throws
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(
        new Error(`Unwrapping a non-result value: ${string}`)
      );
    }
  });

  test("unwrapping error throws", () => {
    try {
      const result = RsResult.unwrapErr(
        // @ts-expect-error Test
        value
      );

      expectTypeOf(result).toMatchTypeOf<never>();

      // Ensure that unwrap throws
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(
        new Error(`Unwrapping a non-result value: ${string}`)
      );
    }
  });
});
