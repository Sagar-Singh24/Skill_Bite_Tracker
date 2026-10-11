const TOPIC_QUESTIONS = {
  fundamentals: ['Sum of Two Numbers','Even or Odd','Largest of Three','Simple Interest','Leap Year Check','Grade Calculator','Swap Two Numbers','Absolute Difference','Power of Number','Average of N Numbers','FizzBuzz','Positive/Negative/Zero','Character Case Check','Triangle Validity','Profit or Loss','Calculator Using Switch','Multiplication Table','Count Digits','Reverse Number','Palindrome Number'],
  strings: ['Reverse String','Palindrome String','Count Vowels','Remove Whitespaces','Anagram Check','First Non-Repeating Character','Frequency of Characters','Longest Word in Sentence','Toggle Case','Substring Count','String Compression','Valid Parentheses','Check Rotation','Roman to Integer','Integer to Roman','Longest Common Prefix','Capitalize Each Word','Remove Duplicate Characters','Word Count','String to Integer Parser'],
  arrays: ['Array Sum','Maximum Element','Minimum Element','Second Largest','Rotate Array Right','Move Zeros to End','Remove Duplicates Sorted Array','Two Sum','Prefix Sum Queries','Kadane Maximum Subarray','Merge Two Sorted Arrays','Intersection of Two Arrays','Majority Element','Product Except Self','Sort 0 1 2','Binary Search in Array','Find Missing Number','Find Duplicate Number','Subarray with Given Sum','Spiral Matrix Traversal'],
  oop: ['Create Student Class','Bank Account Encapsulation','Constructor Overloading','Method Overloading','Method Overriding','Single Inheritance Demo','Multilevel Inheritance Demo','Abstract Class Shape','Interface Payment','Polymorphism Animals','Aggregation Library-Book','Composition Car-Engine','Static Member Counter','Final Keyword Example','Equals and HashCode','Comparable Student Sort','Cloneable Object Demo','Singleton Class','Builder Pattern Object','Immutable Class'],
  collections: ['Unique Elements with Set','Word Frequency with Map','Sort List with Library Utilities','LinkedList Operations','Priority Queue Basics','Stack Implementation','Queue Operations','Sorted Set Usage','Sorted Map Keys','Group Anagrams','LRU Cache Design','Top K Frequent Elements','Count Distinct in Window','Merge Intervals','Map by Department','Set Difference/Union/Intersection','Frequency Sort by Value','Iterator Remove Even Numbers','Custom Comparator Sort','Flatten List of Lists'],
  concurrency: ['Create Thread with Runnable','Create Thread with Lambda','Thread Sleep Demo','Thread Join Demo','Synchronized Counter','Producer Consumer Pattern','Deadlock Demonstration','Lock API Example','Semaphore Example','Thread Pool Basics','Future/Promise Result','CountDownLatch Example','Barrier Synchronization','Volatile Flag Stop Thread','Atomic Counter','ThreadLocal Context','ReadWriteLock Example','Async Chain','Parallel Sum','Scheduled Task'],
  recursion: ['Factorial Using Recursion','Fibonacci Using Recursion','Power Function','Sum of Digits','Reverse String Recursively','Binary Search Recursively','Tower of Hanoi','Generate Subsets','Generate Permutations','Combination Sum','N-Queens','Sudoku Solver','Merge Sort Recursive','Quick Sort Recursive','Check Palindrome Recursively','Count Paths in Grid','Climbing Stairs','Josephus Problem','Recursive GCD','Decode Ways'],
  algorithms: ['Linear Search','Binary Search','Lower Bound','Upper Bound','Bubble Sort','Selection Sort','Insertion Sort','Merge Sort','Quick Sort','Heap Sort','Count Sort','Radix Sort','Search in Rotated Array','Find Peak Element','Kth Smallest Element','Median of Two Sorted Arrays','Search 2D Matrix','Sort by Frequency','Topological Sort','Dijkstra Shortest Path'],
  errors: ['Safe Integer Division','Custom Invalid Input Error','Multiple Catch Blocks','Finally Cleanup Demo','Resource Cleanup Pattern','Throw vs Propagate Demo','Parse Input with Error Handling','Nested Try-Catch','User Input Validation','Global Error Handler Pattern','Retry on Failure','Checked vs Unchecked Demo','Suppressing Exceptions','Error Chaining','Custom Error Codes','Batch Processing with Error Log','Graceful Degradation Demo','Handle NumberFormat Error','Handle Index Error','Handle Null Error'],
  io: ['Read File Line by Line','Write Text to File','Append to Existing File','Copy File Content','Count Words in File','Count Lines in File','Find Longest Line','CSV Parser Basic','JSON Read/Write Basic','Directory Listing','Filter Files by Extension','Serialize Object to File','Deserialize Object from File','Read Large File Buffered','Create Temp File','File Rename Utility','Delete Old Files','Merge Two Text Files','Split File by Size','Read Config Properties File'],
  languageFeatures: ['Generic Box Type','Generic Pair Type','Generic Method Max','Bounded Type Parameters','Read-Only Collections','Write-Only Collections','Repository Interface','Generic Stack','Generic Queue','Type Erasure Demo','Comparator with Generics','Utility Swap','Generic Print Function','Multiple Bounds Example','Map Wrapper','Result Type','Variance Demo','Builder Pattern','Filter Function','Merge Function'],
  advancedApis: ['Filter Even Numbers','Map to Squares','Reduce Sum','Group by Length','Count by Condition','Find First Match','Any/All Match Demo','Sort by Comparator','Distinct Elements','FlatMap Nested Lists','Partition by Predicate','Collectors toMap','Top N Elements','Windowed Processing Basic','Join Strings','Summary Statistics','Parallel Processing Demo','Handle Optional Safely','Convert to Set','Stream from File Lines'],
  dataAccess: ['Connect to Database','Insert Row with Parameters','Update Row with Parameters','Delete Row by Id','Select Single Row','Select All Rows','Batch Insert','Transaction Commit/Rollback','Stored Procedure Call','Pagination Query','DAO Pattern User','Connection Pool Basic','Metadata Demo','Map Result Row to Object','Safe Resource Closing','SQL Injection Prevention','Dynamic Query Builder','Join Query Mapping','Upsert Record','Audit Logging Table'],
  patterns: ['Sliding Window Max Sum','Two Pointers Pair Sum','Fast Slow Cycle Detection','Prefix Sum Subarray Count','Difference Array Range Update','Monotonic Stack Next Greater','Monotonic Queue Sliding Max','Greedy Interval Scheduling','Binary Search on Answer','Backtracking Word Search','Union Find Connected Components','BFS Shortest Path Grid','DFS Connected Regions','Top K with Heap','Trie Prefix Search','Segment Tree Range Sum','Fenwick Tree Range Update','Bitmask Subset DP','Knapsack 0/1','Longest Increasing Subsequence'],
  misc: ['Mini URL Parser','Expression Evaluator','Infix to Postfix','Postfix Evaluator','LRU Cache from Scratch','Rate Limiter Token Bucket','Scheduler Round Robin','Basic Logger with Levels','Simple Chat Server Threads','JSON Pretty Printer','Markdown Heading Parser','Phone Number Formatter','Password Strength Checker','IP Address Validator','Email Validator','Date Difference Calculator','Currency Formatter','Command Line Todo App','Mini Quiz Engine','Mini Banking Simulator'],
}

