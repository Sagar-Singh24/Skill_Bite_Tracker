const STARTERS = {
  javascript: `function main(stdin) {\n  const lines = stdin.trim().split("\\n");\n  console.log("");\n}\nmain(stdin);`,
  python: `import sys\n\ndef main():\n    data = sys.stdin.read().strip().split()\n    print()\n\nif __name__ == "__main__":\n    main()\n`,
  c: `#include <stdio.h>\n\nint main(void) {\n    printf("\\n");\n    return 0;\n}\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << endl;\n    return 0;\n}\n`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println();\n    }\n}\n`,
}

function fibNth(n) {
  if (n <= 0) return 0; if (n <= 2) return 1
  let a = 1, b = 1
  for (let i = 3; i <= n; i++) { const t = a + b; a = b; b = t }
  return b
}
function fact(n) { if (n <= 1) return 1; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r }
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t } return a || 0 }
function lcm(a, b) { if (!a || !b) return 0; return Math.abs((a * b) / gcd(a, b)) }
function digitCount(n) { return String(Math.abs(n)).length }
function sumDigits(n) { let s = 0; for (const c of String(Math.abs(n))) s += parseInt(c, 10); return s }

const problems = []
let id = 1

const DESCRIPTIONS = {
  sum: {
    desc: "Compute the arithmetic sum of two given integers. This task serves as a fundamental check for basic arithmetic unit operations in your chosen programming environment.",
    input: "Two space-separated integers A and B on a single line.",
    output: "A single integer representing the sum A + B.",
    constraints: "-10^9 ≤ A, B ≤ 10^9"
  },
  product: {
    desc: "Calculate the product of two integers. Ensure your implementation handles the range of the result based on the constraints.",
    input: "Two space-separated integers A and B.",
    output: "The result of A * B.",
    constraints: "-10^6 ≤ A, B ≤ 10^6"
  },
  diff: {
    desc: "Find the absolute difference between two integers A and B. The result is defined as |A - B|.",
    input: "Two space-separated integers A and B.",
    output: "The absolute difference |A - B|.",
    constraints: "-2^31 ≤ A, B ≤ 2^31 - 1"
  },
  max: {
    desc: "Compare two integers and determine which one is larger. If they are equal, either value can be returned as the maximum.",
    input: "Two integers A and B.",
    output: "The larger of the two integers.",
    constraints: "-10^9 ≤ A, B ≤ 10^9"
  },
  min: {
    desc: "Find the minimum of two integers. This is a basic comparison task essential for sorting and selection algorithms.",
    input: "Two integers A and B.",
    output: "The smaller of the two integers.",
    constraints: "-10^9 ≤ A, B ≤ 10^9"
  },
  factorial: {
    desc: "Given a non-negative integer n, compute its factorial (n!). Factorial is defined as n * (n-1) * ... * 1, with 0! = 1.",
    input: "A single non-negative integer n.",
    output: "The factorial of n.",
    constraints: "0 ≤ n ≤ 12"
  },
  fib: {
    desc: "Calculate the n-th term of the Fibonacci sequence. The sequence starts with 1, 1, 2, 3, 5, 8... where F(1)=1, F(2)=1, and F(n)=F(n-1)+F(n-2).",
    input: "A positive integer n.",
    output: "The n-th Fibonacci number.",
    constraints: "1 ≤ n ≤ 40"
  },
  gcd: {
    desc: "Identify the Greatest Common Divisor (GCD) of two positive integers using the Euclidean algorithm or similar efficient methods.",
    input: "Two space-separated positive integers A and B.",
    output: "The greatest common divisor of A and B.",
    constraints: "1 ≤ A, B ≤ 10^9"
  },
  lcm: {
    desc: "Determine the Least Common Multiple (LCM) of two positive integers. Use the relationship between GCD and LCM for an efficient solution: LCM(a,b) = |a*b| / GCD(a,b).",
    input: "Two space-separated positive integers A and B.",
    output: "The least common multiple of A and B.",
    constraints: "1 ≤ A, B ≤ 10^6"
  },
  digits: {
    desc: "Count the total number of decimal digits in a given non-negative integer.",
    input: "A single non-negative integer n.",
    output: "The count of digits in n.",
    constraints: "0 ≤ n ≤ 10^18"
  },
  sumDigits: {
    desc: "Calculate the sum of all individual digits in a non-negative integer. For example, if input is 123, the output should be 1+2+3 = 6.",
    input: "A non-negative integer n.",
    output: "The sum of the digits of n.",
    constraints: "0 ≤ n ≤ 10^18"
  },
  reverse: {
    desc: "Reverse a given string or line of text. The output should contain the same characters as the input but in reverse order.",
    input: "A single string s.",
    output: "The reversed string.",
    constraints: "Length of s ≤ 1000"
  },
  length: {
    desc: "Determine the length (number of characters) of a given string provided as input.",
    input: "A single string s.",
    output: "The length of s.",
    constraints: "Length of s ≤ 10^4"
  }
}

function add(meta, category) {
  const d = DESCRIPTIONS[category] || { desc: meta.description, input: 'Standard', output: 'Standard', constraints: 'Default' }
  problems.push({
    id: id++,
    ...meta,
    fullDescription: `${d.desc}\n\n### Input Format\n${d.input}\n\n### Output Format\n${d.output}`,
    constraints: d.constraints,
    difficulty: meta.difficulty || 'Easy',
    starters: { ...STARTERS }
  })
}

