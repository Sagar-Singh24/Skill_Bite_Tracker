// ============ AUTH (local demo — localStorage) ============
const STORAGE_USERS = "skillbite_users";
const STORAGE_SESSION = "skillbite_session";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(STORAGE_SESSION, JSON.stringify({ name: user.name, email: user.email }));
}

function clearSession() {
  localStorage.removeItem(STORAGE_SESSION);
}

function showAuthView(which) {
  const loginV = document.getElementById("auth-login-view");
  const signupV = document.getElementById("auth-signup-view");
  if (!loginV || !signupV) return;
  if (which === "signup") {
    loginV.classList.add("is-hidden");
    signupV.classList.remove("is-hidden");
  } else {
    signupV.classList.add("is-hidden");
    loginV.classList.remove("is-hidden");
  }
}

function userInitial(name) {
  if (!name || !name.trim()) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function syncProfileHeader() {
  const s = getSession();
  const nameEl = document.getElementById("profile-name");
  const emailEl = document.getElementById("profile-email");
  const av = document.getElementById("profile-avatar");
  const lbInit = document.getElementById("leaderboard-avatar-initial");
  const lbYou = document.getElementById("leaderboard-you-label");
  const battleInit = document.getElementById("battle-you-initial");
  if (!s) return;
  if (nameEl) nameEl.textContent = s.name || "Player";
  if (emailEl) emailEl.textContent = s.email || "—";
  const ini = userInitial(s.name);
  if (av) av.textContent = ini;
  if (lbInit) lbInit.textContent = ini;
  if (lbYou) lbYou.textContent = s.name ? s.name.split(" ")[0] : "You";
  if (battleInit) battleInit.textContent = ini;
}

function applyAuthShell() {
  const authRoot = document.getElementById("auth-root");
  const mainShell = document.getElementById("main-shell");
  const session = getSession();
  if (session) {
    authRoot.classList.add("is-hidden");
    mainShell.classList.remove("is-hidden");
    syncProfileHeader();
    switchPage("dashboard");
  } else {
    authRoot.classList.remove("is-hidden");
    mainShell.classList.add("is-hidden");
    showAuthView("login");
  }
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function logout() {
  clearSession();
  cancelChallengeIfAny();
  applyAuthShell();
  showToast("Signed out", "info");
}

// ============ PAGE NAVIGATION ============
const PAGE_LABELS = {
  dashboard: "Dashboard",
  daily: "Daily Task",
  leaderboard: "Leaderboard",
  profile: "Profile"
};

let currentPage = "dashboard";

function isChallengeActive() {
  const p = document.getElementById("challenge-panel");
  return p && !p.classList.contains("hidden");
}

function cancelChallengeIfAny() {
  if (isChallengeActive()) cancelChallenge();
}

function switchPage(page) {
  if (page !== "daily" && isChallengeActive()) {
    cancelChallenge();
  }

  currentPage = page;
  document.querySelectorAll(".app-page").forEach((el) => {
    const match = el.dataset.page === page;
    el.classList.toggle("hidden", !match);
  });

  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.tab === page);
  });

  const pt = document.getElementById("page-title");
  if (pt) pt.textContent = PAGE_LABELS[page] || page;

  if (typeof lucide !== "undefined") lucide.createIcons();
}

// ============ SKILL CATEGORIES (Daily Task UI) ============
const SKILL_CATEGORIES = [
  { id: "coding", title: "Coding", sub: "200 problems · IDE", emoji: "💻", bg: "rgba(45,75,90,0.35)" },
  { id: "dsa", title: "DSA", sub: "Structures & algo", emoji: "🧩", bg: "rgba(55,85,100,0.32)" },
  { id: "aptitude", title: "Aptitude", sub: "Quant & logic", emoji: "📐", bg: "rgba(59,130,246,0.22)" },
  { id: "math", title: "Math", sub: "Numerical", emoji: "🔢", bg: "rgba(201,169,104,0.22)" },
  { id: "english", title: "English & Comm.", sub: "Communication", emoji: "💬", bg: "rgba(16,185,129,0.22)" },
  { id: "cs", title: "CS Core", sub: "Fundamentals", emoji: "⚙️", bg: "rgba(249,115,22,0.22)" },
  { id: "webdev", title: "Web/App Dev", sub: "Frontend & backend", emoji: "🌐", bg: "rgba(6,182,212,0.22)" },
  { id: "aiml", title: "AI/ML", sub: "Models & data", emoji: "🤖", bg: "rgba(236,72,153,0.22)" },
  { id: "productivity", title: "Productivity", sub: "Habits & focus", emoji: "⚡", bg: "rgba(234,179,8,0.22)" },
  { id: "placement", title: "Placement Prep", sub: "Interview ready", emoji: "🎯", bg: "rgba(239,68,68,0.2)" },
  { id: "reasoning", title: "Reasoning", sub: "Logic puzzles", emoji: "🧠", bg: "rgba(120,70,58,0.22)" },
  { id: "fitness", title: "Fitness", sub: "Health & movement", emoji: "💪", bg: "rgba(34,197,94,0.2)" },
  { id: "creativity", title: "Creativity", sub: "Ideas & design", emoji: "🎨", bg: "rgba(244,114,182,0.22)" },
  { id: "gk", title: "General Awareness", sub: "GK & world", emoji: "🌍", bg: "rgba(20,184,166,0.22)" },
  { id: "fun", title: "Fun Challenges", sub: "Play & relax", emoji: "🎉", bg: "rgba(245,158,11,0.22)" },
  { id: "cooking", title: "Cooking Mastery", sub: "Recipes & techniques", emoji: "🍳", bg: "rgba(251,146,60,0.22)" }
];

const ALL_SKILL_IDS = SKILL_CATEGORIES.map((c) => c.id);

const bankCoding = [
  { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1 },
  { q: "Which data structure uses LIFO principle?", opts: ["Queue", "Stack", "Array", "Tree"], ans: 1 },
  { q: "What does 'DFS' stand for in graph traversal?", opts: ["Data First Search", "Depth First Search", "Direct Flow Sort", "Dynamic Find Search"], ans: 1 },
  { q: "Which sorting algorithm has the best average case?", opts: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"], ans: 2 },
  { q: "What is the space complexity of merge sort?", opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"], ans: 2 },
  { q: "A linked list node contains:", opts: ["Only data", "Data and pointer", "Only pointer", "Index and data"], ans: 1 },
  { q: "Hash tables provide average case lookup of:", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], ans: 2 },
  { q: "Which traversal visits root first?", opts: ["Inorder", "Preorder", "Postorder", "Level order"], ans: 1 },
  { q: "BFS uses which data structure?", opts: ["Stack", "Queue", "Heap", "Tree"], ans: 1 },
  { q: "The worst case of quicksort occurs when:", opts: ["Array is random", "Pivot is median", "Array is sorted", "Array is empty"], ans: 2 }
];

const bankAptitude = [
  { q: "If 5x + 3 = 28, what is x?", opts: ["3", "5", "7", "4"], ans: 1 },
  { q: "A train travels 120km in 2 hours. Speed?", opts: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], ans: 1 },
  { q: "What is 15% of 200?", opts: ["25", "30", "35", "20"], ans: 1 },
  { q: "If a:b = 2:3 and b:c = 4:5, then a:c = ?", opts: ["8:15", "2:5", "6:10", "4:15"], ans: 0 },
  { q: "Complete: 2, 6, 18, 54, ?", opts: ["108", "162", "126", "72"], ans: 1 },
  { q: "A can do work in 10 days, B in 15. Together?", opts: ["5 days", "6 days", "7 days", "8 days"], ans: 1 },
  { q: "Profit % if CP=80, SP=100?", opts: ["20%", "25%", "30%", "15%"], ans: 1 },
  { q: "Average of first 10 natural numbers?", opts: ["5", "5.5", "6", "4.5"], ans: 1 },
  { q: "Simple interest on 1000 at 5% for 2 years?", opts: ["50", "100", "150", "200"], ans: 1 },
  { q: "HCF of 12 and 18 is:", opts: ["3", "6", "9", "12"], ans: 1 }
];

