import Editor from '@monaco-editor/react'

const MONACO_LANG_MAP = {
  java: 'java', cpp: 'cpp', c: 'c', python: 'python',
  javascript: 'javascript', typescript: 'typescript',
  go: 'go', rust: 'rust', kotlin: 'kotlin', swift: 'swift',
}

export default function CodeEditor({ language = 'java', code = '', onChange, height = '100%' }) {
  return (
    <Editor
      height={height}
      language={MONACO_LANG_MAP[language] ?? language}
      value={code}
      onChange={v => onChange?.(v ?? '')}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        tabSize: 4,
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  )
}