// Data generation loops
for (let i = 0; i < 20; i++) { const a = ((i*17+3)%99)+1, b = ((i*31+7)%99)+1; add({ title: `Integer Sum #${i+1}`, stdin: `${a} ${b}\n`, expected: `${a+b}\n`, difficulty: 'Easy' }, 'sum') }
for (let i = 0; i < 20; i++) { const a = ((i*13+5)%12)+1, b = ((i*19+11)%12)+1; add({ title: `Product Engine #${i+1}`, stdin: `${a} ${b}\n`, expected: `${a*b}\n`, difficulty: 'Easy' }, 'product') }
for (let i = 0; i < 20; i++) { const a = ((i*23+2)%200)-50, b = ((i*29+8)%200)-50; add({ title: `Delta Calculator #${i+1}`, stdin: `${a} ${b}\n`, expected: `${Math.abs(a-b)}\n`, difficulty: 'Easy' }, 'diff') }
for (let i = 0; i < 20; i++) { const a = ((i*11+4)%500)+1, b = ((i*37+9)%500)+1; add({ title: `Max Value Finder #${i+1}`, stdin: `${a} ${b}\n`, expected: `${Math.max(a,b)}\n`, difficulty: 'Easy' }, 'max') }
for (let i = 0; i < 20; i++) { const a = ((i*41+6)%400)+1, b = ((i*7+14)%400)+1; add({ title: `Min Value Finder #${i+1}`, stdin: `${a} ${b}\n`, expected: `${Math.min(a,b)}\n`, difficulty: 'Easy' }, 'min') }
for (let i = 0; i < 15; i++) { const n = (i%11)+1; add({ title: `Factorial Sequence #${i+1}`, stdin: `${n}\n`, expected: `${fact(n)}\n`, difficulty: 'Easy' }, 'factorial') }
for (let i = 0; i < 15; i++) { const n = (i%22)+1; add({ title: `Fibonacci Iterator #${i+1}`, stdin: `${n}\n`, expected: `${fibNth(n)}\n`, difficulty: 'Medium' }, 'fib') }
for (let i = 0; i < 15; i++) { const a = ((i*5+17)%98)+2, b = ((i*13+23)%98)+2; add({ title: `GCD Euclidean #${i+1}`, stdin: `${a} ${b}\n`, expected: `${gcd(a,b)}\n`, difficulty: 'Medium' }, 'gcd') }
for (let i = 0; i < 15; i++) { const a = ((i*9+11)%48)+2, b = ((i*15+19)%48)+2; add({ title: `LCM Multiple #${i+1}`, stdin: `${a} ${b}\n`, expected: `${lcm(a,b)}\n`, difficulty: 'Medium' }, 'lcm') }
for (let i = 0; i < 10; i++) { const n = ((i*47+3)%999999)+1; add({ title: `Digit Magnitude #${i+1}`, stdin: `${n}\n`, expected: `${digitCount(n)}\n`, difficulty: 'Easy' }, 'digits') }
for (let i = 0; i < 10; i++) { const n = ((i*53+7)%99999)+1; add({ title: `Digit Summation #${i+1}`, stdin: `${n}\n`, expected: `${sumDigits(n)}\n`, difficulty: 'Easy' }, 'sumDigits') }
const words = ['skillbite','algorithm','terminal','compiler','debugger','function','variable','pointer','iterate','recursion']
for (let i = 0; i < 10; i++) { const w = words[i]; add({ title: `String Reversal #${i+1}`, stdin: `${w}\n`, expected: `${w.split('').reverse().join('')}\n`, difficulty: 'Easy' }, 'reverse') }
for (let i = 0; i < 10; i++) { const w = words[i]+(i%3===0?'x':i%3===1?'xy':''); add({ title: `String Metrology #${i+1}`, stdin: `${w}\n`, expected: `${w.length}\n`, difficulty: 'Easy' }, 'length') }

export const CODING_PROBLEMS = problems

