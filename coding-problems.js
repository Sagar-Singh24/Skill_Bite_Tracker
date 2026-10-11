/**
 * 200 deterministic coding problems (stdin → stdout).
 * Used by Skill Bite coding challenge (browser + Piston API).
 */
(function () {
  function fibNth(n) {
    if (n <= 0) return 0;
    if (n <= 2) return 1;
    let a = 1,
      b = 1;
    for (let i = 3; i <= n; i++) {
      const t = a + b;
      a = b;
      b = t;
    }
    return b;
  }

  function fact(n) {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 0;
  }

  function lcm(a, b) {
    if (!a || !b) return 0;
    return Math.abs((a * b) / gcd(a, b));
  }

  function digitCount(n) {
    return String(Math.abs(n)).length;
  }

  function sumDigits(n) {
    let s = 0;
    for (const c of String(Math.abs(n))) s += parseInt(c, 10);
    return s;
  }

  const STARTERS = {
    javascript: `function main(stdin) {
  const lines = stdin.trim().split("\\n");
  // Parse input from lines, then print with console.log (add \\n only if problem needs multiple lines)
  console.log("");
}
main(stdin);`,
    python: `import sys

def main():
    data = sys.stdin.read().strip().split()
    # Parse data, then print result
    print()

if __name__ == "__main__":
    main()
`,
    c: `#include <stdio.h>

int main(void) {
    /* read stdin with scanf / fgets as needed */
    printf("\\n");
    return 0;
}
`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    // read with cin
    cout << endl;
    return 0;
}
`,
    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // read input
        System.out.println();
    }
}
`
  };

  const problems = [];
  let id = 1;

  function add(meta) {
    problems.push({
      id: id++,
      title: meta.title,
      description: meta.description,
      stdin: meta.stdin,
      expected: meta.expected,
      difficulty: meta.difficulty || "Easy",
      starters: { ...STARTERS }
    });
  }

  for (let i = 0; i < 20; i++) {
    const a = ((i * 17 + 3) % 99) + 1;
    const b = ((i * 31 + 7) % 99) + 1;
    add({
      title: `Sum of two integers #${i + 1}`,
      description: `Read two space-separated integers from stdin and print their sum.`,
      stdin: `${a} ${b}\n`,
      expected: `${a + b}\n`,
      difficulty: "Easy"
    });
  }

  for (let i = 0; i < 20; i++) {
    const a = ((i * 13 + 5) % 12) + 1;
    const b = ((i * 19 + 11) % 12) + 1;
    add({
      title: `Product of two integers #${i + 1}`,
      description: `Read two integers and print their product.`,
      stdin: `${a} ${b}\n`,
      expected: `${a * b}\n`,
      difficulty: "Easy"
    });
  }

  for (let i = 0; i < 20; i++) {
    const a = ((i * 23 + 2) % 200) - 50;
    const b = ((i * 29 + 8) % 200) - 50;
    add({
      title: `Absolute difference #${i + 1}`,
      description: `Read two integers and print the absolute value of (a - b).`,
      stdin: `${a} ${b}\n`,
      expected: `${Math.abs(a - b)}\n`,
      difficulty: "Easy"
    });
  }

  for (let i = 0; i < 20; i++) {
    const a = ((i * 11 + 4) % 500) + 1;
    const b = ((i * 37 + 9) % 500) + 1;
    add({
      title: `Maximum of two #${i + 1}`,
      description: `Read two integers and print the larger one.`,
      stdin: `${a} ${b}\n`,
      expected: `${Math.max(a, b)}\n`,
      difficulty: "Easy"
    });
  }

  for (let i = 0; i < 20; i++) {
    const a = ((i * 41 + 6) % 400) + 1;
    const b = ((i * 7 + 14) % 400) + 1;
    add({
      title: `Minimum of two #${i + 1}`,
      description: `Read two integers and print the smaller one.`,
      stdin: `${a} ${b}\n`,
      expected: `${Math.min(a, b)}\n`,
      difficulty: "Easy"
    });
  }

  for (let i = 0; i < 15; i++) {
    const n = (i % 11) + 1;
    add({
      title: `Factorial #${i + 1}`,
      description: `Read one integer n (1 ≤ n ≤ 11) and print n! (factorial).`,
      stdin: `${n}\n`,
      expected: `${fact(n)}\n`,
      difficulty: "Easy"
    });
  }

  for (let i = 0; i < 15; i++) {
    const n = (i % 22) + 1;
    add({
      title: `Fibonacci term #${i + 1}`,
      description: `Read n (1 ≤ n ≤ 22). Print the n-th Fibonacci number where F(1)=1, F(2)=1, F(3)=2, …`,
      stdin: `${n}\n`,
      expected: `${fibNth(n)}\n`,
      difficulty: "Medium"
    });
  }

  for (let i = 0; i < 15; i++) {
    const a = ((i * 5 + 17) % 98) + 2;
    const b = ((i * 13 + 23) % 98) + 2;
    add({
      title: `GCD #${i + 1}`,
      description: `Read two positive integers and print their greatest common divisor.`,
      stdin: `${a} ${b}\n`,
      expected: `${gcd(a, b)}\n`,
      difficulty: "Medium"
    });
  }

  for (let i = 0; i < 15; i++) {
    const a = ((i * 9 + 11) % 48) + 2;
    const b = ((i * 15 + 19) % 48) + 2;
    add({
      title: `LCM #${i + 1}`,
      description: `Read two positive integers and print their least common multiple.`,
      stdin: `${a} ${b}\n`,
      expected: `${lcm(a, b)}\n`,
      difficulty: "Medium"
    });
  }

  for (let i = 0; i < 10; i++) {
    const n = ((i * 47 + 3) % 999999) + 1;
    add({
      title: `Digit count #${i + 1}`,
      description: `Read one non-negative integer and print how many digits it has (no leading zeros in input).`,
      stdin: `${n}\n`,
      expected: `${digitCount(n)}\n`,
      difficulty: "Easy"
    });
  }

  for (let i = 0; i < 10; i++) {
    const n = ((i * 53 + 7) % 99999) + 1;
    add({
      title: `Sum of digits #${i + 1}`,
      description: `Read one non-negative integer and print the sum of its digits.`,
      stdin: `${n}\n`,
      expected: `${sumDigits(n)}\n`,
      difficulty: "Easy"
    });
  }

  const words = [
    "skillbite",
    "algorithm",
    "terminal",
    "compiler",
    "debugger",
    "function",
    "variable",
    "pointer",
    "iterate",
    "recursion"
  ];
  for (let i = 0; i < 10; i++) {
    const w = words[i];
    const rev = w.split("").reverse().join("");
    add({
      title: `Reverse string #${i + 1}`,
      description: `Read one line (letters only, no spaces) and print it reversed.`,
      stdin: `${w}\n`,
      expected: `${rev}\n`,
      difficulty: "Easy"
    });
  }

  for (let i = 0; i < 10; i++) {
    const w = words[i] + (i % 3 === 0 ? "x" : i % 3 === 1 ? "xy" : "");
    add({
      title: `String length #${i + 1}`,
      description: `Read one line (no spaces) and print its length.`,
      stdin: `${w}\n`,
      expected: `${w.length}\n`,
      difficulty: "Easy"
    });
  }

  window.CODING_PROBLEMS = problems;
})();
