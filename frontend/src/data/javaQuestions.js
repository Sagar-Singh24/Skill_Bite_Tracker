const TOPIC_DEFS = [
  { key: 'basics-control-flow', label: '01. Basics + Control Flow' },
  { key: 'strings', label: '02. Strings' },
  { key: 'arrays', label: '03. Arrays' },
  { key: 'oop', label: '04. OOP' },
  { key: 'collections', label: '05. Collections' },
  { key: 'multithreading', label: '06. Multithreading' },
  { key: 'recursion', label: '07. Recursion' },
  { key: 'searching-sorting', label: '08. Searching & Sorting' },
  { key: 'exceptions', label: '09. Exception Handling' },
  { key: 'file-io', label: '10. File I/O' },
  { key: 'generics', label: '11. Generics' },
  { key: 'streams', label: '12. Streams API' },
  { key: 'jdbc', label: '13. JDBC Basics' },
  { key: 'dsa-patterns', label: '14. DSA Patterns' },
  { key: 'misc', label: '15. Mixed Practice' },
]

export const JAVA_TOPICS = TOPIC_DEFS.map(({ key, label }) => ({ key, label }))

const TOPIC_QUESTIONS = {
  'basics-control-flow': ['Sum of Two Numbers','Even or Odd','Largest of Three','Simple Interest','Leap Year Check','Grade Calculator','Swap Two Numbers','Absolute Difference','Power of Number','Average of N Numbers','FizzBuzz','Positive/Negative/Zero','Character Case Check','Triangle Validity','Profit or Loss','Calculator Using Switch','Multiplication Table','Count Digits','Reverse Number','Palindrome Number'],
  strings: ['Reverse String','Palindrome String','Count Vowels','Remove Whitespaces','Anagram Check','First Non-Repeating Character','Frequency of Characters','Longest Word in Sentence','Toggle Case','Substring Count','String Compression','Valid Parentheses','Check Rotation','Roman to Integer','Integer to Roman','Longest Common Prefix','Capitalize Each Word','Remove Duplicate Characters','Word Count','String to Integer Parser'],
  arrays: ['Array Sum','Maximum Element','Minimum Element','Second Largest','Rotate Array Right','Move Zeros to End','Remove Duplicates Sorted Array','Two Sum','Prefix Sum Queries','Kadane Maximum Subarray','Merge Two Sorted Arrays','Intersection of Two Arrays','Majority Element','Product Except Self','Sort 0 1 2','Binary Search in Array','Find Missing Number','Find Duplicate Number','Subarray with Given Sum','Spiral Matrix Traversal'],
  oop: ['Create Student Class','Bank Account Encapsulation','Constructor Overloading','Method Overloading','Method Overriding','Single Inheritance Demo','Multilevel Inheritance Demo','Abstract Class Shape','Interface Payment','Polymorphism Animals','Aggregation Library-Book','Composition Car-Engine','Static Member Counter','Final Keyword Example','Equals and HashCode','Comparable Student Sort','Cloneable Object Demo','Singleton Class','Builder Pattern Object','Immutable Class'],
  collections: ['Unique Elements with HashSet','Word Frequency with HashMap','Sort List with Collections','LinkedList Operations','PriorityQueue Min Heap','Stack Implementation','Queue via ArrayDeque','TreeSet Sorted Unique','TreeMap Sorted Keys','Group Anagrams','LRU Cache Design','Top K Frequent Elements','Count Distinct in Window','Merge Intervals','Employee Map by Department','Set Difference/Union/Intersection','Frequency Sort by Value','Iterator Remove Even Numbers','Custom Comparator Sort','Flatten List of Lists'],
  multithreading: ['Create Thread with Runnable','Create Thread with Lambda','Thread Sleep Demo','Thread Join Demo','Synchronized Counter','Producer Consumer (wait/notify)','Deadlock Demonstration','ReentrantLock Example','Semaphore Example','ExecutorService Fixed Pool','Callable and Future','CountDownLatch Example','CyclicBarrier Example','Volatile Flag Stop Thread','AtomicInteger Counter','ThreadLocal Context','ReadWriteLock Example','CompletableFuture Chain','Parallel Sum using ForkJoin','ScheduledExecutorService Task'],
  recursion: ['Factorial Using Recursion','Fibonacci Using Recursion','Power Function','Sum of Digits','Reverse String Recursively','Binary Search Recursively','Tower of Hanoi','Generate Subsets','Generate Permutations','Combination Sum','N-Queens','Sudoku Solver','Merge Sort Recursive','Quick Sort Recursive','Check Palindrome Recursively','Count Paths in Grid','Climbing Stairs','Josephus Problem','Recursive GCD','Decode Ways'],
  'searching-sorting': ['Linear Search','Binary Search','Lower Bound','Upper Bound','Bubble Sort','Selection Sort','Insertion Sort','Merge Sort','Quick Sort','Heap Sort','Count Sort','Radix Sort','Search in Rotated Sorted Array','Find Peak Element','Kth Smallest Element','Median of Two Sorted Arrays','Search 2D Matrix','Sort by Frequency','Topological Sort','Dijkstra Shortest Path'],
  exceptions: ['Safe Integer Division','Custom InvalidAgeException','Multiple Catch Blocks','Finally Cleanup Demo','Try-with-Resources File Read','Throw vs Throws Demo','Parse Input with Exception Handling','Nested Try-Catch','User Input Validation','Global Exception Handler Pattern','Retry on Failure','Checked vs Unchecked Demo','Suppressing Exceptions','Exception Chaining','Custom Error Codes','Batch Processing with Error Log','Graceful Degradation Demo','Handle NumberFormatException','Handle ArrayIndexOutOfBounds','Handle NullPointerException'],
  'file-io': ['Read File Line by Line','Write Text to File','Append to Existing File','Copy File Content','Count Words in File','Count Lines in File','Find Longest Line','CSV Parser Basic','JSON Read/Write Basic','Directory Listing','Filter Files by Extension','Serialize Object to File','Deserialize Object from File','Read Large File Buffered','Create Temp File','File Rename Utility','Delete Old Files','Merge Two Text Files','Split File by Size','Read Config Properties File'],
  generics: ['Generic Box Class','Generic Pair Class','Generic Method Max','Bounded Type Parameter','Wildcard Read-Only List','Wildcard Write List','Generic Repository Interface','Generic Stack Implementation','Generic Queue Implementation','Type Erasure Demo','Comparator with Generics','Generic Utility Swap','Generic Method PrintArray','Multiple Bounds Example','Generic Map Wrapper','Generic Result Type','Covariance/Contravariance Demo','Generic Builder','Generic Filter Function','Generic Merge Function'],
  streams: ['Filter Even Numbers','Map to Squares','Reduce Sum','Group by Length','Count by Condition','Find First Match','AnyMatch/AllMatch Demo','Sort by Custom Comparator','Distinct Elements','FlatMap Nested Lists','Partition by Predicate','Collectors toMap','Top N Elements Stream','Windowed Processing Basic','Joining Strings','Summary Statistics','Parallel Stream Demo','Handle Optional Safely','Convert Stream to Set','Stream from File Lines'],
  jdbc: ['Connect to Database','Insert Row PreparedStatement','Update Row PreparedStatement','Delete Row PreparedStatement','Select Single Row','Select All Rows','Batch Insert','Transaction Commit/Rollback','CallableStatement Procedure','Pagination Query','DAO Pattern User','Connection Pool Basic','JDBC Metadata Demo','Map ResultSet to Object','Safe Resource Closing','SQL Injection Prevention','Dynamic Query Builder','Join Query Mapping','Upsert Record','Audit Logging Table'],
  'dsa-patterns': ['Sliding Window Max Sum','Two Pointers Pair Sum','Fast Slow Cycle Detection','Prefix Sum Subarray Count','Difference Array Range Update','Monotonic Stack Next Greater','Monotonic Queue Sliding Max','Greedy Interval Scheduling','Binary Search on Answer','Backtracking Word Search','Union Find Connected Components','BFS Shortest Path Grid','DFS Connected Regions','Top K with Heap','Trie Prefix Search','Segment Tree Range Sum','Fenwick Tree Range Update','Bitmask Subset DP','Knapsack 0/1','Longest Increasing Subsequence'],
  misc: ['Mini URL Parser','Expression Evaluator','Infix to Postfix','Postfix Evaluator','LRU Cache from Scratch','Rate Limiter Token Bucket','Scheduler Round Robin','Basic Logger with Levels','Simple Chat Server Threads','JSON Pretty Printer','Markdown Heading Parser','Phone Number Formatter','Password Strength Checker','IP Address Validator','Email Validator','Date Difference Calculator','Currency Formatter','Command Line Todo App','Mini Quiz Engine','Mini Banking Simulator'],
}

