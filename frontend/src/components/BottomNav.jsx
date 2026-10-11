import { playUiSound } from '../utils/audio'

const TABS = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'daily',     label: 'Daily',  icon: '⚔️' },
  { id: 'leaderboard', label: 'Ranks', icon: '🏆' },
  { id: 'profile',   label: 'Profile', icon: '👤' },
]

export default function BottomNav({ page, onNavigate, soundEnabled }) {
  return (
    <nav className="flex-shrink-0 flex items-center justify-around px-2 py-2 gap-1"
      style={{ background: 'rgba(10, 10, 10,0.95)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(51, 51, 51,0.22)' }}>
      {TABS.map(tab => (
        <button key={tab.id} onClick={() => { playUiSound('nav', soundEnabled); onNavigate(tab.id) }}
          className={`nav-item flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl border border-transparent flex-1 transition-all ${page === tab.id ? 'active' : ''}`}>
          <span className="text-lg">{tab.icon}</span>
          <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
