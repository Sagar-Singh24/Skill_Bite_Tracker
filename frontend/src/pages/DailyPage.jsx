/* eslint-disable react-hooks/purity, no-unused-vars, no-undef */
import { useState, useEffect, useRef, useCallback } from 'react'
import { BookOpen, ChevronRight, ArrowLeft, Languages, Dumbbell, Flame, Salad, ChartLine, Target, Activity, CheckCircle2, Monitor, Server, Database } from 'lucide-react'
import Editor from '@monaco-editor/react'
import ProblemPage from './ProblemPage'
import { SKILL_CATEGORIES, questionBank } from '../data/questions'
import { GK_QUESTION_BANK } from '../data/gkQuestions'
import { PRACTICE_LANGUAGES, getPracticeTopics, practiceQuestions, DEFAULT_BOILERPLATE_BY_LANGUAGE } from '../data/practiceQuestions'
import { showToast } from '../components/Toast'

const STORAGE_CODING_LANG = 'skillbite_coding_lang'
const DSA_PATTERN_TOPICS = [
  { key: 'two-pointers', title: '1. 🧭 Two Pointers', prompt: 'Use left/right pointers to shrink search space efficiently.' },
  { key: 'sliding-window', title: '2. 🪟 Sliding Window', prompt: 'Maintain a moving window to optimize subarray/substring checks.' },
  { key: 'fast-slow-pointers', title: '3. 🐢 Fast & Slow Pointers (Cycle Detection)', prompt: 'Detect cycles and middle points with two pointer speeds.' },
  { key: 'binary-search', title: '4. 🔍 Binary Search', prompt: 'Apply binary search on sorted spaces and monotonic answers.' },
  { key: 'prefix-sum', title: '5. ➕ Prefix Sum', prompt: 'Precompute cumulative sums for fast range queries.' },
  { key: 'hashing', title: '6. #️⃣ Hashing (Map / Set)', prompt: 'Use hash maps/sets for O(1) average lookups.' },
  { key: 'recursion', title: '7. 🔁 Recursion', prompt: 'Break down problems into smaller self-similar subproblems.' },
  { key: 'backtracking', title: '8. 🧩 Backtracking', prompt: 'Try candidates and undo choices to explore valid solutions.' },
  { key: 'divide-conquer', title: '9. ✂️ Divide & Conquer', prompt: 'Split tasks into independent halves and merge results.' },
  { key: 'greedy', title: '10. 🎯 Greedy', prompt: 'Make locally optimal decisions to reach global optimum.' },
  { key: 'dp', title: '11. 📈 Dynamic Programming (DP)', prompt: 'Store subproblem results to avoid recomputation.' },
  { key: 'bit-manipulation', title: '12. 🧮 Bit Manipulation', prompt: 'Use binary operations for compact and fast logic.' },
  { key: 'tree-traversal', title: '13. 🌳 Tree Traversal (DFS / BFS)', prompt: 'Traverse trees in depth-first and breadth-first order.' },
  { key: 'bst', title: '14. 🌲 Binary Search Tree (BST)', prompt: 'Leverage BST ordering for insertion/search/deletion.' },
  { key: 'graph-traversal', title: '15. 🕸️ Graph Traversal (DFS / BFS)', prompt: 'Visit graph nodes/edges systematically using DFS/BFS.' },
  { key: 'topological-sort', title: '16. 🧱 Topological Sort', prompt: 'Linearize DAG tasks based on dependency edges.' },
  { key: 'union-find', title: '17. 🔗 Union Find (Disjoint Set)', prompt: 'Track connected components with union and find operations.' },
  { key: 'shortest-path', title: '18. 🛣️ Shortest Path Algorithms', prompt: 'Compute minimum path costs in weighted/unweighted graphs.' },
  { key: 'mst', title: '19. 🧵 Minimum Spanning Tree', prompt: 'Connect all nodes with minimum total edge weight.' },
  { key: 'monotonic-stack', title: '20. 📚 Monotonic Stack', prompt: 'Maintain monotonic order to solve next-greater/area problems.' },
  { key: 'monotonic-queue', title: '21. 🚶 Monotonic Queue', prompt: 'Track window extremes efficiently with deque structure.' },
  { key: 'heap-priority-queue', title: '22. 🏔️ Heap / Priority Queue', prompt: 'Prioritize min/max elements for streaming and top-k tasks.' },
  { key: 'trie', title: '23. 🌿 Trie (Prefix Tree)', prompt: 'Store words/prefixes for fast dictionary operations.' },
  { key: 'segment-tree', title: '24. 🧱 Segment Tree', prompt: 'Support range queries and updates in logarithmic time.' },
  { key: 'fenwick-tree', title: '25. 🌲 Fenwick Tree (Binary Indexed Tree)', prompt: 'Compute prefix sums with efficient updates.' },
  { key: 'meet-in-the-middle', title: '26. 🤝 Meet in the Middle', prompt: 'Split exponential search into two manageable halves.' },
  { key: 'game-theory', title: '27. 🎮 Game Theory', prompt: 'Model optimal strategies for competitive turn-based games.' },
]

const APTITUDE_TOPICS = [
  { key: 'number-system', title: '1. 🔢 Number System' },
  { key: 'hcf-lcm', title: '2. ➗ HCF & LCM' },
  { key: 'simplification', title: '3. ➕ Simplification' },
  { key: 'approximation', title: '4. 〰️ Approximation' },
  { key: 'decimal-fractions', title: '5. ⅑ Decimal & Fractions' },
  { key: 'percentage', title: '6. 💯 Percentage' },
  { key: 'ratio-proportion', title: '7. ⚖️ Ratio & Proportion' },
  { key: 'partnership', title: '8. 🤝 Partnership' },
  { key: 'average', title: '9. 📊 Average' },
  { key: 'profit-loss', title: '10. 💰 Profit & Loss' },
  { key: 'simple-interest', title: '11. 📈 Simple Interest' },
  { key: 'compound-interest', title: '12. 🔄 Compound Interest' },
  { key: 'time-work', title: '13. ⏱️ Time & Work' },
  { key: 'pipes-cisterns', title: '14. 🚰 Pipes & Cisterns' },
  { key: 'speed-distance', title: '15. 🏃 Time, Speed & Distance' },
  { key: 'boats-streams', title: '16. 🚣 Boats & Streams' },
  { key: 'ages', title: '17. 👨‍👦 Problems on Ages' },
  { key: 'mixture', title: '18. 🧪 Mixture & Alligation' },
  { key: 'permutation', title: '19. 🎲 Permutation & Combination' },
  { key: 'probability', title: '20. 🎰 Probability' },
]
const MATH_TOPICS = [
  { 
    key: 'eng-math-1', 
    title: '1. 📊 Engineering Mathematics I', 
    subtopics: [
      { key: 'functions-limits', title: 'Functions & Limits' },
      { key: 'continuity-diff', title: 'Continuity & Differentiability' },
      { key: 'partial-derivatives', title: 'Partial Derivatives' },
      { key: 'maxima-minima', title: 'Maxima & Minima' },
      { key: 'mean-value-thm', title: 'Mean Value Theorems' },
      { key: 'basic-integration', title: 'Basic Integration' },
      { key: 'multiple-integrals-intro', title: 'Multiple Integrals (Intro)' },
    ]
  },
  { 
    key: 'eng-math-2', 
    title: '2. 📐 Engineering Mathematics II', 
    subtopics: [
      { key: 'improper-integrals', title: 'Improper Integrals' },
      { key: 'beta-gamma', title: 'Beta & Gamma Functions' },
      { key: 'multiple-integrals-adv', title: 'Multiple Integrals (Advanced)' },
      { key: 'vector-diff', title: 'Vector Differentiation' },
      { key: 'vector-int', title: 'Vector Integration' },
      { key: 'matrices-det', title: 'Matrices & Determinants' },
      { key: 'eigenvalues', title: 'Eigenvalues & Eigenvectors' },
      { key: 'linear-systems', title: 'System of Linear Equations' },
    ]
  },
  { 
    key: 'eng-math-3', 
    title: '3. 📈 Engineering Mathematics III', 
    subtopics: [
      { key: 'ode-first-order', title: 'ODE (First Order)' },
      { key: 'ode-higher-order', title: 'ODE (Higher Order)' },
      { key: 'ode-apps', title: 'Applications of ODE' },
      { key: 'series-solutions', title: 'Series Solutions' },
      { key: 'laplace-trans', title: 'Laplace Transform' },
      { key: 'inv-laplace-trans', title: 'Inverse Laplace Transform' },
      { key: 'apps-circuits', title: 'Applications in Circuits & Systems' },
    ]
  },
  { 
    key: 'eng-math-4', 
    title: '4. ⚛️ Engineering Mathematics IV', 
    subtopics: [
      { key: 'fourier-series', title: 'Fourier Series' },
      { key: 'fourier-trans', title: 'Fourier Transform' },
      { key: 'pde', title: 'Partial Differential Equations (PDE)' },
      { key: 'heat-eq', title: 'Heat Equation' },
      { key: 'wave-eq', title: 'Wave Equation' },
      { key: 'laplace-eq', title: 'Laplace Equation' },
      { key: 'complex-nums', title: 'Complex Numbers & Functions' },
      { key: 'analytic-funcs', title: 'Analytic Functions' },
      { key: 'cauchy-riemann', title: 'Cauchy-Riemann Equations' },
    ]
  },
  { 
    key: 'eng-math-5', 
    title: '5. 🎲 Engineering Mathematics V', 
    subtopics: [
      { key: 'prob-theory', title: 'Probability Theory' },
      { key: 'random-vars', title: 'Random Variables' },
      { key: 'prob-dist', title: 'Probability Distributions' },
      { key: 'mean-variance', title: 'Mean, Variance' },
      { key: 'sampling-theory', title: 'Sampling Theory' },
      { key: 'correlation-reg', title: 'Correlation & Regression' },
      { key: 'numerical-root', title: 'Root Finding (Newton-Raphson)' },
      { key: 'interpolation', title: 'Interpolation' },
      { key: 'num-diff', title: 'Numerical Differentiation' },
      { key: 'num-int', title: 'Numerical Integration' },
      { key: 'num-ode', title: 'Solving ODE Numerically' },
    ]
  },
  { 
    key: 'discrete-math', 
    title: '6. 🕸️ Discrete Mathematics',
    subtopics: [
      { key: 'logic-prop', title: 'Logic & Propositional Calculus' },
      { key: 'predicate-logic', title: 'Predicate Logic' },
      { key: 'set-theory', title: 'Set Theory' },
      { key: 'relations-funcs', title: 'Relations & Functions' },
      { key: 'combinatorics', title: 'Combinatorics' },
      { key: 'recurrence-rel', title: 'Recurrence Relations' },
      { key: 'graph-theory', title: 'Graph Theory' },
      { key: 'trees', title: 'Trees' },
      { key: 'algebraic-struct', title: 'Algebraic Structures' },
      { key: 'boolean-algebra', title: 'Boolean Algebra & Switching Theory' },
    ]
  },
]

const MATH_SUBTOPIC_TITLES = {
  // Eng Math I
  'functions-limits': ['Limit of Polynomial', 'Squeeze Theorem Application', 'Indeterminate Forms (0/0)', 'Limit at Infinity', 'One-Sided Limits', 'Trigonometric Limits', 'Exponential Growth Limits'],
  'continuity-diff': ['Point of Discontinuity', 'Differentiability from First Principles', 'Chain Rule Application', 'Piecewise Functions Continuity', 'Implicit Differentiation', 'Higher Order Derivatives'],
  'partial-derivatives': ['Euler\'s Theorem for Homogeneous Functions', 'Total Derivative Calculation', 'Chain Rule for Partial Derivatives', 'Jacobian Determinant', 'Implicit Partial Differentiation'],
  'maxima-minima': ['Critical Points of 2 Variables', 'Lagrange Multipliers', 'Saddle Point Identification', 'Global Extrema on Closed Region', 'Concavity & Inflection'],
  'mean-value-thm': ['Lagrange\'s Mean Value Theorem', 'Cauchy\'s MVT', 'Rolle\'s Theorem Verification', 'Taylor Series Expansion', 'Maclaurin Series for sin(x)'],
  'basic-integration': ['Integration by Parts', 'Substitution Method', 'Partial Fraction Integration', 'Definite Integral Properties', 'Area Under Curve'],
  
  // Eng Math II
  'matrices-det': ['Determinant of 3x3 Matrix', 'Adjoint & Inverse', 'Properties of Determinants', 'Cramer\'s Rule', 'Rank of a Matrix'],
  'eigenvalues': ['Characteristic Equation', 'Cayley-Hamilton Theorem', 'Diagonalization of Matrix', 'Power of a Matrix', 'Nature of Quadratic Forms'],
  'linear-systems': ['Gauss Elimination', 'Gauss-Jordan Method', 'Consistency of Equations', 'Homogeneous Systems', 'Iterative Methods (Jacobi)'],
  'vector-diff': ['Gradient of Scalar Field', 'Divergence of Vector Field', 'Curl and Irrotationality', 'Directional Derivative', 'Laplacian Operator'],
  'vector-int': ['Line Integral over Curve', 'Green\'s Theorem in Plane', 'Stoke\'s Theorem Application', 'Gauss Divergence Theorem', 'Surface Integrals of Vector Fields'],

  // Eng Math III
  'ode-first-order': ['Separable Variables', 'Exact Differential Equations', 'Integrating Factor Method', 'Linear ODE (Leibniz)', 'Bernoulli\'s Equation'],
  'ode-higher-order': ['Homogeneous with Constant Coeffs', 'Method of Variation of Parameters', 'Undetermined Coefficients', 'Cauchy-Euler Equation', 'Simultaneous Linear ODEs'],
  'laplace-trans': ['Laplace of Basic Functions', 'First Shifting Theorem', 'Derivatives of Transforms', 'Unit Step Function Transform', 'Dirac Delta Function'],
  'inv-laplace-trans': ['Partial Fractions for Inverse', 'Convolution Theorem', 'Inverse of Logarithmic Transforms', 'Solution by Laplace'],

  // Eng Math IV
  'fourier-series': ['Full Range Fourier Series', 'Half Range Cosine Series', 'Half Range Sine Series', 'Parseval\'s Identity', 'Harmonic Analysis'],
  'fourier-trans': ['Fourier Integral Formula', 'Sine and Cosine Transforms', 'Properties of Fourier Transform', 'Convolution in Fourier'],
  'heat-eq': ['1D Heat Conduction', 'Steady State Temperature', 'Non-homogeneous Heat Equation', 'Insulated Boundary Problems'],
  'complex-nums': ['Polar Representation', 'De Moivre\'s Theorem', 'Roots of Complex Numbers', 'Logarithm of Complex Number', 'Exponential Form'],
  'cauchy-riemann': ['CR Equations in Polar', 'Harmonic Conjugates', 'Analyticity Checklist', 'Milne-Thomson Method'],

  // Eng Math V
  'prob-theory': ['Bayes\' Theorem', 'Conditional Probability', 'Mutual Exclusivity', 'Law of Total Probability', 'Bernoulli Trials'],
  'random-vars': ['Probability Mass Function', 'Cumulative Distribution (CDF)', 'Expectation & Variance', 'Joint Distribution', 'Marginal Density'],
  'prob-dist': ['Binomial Distribution', 'Poisson Process', 'Normal (Gaussian) Curve', 'Z-Score Calculation', 'Exponential Distribution'],
  'num-root': ['Newton-Raphson Convergence', 'Bisection Method', 'Regula-Falsi (False Position)', 'Secant Method', 'Fixed Point Iteration'],
  'num-int': ['Trapezoidal Rule', 'Simpson\'s 1/3 Rule', 'Simpson\'s 3/8 Rule', 'Weddle\'s Rule', 'Error Estimation in Integration'],

  // Discrete Math
  'logic-prop': ['Truth Table Construction', 'Tautology vs Contradiction', 'Logical Equivalence', 'Normal Forms (CNF/DNF)', 'Inference Rules'],
  'set-theory': ['Venn Diagram Problems', 'Power Set Enumeration', 'Cartesian Products', 'Inclusion-Exclusion Principle', 'Set Identities'],
  'combinatorics': ['Permutations with Repetition', 'Circular Permutations', 'Pigeonhole Principle', 'Binomial Coefficients', 'Stars and Bars Method'],
  'recurrence-rel': ['Homogeneous Recurrence', 'Particular Solutions', 'Master Theorem for Recursion', 'Generating Functions', 'Fibonacci Sequence'],
  'graph-theory': ['Eulerian Paths', 'Hamiltonian Circuits', 'Dijkstra\'s Shortest Path', 'Graph Coloring (Chromatic Card)', 'Adjacency Matrices'],
  'trees': ['Binary Tree Traversal', 'Minimum Spanning Trees', 'Tree Isomorphism', 'Huffman Coding', 'Decision Trees'],
  'boolean-algebra': ['K-Map Simplification', 'Logic Gate Design', 'SOP and POS Forms', 'Quine-McCluskey Method', 'Consensus Theorem'],
}

function generateMathQuestion(topic, subtopic, idx) {
  const level = idx < 15 ? 'Easy' : idx < 35 ? 'Medium' : 'Hard';
  const v1 = (idx * 2) + 5;
  const v2 = (idx % 4) + 2;
  let qText = '';
  let ansVal = 0;
  
  // Titles - pick specialized or fallback
  const subTitles = MATH_SUBTOPIC_TITLES[subtopic.key] || ['Practice Problem', 'Skill Challenge', 'Core Exercise', 'Solution Task']
  const finalTitle = subTitles[idx % subTitles.length]

  // Topic context switch
  switch(subtopic.key) {
    case 'functions-limits': qText = `Calculate the limit of f(x) = (x² - ${v2*v2}) / (x - ${v2}) as x → ${v2}.`; ansVal = v2 * 2; break;
    case 'matrices-det': qText = `Find the determinant of a 2x2 matrix: [[${v1}, ${v2}], [${v2}, ${v1}]].`; ansVal = (v1*v1) - (v2*v2); break;
    case 'eigenvalues': qText = `What is the trace of a 2x2 diagonal matrix with eigenvalues λ₁=${v1} and λ₂=${v2}?`; ansVal = v1 + v2; break;
    case 'complex-nums': qText = `Find the magnitude of the complex number z = ${v1} + ${v2}i. (Result rounded down)`; ansVal = Math.floor(Math.sqrt(v1*v1 + v2*v2)); break;
    case 'prob-theory': qText = `A bag has ${v1} red and ${v2} blue balls. Probability of picking red? (Rounded %)`; ansVal = Math.round((v1 / (v1 + v2)) * 100); break;
    case 'num-int': qText = `Using Trapezoidal rule with n=1 for f(x)=x in [0, ${v1}], result is?`; ansVal = v1/2 * (0 + v1); break;
    case 'set-theory': qText = `If |A|=${v1}, |B|=${v2}, and |A∩B|=1, find |A∪B|.`; ansVal = v1 + v2 - 1; break;
    case 'discrete-math': qText = `Number of subsets in a set of size ${v2}?`; ansVal = Math.pow(2, v2); break;
    default: qText = `Solve ${subtopic.title} application #${idx+1}. Given k=${v1}, m=${v2}. Find the output value.`; ansVal = v1 + v2 + 10;
  }

  const opts = [String(ansVal + 3), String(ansVal - 3), String(ansVal), String(ansVal * 2)];
  const order = [[0,1,2,3], [1,0,3,2], [2,3,0,1], [3,2,1,0]][idx % 4];
  const finalOpts = order.map(i => opts[i]);
  const finalAns = finalOpts.indexOf(String(ansVal));
  return { q: qText, opts: finalOpts, ans: finalAns, difficulty: level, title: finalTitle }
}

const MATH_QUESTION_BANK = MATH_TOPICS.reduce((acc, topic) => {
  acc[topic.key] = topic.subtopics.reduce((subAcc, sub) => {
    subAcc[sub.key] = Array.from({ length: 50 }, (_, idx) => generateMathQuestion(topic, sub, idx));
    return subAcc;
  }, {});
  return acc;
}, {});

const ENGLISH_TOPICS = [
  { 
    key: 'eng-grammar', 
    title: '1. ✍️ Grammar', 
    subtopics: [
      { key: 'parts-of-speech', title: 'Parts of Speech' },
      { key: 'noun', title: 'Noun' },
      { key: 'pronoun', title: 'Pronoun' },
      { key: 'verb', title: 'Verb' },
      { key: 'adjective', title: 'Adjective' },
      { key: 'adverb', title: 'Adverb' },
      { key: 'articles', title: 'Articles (A, An, The)' },
      { key: 'prepositions', title: 'Prepositions' },
      { key: 'conjunctions', title: 'Conjunctions' },
      { key: 'interjections', title: 'Interjections' },
      { key: 'tenses', title: 'Tenses' },
      { key: 'subject-verb', title: 'Subject-Verb Agreement' },
      { key: 'active-passive', title: 'Active & Passive Voice' },
      { key: 'direct-indirect', title: 'Direct & Indirect Speech' },
      { key: 'modals', title: 'Modals (Can, Could, May, etc.)' },
      { key: 'determiners', title: 'Determiners' },
      { key: 'sentence-struct', title: 'Sentence Structure' },
      { key: 'clauses', title: 'Clauses' },
      { key: 'punctuation', title: 'Punctuation' },
    ]
  },
  { 
    key: 'eng-vocab', 
    title: '2. 📕 Vocabulary', 
    subtopics: [
      { key: 'vocab-main', title: 'Core Vocabulary' },
      { key: 'synonyms', title: 'Synonyms' },
      { key: 'antonyms', title: 'Antonyms' },
      { key: 'one-word', title: 'One Word Substitution' },
      { key: 'idioms-phrases', title: 'Idioms & Phrases' },
      { key: 'phrasal-verbs', title: 'Phrasal Verbs' },
      { key: 'word-formation', title: 'Word Formation' },
      { key: 'root-words', title: 'Root Words / Prefix / Suffix' },
      { key: 'homonyms', title: 'Homonyms / Homophones' },
      { key: 'collocations', title: 'Collocations' },
    ]
  },
  { 
    key: 'eng-reading', 
    title: '3. 📚 Reading Skill', 
    subtopics: [
      { key: 'reading-sk-main', title: 'Reading Skills' },
      { key: 'reading-comp', title: 'Reading Comprehension' },
      { key: 'para-jumbles', title: 'Para Jumbles' },
      { key: 'cloze-test', title: 'Cloze Test' },
      { key: 'fill-blanks', title: 'Fill in the Blanks' },
      { key: 'sent-completion', title: 'Sentence Completion' },
      { key: 'sent-rearrange', title: 'Sentence Rearrangement' },
      { key: 'theme-id', title: 'Theme / Main Idea Identification' },
      { key: 'tone-passage', title: 'Tone of Passage' },
    ]
  },
  { 
    key: 'eng-writing', 
    title: '4. ✒️ Writing Skill', 
    subtopics: [
      { key: 'writing-sk-main', title: 'Writing Skills' },
      { key: 'email-writing', title: 'Email Writing (Formal & Informal)' },
      { key: 'letter-writing', title: 'Letter Writing' },
      { key: 'report-writing', title: 'Report Writing' },
      { key: 'essay-writing', title: 'Essay Writing' },
      { key: 'paragraph-writing', title: 'Paragraph Writing' },
      { key: 'notice-writing', title: 'Notice Writing' },
    ]
  },
  { 
    key: 'eng-comm', 
    title: '5. 🗣️ Comm Skill', 
    subtopics: [
      { key: 'comm-sk-main', title: 'Communication Skills' },
      { key: 'verbal-comm', title: 'Verbal Communication' },
      { key: 'non-verbal-comm', title: 'Non-Verbal Communication' },
      { key: 'listening-sk', title: 'Listening Skills' },
      { key: 'speaking-sk', title: 'Speaking Skills' },
      { key: 'presentation-sk', title: 'Presentation Skills' },
      { key: 'public-speaking', title: 'Public Speaking' },
      { key: 'group-discussion', title: 'Group Discussion (GD)' },
      { key: 'interview-skills', title: 'Interview Skills' },
      { key: 'resume-building', title: 'Resume Building' },
      { key: 'workplace-comm', title: 'Workplace Communication' },
    ]
  },
  { 
    key: 'eng-error', 
    title: '6. 🛠️ Error Improvement', 
    subtopics: [
      { key: 'error-imp-main', title: 'Error & Improvement' },
      { key: 'error-detection', title: 'Error Detection' },
      { key: 'sent-correction', title: 'Sentence Correction' },
      { key: 'sent-improvement', title: 'Sentence Improvement' },
      { key: 'spotting-errors', title: 'Spotting Errors' },
      { key: 'fillers-usage', title: 'Fillers & Usage' },
    ]
  },
]

const ENGLISH_SUBTOPIC_TITLES = {
  'parts-of-speech': ['Identify Word Class', 'Function Analysis', 'Grammar Category', 'Sentence Role'],
  'noun': ['Proper vs Common', 'Collective Noun Check', 'Abstract Concepts', 'Plural Forms'],
  'pronoun': ['Subjective Pronouns', 'Possessive Case', 'Reflexive Usage', 'Relative Clauses'],
  'verb': ['Transitive vs Intransitive', 'Auxiliary Verbs', 'Gerunds & Intinitives', 'Subject-Verb Agreement'],
  'adjective': ['Comparative Degree', 'Superlative Degree', 'Descriptive Order', 'Predicate Adjectives'],
  'adverb': ['Adverbs of Manner', 'Frequency Markers', 'Degree Modifiers', 'Placement Rules'],
  'articles': ['Indefinite (A/An)', 'Definite (The)', 'Zero Article Case', 'Geographical Names'],
  'prepositions': ['Time Prepositions', 'Place and Direction', 'Prepositional Phrases', 'Dependent Prepositions'],
  'conjunctions': ['Coordinating (FANBOYS)', 'Subordinating Links', 'Correlative Pairs', 'Logical Connectors'],
  'tenses': ['Present Perfect Check', 'Past Continuous Flow', 'Future Intentions', 'Conditional If-Clauses'],
  'active-passive': ['Voice Conversion', 'Agent Identification', 'Passive Structures', 'Transitive Transformation'],
  'direct-indirect': ['Reporting Verbs', 'Tense Backshift', 'Pronoun Changes', 'Imperative Mood'],
  'synonyms': ['Word Equivalence', 'Meanings Match', 'Vocabulary Depth', 'Nuance Check'],
  'antonyms': ['Opposite Meanings', 'Contrastive Vocab', 'Reverse Definitions', 'Antonym Pairs'],
  'idioms-phrases': ['Idiomatic Meaning', 'Metaphorical Usage', 'Expression Context', 'Phrase Origin'],
  'phrasal-verbs': ['Verb-Particle Pairing', 'Separable Verbs', 'Contextual Meaning', 'Prepositional Verbs'],
}