export const PRACTICE_LANGUAGES = [
  { key: 'java', label: '☕ Java', editorLanguage: 'java' },
  { key: 'cpp', label: '⚡ C++', editorLanguage: 'cpp' },
  { key: 'javascript', label: '🟨 JavaScript', editorLanguage: 'javascript' },
  { key: 'c', label: '⚙️ C', editorLanguage: 'c' },
  { key: 'python', label: '🐍 Python', editorLanguage: 'python' },
  { key: 'typescript', label: '🟦 TypeScript', editorLanguage: 'typescript' },
  { key: 'go', label: '🐹 Go', editorLanguage: 'go' },
  { key: 'rust', label: '🦀 Rust', editorLanguage: 'rust' },
  { key: 'kotlin', label: '📱 Kotlin', editorLanguage: 'kotlin' },
  { key: 'swift', label: '🐦 Swift', editorLanguage: 'swift' },
]
const LANGUAGE_TOPIC_DEFS = {
  java: [
    { key: 'fundamentals', label: '01. Basics + Control Flow', bank: 'fundamentals' },
    { key: 'strings', label: '02. Strings', bank: 'strings' },
    { key: 'arrays', label: '03. Arrays', bank: 'arrays' },
    { key: 'oop', label: '04. OOP', bank: 'oop' },
    { key: 'collections', label: '05. Collections Framework', bank: 'collections' },
    { key: 'concurrency', label: '06. Multithreading', bank: 'concurrency' },
    { key: 'recursion', label: '07. Recursion', bank: 'recursion' },
    { key: 'algorithms', label: '08. Searching & Sorting', bank: 'algorithms' },
    { key: 'errors', label: '09. Exception Handling', bank: 'errors' },
    { key: 'io', label: '10. File I/O', bank: 'io' },
    { key: 'languageFeatures', label: '11. Generics', bank: 'languageFeatures' },
    { key: 'advancedApis', label: '12. Streams API', bank: 'advancedApis' },
    { key: 'dataAccess', label: '13. JDBC Basics', bank: 'dataAccess' },
    { key: 'patterns', label: '14. DSA Patterns', bank: 'patterns' },
    { key: 'misc', label: '15. Mixed Practice', bank: 'misc' },
  ],
  cpp: [
    { key: 'fundamentals', label: '01. C++ Basics + Control Flow', bank: 'fundamentals' },
    { key: 'strings', label: '02. Strings in C++', bank: 'strings' },
    { key: 'arrays', label: '03. Arrays & Vectors', bank: 'arrays' },
    { key: 'oop', label: '04. OOP in C++', bank: 'oop' },
    { key: 'collections', label: '05. STL Containers', bank: 'collections' },
    { key: 'concurrency', label: '06. std::thread & Concurrency', bank: 'concurrency' },
    { key: 'recursion', label: '07. Recursion', bank: 'recursion' },
    { key: 'algorithms', label: '08. STL Algorithms + Sorting', bank: 'algorithms' },
    { key: 'errors', label: '09. Exception Handling', bank: 'errors' },
    { key: 'io', label: '10. File Streams', bank: 'io' },
    { key: 'languageFeatures', label: '11. Templates', bank: 'languageFeatures' },
    { key: 'advancedApis', label: '12. Functional Utilities', bank: 'advancedApis' },
    { key: 'dataAccess', label: '13. Persistence Basics', bank: 'dataAccess' },
    { key: 'patterns', label: '14. Competitive DSA Patterns', bank: 'patterns' },
    { key: 'misc', label: '15. Mixed Practice', bank: 'misc' },
  ],
  c: [
    { key: 'fundamentals', label: '01. C Basics + Control Flow', bank: 'fundamentals' },
    { key: 'strings', label: '02. Strings in C', bank: 'strings' },
    { key: 'arrays', label: '03. Arrays', bank: 'arrays' },
    { key: 'pointers', label: '04. Pointers', bank: 'patterns' },
    { key: 'structures', label: '05. Structures & Unions', bank: 'languageFeatures' },
    { key: 'memory', label: '06. Dynamic Memory (malloc/free)', bank: 'io' },
    { key: 'recursion', label: '07. Recursion', bank: 'recursion' },
    { key: 'algorithms', label: '08. Searching & Sorting', bank: 'algorithms' },
    { key: 'input-output', label: '09. Standard I/O (stdio)', bank: 'io' },
    { key: 'file-io', label: '10. File Handling in C', bank: 'io' },
    { key: 'preprocessor', label: '11. Preprocessor & Macros', bank: 'languageFeatures' },
    { key: 'bitwise', label: '12. Bitwise Operations', bank: 'patterns' },
    { key: 'linked-lists', label: '13. Linked Lists', bank: 'collections' },
    { key: 'dsa-patterns', label: '14. DSA Patterns in C', bank: 'patterns' },
    { key: 'misc', label: '15. Mixed Practice', bank: 'misc' },
  ],
}

