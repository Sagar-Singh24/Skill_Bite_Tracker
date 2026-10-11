import { useEffect, useState } from 'react'
import { LEVEL_NAMES } from '../data/questions'
import { api } from '../utils/api'

export default function LeaderboardPage({ records, user }) {
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  const totalXP = records.reduce((s, r) => s + (r.xpEarned || 0), 0)
  const level = Math.floor(totalXP / 100) + 1
  const levelName = LEVEL_NAMES[Math.min(Math.floor(totalXP / 200), LEVEL_NAMES.length - 1)]
  const initial = user?.name?.trim().charAt(0).toUpperCase() || '?'

  useEffect(() => {
    api.getLeaderboard().then(data => {
      if (data && data.length > 0) {
        setBoard(data.map(entry => ({
          ...entry,
          isYou: entry.email === user?.email,
        })))
      } else {
        // fallback: just show current user
        setBoard([{ name: user?.name || 'You', xp: totalXP, streak: 0, isYou: true }])
      }
      setLoading(false)
    })
  }, [user?.email, totalXP])

  // Merge current user's live XP into the board
  const mergedBoard = board.map(entry =>
    entry.isYou ? { ...entry, xp: totalXP } : entry
  ).sort((a, b) => b.xp - a.xp)

  const rankEmojis = ['🥇', '🥈', '🥉']

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="leaderboard-banner flex items-center px-4 gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold vs-logo-box flex-shrink-0">{initial}</div>
        <div>
          <p className="text-sm font-bold text-[#ffffff]/90">{user?.name || 'Viking'}</p>
          <p className="text-xs text-[#333333]">{levelName} · Level {level}</p>
          <p className="text-xs text-[#333333] font-semibold">{totalXP.toLocaleString()} XP</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-2">
        <h3 className="text-sm font-bold text-[#ffffff]/80 mb-3">Global Rankings</h3>
        {loading ? (
          <p className="text-xs text-[#ffffff]/50 px-2">Loading rankings…</p>
        ) : mergedBoard.map((entry, i) => (
          <div key={entry.name + i} className={`leaderboard-row flex items-center gap-3 px-4 py-3 rounded-xl ${entry.isYou ? 'border' : ''}`}
            style={entry.isYou ? { background: 'rgba(26,26,26,0.25)', border: '1px solid rgba(51,51,51,0.3)' } : { background: 'rgba(26,26,26,0.6)' }}>
            <span className="text-lg w-7 text-center flex-shrink-0">{rankEmojis[i] || `#${i + 1}`}</span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: entry.isYou ? 'rgba(45,85,100,0.5)' : 'rgba(26,26,26,0.8)', border: '1px solid rgba(51,51,51,0.3)' }}>
              {entry.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#ffffff]/90 truncate">{entry.name}{entry.isYou ? ' (You)' : ''}</p>
              {entry.streak > 0 && <p className="text-xs text-amber-500/80">🔥 {entry.streak} day streak</p>}
            </div>
            <span className="text-sm font-bold text-[#333333] flex-shrink-0">{entry.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
    </div>
  )
}