const bankEnglish = [
  { q: "Choose the correct form: 'She ___ to school every day.'", opts: ["go", "goes", "going", "gone"], ans: 1 },
  { q: "Synonym of 'Eloquent':", opts: ["Silent", "Articulate", "Confused", "Angry"], ans: 1 },
  { q: "Antonym of 'Benevolent':", opts: ["Kind", "Generous", "Malevolent", "Friendly"], ans: 2 },
  { q: "Which sentence is grammatically correct?", opts: ["He don't know", "He doesn't knows", "He doesn't know", "He not know"], ans: 2 },
  { q: "Identify the noun: 'The quick brown fox jumps'", opts: ["quick", "brown", "fox", "jumps"], ans: 2 },
  { q: "'Serendipity' means:", opts: ["Bad luck", "Happy accident", "Sadness", "Anger"], ans: 1 },
  { q: "Past tense of 'begin':", opts: ["Begun", "Began", "Beginned", "Beginning"], ans: 1 },
  { q: "A 'metaphor' is:", opts: ["A question", "Direct comparison", "An exaggeration", "Sound words"], ans: 1 },
  { q: "Fill in: 'Neither he ___ I was there.'", opts: ["or", "nor", "and", "but"], ans: 1 },
  { q: "'Ubiquitous' means:", opts: ["Rare", "Found everywhere", "Dangerous", "Beautiful"], ans: 1 }
];

const bankCS = [
  { q: "What does CPU stand for?", opts: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Program Unit"], ans: 1 },
  { q: "Which is NOT an operating system?", opts: ["Linux", "Windows", "Oracle", "macOS"], ans: 2 },
  { q: "RAM stands for:", opts: ["Read Access Memory", "Random Access Memory", "Run All Memory", "Read Any Memory"], ans: 1 },
  { q: "HTTP is a protocol for:", opts: ["Email", "File transfer", "Web communication", "Database"], ans: 2 },
  { q: "Which layer is closest to hardware in OSI?", opts: ["Application", "Transport", "Physical", "Network"], ans: 2 },
  { q: "SQL is used for:", opts: ["Styling web pages", "Programming AI", "Managing databases", "Network config"], ans: 2 },
  { q: "What is a 'deadlock' in OS?", opts: ["Fast execution", "Circular waiting", "Memory leak", "CPU boost"], ans: 1 },
  { q: "TCP ensures:", opts: ["Fast delivery", "Reliable delivery", "Encrypted data", "Compressed data"], ans: 1 },
  { q: "Virtual memory extends:", opts: ["CPU speed", "RAM capacity", "Disk speed", "Network bandwidth"], ans: 1 },
  { q: "A 'compiler' converts:", opts: ["Binary to text", "Source to machine code", "HTML to CSS", "Images to text"], ans: 1 }
];

const bankWebdev = [
  { q: "HTML stands for:", opts: ["Hyper Tool Markup Language", "HyperText Markup Language", "HighText Machine Language", "Home Tool Markup Language"], ans: 1 },
  { q: "Which CSS property sets text color?", opts: ["font-color", "text-style", "color", "foreground"], ans: 2 },
  { q: "Which HTML tag defines a hyperlink?", opts: ["<link>", "<a>", "<href>", "<url>"], ans: 1 },
  { q: "JavaScript runs primarily:", opts: ["Only on servers", "In the browser and on servers", "Only in databases", "Only in CSS files"], ans: 1 },
  { q: "Responsive layouts often use:", opts: ["Fixed px only", "Media queries", "Tables only", "GIF images"], ans: 1 },
  { q: "REST APIs commonly use which verb for creating a resource?", opts: ["GET", "POST", "HEAD", "TRACE"], ans: 1 },
  { q: "npm is mainly a:", opts: ["CSS framework", "Package manager for JS", "Image editor", "Database"], ans: 1 },
  { q: "SPA often stands for:", opts: ["Simple Page App", "Single Page Application", "Server Public API", "Static PHP Archive"], ans: 1 }
];

const bankAIML = [
  { q: "Supervised learning typically requires:", opts: ["Only unlabeled data", "Labeled input–output pairs", "No data", "Random noise"], ans: 1 },
  { q: "A basic building block in neural nets is a:", opts: ["Neuron / node", "Compiler", "Router", "Pixel"], ans: 0 },
  { q: "Overfitting means the model:", opts: ["Generalizes perfectly", "Memorizes training too well", "Never trains", "Has zero parameters"], ans: 1 },
  { q: "Training data is used to:", opts: ["Tune model parameters", "Only display UI", "Replace backups", "Compress video"], ans: 0 },
  { q: "TensorFlow is best described as:", opts: ["A spreadsheet app", "An ML framework", "A browser", "A version of HTML"], ans: 1 },
  { q: "NLP stands for:", opts: ["Natural Language Processing", "Neural Logic Program", "Network Layer Protocol", "Numeric Linear Pack"], ans: 0 },
  { q: "GPUs help deep learning because they excel at:", opts: ["Sequential text editing", "Parallel matrix math", "Printing", "DNS lookup"], ans: 1 },
  { q: "A 'feature' in ML is:", opts: ["A bug fix", "An input variable used by the model", "The final prediction only", "A database table name"], ans: 1 }
];

const bankProductivity = [
  { q: "The Pomodoro technique uses:", opts: ["Random breaks only", "Timed focus blocks with short breaks", "24h work sessions", "No timers"], ans: 1 },
  { q: "SMART goals are usually:", opts: ["Vague dreams", "Specific, measurable, achievable…", "Only financial", "Impossible by design"], ans: 1 },
  { q: "Batching similar tasks reduces:", opts: ["Sleep", "Context switching cost", "Keyboard size", "Internet speed"], ans: 1 },
  { q: "Deep work needs:", opts: ["Constant notifications", "Long uninterrupted focus", "Multitasking always", "Zero planning"], ans: 1 },
  { q: "A weekly review helps with:", opts: ["Forgetting tasks", "Clarity and prioritization", "Deleting email forever", "Avoiding calendars"], ans: 1 },
  { q: "Saying 'no' protects:", opts: ["Spam filters", "Your time and priorities", "Only hardware", "Compiler errors"], ans: 1 },
  { q: "MIT in daily planning often means:", opts: ["Most Important Tasks", "Maximum Internet Time", "Manual Integration Test", "Monday Is Thursday"], ans: 0 },
  { q: "Inbox Zero is a method for:", opts: ["Deleting the inbox", "Processing email to a clear state", "Ignoring mail", "Buying storage"], ans: 1 }
];

const bankFitness = [
  { q: "Hydration mainly helps:", opts: ["Overheating only", "Performance, focus, and recovery", "Replacing sleep fully", "Skipping warm-ups"], ans: 1 },
  { q: "A warm-up before exercise helps:", opts: ["Guarantee records", "Prepare body and reduce injury risk", "Replace stretching forever", "Remove need for rest"], ans: 1 },
  { q: "Rest days allow:", opts: ["Only weight gain", "Recovery and adaptation", "Muscle deletion", "Loss of skill always"], ans: 1 },
  { q: "Cardio training primarily improves:", opts: ["Only flexibility", "Heart and endurance", "Bone density only", "Eyesight"], ans: 1 },
  { q: "Stretching regularly improves:", opts: ["Only strength max", "Flexibility and mobility", "Screen resolution", "Typing speed only"], ans: 1 },
  { q: "Adults often need roughly:", opts: ["2h sleep", "7–9 hours sleep for recovery", "No sleep on weekends", "Sleep only after meals"], ans: 1 },
  { q: "Protein after training supports:", opts: ["Muscle repair and growth", "Deleting calories only", "Screen brightness", "DNS caching"], ans: 0 },
  { q: "Consistency in workouts beats:", opts: ["Only intensity spikes with long gaps", "All rest", "Drinking water", "Walking"], ans: 0 }
];

const bankCreativity = [
  { q: "Classic brainstorming defers:", opts: ["All ideas forever", "Judgment while generating many ideas", "Sleep", "Color choice"], ans: 1 },
  { q: "Analogies help creativity by:", opts: ["Blocking ideas", "Connecting distant concepts", "Removing constraints", "Deleting drafts"], ans: 1 },
  { q: "Constraints can:", opts: ["Always kill ideas", "Sometimes spark creative solutions", "Replace thinking", "Guarantee copying"], ans: 1 },
  { q: "A mind map usually branches from:", opts: ["A random word list", "A central idea", "Only numbers", "The footer"], ans: 1 },
  { q: "Divergent thinking aims to:", opts: ["Pick one answer fast", "Generate many possible ideas", "Avoid questions", "Copy competitors only"], ans: 1 },
  { q: "SCAMPER is used to:", opts: ["Sort emails", "Modify and stretch ideas", "Compile code", "Measure heart rate"], ans: 1 },
  { q: "Incubation in creativity happens:", opts: ["Only during exams", "Away from the problem while subconscious works", "Never", "Only with music off"], ans: 1 },
  { q: "Reframing changes:", opts: ["Font size only", "How you view the problem", "Hardware drivers", "Weather"], ans: 1 }
];

const bankGK = [
  { q: "Earth's largest ocean by area is:", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: 3 },
  { q: "Chemical formula of water is:", opts: ["CO2", "NaCl", "H2O", "O2"], ans: 2 },
  { q: "Plants absorb mainly for photosynthesis:", opts: ["Nitrogen only", "Carbon dioxide", "Helium", "Gold"], ans: 1 },
  { q: "Capital of Japan is:", opts: ["Seoul", "Beijing", "Tokyo", "Bangkok"], ans: 2 },
  { q: "The Sun is a:", opts: ["Planet", "Moon", "Star", "Asteroid belt"], ans: 2 },
  { q: "Which gas makes up most of Earth's atmosphere?", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], ans: 2 },
  { q: "First human on the Moon (NASA mission era):", opts: ["Buzz Aldrin first step", "Neil Armstrong", "Yuri Gagarin on Moon", "No one"], ans: 1 },
  { q: "Photosynthesis produces oxygen and mainly:", opts: ["Coal", "Glucose / sugars", "Steel", "Plastic"], ans: 1 }
];