function defaultTopicsFor(languageLabel) {
  return [
    { key: 'fundamentals', label: `01. ${languageLabel} Fundamentals`, bank: 'fundamentals' },
    { key: 'strings', label: `02. Strings in ${languageLabel}`, bank: 'strings' },
    { key: 'arrays', label: `03. Arrays / Lists`, bank: 'arrays' },
    { key: 'oop', label: `04. OOP in ${languageLabel}`, bank: 'oop' },
    { key: 'collections', label: `05. Collections & Data Types`, bank: 'collections' },
    { key: 'concurrency', label: `06. Concurrency / Async`, bank: 'concurrency' },
    { key: 'recursion', label: '07. Recursion', bank: 'recursion' },
    { key: 'algorithms', label: '08. Searching & Sorting', bank: 'algorithms' },
    { key: 'errors', label: '09. Error Handling', bank: 'errors' },
    { key: 'io', label: '10. File I/O', bank: 'io' },
    { key: 'languageFeatures', label: `11. ${languageLabel} Language Features`, bank: 'languageFeatures' },
    { key: 'advancedApis', label: '12. Advanced APIs', bank: 'advancedApis' },
    { key: 'dataAccess', label: '13. Data Access & Integration', bank: 'dataAccess' },
    { key: 'patterns', label: '14. DSA Patterns', bank: 'patterns' },
    { key: 'misc', label: '15. Mixed Practice', bank: 'misc' },
  ]
}

