import { CheckCircle, XCircle, Clock, AlertTriangle, Loader } from 'lucide-react'

const VERDICT_STYLE = {
  AC:            { label: 'Accepted',           color: 'text-green-400',  bg: 'bg-green-900/30',  Icon: CheckCircle },
  WA:            { label: 'Wrong Answer',        color: 'text-red-400',    bg: 'bg-red-900/30',    Icon: XCircle },
  TLE:           { label: 'Time Limit Exceeded', color: 'text-yellow-400', bg: 'bg-yellow-900/30', Icon: Clock },
  RE:            { label: 'Runtime Error',       color: 'text-orange-400', bg: 'bg-orange-900/30', Icon: AlertTriangle },
  COMPILE_ERROR: { label: 'Compile Error',       color: 'text-pink-400',   bg: 'bg-pink-900/30',   Icon: AlertTriangle },
}

const STATUS_ICON = {
  PASS: <CheckCircle size={14} className="text-green-400 shrink-0" />,
  FAIL: <XCircle    size={14} className="text-red-400 shrink-0" />,
  TLE:  <Clock      size={14} className="text-yellow-400 shrink-0" />,
  RE:   <AlertTriangle size={14} className="text-orange-400 shrink-0" />,
}

export default function OutputPanel({ result, loading, mode }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 text-gray-400">
        <Loader size={16} className="animate-spin" />
        <span>{mode === 'run' ? 'Running...' : 'Judging...'}</span>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Click <span className="text-white font-medium">Run Code</span> to test against sample cases,
        or <span className="text-white font-medium">Submit</span> to judge all test cases.
      </div>
    )
  }

  if (result.verdict === 'COMPILE_ERROR') {
    const { color, bg, Icon, label } = VERDICT_STYLE.COMPILE_ERROR
    return (
      <div className={`p-4 rounded-lg ${bg}`}>
        <div className={`flex items-center gap-2 font-semibold mb-2 ${color}`}>
          <Icon size={16} /> {label}
        </div>
        <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">
          {result.compileError?.replace('COMPILE_ERROR: ', '')}
        </pre>
      </div>
    )
  }

  const verdictInfo = VERDICT_STYLE[result.verdict] || VERDICT_STYLE.WA
  const { color, bg, Icon, label } = verdictInfo

  return (
    <div className="flex flex-col gap-3">
      {/* Overall verdict (submit mode only) */}
      {mode === 'submit' && (
        <div className={`flex items-center justify-between p-3 rounded-lg ${bg}`}>
          <div className={`flex items-center gap-2 font-semibold ${color}`}>
            <Icon size={16} /> {label}
          </div>
          <span className="text-gray-400 text-xs">{result.totalTimeMs}ms</span>
        </div>
      )}

      {/* Per test case results */}
      <div className="flex flex-col gap-2">
        {result.results?.map((tc) => (
          <div key={tc.index}
               className="bg-gray-800/60 rounded-lg border border-gray-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800/80">
              <div className="flex items-center gap-2 text-sm font-medium">
                {STATUS_ICON[tc.status]}
                <span className="text-gray-300">
                  Test Case {tc.index} {tc.hidden ? <span className="text-gray-500">(hidden)</span> : ''}
                </span>
              </div>
              <span className="text-xs text-gray-500">{tc.executionTimeMs}ms</span>
            </div>

            {!tc.hidden && (
              <div className="px-3 py-2 grid grid-cols-1 gap-2 text-xs font-mono">
                <Row label="Input"    value={tc.input} />
                <Row label="Expected" value={tc.expectedOutput} />
                <Row label="Output"   value={tc.actualOutput}
                     highlight={tc.status !== 'PASS'} />
              </div>
            )}

            {tc.status === 'TLE' && (
              <p className="px-3 pb-2 text-xs text-yellow-400">Time limit exceeded</p>
            )}
            {tc.status === 'RE' && (
              <p className="px-3 pb-2 text-xs text-orange-400">Runtime error</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div>
      <span className="text-gray-500">{label}: </span>
      <span className={highlight ? 'text-red-300' : 'text-gray-200'}>
        {value ?? ''}
      </span>
    </div>
  )
}