const bankFun = [
  { q: "A standard tic-tac-toe grid is:", opts: ["4×4", "3×3", "5×5", "2×2"], ans: 1 },
  { q: "How many faces does a standard die have?", opts: ["4", "6", "8", "12"], ans: 1 },
  { q: "Which month has at least 28 days?", opts: ["Only February", "All of them", "None", "Only leap years"], ans: 1 },
  { q: "A palindrome reads the same:", opts: ["Only in Spanish", "Forwards and backwards", "Upside down only", "Never"], ans: 1 },
  { q: "Rainbow (classic mnemonic) often lists:", opts: ["3 colors", "7 colors", "12 colors", "2 colors"], ans: 1 },
  { q: "Rubik's Cube (3×3) has how many colored faces?", opts: ["4", "6", "8", "9"], ans: 1 },
  { q: "Riddle: What has hands but can't clap?", opts: ["A cat", "A clock", "A river", "A book"], ans: 1 },
  { q: "Chess, each side starts with how many pawns?", opts: ["6", "8", "10", "16"], ans: 1 }
];

const bankCooking = [
  { q: "What is 'mise en place' in cooking?", opts: ["Cooking fast", "Preparing ingredients before cooking", "Only French cuisine", "Deep frying"], ans: 1 },
  { q: "Which temperature is generally safe for cooked poultry (°F)?", opts: ["150°F", "165°F", "180°F", "200°F"], ans: 1 },
  { q: "What does 'al dente' mean for pasta?", opts: ["Very soft", "Firm to the bite", "Burnt", "Cold"], ans: 1 },
  { q: "Baking powder is mainly used for:", opts: ["Saltiness", "Leavening / rising", "Color only", "Thickening only"], ans: 1 },
  { q: "Cross-contamination in the kitchen is best prevented by:", opts: ["Using one board for everything", "Separating raw and cooked foods", "Skipping hand washing", "Storing meat above salad"], ans: 1 },
  { q: "Simmering is usually:", opts: ["Boiling violently", "Gentle bubbles below a full boil", "Only freezing", "Microwave only"], ans: 1 },
  { q: "What is a roux?", opts: ["A herb", "Cooking fat + flour as a thickener", "A type of oven", "Raw meat only"], ans: 1 },
  { q: "Why rest meat after cooking?", opts: ["To cool only", "So juices redistribute for tenderness", "To make it raw", "To remove salt"], ans: 1 },
  { q: "Which is a common egg substitute in baking (vegan)?", opts: ["Water only", "Flax egg / applesauce (context)", "Only sugar", "Vinegar alone"], ans: 1 },
  { q: "What does 'fold' mean when mixing batter?", opts: ["Stir hard", "Gently combine without deflating air", "Only use a fork", "Blend in a blender"], ans: 1 }
];

const questionBank = {
  dsa: bankCoding,
  aptitude: bankAptitude,
  math: bankAptitude,
  reasoning: bankAptitude,
  english: bankEnglish,
  cs: bankCS,
  webdev: bankWebdev,
  aiml: bankAIML,
  productivity: bankProductivity,
  placement: [...bankCoding, ...bankAptitude],
  fitness: bankFitness,
  creativity: bankCreativity,
  gk: bankGK,
  fun: bankFun,
  cooking: bankCooking
};

const CODE_WARRIOR_CATS = ["coding", "dsa", "webdev", "aiml", "cs"];

function distinctChallengesInCats(catIds) {
  const names = new Set(
    allRecords.filter((r) => r.challenge_name && catIds.includes(r.skill_category)).map((r) => r.challenge_name)
  );
  return names.size;
}

function getCategoryMeta(catId) {
  const c = SKILL_CATEGORIES.find((x) => x.id === catId);
  return c ? { icon: c.emoji, label: `${c.title} · Challenge` } : { icon: "📚", label: "Challenge" };
}