export function getPracticeTopics(languageKey) {
  const lang = PRACTICE_LANGUAGES.find(l => l.key === languageKey)
  return LANGUAGE_TOPIC_DEFS[languageKey] || defaultTopicsFor(lang?.label || 'Language')
}

export const DEFAULT_BOILERPLATE_BY_LANGUAGE = {
  java: `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    // Your code here
    return 0;
}
`,
  javascript: `function main() {
  // Your code here
}
main();
`,
  c: `#include <stdio.h>
int main() {
    // Your code here
    return 0;
}
`,
  python: `def main():
    # Your code here
    pass

if __name__ == "__main__":
    main()
`,
  typescript: `function main(): void {
  // Your code here
}
main();
`,
  go: `package main
import "fmt"
func main() {
    // Your code here
    fmt.Println("")
}
`,
  rust: `fn main() {
    // Your code here
}
`,
  kotlin: `fun main() {
    // Your code here
}
`,
  swift: `import Foundation
// Your code here
`,
}

const TOPIC_DESCRIPTIONS = {
  fundamentals: {
    desc: "Work with basic control flow, variables, and arithmetic operations. This section focuses on the building blocks of the language.",
    input: "Varies by problem. Typically standard input values.",
    output: "The result of the specific fundamental operation.",
    constraints: "Standard primitive type limits."
  },
  strings: {
    desc: "Perform advanced string manipulation, parsing, and pattern matching. String handling is a core skill for any software engineer.",
    input: "Single or multiple lines of string data.",
    output: "The transformed string or calculated metric.",
    constraints: "Length up to 10^5 characters."
  },
  arrays: {
    desc: "Master linear data structures. These problems cover traversal, searching, and in-place transformations in arrays/vectors.",
    input: "An integer N followed by N space-separated elements.",
    output: "Array after transformation or a derived scalar value.",
    constraints: "1 ≤ N ≤ 10^6, -10^9 ≤ elements ≤ 10^9"
  },
  oop: {
    desc: "Apply Object-Oriented Programming principles including Encapsulation, Inheritance, and Polymorphism to model real-world entities.",
    input: "Configuration data for object state.",
    output: "Object behavior output or state audit.",
    constraints: "Standard JVM/Native heap limits."
  },
  collections: {
    desc: "Utilize built-in data structures like Maps, Sets, and Priority Queues to solve complex organizational problems efficiently.",
    input: "Sequence of elements to be organized.",
    output: "Elements after collection processing or search results.",
    constraints: "Time Complexity: O(log N) or O(1) per operation."
  },
  concurrency: {
    desc: "Design and implement multi-threaded solutions. Focus on synchronization, thread safety, and resource management.",
    input: "Workload parameters for parallel execution.",
    output: "Success confirmation or result of aggregate parallel work.",
    constraints: "Avoid deadlocks and race conditions."
  },
  recursion: {
    desc: "Solve problems using the divide-and-conquer paradigm. Break complex tasks into smaller sub-problems of the same type.",
    input: "Recursion depth or base case parameters.",
    output: "The result of the recursive computation.",
    constraints: "Recursion depth ≤ 1000 to avoid stack overflow."
  },
  algorithms: {
    desc: "Implement classic searching and sorting algorithms. Understand the trade-offs between different algorithmic approaches.",
    input: "Unsorted or unsearched data set.",
    output: "Sorted data or location of the target element.",
    constraints: "Optimized time complexity expected (e.g., O(N log N))."
  },
  errors: {
    desc: "Practice robust code design by implementing comprehensive error handling and input validation logic.",
    input: "Potentially malformed or edge-case input data.",
    output: "The valid result or a structured error message.",
    constraints: "Handle all checked and unchecked exceptions."
  },
  io: {
    desc: "Manage file system interactions. Read from and write to external data sources using streams and buffers.",
    input: "File paths and content streams.",
    output: "File operation confirmation or processed content.",
    constraints: "Ensure resources are properly closed after use."
  },
  languageFeatures: {
    desc: "Explore advanced language-specific features such as Generics, Annotations, and specialized memory management.",
    input: "Type-safe parameters and generic data.",
    output: "Successfully typed or processed data.",
    constraints: "Compile-time safety required."
  },
  advancedApis: {
    desc: "Leverage modern functional APIs like Streams, Lambdas, and Optional for concise and readable code.",
    input: "Data streams to be processed functionally.",
    output: "Mapped or reduced data result.",
    constraints: "Prefer functional interfaces over imperative loops."
  },
  dataAccess: {
    desc: "Implement data persistence logic. Simulate or execute database operations using standard drivers and patterns.",
    input: "Query parameters and record data.",
    output: "Affected row counts or retrieved records.",
    constraints: "Prevention of injection attacks and connection leaks."
  },
  patterns: {
    desc: "Master common Data Structures and Algorithms patterns used in high-level coding interviews (e.g., Two Pointers, Sliding Window).",
    input: "Complex data structures (Grids, Trees, Graphs).",
    output: "The optimal solution or path found.",
    constraints: "Optimal Time and Space complexity is mandatory."
  },
  misc: {
    desc: "A collection of practical, real-world utility problems that test your ability to build complete mini-applications.",
    input: "Full application input parameters.",
    output: "Final state of the simulated mini-app.",
    constraints: "Functional completeness is the priority."
  }
}