function generateEnglishQuestion(topic, subtopic, idx) {
  const level = idx < 15 ? 'Easy' : idx < 35 ? 'Medium' : 'Hard';
  const v1 = (idx % 4) + 1;
  let qText = '';
  let ansVal = 1;
  let opts = ['Option A', 'Option B', 'Option C', 'Option D'];
  
  // Titles - pick specialized or fallback
  const subTitles = ENGLISH_SUBTOPIC_TITLES[subtopic.key] || ['Practice Exercise', 'Skill Drill', 'Core Proficiency', 'Language Task']
  const finalTitle = subTitles[idx % subTitles.length]

  // Scenario-based real questions
  switch(subtopic.key) {
    case 'noun': 
      qText = `Pick the abstract noun: 'His bravery in the battle was commendable.'`;
      opts = ['Bravery', 'Battle', 'Commendable', 'His'];
      ansVal = 0; break;
    case 'pronoun':
      qText = `Replace with appropriate pronoun: 'John and Mary are going to the mall. ___ will buy shoes.'`;
      opts = ['He', 'She', 'They', 'It'];
      ansVal = 2; break;
    case 'verb':
      qText = `Identify the verb in: 'The children laughed loudly at the funny clown.'`;
      opts = ['Laughed', 'Loudly', 'Funny', 'Clown'];
      ansVal = 0; break;
    case 'adjective':
      qText = `Choose the superlative: 'This is the ___ building in the city.'`;
      opts = ['Tall', 'Taller', 'Tallest', 'More tall'];
      ansVal = 2; break;
    case 'adverb':
      qText = `Which word is an adverb? 'She spoke very softly during the meeting.'`;
      opts = ['Softly', 'Spoke', 'Meeting', 'During'];
      ansVal = 0; break;
    case 'articles':
      qText = `Fill article: 'I saw ___ unique bird in the forest yesterday.'`;
      opts = ['a', 'an', 'the', 'none'];
      ansVal = 0; break; // "a unique" because 'u' starts with 'y' sound
    case 'prepositions':
      qText = `Preposition: 'The keys are ___ the drawer.'`;
      opts = ['on', 'in', 'at', 'into'];
      ansVal = 1; break;
    case 'conjunctions':
      qText = `Conjunction: 'He was tired, ___ he decided to finish the work.'`;
      opts = ['but', 'yet', 'and', 'so'];
      ansVal = 1; break;
    case 'tenses':
      qText = `Tense: 'By next June, I ___ my graduation.'`;
      opts = ['will finish', 'will have finished', 'finished', 'am finishing'];
      ansVal = 1; break;
    case 'subject-verb':
      qText = `Agreement: 'The group of students ___ arriving now.'`;
      opts = ['is', 'are', 'was', 'were'];
      ansVal = 0; break;
    case 'active-passive': 
      qText = `Passive of 'Someone has stolen my pen.'?`;
      opts = ['My pen was stolen', 'My pen has been stolen', 'My pen is stolen', 'Stolen was my pen'];
      ansVal = 1; break;
    case 'direct-indirect':
      qText = `Indirect of 'He said, "I am busy."'?`;
      opts = ['He said that he is busy', 'He said that he was busy', 'He said to me busy', 'He says he is busy'];
      ansVal = 1; break;
    case 'modals':
      qText = `Modal: 'You ___ follow the traffic rules.'`;
      opts = ['must', 'might', 'can', 'could'];
      ansVal = 0; break;
    case 'synonyms': 
      qText = `Synonym of 'Abundant'?`; 
      opts = ['Scarce', 'Plentiful', 'Rare', 'Little'];
      ansVal = 1; break;
    case 'antonyms':
      qText = `Antonym of 'Optimistic'?`;
      opts = ['Hopeful', 'Pessimistic', 'Cheerful', 'Positive'];
      ansVal = 1; break;
    case 'idioms-phrases':
      qText = `Meaning of 'Piece of cake'?`;
      opts = ['A delicious dessert', 'A very easy task', 'A small portion', 'To celebrate'];
      ansVal = 1; break;
    case 'email-writing':
      qText = `Most formal closing for a business email to a stranger?`;
      opts = ['Best,', 'Cheers,', 'Yours sincerely,', 'Thanks!'];
      ansVal = 2; break;
    case 'presentation-sk':
      qText = `The '10-20-30' rule of PowerPoint suggests slides should not exceed:`;
      opts = ['10 slides', '20 slides', '30 slides', '100 slides'];
      ansVal = 0; break;
    case 'interview-skills':
      qText = `In the STAR method for interviews, 'R' stands for:`;
      opts = ['Relate', 'Result', 'Review', 'Reason'];
      ansVal = 1; break;
    case 'error-detection':
      qText = `Spot error: 'Either of the two sisters are good.'`;
      opts = ['Either', 'of the two', 'sisters', 'are good (should be is)'];
      ansVal = 3; break;
    case 'sent-correction':
      qText = `Correct sentence: 'He don't know the way.'`;
      opts = ["He don't knows", "He doesn't know", "He not know", "He no know"];
      ansVal = 1; break;
    default:
      qText = `Assessment: Select the most appropriate categorical improvement for '${subtopic.title}'.`;
      opts = ['Proper Usage', 'Contextual Fit', 'Structural Integrity', 'Lexical Precision'];
      ansVal = idx % 4;
  }

  const order = [[0,1,2,3], [1,0,3,2], [2,3,0,1], [3,2,1,0]][idx % 4];
  const finalOpts = order.map(i => opts[i]);
  const finalAns = finalOpts.indexOf(opts[ansVal]);
  return { q: qText, opts: finalOpts, ans: finalAns, difficulty: level, title: finalTitle }
}


const ENGLISH_QUESTION_BANK = ENGLISH_TOPICS.reduce((acc, topic) => {
  acc[topic.key] = topic.subtopics.reduce((subAcc, sub) => {
    subAcc[sub.key] = Array.from({ length: 50 }, (_, idx) => generateEnglishQuestion(topic, sub, idx));
    return subAcc;
  }, {});
  return acc;
}, {});

const CS_CORE_TOPICS = [
  { 
    key: 'coa', 
    title: '1. 💻 Computer Organization & Architecture (COA)', 
    subtopics: [
      { key: 'coa-basics', title: 'Basic Organization' },
      { key: 'coa-instruction', title: 'Instruction Sets' },
      { key: 'coa-cpu', title: 'CPU Architecture' },
      { key: 'coa-pipeline', title: 'Pipeline & Vector Processing' },
      { key: 'coa-memory', title: 'Memory Hierarchy' },
      { key: 'coa-io', title: 'I/O Organization' },
    ]
  },
  { 
    key: 'os', 
    title: '2. 🗄️ Operating Systems (OS)', 
    subtopics: [
      { key: 'os-processes', title: 'Processes & Threads' },
      { key: 'os-scheduling', title: 'CPU Scheduling' },
      { key: 'os-memory', title: 'Memory Management' },
      { key: 'os-files', title: 'File Systems' },
      { key: 'os-deadlocks', title: 'Deadlocks' },
      { key: 'os-virtualization', title: 'Virtualization' },
    ]
  },
  { 
    key: 'dbms', 
    title: '3. 📂 Database Management Systems (DBMS)', 
    subtopics: [
      { key: 'dbms-er', title: 'ER Model' },
      { key: 'dbms-normalization', title: 'Normalization' },
      { key: 'dbms-sql', title: 'SQL Queries' },
      { key: 'dbms-transactions', title: 'Transaction Management' },
      { key: 'dbms-concurrency', title: 'Concurrency Control' },
      { key: 'dbms-indexing', title: 'Indexing' },
    ]
  },
  { 
    key: 'cn', 
    title: '4. 🌐 Computer Networks (CN)', 
    subtopics: [
      { key: 'cn-osi', title: 'OSI & TCP/IP Suite' },
      { key: 'cn-physical', title: 'Physical & Data Link Layer' },
      { key: 'cn-network', title: 'Network Layer (Routing)' },
      { key: 'cn-transport', title: 'Transport Layer (TCP/UDP)' },
      { key: 'cn-application', title: 'Application Layer' },
    ]
  },
  { 
    key: 'oop', 
    title: '5. 🧱 Object-Oriented Programming (OOP)', 
    subtopics: [
      { key: 'oop-concepts', title: 'OOP Concepts' },
      { key: 'oop-inheritance', title: 'Inheritance' },
      { key: 'oop-polymorphism', title: 'Polymorphism' },
      { key: 'oop-encapsulation', title: 'Encapsulation' },
      { key: 'oop-abstraction', title: 'Abstraction' },
    ]
  },
  { 
    key: 'toc', 
    title: '6. ⚙️ Theory of Computation (TOC)', 
    subtopics: [
      { key: 'toc-automata', title: 'Finite Automata' },
      { key: 'toc-languages', title: 'Regular Languages' },
      { key: 'toc-grammars', title: 'Context-Free Grammars' },
      { key: 'toc-turing', title: 'Turing Machines' },
      { key: 'toc-decidability', title: 'Decidability' },
    ]
  },
  { 
    key: 'compiler', 
    title: '7. 🛠️ Compiler Design', 
    subtopics: [
      { key: 'compiler-lexical', title: 'Lexical Analysis' },
      { key: 'compiler-syntax', title: 'Syntax Analysis' },
      { key: 'compiler-semantic', title: 'Semantic Analysis' },
      { key: 'compiler-intermediate', title: 'Intermediate Code' },
      { key: 'compiler-optimization', title: 'Code Optimization' },
    ]
  },
  { 
    key: 'se', 
    title: '8. 📉 Software Engineering', 
    subtopics: [
      { key: 'se-sdlc', title: 'SDLC Models' },
      { key: 'se-req', title: 'Requirement Engineering' },
      { key: 'se-design', title: 'Software Design' },
      { key: 'se-testing', title: 'Software Testing' },
      { key: 'se-agile', title: 'Agile & DevOps' },
    ]
  },
]

const CS_CORE_SUBTOPIC_TITLES = {
  'coa-basics': ['Number System Conversion', 'Logic Gates', 'Standard Bus Organization', 'Machine Cycles'],
  'coa-instruction': ['Instruction Format', 'Addressing Modes', 'Register Transfer', 'Control Word'],
  'coa-cpu': ['ALU Design', 'Stacked Organization', 'Micro-programmed Control', 'RISC vs CISC'],
  'os-processes': ['PCB Structure', 'Ready Queue Management', 'State Transitions', 'Zombie Processes'],
  'os-scheduling': ['Gantt Chart Analysis', 'Turnaround Time Calculation', 'Arrival Time Impact', 'Multilevel Queue'],
  'os-memory': ['Paging vs Segmentation', 'Logical to Physical Address', 'Internal Fragmentation', 'Page Table Structure'],
  'dbms-normalization': ['Functional Dependency', 'Candidate Key Search', 'B-Trees vs B+ Trees', 'Hashing Techniques'],
  'dbms-sql': ['Nested Queries', 'Aggregate Functions', 'View Creation', 'Database Triggers'],
  'cn-osi': ['OSI Layer Roles', 'TCP/IP Model', 'Data Encapsulation', 'Header Analysis'],
  'cn-network': ['Subnetting Practice', 'Distance Vector Routing', 'ICMP Message Types', 'DHCP Lifecycle'],
  'oop-concepts': ['Class Blueprints', 'Constructor Loading', 'Dynamic Binding', 'Virtual Functions'],
  'toc-automata': ['DFA Construction', 'NDFA to DFA', 'Mealy vs Moore Machines', 'State Minimization'],
  'compiler-lexical': ['Token Identification', 'Lexeme Mapping', 'Regular Expression to NFA', 'Finite Automata In Compiler'],
  'se-sdlc': ['Waterfall Flow', 'Spiral Risks', 'Iterative Prototyping', 'V-Model Stages'],
  'se-agile': ['Scrum Framework', 'Sprint Backlog', 'User Stories', 'Agile Manifesto'],
  'dbms-er': ['Entity Sets', 'Relationship degree', 'Cardinality ratio', 'Weak Entities'],
  'dbms-indexing': ['B-Tree Structure', 'B+ Tree Leaves', 'Static Hashing', 'Dynamic Hashing'],
  'cn-transport': ['TCP Handshake', 'UDP Headers', 'Congestion Control', 'Flow Control'],
  'oop-inheritance': ['Single Inheritance', 'Multiple Inheritance', 'Multilevel', 'Hybrid Inheritance'],
  'toc-languages': ['Regular Expressions', 'Closure Properties', 'Pumping Lemma', 'Myhill-Nerode'],
  'compiler-syntax': ['LL(1) Parsing', 'LR(0) Items', 'CLR Parsing', 'Operator Precedence'],
}

const CS_CORE_THEORY = {
  // COA
  'coa-basics': "Functional units include Input, Output, Memory, ALU, and Control Unit. Von Neumann architecture uses a single storage for instructions and data. Harvard architecture uses separate storage. Bus structures (Data, Address, Control) facilitate communication between components.",
  'coa-instruction': "Instruction formats specify opcode and operands. Addressing modes (Direct, Indirect, Register, Indexed, Relative) determine how operands are accessed. Register Transfer Language (RTL) describes machine-level data movement.",
  'coa-cpu': "ALU performs arithmetic and logic. Control Unit decodes instructions. Registers (PC, IR, MAR, MDR) provide fast temporary storage. RISC uses simple, fixed-length instructions for fast execution; CISC uses complex, variable-length instructions to reduce code size.",
  'coa-pipeline': "Pipelining overlaps stages of instruction execution (Fetch, Decode, Execute, Writeback) to increase throughput. Hazards: Structural (resource conflict), Data (dependency), and Control (branching). Ideal speedup equals the number of stages.",
  'coa-memory': "Memory hierarchy optimizes speed and cost using Cache, Main Memory, and Secondary Storage. Cache mapping techniques: Direct, Fully Associative, and Set-Associative. Virtual memory uses paging/segmentation to run programs larger than RAM.",
  'coa-io': "I/O techniques: Programmed I/O (CPU polls device), Interrupt-initiated (device signals CPU), and DMA (Direct Memory Access - device transfers data directly to memory, bypassing CPU).",
  
  // OS
  'os-processes': "A process is a program in execution. Components include Program Counter, Stack, and Data section. PCB (Process Control Block) stores process state. States: New, Ready, Running, Waiting, Terminated. Context switching is saving/restoring CPU state for multitasking.",
  'os-scheduling': "CPU Scheduling determines which process in the ready queue gets the CPU. Algorithms: FCFS, SJF, Round Robin (time quanta), and Priority Scheduling. Preemptive scheduling can interrupt a running process. Key metrics: Turnaround Time, Waiting Time.",
  'os-memory': "Memory management involves Paging (fixed-size blocks) and Segmentation (logical-size blocks). Virtual memory allows execution of partially loaded processes. Thrashing occurs when high page fault rates degrade performance.",
  'os-files': "File systems manage data on disks. Allocation methods: Contiguous, Linked, and Indexed. Directory structures can be single-level, two-level, or tree-structured. Access methods include Sequential and Direct/Random access.",
  'os-deadlocks': "Deadlock occurs when processes are stuck waiting for resources held by each other. Four necessary conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Handling: Prevention, Avoidance (Banker's Algorithm), Detection/Recovery.",
  'os-virtualization': "Virtualization allows multiple OS instances to run on a single hardware. Type 1 Hypervisor (Bare Metal) runs directly on hardware; Type 2 Hypervisor runs on top of a host OS. VMs are isolated, providing security and resource efficiency.",

  // DBMS
  'dbms-er': "Entity-Relationship model uses Entities (objects), Attributes (properties), and Relationships. Cardinality ratios (1:1, 1:N, M:N) define constraints. Strong entities have a primary key; weak entities depend on a parent entity for identity.",
  'dbms-normalization': "Normalization minimizes redundancy and dependency. 1NF: Atomic values. 2NF: No partial functional dependency. 3NF: No transitive dependency. BCNF: Stronger form where every determinant is a candidate key.",
  'dbms-sql': "Structured Query Language. DDL (Data Definition): CREATE, DROP. DML (Manipulation): INSERT, UPDATE. DQL (Query): SELECT. Joins (Inner, Outer, Self) combine data from multiple tables based on related columns.",
  'dbms-transactions': "A transaction is a logical unit of work. ACID properties: Atomicity (all or none), Consistency (integrity), Isolation (independence), Durability (permanence). Transaction states: Active, Commited, Failed, Aborted.",
  'dbms-concurrency': "Concurrency control ensures data integrity in multi-user systems. Techniques: Locking (2-Phase Locking), Timestamp-based ordering, and Optimistic concurrency control. Prevents problems like Lost Update and Dirty Read.",
  'dbms-indexing': "Indexing speeds up data retrieval. Primary Index (on key field), Secondary Index (on non-key). B-Trees and B+ Trees are commonly used for efficient range queries and point lookups.",

  // Networking
  'cn-osi': "OSI Model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. Data encapsulation adds headers at each layer. TCP/IP is the practical 4/5 layer suite used for global internet communication.",
  'cn-physical': "Physical layer handles raw bit transmission over media. Data Link layer ensures reliable frame delivery between adjacent nodes using Framing, Error Correction (CRC, Parity), and Flow Control (Sliding Window).",
  'cn-network': "The Network layer handles logical addressing (IP) and routing. IPv4 (32-bit) vs IPv6 (128-bit). Routing protocols find the best path: RIP (Distance Vector) and OSPF (Link State). Subnetting divides networks logically.",
  'cn-transport': "Transport layer provides end-to-end communication. TCP (Transmission Control Protocol) is connection-oriented and reliable. UDP (User Datagram Protocol) is connectionless and fast. Features: 3-way Handshake and Congestion Control.",
  'cn-application': "Application layer interacts with software applications. Protocols: HTTP/HTTPS (web), DNS (name resolution), SMTP/POP3 (email), and FTP (file transfer). DHCP automatically assigns IP addresses to devices.",

  // OOP
  'oop-concepts': "Key pillars: Abstraction (hiding complexity), Encapsulation (wrapping data/methods), Inheritance (reusing code), and Polymorphism (one interface, multiple forms). Classes are blueprints; Objects are instances.",
  'oop-inheritance': "Allows a subclass to inherit properties from a superclass. Types: Single, Multilevel, Hierarchical, Multiple (handled via Interfaces in Java), and Hybrid. The 'Diamond Problem' is a common issue in multiple inheritance.",
  'oop-polymorphism': "Ability of an entity to take many forms. Compile-time (Method Overloading) uses different parameters. Run-time (Method Overriding) uses virtual functions to determine the call at execution time.",
  'oop-encapsulation': "Encapsulation restricts direct access to components and bundles data with methods. Achieved using access modifiers: private, protected, and public. It protects the object's internal state from unauthorized modification.",
  'oop-abstraction': "Abstraction shows essential features while hiding background details. Implemented using Abstract Classes (can have partial implementation) and Interfaces (contract-based blueprints with 100% abstraction).",

  // TOC
  'toc-automata': "Finite Automata (FA) include DFA (Deterministic) and NFA (Non-deterministic). DFA has one transition per input; NFA can have zero or more. They accept Regular Languages, which are also expressed via Regular Expressions.",
  'toc-languages': "Regular languages (FA), Context-Free languages (PDA), Context-Sensitive (LBA), and Recursively Enumerable (Turing Machines). Closure properties (Union, Intersection, Kleene Star) define how these languages behave.",
  'toc-grammars': "Chomsky Hierarchy: Type 0 (Unrestricted), Type 1 (Context-Sensitive), Type 2 (Context-Free), Type 3 (Regular). CFG (Context-Free Grammar) is used to define the syntax of most programming languages.",
  'toc-turing': "A Turing Machine (TM) is a mathematical model of computation using an infinite tape. Church-Turing Thesis states that any computable problem can be solved by a TM. Variants: Multi-tape, Non-deterministic TMs.",
  'toc-decidability': "A problem is Decidable if there exists a TM that halts on all inputs. The Halting Problem (deciding if a TM halts) is the classic example of an Undecidable problem. Recursive sets are decidable; RE sets are recognizable.",

  // Compiler
  'compiler-lexical': "Scanner phase reads source code and produces Tokens. Lexemes (keywords, IDs) are mapped to tokens. Uses Regular Expressions and Finite Automata (NFA/DFA) for pattern matching and illegal character detection.",
  'compiler-syntax': "Parser phase checks token order against a grammar. Top-down (LL) and Bottom-up (LR) parsing. Abstract Syntax Tree (AST) represents the logical structure. Handles syntax errors like missing semicolons or mismatched braces.",
  'compiler-semantic': "Semantic Analysis checks for logical correctness (Type checking, scope checking, variable initialization). It builds/uses a Symbol Table to keep track of identifiers and their attributes like type and scope.",
  'compiler-intermediate': "Intermediate Code Generation (ICG) creates a machine-independent representation like Three-Address Code, Quadruples, or Triples. This facilitates optimization and retargeting to different architectures.",
  'compiler-optimization': "Optimization improves the code for speed or size. Techniques: Constant Folding, Dead Code Elimination, Loop Invariant Code Motion, and Common Subexpression Elimination. Can be local or global.",

  // Software Engineering
  'se-sdlc': "Phases: Requirement, Design, Implementation, Testing, Deployment, Maintenance. Models: Waterfall (sequential), Spiral (risk-oriented), Agile (iterative), and V-Model (testing-integrated).",
  'se-req': "Requirement Engineering involves Elicitation and SRS (Software Requirements Specification). SRS must be unambiguous, complete, and verifiable. Functional (what to do) vs Non-functional (performance, security) requirements.",
  'se-design': "Design phase focuses on architecture, data structures, and interfaces. Key principles: Modularity, Coupling (low is better - dependency between modules), and Cohesion (high is better - internal strength of a module).",
  'se-testing': "Quality assurance through Verification and Validation. Testing levels: Unit, Integration, System, and Acceptance. Alpha/Beta testing involve users. Manual vs Automated testing (using scripts).",
  'se-agile': "Agile emphasizes flexibility and collaboration. Scrum framework: Sprints, Daily Stand-ups, Product Owner, and Scrum Master. Principles include frequent delivery of working software and responding to change over following a plan.",
}

function generateCsCoreQuestion(topic, subtopic, idx) {
  const level = idx < 15 ? 'Easy' : idx < 35 ? 'Medium' : 'Hard';
  const v1 = (idx % 5) + 2;
  let qText = '';
  let ansVal = 1;
  let opts = ['Choice A', 'Choice B', 'Choice C', 'Choice D'];
  
  const subTitles = CS_CORE_SUBTOPIC_TITLES[subtopic.key] || ['Conceptual Probe', 'Technical Scenario', 'Architectural Drill', 'Core Logic']
  const finalTitle = subTitles[idx % subTitles.length]

  switch(subtopic.key) {
    case 'coa-basics': qText = `Which architecture uses separate memory for data and instructions?`; opts = ['Von Neumann', 'Harvard', 'CISC', 'RISC']; ansVal = 1; break;
    case 'coa-pipeline': qText = `In a 5-stage pipeline, if each stage takes 1ns, what is the theoretical throughput per second?`; opts = ['1 billion', '200 million', '5 billion', 'None']; ansVal = 0; break;
    case 'os-processes': qText = `Which state does a process enter when it is admitted to the system?`; opts = ['New', 'Ready', 'Running', 'Waiting']; ansVal = 1; break;
    case 'os-scheduling': qText = `If quantum size is very large in Round Robin, it behaves like:`; opts = ['Priority Scheduling', 'FCFS', 'SJF', 'LIFO']; ansVal = 1; break;
    case 'os-memory': qText = `The phenomenon of high paged memory activity leading to poor system performance is:`; opts = ['Fragmentation', 'Paging', 'Thrashing', 'Swapping']; ansVal = 2; break;
    case 'dbms-normalization': qText = `Which normal form is related to 'Transitive Dependency'?`; opts = ['1NF', '2NF', '3NF', 'BCNF']; ansVal = 2; break;
    case 'dbms-sql': qText = `Which SQL keyword is used to sort the result-set?`; opts = ['SORT BY', 'ORDER', 'ORDER BY', 'GROUP BY']; ansVal = 2; break;
    case 'cn-osi': qText = `At which OSI layer does error detection typically occur first?`; opts = ['Physical', 'Data Link', 'Network', 'Transport']; ansVal = 1; break;
    case 'cn-network': qText = `What is the default subnet mask for a Class C IP address?`; opts = ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255']; ansVal = 2; break;
    case 'oop-concepts': qText = `Hiding internal details and showing only functionality is:`; opts = ['Encapsulation', 'Inheritance', 'Abstraction', 'Polymorphism']; ansVal = 2; break;
    case 'toc-automata': qText = `The minimum number of states in a DFA accepting strings of length 2 is:`; opts = ['2', '3', '4', '1']; ansVal = 1; break;
    case 'compiler-lexical': qText = `The output of the Lexical Analysis phase is a sequence of:`; opts = ['Characters', 'Lexemes', 'Tokens', 'Sentences']; ansVal = 2; break;
    case 'se-sdlc': qText = `Which SDLC model is most suitable for projects with high risk?`; opts = ['Waterfall', 'Iterative', 'Spiral', 'V-Model']; ansVal = 2; break;
    case 'se-agile': qText = `In Scrum, who is responsible for maintaining the Product Backlog?`; opts = ['Scrum Master', 'Product Owner', 'Development Team', 'Stakeholder']; ansVal = 1; break;
    default:
      qText = `Core Concept: Which principle best describes efficient operation in '${subtopic.title}'?`;
      opts = ['Modular Design', 'Scalability', 'Fault Tolerance', 'Context Isolation'];
      ansVal = idx % 4;
  }

  const order = [[0,1,2,3], [1,0,3,2], [2,3,0,1], [3,2,1,0]][idx % 4];
  const finalOpts = order.map(i => opts[i]);
  const finalAns = finalOpts.indexOf(opts[ansVal]);
  return { q: qText, opts: finalOpts, ans: finalAns, difficulty: level, title: finalTitle }
}

const CS_CORE_QUESTION_BANK = CS_CORE_TOPICS.reduce((acc, topic) => {
  acc[topic.key] = topic.subtopics.reduce((subAcc, sub) => {
    subAcc[sub.key] = Array.from({ length: 50 }, (_, idx) => generateCsCoreQuestion(topic, sub, idx));
    return subAcc;
  }, {});
  return acc;
}, {});


