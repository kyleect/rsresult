import { test, expect, describe, vi } from "vitest";
import * as RsResult from ".";

describe("ok input", () => {
  const inputJson = JSON.stringify(RsResult.ok(123));
  const inputResult: RsResult.Result<number> = JSON.parse(inputJson);

  describe("with extra keys", () => {
    const inputJson = JSON.stringify(
      Object.assign({}, RsResult.ok(123), { extraKey: true })
    );
    const inputResult: RsResult.Result<number> = JSON.parse(inputJson);

    test("is not ok", () => {
      expect(RsResult.isOk(inputResult)).toBeFalsy();
    });
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
  const inputJson = JSON.stringify(RsResult.err("error message"));
  const inputResult: RsResult.Result<number> = JSON.parse(inputJson);

  describe("with extra keys", () => {
    const inputJson = JSON.stringify(
      Object.assign({}, RsResult.err("error message"), { extraKey: true })
    );
    const inputResult: RsResult.Result<number> = JSON.parse(inputJson);

    test("is not err", () => {
      expect(RsResult.isErr(inputResult)).toBeFalsy();
    });
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
      RsResult.unwrap(123);
      expect.fail("Should have thrown");
    } catch (e) {
      expect(e).toStrictEqual(new Error(`Unwrapping a non result value: 123`));
    }
  });
});