function buildQuestion(topicLabel, title, idx, languageLabel, topicBank) {
  const difficulty = idx < 8 ? 'Easy' : idx < 15 ? 'Medium' : 'Hard'
  const td = TOPIC_DESCRIPTIONS[topicBank] || TOPIC_DESCRIPTIONS.misc
  
  const a = idx + 2
  const b = idx + 5
  const arr = [a, b, a + b, a * 2, b * 2]
  const sampleByTopic = {
    fundamentals: { input: `${a} ${b}`, output: `${a + b}` },
    strings: { input: `skillbite${idx}`, output: `${`skillbite${idx}`.split('').reverse().join('')}` },
    arrays: { input: `${arr.length}\n${arr.join(' ')}`, output: `${arr.reduce((s, n) => s + n, 0)}` },
    oop: { input: `Student${idx} ${60 + idx}`, output: `Student${idx} - ${60 + idx}` },
    collections: { input: `7\n1 2 2 3 4 4 ${idx}`, output: `${new Set([1, 2, 2, 3, 4, 4, idx]).size}` },
    concurrency: { input: `${idx + 1}`, output: `Task-${idx + 1} completed` },
    recursion: { input: `${Math.min(10, idx + 3)}`, output: `${[1,2,6,24,120,720,5040,40320,362880,3628800][Math.min(9, idx + 2)]}` },
    algorithms: { input: `6\n9 3 7 1 4 ${idx}`, output: `${[9,3,7,1,4,idx].sort((x, y) => x - y).join(' ')}` },
    errors: { input: `${10 + idx} ${idx % 3 === 0 ? 0 : 2}`, output: idx % 3 === 0 ? 'Error' : `${Math.floor((10 + idx) / 2)}` },
    io: { input: `line one ${idx}\nline two ${idx}\nline three ${idx}`, output: '3' },
    languageFeatures: { input: `${a} ${b}`, output: `Pair(${a}, ${b})` },
    advancedApis: { input: `6\n1 2 3 4 5 ${idx}`, output: `${[1,2,3,4,5,idx].filter(n => n % 2 === 0).join(' ') || 'none'}` },
    dataAccess: { input: `id=${idx + 1},name=User${idx + 1}`, output: 'Inserted 1 row' },
    patterns: { input: `7\n1 3 -1 -3 5 3 ${idx}\n3`, output: `${Math.max(1,3,-1)} ${Math.max(3,-1,-3)} ${Math.max(-1,-3,5)}` },
    misc: { input: `2026-03-${String((idx % 28) + 1).padStart(2, '0')}`, output: 'VALID' },
  }
  const sample = sampleByTopic[topicBank] || { input: `${a} ${b}`, output: `${a + b}` }

  const fullDesc = `### 1. Problem Title
**${title}**

### 2. Problem Description
Solve the **${title}** challenge by writing efficient code in **${languageLabel}**. ${td.desc} This module focuses on practical application of core concepts to build real-world software engineering skills. 

### 3. Input Format
- ${td.input}

### 4. Output Format
- ${td.output}

### 5. Constraints
- **Complexity:** ${td.constraints}
- **Language:** ${languageLabel} specific syntax is required.

### 6. Examples
**Example Input:**
\`\`\`
${sample.input}
\`\`\`
**Example Output:**
\`\`\`
${sample.output}
\`\`\`

### 7. Explanation
The logic processes the provided input sequence through the lens of the **${topicLabel}** framework. For the sample input, the algorithm generates the target output by applying optimized logic relevant to the **${topicBank}** category.

### 8. Notes
Always ensure proper memory management and handle potential edge cases related to large input sizes.`

  return {
    title,
    difficulty,
    description: title, // UI will only show title now
    fullDescription: fullDesc,
    input: sample.input,
    output: sample.output,
    constraints: td.constraints,
  }
}

export const practiceQuestions = PRACTICE_LANGUAGES.reduce((langAcc, language) => {
  const topicDefs = getPracticeTopics(language.key)
  langAcc[language.key] = topicDefs.reduce((topicAcc, topic) => {
    const titles = TOPIC_QUESTIONS[topic.bank] || TOPIC_QUESTIONS.misc
    topicAcc[topic.key] = titles.slice(0, 20).map((title, idx) => buildQuestion(topic.label, title, idx, language.label, topic.bank))
    return topicAcc
  }, {})
  return langAcc
}, {})