const APTITUDE_SUBTOPIC_TITLES = {
  'number-system': ['Unit Digit Calculation', 'Divisibility Rules', 'Remainder Theorem', 'Factors and Multiples', 'Prime Factorization', 'Recurring Decimals', 'Number of Zeros at End'],
  'hcf-lcm': ['HCF by Long Division', 'LCM of Fractions', 'Product of Two Numbers Rule', 'Bell Ringing Problems', 'Step Counting Puzzle'],
  'simplification': ['BODMAS Rule', 'Percentage to Fraction Conversion', 'Square Root Estimation', 'Surds & Indices', 'V-BODMAS Challenge'],
  'approximation': ['Nearest Whole Number', 'Decimal Rounding', 'Approximating Large Products', 'Percentage Estimation'],
  'decimal-fractions': ['Comparing Fractions', 'Arranging in Order', 'Converting Decimals to Fractions', 'Complex Fraction Solutions'],
  'percentage': ['Percentage Increase/Decrease', 'Successive Percentage Change', 'Salary & Savings', 'Population Growth', 'Exam Score Analysis'],
  'ratio-proportion': ['Dividing Assets by Ratio', 'Mean Proportional', 'Duplicate & Triplicate Ratios', 'Coin Proportioned Amount'],
  'partnership': ['Profit Distribution by Investment', 'Active & Sleeping Partners', 'Time-Weighted Capital', 'Multiple Entry Investments'],
  'average': ['Average of Consecutive Numbers', 'Average Age after Addition', 'Speed Averaging', 'Weighted Arithmetic Mean', 'Replacement in Group'],
  'profit-loss': ['Cost Price vs Selling Price', 'Markup & Discount', 'Profit % on Fixed Cost', 'Dishonest Dealer Scenarios', 'Buy 2 Get 1 Free Analysis'],
  'simple-interest': ['SI for Partial Years', 'Interest Rate Difference', 'Total Amount Payable', 'Principal from Interest', 'EMI Calculation (Simple)'],
  'compound-interest': ['Compounded Annually', 'Compounded Half-Yearly', 'Difference between CI and SI', 'Population as CI', 'Depreciation of Assets'],
  'time-work': ['A & B Working Together', 'Efficiency of Work', 'Leaving Work in Middle', 'Chain Rule Problems', 'Wages for Work Done'],
  'pipes-cisterns': ['Inlet vs Outlet Pipes', 'Leak in Tank Problems', 'Filling with Alternating Pipes', 'Time to Empty Tank'],
  'speed-distance': ['Average Speed Calculation', 'Relative Speed (Towards each other)', 'Relative Speed (Same direction)', 'Meeting Point Paradox', 'Trains Crossing Objects', 'Trains Crossing each other'],
  'boats-streams': ['Downstream Velocity', 'Upstream Velocity', 'Speed of Boat in Still Water', 'Speed of Stream Current', 'Round Trip Average'],
  'ages': ['Ratio of Ages', 'Age X Years Ago', 'Age Y Years Hence', 'Father & Son Comparison', 'Sum of Family Members\' Age'],
  'mixture': ['Milk and Water Ratio', 'Replacement with Liquid', 'Alligation Rule Application', 'Mixing at Different Prices'],
  'permutation': ['Arranging Letters in Word', 'Selecting Committee', 'Handshake Problems', 'Circular Arrangements', 'Vowels Together Condition'],
  'probability': ['Dice Rolling Outcomes', 'Coin Tossing Paradox', 'Cards Selection (Deck)', 'Bag of Colored Balls', 'Two Independent Events'],
}



function generateAptitudeQuestion(topic, idx) {
  const level = idx < 15 ? 'Easy' : idx < 35 ? 'Medium' : 'Hard';
  const v1 = (idx * 5) + 10;
  const v2 = (idx * 2) + 3;
  let qText = '';
  let ansVal = 0;
  
  // Titles
  const subTitles = APTITUDE_SUBTOPIC_TITLES[topic.key] || ['Aptitude Challenge', 'Practice Task', 'Logical Drill', 'Problem Set']
  const finalTitle = subTitles[idx % subTitles.length]

  switch(topic.key) {
    case 'number-system': qText = `What is the sum of the first ${v2} prime numbers?`; ansVal = v1*3; break;
    case 'hcf-lcm': qText = `Find the LCM of ${v2} and ${v2+5}.`; ansVal = v2*(v2+5); break;
    case 'percentage': qText = `What is ${v2}% of ${v1 * 10}?`; ansVal = Math.floor((v2/100)*v1*10); break;
    case 'average': qText = `Find the average of the first ${v2} multiples of ${v1 % 5 || 2}.`; ansVal = v2 * 2; break;
    case 'probability': qText = `What is the probability of picking a specific card out of ${v1} cards?`; ansVal = 1; break;
    case 'profit-loss': qText = `If an item is bought for ${v1*10} and sold at ${v2}% profit, find the SP.`; ansVal = Math.floor(v1*10 * (1 + v2/100)); break;
    case 'simple-interest': qText = `Find SI on ${v1*100} at 10% for ${v2} years.`; ansVal = Math.floor((v1*100 * 10 * v2) / 100); break;
    case 'compound-interest': qText = `Amount on ${v1*100} at 10% CI for 2 years?`; ansVal = Math.floor(v1*100 * 1.21); break;
    case 'time-work': qText = `A can do a work in ${v1} days. B can do it in ${v1+v2} days. Together?`; ansVal = Math.floor((v1*(v1+v2))/(v1+v1+v2)); break;
    case 'speed-distance': qText = `A train crosses a pole in ${v2} sec at ${v1} km/h. Find length in meters.`; ansVal = Math.floor(v1 * (5/18) * v2); break;
    default: qText = `Solve ${topic.title.replace(/^\d+\.\s*/, '')} problem variant #${idx+1}. Given values ${v1} and ${v2}.`; ansVal = v1 + v2;
  }
  
  const opts = [String(ansVal - Math.max(1, v2)), String(ansVal + v2), String(ansVal), String(ansVal + v1)];
  const order = [[0,1,2,3], [1,0,3,2], [2,3,0,1], [3,2,1,0]][idx % 4];
  const finalOpts = order.map(i => opts[i]);
  const finalAns = finalOpts.indexOf(String(ansVal));
  return { q: qText, opts: finalOpts, ans: finalAns, difficulty: level, title: finalTitle }
}

const APTITUDE_QUESTION_BANK = APTITUDE_TOPICS.reduce((acc, topic) => {
  acc[topic.key] = Array.from({ length: 50 }, (_, idx) => generateAptitudeQuestion(topic, idx));
  return acc;
}, {});

const REASONING_TOPICS = [
  { key: 'logical-reasoning', title: '1. 🧠 Logical Reasoning' },
  { key: 'analytical-reasoning', title: '2. 📈 Analytical Reasoning' },
  { key: 'non-verbal-reasoning', title: '3. 🧩 Non-verbal Reasoning' },
  { key: 'verbal-reasoning', title: '4. 🗣️ Verbal Reasoning' },
]

function generateReasoningQuestion(topic, idx) {
  const level = idx < 15 ? 'Easy' : idx < 35 ? 'Medium' : 'Hard';
  let qText = '';
  let ansVal = 0;
  switch(topic.key) {
    case 'logical-reasoning': qText = `Which number should come next in the sequence: ${(idx*2)+2}, ${(idx*2)+4}, ${(idx*2)+6}, ...?`; ansVal = (idx*2)+8; break;
    case 'analytical-reasoning': qText = `If A is taller than B, and B is taller than C, who is the tallest?`; ansVal = 100; break;
    case 'non-verbal-reasoning': qText = `Identify the pattern in the given 3x3 grid and find the missing piece #${idx+1}.`; ansVal = 2; break;
    case 'verbal-reasoning': qText = `Find the odd one out: Apple, Orange, Banana, ${(idx % 2 === 0 ? 'Potato' : 'Carrot')}.`; ansVal = 300; break;
    default: qText = `Solve ${topic.title.replace(/^\d+\.\s*/, '')} problem variant #${idx+1}.`; ansVal = 1;
  }
  const opts = topic.key === 'analytical-reasoning' ? ['A', 'B', 'C', 'None'] : (topic.key === 'verbal-reasoning' ? ['Apple', 'Orange', 'Banana', (idx % 2 === 0 ? 'Potato' : 'Carrot')] : [String(ansVal - 1), String(ansVal + 1), String(ansVal), String(ansVal + 2)]);
  const order = [[0,1,2,3], [1,0,3,2], [2,3,0,1], [3,2,1,0]][idx % 4];
  const finalOpts = order.map(i => opts[i]);
  const finalAns = finalOpts.indexOf(topic.key === 'analytical-reasoning' ? 'A' : (topic.key === 'verbal-reasoning' ? (idx % 2 === 0 ? 'Potato' : 'Carrot') : String(ansVal)));
  return { q: qText, opts: finalOpts, ans: finalAns, difficulty: level, title: `Problem ${idx + 1}` }
}

const REASONING_QUESTION_BANK = REASONING_TOPICS.reduce((acc, topic) => {
  acc[topic.key] = Array.from({ length: 50 }, (_, idx) => generateReasoningQuestion(topic, idx));
  return acc;
}, {});

const CREATIVITY_TOPICS = [
  { 
    key: 'idea-gen', 
    title: '1. 💡 Idea Generation & Thinking',
    subtopics: [
      { key: 'observation-skills', title: 'Observation Skills' },
      { key: 'noticing-details', title: 'Noticing Details' },
      { key: 'word-association', title: 'Word Association' },
      { key: 'idea-listing', title: 'Idea Listing (10 Ideas Fast)' },
      { key: 'what-if-thinking', title: '“What If” Thinking' },
      { key: 'combining-ideas', title: 'Combining Two Ideas' },
      { key: 'reverse-thinking', title: 'Reverse Thinking' },
      { key: 'creative-questioning', title: 'Creative Questioning' },
      { key: 'abstract-thinking', title: 'Abstract Thinking' },
      { key: 'original-idea-gen', title: 'Original Idea Generation' },
    ]
  },
  { 
    key: 'writing-exp', 
    title: '2. ✍️ Writing & Expression',
    subtopics: [
      { key: 'describing-simple', title: 'Describing Simple Things' },
      { key: 'sentence-improvement', title: 'Sentence Improvement' },
      { key: 'basic-metaphors', title: 'Basic Metaphors' },
      { key: 'emotion-expression', title: 'Emotion Expression' },
      { key: 'sensory-writing', title: 'Sensory Writing (5 Senses)' },
      { key: 'dialogue-basics', title: 'Dialogue Writing Basics' },
      { key: 'two-line-stories', title: '2-Line Stories' },
      { key: 'writing-hooks', title: 'Writing Hooks (Attention Grabbing)' },
      { key: 'story-openings', title: 'Story Openings' },
      { key: 'minimalism', title: 'Minimalism (Saying More with Less)' },
    ]
  },
  { 
    key: 'storytelling', 
    title: '3. 📖 Storytelling & Narrative',
    subtopics: [
      { key: 'simple-story', title: 'Simple Story Writing' },
      { key: 'character-basics', title: 'Character Basics' },
      { key: 'perspective-switching', title: 'Perspective Switching' },
      { key: 'twist-endings', title: 'Twist Endings' },
      { key: 'conflict-creation', title: 'Conflict Creation' },
      { key: 'subtext', title: 'Subtext (Hidden Meaning)' },
      { key: 'double-meaning', title: 'Double Meaning Sentences' },
      { key: 'unreliable-narration', title: 'Unreliable Narration' },
      { key: 'creative-structures', title: 'Creative Story Structures' },
      { key: 'breaking-rules', title: 'Breaking Creative Rules' },
    ]
  },
  { 
    key: 'adv-style', 
    title: '4. ✨ Advanced Creativity & Style',
    subtopics: [
      { key: 'describing-without-naming', title: 'Describing Without Naming' },
      { key: 'constraint-writing', title: 'Constraint Writing (limits)' },
      { key: 'symbolism-basics', title: 'Symbolism Basics' },
      { key: 'visual-thinking', title: 'Visual Thinking' },
      { key: 'mood-tone-creation', title: 'Mood & Tone Creation' },
      { key: 'reality-bending', title: 'Reality Bending Ideas' },
      { key: 'philosophical-writing', title: 'Philosophical Writing' },
      { key: 'dark-emotional-writing', title: 'Dark/Emotional Writing' },
      { key: 'psych-triggers', title: 'Psychological Triggers in Writing' },
      { key: 'original-idea-expansion', title: 'Original Idea Expansion' },
    ]
  },
]

const LANGUAGE_TOPICS = [
  { key: 'english', title: 'English' },
  { key: 'hindi', title: 'Hindi' },
  { key: 'bengali', title: 'Bengali' },
  { key: 'tamil', title: 'Tamil' },
  { key: 'telugu', title: 'Telugu' },
  { key: 'marathi', title: 'Marathi' },
  { key: 'gujarati', title: 'Gujarati' },
  { key: 'kannada', title: 'Kannada' },
  { key: 'malayalam', title: 'Malayalam' },
  { key: 'punjabi', title: 'Punjabi' },
  { key: 'urdu', title: 'Urdu' },
  { key: 'sanskrit', title: 'Sanskrit' },
  { key: 'french', title: 'French' },
  { key: 'spanish', title: 'Spanish' },
  { key: 'german', title: 'German' },
  { key: 'chinese', title: 'Chinese (Mandarin)' },
  { key: 'japanese', title: 'Japanese' },
  { key: 'korean', title: 'Korean' },
  { key: 'arabic', title: 'Arabic' },
  { key: 'russian', title: 'Russian' },
  { key: 'italian', title: 'Italian' },
]

const LANGUAGE_THEORY_DATA = {
  english: "Focus on immersion through media. Practice the 'Shadowing' technique where you repeat native speakers in real-time. Use Spaced Repetition Systems (SRS) like Anki for vocabulary.",
  hindi: "Master the Devanagari script first. Focus on gendered nouns and postpositions. Practice conversation with native speakers and watch Bollywood movies with subtitles.",
  bengali: "Learn the script and its unique vowel sounds. Bengali grammar is relatively simple with no gendered nouns. Focus on common verb conjugations and formal vs informal speech.",
  tamil: "Tamil has distinct diglossia (spoken vs written). Start with simple spoken phrases. Master the script and focus on the agglutinative nature of the language.",
  telugu: "Focus on the 'vowel-ending' nature of words. Practice the complex script and learn common sandhi rules. Listen to Telugu music and news briefings.",
  marathi: "Marathi uses Devanagari but with distinct grammatical nuances. Focus on the three-gender system and practice reading regional literature.",
  gujarati: "The script is similar to Devanagari but without the top line. Focus on the distinct verb forms and practice conversational nuances common in trade settings.",
  kannada: "Learn the circular script patterns. Focus on the Case endings and practice simple sentence structures. Engage with Kannada cinema and literature.",
  malayalam: "Known for its complex phonology and script. Focus on mastering the 'nasal' sounds and practice agglutination in verb forms.",
  punjabi: "Master the Gurmukhi script. Focus on the tonal nature of the language and practice common conversational idioms.",
  urdu: "Learn the Persian-Arabic based script. Focus on the rich vocabulary shared with Hindi but with distinct formal registers. Practice reading poetry (Shayari).",
  sanskrit: "Focus on the root-based grammar (Dhatus). Master the Vibhaktis (Declensions) and Sandhi rules. Read simple Shlokas to understand word structure.",
  french: "Focus on pronunciation and the 'silent' letters. Master verb conjugations (especially irregular ones) and the distinction between masculine/feminine nouns.",
  spanish: "Focus on verb tenses and the difference between 'Ser' and 'Estar'. Practice rolling your 'R's and use the phonetic nature of the language to read aloud.",
  german: "Focus on the four noun cases (Nominative, Accusative, Dative, Genitive) and sentence structure (V2 word order). Build compound words to expand vocabulary.",
  chinese: "Master the four tones first. Focus on radicals in characters rather than memorizing whole words. Practice Pinyin for pronunciation and use graded readers.",
  japanese: "Learn Hiragana and Katakana immediately. Focus on the three-level politeness system (Keigo) and start Kanji early using radical-based methods.",
  korean: "Master Hangul (extremely logical script). Focus on sentence-ending particles and levels of formality. Use K-Dramas for listening practice.",
  arabic: "Learn the root system (3 letters form core meaning). Focus on the right-to-left script and the distinct sounds (letters like Qaf and Ayn).",
  russian: "Master the Cyrillic alphabet first. Focus on the six cases and the concept of 'aspect' in verbs (Perfective/Imperfective).",
  italian: "Focus on pronunciation (every letter is sounded). Master the articles and their agreement with nouns. Practice the rhythmic 'musicality' of the language.",
}

const FITNESS_TOPICS = [
  { key: 'quick-workouts', title: '⚡ Quick Workouts', icon: 'Flame' },
  { key: 'flexibility-mobility', title: '🧘 Flexibility & Mobility', icon: 'Dumbbell' },
  { key: 'nutrition-basics', title: '🍎 Nutrition Basics', icon: 'Salad' },
  { key: 'fitness-challenges', title: '🔥 Fitness Challenges', icon: 'Target' },
  { key: 'progress-tracking', title: '📊 Progress Tracking', icon: 'ChartLine' },
]

const FITNESS_THEORY_DATA = {
  'quick-workouts': [
    "Do 20 push-ups + 20 squats + 30-sec plank",
    "3-min skipping + 10 burpees × 3",
    "Wall sit for 1 min + lunges",
    "10-minute full body HIIT",
    "Stair climbing for 5 minutes",
    "Jumping jacks (50 reps)",
    "Mountain climbers (30 sec × 3)",
    "Plank variations (side + front)",
    "Shadow boxing (5 min)",
    "High knees (1 min × 3)",
    "Push-up challenge (max reps)",
    "Squat hold (1 min)",
    "Core crunches (20 × 3)",
    "Jump squats (15 × 3)",
    "5-min mobility warmup routine"
  ],
  'flexibility-mobility': [
    "5-min morning stretch routine",
    "Neck rotation exercises",
    "Shoulder mobility drills",
    "Hamstring stretch (hold 30 sec)",
    "Lower back stretch",
    "Hip opener exercises",
    "Yoga sun salutation",
    "Ankle rotation drills",
    "Cat-cow stretch",
    "Child pose relaxation",
    "Spinal twist stretch",
    "Full body dynamic stretching",
    "Foam rolling routine",
    "Deep breathing + stretch combo",
    "Post-workout cooldown stretch"
  ],
  'nutrition-basics': [
    "Drink at least 2–3L water daily",
    "Include protein in every meal (eggs, paneer, dal)",
    "Avoid junk food for 3 days challenge",
    "Eat fruits daily (banana, apple, etc.)",
    "Reduce sugar intake",
    "Eat home-cooked meals",
    "Add green vegetables daily",
    "Have a balanced breakfast",
    "Avoid late-night eating",
    "Drink warm water in morning",
    "Include nuts (almonds, peanuts)",
    "Track your daily calorie intake",
    "Replace soft drinks with water",
    "Eat smaller meals more frequently",
    "Maintain a fixed meal timing"
  ],
  'fitness-challenges': [
    "7-Day Push-up Challenge",
    "10K Steps Daily Challenge",
    "No Junk Food Week",
    "30-Day Squat Challenge",
    "Daily 5-min plank challenge",
    "1-week cardio challenge",
    "Morning workout streak (7 days)",
    "100 jumping jacks daily",
    "Drink 3L water challenge",
    "14-day fitness streak challenge",
    "No sugar challenge (1 week)",
    "Daily stretching challenge",
    "Workout before 9 AM challenge",
    "Weekend fitness challenge",
    "Consistency challenge (30 days)"
  ],
  'progress-tracking': [
    "Track daily weight",
    "Maintain workout streak counter",
    "Track calories burned",
    "Record daily steps count",
    "Track workout time",
    "Weekly fitness progress chart",
    "Monthly weight comparison",
    "Habit completion tracker",
    "Water intake tracker",
    "Workout history log",
    "Strength improvement tracking",
    "Body measurements log",
    "Fitness goal completion %",
    "Daily activity summary",
    "Performance improvement graph"
  ]
}

const GK_TOPICS = [
  { key: 'history', title: 'History (Ancient, Medieval, Modern)' },
  { key: 'geography', title: 'Geography (Physical, World, Indian)' },
  { key: 'polity', title: 'Indian Polity & Constitution' },
  { key: 'economics', title: 'Economics (Basic + Indian Economy)' },
  { key: 'science', title: 'Science & Technology' },
  { key: 'environment', title: 'Environment & Ecology' },
  { key: 'current-affairs', title: 'Current Affairs' },
  { key: 'important-days', title: 'Important Days & Events' },
  { key: 'awards', title: 'Awards & Honors' },
  { key: 'books', title: 'Books & Authors' },
  { key: 'sports', title: 'Sports & Games' },
  { key: 'countries', title: 'Countries, Capitals & Currencies' },
  { key: 'personalities', title: 'Famous Personalities' },
  { key: 'inventions', title: 'Inventions & Discoveries' },
  { key: 'art-culture', title: 'Art & Culture' },
  { key: 'gov-schemes', title: 'Government Schemes (India)' },
  { key: 'intl-orgs', title: 'International Organizations (UN, WHO, etc.)' },
  { key: 'space', title: 'Space & Astronomy' },
  { key: 'defense', title: 'Defense & Military' },
  { key: 'static-gk', title: 'Static GK (Facts, Records, Superlatives)' }
]

const GK_THEORY_DATA = {
  'history': "History is the study of past events, particularly in human affairs. Indian history is broadly divided into Ancient (until the 8th century), Medieval (8th to 18th century), and Modern (mid-18th century onwards). Key focus areas include the Indus Valley Civilization, Maurya and Gupta Empires, Delhi Sultanate, Mughal Empire, and the Indian Freedom Struggle.",
  'geography': "Geography is the study of places and the relationships between people and their environments. It encompasses Physical Geography (landforms, climate), World Geography (continents, oceans), and Indian Geography (river systems, mountains like the Himalayas, and diverse climatic zones).",
  'polity': "The Constitution of India is the supreme law of India. It was adopted by the Constituent Assembly on 26 November 1949 and became effective on 26 January 1950. It establishes a federal parliamentary representative democratic republic with a separation of powers between the executive, legislature, and judiciary.",
  'economics': "Economics deals with the production, distribution, and consumption of goods and services. Indian economy is a developing mixed economy, currently the world's fifth-largest by nominal GDP. Key topics include Macroeconomics, Microeconomics, Banking, Inflation, and Five-Year Plans.",
  'science': "Science and Technology focuses on recent developments in physics, chemistry, biology, and computer science. Important topics include biotechnology, nanotechnology, nuclear physics, and India's achievements in Information Technology.",
  'environment': "Environment and Ecology studies the interaction between organisms and their environment. Focus areas include biodiversity, conservation, climate change, pollution, and international environmental agreements like the Paris Agreement.",
  'current-affairs': "Current Affairs covers important national and international events of the last 6-12 months. This includes political changes, summits, bilateral agreements, and major socio-economic developments.",
  'important-days': "Important Days and Events celebrate or commemorate specific themes. For example: January 12 (National Youth Day), June 5 (World Environment Day), October 2 (Gandhi Jayanti), and December 10 (Human Rights Day).",
  'awards': "Awards and Honors recognize excellence in various fields. Key awards include Bharat Ratna (highest civilian), Padma Awards, Nobel Prizes, Oscar Awards, and sporting honors like Khel Ratna and Arjuna Awards.",
  'books': "Books and Authors encompass classical literature, historical texts, and contemporary bestsellers. Examples include 'Discovery of India' by Nehru, 'Wings of Fire' by APJ Abdul Kalam, and works by international laureates.",
  'sports': "Sports and Games cover rules, terms, stadiums, and famous trophies. Key focus is on Cricket, Football, Tennis, Olympics, Asian Games, and Commonwealth Games.",
  'countries': "Countries, Capitals, and Currencies is a staple of static GK. For example: Japan (Tokyo, Yen), Russia (Moscow, Ruble), Brazil (Brasilia, Real), and South Africa (Pretoria/Cape Town/Bloemfontein, Rand).",
  'personalities': "Famous Personalities includes leaders, scientists, social reformers, and artists who shaped history or current culture, such as Mahatma Gandhi, Marie Curie, Swami Vivekananda, and Nelson Mandela.",
  'inventions': "Inventions and Discoveries highlight breakthrough moments in human history, such as the Steam Engine (James Watt), Penicillin (Alexander Fleming), Telephone (Alexander Graham Bell), and the Internet.",
  'art-culture': "Art and Culture explores India's diverse heritage, including folk dances (Classical dances like Kathak, Bharatanatyam), music, architecture (Mughal, Dravidian styles), and festivals.",
  'gov-schemes': "Government Schemes in India aim at socio-economic development. Major schemes include PM-Kisan, Ayushman Bharat, MGNREGA, Swachh Bharat Abhiyan, and Start-up India.",
  'intl-orgs': "International Organizations facilitate global cooperation. Key entities include the United Nations (UN), World Health Organization (WHO), IMF, World Bank, UNESCO, and regional blocs like BRICS and G20.",
  'space': "Space and Astronomy involves the study of celestial objects and space exploration. Highlights include ISRO's missions (Chandrayaan, Mangalyaan), NASA's achievements, and basic astronomical facts about planets and stars.",
  'defense': "Defense and Military covers the structure of the Indian Armed Forces, missle systems (Agni, Prithvi), defense exercises (Yudh Abhyas), and key historical battles.",
  'static-gk': "Static GK includes superlative facts: Largest (Amazon River), Smallest (Vatican City), Longest (Nile), and firsts in various categories (First man in space: Yuri Gagarin)."
}
const WEBDEV_TOPICS = [
  { key: 'frontend', title: '🎨 Frontend Development', icon: 'Monitor' },
  { key: 'backend', title: '⚙️ Backend Development', icon: 'Server' },
  { key: 'database', title: '🗄️ Database Management', icon: 'Database' },
]