function renderSkillCategories() {
  const wrap = document.getElementById("skill-categories");
  if (!wrap) return;
  wrap.innerHTML = SKILL_CATEGORIES.map(
    (c) => `<button type="button" onclick="startChallenge('${c.id}')" class="glass-card rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col items-center gap-1 transition-all hover:scale-105 active:scale-95 group min-h-[4.5rem] sm:min-h-0">
      <div class="category-icon category-icon--compact flex items-center justify-center" style="background:${c.bg}"><span class="inline-block">${c.emoji}</span></div>
      <span class="text-[9px] sm:text-[10px] font-medium text-gray-300 text-center leading-tight line-clamp-2 px-0.5 group-hover:text-[#c8e4f0]">${c.title}</span>
      <span class="text-[8px] sm:text-[9px] text-gray-600 text-center leading-tight line-clamp-2 hidden sm:block">${c.sub}</span>
    </button>`
  ).join("");
}

const ANALYTICS_COLORS = ["#3d5a6a", "#5a8a9c", "#8b5a4a", "#c9a968", "#3b82f6", "#0ea5e9", "#10b981", "#f97316", "#ec4899", "#14b8a6", "#eab308", "#22c55e", "#f43f5e", "#06b6d4", "#84cc16"];

function renderAnalyticsRows() {
  const wrap = document.getElementById("analytics-rows");
  if (!wrap) return;
  wrap.innerHTML = SKILL_CATEGORIES.map((c, i) => {
    const col = ANALYTICS_COLORS[i % ANALYTICS_COLORS.length];
    return `<div>
      <div class="flex justify-between text-xs mb-1 gap-1"><span class="text-gray-400 flex items-center gap-1 min-w-0"><span class="shrink-0">${c.emoji}</span><span class="truncate">${c.title}</span></span><span id="analytics-${c.id}" class="font-semibold shrink-0" style="color:${col}">0%</span></div>
      <div class="h-2 rounded-full overflow-hidden" style="background:rgba(45,75,90,0.22);">
        <div id="analytics-${c.id}-bar" class="h-full rounded-full transition-all duration-700" style="background:${col};width:0%;"></div>
      </div>
    </div>`;
  }).join("");
}

// ============ APP STATE ============
let allRecords = [];
let currentChallenge = null;
let timerInterval = null;
let timeRemaining = 600;
let currentQuestionIndex = 0;
let challengeQuestions = [];
let challengeCorrect = 0;
let challengeStartTime = 0;
let codingSessionProblems = [];
let currentCodingRound = 0;
let codingRoundSolved = [];
let earnedBadges = new Set();
let categoriesPlayed = new Set();

const defaultConfig = {
  app_title: "Skill Bite",
  welcome_message: "Ready for today's challenge?",
  streak_label: "Day Streak",
  primary_color: "#05080c",
  surface_color: "#0e141c",
  text_color: "#d8e2ea",
  action_color: "#3d5a6a",
  secondary_action_color: "#8b5a4a",
  font_family: "Outfit",
  font_size: 16
};

// ============ SDK INIT ============
const dataHandler = {
  onDataChanged(data) {
    allRecords = data;
    updateDashboard();
  }
};

(async function init() {
  document.getElementById("form-login")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;
    const users = getUsers();
    const u = users.find((x) => x.email === email && x.password === password);
    if (!u) {
      showToast("Invalid email or password", "error");
      return;
    }
    setSession({ name: u.name, email: u.email });
    applyAuthShell();
    showToast(`Welcome back, ${u.name.split(" ")[0]}!`, "success");
  });

  document.getElementById("form-signup")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;
    const users = getUsers();
    if (users.some((x) => x.email === email)) {
      showToast("That email is already registered", "error");
      return;
    }
    users.push({ name, email, password });
    saveUsers(users);
    setSession({ name, email });
    applyAuthShell();
    showToast("Account created — you're in!", "success");
  });

  renderSkillCategories();
  renderAnalyticsRows();

  applyAuthShell();

  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => {
        const c = (key) => config[key] || defaultConfig[key];
        const font = c("font_family");
        const baseSize = c("font_size");

        const ht = document.getElementById("header-title");
        const wt = document.getElementById("welcome-text");
        if (ht) ht.textContent = c("app_title");
        if (wt) wt.textContent = c("welcome_message");

        document.body.style.fontFamily = `${font}, Outfit, sans-serif`;
        document.body.style.background = c("primary_color");
        document.body.style.color = c("text_color");

        document.querySelectorAll(".glass-card").forEach((el) => {
          el.style.borderColor = c("action_color") + "26";
        });

        if (ht) ht.style.fontSize = `${baseSize * 1.125}px`;
        if (wt) wt.style.fontSize = `${baseSize * 1.25}px`;
      },
      mapToCapabilities: (config) => ({
        recolorables: [
          { get: () => config.primary_color || defaultConfig.primary_color, set: (v) => { config.primary_color = v; window.elementSdk.setConfig({ primary_color: v }); } },
          { get: () => config.surface_color || defaultConfig.surface_color, set: (v) => { config.surface_color = v; window.elementSdk.setConfig({ surface_color: v }); } },
          { get: () => config.text_color || defaultConfig.text_color, set: (v) => { config.text_color = v; window.elementSdk.setConfig({ text_color: v }); } },
          { get: () => config.action_color || defaultConfig.action_color, set: (v) => { config.action_color = v; window.elementSdk.setConfig({ action_color: v }); } },
          { get: () => config.secondary_action_color || defaultConfig.secondary_action_color, set: (v) => { config.secondary_action_color = v; window.elementSdk.setConfig({ secondary_action_color: v }); } }
        ],
        borderables: [],
        fontEditable: { get: () => config.font_family || defaultConfig.font_family, set: (v) => { config.font_family = v; window.elementSdk.setConfig({ font_family: v }); } },
        fontSizeable: { get: () => config.font_size || defaultConfig.font_size, set: (v) => { config.font_size = v; window.elementSdk.setConfig({ font_size: v }); } }
      }),
      mapToEditPanelValues: (config) => new Map([
        ["app_title", config.app_title || defaultConfig.app_title],
        ["welcome_message", config.welcome_message || defaultConfig.welcome_message],
        ["streak_label", config.streak_label || defaultConfig.streak_label]
      ])
    });
  }

  if (window.dataSdk) {
    const result = await window.dataSdk.init(dataHandler);
    if (!result.isOk) console.error("Data SDK init failed");
  }

  const hour = new Date().getHours();
  const greetEl = document.getElementById("time-greeting");
  if (greetEl) greetEl.textContent = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  document.getElementById("notif-btn")?.addEventListener("click", () => {
    document.getElementById("notif-panel")?.classList.remove("hidden");
    if (typeof lucide !== "undefined") lucide.createIcons();
  });

  document.getElementById("app-menu-btn")?.addEventListener("click", () => {
    const panel = document.getElementById("app-menu-panel");
    if (!panel) return;
    if (panel.classList.contains("hidden")) openAppMenu();
    else closeAppMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const settingsModal = document.getElementById("settings-modal");
    if (settingsModal && !settingsModal.classList.contains("hidden")) {
      closeSettingsModalWithSound();
      return;
    }
    const notif = document.getElementById("notif-panel");
    if (notif && !notif.classList.contains("hidden")) {
      closeNotifs();
      return;
    }
    closeAppMenu();
  });

  initUiSoundDelegation();
  initSettingsUI();

  if (typeof lucide !== "undefined") lucide.createIcons();
})();

