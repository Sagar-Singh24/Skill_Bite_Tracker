export const SKILL_CATEGORIES = [
  { id: 'coding',      title: 'Coding',            sub: '200 problems · IDE',    emoji: '💻', bg: 'rgba(26, 26, 26,0.35)' },
  { id: 'dsa',         title: 'DSA',               sub: 'Structures & algo',     emoji: '🧩', bg: 'rgba(55,85,100,0.32)' },
  { id: 'aptitude',    title: 'Aptitude',          sub: 'Quant & logic',         emoji: '📐', bg: 'rgba(59,130,246,0.22)' },
  { id: 'math',        title: 'Math',              sub: 'Numerical',             emoji: '🔢', bg: 'rgba(51, 51, 51,0.22)' },
  { id: 'english',     title: 'English & Comm.',   sub: 'Communication',         emoji: '💬', bg: 'rgba(16,185,129,0.22)' },
  { id: 'cs',          title: 'CS Core',           sub: 'Fundamentals',          emoji: '⚙️', bg: 'rgba(249,115,22,0.22)' },
  { id: 'webdev',      title: 'Web/App Dev',       sub: 'Frontend & backend',    emoji: '🌐', bg: 'rgba(6,182,212,0.22)' },
  { id: 'aiml',        title: 'AI/ML',             sub: 'Models & data',         emoji: '🤖', bg: 'rgba(236,72,153,0.22)' },
  { id: 'language',    title: 'Language',          sub: 'Learning methods',      emoji: '🗣️', bg: 'rgba(234,179,8,0.22)' },
  { id: 'placement',   title: 'Placement Prep',    sub: 'Productivity & focus',  emoji: '🎯', bg: 'rgba(239,68,68,0.2)' },
  { id: 'reasoning',   title: 'Reasoning',         sub: 'Logic puzzles',         emoji: '🧠', bg: 'rgba(120,70,58,0.22)' },
  { id: 'fitness',     title: 'Fitness',           sub: 'Health & movement',     emoji: '💪', bg: 'rgba(34,197,94,0.2)' },
  { id: 'creativity',  title: 'Creativity',        sub: 'Ideas & design',        emoji: '🎨', bg: 'rgba(244,114,182,0.22)' },
  { id: 'gk',          title: 'General Knowledge', sub: 'GK & world',            emoji: '🌍', bg: 'rgba(20,184,166,0.22)' },
  { id: 'fun',         title: 'Fun Challenges',    sub: 'Play & relax',          emoji: '🎉', bg: 'rgba(245,158,11,0.22)' },
  { id: 'cooking',     title: 'Cooking',           sub: 'Recipes & techniques',  emoji: '🍳', bg: 'rgba(251,146,60,0.22)' },
]

export const ALL_SKILL_IDS = SKILL_CATEGORIES.map(c => c.id)
export const CODE_WARRIOR_CATS = ['coding', 'dsa', 'webdev', 'aiml', 'cs']
export const ANALYTICS_COLORS = ['#3d5a6a','#5a8a9c','#0a0a0a','#333333','#3b82f6','#0ea5e9','#10b981','#f97316','#ec4899','#14b8a6','#eab308','#22c55e','#f43f5e','#06b6d4','#84cc16']

export const LEVEL_NAMES = ['Beginner','Novice','Apprentice','Adept','Expert','Master','Grandmaster']

