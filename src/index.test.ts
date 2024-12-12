import { test, expect, describe, vi, expectTypeOf } from "vitest";
import * as RsResult from ".";

describe("result input", () => {
  const expectedResult = RsResult.ok(123);
  const inputJson = JSON.stringify(expectedResult);
  const inputResult: unknown = JSON.parse(inputJson);

  test("is equal to expected result", () => {
    expect(inputResult).toStrictEqual(expectedResult);
  });

  test("has correct type", () => {
    expectTypeOf(inputResult).toMatchTypeOf<unknown>();
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
    // @ts-expect-error Test
    expect(RsResult.map(inputResult, (value) => value * 2)).toStrictEqual(
      RsResult.ok(246)
    );
  });

  test("unwraps with value", () => {
    // @ts-expect-error Test
    expect(RsResult.unwrap(inputResult)).toBe(123);
  });

  describe("ifOk", () => {
    test("runs callback", () => {
      const fn = vi.fn((value) => value);

      // @ts-expect-error Test
      RsResult.ifOk(inputResult, fn);

      expect(fn).toBeCalledWith(123);
    });
  });

  describe("ifOkOr", () => {
    test("runs callback", () => {
      const okFn = vi.fn();
      const errFn = vi.fn();

      // @ts-expect-error Test
      RsResult.ifOkOr(inputResult, okFn, errFn);

      expect(okFn).toBeCalledWith(123);
      expect(errFn).not.toBeCalled();
    });
  });
});

describe("ok input", () => {
  const expectedResult = RsResult.ok(123);
  const inputJson = JSON.stringify(expectedResult);
  const inputResult: RsResult.Result<number, never> = JSON.parse(inputJson);

  test("is equal to expected result", () => {
    expect(inputResult).toStrictEqual(expectedResult);
  });

  test("has correct type", () => {
    expectTypeOf(expectedResult).toMatchTypeOf<
      RsResult.Result<number, never>
    >();

    expectTypeOf(inputResult).toMatchTypeOf<RsResult.Result<number, never>>();
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

  test("has correct type", () => {
    expectTypeOf(expectedResult).toMatchTypeOf<
      RsResult.Result<never, string>
    >();
  });

  describe("with extra keys", () => {
    const inputJson = JSON.stringify(
      Object.assign({}, RsResult.err("error message"), { extraKey: true })
    );
    const inputResult: RsResult.Result<never, string> = JSON.parse(inputJson);

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
      RsResult.unwrap(inputResult);
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(
        new Error(`Unwrapping an error result: "error message"`)
      );
    }
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

describe("non result input", () => {
  test("is not ok", () => {
    expect(RsResult.isOk({})).toBeFalsy();
  });

  test("unwrapping throws", () => {
    try {
      // @ts-expect-error Invalid typed value for the test
      RsResult.unwrap(123);
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(new Error(`Unwrapping a non-result value: 123`));
    }
  });
});