// ============ DASHBOARD ============
function updateDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = allRecords.filter((r) => r.completed_at && r.completed_at.startsWith(today));
  const totalXP = allRecords.reduce((sum, r) => sum + (r.xp_earned || 0), 0);

  const xpEl = document.getElementById("xp-display");
  if (xpEl) xpEl.textContent = totalXP.toLocaleString();
  const level = Math.floor(totalXP / 100) + 1;
  const levelNames = ["Beginner", "Novice", "Apprentice", "Adept", "Expert", "Master", "Grandmaster"];
  const levelName = levelNames[Math.min(Math.floor(totalXP / 200), levelNames.length - 1)];
  const lvlText = document.getElementById("your-level-text");
  if (lvlText) lvlText.textContent = `Level ${level} · ${levelName}`;
  const lbXP = document.getElementById("leaderboard-your-xp");
  if (lbXP) lbXP.textContent = totalXP.toLocaleString();

  const dailyDone = Math.min(todayRecords.length, 5);
  const pct = Math.round((dailyDone / 5) * 100);
  const pctEl = document.getElementById("daily-progress-pct");
  if (pctEl) pctEl.textContent = pct + "%";
  const barEl = document.getElementById("daily-progress-bar");
  if (barEl) barEl.style.width = pct + "%";
  const doneEl = document.getElementById("tasks-done");
  if (doneEl) doneEl.textContent = dailyDone;

  let streak = 0;
  const dates = [...new Set(allRecords.map((r) => (r.completed_at ? r.completed_at.split("T")[0] : null)).filter(Boolean))].sort().reverse();
  if (dates.length > 0) {
    streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const d1 = new Date(dates[i]),
        d2 = new Date(dates[i + 1]);
      if ((d1 - d2) / 86400000 === 1) streak++;
      else break;
    }
  }
  const streakEl = document.getElementById("streak-count");
  if (streakEl) streakEl.textContent = streak;

  const catStats = {};
  ALL_SKILL_IDS.forEach((cat) => {
    const catRecords = allRecords.filter((r) => r.skill_category === cat);
    const correct = catRecords.filter((r) => r.is_correct).length;
    const total = catRecords.length;
    catStats[cat] = total > 0 ? Math.round((correct / total) * 100) : 0;
    const pctSpan = document.getElementById(`analytics-${cat}`);
    if (pctSpan) pctSpan.textContent = catStats[cat] + "%";
    const bar = document.getElementById(`analytics-${cat}-bar`);
    if (bar) bar.style.width = catStats[cat] + "%";
  });

  const hint = document.getElementById("weak-area-hint");
  const playedCats = ALL_SKILL_IDS.filter((c) => allRecords.some((r) => r.skill_category === c));
  if (playedCats.length > 0) {
    const weakest = playedCats.reduce((a, b) => (catStats[a] < catStats[b] ? a : b));
    if (catStats[weakest] < 60) {
      if (hint) hint.classList.remove("hidden");
      const nameEl = document.getElementById("weak-area-name");
      const meta = SKILL_CATEGORIES.find((x) => x.id === weakest);
      if (nameEl && meta) nameEl.textContent = `${meta.title} — Focus more on this area!`;
    } else if (hint) hint.classList.add("hidden");
  } else if (hint) hint.classList.add("hidden");

  const codeWarriorN = Math.min(distinctChallengesInCats(CODE_WARRIOR_CATS), 5);
  const cwBar = document.getElementById("weekly-code-warrior-bar");
  if (cwBar) cwBar.style.width = (codeWarriorN / 5) * 100 + "%";
  const cwLbl = document.getElementById("weekly-code-warrior-count");
  if (cwLbl) cwLbl.textContent = `${codeWarriorN}/5`;

  const fitN = Math.min(distinctChallengesInCats(["fitness"]), 3);
  const fitBar = document.getElementById("weekly-fitness-bar");
  if (fitBar) fitBar.style.width = (fitN / 3) * 100 + "%";
  const fitLbl = document.getElementById("weekly-fitness-count");
  if (fitLbl) fitLbl.textContent = `${fitN}/3`;

  const perfectSessions = countPerfectSessions();
  const focusN = Math.min(perfectSessions, 3);
  const focusBar = document.getElementById("weekly-focus-bar");
  if (focusBar) focusBar.style.width = (focusN / 3) * 100 + "%";
  const focusLbl = document.getElementById("weekly-focus-count");
  if (focusLbl) focusLbl.textContent = `${focusN}/3`;

  const creatN = Math.min(distinctChallengesInCats(["creativity"]), 3);
  const creatBar = document.getElementById("weekly-creativity-bar");
  if (creatBar) creatBar.style.width = (creatN / 3) * 100 + "%";
  const creatLbl = document.getElementById("weekly-creativity-count");
  if (creatLbl) creatLbl.textContent = `${creatN}/3`;

  updateBadges(totalXP, streak, perfectSessions);
  syncProfileHeader();
}

function countPerfectSessions() {
  const sessions = {};
  allRecords.forEach((r) => {
    if (r.challenge_name) {
      if (!sessions[r.challenge_name]) sessions[r.challenge_name] = { total: 0, correct: 0 };
      sessions[r.challenge_name].total++;
      if (r.is_correct) sessions[r.challenge_name].correct++;
    }
  });
  return Object.values(sessions).filter((s) => s.total >= 5 && s.correct === s.total).length;
}

function updateBadges(totalXP, streak, perfectSessions) {
  const badgeConditions = {
    first_bite: allRecords.length > 0,
    streak_3: streak >= 3,
    streak_7: streak >= 7,
    xp_100: totalXP >= 100,
    perfect: perfectSessions >= 1,
    all_cats: new Set(allRecords.map((r) => r.skill_category).filter(Boolean)).size >= 8
  };

  document.querySelectorAll(".badge-item").forEach((el) => {
    const badge = el.dataset.badge;
    if (badgeConditions[badge]) {
      el.classList.add("badge-earned");
      if (!earnedBadges.has(badge)) {
        earnedBadges.add(badge);
        el.classList.add("animate-badge-pop");
      }
    } else {
      el.classList.remove("badge-earned");
    }
  });
}

// ============ CHALLENGE SYSTEM ============
function startChallenge(category) {
  switchPage("daily");
  if (category === "coding") {
    startCodingChallenge();
    return;
  }
  const bank = questionBank[category];
  if (!bank || bank.length < 5) {
    showToast("No questions for this category yet.", "error");
    return;
  }
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  challengeQuestions = shuffled.slice(0, 5);
  currentQuestionIndex = 0;
  challengeCorrect = 0;
  challengeStartTime = Date.now();
  timeRemaining = 600;
  currentChallenge = category;
  categoriesPlayed.add(category);

  const meta = getCategoryMeta(category);
  document.getElementById("challenge-icon").textContent = meta.icon;
  document.getElementById("challenge-category-label").textContent = meta.label;
  document.getElementById("challenge-quiz-mode").classList.remove("hidden");
  document.getElementById("challenge-coding-mode").classList.add("hidden");
  document.getElementById("challenge-panel").classList.remove("hidden");
  document.getElementById("result-panel").classList.add("hidden");
  document.getElementById("categories-section").style.display = "none";

  renderQuestion();
  startTimer();
  if (typeof lucide !== "undefined") lucide.createIcons();
}

const STORAGE_CODING_LANG = "skillbite_coding_lang";

