const BASE = 'http://localhost:8050/api'
const LOCAL_USERS_KEY = 'skillbite_users'
const LOCAL_ANSWERS_KEY = 'skillbite_answers'

// ── local storage helpers ──────────────────────────────────────────────────
function localUsers() {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]') } catch { return [] }
}
function saveLocalUsers(users) { localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users)) }
function localAnswers(email) {
  try { return JSON.parse(localStorage.getItem(`${LOCAL_ANSWERS_KEY}_${email}`) || '[]') } catch { return [] }
}
function saveLocalAnswers(email, answers) { localStorage.setItem(`${LOCAL_ANSWERS_KEY}_${email}`, JSON.stringify(answers)) }
function fakeToken(email) { return btoa(`skillbite:${email}:${Date.now()}`) }

// ── backend request (throws on network error) ─────────────────────────────
async function request(path, options = {}) {
  const token = localStorage.getItem('skillbite_token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || res.statusText)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// ── api with local fallback ────────────────────────────────────────────────
export const api = {
  async signup(name, email, password) {
    try {
      return await request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) })
    } catch (err) {
      if (!isNetworkError(err)) throw err
      // local fallback
      const users = localUsers()
      if (users.find(u => u.email === email)) throw new Error('Email already registered')
      users.push({ name, email, password })
      saveLocalUsers(users)
      return { token: fakeToken(email), name, email }
    }
  },

  async login(email, password) {
    try {
      return await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    } catch (err) {
      if (!isNetworkError(err)) throw err
      // local fallback
      const user = localUsers().find(u => u.email === email && u.password === password)
      if (!user) throw new Error('Invalid email or password')
      return { token: fakeToken(email), name: user.name, email }
    }
  },

  async getAnswers() {
    try {
      return await request('/answers')
    } catch (err) {
      if (!isNetworkError(err)) throw err
      const user = getCurrentUser()
      return user ? localAnswers(user.email) : []
    }
  },

  async saveAnswer(data) {
    try {
      return await request('/answers', { method: 'POST', body: JSON.stringify(data) })
    } catch (err) {
      if (!isNetworkError(err)) throw err
      const user = getCurrentUser()
      if (!user) return data
      const answers = localAnswers(user.email)
      const record = { ...data, id: Date.now() }
      answers.push(record)
      saveLocalAnswers(user.email, answers)
      return record
    }
  },

  getQuestions: (category) => request(`/questions/${category}`),

  // ── Judge API ──────────────────────────────────────────────────────────────
  getProblems: () => request('/problems'),
  getProblem: (id) => request(`/problem/${id}`),
  runCode: (code, language, problemId) =>
    request('/run', { method: 'POST', body: JSON.stringify({ code, language, problemId }) }),
  submitCode: (code, language, problemId) =>
    request('/submit', { method: 'POST', body: JSON.stringify({ code, language, problemId }) }),
  getSubmissions: () => request('/submissions'),

  async getLeaderboard() {
    try {
      return await request('/stats/leaderboard')
    } catch {
      return []
    }
  },

  async getMyStats() {
    try {
      return await request('/stats/me')
    } catch {
      return null
    }
  },
}

function isNetworkError(err) {
  return err instanceof TypeError && err.message === 'Failed to fetch'
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('skillbite_user') || 'null') } catch { return null }
}