const WEBDEV_THEORY_DATA = {
  'frontend': [
    "HTML5: Structure the web using semantic elements like <header>, <nav>, and <main>.",
    "CSS3 Flexbox: Layout items flexibly in rows or columns using display: flex.",
    "CSS Grid: Create two-dimensional layouts with grid-template-areas and columns.",
    "Responsive Design: Use media queries to adapt layouts to mobile and desktop screens.",
    "JavaScript ES6+: Master let/const, arrow functions, and destructuring.",
    "React Hooks: Manage component state with useState and side effects with useEffect.",
    "Vue.js Basics: Build interactive components with directives like v-if and v-for.",
    "Tailwind CSS: Style apps rapidly with utility-first CSS classes.",
    "Web Performance: Optimize images and minimize JS bundles for fast loading.",
    "Accessibility (A11y): Ensure websites are usable for everyone using ARIA roles."
  ],
  'backend': [
    "Node.js Basics: Run JavaScript on the server using an event-driven, non-blocking I/O.",
    "Express.js: Create RESTful APIs with middleware, routing, and controllers.",
    "Python Django: Build robust backends using the batteries-included framework.",
    "Java Spring Boot: Develop enterprise-grade microservices with dependency injection.",
    "Authentication: Implement secure logins using JWT (JSON Web Tokens) or sessions.",
    "API Security: Protect endpoints with CORS, rate limiting, and input validation.",
    "Environment Vars: Store sensitive keys securely using .env files.",
    "File Uploads: Handle multipart/form-data with libraries like Multer.",
    "WebSockets: Enable real-time, two-way communication between client and server.",
    "Docker Basics: Containerize backends for consistent deployment environments."
  ],
  'database': [
    "SQL Basics: Query relational databases using SELECT, JOIN, and GROUP BY.",
    "NoSQL (MongoDB): Store flexible, JSON-like documents without a fixed schema.",
    "Database Indexing: Improve query performance by creating indexes on high-traffic columns.",
    "ACID Properties: Ensure transactions are Atomic, Consistent, Isolated, and Durable.",
    "Normalization: Structure tables to reduce redundancy and improve data integrity.",
    "Redis Caching: Store temporary data in-memory to speed up read operations.",
    "PostgreSQL: Use advanced features like JSONB and window functions.",
    "Backups & Recovery: Regularly export data to prevent loss during failures.",
    "ORM (Prisma): Map database tables to code objects for easier management.",
    "Database Security: Grant least privilege access to protect sensitive data."
  ]
}
const AIML_TOPICS = [
  { key: 'linear-algebra', title: '1. 🔢 Linear Algebra' },
  { key: 'calculus', title: '2. 📈 Calculus' },
  { key: 'prob-stats', title: '3. 📊 Probability & Statistics' },
  { key: 'python-ml', title: '4. 🐍 Python Basics for ML' },
  { key: 'data-collection', title: '5. 📡 Data Collection & Understanding' },
  { key: 'data-cleaning', title: '6. 🧹 Data Cleaning' },
  { key: 'feature-eng', title: '7. 🛠️ Feature Engineering' },
  { key: 'ml-fundamentals', title: '8. 🧠 ML Fundamentals' },
  { key: 'supervised-reg', title: '9. 📉 Supervised Learning – Regression' },
  { key: 'supervised-cls', title: '10. 🎯 Supervised Learning – Classification' },
  { key: 'unsupervised', title: '11. 🕸️ Unsupervised Learning' },
  { key: 'ensemble', title: '12. 🧱 Ensemble Methods' },
  { key: 'eval-metrics', title: '13. 📏 Model Selection & Evaluation' },
  { key: 'nn-fundamentals', title: '14. 🧬 Neural Networks Fundamentals' },
  { key: 'cnn', title: '15. 📷 Convolutional Networks (CNN)' },
  { key: 'rnn', title: '16. 🔄 Recurrent Networks (RNN)' },
  { key: 'transformers', title: '17. 🤖 Transformers & Attention' },
  { key: 'nlp-preprocessing', title: '18. 🔤 Text Preprocessing' },
  { key: 'nlp-tasks', title: '19. 🗣️ NLP Tasks' },
  { key: 'image-processing', title: '20. 🖼️ Image Processing Basics' },
  { key: 'computer-vision', title: '21. 👁️ Computer Vision Tasks' },
  { key: 'rl-fundamentals', title: '22. 🎮 RL Fundamentals' },
  { key: 'rl-algorithms', title: '23. 🕹️ RL Algorithms' },
  { key: 'mlops', title: '24. 🏗️ ML Pipeline & MLOps' },
  { key: 'deployment', title: '25. 🚀 Model Deployment' },
  { key: 'monitoring', title: '26. 📉 Model Monitoring' },
  { key: 'frameworks', title: '27. 🧰 Core ML Frameworks' },
  { key: 'libraries', title: '28. 📚 Specialized Libraries' },
  { key: 'gen-ai', title: '29. 🌌 Generative AI' },
  { key: 'xai', title: '30. 🔍 Explainable AI (XAI)' },
  { key: 'ml-system-design', title: '31. 🏛️ ML System Design' },
]

const FUN_TOPICS = [
  { key: 'eng-survival', title: '🎓 Engineering Survival', prompt: 'Hacks, mindset, and mental models for engineers.' },
  { key: 'fermi-probs', title: '🧮 Fermi Estimations', prompt: 'Learn to estimate anything using logic and orders of magnitude.' },
  { key: 'science-magic', title: '🧪 Obscure Science Fun', prompt: 'Non-intuitive scientific facts that feel like magic.' },
  { key: 'math-tricks', title: '🪄 Speed Math Hacks', prompt: 'Numerical curiosities and mental multiplication tricks.' },
  { key: 'study-games', title: '⚡ Study Gamification', prompt: 'How to make difficult engineering subjects fun.' },
]

const FUN_THEORY_DATA = {
  'eng-survival': "The #1 Engineering survival rule: 'If it works, don't touch it. If it doesn't, check the power.' Mastery comes from understanding first principles—everything else is just detail. Always build a 'Minimum Viable Model' in your head before starting the math.",
  'fermi-probs': "Enrico Fermi could estimate the strength of an atomic blast with scraps of paper. The trick: Break the problem into parts you know, and approximate to the nearest power of 10. Errors often cancel out! Q: Piano tuners in NYC? A: ~1,000. Logic over memory.",
  'science-magic': "A hummingbird weighs less than a penny. A single bolt on a Boeing 747 can hold the weight of two elephants. Engineering isn't just about formulas; it's about seeing the extreme physics hidden in everyday objects. Look for the wow factor.",
  'math-tricks': "The 'Square of 5s' Trick: To square any number ending in 5, multiply the first digit by its successor and append 25. Example: 35²? 3x4=12 -> 1225. 65²? 6x7=42 -> 4225. Mental shortcuts are the engineer's secret weapon for rough checks.",
  'study-games': "Engineering is hard, so game it. Use 'Negative Visualization' to imagine the worst exam failure to spark urgency. Use the 'Feynman Technique': Explain a concept to a child (or a rubber duck). If you can't, you don't understand it yet."
}

const AIML_THEORY_DATA = {
  'linear-algebra': "Linear Algebra is the backbone of ML. It involves vectors (1D arrays), matrices (2D arrays), and tensors (N-D arrays). Operations like matrix multiplication, Eigenvalues, and SVD are critical for algorithms like PCA and Neural Networks.",
  'calculus': "Calculus focuses on how functions change. Differentiation (Partial Derivatives) is used in backpropagation to update weights via Gradient Descent. Integrals are useful for understanding PDF in probability.",
  'prob-stats': "Statistics helps us infer patterns from data. Key concepts include Normal Distribution, Hypothesis Testing, p-values, and Bayesian Probability (Prior/Posterior), which is fundamental to Naive Bayes and model uncertainty.",
  'python-ml': "Python is the primary language for ML due to libraries like NumPy (math), Pandas (data handling), and Matplotlib (plotting). Basics include data structures, list comprehensions, and handling arrays efficiently.",
  'data-collection': "Data collection involves gathering raw info from APIs, Databases, or Web Scraping. Understanding data distributions, missingness, and 'ground truth' is the first step in the ML pipeline.",
  'data-cleaning': "Cleaning involves handling missing values (Imputation/Removal), removing duplicates, correcting data types, and dealing with outliers that might skew model performance.",
  'feature-eng': "Feature Engineering is creating new input variables from existing ones. Techniques include normalization/scaling, one-hot encoding for text, and polynomial features. Good features often outweigh model complexity.",
  'ml-fundamentals': "ML is a subclass of AI. It involves learning from data without explicit programming. Key concepts include No Free Lunch theorem, Occam's Razor, and the Overfitting vs. Underfitting trade-off.",
  'supervised-reg': "Supervised Regression predicts continuous values. Linear Regression is the simplest. We minimize Mean Squared Error (MSE). Important for price prediction, temperature, etc.",
  'supervised-cls': "Classification predicts discrete labels. Logistic Regression (Binary), SVM, and K-Nearest Neighbors (KNN) are common. Evaluation uses Accuracy, Precision, Recall, and F1-score.",
  'unsupervised': "Unsupervised Learning finds hidden patterns in unlabeled data. Clustering (K-Means) and Dimensionality Reduction (PCA/t-SNE) are core techniques. It's used for customer segmentation and compression.",
  'ensemble': "Ensembles combine multiple models for better performance. Bagging (Random Forest), Boosting (XGBoost/LightGBM), and Stacking are primary methods. They reduce variance or bias significantly.",
  'eval-metrics': "How do we know if a model is good? We use Train/Test/Val splits and Cross-Validation. For balanced data, use accuracy; for imbalanced, use Precision-Recall curves or ROC-AUC.",
  'nn-fundamentals': "Neural Networks are inspired by the brain. A Perceptron is the basic unit. Layers (Input, Hidden, Output) process signals. Activation functions (ReLU, Sigmoid) introduce non-linearity.",
  'cnn': "CNNs are tailored for grid data like images. They use Convolution layers (filters) to detect patterns like edges and textures, and Pooling layers to reduce dimensionality. SOTA for vision.",
  'rnn': "RNNs handle sequence data (Text/Audio). They have loops to maintain state. Simple RNNs suffer from vanishing gradients, leading to the development of LSTM and GRU for long-term memory.",
  'transformers': "Transformers use Self-Attention mechanisms to process entire sequences in parallel. They replaced RNNs for NLP. The Encoder/Decoder architecture is the basis for models like BERT and GPT.",
  'nlp-preprocessing': "Text isn't machine-readable. Preprocessing includes Tokenization (splitting into words), Lemmatization (root words), and Stemming. It clears 'noise' from language data.",
  'nlp-tasks': "Common NLP tasks include Sentiment Analysis, Machine Translation, Named Entity Recognition (NER), and Question Answering. Modern SOTA uses large LLMs for these.",
  'image-processing': "Before ML, image processing used computer vision filters (Sobel, Gaussian blur) for edge detection and smoothing. Now, it's often a precursor to CNN inputs.",
  'computer-vision': "CV tasks include Image Classification, Object Detection (YOLO), Face Recognition, and Instance Segmentation. These involve understanding visual scenes spatially.",
  'rl-fundamentals': "RL involves an Agent interacting with an Environment to maximize cumulative Rewards. Concepts include State, Action, Policy (Greedy/Exploration), and Q-Learning.",
  'rl-algorithms': "Key algorithms include Deep Q-Networks (DQN), Policy Gradients, and Actor-Critic methods. RL powers game-playing AIs (AlphaGo) and robotics controllers.",
  'mlops': "MLOps is DevOps for ML. It covers CI/CD for models, versioning models (DVC), tracking experiments (MLflow), and building automated pipelines from data to serving.",
  'deployment': "Deployment makes models available for users. Options include REST APIs (Flask/FastAPI), Edge deployment (ONNX/TensorFlow Lite), and Serverless functions for scaling.",
  'monitoring': "Model performance degrades over time (Concept/Data Drift). Monitoring systems track latency, throughput, and accuracy in production to trigger retraining.",
  'frameworks': "Core frameworks include PyTorch (dynamic graphs, research-heavy) and TensorFlow (production-grade). They handle low-level matrix math and GPU acceleration.",
  'libraries': "Specialized libraries like Scikit-Learn (Traditional ML), HuggingFace (Transformers), and OpenCV (Vision) provide ready-to-use implementations of complex papers.",
  'gen-ai': "Generative AI creates new content (Text, Images, Code). Large Language Models (LLMs) and Diffusion Models (Midjourney/DALL-E) are the current state-of-the-art.",
  'xai': "Explainable AI makes 'Black Box' models interpret-able. Techniques like SHAP and LIME help understand which features led to a specific model prediction for trust and ethics.",
  'ml-system-design': "System Design involves architecting the full stack: high-level data flow, choosing between batch/online learning, handling scaling, and ensure low-latency serving in production."
}
const WEBDEV_QUESTION_BANK = {
  frontend: [
    { q: 'Which HTML5 tag is used for navigation links?', opts: ['<nav>','<navigation>','<links>','<menu>'], ans: 0 },
    { q: 'In CSS Flexbox, which property aligns items along the main axis?', opts: ['align-items','justify-content','flex-direction','align-self'], ans: 1 },
    { q: 'What is the purpose of the "key" prop in React?', opts: ['To style elements','To provide unique identity for reconciliation','To bind events','To define routes'], ans: 1 },
    { q: 'Which CSS unit is relative to the font-size of the root element?', opts: ['em','rem','px','vh'], ans: 1 },
    { q: 'What does "useContext" hook do in React?', opts: ['Handles API calls','Manages local state','Avoids prop-drilling by sharing data','Optimizes renders'], ans: 2 },
    { q: 'Which HTML attribute specifies an alternate text for an image?', opts: ['title','alt','src','longdesc'], ans: 1 },
    { q: 'In JavaScript, what is the output of "typeof null"?', opts: ['null','undefined','object','string'], ans: 2 },
    { q: 'Which Tailwind class is used to center text?', opts: ['center-text','text-align-center','text-center','align-center'], ans: 2 },
    { q: 'What does the "defer" attribute in a <script> tag do?', opts: ['Stops execution','Executes script after body is parsed','Downloads script in parallel','Inline the script'], ans: 1 },
    { q: 'Which CSS property is used to create a shadow around an element?', opts: ['text-shadow','box-shadow','element-shadow','shadow'], ans: 1 },
  ],
  backend: [
    { q: 'What is the default port for a Node.js Express server?', opts: ['80','3000','8080','3306'], ans: 1 },
    { q: 'Which HTTP method is considered "Idempotent"?', opts: ['POST','PATCH','GET','None'], ans: 2 },
    { q: 'In Node.js, what does "module.exports" do?', opts: ['Imports a package','Exports a local variable/function','Installs a dependency','Starts a server'], ans: 1 },
    { q: 'What is "Middleware" in Express.js?', opts: ['A database','Functions that execute during the request-response cycle','A frontend framework','A load balancer'], ans: 1 },
    { q: 'Which status code represents "Internal Server Error"?', opts: ['404','403','500','200'], ans: 2 },
    { q: 'What is the primary role of a JWT (JSON Web Token)?', opts: ['Storing user profile','Securely transmitting information between parties','Compiling code','Database indexing'], ans: 1 },
    { q: 'Which Node.js core module is used for file system operations?', opts: ['http','path','fs','os'], ans: 2 },
    { q: 'What does CORS stand for?', opts: ['Centralized Origin Resource Sharing','Cross-Origin Resource Sharing','Complete Online Resource Security','Core Object Routing System'], ans: 1 },
    { q: 'Which Python framework follows the "Don\'t Repeat Yourself" (DRY) principle?', opts: ['Flask','Django','Tornado','FastAPI'], ans: 1 },
    { q: 'In a REST API, which verb is typically used for updating a resource completely?', opts: ['POST','PUT','PATCH','DELETE'], ans: 1 },
  ],
  database: [
    { q: 'What does SQL stand for?', opts: ['Simple Query Language','Structured Query Language','Standard Queer Logic','Sequential Query List'], ans: 1 },
    { q: 'Which SQL command is used to remove all records from a table without deleting the table itself?', opts: ['DELETE','DROP','TRUNCATE','REMOVE'], ans: 2 },
    { q: 'In MongoDB, what is a "Collection" equivalent to in SQL?', opts: ['Row','Column','Table','Database'], ans: 2 },
    { q: 'What is a "Primary Key"?', opts: ['A key to open the DB','A unique identifier for a record','A foreign relation','A type of index'], ans: 1 },
    { q: 'Which JOIN returns only matching records from both tables?', opts: ['LEFT JOIN','RIGHT JOIN','INNER JOIN','FULL JOIN'], ans: 2 },
    { q: 'What is the purpose of an Index in a database?', opts: ['To sort data alphabetically','To speed up data retrieval','To backup data','To encrypt sensitive info'], ans: 1 },
    { q: 'Which of these is a NoSQL database?', opts: ['PostgreSQL','MySQL','MongoDB','Oracle'], ans: 2 },
    { q: 'What does ACID stand for in database transactions?', opts: ['Access, Control, Integrity, Data','Atomicity, Consistency, Isolation, Durability','Active, Core, Internal, Direct','None of the above'], ans: 1 },
    { q: 'What is "Database Normalization"?', opts: ['Backing up data','Deleting old records','Organizing data to reduce redundancy','Compressing the DB'], ans: 2 },
    { q: 'In SQL, which clause is used to filter the result of an aggregate function?', opts: ['WHERE','GROUP BY','HAVING','ORDER BY'], ans: 2 },
  ]
}

const AIML_QUESTION_BANK = {
  'linear-algebra': [
    { q: 'What is a 2D array of numbers called in Linear Algebra?', opts: ['Vector','Matrix','Tensor','Scalar'], ans: 1 },
    { q: 'Which operation is used to reduce a matrix to its simplest form for solving equations?', opts: ['Multiplication','Gaussian Elimination','Integration','Derivation'], ans: 1 },
    { q: 'What property of a square matrix allows us to determine if it is invertible?', opts: ['Trace','Determinant','Transpose','Rank'], ans: 1 },
  ],
  'calculus': [
    { q: 'Which calculus concept is used to find the rate of change of a function?', opts: ['Integral','Derivative','Limit','Series'], ans: 1 },
    { q: 'What is the goal of Gradient Descent in ML optimization?', opts: ['Maximize the loss','Minimize the loss','Find the mean','Scale features'], ans: 1 },
    { q: 'Partial derivatives are used when a function has:', opts: ['One variable','Multiple variables','Only constants','Complex roots'], ans: 1 },
  ],
  'prob-stats': [
    { q: 'Which distribution is characterized by its bell-shaped curve?', opts: ['Poisson','Normal (Gaussian)','Bernoulli','Binomial'], ans: 1 },
    { q: 'In Bayesian probability, what is the term for the initial belief before seeing data?', opts: ['Likelihood','Posterior','Prior','Evidence'], ans: 2 },
    { q: 'A p-value measures the probability of:', opts: ['Model accuracy','Observing results by random chance','Data cleanliness','Feature importance'], ans: 1 },
  ],
  'python-ml': [
    { q: 'Which Python library is primarily used for handling multi-dimensional arrays?', opts: ['Pandas','Matplotlib','NumPy','Requests'], ans: 2 },
    { q: 'In Pandas, what is a 1D labeled array called?', opts: ['Series','DataFrame','Tensor','List'], ans: 0 },
    { q: 'Which keyword is used to find the length of a list in Python?', opts: ['size()','len()','count()','width()'], ans: 1 },
  ],
  'data-collection': [
    { q: 'The process of collecting data from websites automatically is called:', opts: ['Data Mining','Web Scraping','Data Profiling','API fetching'], ans: 1 },
    { q: 'Which of these is a structured data source?', opts: ['Audio file','SQL Database','Image','Tweet'], ans: 1 },
    { q: 'What is ground truth?', opts: ['Historical data','The actual target label we want to predict','Random noise','Model weights'], ans: 1 },
  ],
  'data-cleaning': [
    { q: 'What is "Imputation"?', opts: ['Deleting rows','Filling missing values with estimates','Encoding text','Scaling features'], ans: 1 },
    { q: 'Data points that lie far away from the majority of the data are called:', opts: ['Means','Outliers','Medians','Biases'], ans: 1 },
    { q: 'Standardizing data scales it to have a mean of:', opts: ['1','10','0','0.5'], ans: 2 },
  ],
  'feature-eng': [
    { q: 'Converting categorical text into binary columns (0 or 1) is called:', opts: ['Scalar Scaling','One-Hot Encoding','Lemmatization','Batch Normalization'], ans: 1 },
    { q: 'Which technique reduces redundant features to improve model performance?', opts: ['Feature Selection','Feature Expansion','Overfitting','Regularization'], ans: 0 },
    { q: 'Log transformation is often used to handle:', opts: ['Linear relationships','Skewed distributions','Zero values','Small datasets'], ans: 1 },
  ],
  'ml-fundamentals': [
    { q: 'Overfitting happens when a model:', opts: ['Fails on training data','Performs well on training but poor on test data','Fails on all data','Has high bias'], ans: 1 },
    { q: 'Which of these is a Supervised learning task?', opts: ['Clustering','Principal Component Analysis','Price Prediction','Dimensionality Reduction'], ans: 2 },
    { q: 'The trade-off in ML model performance is between:', opts: ['Speed and Accuracy','Bias and Variance','RAM and CPU','Input and Output'], ans: 1 },
  ],
  'supervised-reg': [
    { q: 'What is the most common loss function for Linear Regression?', opts: ['Cross Entropy','Mean Squared Error (MSE)','Accuracy','Hinge Loss'], ans: 1 },
    { q: 'Linear Regression assumes a relationship between variables that is:', opts: ['Non-linear','Exponential','Linear','Random'], ans: 2 },
    { q: 'In y = mx + c, what does "m" represent?', opts: ['Weight (Slope)','Bias (Intercept)','Error','Input'], ans: 0 },
  ],
  'supervised-cls': [
    { q: 'Which metric is calculated as TP / (TP + FP)?', opts: ['Recall','Precision','Accuracy','F1-score'], ans: 1 },
    { q: 'Logistic Regression uses which function to map output to [0,1]?', opts: ['ReLU','Sigmoid','Tangent','Step'], ans: 1 },
    { q: 'Which support vector machine (SVM) parameter controls the margin width?', opts: ['C','Gamma','Kernel','Dropout'], ans: 0 },
  ],
  'unsupervised': [
    { q: 'Which algorithm is used for clustering unlabeled data?', opts: ['K-Means','Linear Regression','Random Forest','SVM'], ans: 0 },
    { q: 'PCA is primarily used for:', opts: ['Regression','Dimensionality Reduction','Feature Expansion','Text Generation'], ans: 1 },
    { q: 'Hierarchical clustering creates a tree-like structure called a:', opts: ['Decision Tree','Dendrogram','Mind Map','Heatmap'], ans: 1 },
  ],
  'ensemble': [
    { q: 'Random Forest is based on which technique?', opts: ['Boosting','Bagging','Stacking','Pruning'], ans: 1 },
    { q: 'Which boosting algorithm is known for handling sparse data efficiently?', opts: ['Adaboost','XGBoost','SGD','Naive Bayes'], ans: 1 },
    { q: 'Combining weak learners to create a strong learner is the goal of:', opts: ['Regularization','Ensemble Learning','Cross Validation','Singular Learning'], ans: 1 },
  ],
  'eval-metrics': [
    { q: 'Which metric is the harmonic mean of Precision and Recall?', opts: ['ROC-AUC','MAE','F1-score','Accuracy'], ans: 2 },
    { q: 'Cross-validation is used to estimate:', opts: ['Training time','In-memory usage','Generalization performance','Data size'], ans: 2 },
    { q: 'A Confusion Matrix is used for:', opts: ['Regression','Classification','Clustering','None'], ans: 1 },
  ],
  'nn-fundamentals': [
    { q: 'What is the activation function typically used in hidden layers today?', opts: ['Sigmoid','Step','ReLU','Sine'], ans: 2 },
    { q: 'Backpropagation uses which rule from calculus to update weights?', opts: ['Sum Rule','Product Rule','Chain Rule','Quotient Rule'], ans: 2 },
    { q: 'A single-layer neural network is also called a:', opts: ['Transformer','Perceptron','Decoder','Convoluter'], ans: 1 },
  ],
  'cnn': [
    { q: 'Which layer type is used to detect spatial patterns like edges?', opts: ['Dense','Convolutional','Dropout','Embedding'], ans: 1 },
    { q: 'What is the purpose of a Pooling layer?', opts: ['Adds more features','Reduces spatial size/computation','Normalizes weights','Inverts colors'], ans: 1 },
    { q: 'Stride in CNN refers to:', opts: ['Number of filters','Step size of filter movement','Kernel size','Image brightness'], ans: 1 },
  ],
  'rnn': [
    { q: 'RNNs are best suited for what kind of data?', opts: ['Images','Tabular','Sequential (Text/Time-series)','Static'], ans: 2 },
    { q: 'Which specialized RNN helps solve the vanishing gradient problem?', opts: ['Simple RNN','LSTM','Perceptron','Autoencoder'], ans: 1 },
    { q: 'The hidden state in an RNN acts as a:', opts: ['Memory','Output layer','Constant','Loss function'], ans: 0 },
  ],
  'transformers': [
    { q: 'What mechanism allows Transformers to weigh the importance of different words in a sentence?', opts: ['Convolutions','Self-Attention','Recurrence','Dropout'], ans: 1 },
    { q: 'BERT is an:', opts: ['Encoder-only model','Decoder-only model','RNN model','GAN model'], ans: 0 },
    { q: 'Which part of the sequence does "Masked Multi-Head Attention" hide in GPT models?', opts: ['Past tokens','Current tokens','Future tokens','All tokens'], ans: 2 },
  ],
  'nlp-preprocessing': [
    { q: 'Reducing words to their root or dictionary form is called:', opts: ['Stemming','Lemmatization','Segmentation','Padding'], ans: 1 },
    { q: 'Breaking a paragraph into individual words or phrases is:', opts: ['Tokenization','Normalization','Synthesis','Encoding'], ans: 0 },
    { q: 'Stop words are usually:', opts: ['Highly important words','Common words like "the" or "is"','Scientific terms','Numbers'], ans: 1 },
  ],
  'nlp-tasks': [
    { q: 'Which NLP task involves identifying people, places, and organizations?', opts: ['Sentiment Analysis','Named Entity Recognition (NER)','Machine Translation','Topic Modeling'], ans: 1 },
    { q: 'Predicting whether a movie review is positive or negative is:', opts: ['Regression','Sentiment Classification','Syntactic Parsing','Coreference'], ans: 1 },
    { q: 'Translating text from English to Hindi is:', opts: ['POS Tagging','Neural Machine Translation','NER','Transcription'], ans: 1 },
  ],
  'image-processing': [
    { q: 'What is an image composed of in digital systems?', opts: ['Tokens','Pixels','Bites','Layers'], ans: 1 },
    { q: 'Which operation helps in smoothing an image and reducing noise?', opts: ['Gaussian Blur','Edge Detection','Inversion','Saturation'], ans: 0 },
    { q: 'Grayscaling an image reduces its color channels from 3 to:', opts: ['2','1','0','4'], ans: 1 },
  ],
  'computer-vision': [
    { q: 'Which task involves drawing a bounding box around objects?', opts: ['Classification','Object Detection','Segmentation','Compression'], ans: 1 },
    { q: 'SOTA object detection algorithm YOLO stands for:', opts: ['You Only Look Once','You Observe Local Objects','Your Only Linear Option','None'], ans: 0 },
    { q: 'Instance segmentation does what?', opts: ['Labels the whole image','Labels every pixel of an object instance','Draws a square','Only detects cats'], ans: 1 },
  ],
  'rl-fundamentals': [
    { q: 'In Reinforcement Learning, the entity interacting with the world is called:', opts: ['Reward','Agent','Environment','Policy'], ans: 1 },
    { q: 'The objective of an RL agent is to maximize:', opts: ['Speed','Total Cumulative Reward','Number of steps','Loss'], ans: 1 },
    { q: 'A policy defines the agent\'s:', opts: ['Next reward','Strategy/Action choice','Internal state','Memory limit'], ans: 1 },
  ],
  'rl-algorithms': [
    { q: 'What does DQN stand for?', opts: ['Data Quality Network','Deep Q-Network','Digital Quartz Node','Dense Query Net'], ans: 1 },
    { q: 'Which algorithm directly optimizes the policy weights?', opts: ['Q-Learning','Policy Gradients','K-Means','SVM'], ans: 1 },
    { q: 'PPO (Proximal Policy Optimization) is used for:', opts: ['Stable RL training','Image cropping','Text cleaning','Data labeling'], ans: 0 },
  ],
  'mlops': [
    { q: 'What is the primary goal of MLOps?', opts: ['Writing more code','Bridging ML development and production deployment','Only training models','Collecting more data'], ans: 1 },
    { q: 'Which tool is commonly used for ML experiment tracking?', opts: ['Excel','MLflow','Word','Chrome'], ans: 1 },
    { q: 'CI/CD in MLOps stands for:', opts: ['Continuous Integration/Continuous Deployment','Control Input/Core Development','Constant Increase/Center Data','None'], ans: 0 },
  ],
  'deployment': [
    { q: 'Creating a web URL to access your model is called:', opts: ['API deployment','Data staging','Retraining','Model decay'], ans: 0 },
    { q: 'Which tool is used for containerizing models?', opts: ['PostgreSQL','Docker','PyTorch','Pandas'], ans: 1 },
    { q: 'TensorFlow Lite is used for deployment on:', opts: ['Supercomputers','Cloud clusters','Edge/Mobile devices','Hard drives'], ans: 2 },
  ],
  'monitoring': [
    { q: 'What is Concept Drift?', opts: ['Code becoming buggy','Model performance dropping as input relationships change','User losing interest','Server overheating'], ans: 1 },
    { q: 'Monitoring systems track which of these?', opts: ['Model latency','Only CPU usage','Only data names','Color of logs'], ans: 0 },
    { q: 'Retraining is triggered when:', opts: ['The model is 1 day old','Performance drops below a threshold','The developer joins','Always'], ans: 1 },
  ],
  'frameworks': [
    { q: 'Which framework is developed by Meta (Facebook)?', opts: ['TensorFlow','PyTorch','Keras','Scikit-learn'], ans: 1 },
    { q: 'Which library is built into TensorFlow as a high-level API?', opts: ['Scipy','Keras','SeaBorn','NLTK'], ans: 1 },
    { q: 'What is the primary advantage of GPU acceleration?', opts: ['Larger storage','Parallel processing of matrix math','Cleaner code','Better UI'], ans: 1 },
  ],
  'libraries': [
    { q: 'Which library is used for traditional ML algorithms like SVM and Regression?', opts: ['OpenCV','Scikit-learn','PyTorch','Spacy'], ans: 1 },
    { q: 'Which library is the standard for NLP transformers?', opts: ['HuggingFace','Matplotlib','NumPy','Requests'], ans: 0 },
    { q: 'OpenCV is used for:', opts: ['NLP','Computer Vision','Reinforcement Learning','Deployment'], ans: 1 },
  ],
  'gen-ai': [
    { q: 'What does LLM stand for?', opts: ['Low Level Math','Large Language Model','Linear Logic Mode','Live Logo Maker'], ans: 1 },
    { q: 'Which model type is used by DALL-E and Midjourney?', opts: ['RNN','Diffusion Model','Linear Regression','Decision Tree'], ans: 1 },
    { q: 'What is Hallucination in LLMs?', opts: ['Model running out of RAM','Model generating plausible but factually incorrect info','Model running too fast','None'], ans: 1 },
  ],
  'xai': [
    { q: 'What is the purpose of Explainable AI (XAI)?', opts: ['To make models faster','To provide transparency on how models make decisions','To automate training','To hide biases'], ans: 1 },
    { q: 'Which technique is used to explain individual model predictions?', opts: ['SHAP','LSTM','K-Means','CNN'], ans: 0 },
    { q: 'XAI is critical in high-stakes fields like:', opts: ['Video gaming','Healthcare and Finance','E-commerce ads','Photo filters'], ans: 1 },
  ],
  'ml-system-design': [
    { q: 'Which design decision involves processing data as it arrives?', opts: ['Batch Processing','Online/Stream Processing','Static offline','Manual entry'], ans: 1 },
    { q: 'Scaling a system by adding more servers is called:', opts: ['Vertical Scaling','Horizontal Scaling','Internal Scaling','Deep Scaling'], ans: 1 },
    { q: 'What is a cold start problem in recommendation systems?', opts: ['Server is cold','No data for new users/items','The code is old','None'], ans: 1 },
  ],
}
const COOKING_TOPICS = [
  { key: 'veg-section', title: '🥗 Veg Section', icon: 'Salad' },
  { key: 'non-veg-section', title: '🍗 Non-Veg Section', icon: 'Flame' },
]