function startCodingChallenge() {
  const bank = typeof CODING_PROBLEMS !== "undefined" && Array.isArray(CODING_PROBLEMS) ? CODING_PROBLEMS : [];
  if (bank.length < 5) {
    showToast("Coding problems failed to load.", "error");
    return;
  }
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  codingSessionProblems = shuffled.slice(0, 5);
  currentCodingRound = 0;
  codingRoundSolved = [false, false, false, false, false];
  challengeQuestions = [];
  currentQuestionIndex = 0;
  challengeCorrect = 0;
  challengeStartTime = Date.now();
  timeRemaining = 600;
  currentChallenge = "coding";
  categoriesPlayed.add("coding");

  document.getElementById("challenge-icon").textContent = "💻";
  document.getElementById("challenge-category-label").textContent = "Coding · Terminal";
  document.getElementById("challenge-quiz-mode").classList.add("hidden");
  document.getElementById("challenge-coding-mode").classList.remove("hidden");
  document.getElementById("challenge-panel").classList.remove("hidden");
  document.getElementById("result-panel").classList.add("hidden");
  document.getElementById("categories-section").style.display = "none";

  const sel = document.getElementById("coding-lang-select");
  if (sel) {
    const saved = localStorage.getItem(STORAGE_CODING_LANG);
    if (saved && ["javascript", "python", "cpp", "c", "java"].includes(saved)) sel.value = saved;
    sel.onchange = () => {
      localStorage.setItem(STORAGE_CODING_LANG, sel.value);
      loadCodingProblem(currentCodingRound);
    };
  }

  loadCodingProblem(0);
  renderCodingDots();
  startTimer();
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function loadCodingProblem(roundIdx) {
  const prob = codingSessionProblems[roundIdx];
  if (!prob) return;
  const diffEl = document.getElementById("challenge-difficulty");
  if (diffEl) diffEl.textContent = prob.difficulty || "Easy";
  document.getElementById("coding-problem-meta").textContent = `Round ${roundIdx + 1}/5 · Bank #${prob.id}`;
  document.getElementById("coding-problem-title").textContent = prob.title;
  document.getElementById("coding-problem-desc").textContent = prob.description;
  document.getElementById("coding-stdin-preview").textContent = prob.stdin;
  document.getElementById("coding-round-label").textContent = `Problem ${roundIdx + 1} of 5`;
  const lang = document.getElementById("coding-lang-select")?.value || "javascript";
  const starter = prob.starters && prob.starters[lang] ? prob.starters[lang] : "";
  const ed = document.getElementById("coding-editor");
  if (ed) ed.value = starter;
  const out = document.getElementById("coding-terminal-output");
  if (out) out.textContent = "";
}

function renderCodingDots() {
  const dots = document.getElementById("coding-progress-dots");
  if (!dots) return;
  dots.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const dot = document.createElement("span");
    dot.className = "w-2.5 h-2.5 rounded-full transition-all";
    if (codingRoundSolved[i]) dot.style.background = "#22c55e";
    else if (i === currentCodingRound) {
      dot.style.background = "#5a8a9c";
      dot.classList.add("animate-glow-ring");
    } else dot.style.background = "rgba(45,75,90,0.4)";
    dots.appendChild(dot);
  }
}

function normalizeOutput(s) {
  if (s == null) return "";
  return String(s).replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
}

function outputsMatch(got, expected) {
  return normalizeOutput(got) === normalizeOutput(expected);
}

function runJavaScriptUser(code, stdin) {
  let output = "";
  const fakeConsole = {
    log: (...a) => {
      output += a.map(String).join(" ") + "\n";
    }
  };
  try {
    const wrapped = `const stdin = ${JSON.stringify(stdin)};\n${code}`;
    const fn = new Function("console", wrapped);
    fn(fakeConsole);
  } catch (e) {
    return { ok: false, stdout: output, stderr: String(e.message || e) };
  }
  return { ok: true, stdout: output, stderr: "" };
}

async function runPistonExecute(lang, code, stdin) {
  const map = {
    python: { language: "python", version: "3.10.0", name: "main.py" },
    c: { language: "c", version: "10.2.0", name: "main.c" },
    cpp: { language: "c++", version: "10.2.0", name: "main.cpp" },
    java: { language: "java", version: "15.0.2", name: "Main.java" }
  };
  const m = map[lang];
  const res = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: m.language,
      version: m.version,
      files: [{ name: m.name, content: code }],
      stdin: stdin == null ? "" : String(stdin)
    })
  });
  const data = await res.json();
  if (!data.run) {
    return { ok: false, stdout: "", stderr: data.message ? String(data.message) : JSON.stringify(data).slice(0, 400) };
  }
  const compileErr = data.compile && data.compile.stderr ? data.compile.stderr : "";
  const compileCode = data.compile && data.compile.code;
  const runErr = data.run.stderr || "";
  const runOut = data.run.stdout ?? "";
  const exit = data.run.code;
  const errParts = [compileErr, runErr].filter(Boolean);
  const err = errParts.join("\n").trim();
  const okRun = exit === 0 || exit === null || exit === undefined;
  const okCompile = compileCode === undefined || compileCode === 0 || compileCode === null;
  return {
    ok: okCompile && okRun,
    stdout: runOut,
    stderr: err || (!okRun && exit != null ? `Exit code ${exit}` : "")
  };
}

async function executeCodingCode(lang, code, stdin) {
  if (lang === "javascript") return runJavaScriptUser(code, stdin);
  try {
    return await runPistonExecute(lang, code, stdin);
  } catch (e) {
    return { ok: false, stdout: "", stderr: String(e.message || e) + " (network or CORS — try JavaScript mode.)" };
  }
}

async function execCodingRun() {
  const prob = codingSessionProblems[currentCodingRound];
  if (!prob) return;
  const lang = document.getElementById("coding-lang-select")?.value || "javascript";
  const code = document.getElementById("coding-editor")?.value || "";
  const outEl = document.getElementById("coding-terminal-output");
  outEl.textContent = "Running…";
  const result = await executeCodingCode(lang, code, prob.stdin);
  let text = "";
  if (result.stderr) text += result.stderr + (result.stderr.endsWith("\n") ? "" : "\n");
  if (result.stdout !== undefined && result.stdout !== "") text += result.stdout;
  if (!text.trim()) text = "(no output)\n";
  outEl.textContent = text;
}

async function submitCodingSolution() {
  const prob = codingSessionProblems[currentCodingRound];
  if (!prob) return;
  const lang = document.getElementById("coding-lang-select")?.value || "javascript";
  const code = document.getElementById("coding-editor")?.value || "";
  const outEl = document.getElementById("coding-terminal-output");
  outEl.textContent = "Checking…";
  const result = await executeCodingCode(lang, code, prob.stdin);
  let text = "";
  if (result.stderr) text += result.stderr + (result.stderr.endsWith("\n") ? "" : "\n");
  text += result.stdout || "";
  outEl.textContent = text || "(no output)\n";

  if (lang === "javascript" && result.ok === false) {
    showToast("Runtime error — fix your code.", "error");
    return;
  }
  const pass = outputsMatch(result.stdout, prob.expected);
  if (!pass) {
    showToast("Output does not match expected. Fix and try again.", "error");
    return;
  }
  if (codingRoundSolved[currentCodingRound]) {
    showToast("This round is already accepted.", "info");
    return;
  }
  codingRoundSolved[currentCodingRound] = true;
  challengeCorrect++;
  showToast("✅ Accepted! +20 XP", "success");
  await saveAnswer(true);
  currentCodingRound++;
  if (currentCodingRound < 5) {
    loadCodingProblem(currentCodingRound);
    renderCodingDots();
  } else {
    finishChallenge();
  }
}