const JAVA_TOPIC_DESCRIPTIONS = {
  '01. Basics + Control Flow': {
    desc: "Foundational Java programming covering variable types, operators, and control flow structures (if/else, switch, loops).",
    input: "Varies. Typically primitive values via Scanner(System.in).",
    output: "The computed result formatted as a string.",
    constraints: "Standard Java primitive limits."
  },
  '02. Strings': {
    desc: "In-depth string manipulation using String, StringBuilder, and StringBuffer classes. Focus on immutability and performance.",
    input: "String data, occasionally with multiple lines.",
    output: "Modified string or extracted information.",
    constraints: "Memory efficient handling of large strings."
  },
  '03. Arrays': {
    desc: "Single and multi-dimensional array operations. Includes sorting, searching, and advanced traversal techniques.",
    input: "Size N, followed by N elements.",
    output: "Array result or computed statistic.",
    constraints: "O(N) or O(N log N) time complexity usually required."
  },
  '04. OOP': {
    desc: "Application of Java's Object-Oriented pillars: Encapsulation, Inheritance, Polymorphism, and Abstraction.",
    input: "Object initialization parameters.",
    output: "Output of object methods or validated state.",
    constraints: "Strict adherence to access modifiers."
  },
  '05. Collections': {
    desc: "Utilizing the Java Collections Framework (List, Map, Set, Queue) for optimal data management and retrieval.",
    input: "Data sequence for collection processing.",
    output: "Sorted, filtered, or transformed collection data.",
    constraints: "Use appropriate Collection type for O(1) or O(log N) operations."
  },
  '06. Multithreading': {
    desc: "Concurrency in Java using Thread, Runnable, and the Concurrency API (Locks, Semaphores, ExecutorService).",
    input: "Workload distribution parameters.",
    output: "Thread execution logs or synchronized result.",
    constraints: "Must be thread-safe and free of deadlocks."
  },
  '07. Recursion': {
    desc: "Recursive algorithm design in Java. Understanding stack frames and base cases for complex problem solving.",
    input: "Recursive state or depth parameter.",
    output: "Final result of the recursive call stack.",
    constraints: "Recursion depth must not exceed 10^4."
  },
  '08. Searching & Sorting': {
    desc: "Implementation of standard search (linear, binary) and sort (merge, quick, heap) algorithms in Java.",
    input: "Unordered collection or search target.",
    output: "Ordered output or index of found item.",
    constraints: "Optimal Big-O complexity for the specific algorithm."
  },
  '09. Exception Handling': {
    desc: "Writing robust Java code using try-catch-finally, custom exceptions, and the try-with-resources statement.",
    input: "Inputs designed to test edge cases and error paths.",
    output: "Valid result or caught exception detail.",
    constraints: "Internal state must remain consistent after exceptions."
  },
  '10. File I/O': {
    desc: "External data management using java.io and java.nio packages. Reading/writing files and directories.",
    input: "Buffered or unbuffered byte/character streams.",
    output: "Operation status or processed file content.",
    constraints: "All streams must be closed using try-with-resources."
  },
  '11. Generics': {
    desc: "Type-safe programming in Java. Implementing generic classes, methods, and using wildcards (? extends T).",
    input: "Generic type parameters.",
    output: "Type-consistent data processing results.",
    constraints: "Compile-time safety with zero unchecked warnings."
  },
  '12. Streams API': {
    desc: "Functional-style data processing introduced in Java 8. Includes filter, map, reduce, and collectors.",
    input: "Collection or source to be streamed.",
    output: "Reduced or collected result.",
    constraints: "Efficient one-pass processing. Avoid side effects."
  },
  '13. JDBC Basics': {
    desc: "Database connectivity and operations. Using Connection, Statement, and ResultSet safely.",
    input: "SQL query parameters and database records.",
    output: "Row count or mapped domain objects.",
    constraints: "Protection against SQL injection via PreparedStatement."
  },
  '14. DSA Patterns': {
    desc: "Advanced algorithmic patterns (Sliding Window, Two Pointers, Backtracking) implemented using Java.",
    input: "High-complexity data structures.",
    output: "The optimal solution for the algorithmic challenge.",
    constraints: "Time: 1s, Memory: 256MB."
  },
  '15. Mixed Practice': {
    desc: "Comprehensive Java challenges that combine multiple features and design patterns for real-world scenarios.",
    input: "Project-level input data.",
    output: "End-to-end verified application behavior.",
    constraints: "Clean, modular, and performant code structure."
  }
}

