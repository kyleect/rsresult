import { test, expect, describe, vi } from "vitest";
import { err, ifOk, ifOkOr, isErr, isOk, mapResult, ok, Result } from ".";

describe("ok input", () => {
  const inputJson = JSON.stringify(ok(123));
  const inputResult: Result<number> = JSON.parse(inputJson);

  describe("with extra keys", () => {
    const inputJson = JSON.stringify(
      Object.assign({}, ok(123), { extraKey: true })
    );
    const inputResult: Result<number> = JSON.parse(inputJson);

    test("is not ok", () => {
      expect(isOk(inputResult)).toBeFalsy();
    });
  });

  test("is ok", () => {
    expect(isOk(inputResult)).toBeTruthy();
  });

  test("is not err", () => {
    expect(isErr(inputResult)).toBeFalsy();
  });

  test("maps to new value", () => {
    expect(mapResult(inputResult, (value) => value * 2)).toStrictEqual(ok(246));
  });

  describe("ifOk", () => {
    test("runs callback", () => {
      const fn = vi.fn((value) => value);

      ifOk(inputResult, fn);

      expect(fn).toBeCalledWith(123);
    });
  });

  describe("ifOkOr", () => {
    test("runs callback", () => {
      const okFn = vi.fn();
      const errFn = vi.fn();

      ifOkOr(inputResult, okFn, errFn);

      expect(okFn).toBeCalledWith(123);
      expect(errFn).not.toBeCalled();
    });
  });
});

describe("err input", () => {
  const inputJson = JSON.stringify(err("error message"));
  const inputResult: Result<number> = JSON.parse(inputJson);

  describe("with extra keys", () => {
    const inputJson = JSON.stringify(
      Object.assign({}, err("error message"), { extraKey: true })
    );
    const inputResult: Result<number> = JSON.parse(inputJson);

    test("is not err", () => {
      expect(isErr(inputResult)).toBeFalsy();
    });
  });

  test("is err", () => {
    expect(isErr(inputResult)).toBeTruthy();
  });

  test("is not ok", () => {
    expect(isOk(inputResult)).toBeFalsy();
  });

  test("doesn't map", () => {
    expect(mapResult(inputResult, (value) => value * 2)).toStrictEqual(
      err("error message")
    );
  });

  describe("ifOk", () => {
    test("doesn't run callback", () => {
      const fn = vi.fn((value) => value);

      ifOk(inputResult, fn);

      expect(fn).not.toBeCalled();
    });
  });

  describe("ifOkOr", () => {
    test("runs callback", () => {
      const okFn = vi.fn();
      const errFn = vi.fn();

      ifOkOr(inputResult, okFn, errFn);

      expect(okFn).not.toBeCalled();
      expect(errFn).toBeCalledWith("error message");
    });
  });
});

describe("non result input", () => {
  test("is not ok", () => {
    expect(isOk({})).toBeFalsy();
  });
});