function renderQuestion() {
  const q = challengeQuestions[currentQuestionIndex];
  document.getElementById("question-text").textContent = q.q;
  document.getElementById("question-counter").textContent = `Question ${currentQuestionIndex + 1} of 5`;

  const container = document.getElementById("options-container");
  container.innerHTML = "";
  q.opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all hover:scale-[1.01] active:scale-[0.99]";
    btn.style.cssText = "background:rgba(45,75,90,0.18);border:1px solid rgba(74,120,140,0.35);";
    btn.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
    btn.onclick = () => selectAnswer(i, btn);
    container.appendChild(btn);
  });

  const dots = document.getElementById("challenge-progress-dots");
  dots.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const dot = document.createElement("span");
    dot.className = "w-2.5 h-2.5 rounded-full transition-all";
    dot.style.background = i < currentQuestionIndex ? "#22c55e" : i === currentQuestionIndex ? "#5a8a9c" : "rgba(45,75,90,0.4)";
    if (i === currentQuestionIndex) dot.classList.add("animate-glow-ring");
    dots.appendChild(dot);
  }
}

function selectAnswer(idx, btn) {
  const q = challengeQuestions[currentQuestionIndex];
  const isCorrect = idx === q.ans;
  const allBtns = document.querySelectorAll("#options-container button");
  allBtns.forEach((b) => {
    b.onclick = null;
    b.style.opacity = "0.5";
  });

  if (isCorrect) {
    btn.style.background = "rgba(34,197,94,0.2)";
    btn.style.borderColor = "rgba(34,197,94,0.5)";
    btn.style.opacity = "1";
    challengeCorrect++;
    showToast("✅ Correct! +20 XP", "success");
  } else {
    btn.style.background = "rgba(239,68,68,0.2)";
    btn.style.borderColor = "rgba(239,68,68,0.5)";
    btn.style.opacity = "1";
    allBtns[q.ans].style.background = "rgba(34,197,94,0.2)";
    allBtns[q.ans].style.borderColor = "rgba(34,197,94,0.5)";
    allBtns[q.ans].style.opacity = "1";
    showToast("❌ Incorrect", "error");
  }

  saveAnswer(isCorrect);

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < 5) {
      renderQuestion();
    } else {
      finishChallenge();
    }
  }, 1200);
}

async function saveAnswer(isCorrect) {
  if (!window.dataSdk) return;
  if (allRecords.length >= 999) {
    showToast("⚠️ Storage limit reached!", "error");
    return;
  }
  const challengeName = `${currentChallenge}_${challengeStartTime}`;
  const result = await window.dataSdk.create({
    type: "answer",
    skill_category: currentChallenge,
    xp_earned: isCorrect ? 20 : 5,
    completed_at: new Date().toISOString(),
    streak_count: 0,
    is_correct: isCorrect,
    time_spent: Math.round((Date.now() - challengeStartTime) / 1000),
    challenge_name: challengeName
  });
  if (!result.isOk) showToast("Failed to save", "error");
}

function finishChallenge() {
  clearInterval(timerInterval);
  const elapsed = Math.round((Date.now() - challengeStartTime) / 1000);
  const xpEarned = challengeCorrect * 20 + (5 - challengeCorrect) * 5;

  document.getElementById("challenge-panel").classList.add("hidden");
  document.getElementById("result-panel").classList.remove("hidden");

  const emojis = ["😢", "😐", "🙂", "😊", "🏆"];
  document.getElementById("result-emoji").textContent = emojis[challengeCorrect] || "🏆";
  document.getElementById("result-title").textContent = challengeCorrect === 5 ? "Perfect Score!" : challengeCorrect >= 3 ? "Great Job!" : "Keep Practicing!";
  document.getElementById("result-subtitle").textContent = challengeCorrect === 5 ? "You nailed every question!" : `${challengeCorrect}/5 correct answers`;
  document.getElementById("result-correct").textContent = challengeCorrect;
  document.getElementById("result-xp").textContent = xpEarned;
  document.getElementById("result-time").textContent = elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

  if (challengeCorrect === 5) spawnParticles();
}

function showDailyCategories() {
  document.getElementById("categories-section").style.display = "";
  document.getElementById("challenge-panel").classList.add("hidden");
  document.getElementById("result-panel").classList.add("hidden");
  const cq = document.getElementById("challenge-quiz-mode");
  const cc = document.getElementById("challenge-coding-mode");
  if (cq) cq.classList.remove("hidden");
  if (cc) cc.classList.add("hidden");
}

function closeResult() {
  showDailyCategories();
}

function cancelChallenge() {
  clearInterval(timerInterval);
  showDailyCategories();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeRemaining--;
    const min = Math.floor(timeRemaining / 60);
    const sec = timeRemaining % 60;
    const display = document.getElementById("timer-display");
    if (display) display.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      finishChallenge();
    }
  }, 1000);
}

// ============ BATTLE ============
function showBattleModal() {
  playUiSound("menu");
  syncProfileHeader();
  document.getElementById("battle-modal").classList.remove("hidden");
  if (typeof lucide !== "undefined") lucide.createIcons();
}
function closeBattleModal() {
  document.getElementById("battle-modal").classList.add("hidden");
}
function startBattle(opponent) {
  playUiSound("menu");
  closeBattleModal();
  showToast(`⚔️ Battle with ${opponent} starting!`, "info");
  startChallenge(ALL_SKILL_IDS[Math.floor(Math.random() * ALL_SKILL_IDS.length)]);
}

function closeNotifs() {
  document.getElementById("notif-panel").classList.add("hidden");
}

// ============ SETTINGS (localStorage) ============
const STORAGE_SETTINGS = "skillbite_settings";

function getSettings() {
  const defaults = { sound: true, reminder: true, reducedMotion: false };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_SETTINGS) || "{}") };
  } catch {
    return { ...defaults };
  }
}

/** Web Audio UI clicks (no external files) */
let audioCtx = null;
function getAudioContext() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Bold UI thud: low-mid body + sub punch + damped click (no high chirps).
 * @param {"open"|"nav"|"menu"|"tap"|"soft"} kind
 * open = menu toggle · nav = bottom bar · menu = drawer rows · tap = bell · soft = dismiss
 */
