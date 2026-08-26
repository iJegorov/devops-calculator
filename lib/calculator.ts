export type Operator = "+" | "-" | "*" | "/";

export function formatDisplay(value: number | string): string {
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return "Error";

  // Avoid floating-point junk like 0.1 + 0.2 = 0.30000000000000004
  const rounded = Math.round(value * 1e12) / 1e12;
  const str = String(rounded);

  // Keep it readable
  if (str.length > 12) {
    return rounded.toExponential(6);
  }

  return str;
}

export function calculate(
  first: number,
  second: number,
  op: Operator
): number | null {
  switch (op) {
    case "+":
      return first + second;

    case "-":
      return first - second;

    case "*":
      return first * second;

    case "/":
      return second === 0 ? null : first / second;

    default:
      return second;
  }
}