import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Send, ChevronDown, Loader } from 'lucide-react'
import { api } from '../utils/api'
import OutputPanel from '../components/OutputPanel'

const LANG_CONFIG = {
  java:   { label: 'Java',   monacoLang: 'java',   template: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // your code here\n    }\n}` },
  python: { label: 'Python', monacoLang: 'python', template: `import sys\ninput = sys.stdin.readline\n\n# your code here\n` },
  cpp:    { label: 'C++',    monacoLang: 'cpp',    template: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // your code here\n    return 0;\n}` },
}

export default function CodeEditorPage({ problemId, onBack }) {
  const [problem, setProblem]   = useState(null)
  const [problems, setProblems] = useState([])
  const [activePid, setActivePid] = useState(problemId || null)
  const [language, setLanguage] = useState('java')
  const [code, setCode]         = useState(LANG_CONFIG.java.template)
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [mode, setMode]         = useState('run')
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    api.getProblems().then(setProblems).catch(() => {})
  }, [])

  useEffect(() => {
    if (!activePid) return
    api.getProblem(activePid).then(setProblem).catch(() => {})
    setResult(null)
  }, [activePid])

  function handleLangChange(lang) {
    setLanguage(lang)
    setCode(LANG_CONFIG[lang].template)
  }

  async function handleRun() {
    if (!activePid) return
    setLoading(true); setMode('run'); setResult(null)
    try {
      const res = await api.runCode(code, language, activePid)
      setResult(res)
    } catch (e) {
      setResult({ verdict: 'RE', compileError: e.message, results: [] })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!activePid) return
    setLoading(true); setMode('submit'); setResult(null)
    try {
      const res = await api.submitCode(code, language, activePid)
      setResult(res)
    } catch (e) {
      setResult({ verdict: 'RE', compileError: e.message, results: [] })
    } finally {
      setLoading(false)
    }
  }

  if (!activePid) {
    return <ProblemList problems={problems} onSelect={setActivePid} />
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setActivePid(null)}
                  className="text-gray-400 hover:text-white text-sm">
            ← Problems
          </button>
          <span className="text-gray-600">|</span>
          <span className="font-semibold text-sm truncate max-w-xs">
            {problem?.title ?? 'Loading...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={e => handleLangChange(e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-700 text-sm rounded px-3 py-1.5 pr-7 focus:outline-none focus:border-blue-500"
            >
              {Object.entries(LANG_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          <button onClick={handleRun} disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium disabled:opacity-50">
            {loading && mode === 'run' ? <Loader size={14} className="animate-spin" /> : <Play size={14} />}
            Run
          </button>

          <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded text-sm font-medium disabled:opacity-50">
            {loading && mode === 'submit' ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            Submit
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: problem */}
        <div className="w-[420px] shrink-0 flex flex-col border-r border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-800">
            {['description', 'submissions'].map(tab => (
              <button key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm capitalize ${activeTab === tab
                        ? 'border-b-2 border-blue-500 text-white'
                        : 'text-gray-400 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'description'
              ? <ProblemDescription problem={problem} />
              : <SubmissionHistory />}
          </div>
        </div>

        {/* Right panel: editor + output */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={LANG_CONFIG[language].monacoLang}
              value={code}
              onChange={v => setCode(v ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                tabSize: 4,
              }}
            />
          </div>

          {/* Output panel */}
          <div className="h-56 border-t border-gray-800 overflow-y-auto bg-gray-900 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Output</p>
            <OutputPanel result={result} loading={loading} mode={mode} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProblemDescription({ problem }) {
  if (!problem) return <div className="text-gray-500 text-sm">Loading...</div>
  return (
    <div className="space-y-4 text-sm">
      <h2 className="text-lg font-bold">{problem.title}</h2>
      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{problem.description}</p>

      {problem.constraints && (
        <div>
          <p className="font-semibold text-gray-200 mb-1">Constraints</p>
          <pre className="text-gray-400 text-xs whitespace-pre-wrap font-mono bg-gray-800/50 p-2 rounded">
            {problem.constraints}
          </pre>
        </div>
      )}

      {problem.sampleInput && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-semibold text-gray-200 mb-1">Sample Input</p>
            <pre className="bg-gray-800/60 p-2 rounded text-xs font-mono text-gray-300 whitespace-pre-wrap">
              {problem.sampleInput}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-gray-200 mb-1">Sample Output</p>
            <pre className="bg-gray-800/60 p-2 rounded text-xs font-mono text-gray-300 whitespace-pre-wrap">
              {problem.sampleOutput}
            </pre>
          </div>
        </div>
      )}

      <div className="flex gap-4 text-xs text-gray-500">
        <span>⏱ {problem.timeLimitSeconds}s</span>
        <span>💾 {problem.memoryLimitMb}MB</span>
      </div>
    </div>
  )
}

function SubmissionHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSubmissions()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  const VERDICT_COLOR = {
    AC: 'text-green-400', WA: 'text-red-400',
    TLE: 'text-yellow-400', RE: 'text-orange-400', COMPILE_ERROR: 'text-pink-400',
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>
  if (!history.length) return <div className="text-gray-500 text-sm">No submissions yet.</div>

  return (
    <div className="space-y-2">
      {history.map(s => (
        <div key={s.id} className="bg-gray-800/60 rounded p-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">{s.problemTitle}</span>
            <span className={`font-semibold ${VERDICT_COLOR[s.verdict] ?? 'text-gray-400'}`}>
              {s.verdict}
            </span>
          </div>
          <div className="flex gap-3 mt-1 text-gray-500">
            <span>{s.language}</span>
            <span>{s.executionTimeMs}ms</span>
            <span>{new Date(s.submittedAt).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProblemList({ problems, onSelect }) {
  const DIFF_COLOR = { Easy: 'text-green-400', Medium: 'text-yellow-400', Hard: 'text-red-400' }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Problems</h1>
      <div className="max-w-3xl mx-auto space-y-2">
        {problems.map((p, i) => (
          <button key={p.id} onClick={() => onSelect(p.id)}
                  className="w-full flex items-center gap-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg px-4 py-3 text-left transition-colors">
            <span className="text-gray-500 w-8 text-sm">{i + 1}</span>
            <span className="flex-1 font-medium">{p.title}</span>
          </button>
        ))}
        {!problems.length && (
          <p className="text-gray-500 text-center py-12">No problems found. Make sure the backend is running.</p>
        )}
      </div>
    </div>
  )
}