export const questionBank = {
  dsa: [
    { q: 'What is the theoretical time complexity of Searching in a balanced Binary Search Tree?', opts: ['O(N)','O(log N)','O(N log N)','O(1)'], ans: 1 },
    { q: "Which data structure is typically used to implement recursion in computer architecture?", opts: ['Queue','Stack','Linked List','Hash Table'], ans: 1 },
    { q: "What is the primary difference between Depth First Search (DFS) and Breadth First Search (BFS)?", opts: ['DFS uses a Queue, BFS uses a Stack','DFS uses a Stack, BFS uses a Queue','DFS is faster than BFS always','BFS visits deepest nodes first'], ans: 1 },
    { q: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(N log N)?', opts: ['Quick Sort','Merge Sort','Bubble Sort','Selection Sort'], ans: 1 },
    { q: 'What is the auxiliary space complexity of an in-place Bubble Sort algorithm?', opts: ['O(N)','O(log N)','O(1)','O(N²)'], ans: 2 },
    { q: 'A Doubly Linked List node differentiates from a Singly Linked List node by having:', opts: ['Extra data field','Reference to the previous node','Reference to the root','Dynamic size'], ans: 1 },
    { q: 'In a Hash Table with Chaining, the worst-case time complexity for a search operation is:', opts: ['O(1)','O(N)','O(log N)','O(N log N)'], ans: 1 },
    { q: 'Which tree traversal technique visits nodes in a non-decreasing order for a Binary Search Tree?', opts: ['Pre-order','In-order','Post-order','Level-order'], ans: 1 },
    { q: 'The Breadth First Search (BFS) algorithm is best suited for finding:', opts: ['All possible paths','Shortest path in an unweighted graph','Deepest node','Cyclic dependencies'], ans: 1 },
    { q: 'In the context of the Quicksort algorithm, a poor choice of pivot leads to:', opts: ['Memory overflow','Infinite loop','O(N²) time complexity','Stable sorting'], ans: 2 },
  ],
  aptitude: [
    { q: '[Number System] What is the sum of the first five prime numbers?', opts: ['18', '28', '26', '15'], ans: 1 },
    { q: '[HCF & LCM] Find the Least Common Multiple (LCM) of 12, 15, and 20.', opts: ['30', '45', '60', '120'], ans: 2 },
    { q: '[Simplification] According to BODMAS, evaluate: 15 + 3 × 4 - 6 ÷ 2', opts: ['24', '26', '30', '18'], ans: 0 },
    { q: '[Percentage] If value X is 20% of Y, then what percentage of X is Y?', opts: ['100%', '200%', '400%', '500%'], ans: 3 },
    { q: '[Ratio] Given A:B = 3:4 and B:C = 8:9, determine the ratio A:C.', opts: ['2:3', '1:2', '3:2', '4:3'], ans: 0 },
    { q: '[Partnership] A invests $50,000 and B invests $70,000. In a total profit of $24,000, find A’s share.', opts: ['$10,000', '$12,000', '$14,000', '$8,000'], ans: 0 },
    { q: '[Profit & Loss] If Cost Price is 250 and Selling Price is 300, what is the profit percentage?', opts: ['15%', '20%', '25%', '30%'], ans: 1 },
    { q: '[Simple Interest] Calculate the interest on $5,000 at 10% annual rate for 3 years.', opts: ['$1,000', '$1,200', '$1,500', '$2,000'], ans: 2 },
    { q: '[Compound Interest] Find the final amount on $1,000 invested at 10% CI for 2 years.', opts: ['$1,100', '$1,200', '$1,210', '$1,331'], ans: 2 },
    { q: '[Time & Work] A can complete a task in 10 days, and B in 15 days. How long will they take together?', opts: ['5 days', '6 days', '7 days', '8 days'], ans: 1 },
    { q: '[Pipes & Cisterns] Pipe A fills in 4h, B in 6h. Both together?', opts: ['2.4h', '3.2h', '4h', '5h'], ans: 0 },
    { q: '[Speed & Distance] Speed of 90 km/h in m/s is?', opts: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'], ans: 2 },
    { q: '[Boats & Streams] Boat speed 10, flow 2. Downstream speed?', opts: ['8', '10', '12', '14'], ans: 2 },
    { q: '[Ages] Father is 3x son. After 10yrs he is 2x. Son’s age?', opts: ['5', '8', '10', '15'], ans: 2 },
    { q: '[Mixture] Mix 10/kg and 20/kg to get 15/kg. Ratio?', opts: ['1:1', '1:2', '2:1', '3:2'], ans: 0 },
    { q: '[Permutation] Ways to arrange letters in "CAT"?', opts: ['3', '6', '9', '12'], ans: 1 },
    { q: '[Probability] Getting a sum of 7 with two dice?', opts: ['1/12', '1/8', '1/6', '1/4'], ans: 2 },
  ],
  english: [
    { q: "Choose correct: 'She ___ to school every day.'", opts: ['go','goes','going','gone'], ans: 1 },
    { q: "Synonym of 'Eloquent':", opts: ['Silent','Articulate','Confused','Angry'], ans: 1 },
    { q: "Antonym of 'Benevolent':", opts: ['Kind','Generous','Malevolent','Friendly'], ans: 2 },
    { q: 'Which sentence is grammatically correct?', opts: ["He don't know","He doesn't knows","He doesn't know","He not know"], ans: 2 },
    { q: "Identify the noun: 'The quick brown fox jumps'", opts: ['quick','brown','fox','jumps'], ans: 2 },
    { q: "'Serendipity' means:", opts: ['Bad luck','Happy accident','Sadness','Anger'], ans: 1 },
    { q: "Past tense of 'begin':", opts: ['Begun','Began','Beginned','Beginning'], ans: 1 },
    { q: "A 'metaphor' is:", opts: ['A question','Direct comparison','An exaggeration','Sound words'], ans: 1 },
    { q: "Fill in: 'Neither he ___ I was there.'", opts: ['or','nor','and','but'], ans: 1 },
    { q: "'Ubiquitous' means:", opts: ['Rare','Found everywhere','Dangerous','Beautiful'], ans: 1 },
  ],
  webdev: [
    { q: 'HTML stands for:', opts: ['Hyper Tool Markup Language','HyperText Markup Language','HighText Machine Language','Home Tool Markup Language'], ans: 1 },
    { q: 'Which CSS property sets text color?', opts: ['font-color','text-style','color','foreground'], ans: 2 },
    { q: 'Which HTML tag defines a hyperlink?', opts: ['<link>','<a>','<href>','<url>'], ans: 1 },
    { q: 'JavaScript runs primarily:', opts: ['Only on servers','In the browser and on servers','Only in databases','Only in CSS files'], ans: 1 },
    { q: 'Responsive layouts often use:', opts: ['Fixed px only','Media queries','Tables only','GIF images'], ans: 1 },
    { q: 'REST APIs use which verb for creating a resource?', opts: ['GET','POST','HEAD','TRACE'], ans: 1 },
    { q: 'npm is mainly a:', opts: ['CSS framework','Package manager for JS','Image editor','Database'], ans: 1 },
    { q: 'SPA stands for:', opts: ['Simple Page App','Single Page Application','Server Public API','Static PHP Archive'], ans: 1 },
  ],
  aiml: [
    { q: 'Supervised learning requires:', opts: ['Only unlabeled data','Labeled input–output pairs','No data','Random noise'], ans: 1 },
    { q: 'Basic building block in neural nets:', opts: ['Neuron / node','Compiler','Router','Pixel'], ans: 0 },
    { q: 'Overfitting means the model:', opts: ['Generalizes perfectly','Memorizes training too well','Never trains','Has zero parameters'], ans: 1 },
    { q: 'Training data is used to:', opts: ['Tune model parameters','Only display UI','Replace backups','Compress video'], ans: 0 },
    { q: 'TensorFlow is best described as:', opts: ['A spreadsheet app','An ML framework','A browser','A version of HTML'], ans: 1 },
    { q: 'NLP stands for:', opts: ['Natural Language Processing','Neural Logic Program','Network Layer Protocol','Numeric Linear Pack'], ans: 0 },
    { q: 'GPUs help deep learning because they excel at:', opts: ['Sequential text editing','Parallel matrix math','Parallel matrix math','DNS lookup'], ans: 1 },
    { q: "A 'feature' in ML is:", opts: ['A bug fix','An input variable used by the model','The final prediction only','A database table name'], ans: 1 },
  ],
  language: [],
  fitness: [],
  gk: [],
  fun: [
    { q: 'A standard tic-tac-toe grid is:', opts: ['4×4','3×3','5×5','2×2'], ans: 1 },
    { q: 'How many faces does a standard die have?', opts: ['4','6','8','12'], ans: 1 },
    { q: 'Which month has at least 28 days?', opts: ['Only February','All of them','None','Only leap years'], ans: 1 },
    { q: 'A palindrome reads the same:', opts: ['Only in Spanish','Forwards and backwards','Upside down only','Never'], ans: 1 },
    { q: 'Rainbow (classic mnemonic) often lists:', opts: ['3 colors','7 colors','12 colors','2 colors'], ans: 1 },
    { q: "Rubik's Cube (3×3) has how many colored faces?", opts: ['4','6','8','9'], ans: 1 },
    { q: 'Riddle: What has hands but cannot clap?', opts: ['A cat','A clock','A river','A book'], ans: 1 },
    { q: 'Chess, each side starts with how many pawns?', opts: ['6','8','10','16'], ans: 1 },
  ],
  cooking: [],
}

questionBank.math = []
questionBank.reasoning = []
questionBank.placement = [...questionBank.dsa, ...questionBank.aptitude]
