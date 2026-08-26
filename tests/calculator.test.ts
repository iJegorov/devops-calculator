import { describe, expect, test } from "vitest";
import { calculate, formatDisplay } from "../lib/calculator";

describe("calculate", () => {
  test("adds two numbers", () => {
    expect(calculate(2, 3, "+")).toBe(5);
  });

  test("subtracts two numbers", () => {
    expect(calculate(5, 3, "-")).toBe(2);
  });

  test("multiplies two numbers", () => {
    expect(calculate(4, 3, "*")).toBe(12);
  });

  test("divides two numbers", () => {
    expect(calculate(10, 2, "/")).toBe(5);
  });

  test("returns null when dividing by zero", () => {
    expect(calculate(10, 0, "/")).toBeNull();
  });
});

describe("formatDisplay", () => {
  test("formats normal numbers", () => {
    expect(formatDisplay(42)).toBe("42");
  });

  test("rounds floating-point precision errors", () => {
    expect(formatDisplay(0.1 + 0.2)).toBe("0.3");
  });

  test("returns Error for non-finite numbers", () => {
    expect(formatDisplay(Infinity)).toBe("Error");
  });

  test("keeps string values unchanged", () => {
    expect(formatDisplay("Error")).toBe("Error");
  });
});