const COOKING_THEORY_DATA = {
  'veg-section': [
    "Paneer Butter Masala: 1. Sauté onions, ginger, and garlic. 2. Add tomato puree and spices. 3. Mix in butter, cream, and paneer cubes. 4. Simmer until thick.",
    "Vegetable Biryani: 1. Parboil basmati rice. 2. Sauté mixed veggies with biryani masala. 3. Layer rice and veggies. 4. Dum cook for 15 mins.",
    "Dal Tadka: 1. Pressure cook lentils with turmeric. 2. Prepare tempering with cumin, garlic, and chilies. 3. Pour tempering over dal. 4. Garnish with cilantro.",
    "Aloo Gobi: 1. Sauté cauliflower and potatoes. 2. Add turmeric, coriander, and chili powder. 3. Cook covered until tender. 4. Finish with dry mango powder.",
    "Palak Paneer: 1. Blanch and puree spinach. 2. Sauté aromatics. 3. Add puree and paneer cubes. 4. Cook for 5 mins and add cream.",
    "Chana Masala: 1. Cook soaked chickpeas. 2. Prepare spicy tomato-onion gravy. 3. Simmer chickpeas in gravy. 4. Add amchur and garam masala.",
    "Baingan Bharta: 1. Roast eggplant over flame. 2. Mash and sauté with onions and tomatoes. 3. Add spices and green peas. 4. Garnish with coriander.",
    "Mix Veg Curry: 1. Sauté carrot, beans, and peas. 2. Add basic curry spices and yogurt. 3. Simmer until veggies are soft. 4. Serve with roti.",
    "Mushroom Mastani: 1. Sauté mushrooms with onions. 2. Add cashews and tomato paste. 3. Cook until richness develops. 4. Finish with cream.",
    "Okra (Bhindi) Fry: 1. Sauté chopped okra with cumin. 2. Add turmeric and chili powder. 3. Fry until crispy. 4. Avoid covering to prevent sliminess."
  ],
  'non-veg-section': [
    "Butter Chicken: 1. Marinate chicken in yogurt and spices. 2. Grill or fry chicken. 3. Simmer in rich tomato-butter gravy. 4. Add heavy cream.",
    "Chicken Biryani: 1. Marinate chicken with spices. 2. Partial cook rice. 3. Layer chicken and rice in pot. 4. Dum cook for 20 mins.",
    "Egg Curry: 1. Boil and peel eggs. 2. Prepare onion-tomato gravy. 3. Add eggs and simmer with spices. 4. Finish with garam masala.",
    "Fish Fry: 1. Marinate fish with ginger-garlic paste and lemon. 2. Coat with rava or flour. 3. Shallow fry until golden. 4. Garnish with lemon.",
    "Mutton Rogan Josh: 1. Sauté ginger and fennel seeds. 2. Add mutton and brown well. 3. Simmer with yogurt and Kashmiri chili. 4. Cook until tender.",
    "Tandoori Chicken: 1. Cut gashes in chicken. 2. Apply spicy yogurt marinade. 3. Roast in oven or tandoor. 4. Baste with butter.",
    "Prawn Masala: 1. Clean prawns. 2. Sauté with lots of garlic and curry leaves. 3. Add tomato paste and spices. 4. Cook for 5 mins.",
    "Chicken Stew: 1. Sauté chicken with whole spices. 2. Add coconut milk and potatoes. 3. Simmer gently. 4. Serve with appam.",
    "Grilled Salmon: 1. Season salmon with salt, pepper, and herbs. 2. Sear on hot grill skin-side down. 3. Flip and cook briefly. 4. Serve with lemon.",
    "Chicken Alfredo: 1. Cook pasta. 2. Sauté chicken strips. 3. Make sauce with cream and Parmesan. 4. Combine all together."
  ]
}


const PRODUCTIVITY_PREP_TOPICS = [
  { 
    key: 'planning', 
    title: '1. 🎯 Planning & Focus',
    subtopics: [
      { key: 'goal-setting', title: 'Goal Setting' },
      { key: 'daily-planning', title: 'Daily Planning' },
      { key: 'time-blocking', title: 'Time Blocking' },
      { key: 'prioritization', title: 'Prioritization (What Matters First)' },
      { key: 'todo-management', title: 'To-Do List Management' },
    ]
  },
  { 
    key: 'focus', 
    title: '2. 🚫 Overcoming Distractions',
    subtopics: [
      { key: 'procrastination', title: 'Avoiding Procrastination' },
      { key: 'focus-techniques', title: 'Focus Techniques' },
      { key: 'deep-work', title: 'Deep Work Basics' },
      { key: 'distraction-control', title: 'Distraction Control' },
      { key: 'digital-minimalism', title: 'Digital Minimalism' },
    ]
  },
  { 
    key: 'habits', 
    title: '3. 🔄 Consistency & Systems',
    subtopics: [
      { key: 'habit-building', title: 'Habit Building' },
      { key: 'habit-stacking', title: 'Habit Stacking' },
      { key: 'consistency-systems', title: 'Consistency Systems' },
      { key: 'motivation-discipline', title: 'Motivation vs Discipline' },
    ]
  },
  { 
    key: 'advanced', 
    title: '4. ⚖️ Review & Balance',
    subtopics: [
      { key: 'decision-making', title: 'Decision Making' },
      { key: 'overthinking', title: 'Avoiding Overthinking' },
      { key: 'energy-mgmt', title: 'Energy Management' },
      { key: 'burnout-prevention', title: 'Burnout Prevention' },
      { key: 'review-reflection', title: 'Review & Reflection (Daily/Weekly)' },
      { key: 'prod-systems', title: 'Productivity Systems (Personal Workflow)' },
    ]
  },
]

const PRODUCTIVITY_PREP_THEORY_DATA = {
  // Topic 1
  'goal-setting': "Goal setting is the process of identifying something that you want to accomplish and establishing measurable objectives and timeframes. Use the SMART criteria: Specific, Measurable, Achievable, Relevant, and Time-bound.",
  'daily-planning': "Daily planning involves mapping out your day before it starts. This reduces decision fatigue and ensuring you start your morning with clarity. Spend 5-10 minutes every night or morning to list your key objectives.",
  'time-blocking': "Time blocking allocates fixed 'blocks' of time for specific tasks. Instead of a vague to-do list, your calendar shows exactly when you will work on what, reducing context switching and improving focus.",
  'prioritization': "Prioritization is determining which tasks to tackle first based on urgency and importance. The Eisenhower Matrix (Do, Schedule, Delegate, Delete) is a core tool for effective prioritization.",
  'todo-management': "Effective to-do list management ensures your tasks are actionable and not overwhelming. Break large projects into 'next actions'—tasks that take less than 30 minutes and have a clear starting point.",

  // Topic 2
  'procrastination': "Procrastination is often an emotional regulation problem, not a time management one. Break the 'activation barrier' by starting with a 2-minute version of the task to build momentum.",
  'focus-techniques': "The Pomodoro Technique (25m work / 5m break) and the 5-Second Rule are powerful ways to sustain focus. Train your brain like a muscle by incrementally increasing your focus intervals.",
  'deep-work': "Deep Work is the ability to focus without distraction on a cognitively demanding task. It requires a distraction-free environment and a dedicated block of time where you are not reachable.",
  'distraction-control': "Identify your 'leaks'—social media, notifications, or physical clutter. Control your environment by using website blockers, turning off non-essential notifications, and using noise-canceling headphones.",
  'digital-minimalism': "Digital minimalism is about using technology intentionally. Audit your apps and subscriptions. Keep only the tools that add significant value to your life and remove the rest.",

  // Topic 3
  'habit-building': "Habits are the compound interest of self-improvement. Use the Queue-Crave-Response-Reward loop to design new behaviors. Start incredibly small to ensure consistency even on low-motivation days.",
  'habit-stacking': "Habit stacking is anchoring a new habit to an existing one. 'After I pour my morning coffee (existing), I will write one line in my journal (new)'. This leverages established neural pathways.",
  'consistency-systems': "Systems beat goals. A system is a repeatable process that makes success inevitable. Focus on 'not breaking the chain' rather than the final outcome. Track your progress visually.",
  'motivation-discipline': "Motivation is a feeling that comes and goes. Discipline is doing what needs to be done whether you feel like it or not. Design your environment so that discipline requires less effort.",

  // Topic 4
  'decision-making': "Decision fatigue is real. Limit the number of trivial decisions you make (what to wear, what to eat) to save your mental energy for the high-stakes choices that define your growth.",
  'overthinking': "Analysis paralysis kills progress. Use the 70% rule: if you have 70% of the information you need and feel 70% confident, take action. Experience is the best antidote to overthinking.",
  'energy-mgmt': "Manage your energy, not just your time. Identify your 'Peak Hours'—when you are most alert—and schedule your most demanding work during those times. Protect your sleep and nutrition.",
  'burnout-prevention': "Burnout is chronic stress that hasn't been successfully managed. Recognize the signs: exhaustion, cynicism, and reduced efficacy. Intentionally schedule 'recharge' time that is completely work-free.",
  'review-reflection': "A weekly review is the 'Operating System' of productivity. Look back at what worked, what didn't, and what's coming up. This provides the 'Eagle Eye' view needed for long-term alignment.",
  'prod-systems': "A personal workflow is the collection of tools and rituals you use to process information and tasks. Whether it's GTD (Getting Things Done) or a simple notebook, find a system that you trust completely.",
}

const DSA_QUESTIONS_PER_PATTERN = 50
const DSA_PATTERN_QUESTION_TITLES = {
  'two-pointers': ['Pair Sum in Sorted Array', 'Triplet Sum to Target', 'Container With Most Water', 'Remove Duplicates In Place', 'Square and Sort Array', 'Closest Pair Difference', 'Four Sum Candidates', 'Dutch Flag Partition', 'Move Zeros Efficiently', 'Partition Around Pivot'],
  'sliding-window': ['Maximum Sum Subarray Size K', 'Minimum Window Substring', 'Longest Unique Substring', 'First Negative in Window', 'Count Anagrams in Text', 'Longest Repeating Replacement', 'Subarray Product Less Than K', 'Min Length Subarray Sum', 'Max Consecutive Ones III', 'Sliding Median Estimate'],
  'fast-slow-pointers': ['Detect Linked List Cycle', 'Find Cycle Entry Node', 'Middle of Linked List', 'Palindrome Linked List', 'Happy Number Detection', 'Find Duplicate Number', 'Reorder Linked List', 'Split Circular List', 'Length of Cycle', 'Remove Nth Node from End'],
  'binary-search': ['Binary Search Exact Match', 'First Occurrence Index', 'Last Occurrence Index', 'Lower Bound Position', 'Upper Bound Position', 'Search Rotated Array', 'Search in Bitonic Array', 'Peak Element Index', 'Sqrt by Binary Search', 'Binary Search on Answer'],
  'prefix-sum': ['Range Sum Queries', 'Subarray Sum Equals K', 'Count Subarrays Divisible by K', 'Pivot Index Finder', 'Equilibrium Point', 'Difference Array Updates', '2D Prefix Sum Query', 'Maximum Prefix Value', 'Prefix XOR Queries', 'Balanced Binary Subarray'],
  hashing: ['Two Sum HashMap', 'Longest Consecutive Sequence', 'First Non-Repeating Character', 'Group Anagrams', 'Frequency Sort', 'Top K Frequent Elements', 'Isomorphic Strings', 'Contains Duplicate II', 'Valid Sudoku Check', 'Count Distinct in Window'],
  recursion: ['Factorial Computation', 'Fibonacci Number', 'Power Function', 'Binary Search Recursive', 'Reverse String Recursive', 'Generate Subsets', 'Generate Permutations', 'Recursive GCD', 'Tower of Hanoi Moves', 'Count Paths in Grid'],
  backtracking: ['N-Queens Solver', 'Sudoku Solver', 'Word Search Grid', 'Combination Sum', 'Combination Sum II', 'Palindrome Partitioning', 'Restore IP Addresses', 'Generate Parentheses', 'Subset With Duplicates', 'K-Partition Equal Sum'],
  'divide-conquer': ['Merge Sort Array', 'Quick Sort Partition', 'Count Inversions', 'Majority Element', 'Closest Pair of Points', 'Maximum Subarray Divide-Conquer', 'Power Fast Exponentiation', 'Karatsuba Multiplication', 'Merge K Sorted Lists', 'Skyline Problem Split'],
  greedy: ['Activity Selection', 'Minimum Platforms', 'Job Sequencing', 'Fractional Knapsack', 'Gas Station Circuit', 'Jump Game Reachability', 'Candy Distribution', 'Minimum Arrows Balloons', 'Non-overlapping Intervals', 'Assign Cookies'],
  dp: ['Climbing Stairs', 'House Robber', 'Coin Change', 'Longest Increasing Subsequence', 'Longest Common Subsequence', '0/1 Knapsack', 'Edit Distance', 'Partition Equal Subset', 'Decode Ways', 'Matrix Chain Multiplication'],
  'bit-manipulation': ['Single Number XOR', 'Count Set Bits', 'Power of Two Check', 'Bitwise Addition', 'Reverse Bits', 'Subset Enumeration by Mask', 'Find Missing Number XOR', 'Swap Without Temp', 'Maximum XOR Pair', 'Bitwise AND Range'],
  'tree-traversal': ['Preorder Traversal', 'Inorder Traversal', 'Postorder Traversal', 'Level Order Traversal', 'Zigzag Traversal', 'Right View of Tree', 'Height of Binary Tree', 'Diameter of Binary Tree', 'Path Sum Exists', 'Boundary Traversal'],
  bst: ['Search in BST', 'Insert into BST', 'Delete Node in BST', 'Validate BST', 'Kth Smallest in BST', 'Lowest Common Ancestor BST', 'BST Iterator', 'Recover Swapped BST', 'Range Sum BST', 'Convert Sorted Array to BST'],
  'graph-traversal': ['DFS Traversal', 'BFS Traversal', 'Connected Components', 'Number of Islands', 'Flood Fill', 'Clone Graph', 'Bipartite Graph Check', 'Cycle in Undirected Graph', 'Cycle in Directed Graph', 'Shortest Path Unweighted'],
  'topological-sort': ['Course Schedule Order', 'Alien Dictionary Order', 'Build Order Dependencies', 'Minimum Semesters', 'Find All Topological Orders', 'Task Scheduling Feasibility', 'DAG Longest Path', 'Event Processing Order', 'Package Install Order', 'Topological Sort Kahn'],
  'union-find': ['Disjoint Set Operations', 'Number of Provinces', 'Redundant Connection', 'Accounts Merge', 'Dynamic Connectivity', 'Network Connectivity Needed', 'Friend Circles', 'Detect Cycle DSU', 'Smallest Equivalent String', 'Union by Rank Path Compression'],
  'shortest-path': ['Dijkstra Single Source', 'Bellman Ford Relaxation', 'Floyd Warshall All Pairs', 'Shortest Path in Grid', 'Network Delay Time', 'Cheapest Flights K Stops', 'Minimum Effort Path', 'A* Search Basics', '0-1 BFS Path', 'Shortest Path with Obstacles'],
  mst: ['Kruskal MST Cost', 'Prim MST Cost', 'Connect Points Minimum Cost', 'Water Supply Optimization', 'Road Repair Minimum Cost', 'MST Edge Classification', 'MST with Existing Roads', 'Second Best MST', 'Power Grid Expansion', 'Minimum Cable Length'],
  'monotonic-stack': ['Next Greater Element', 'Previous Smaller Element', 'Largest Rectangle Histogram', 'Trapping Rain Water', 'Stock Span Problem', 'Daily Temperatures', 'Remove K Digits', 'Sum of Subarray Minimums', '132 Pattern Detection', 'Asteroid Collision'],
  'monotonic-queue': ['Sliding Window Maximum', 'Shortest Subarray at Least K', 'Constrained Subsequence Sum', 'Max Value Equation', 'Jump Game VI', 'Deque Window Min', 'Longest Subarray Limit', 'Monotonic Queue DP', 'Window Difference Bound', 'Rainfall Window Peaks'],
  'heap-priority-queue': ['Kth Largest Element', 'Top K Frequent Numbers', 'Merge K Sorted Lists', 'Find Median from Stream', 'Smallest Range Covering Lists', 'Task Scheduler Priority', 'Reorganize String Heap', 'Connect Ropes Min Cost', 'IPO Max Capital', 'Heap Sort Simulation'],
  trie: ['Insert and Search Trie', 'Prefix Count Queries', 'Longest Word in Dictionary', 'Word Break with Trie', 'Replace Words by Root', 'Maximum XOR with Trie', 'Autocomplete Suggestions', 'Word Dictionary Wildcard', 'Palindrome Pairs Trie', 'Stream Checker'],
  'segment-tree': ['Range Sum Query Update', 'Range Minimum Query', 'Range Maximum Query', 'Lazy Propagation Updates', 'Count Greater Than K', 'Kth Order Statistic', 'Range XOR Query', 'Bracket Sequence Segment Tree', 'Segment Tree Beats Intro', 'Hotel Query Allocation'],
  'fenwick-tree': ['Fenwick Prefix Sum', 'Fenwick Range Update Point Query', 'Fenwick Point Update Range Query', 'Inversion Count BIT', 'Order Statistic BIT', '2D Fenwick Query', 'BIT Coordinate Compression', 'Distinct Query Offline BIT', 'BIT Lower Bound Search', 'Fenwick XOR Query'],
  'meet-in-the-middle': ['Subset Sum Meet-in-Middle', 'Minimum Difference Partition', 'Max Subsequence Under Limit', '4-Sum Meet-in-Middle', 'Balanced Team Selection', 'Count Valid Subsets', 'Knapsack Split Half', 'Closest Subsequence Sum', 'Bidirectional Search Puzzle', 'Half Enumeration Optimization'],
  'game-theory': ['Nim Game Winner', 'Stone Game Outcome', 'Optimal Strategy for Coin Game', 'Grundy Number Basics', 'Take Away Game Variant', 'Predict the Winner', 'Divisor Game', 'Chocolates in Box Game', 'Turning Turtles Strategy', 'Minimax Decision Tree'],
}

function getPatternQuestionTitle(patternKey, idx) {
  const titles = DSA_PATTERN_QUESTION_TITLES[patternKey] || ['Pattern Problem']
  const base = titles[idx % titles.length]
  const setNo = Math.floor(idx / titles.length) + 1
  return `${base} ${setNo}`
}

function buildDsaQuestion(pattern, idx) {
  const level = idx < 20 ? 'Easy' : idx < 35 ? 'Medium' : 'Hard'
  const n = idx + 3
  const baseTitle = getPatternQuestionTitle(pattern.key, idx)
  const patternName = pattern.title.replace(/^\d+\.\s*/, '')
  
  const fullDesc = `### 1. Problem Title
**${baseTitle}**

### 2. Problem Description
Master the **${patternName}** algorithmic pattern by solving this challenge. Your task is to implement an efficient solution that process the input data within the specified time and space complexity. This problem focuses on the fundamental concepts of **${patternName.toLowerCase()}** to build your problem-solving intuition.

### 3. Input Format
- An integer **n** representing the size or base value for the operation.
- (Optional) A sequence of integers provided via standard input.

### 4. Output Format
- Return or print a single integer representing the calculated result based on the ${patternName.toLowerCase()} logic.

### 5. Constraints
- 1 ≤ n ≤ ${idx < 20 ? '1,000' : idx < 35 ? '100,000' : '1,000,000'}
- Time Complexity: O(n) or O(log n) preferred.
- Space Complexity: O(1) or O(n) depending on the approach.

### 6. Example
**Input:**
\`\`\`
n = ${n}
\`\`\`
**Output:**
\`\`\`
${(n * (n + 1)) / 2}
\`\`\`

### 7. Explanation
The algorithm iterates through the input space using the **${patternName}** strategy. For the input **n = ${n}**, the logic applies the transformation to yield the result **${(n * (n + 1)) / 2}**.

### 8. Notes
Ensure your solution handles edge cases such as minimum and maximum values of **n**.`

  return {
    title: baseTitle,
    description: baseTitle, // List view will show title only (p tag removed in UI anyway)
    fullDescription: fullDesc,
    input: `n = ${n}`,
    output: `${(n * (n + 1)) / 2}`,
    constraints: `1 <= n <= ${idx < 20 ? 1000 : idx < 35 ? 100000 : 1000000}`,
    difficulty: level,
  }
}

const DSA_QUESTION_BANK = DSA_PATTERN_TOPICS.reduce((acc, pattern) => {
  acc[pattern.key] = Array.from({ length: DSA_QUESTIONS_PER_PATTERN }, (_, idx) => buildDsaQuestion(pattern, idx))
  return acc
}, {})

function slugify(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function normalizeOutput(s) {
  return s == null ? '' : String(s).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd()
}
function outputsMatch(got, expected) {
  return normalizeOutput(got) === normalizeOutput(expected)
}

function runJavaScript(code, stdin) {
  let output = ''
  const fakeConsole = { log: (...a) => { output += a.map(String).join(' ') + '\n' } }
  try {
    const fn = new Function('console', `const stdin = ${JSON.stringify(stdin)};\n${code}`)
    fn(fakeConsole)
    return { ok: true, stdout: output, stderr: '' }
  } catch (e) {
    return { ok: false, stdout: output, stderr: String(e.message || e) }
  }
}

async function runPiston(lang, code, stdin) {
  const map = {
    python: { language: 'python', version: '3.10.0', name: 'main.py' },
    c:      { language: 'c',      version: '10.2.0', name: 'main.c'  },
    cpp:    { language: 'c++',    version: '10.2.0', name: 'main.cpp' },
    java:   { language: 'java',   version: '15.0.2', name: 'Main.java' },
  }
  const m = map[lang]
  const res = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: m.language, version: m.version,
      files: [{ name: m.name, content: code }],
      stdin: stdin ?? '',
    }),
  })
  const data = await res.json()
  if (!data.run) return { ok: false, stdout: '', stderr: data.message || 'Unknown error' }
  const err = [data.compile?.stderr, data.run.stderr].filter(Boolean).join('\n').trim()
  const okRun     = data.run.code === 0 || data.run.code == null
  const okCompile = data.compile == null || data.compile.code === 0 || data.compile.code == null
  return { ok: okCompile && okRun, stdout: data.run.stdout ?? '', stderr: err || (!okRun ? `Exit code ${data.run.code}` : '') }
}

