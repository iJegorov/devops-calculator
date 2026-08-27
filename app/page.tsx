"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import {
  calculate,
  formatDisplay,
  type Operator,
} from "../lib/calculator";



export default function Home() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = useCallback(
    (digit: string) => {
      if (display === "Error") {
        setDisplay(digit);
        setWaitingForOperand(false);
        return;
      }

      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
        return;
      }

      setDisplay((prev) => (prev === "0" ? digit : prev + digit));
    },
    [display, waitingForOperand]
  );

  const inputDecimal = useCallback(() => {
    if (display === "Error") {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay((prev) => prev + ".");
    }
  }, [display, waitingForOperand]);

  const clearAll = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay("0");
    setWaitingForOperand(false);
  }, []);

  const backspace = useCallback(() => {
    if (waitingForOperand || display === "Error") return;

    setDisplay((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith("-"))) {
        return "0";
      }
      return prev.slice(0, -1);
    });
  }, [display, waitingForOperand]);

  const toggleSign = useCallback(() => {
    if (display === "Error" || display === "0") return;

    setDisplay((prev) =>
      prev.startsWith("-") ? prev.slice(1) : `-${prev}`
    );
  }, [display]);

  const inputPercent = useCallback(() => {
    if (display === "Error") return;

    const value = Number(display);
    setDisplay(formatDisplay(value / 100));
    setWaitingForOperand(true);
  }, [display]);

  const performOperation = useCallback(
    (nextOperator: Operator) => {
      const current = Number(display);

      if (display === "Error") {
        clearAll();
        return;
      }

      if (previousValue === null) {
        setPreviousValue(current);
      } else if (operator && !waitingForOperand) {
        const result = calculate(previousValue, current, operator);

        if (result === null) {
          setDisplay("Error");
          setPreviousValue(null);
          setOperator(null);
          setWaitingForOperand(true);
          return;
        }

        const formatted = formatDisplay(result);
        setDisplay(formatted);
        setPreviousValue(Number(formatted));
      }

      setOperator(nextOperator);
      setWaitingForOperand(true);
    },
    [display, previousValue, operator, waitingForOperand, clearAll]
  );

  const handleEquals = useCallback(() => {
    if (previousValue === null || operator === null || waitingForOperand) {
      return;
    }

    const current = Number(display);
    const result = calculate(previousValue, current, operator);

    if (result === null) {
      setDisplay("Error");
    } else {
      setDisplay(formatDisplay(result));
    }

    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, previousValue, operator, waitingForOperand]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        inputDigit(e.key);
      } else if (e.key === ".") {
        e.preventDefault();
        inputDecimal();
      } else if (e.key === "+" || e.key === "-") {
        e.preventDefault();
        performOperation(e.key as Operator);
      } else if (e.key === "*" || e.key === "x" || e.key === "X") {
        e.preventDefault();
        performOperation("*");
      } else if (e.key === "/") {
        e.preventDefault();
        performOperation("/");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Escape") {
        e.preventDefault();
        clearAll();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
      } else if (e.key === "%") {
        e.preventDefault();
        inputPercent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    inputDigit,
    inputDecimal,
    performOperation,
    handleEquals,
    clearAll,
    backspace,
    inputPercent,
  ]);

  return (
    <main className={styles.container}>
      <div className={styles.calculator}>
        <h1>DevOps Calculator v1</h1>

        <div className={styles.display} aria-live="polite">
          {display}
        </div>

        <div className={styles.buttons}>
          {/* Row 1 */}
          <button onClick={clearAll} className={styles.clear}>
            AC
          </button>
          <button onClick={clearEntry}>CE</button>
          <button onClick={backspace}>⌫</button>
          <button onClick={() => performOperation("/")}>÷</button>

          {/* Row 2 */}
          <button onClick={() => inputDigit("7")}>7</button>
          <button onClick={() => inputDigit("8")}>8</button>
          <button onClick={() => inputDigit("9")}>9</button>
          <button onClick={() => performOperation("*")}>×</button>

          {/* Row 3 */}
          <button onClick={() => inputDigit("4")}>4</button>
          <button onClick={() => inputDigit("5")}>5</button>
          <button onClick={() => inputDigit("6")}>6</button>
          <button onClick={() => performOperation("-")}>−</button>

          {/* Row 4 */}
          <button onClick={() => inputDigit("1")}>1</button>
          <button onClick={() => inputDigit("2")}>2</button>
          <button onClick={() => inputDigit("3")}>3</button>
          <button onClick={() => performOperation("+")}>+</button>

          {/* Row 5 */}
          <button onClick={toggleSign}>±</button>
          <button onClick={() => inputDigit("0")} className={styles.zero}>
            0
          </button>
          <button onClick={inputDecimal}>.</button>
          <button onClick={handleEquals} className={styles.equals}>
            =
          </button>

          {/* Optional extra row if you want % */}
          {/* <button onClick={inputPercent}>%</button> */}
        </div>
      </div>
    </main>
  );
}