function buildQuestion(topicLabel, title, idx) {
  const difficulty = idx < 8 ? 'Easy' : idx < 15 ? 'Medium' : 'Hard'
  const td = JAVA_TOPIC_DESCRIPTIONS[topicLabel] || JAVA_TOPIC_DESCRIPTIONS['15. Mixed Practice']
  const a = idx + 2
  const b = idx + 5
  const arr = [a, b, a + b, a * 2, b * 2]
  const sampleByTopic = {
    '01. Basics + Control Flow': { input: `${a} ${b}`, output: `${a + b}` },
    '02. Strings': { input: `skillbite${idx}`, output: `${`skillbite${idx}`.split('').reverse().join('')}` },
    '03. Arrays': { input: `${arr.length}\n${arr.join(' ')}`, output: `${arr.reduce((s, n) => s + n, 0)}` },
    '04. OOP': { input: `Student${idx} ${60 + idx}`, output: `Student${idx} - ${60 + idx}` },
    '05. Collections': { input: `7\n1 2 2 3 4 4 ${idx}`, output: `${new Set([1, 2, 2, 3, 4, 4, idx]).size}` },
    '06. Multithreading': { input: `${idx + 1}`, output: `Thread-${idx + 1} completed` },
    '07. Recursion': { input: `${Math.min(10, idx + 3)}`, output: `${[1,2,6,24,120,720,5040,40320,362880,3628800][Math.min(9, idx + 2)]}` },
    '08. Searching & Sorting': { input: `6\n9 3 7 1 4 ${idx}`, output: `${[9,3,7,1,4,idx].sort((x, y) => x - y).join(' ')}` },
    '09. Exception Handling': { input: `${10 + idx} ${idx % 3 === 0 ? 0 : 2}`, output: idx % 3 === 0 ? 'ArithmeticException' : `${Math.floor((10 + idx) / 2)}` },
    '10. File I/O': { input: `line one ${idx}\nline two ${idx}\nline three ${idx}`, output: `3` },
    '11. Generics': { input: `${a} ${b}`, output: `Pair(${a}, ${b})` },
    '12. Streams API': { input: `6\n1 2 3 4 5 ${idx}`, output: `${[1,2,3,4,5,idx].filter(n => n % 2 === 0).join(' ') || 'none'}` },
    '13. JDBC Basics': { input: `id=${idx + 1},name=User${idx + 1}`, output: `Inserted 1 row` },
    '14. DSA Patterns': { input: `7\n1 3 -1 -3 5 3 ${idx}\n3`, output: `${Math.max(1,3,-1)} ${Math.max(3,-1,-3)} ${Math.max(-1,-3,5)}` },
    '15. Mixed Practice': { input: `2026-03-${String((idx % 28) + 1).padStart(2, '0')}`, output: `VALID` },
  }
  const sample = sampleByTopic[topicLabel] || { input: `${a} ${b}`, output: `${a + b}` }

  const fullDesc = `### 1. Problem Title
**${title}**

### 2. Problem Description
Achieve mastery in Java by solving the **${title}** module. ${td.desc} Focus on efficient object allocation, proper JVM resource management, and clean code principles.

### 3. Input Format
- ${td.input}

### 4. Output Format
- ${td.output}

### 5. Constraints
- **Execution Time:** 1.0s
- **Heap Memory:** 256MB
- **Logic:** ${td.constraints}

### 6. Example
**Input:**
\`\`\`
${sample.input}
\`\`\`
**Output:**
\`\`\`
${sample.output}
\`\`\`

### 7. Explanation
The Java solution processes the standard input using optimized APIs. For **${title}**, the transformation logic follows the **${topicLabel}** pattern to derive the expected output format.

### 8. Notes
Leverage Java 8+ features where applicable for more concise and maintainable code.`

  return {
    title,
    difficulty,
    description: title,
    fullDescription: fullDesc,
    input: sample.input,
    output: sample.output,
    constraints: td.constraints,
  }
}

export const javaQuestions = TOPIC_DEFS.reduce((acc, topic) => {
  const titles = TOPIC_QUESTIONS[topic.key] || []
  acc[topic.key] = titles.slice(0, 20).map((title, idx) => buildQuestion(topic.label, title, idx))
  return acc
}, {})

export const JAVA_DEFAULT_BOILERPLATE = `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}
`