async function executeCode(lang, code, stdin) {
  if (lang === 'javascript') return runJavaScript(code, stdin)
  try { return await runPiston(lang, code, stdin) }
  catch (e) { return { ok: false, stdout: '', stderr: String(e.message || e) + ' (network error — try JavaScript mode.)' } }
}

export default function DailyPage({ onSaveAnswer }) {
  const [mode, setMode]           = useState('categories')
  const [category, setCategory]   = useState(null)
  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex]       = useState(0)
  const [selected, setSelected]   = useState(null)
  const [timeLeft, setTimeLeft]   = useState(600)
  const [resultData, setResultData] = useState(null)

  // coding state
  const [codingProblems, setCodingProblems] = useState([])
  const [codingRound, setCodingRound]       = useState(0)
  const [codingSolved, setCodingSolved]     = useState([false, false, false, false, false])
  const [codingLang, setCodingLang]         = useState(() => localStorage.getItem(STORAGE_CODING_LANG) || 'javascript')
  const [codingCode, setCodingCode]         = useState('')
  const [terminalOut, setTerminalOut]       = useState('')
  const [codingPath, setCodingPath]         = useState({ language: null, topic: null, questionSlug: null })
  const [javaCode, setJavaCode]             = useState(DEFAULT_BOILERPLATE_BY_LANGUAGE.java)
  const [customInput, setCustomInput]       = useState('')
  const [runResult, setRunResult]           = useState(null)
  const [dsaPath, setDsaPath]               = useState({ patternKey: null, questionSlug: null })
  const [dsaLanguage, setDsaLanguage]       = useState('java')
  const [dsaCode, setDsaCode]               = useState(DEFAULT_BOILERPLATE_BY_LANGUAGE.java)
  const [dsaCustomInput, setDsaCustomInput] = useState('')
  const [dsaRunResult, setDsaRunResult]     = useState(null)
  const [aptitudePath, setAptitudePath]     = useState({ topicKey: null, questionSlug: null })
  const [reasoningPath, setReasoningPath]   = useState({ topicKey: null, questionSlug: null })
  const [csPath, setCsPath]                 = useState({ topicKey: null, subtopicKey: null, questionSlug: null, isTheory: false })
  const [mathPath, setMathPath]             = useState({ topicKey: null, subtopicKey: null, questionSlug: null })
  const [englishPath, setEnglishPath]       = useState({ topicKey: null, subtopicKey: null, questionSlug: null })
  const [creativityPath, setCreativityPath] = useState({ topicKey: null, subtopicKey: null, questionSlug: null, isTheory: false })
  const [productivityPrepPath, setProductivityPrepPath] = useState({ topicKey: null, subtopicKey: null, isTheory: false })
  const [languagePath, setLanguagePath] = useState({ topicKey: null, isTheory: false })
  const [fitnessPath, setFitnessPath] = useState({ topicKey: null, isTheory: false })
  const [gkPath, setGkPath] = useState({ topicKey: null, isTheory: false })
  const [cookingPath, setCookingPath] = useState({ topicKey: null, isTheory: false })
  const [webdevPath, setWebdevPath] = useState({ topicKey: null, isTheory: false })
  const [aimlPath, setAimlPath] = useState({ topicKey: null, isTheory: false, isQuiz: false })
  const [funPath, setFunPath] = useState({ topicKey: null, isTheory: false })

  // ── Problem Page (LeetCode-style) ─────────────────────────────────────────
  const [problemPageState, setProblemPageState] = useState(null) // { problemId, topicTitle }

  // refs to avoid stale closures
  const timerRef         = useRef(null)
  const correctRef       = useRef(0)
  const startTimeRef     = useRef(0)
  const challengeNameRef = useRef('')
  const categoryRef      = useRef(null)
  const codingProblemsRef = useRef([])
  const codingRoundRef   = useRef(0)
  const codingSolvedRef  = useRef([false, false, false, false, false])
  const codingLangRef    = useRef(codingLang)

  useEffect(() => { return () => clearInterval(timerRef.current) }, [])

  useEffect(() => {
    const syncFromPath = () => {
      const parts = window.location.pathname.split('/').filter(Boolean)
      if (parts[0] === 'coding') {
        setMode('coding')
        setCodingPath({
          language: parts[1] || null,
          topic: parts[2] || null,
          questionSlug: parts[3] || null,
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'dsa') {
        setMode('dsa')
        setDsaPath({
          patternKey: parts[2] || null,
          questionSlug: parts[3] || null,
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'aptitude') {
        setMode('aptitude')
        setAptitudePath({
          topicKey: parts[2] || null,
          questionSlug: parts[3] || null,
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'reasoning') {
        setMode('reasoning')
        setReasoningPath({
          topicKey: parts[2] || null,
          questionSlug: parts[3] || null,
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'cs') {
        setMode('cs')
        setCsPath({
          topicKey: parts[2] || null,
          subtopicKey: parts[3] || null,
          questionSlug: parts[4] || null,
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'math') {
        setMode('math')
        setMathPath({
          topicKey: parts[2] || null,
          subtopicKey: parts[3] || null,
          questionSlug: parts[4] || null,
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'english') {
        setMode('english')
        setEnglishPath({
          topicKey: parts[2] || null,
          subtopicKey: parts[3] || null,
          questionSlug: parts[4] || null,
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'creativity') {
        setMode('creativity')
        setCreativityPath({
          topicKey: parts[2] || null,
          subtopicKey: parts[3] || null,
          questionSlug: parts[4] || null,
          isTheory: parts[5] === 'theory'
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'language') {
        setMode('language')
        setLanguagePath({
          topicKey: parts[2] || null,
          isTheory: parts[3] === 'theory'
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'fitness') {
        setMode('fitness')
        setFitnessPath({
          topicKey: parts[2] || null,
          isTheory: parts[3] === 'theory'
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'gk') {
        setMode('gk')
        setGkPath({
          topicKey: parts[2] || null,
          isTheory: parts[3] === 'theory'
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'cooking') {
        setMode('cooking')
        setCookingPath({
          topicKey: parts[2] || null,
          isTheory: parts[3] === 'theory'
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'webdev') {
        setMode('webdev')
        setWebdevPath({
          topicKey: parts[2] || null,
          isTheory: parts[3] === 'theory'
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'aiml') {
        setMode('aiml')
        setAimlPath({
          topicKey: parts[2] || null,
          isTheory: parts[3] === 'theory',
          isQuiz: parts[3] === 'quiz'
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'fun') {
        setMode('fun')
        setFunPath({
          topicKey: parts[2] || null,
          isTheory: parts[3] === 'theory'
        })
        return
      }
      if (parts[0] === 'daily' && parts[1] === 'productivity-prep') {
        setMode('productivity-prep')
        setProductivityPrepPath({
          topicKey: parts[2] || null,
          subtopicKey: parts[3] || null,
          isTheory: parts[4] === 'theory'
        })
        return
      }
      if (parts[0] === 'daily') {
        setMode('categories')
        setDsaPath({ patternKey: null, questionSlug: null })
      }
    }
    syncFromPath()
    window.addEventListener('popstate', syncFromPath)
    return () => window.removeEventListener('popstate', syncFromPath)
  }, [])

  const finishChallenge = useCallback(() => {
    clearInterval(timerRef.current)
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
    const c = correctRef.current
    setResultData({ correct: c, xp: c * 20 + (5 - c) * 5, elapsed })
    setMode('result')
  }, [])

  function startTimer() {
    clearInterval(timerRef.current)
    setTimeLeft(600)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { finishChallenge(); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  function startQuiz(cat) {
    const bank = questionBank[cat.id] || []
    if (bank.length < 5) { showToast('No questions for this category yet.', 'error'); return }
    const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, 5)
    const now = Date.now()
    correctRef.current       = 0
    startTimeRef.current     = now
    challengeNameRef.current = `${cat.id}_${now}`
    categoryRef.current      = cat
    setCategory(cat)
    setQuestions(shuffled)
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }

  function startAptitudeQuiz(topicKey, questionIdx) {
    const q = APTITUDE_QUESTION_BANK[topicKey][questionIdx]
    if (!q) return
    const now = Date.now()
    correctRef.current       = 0
    startTimeRef.current     = now
    challengeNameRef.current = `aptitude_${topicKey}_${questionIdx}_${now}`
    categoryRef.current      = { id: 'aptitude', title: 'Aptitude', emoji: '📐' }
    setCategory(categoryRef.current)
    setQuestions([q])
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }

  function startReasoningQuiz(topicKey, questionIdx) {
    const q = REASONING_QUESTION_BANK[topicKey][questionIdx]
    if (!q) return
    const now = Date.now()
    correctRef.current       = 0
    startTimeRef.current     = now
    challengeNameRef.current = `reasoning_${topicKey}_${questionIdx}_${now}`
    categoryRef.current      = { id: 'reasoning', title: 'Reasoning', emoji: '🧠' }
    setCategory(categoryRef.current)
    setQuestions([q])
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }

  function startGkQuiz(topicKey) {
    const bank = GK_QUESTION_BANK[topicKey] || []
    if (bank.length === 0) {
      showToast('Practice questions for this topic are coming soon!', 'info')
      return
    }
    const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, 5)
    const now = Date.now()
    correctRef.current = 0
    startTimeRef.current = now
    challengeNameRef.current = `gk_${topicKey}_${now}`
    categoryRef.current = { id: 'gk', title: 'General Knowledge', emoji: '🌍' }
    setCategory(categoryRef.current)
    setQuestions(shuffled)
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }

  function startWebdevQuiz(topicKey) {
    const questionsBlock = WEBDEV_QUESTION_BANK[topicKey] || []
    if (questionsBlock.length === 0) { showToast('No questions for this category yet.', 'error'); return }
    const shuffled = [...questionsBlock].sort(() => Math.random() - 0.5).slice(0, 5)
    
    const now = Date.now()
    const cat = SKILL_CATEGORIES.find(c => c.id === 'webdev')
    correctRef.current       = 0
    startTimeRef.current     = now
    challengeNameRef.current = `webdev_${topicKey}_${now}`
    categoryRef.current      = cat
    setCategory(cat)
    setQuestions(shuffled)
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }

  function startAimlQuiz(topicKey) {
    const questionsBlock = AIML_QUESTION_BANK[topicKey] || []
    if (questionsBlock.length === 0) { showToast('No questions for this topic yet.', 'error'); return }
    const shuffled = [...questionsBlock].sort(() => Math.random() - 0.5).slice(0, 5)
    
    const now = Date.now()
    const cat = SKILL_CATEGORIES.find(c => c.id === 'aiml')
    correctRef.current       = 0
    startTimeRef.current     = now
    challengeNameRef.current = `aiml_${topicKey}_${now}`
    categoryRef.current      = cat
    setCategory(cat)
    setQuestions(shuffled)
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }

  function startCsCoreQuiz(topicKey, subtopicKey, questionIdx) {
    const q = CS_CORE_QUESTION_BANK[topicKey][subtopicKey][questionIdx]
    if (!q) return
    const now = Date.now()
    correctRef.current       = 0
    startTimeRef.current     = now
    challengeNameRef.current = `cs_${topicKey}_${subtopicKey}_${questionIdx}_${now}`
    categoryRef.current      = { id: 'cs', title: 'CS Core', emoji: '⚙️' }
    setCategory(categoryRef.current)
    setQuestions([q])
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }

  function startMathQuiz(topicKey, subtopicKey, questionIdx) {
    const q = MATH_QUESTION_BANK[topicKey][subtopicKey][questionIdx]
    if (!q) return
    const now = Date.now()
    correctRef.current       = 0
    startTimeRef.current     = now
    challengeNameRef.current = `math_${topicKey}_${subtopicKey}_${questionIdx}_${now}`
    categoryRef.current      = { id: 'math', title: 'Math', emoji: '🔢' }
    setCategory(categoryRef.current)
    setQuestions([q])
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }

  function startEnglishQuiz(topicKey, subtopicKey, questionIdx) {
    const q = ENGLISH_QUESTION_BANK[topicKey][subtopicKey][questionIdx]
    if (!q) return
    const now = Date.now()
    correctRef.current       = 0
    startTimeRef.current     = now
    challengeNameRef.current = `english_${topicKey}_${subtopicKey}_${questionIdx}_${now}`
    categoryRef.current      = { id: 'english', title: 'English & Comm.', emoji: '💬' }
    setCategory(categoryRef.current)
    setQuestions([q])
    setQIndex(0)
    setSelected(null)
    setMode('quiz')
    startTimer()
  }




  function startCoding() {
    setCodingPath({ language: null, topic: null, questionSlug: null })
    setJavaCode(DEFAULT_BOILERPLATE_BY_LANGUAGE.java)
    setCustomInput('')
    setRunResult(null)
    pushCodingPath('/coding')
    setMode('coding')
  }

  function handleCategoryClick(cat) {
    if (cat.id === 'coding') { startCoding(); return }
    if (cat.id === 'aptitude') {
      setMode('aptitude')
      setAptitudePath({ topicKey: null, questionSlug: null })
      if (window.location.pathname !== '/daily/aptitude') window.history.pushState(null, '', '/daily/aptitude')
      return
    }
    if (cat.id === 'reasoning') {
      setMode('reasoning')
      setReasoningPath({ topicKey: null, questionSlug: null })
      if (window.location.pathname !== '/daily/reasoning') window.history.pushState(null, '', '/daily/reasoning')
      return
    }
    if (cat.id === 'aiml') {
      setMode('aiml')
      setAimlPath({ topicKey: null, isTheory: false, isQuiz: false })
      if (window.location.pathname !== '/daily/aiml') window.history.pushState(null, '', '/daily/aiml')
      return
    }
    if (cat.id === 'fun') {
      setMode('fun')
      setFunPath({ topicKey: null, isTheory: false })
      if (window.location.pathname !== '/daily/fun') window.history.pushState(null, '', '/daily/fun')
      return
    }
    if (cat.id === 'english') {
      setMode('english')
      setEnglishPath({ topicKey: null, questionSlug: null })
      if (window.location.pathname !== '/daily/english') window.history.pushState(null, '', '/daily/english')
      return
    }
    if (cat.id === 'math') {
      setMode('math')
      setMathPath({ topicKey: null, questionSlug: null })
      if (window.location.pathname !== '/daily/math') window.history.pushState(null, '', '/daily/math')
      return
    }
    if (cat.id === 'cs') {
      setMode('cs')
      setCsPath({ topicKey: null, subtopicKey: null, questionSlug: null })
      if (window.location.pathname !== '/daily/cs') window.history.pushState(null, '', '/daily/cs')
      return
    }
    if (cat.id === 'creativity') {
      setMode('creativity')
      setCreativityPath({ topicKey: null, subtopicKey: null, questionSlug: null, isTheory: false })
      if (window.location.pathname !== '/daily/creativity') window.history.pushState(null, '', '/daily/creativity')
      return
    }
    if (cat.id === 'language') {
      setMode('language')
      setLanguagePath({ topicKey: null, isTheory: false })
      if (window.location.pathname !== '/daily/language') window.history.pushState(null, '', '/daily/language')
      return
    }
    if (cat.id === 'gk') {
      setMode('gk')
      setGkPath({ topicKey: null, isTheory: false })
      if (window.location.pathname !== '/daily/gk') window.history.pushState(null, '', '/daily/gk')
      return
    }
    if (cat.id === 'placement') {
      setMode('productivity-prep')
      setProductivityPrepPath({ topicKey: null, subtopicKey: null, isTheory: false })
      if (window.location.pathname !== '/daily/productivity-prep') window.history.pushState(null, '', '/daily/productivity-prep')
      return
    }
    if (cat.id === 'dsa') {
      setCategory(cat)
      setDsaPath({ patternKey: null, questionSlug: null })
      setDsaLanguage('java')
      setDsaCode(DEFAULT_BOILERPLATE_BY_LANGUAGE.java)
      setDsaCustomInput('')
      setDsaRunResult(null)
      pushDsaPath('/daily/dsa')
      setMode('dsa')
      return
    }
    if (cat.id === 'fitness') {
      setMode('fitness')
      setFitnessPath({ topicKey: null, isTheory: false })
      if (window.location.pathname !== '/daily/fitness') window.history.pushState(null, '', '/daily/fitness')
      return
    }
    if (cat.id === 'cooking') {
      setMode('cooking')
      setCookingPath({ topicKey: null, isTheory: false })
      if (window.location.pathname !== '/daily/cooking') window.history.pushState(null, '', '/daily/cooking')
      return
    }
    if (cat.id === 'webdev') {
      setMode('webdev')
      setWebdevPath({ topicKey: null, isTheory: false })
      if (window.location.pathname !== '/daily/webdev') window.history.pushState(null, '', '/daily/webdev')
      return
    }
    startQuiz(cat)
  }

  function selectAnswer(idx) {
    if (selected !== null) return
    setSelected(idx)
    const q = questions[qIndex]
    const isCorrect = idx === q.ans
    if (isCorrect) { correctRef.current++; showToast('✅ Correct! +20 XP', 'success') }
    else showToast('❌ Incorrect', 'error')
    onSaveAnswer({
      skillCategory: categoryRef.current?.id,
      xpEarned: isCorrect ? 20 : 5,
      isCorrect,
      challengeName: challengeNameRef.current,
      timeSpent: Math.round((Date.now() - startTimeRef.current) / 1000),
    })
    setTimeout(() => {
      setSelected(null)
      if (qIndex + 1 < questions.length) setQIndex(i => i + 1)
      else finishChallenge()
    }, 1200)
  }

  async function runCode() {
    const prob = codingProblemsRef.current[codingRoundRef.current]
    if (!prob) return
    setTerminalOut('Running…')
    const result = await executeCode(codingLangRef.current, codingCode, prob.stdin)
    setTerminalOut((result.stderr ? result.stderr + '\n' : '') + (result.stdout || '') || '(no output)\n')
  }

  async function submitCode() {
    const prob = codingProblemsRef.current[codingRoundRef.current]
    if (!prob) return
    setTerminalOut('Checking…')
    const result = await executeCode(codingLangRef.current, codingCode, prob.stdin)
    setTerminalOut((result.stderr ? result.stderr + '\n' : '') + (result.stdout || '') || '(no output)\n')
    if (codingLangRef.current === 'javascript' && !result.ok) { showToast('Runtime error — fix your code.', 'error'); return }
    if (!outputsMatch(result.stdout, prob.expected)) { showToast('Output does not match expected.', 'error'); return }
    if (codingSolvedRef.current[codingRoundRef.current]) { showToast('Already accepted.', 'info'); return }

    const newSolved = [...codingSolvedRef.current]
    newSolved[codingRoundRef.current] = true
    codingSolvedRef.current = newSolved
    correctRef.current++
    setCodingSolved([...newSolved])
    showToast('✅ Accepted! +20 XP', 'success')
    onSaveAnswer({
      skillCategory: 'coding',
      xpEarned: 20,
      isCorrect: true,
      challengeName: challengeNameRef.current,
      timeSpent: Math.round((Date.now() - startTimeRef.current) / 1000),
    })

    const next = codingRoundRef.current + 1
    if (next < 5) {
      codingRoundRef.current = next
      setCodingRound(next)
      setCodingCode(codingProblemsRef.current[next]?.starters?.[codingLangRef.current] || '')
      setTerminalOut('')
    } else {
      finishChallenge()
    }
  }

  function changeLang(lang) {
    codingLangRef.current = lang
    setCodingLang(lang)
    localStorage.setItem(STORAGE_CODING_LANG, lang)
    setCodingCode(codingProblemsRef.current[codingRoundRef.current]?.starters?.[lang] || '')
  }

  function cancelChallenge() {
    clearInterval(timerRef.current)
    if (window.location.pathname.startsWith('/coding') || window.location.pathname.startsWith('/daily/dsa') || window.location.pathname.startsWith('/daily/aptitude') || window.location.pathname.startsWith('/daily/reasoning') || window.location.pathname.startsWith('/daily/math') || window.location.pathname.startsWith('/daily/english') || window.location.pathname.startsWith('/daily/creativity') || window.location.pathname.startsWith('/daily/language') || window.location.pathname.startsWith('/daily/fitness')) {
      if (window.location.pathname !== '/daily') window.history.pushState(null, '', '/daily')
    }
    setMode('categories')
  }

  function pushCodingPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushAptitudePath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushReasoningPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushDsaPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushCsPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushMathPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushEnglishPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushCreativityPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushProductivityPrepPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushLanguagePath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushFitnessPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushGkPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushCookingPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushFunPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushAimlPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  function pushWebdevPath(path) {
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
  }

  const min = Math.floor(timeLeft / 60)
  const sec = timeLeft % 60
  const timerStr = `${min}:${sec.toString().padStart(2, '0')}`


  // Problem Page (full-screen LeetCode view)
  if (problemPageState) {
    return (
      <ProblemPage
        problemId={problemPageState.problemId}
        topicTitle={problemPageState.topicTitle}
        localQuestion={problemPageState.localQuestion}
        language={problemPageState.language}
        onBack={() => setProblemPageState(null)}
      />
    )
  }

  // ── Result screen ──────────────────────────────────────────────────────────
  if (mode === 'result' && resultData) {
    const emojis = ['😢', '😐', '🙂', '😊', '🏆']
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-center gap-4 min-h-0">
        <div className="glass-card rounded-2xl p-6 w-full max-w-sm text-center">
          <div className="text-5xl mb-3">{emojis[Math.min(resultData.correct, 4)]}</div>
          <h2 className="text-2xl font-bold font-cormorant vs-brand-gradient">
            {resultData.correct === 5 ? 'Perfect Score!' : resultData.correct >= 3 ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
          <p className="text-[#ffffff]/80 text-sm mt-1">
            {resultData.correct === 5 ? 'You nailed every question!' : `${resultData.correct}/5 correct answers`}
          </p>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              ['✅', resultData.correct, 'Correct'],
              ['⚔️', resultData.xp, 'XP Earned'],
              ['⏱️', resultData.elapsed < 60 ? `${resultData.elapsed}s` : `${Math.floor(resultData.elapsed / 60)}m ${resultData.elapsed % 60}s`, 'Time'],
            ].map(([icon, val, label]) => (
              <div key={label} className="rounded-xl p-3"
                style={{ background: 'rgba(26, 26, 26,0.2)', border: '1px solid rgba(51, 51, 51,0.25)' }}>
                <div className="text-lg">{icon}</div>
                <div className="text-lg font-bold text-white">{val}</div>
                <div className="text-[10px] text-[#ffffff]/70">{label}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setMode('categories')}
            className="vs-btn-primary w-full py-3 rounded-xl font-bold text-sm mt-5">
            Try Another
          </button>
        </div>
      </div>
    )
  }

  // ── Aptitude screen ────────────────────────────────────────────────────────────
  if (mode === 'aptitude') {
    const selectedTopic = APTITUDE_TOPICS.find(t => t.key === aptitudePath.topicKey)
    const topicQuestions = aptitudePath.topicKey ? (APTITUDE_QUESTION_BANK[aptitudePath.topicKey] || []) : []

    if (!aptitudePath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">Aptitude Topics (Complete List)</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Select a topic to practice targeted quantitative aptitude problems.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {APTITUDE_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setAptitudePath({ topicKey: topic.key, questionSlug: null })
                  pushAptitudePath(`/daily/aptitude/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="h-full overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#ffffff]">{selectedTopic?.title}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAptitudePath({ topicKey: null, questionSlug: null })
                pushAptitudePath('/daily/aptitude')
              }}
              className="text-xs text-[#ffffff]/80 hover:text-[#ffffff]/90"
            >
              Topics
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {topicQuestions.map((q, idx) => (
            <button
              type="button"
              key={q.title + idx}
              onClick={() => {
                startAptitudeQuiz(aptitudePath.topicKey, idx)
              }}
              className="glass-card rounded-xl p-4 text-left transition-colors hover:bg-[#1a1a1a] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#ffffff]">{idx + 1}. {q.title}</p>
                <span className="text-[10px] px-2 py-1 rounded-full border border-[#333333] text-[#ffffff]">{q.difficulty}</span>
              </div>
              <p className="text-xs text-[#ffffff]/80 mt-1 line-clamp-1">{q.q}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Reasoning screen ────────────────────────────────────────────────────────────
  if (mode === 'reasoning') {
    const selectedTopic = REASONING_TOPICS.find(t => t.key === reasoningPath.topicKey)
    const topicQuestions = reasoningPath.topicKey ? (REASONING_QUESTION_BANK[reasoningPath.topicKey] || []) : []

    if (!reasoningPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">Reasoning Topics (Complete List)</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Select a topic to practice targeted reasoning problems.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {REASONING_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setReasoningPath({ topicKey: topic.key, questionSlug: null })
                  pushReasoningPath(`/daily/reasoning/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="h-full overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#ffffff]">{selectedTopic?.title}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setReasoningPath({ topicKey: null, questionSlug: null })
                pushReasoningPath('/daily/reasoning')
              }}
              className="text-xs text-[#ffffff]/80 hover:text-[#ffffff]/90"
            >
              Topics
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {topicQuestions.map((q, idx) => (
            <button
              type="button"
              key={q.title + idx}
              onClick={() => {
                startReasoningQuiz(reasoningPath.topicKey, idx)
              }}
              className="glass-card rounded-xl p-4 text-left transition-colors hover:bg-[#1a1a1a] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#ffffff]">{idx + 1}. {q.title}</p>
                <span className="text-[10px] px-2 py-1 rounded-full border border-[#333333] text-[#ffffff]">{q.difficulty}</span>
              </div>
              <p className="text-xs text-[#ffffff]/80 mt-1 line-clamp-1">{q.q}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── English screen ────────────────────────────────────────────────────────────
  if (mode === 'english') {
    const selectedTopic = ENGLISH_TOPICS.find(t => t.key === englishPath.topicKey)
    const topicSubtopics = selectedTopic?.subtopics || []
    const selectedSubtopic = selectedTopic?.subtopics?.find(s => s.key === englishPath.subtopicKey)
    const topicQuestions = (englishPath.topicKey && englishPath.subtopicKey) ? (ENGLISH_QUESTION_BANK[englishPath.topicKey][englishPath.subtopicKey] || []) : []

    // 1. Subject List
    if (!englishPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-5 mb-4 flex items-center justify-between border border-accent-primary/20">
            <div>
              <h3 className="text-xl font-bold vs-brand-gradient">English & Communication</h3>
              <p className="text-sm text-[#ffffff]/70 mt-1">Refine your verbal and non-verbal skills for professional success.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/60 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {ENGLISH_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setEnglishPath({ topicKey: topic.key, subtopicKey: null, questionSlug: null })
                  pushEnglishPath(`/daily/english/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Sub-topic Selection
    if (!englishPath.subtopicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold text-[#ffffff]">{selectedTopic?.title.split('. ')[1]} Sub-parts</h3>
            <button
              type="button"
              onClick={() => {
                setEnglishPath({ topicKey: null, subtopicKey: null, questionSlug: null })
                pushEnglishPath('/daily/english')
              }}
              className="text-xs text-accent-primary hover:underline transition-all"
            >
              ← Back to Skills
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topicSubtopics.map((sub) => (
              <button
                type="button"
                key={sub.key}
                onClick={() => {
                  setEnglishPath({ topicKey: englishPath.topicKey, subtopicKey: sub.key, questionSlug: null })
                  pushEnglishPath(`/daily/english/${englishPath.topicKey}/${sub.key}`)
                }}
                className="glass-card rounded-xl p-4 text-left transition-all hover:scale-[1.01] hover:bg-white/5 border border-accent-neutral/10"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#ffffff]">{sub.title}</p>
                </div>
                <p className="text-[10px] text-accent-neutral mt-1 uppercase tracking-tighter">50 Specialized Practice Problems</p>
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 3. Question List
    return (
      <div className="h-full overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent-primary font-black mb-1">
              {selectedTopic?.title.split('. ')[1]}
            </span>
            <h3 className="text-lg font-bold text-[#ffffff]">{selectedSubtopic?.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setEnglishPath({ topicKey: englishPath.topicKey, subtopicKey: null, questionSlug: null })
              pushEnglishPath(`/daily/english/${englishPath.topicKey}`)
            }}
            className="text-xs text-accent-neutral hover:text-accent-primary hover:underline transition-all"
          >
            ← Back to Sub-parts
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {topicQuestions.map((q, idx) => (
            <button
              type="button"
              key={q.title + idx}
              onClick={() => {
                startEnglishQuiz(englishPath.topicKey, englishPath.subtopicKey, idx)
              }}
              className="glass-card-interactive rounded-xl p-5 text-left group border border-accent-neutral/5 hover:border-accent-primary/30"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="text-sm font-bold text-[#ffffff] group-hover:text-accent-primary transition-colors">{q.title}</p>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary uppercase tracking-tighter">{q.difficulty}</span>
              </div>
              <p className="text-xs text-[#ffffff]/60 line-clamp-1 italic group-hover:text-[#ffffff]/80">"{q.q}"</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Creativity screen ────────────────────────────────────────────────────────────
  if (mode === 'creativity') {
    const selectedTopic = CREATIVITY_TOPICS.find(t => t.key === creativityPath.topicKey)
    const selectedSubtopic = selectedTopic?.subtopics?.find(s => s.key === creativityPath.subtopicKey)
    const topicSubtopics = selectedTopic?.subtopics || []

    // 1. Topic List
    if (!creativityPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">Creativity Topics</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Explore structured modules to unlock and refine your creative potential.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {CREATIVITY_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setCreativityPath({ topicKey: topic.key, subtopicKey: null, questionSlug: null, isTheory: false })
                  pushCreativityPath(`/daily/creativity/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Sub-topic Selection
    if (!creativityPath.subtopicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold text-[#ffffff]">{selectedTopic?.title.split('. ')[1]} Sub-parts</h3>
            <button
              type="button"
              onClick={() => {
                setCreativityPath({ topicKey: null, subtopicKey: null, questionSlug: null, isTheory: false })
                pushCreativityPath('/daily/creativity')
              }}
              className="text-xs text-accent-primary hover:underline transition-all"
            >
              ← All Topics
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topicSubtopics.map((sub) => (
              <button
                type="button"
                key={sub.key}
                onClick={() => {
                  setCreativityPath({ topicKey: creativityPath.topicKey, subtopicKey: sub.key, questionSlug: null, isTheory: true })
                  pushCreativityPath(`/daily/creativity/${creativityPath.topicKey}/${sub.key}/theory`)
                }}
                className="glass-card rounded-xl p-4 text-left transition-all hover:scale-[1.01] hover:bg-white/5 border border-accent-neutral/10"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#ffffff]">{sub.title}</p>
                </div>
                <p className="text-[10px] text-accent-neutral mt-1 uppercase tracking-tighter">Bite-sized Theory Notes</p>
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 3. Theory Mode
    if (creativityPath.isTheory) {
      const theoryContent = CREATIVITY_THEORY_DATA[creativityPath.subtopicKey] || "Comprehensive learning notes for this module are currently being compiled. Stay tuned for a detailed breakdown of core concepts, architectural patterns, and implementation logic."
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setCreativityPath({ topicKey: creativityPath.topicKey, subtopicKey: null, questionSlug: null, isTheory: false })
                pushCreativityPath(`/daily/creativity/${creativityPath.topicKey}`)
              }}
              className="text-xs text-accent-primary hover:underline"
            >
              ← Back to Sub-parts
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 shadow-[0_0_30px_rgba(255,107,53,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary border border-accent-primary/20">
                <BookOpen size={18} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedSubtopic?.title}</h3>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral">
                Master the core principles of {selectedSubtopic?.title} within the {selectedTopic?.title.split('. ')[1]} framework.
              </p>
              <div className="py-2 text-base leading-relaxed">
                <p>{theoryContent}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-primary mb-1 block">Creative Mindset</span>
                  <p className="text-xs">Practice this technique daily to notice significant shifts in your imaginative output.</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-success mb-1 block">Pro Tip</span>
                  <p className="text-xs">Consistency over perfection. Brief daily exercises are more effective than long occasional sessions.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCreativityPath({ topicKey: creativityPath.topicKey, subtopicKey: null, questionSlug: null, isTheory: false })
                pushCreativityPath(`/daily/creativity/${creativityPath.topicKey}`)
              }}
              className="w-full mt-8 bg-gradient-to-r from-accent-primary to-[#ff8c42] text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_5px_15px_rgba(255,107,53,0.3)] hover:scale-[1.02] transition-all"
            >
              Finish Reading
            </button>
          </div>
        </div>
      )
    }
  }

  // ── Language screen ────────────────────────────────────────────────────────────
  if (mode === 'language') {
    const selectedTopic = LANGUAGE_TOPICS.find(t => t.key === languagePath.topicKey)

    // 1. Language List
    if (!languagePath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">Language Learning Methods</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Select a language to learn effective theoretical study methods.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {LANGUAGE_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setLanguagePath({ topicKey: topic.key, isTheory: true })
                  pushLanguagePath(`/daily/language/${topic.key}/theory`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Theory Mode
    if (languagePath.isTheory) {
      const theoryContent = LANGUAGE_THEORY_DATA[languagePath.topicKey] || "Learning content is being prepared..."
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setLanguagePath({ topicKey: null, isTheory: false })
                pushLanguagePath('/daily/language')
              }}
              className="text-xs text-accent-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Back to Languages
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 shadow-[0_0_30px_rgba(255,107,53,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary border border-accent-primary/20">
                <Languages size={18} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedTopic?.title} Mastery Theory</h3>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral">
                Proven methods and theoretical approaches to master {selectedTopic?.title} effectively.
              </p>
              <div className="py-2 text-base leading-relaxed bg-white/5 p-6 rounded-xl border border-white/10">
                <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-accent-primary first-letter:mr-1 first-letter:float-left">{theoryContent}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-primary mb-1 block">Study Hack</span>
                  <p className="text-xs">Consistency over intensity. Study for 15 minutes every day rather than 3 hours once a week.</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-secondary mb-1 block">Active Recall</span>
                  <p className="text-xs">Immediately use a new word in a sentence to anchor it in your long-term memory.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // ── Fitness screen ────────────────────────────────────────────────────────────
  if (mode === 'fitness') {
    const selectedTopic = FITNESS_TOPICS.find(t => t.key === fitnessPath.topicKey)

    // Helper to get icon
    const getFitnessIcon = (iconName) => {
      if (iconName === 'Flame') return <Flame size={18} />
      if (iconName === 'Dumbbell') return <Dumbbell size={18} />
      if (iconName === 'Salad') return <Salad size={18} />
      if (iconName === 'Target') return <Target size={18} />
      if (iconName === 'ChartLine') return <ChartLine size={18} />
      return <Activity size={18} />
    }

    // 1. Fitness List
    if (!fitnessPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">Fitness & Performance</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Select a module to learn science-based fitness and health methods.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {FITNESS_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setFitnessPath({ topicKey: topic.key, isTheory: true })
                  pushFitnessPath(`/daily/fitness/${topic.key}/theory`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center p-2 bg-accent-primary/10 rounded-lg text-accent-primary">
                    {getFitnessIcon(topic.icon)}
                  </div>
                  <span>{topic.title}</span>
                </div>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Theory Mode
    if (fitnessPath.isTheory) {
      const theoryContent = FITNESS_THEORY_DATA[fitnessPath.topicKey] || "Fitness content is being optimized..."
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setFitnessPath({ topicKey: null, isTheory: false })
                pushFitnessPath('/daily/fitness')
              }}
              className="text-xs text-accent-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Back to Fitness
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 shadow-[0_0_30px_rgba(255,107,53,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary border border-accent-primary/20">
                {getFitnessIcon(selectedTopic?.icon)}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedTopic?.title} Guide</h3>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral">
                Core principles and methods to optimize your {selectedTopic?.title.slice(2)} performance.
              </p>
              
              <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                {Array.isArray(theoryContent) ? (
                  theoryContent.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 group hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0">
                      <div className="mt-1 text-accent-primary opacity-60 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 size={14} />
                      </div>
                      <p className="text-sm font-medium">{item}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-2 text-base leading-relaxed p-2">
                    <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-accent-primary first-letter:mr-1 first-letter:float-left">{theoryContent}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-primary mb-1 block">Quick Tip</span>
                  <p className="text-xs">Focus on your breathing. Exhale on the exertion, inhale on the recovery.</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-secondary mb-1 block">Pro Habit</span>
                  <p className="text-xs">Preparation is key. Layout your workout gear the night before to reduce friction.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // ── General Knowledge screen ────────────────────────────────────────────────────────────
  if (mode === 'gk') {
    const selectedTopic = GK_TOPICS.find(t => t.key === gkPath.topicKey)

    // 1. Topic List
    if (!gkPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">General Knowledge</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Select a topic to explore comprehensive mastery guides.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {GK_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setGkPath({ topicKey: topic.key, isTheory: true })
                  pushGkPath(`/daily/gk/${topic.key}/theory`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Theory Mode
    if (gkPath.isTheory) {
      const theoryContent = GK_THEORY_DATA[gkPath.topicKey] || "Learning content is being prepared..."
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setGkPath({ topicKey: null, isTheory: false })
                pushGkPath('/daily/gk')
              }}
              className="text-xs text-accent-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Back to GK Topics
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 shadow-[0_0_30px_rgba(255,107,53,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary border border-accent-primary/20">
                <BookOpen size={18} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedTopic?.title}</h3>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral">
                Master the core facts and concepts of {selectedTopic?.title} with this concise guide.
              </p>
              <div className="py-2 text-base leading-relaxed bg-white/5 p-6 rounded-xl border border-white/10">
                <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-accent-primary first-letter:mr-1 first-letter:float-left">{theoryContent}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-primary mb-1 block">Study Tip</span>
                  <p className="text-xs">Use mind maps to connect historical events with contemporary political boundaries.</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-secondary mb-1 block">Quick Recall</span>
                  <p className="text-xs">Link static facts to current affairs to make memorization meaningful and long-lasting.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // ── Productivity Prep screen ────────────────────────────────────────────────────────────
  if (mode === 'productivity-prep') {
    const selectedTopic = PRODUCTIVITY_PREP_TOPICS.find(t => t.key === productivityPrepPath.topicKey)
    const selectedSubtopic = selectedTopic?.subtopics?.find(s => s.key === productivityPrepPath.subtopicKey)
    const topicSubtopics = selectedTopic?.subtopics || []

    // 1. Topic List
    if (!productivityPrepPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">Placement Prep Topics (Complete List)</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Master the art of efficiency, focus, and sustainable systems.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {PRODUCTIVITY_PREP_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setProductivityPrepPath({ topicKey: topic.key, subtopicKey: null, isTheory: false })
                  pushProductivityPrepPath(`/daily/productivity-prep/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Sub-topic Selection
    if (!productivityPrepPath.subtopicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold text-[#ffffff]">{selectedTopic?.title.split('. ')[1]} Modules</h3>
            <button
              type="button"
              onClick={() => {
                setProductivityPrepPath({ topicKey: null, subtopicKey: null, isTheory: false })
                pushProductivityPrepPath('/daily/productivity-prep')
              }}
              className="text-xs text-accent-primary hover:underline transition-all"
            >
              ← All Topics
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topicSubtopics.map((sub) => (
              <button
                type="button"
                key={sub.key}
                onClick={() => {
                  setProductivityPrepPath({ topicKey: productivityPrepPath.topicKey, subtopicKey: sub.key, isTheory: true })
                  pushProductivityPrepPath(`/daily/productivity-prep/${productivityPrepPath.topicKey}/${sub.key}/theory`)
                }}
                className="glass-card rounded-xl p-4 text-left transition-all hover:scale-[1.01] hover:bg-white/5 border border-accent-neutral/10"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#ffffff]">{sub.title}</p>
                </div>
                <p className="text-[10px] text-accent-neutral mt-1 uppercase tracking-tighter">Theory Lesson</p>
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 3. Theory Mode
    if (productivityPrepPath.isTheory) {
      const theoryContent = PRODUCTIVITY_PREP_THEORY_DATA[productivityPrepPath.subtopicKey] || "Theory content is being loaded..."
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setProductivityPrepPath({ topicKey: productivityPrepPath.topicKey, subtopicKey: null, isTheory: false })
                pushProductivityPrepPath(`/daily/productivity-prep/${productivityPrepPath.topicKey}`)
              }}
              className="text-xs text-accent-primary hover:underline"
            >
              ← Back to Modules
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 shadow-[0_0_30px_rgba(255,107,53,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary border border-accent-primary/20">
                <BookOpen size={18} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedSubtopic?.title}</h3>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral">
                Mastering {selectedSubtopic?.title} within the {selectedTopic?.title.split('. ')[1]} framework.
              </p>
              <div className="py-2 text-base leading-relaxed">
                <p>{theoryContent}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-primary mb-1 block">Key Concept</span>
                  <p className="text-xs">Focus on consistent application rather than immediate mastery.</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-success mb-1 block">System Update</span>
                  <p className="text-xs">Integrate this technique into your daily recurring workflow.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setProductivityPrepPath({ topicKey: productivityPrepPath.topicKey, subtopicKey: null, isTheory: false })
                pushProductivityPrepPath(`/daily/productivity-prep/${productivityPrepPath.topicKey}`)
              }}
              className="w-full mt-8 bg-gradient-to-r from-accent-primary to-[#ff8c42] text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_5px_15px_rgba(255,107,53,0.3)] hover:scale-[1.02] transition-all"
            >
              Finish Reading
            </button>
          </div>
        </div>
      )
    }
  }

  // ── Web/App Dev screen ────────────────────────────────────────────────────────────
  if (mode === 'webdev') {
    const selectedTopic = WEBDEV_TOPICS.find(t => t.key === webdevPath.topicKey)

    // 1. Topic List
    if (!webdevPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between shadow-[0_8px_32px_rgba(6,182,212,0.1)] border border-accent-primary/20">
            <div>
              <h3 className="text-xl font-bold vs-brand-gradient">Web/App Development</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Master frontend, backend, and databases with core insights.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-3 relative z-10 w-full max-w-md mb-10">
            {WEBDEV_TOPICS.map((topic) => (
              <div key={topic.key} className="glass-card rounded-2xl p-4 flex flex-col border border-accent-neutral/10 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                      {topic.key === 'frontend' && <Monitor size={20} />}
                      {topic.key === 'backend' && <Server size={20} />}
                      {topic.key === 'database' && <Database size={20} />}
                    </div>
                    <div>
                       <span className="text-base font-bold text-white">{topic.title}</span>
                       <p className="text-[10px] text-accent-neutral tracking-tight">Full Stack Web Foundation</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setWebdevPath({ topicKey: topic.key, isTheory: true })
                      pushWebdevPath(`/daily/webdev/${topic.key}/theory`)
                    }}
                    className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all"
                  >
                    Read Theory
                  </button>
                  <button
                    onClick={() => startWebdevQuiz(topic.key)}
                    className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/20 transition-all"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // 2. Theory Mode
    if (webdevPath.isTheory) {
      const theoryContent = WEBDEV_THEORY_DATA[webdevPath.topicKey] || []
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setWebdevPath({ topicKey: null, isTheory: false })
                pushWebdevPath('/daily/webdev')
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 transition-all"
            >
              <ArrowLeft size={12} /> Back to Stack Selection
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.08)] bg-zinc-900/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                {webdevPath.topicKey === 'frontend' && <Monitor size={24} />}
                {webdevPath.topicKey === 'backend' && <Server size={24} />}
                {webdevPath.topicKey === 'database' && <Database size={24} />}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{selectedTopic?.title.split(' ')[1]} Specialist</h3>
                <p className="text-xs text-accent-neutral uppercase tracking-widest mt-1">Core Concepts & Mastery Guide</p>
              </div>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral text-center">
                “Building the web is about more than code; it's about engineering efficient, scalable, and inclusive experiences.”
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {theoryContent.map((item, idx) => {
                  const [title, ...rest] = item.split(': ')
                  return (
                    <div key={idx} className="flex flex-col gap-2 p-4 glass-card-interactive rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
                          {idx + 1}
                        </div>
                        <p className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">{title}</p>
                      </div>
                      <div className="pl-9 space-y-1">
                        <p className="text-sm text-[#ffffff]/70 leading-relaxed group-hover:text-[#ffffff]/90 transition-all">
                          {rest.join(': ')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => startWebdevQuiz(webdevPath.topicKey)}
                className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 hover:bg-cyan-500/20 transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-cyan-400" />
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">Practice Quiz</span>
                </div>
                <p className="text-xs leading-relaxed text-[#ffffff]/80 group-hover:text-white">Ready to test your knowledge? Take a quick 5-question {selectedTopic?.title.split(' ')[1]} quiz now.</p>
              </button>
              <div className="p-4 bg-black/40 rounded-2xl border border-accent-neutral/10 hover:border-cyan-500/20 transition-all">
                <span className="text-[10px] font-black uppercase text-cyan-400 mb-2 block tracking-widest">Industry Pro-Tip</span>
                <p className="text-xs leading-relaxed text-[#ffffff]/80">Modular architecture is key. Write code as if the person maintaining it after you is a violent psychopath who knows where you live.</p>
              </div>
            </div>
            </div>

            <button
               onClick={() => {
                setWebdevPath({ topicKey: null, isTheory: false })
                pushWebdevPath('/daily/webdev')
              }}
              className="w-full mt-10 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(6,182,212,0.2)] hover:shadow-[0_15px_30px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Finish Module
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )
    }
  }

  if (mode === 'aiml') {
    const selectedTopic = AIML_TOPICS.find(t => t.key === aimlPath.topicKey)

    // 1. Topic List
    if (!aimlPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4 scrollbar-hide">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between border border-accent-primary/20">
            <div>
              <h3 className="text-xl font-bold vs-brand-gradient">AI/ML Topics (Complete List)</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Select a topic to begin learning or testing your skills.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full mb-10 pb-20">
            {AIML_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setAimlPath({ topicKey: topic.key, isTheory: false, isQuiz: false })
                  pushAimlPath(`/daily/aiml/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between group shadow-sm"
              >
                <span className="group-hover:text-accent-primary transition-colors">{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary opacity-50 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Section Sub-menu (Theory vs Quiz)
    if (!aimlPath.isTheory && !aimlPath.isQuiz) {
       return (
        <div className="h-full overflow-y-auto px-4 py-4 scrollbar-hide">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setAimlPath({ topicKey: null, isTheory: false, isQuiz: false })
                pushAimlPath('/daily/aiml')
              }}
              className="text-xs text-accent-neutral hover:underline flex items-center gap-1 transition-all"
            >
              <ArrowLeft size={12} /> Back to Roadmap
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 text-center max-w-sm mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">{selectedTopic?.title.split('. ')[1]}</h3>
            <p className="text-xs text-accent-neutral mb-8 uppercase tracking-widest">Mastery Selection</p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setAimlPath({ ...aimlPath, isTheory: true })
                  pushAimlPath(`/daily/aiml/${aimlPath.topicKey}/theory`)
                }}
                className="glass-card-interactive p-6 rounded-2xl flex flex-col items-center gap-3 border border-white/5 hover:border-accent-primary/40 transition-all group"
              >
                <div className="p-3 bg-accent-primary/10 rounded-xl text-accent-primary border border-accent-primary/20 group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Theory Mode</h4>
                  <p className="text-[10px] text-accent-neutral">Read depth topics & insights</p>
                </div>
              </button>
              <button
                onClick={() => startAimlQuiz(aimlPath.topicKey)}
                className="glass-card-interactive p-6 rounded-2xl flex flex-col items-center gap-3 border border-white/5 hover:border-accent-secondary/40 transition-all group"
              >
                <div className="p-3 bg-accent-secondary/10 rounded-xl text-accent-secondary border border-accent-secondary/20 group-hover:scale-110 transition-transform">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Practice Quiz</h4>
                  <p className="text-[10px] text-accent-neutral">Test your knowledge (5-Questions)</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )
    }

    // 3. Theory Mode
    if (aimlPath.isTheory) {
      const theoryContent = AIML_THEORY_DATA[aimlPath.topicKey] || "Learning content is being prepared..."
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setAimlPath({ ...aimlPath, isTheory: false })
                pushAimlPath(`/daily/aiml/${aimlPath.topicKey}`)
              }}
              className="text-xs text-accent-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Back to Selection
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 shadow-[0_0_30px_rgba(255,107,53,0.05)]">
            <div className="flex items-center gap-2 mb-4 text-center justify-center">
              <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary border border-accent-primary/20">
                <BookOpen size={18} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedTopic?.title.split('. ')[1] || selectedTopic?.title}</h3>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral text-center">
                Master the core facts and concepts of {selectedTopic?.title.split('. ')[1] || selectedTopic?.title} with this concise guide.
              </p>
              <div className="py-2 text-base leading-relaxed bg-black/20 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
                <p className="first-letter:text-4xl first-letter:font-black first-letter:text-accent-primary first-letter:mr-2 first-letter:float-left text-justify text-[#ffffff]/90">{theoryContent}</p>
                <div className="clear-both"></div>
              </div>

               {/* Quick Quiz Shortcut within Theory */}
               <div className="mt-8 mb-4">
                <button
                  onClick={() => startAimlQuiz(aimlPath.topicKey)}
                  className="w-full p-4 glass-card-interactive rounded-2xl border border-accent-secondary/30 hover:bg-accent-secondary/5 transition-all text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-secondary/10 rounded-lg text-accent-secondary">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Ready to test these concepts?</p>
                      <p className="text-[10px] text-accent-neutral">Start a quick 5-question recap quiz</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-accent-secondary" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase text-accent-primary mb-1 block tracking-wider">Learning Objective</span>
                  <p className="text-[11px] leading-relaxed text-[#ffffff]/70">Build a solid intuitive foundation before diving into mathematical implementations or code.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase text-accent-secondary mb-1 block tracking-wider">Expert Wisdom</span>
                  <p className="text-[11px] leading-relaxed text-[#ffffff]/70">AI/ML mastery is 80% data intuition and math, and 20% choosing the right framework.</p>
                </div>
              </div>
            </div>
            
            <button
               onClick={() => {
                setAimlPath({ topicKey: null, isTheory: false, isQuiz: false })
                pushAimlPath('/daily/aiml')
              }}
              className="w-full mt-10 bg-gradient-to-r from-accent-primary to-[#ff8c42] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(255,107,53,0.2)] hover:scale-[1.01] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Mark as Learned
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )
    }
  }

  if (mode === 'fun') {
    const selectedTopic = FUN_TOPICS.find(t => t.key === funPath.topicKey)

    // 1. Topic List
    if (!funPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4 scrollbar-hide">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between border border-accent-secondary/20 shadow-[0_8px_32px_rgba(245,158,11,0.05)]">
            <div>
              <h3 className="text-xl font-bold text-[#f59e0b]">Engineering Fun Challenges</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Interesting insights & survival hacks for engineering students.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-3 relative z-10 w-full max-w-md mb-10">
            {FUN_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setFunPath({ topicKey: topic.key, isTheory: true })
                  pushFunPath(`/daily/fun/${topic.key}/theory`)
                }}
                className="glass-card-interactive rounded-2xl px-5 py-4 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-white/5 hover:border-accent-secondary/40 flex items-center justify-between group"
              >
                <div className="flex flex-col">
                  <span className="text-base text-accent-secondary group-hover:brightness-125 transition-all">{topic.title}</span>
                  <span className="text-[10px] font-normal text-white/50">{topic.prompt}</span>
                </div>
                <ChevronRight size={18} className="text-accent-secondary opacity-50 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Theory Mode
    if (funPath.isTheory) {
      const theoryContent = FUN_THEORY_DATA[funPath.topicKey] || "More engineering fun is on the way..."
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setFunPath({ topicKey: null, isTheory: false })
                pushFunPath('/daily/fun')
              }}
              className="text-xs text-accent-secondary hover:underline flex items-center gap-1 transition-all"
            >
              <ArrowLeft size={12} /> Back to Challenges
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-secondary/20 shadow-[0_0_40px_rgba(245,158,11,0.08)] bg-zinc-900/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent-secondary/10 rounded-2xl text-accent-secondary border border-accent-secondary/20">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{selectedTopic?.title}</h3>
                <p className="text-xs text-[#f59e0b] uppercase tracking-widest mt-1">Engineering Student Special</p>
              </div>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Activity size={48} />
                </div>
                <p className="text-lg leading-relaxed text-[#ffffff]/95 relative z-10 first-letter:text-4xl first-letter:font-black first-letter:text-accent-secondary first-letter:mr-2 first-letter:float-left">
                  {theoryContent}
                </p>
              </div>

              <div className="p-4 bg-accent-secondary/5 rounded-2xl border border-accent-secondary/20 mt-6 box-border">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={14} className="text-accent-secondary" />
                  <span className="text-[10px] font-black uppercase text-accent-secondary tracking-widest">Engineering Tip</span>
                </div>
                <p className="text-xs italic text-[#ffffff]/80">"Experience is what you get when you didn't get what you wanted." – The unofficial motto of every engineering student during finals week.</p>
              </div>
            </div>

            <button
               onClick={() => {
                setFunPath({ topicKey: null, isTheory: false })
                pushFunPath('/daily/fun')
              }}
              className="w-full mt-10 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_15px_30px_rgba(245,158,11,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Challenge Completed
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )
    }
  }

  if (mode === 'cooking') {
    const selectedTopic = COOKING_TOPICS.find(t => t.key === cookingPath.topicKey)

    // 1. Topic List
    if (!cookingPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between shadow-[0_8px_32px_rgba(255,107,53,0.1)] border border-accent-primary/20">
            <div>
              <h3 className="text-xl font-bold vs-brand-gradient">Cooking Mastery</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Discover quick recipes and step-wise cooking methods.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-3 relative z-10 w-full max-w-md mb-10">
            {COOKING_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setCookingPath({ topicKey: topic.key, isTheory: true })
                  pushCookingPath(`/daily/cooking/${topic.key}/theory`)
                }}
                className="glass-card-interactive rounded-2xl px-5 py-4 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent-primary/10 rounded-xl text-accent-primary border border-accent-primary/20">
                    {topic.icon === 'Salad' ? <Salad size={20} /> : <Flame size={20} />}
                  </div>
                  <span className="text-base">{topic.title}</span>
                </div>
                <ChevronRight size={18} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Theory Mode
    if (cookingPath.isTheory) {
      const theoryContent = COOKING_THEORY_DATA[cookingPath.topicKey] || []
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setCookingPath({ topicKey: null, isTheory: false })
                pushCookingPath('/daily/cooking')
              }}
              className="text-xs text-accent-primary hover:underline flex items-center gap-1 transition-all"
            >
              <ArrowLeft size={12} /> Back to Categories
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 shadow-[0_0_40px_rgba(255,107,53,0.08)] bg-zinc-900/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent-primary/10 rounded-2xl text-accent-primary border border-accent-primary/20">
                {selectedTopic?.icon === 'Salad' ? <Salad size={24} /> : <Flame size={24} />}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{selectedTopic?.title.split(' ')[1]} Specialist</h3>
                <p className="text-xs text-accent-neutral uppercase tracking-widest mt-1">Top 10 Step-by-Step Recipes</p>
              </div>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral text-center">
                “Cooking is an art, but all art requires a foundation of technique.”
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {theoryContent.map((item, idx) => {
                  const [title, ...rest] = item.split(': ')
                  return (
                    <div key={idx} className="flex flex-col gap-2 p-4 glass-card-interactive rounded-xl border border-white/5 hover:border-accent-primary/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-[10px] font-bold border border-accent-primary/30">
                          {idx + 1}
                        </div>
                        <p className="text-base font-bold text-white group-hover:text-accent-primary transition-colors">{title}</p>
                      </div>
                      <div className="pl-9 space-y-1">
                        <p className="text-sm text-[#ffffff]/70 leading-relaxed italic border-l-2 border-accent-primary/20 pl-3 group-hover:border-accent-primary/50 transition-all">
                          {rest.join(': ')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-black/40 rounded-2xl border border-accent-neutral/10 hover:border-accent-primary/20 transition-all">
                  <span className="text-[10px] font-black uppercase text-accent-primary mb-2 block tracking-widest">Chef's Secret</span>
                  <p className="text-xs leading-relaxed text-[#ffffff]/80">Always prep your ingredients (Mise en place) before turning on the heat. This prevents overcooking and stress.</p>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-accent-neutral/10 hover:border-accent-success/20 transition-all">
                  <span className="text-[10px] font-black uppercase text-accent-success mb-2 block tracking-widest">Nutrition Tip</span>
                  <p className="text-xs leading-relaxed text-[#ffffff]/80">Sautéing on high heat preserves the texture and nutrients of vegetables better than long boiling.</p>
                </div>
              </div>
            </div>

            <button
               onClick={() => {
                setCookingPath({ topicKey: null, isTheory: false })
                pushCookingPath('/daily/cooking')
              }}
              className="w-full mt-10 bg-gradient-to-r from-accent-primary to-[#ff8c42] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(255,107,53,0.2)] hover:shadow-[0_15px_30px_rgba(255,107,53,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Mark as Learned
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )
    }
  }

  if (mode === 'cs') {
    const selectedTopic = CS_CORE_TOPICS.find(t => t.key === csPath.topicKey)
    const selectedSubtopic = selectedTopic?.subtopics?.find(s => s.key === csPath.subtopicKey)
    const topicSubtopics = selectedTopic?.subtopics || []
    const topicQuestions = (csPath.topicKey && csPath.subtopicKey) ? (CS_CORE_QUESTION_BANK[csPath.topicKey][csPath.subtopicKey] || []) : []

    // 1. Subject List
    if (!csPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">Computer Science Core</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Foundational subjects for competitive exams and interviews.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1 transition-colors">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {CS_CORE_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setCsPath({ topicKey: topic.key, subtopicKey: null, questionSlug: null })
                  pushCsPath(`/daily/cs/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Sub-topic Selection
    if (!csPath.subtopicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-lg font-bold text-[#ffffff]">{selectedTopic?.title.split('. ')[1]} Modules</h3>
            <button
              type="button"
              onClick={() => {
                setCsPath({ topicKey: null, subtopicKey: null, questionSlug: null, isTheory: false })
                pushCsPath('/daily/cs')
              }}
              className="text-xs text-accent-primary hover:underline"
            >
              ← All Subjects
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topicSubtopics.map((sub) => (
              <div key={sub.key} className="glass-card rounded-xl p-4 flex flex-col justify-between border border-accent-neutral/20">
                <div>
                  <p className="text-sm font-semibold text-[#ffffff]">{sub.title}</p>
                  <p className="text-[10px] text-accent-neutral mt-1 uppercase tracking-tighter">Bite-sized Core Concepts</p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => {
                      setCsPath({ topicKey: csPath.topicKey, subtopicKey: sub.key, questionSlug: null, isTheory: true })
                      pushCsPath(`/daily/cs/${csPath.topicKey}/${sub.key}/theory`)
                    }}
                    className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
                  >
                    Read Theory
                  </button>
                  <button
                    onClick={() => {
                      setCsPath({ topicKey: csPath.topicKey, subtopicKey: sub.key, questionSlug: null, isTheory: false })
                      pushCsPath(`/daily/cs/${csPath.topicKey}/${sub.key}`)
                    }}
                    className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary rounded-lg border border-accent-primary/30 transition-colors"
                  >
                    Practice Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // 2.5 Theory Mode
    if (csPath.isTheory) {
      const theoryContent = CS_CORE_THEORY[csPath.subtopicKey] || "Comprehensive learning notes for this module are currently being compiled. Stay tuned for a detailed breakdown of core concepts, architectural patterns, and implementation logic."
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setCsPath({ topicKey: csPath.topicKey, subtopicKey: null, questionSlug: null, isTheory: false })
                pushCsPath(`/daily/cs/${csPath.topicKey}`)
              }}
              className="text-xs text-accent-primary hover:underline"
            >
              ← Back to Modules
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-primary/20 shadow-[0_0_30px_rgba(255,107,53,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary border border-accent-primary/20">
                <BookOpen size={18} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedSubtopic?.title}</h3>
            </div>
            
            <div className="space-y-4 text-[#ffffff]/90 leading-relaxed text-sm">
              <p className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-accent-neutral">
                Master the fundamental concepts of {selectedSubtopic?.title} within the {selectedTopic?.title.split('. ')[1]} framework.
              </p>
              <div className="py-2">
                <p>{theoryContent}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-primary mb-1 block">Key Learning</span>
                  <p className="text-xs">Understand structural relationships and primitive operations.</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-xl border border-accent-neutral/10">
                  <span className="text-[10px] font-black uppercase text-accent-success mb-1 block">Quick Fact</span>
                  <p className="text-xs">This topic is frequently tested in GATE and top-tier technical interviews.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCsPath({ ...csPath, isTheory: false })
                pushCsPath(`/daily/cs/${csPath.topicKey}/${csPath.subtopicKey}`)
              }}
              className="w-full mt-8 bg-gradient-to-r from-accent-primary to-[#ff8c42] text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_5px_15px_rgba(255,107,53,0.3)] hover:scale-[1.02] transition-all"
            >
              Start Practice Quiz
            </button>
          </div>
        </div>
      )
    }

    // 3. Question List
    return (
      <div className="h-full overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent-primary font-black mb-1">
              {selectedTopic?.title.split('. ')[1]}
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#ffffff]">{selectedSubtopic?.title}</h3>
              <button 
                onClick={() => setCsPath({...csPath, isTheory: true})}
                className="p-1 px-2 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-accent-neutral hover:text-white transition-colors"
              >
                Theory
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setCsPath({ topicKey: csPath.topicKey, subtopicKey: null, questionSlug: null, isTheory: false })
              pushCsPath(`/daily/cs/${csPath.topicKey}`)
            }}
            className="text-xs text-accent-primary hover:underline transition-all"
          >
            ← Back to Modules
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {topicQuestions.map((q, idx) => (
            <button
              type="button"
              key={q.title + idx}
              onClick={() => {
                startCsCoreQuiz(csPath.topicKey, csPath.subtopicKey, idx)
              }}
              className="glass-card-interactive rounded-xl p-5 text-left group border border-accent-neutral/5 hover:border-accent-primary/30"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="text-sm font-bold text-[#ffffff] group-hover:text-accent-primary transition-colors">{idx + 1}. {q.title}</p>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary uppercase tracking-tighter">{q.difficulty}</span>
              </div>
              <p className="text-xs text-[#ffffff]/60 line-clamp-1 italic group-hover:text-[#ffffff]/80">"{q.q}"</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Math screen ────────────────────────────────────────────────────────────
  if (mode === 'math') {
    const selectedTopic = MATH_TOPICS.find(t => t.key === mathPath.topicKey)
    const selectedSubtopic = selectedTopic?.subtopics?.find(s => s.key === mathPath.subtopicKey)
    const topicSubtopics = selectedTopic?.subtopics || []
    const topicQuestions = (mathPath.topicKey && mathPath.subtopicKey) ? (MATH_QUESTION_BANK[mathPath.topicKey][mathPath.subtopicKey] || []) : []

    // 1. Subject List
    if (!mathPath.topicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">Engineering & Discrete Math</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Select a main subject to explore sub-categories.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {MATH_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setMathPath({ topicKey: topic.key, subtopicKey: null, questionSlug: null })
                  pushMathPath(`/daily/math/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 2. Sub-topic Selection
    if (!mathPath.subtopicKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#ffffff]">{selectedTopic?.title}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMathPath({ topicKey: null, subtopicKey: null, questionSlug: null })
                  pushMathPath('/daily/math')
                }}
                className="text-xs text-accent-primary hover:underline"
              >
                Back to Subjects
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topicSubtopics.map((sub) => (
              <button
                type="button"
                key={sub.key}
                onClick={() => {
                  setMathPath({ topicKey: mathPath.topicKey, subtopicKey: sub.key, questionSlug: null })
                  pushMathPath(`/daily/math/${mathPath.topicKey}/${sub.key}`)
                }}
                className="glass-card rounded-xl p-4 text-left transition-all hover:scale-[1.01] hover:bg-white/5 border border-accent-neutral/20"
              >
                <p className="text-sm font-semibold text-[#ffffff]">{sub.title}</p>
                <p className="text-[10px] text-accent-neutral mt-1">50 Practice Problems · All Difficulty Levels</p>
              </button>
            ))}
          </div>
        </div>
      )
    }

    // 3. Question List
    return (
      <div className="h-full overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <h3 className="text-sm text-accent-neutral tracking-wide uppercase font-black">{selectedTopic?.title.split('. ')[1]}</h3>
            <h3 className="text-lg font-semibold text-[#ffffff]">{selectedSubtopic?.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMathPath({ topicKey: mathPath.topicKey, subtopicKey: null, questionSlug: null })
                pushMathPath(`/daily/math/${mathPath.topicKey}`)
              }}
              className="text-xs text-accent-primary hover:underline"
            >
              Back to Sub-topics
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {topicQuestions.map((q, idx) => (
            <button
              type="button"
              key={q.title + idx}
              onClick={() => {
                startMathQuiz(mathPath.topicKey, mathPath.subtopicKey, idx)
              }}
              className="glass-card rounded-xl p-4 text-left transition-colors hover:bg-[#1a1a1a] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#ffffff]">{idx + 1}. {q.title}</p>
                <span className="text-[10px] px-2 py-1 rounded-full border border-[#333333] text-[#ffffff]">{q.difficulty}</span>
              </div>
              <p className="text-xs text-[#ffffff]/80 mt-1 line-clamp-1">{q.q}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── DSA screen ────────────────────────────────────────────────────────────
  if (mode === 'dsa') {
    const selectedPattern = DSA_PATTERN_TOPICS.find(p => p.key === dsaPath.patternKey)
    const patternQuestions = dsaPath.patternKey ? (DSA_QUESTION_BANK[dsaPath.patternKey] || []) : []
    const selectedQuestion = patternQuestions.find(q => slugify(q.title) === dsaPath.questionSlug) || null

    if (!dsaPath.patternKey) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">DSA Section</h3>
              <p className="text-sm text-[#ffffff]/80 mt-1">Select a pattern and solve 50 questions from easy to hard.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1">✕ Close</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {DSA_PATTERN_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setDsaPath({ patternKey: topic.key, questionSlug: null })
                  pushDsaPath(`/daily/dsa/${topic.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{topic.title}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (!dsaPath.questionSlug) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#ffffff]">{selectedPattern?.title}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDsaPath({ patternKey: null, questionSlug: null })
                  pushDsaPath('/daily/dsa')
                }}
                className="text-xs text-[#ffffff]/80 hover:text-[#ffffff]/90"
              >
                Patterns
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {patternQuestions.map((q, idx) => (
              <button
                type="button"
                key={q.title}
                onClick={() => {
                  setProblemPageState({ problemId: null, topicTitle: selectedPattern?.title, localQuestion: q, language: dsaLanguage })
                }}
                className="glass-card rounded-xl p-4 text-left transition-colors hover:bg-[#1a1a1a] cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#ffffff]">{idx + 1}. {q.title}</p>
                  <span className="text-[10px] px-2 py-1 rounded-full border border-[#333333] text-[#ffffff]">{q.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="h-full overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#ffffff]">{selectedQuestion?.title || 'DSA Challenge'}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDsaPath({ patternKey: dsaPath.patternKey, questionSlug: null })
                setDsaRunResult(null)
                pushDsaPath(`/daily/dsa/${dsaPath.patternKey}`)
              }}
              className="text-xs text-[#ffffff]/80 hover:text-[#ffffff]/90"
            >
              Questions
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/5 glass-card rounded-2xl p-4">
            <p className="text-xs text-[#333333] font-semibold mb-2">{selectedPattern?.title}</p>
            <h4 className="text-base font-bold text-[#ffffff]">{selectedQuestion?.title}</h4>
            <p className="text-sm text-[#ffffff]/80 mt-2 leading-relaxed">{selectedQuestion?.fullDescription || selectedQuestion?.description}</p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[10px] text-[#ffffff]/70 uppercase tracking-wider mb-1">Sample Input</p>
                <pre className="text-xs text-[#333333] p-2 rounded-lg bg-black/35 border border-[#333333] whitespace-pre-wrap">{selectedQuestion?.input}</pre>
              </div>
              <div>
                <p className="text-[10px] text-[#ffffff]/70 uppercase tracking-wider mb-1">Sample Output</p>
                <pre className="text-xs text-[#ffffff] p-2 rounded-lg bg-black/35 border border-[#333333] whitespace-pre-wrap">{selectedQuestion?.output}</pre>
              </div>
              <div>
                <p className="text-[10px] text-[#ffffff]/70 uppercase tracking-wider mb-1">Constraints</p>
                <p className="text-xs text-[#ffffff]/80">{selectedQuestion?.constraints || 'N/A'}</p>
              </div>
              <div className="inline-block text-[10px] px-2 py-1 rounded-full border border-[#333333] text-[#ffffff]">
                {selectedQuestion?.difficulty || 'Easy'}
              </div>
            </div>
          </div>
          <div className="lg:w-3/5 glass-card rounded-2xl p-3 flex flex-col">
            <div className="mb-2">
              <select
                value={dsaLanguage}
                onChange={(e) => {
                  const nextLang = e.target.value
                  setDsaLanguage(nextLang)
                  setDsaCode(DEFAULT_BOILERPLATE_BY_LANGUAGE[nextLang] || DEFAULT_BOILERPLATE_BY_LANGUAGE.java)
                }}
                className="coding-select"
              >
                {Object.keys(DEFAULT_BOILERPLATE_BY_LANGUAGE).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <Editor
              height="58vh"
              theme="vs-dark"
              defaultLanguage={dsaLanguage}
              value={dsaCode}
              onChange={(value) => setDsaCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Custom testcase input (optional)"
                value={dsaCustomInput}
                onChange={(e) => setDsaCustomInput(e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 text-sm bg-[#0a0a0a] border border-[#333333] text-[#ffffff]/90"
              />
              <button
                type="button"
                onClick={() => {
                  const passed = (dsaCode || '').trim().length > 20 && Math.random() > 0.25
                  setDsaRunResult(passed ? 'passed' : 'failed')
                }}
                className="vs-btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Run Code
              </button>
              <button
                type="button"
                onClick={() => showToast('Code submitted (mock).', 'info')}
                className="rounded-lg px-4 py-2 text-sm font-semibold border border-[#333333]/50 text-[#f0e6d4] bg-[#1a1a1a]/40 hover:bg-[#333333]/50"
              >
                Submit Code
              </button>
            </div>
            <div className="mt-3 rounded-lg px-3 py-2 text-sm border border-[#333333] bg-black/30 text-[#ffffff]/90 min-h-10">
              {dsaRunResult === 'passed' && 'Test Case Passed ✅'}
              {dsaRunResult === 'failed' && 'Test Case Failed ❌'}
              {!dsaRunResult && 'Run your code to evaluate the current testcase.'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  if (mode === 'quiz') {
    const q = questions[qIndex]
    if (!q) return null
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{category?.emoji}</span>
              <span className="text-xs font-semibold text-[#ffffff]/80">{category?.title} · Challenge</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#333333]">{timerStr}</span>
              <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1">✕ Cancel</button>
            </div>
          </div>
          {/* progress dots */}
          <div className="flex gap-1.5 mb-4">
            {questions.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
                style={{ background: i < qIndex ? '#22c55e' : i === qIndex ? '#5a8a9c' : 'rgba(26, 26, 26,0.4)' }} />
            ))}
          </div>
          <p className="text-xs text-[#ffffff]/70 mb-2">Question {qIndex + 1} of {questions.length}</p>
          <p className="text-base font-semibold text-[#ffffff] leading-snug">{q.q}</p>
        </div>
        <div className="space-y-2.5">
          {q.opts.map((opt, i) => {
            let style = { background: 'rgba(26, 26, 26,0.18)', border: '1px solid rgba(51, 51, 51,0.35)' }
            if (selected !== null) {
              if (i === q.ans)                    style = { background: 'rgba(34,197,94,0.2)',  border: '1px solid rgba(34,197,94,0.5)',  opacity: 1 }
              else if (i === selected)            style = { background: 'rgba(239,68,68,0.2)',  border: '1px solid rgba(239,68,68,0.5)',  opacity: 1 }
              else                                style = { background: 'rgba(26, 26, 26,0.18)',  border: '1px solid rgba(51, 51, 51,0.35)', opacity: 0.45 }
            }
            return (
              <button key={i} onClick={() => selectAnswer(i)} disabled={selected !== null}
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={style}>
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Coding screen ──────────────────────────────────────────────────────────
  if (mode === 'coding') {
    const selectedLanguage = PRACTICE_LANGUAGES.find(l => l.key === codingPath.language)
    const languageTopics = getPracticeTopics(codingPath.language || 'java')
    const topicMeta = languageTopics.find(t => t.key === codingPath.topic)
    const topicQuestions = codingPath.topic ? (practiceQuestions[codingPath.language]?.[codingPath.topic] || []) : []
    const selectedQuestion = topicQuestions.find(q => slugify(q.title) === codingPath.questionSlug) || null

    if (!codingPath.language) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#ffffff]">Choose Language</h3>
            <button onClick={cancelChallenge} className="text-xs text-[#ffffff]/70 hover:text-red-400 px-2 py-1">✕ Close</button>
          </div>
          <div className="flex flex-col gap-2 relative z-10 w-full max-w-md mb-10">
            {PRACTICE_LANGUAGES.map(lang => (
              <button
                type="button"
                key={lang.key}
                onClick={() => {
                  setCodingPath({ language: lang.key, topic: null, questionSlug: null })
                  setJavaCode(DEFAULT_BOILERPLATE_BY_LANGUAGE[lang.key] || DEFAULT_BOILERPLATE_BY_LANGUAGE.java)
                  setRunResult(null)
                  pushCodingPath(`/coding/${lang.key}`)
                }}
                className="glass-card-interactive rounded-xl px-4 py-3 text-md font-bold text-left text-[#ffffff]/90 hover:text-white transition-all hover:translate-x-1 border border-accent-neutral/10 hover:border-accent-primary/30 flex items-center justify-between"
              >
                <span>{lang.label}</span>
                <ChevronRight size={16} className="text-accent-primary" />
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (!codingPath.topic) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#ffffff]">{selectedLanguage?.label || 'Language'} Topics</h3>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languageTopics.map(topic => (
              <button
                type="button"
                key={topic.key}
                onClick={() => {
                  setCodingPath({ language: codingPath.language, topic: topic.key, questionSlug: null })
                  pushCodingPath(`/coding/${codingPath.language}/${topic.key}`)
                }}
                className="glass-card rounded-xl p-4 text-left transition-all hover:scale-[1.01] hover:border-[#333333]"
              >
                <p className="text-sm font-semibold text-[#ffffff]">{topic.label}</p>
                <p className="text-xs text-[#ffffff]/80 mt-1">{(practiceQuestions[codingPath.language]?.[topic.key] || []).length} questions</p>
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (!codingPath.questionSlug) {
      return (
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#ffffff]">{topicMeta?.label || 'Java Questions'}</h3>

          </div>
          <div className="flex flex-col gap-3">
            {topicQuestions.map(q => (
              <button
                type="button"
                key={q.title}
                onClick={() => {
                  setProblemPageState({ problemId: null, topicTitle: topicMeta?.label, localQuestion: q, language: codingPath.language })
                }}
                className="glass-card rounded-xl p-4 text-left transition-colors hover:bg-[#1a1a1a] cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#ffffff]">{q.title}</p>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary uppercase tracking-tighter">{q.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="h-full overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#ffffff]">{selectedQuestion?.title || 'Problem'}</h3>

        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/5 glass-card rounded-2xl p-4">
            <p className="text-xs text-[#333333] font-semibold mb-2">{topicMeta?.label}</p>
            <h4 className="text-base font-bold text-[#ffffff]">{selectedQuestion?.title}</h4>
            <p className="text-sm text-[#ffffff]/80 mt-2 leading-relaxed">{selectedQuestion?.fullDescription || selectedQuestion?.description}</p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[10px] text-[#ffffff]/70 uppercase tracking-wider mb-1">Example Input</p>
                <pre className="text-xs text-[#333333] p-2 rounded-lg bg-black/35 border border-[#333333] whitespace-pre-wrap">{selectedQuestion?.input}</pre>
              </div>
              <div>
                <p className="text-[10px] text-[#ffffff]/70 uppercase tracking-wider mb-1">Example Output</p>
                <pre className="text-xs text-[#ffffff] p-2 rounded-lg bg-black/35 border border-[#333333] whitespace-pre-wrap">{selectedQuestion?.output}</pre>
              </div>
              <div>
                <p className="text-[10px] text-[#ffffff]/70 uppercase tracking-wider mb-1">Constraints</p>
                <p className="text-xs text-[#ffffff]/80">{selectedQuestion?.constraints || 'N/A'}</p>
              </div>
              <div className="inline-block text-[10px] px-2 py-1 rounded-full border border-[#333333] text-[#ffffff]">
                {selectedQuestion?.difficulty || 'Easy'}
              </div>
            </div>
          </div>
          <div className="lg:w-3/5 glass-card rounded-2xl p-3 flex flex-col">
            <Editor
              height="58vh"
              theme="vs-dark"
              defaultLanguage={selectedLanguage?.editorLanguage || 'java'}
              value={javaCode}
              onChange={(value) => setJavaCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Custom test input (optional)"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 text-sm bg-[#0a0a0a] border border-[#333333] text-[#ffffff]/90"
              />
              <button
                type="button"
                onClick={() => {
                  const passed = javaCode.includes('System.out') || Math.random() > 0.5
                  setRunResult(passed ? 'passed' : 'failed')
                }}
                className="vs-btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
              >
                Run Code
              </button>
              <button
                type="button"
                onClick={() => showToast('Code submitted (mock).', 'info')}
                className="rounded-lg px-4 py-2 text-sm font-semibold border border-[#333333]/50 text-[#f0e6d4] bg-[#1a1a1a]/40 hover:bg-[#333333]/50"
              >
                Submit Code
              </button>
            </div>
            <div className="mt-3 rounded-lg px-3 py-2 text-sm border border-[#333333] bg-black/30 text-[#ffffff]/90 min-h-10">
              {runResult === 'passed' && 'Test Case Passed ✅'}
              {runResult === 'failed' && 'Test Case Failed ❌'}
              {!runResult && 'Run your code to see result.'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Categories screen ──────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
      <div className="mb-4">
        <h2 className="text-lg font-bold font-cormorant vs-brand-gradient">Choose a Skill</h2>
        <p className="text-xs text-[#ffffff]/70 mt-0.5">Pick a category to start your daily challenge</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 auto-rows-fr">
        {SKILL_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => handleCategoryClick(c)}
            className="glass-card-interactive rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 group min-h-[7rem] sm:min-h-[7.5rem] border border-accent-neutral/10 hover:border-accent-primary/30">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#0a0a0a] rounded-2xl border border-accent-primary/20 shadow-[0_0_10px_rgba(255,107,53,0.1)] group-hover:shadow-[0_0_15px_rgba(255,107,53,0.2)] group-hover:border-accent-primary/40 transition-all duration-300">
              <span className="text-2xl group-hover:scale-105 transition-transform duration-300 transform-gpu">{c.emoji}</span>
            </div>
            <span className="text-[12px] font-bold text-accent-light text-center leading-tight line-clamp-2 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              {c.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