function playUiSound(kind = "menu") {
  if (!getSettings().sound) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.92;

    const shelf = ctx.createBiquadFilter();
    shelf.type = "lowshelf";
    shelf.frequency.value = 220;
    shelf.gain.value = 5;

    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2400;
    tone.Q.value = 0.6;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 20;
    comp.ratio.value = 4;
    comp.attack.value = 0.002;
    comp.release.value = 0.1;
    master.connect(shelf);
    shelf.connect(tone);
    tone.connect(comp);
    comp.connect(ctx.destination);

    const presets = {
      open: { sub: 82, subG: 0.72, f0: 320, f1: 95, ms: 72, body: 0.62, nF: 520, nQ: 2.4, nG: 0.48, nMs: 22 },
      nav: { sub: 76, subG: 0.62, f0: 280, f1: 102, ms: 58, body: 0.55, nF: 460, nQ: 2.6, nG: 0.42, nMs: 18 },
      menu: { sub: 78, subG: 0.64, f0: 290, f1: 98, ms: 60, body: 0.57, nF: 480, nQ: 2.5, nG: 0.44, nMs: 19 },
      tap: { sub: 80, subG: 0.58, f0: 340, f1: 105, ms: 52, body: 0.54, nF: 620, nQ: 2.2, nG: 0.46, nMs: 16 },
      soft: { sub: 68, subG: 0.42, f0: 235, f1: 88, ms: 44, body: 0.38, nF: 400, nQ: 2.8, nG: 0.28, nMs: 14 }
    };
    const p = presets[kind] || presets.menu;
    const dur = p.ms / 1000;
    const fEnd = Math.max(p.f1, 55);
    const nDur = p.nMs / 1000;

    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(p.sub, t);
    const gSub = ctx.createGain();
    gSub.gain.setValueAtTime(0.001, t);
    gSub.gain.linearRampToValueAtTime(p.subG, t + 0.005);
    gSub.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    sub.connect(gSub);
    gSub.connect(master);

    const body = ctx.createOscillator();
    body.type = "triangle";
    body.frequency.setValueAtTime(p.f0, t);
    body.frequency.exponentialRampToValueAtTime(fEnd, t + dur);
    const gBody = ctx.createGain();
    gBody.gain.setValueAtTime(p.body, t);
    gBody.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.03);
    body.connect(gBody);
    gBody.connect(master);

    const nLen = Math.ceil(ctx.sampleRate * 0.06);
    const nBuf = ctx.createBuffer(1, nLen, ctx.sampleRate);
    const nData = nBuf.getChannelData(0);
    for (let i = 0; i < nLen; i++) nData[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = nBuf;
    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.value = p.nF;
    bpf.Q.value = p.nQ;
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0.001, t);
    gN.gain.linearRampToValueAtTime(p.nG, t + 0.002);
    gN.gain.exponentialRampToValueAtTime(0.001, t + nDur);
    noise.connect(bpf);
    bpf.connect(gN);
    gN.connect(master);

    sub.start(t);
    sub.stop(t + 0.14);
    body.start(t);
    body.stop(t + dur + 0.05);
    noise.start(t);
    noise.stop(t + nDur + 0.012);
  } catch (_) {
    /* ignore */
  }
}

function initUiSoundDelegation() {
  const shell = document.getElementById("main-shell");
  if (!shell) return;
  shell.addEventListener(
    "click",
    (e) => {
      if (!getSettings().sound) return;
      if (e.target.closest("#app-menu-btn")) {
        const panel = document.getElementById("app-menu-panel");
        const menuOpen = panel && !panel.classList.contains("hidden");
        playUiSound(menuOpen ? "soft" : "open");
        return;
      }
      if (e.target.closest("nav .nav-item")) {
        playUiSound("nav");
        return;
      }
      if (e.target.closest(".app-menu-item")) {
        playUiSound("menu");
        return;
      }
      if (e.target.closest("#notif-btn")) {
        playUiSound("tap");
        return;
      }
      if (e.target.closest("#skill-categories button")) {
        playUiSound("menu");
        return;
      }
    },
    true
  );
}

function closeAppMenuWithSound() {
  playUiSound("soft");
  closeAppMenu();
}

function closeSettingsModalWithSound() {
  playUiSound("soft");
  closeSettingsModal();
}

function closeBattleModalWithSound() {
  playUiSound("soft");
  closeBattleModal();
}

function saveSettingsFromForm() {
  const sound = document.getElementById("setting-sound");
  const reminder = document.getElementById("setting-reminder");
  const reduced = document.getElementById("setting-reduced-motion");
  localStorage.setItem(
    STORAGE_SETTINGS,
    JSON.stringify({
      sound: sound ? sound.checked : true,
      reminder: reminder ? reminder.checked : true,
      reducedMotion: reduced ? reduced.checked : false
    })
  );
  applyReducedMotion();
}

function applyReducedMotion() {
  document.body.classList.toggle("reduce-motion", !!getSettings().reducedMotion);
}

function syncSettingsForm() {
  const s = getSettings();
  const sound = document.getElementById("setting-sound");
  const reminder = document.getElementById("setting-reminder");
  const reduced = document.getElementById("setting-reduced-motion");
  if (sound) sound.checked = s.sound !== false;
  if (reminder) reminder.checked = s.reminder !== false;
  if (reduced) reduced.checked = !!s.reducedMotion;
}

let settingsListenersBound = false;

function initSettingsUI() {
  syncSettingsForm();
  applyReducedMotion();
  if (settingsListenersBound) return;
  settingsListenersBound = true;
  const sound = document.getElementById("setting-sound");
  const reminder = document.getElementById("setting-reminder");
  const reduced = document.getElementById("setting-reduced-motion");
  [sound, reminder, reduced].forEach((el) => {
    el?.addEventListener("change", saveSettingsFromForm);
  });
}

function openSettingsModal() {
  syncSettingsForm();
  document.getElementById("settings-modal")?.classList.remove("hidden");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeSettingsModal() {
  document.getElementById("settings-modal")?.classList.add("hidden");
}

// ============ APP MENU (header logo) ============
function openAppMenu() {
  const panel = document.getElementById("app-menu-panel");
  const btn = document.getElementById("app-menu-btn");
  if (!panel) return;
  panel.classList.remove("hidden");
  if (btn) btn.setAttribute("aria-expanded", "true");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeAppMenu() {
  const panel = document.getElementById("app-menu-panel");
  const btn = document.getElementById("app-menu-btn");
  if (panel) panel.classList.add("hidden");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function menuNavigate(target) {
  closeAppMenu();
  if (target === "settings") {
    openSettingsModal();
    return;
  }
  switchPage(target);
}

function openNotifsFromMenu() {
  closeAppMenu();
  document.getElementById("notif-panel")?.classList.remove("hidden");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

// ============ TOAST ============
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  const colors = {
    success: "rgba(34,197,94,0.2)",
    error: "rgba(239,68,68,0.2)",
    info: "rgba(45,75,90,0.35)"
  };
  const borders = {
    success: "rgba(34,197,94,0.3)",
    error: "rgba(239,68,68,0.3)",
    info: "rgba(126,184,200,0.45)"
  };
  toast.className = "toast-notification px-4 py-3 rounded-xl text-sm font-medium pointer-events-auto";
  toast.style.cssText = `background:${colors[type]};border:1px solid ${borders[type]};backdrop-filter:blur(10px);`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ============ PARTICLES ============
function spawnParticles() {
  const container = document.getElementById("result-particles");
  container.innerHTML = "";
  const colors = ["#3d5a6a", "#8b5a4a", "#c9a968", "#5a8a9c", "#22c55e"];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.cssText = `left:${Math.random() * 100}%;top:${50 + Math.random() * 40}%;background:${colors[Math.floor(Math.random() * colors.length)]};animation-delay:${Math.random() * 0.5}s;`;
    container.appendChild(p);
  }
}

// Expose for HTML onclick
window.showAuthView = showAuthView;
window.switchPage = switchPage;
window.logout = logout;
window.startChallenge = startChallenge;
window.closeResult = closeResult;
window.cancelChallenge = cancelChallenge;
window.showBattleModal = showBattleModal;
window.closeBattleModal = closeBattleModal;
window.startBattle = startBattle;
window.closeNotifs = closeNotifs;
window.openAppMenu = openAppMenu;
window.closeAppMenu = closeAppMenu;
window.menuNavigate = menuNavigate;
window.openNotifsFromMenu = openNotifsFromMenu;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.closeAppMenuWithSound = closeAppMenuWithSound;
window.closeSettingsModalWithSound = closeSettingsModalWithSound;
window.closeBattleModalWithSound = closeBattleModalWithSound;
window.execCodingRun = execCodingRun;
window.submitCodingSolution = submitCodingSolution;
