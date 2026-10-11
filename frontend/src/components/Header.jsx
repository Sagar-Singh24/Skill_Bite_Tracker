import { useState } from 'react'
import { playUiSound } from '../utils/audio'

export default function Header({ page, streak, xp, onMenuNavigate, onLogout, settings }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const PAGE_LABELS = { dashboard: 'Dashboard', daily: 'Daily Task', leaderboard: 'Leaderboard', profile: 'Profile' }

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', target: 'dashboard' },
    { icon: '⚔️', label: 'Daily Task', target: 'daily' },
    { icon: '🏆', label: 'Leaderboard', target: 'leaderboard' },
    { icon: '👤', label: 'Profile', target: 'profile' },
    { icon: '⚙️', label: 'Settings', target: 'settings' },
  ]

  function handleMenu(target) {
    playUiSound('menu', settings.sound)
    setMenuOpen(false)
    if (target === 'settings') { setSettingsOpen(true); return }
    onMenuNavigate(target)
  }

  return (
    <>
      <div className="header-glow-line flex-shrink-0" aria-hidden="true" />
      <header className="flex-shrink-0 px-4 py-3 flex items-center justify-between gap-2"
        style={{ background: 'rgba(10, 10, 10,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(51, 51, 51,0.28)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => { playUiSound(menuOpen ? 'soft' : 'open', settings.sound); setMenuOpen(v => !v) }}
            className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow flex-shrink-0 vs-logo-box transition-transform hover:scale-105 active:scale-95">
            <span className="text-lg animate-emoji-bounce-soft pointer-events-none" style={{ display: 'inline-block' }}>🪓</span>
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold font-cormorant vs-brand-gradient truncate tracking-wide">Skill Bite</h1>
            <p className="text-[10px] text-[#ffffff]/70 font-medium tracking-wider uppercase truncate">{PAGE_LABELS[page] || page}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(51, 51, 51,0.18)', border: '1px solid rgba(51, 51, 51,0.35)' }}>
              <span className="animate-streak-fire inline-block">🔥</span>
              <span className="text-sm font-bold text-amber-500/95">{streak}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(26, 26, 26,0.28)', border: '1px solid rgba(51, 51, 51,0.22)' }}>
            <span className="text-sm animate-twinkle inline-block">⚔️</span>
            <span className="text-sm font-bold text-[#ffffff]">{xp.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* App Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-y-0 left-0 w-64 animate-slide-left flex flex-col"
            style={{ background: 'rgba(26, 26, 26,0.97)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(51, 51, 51,0.35)' }}
            onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b" style={{ borderColor: 'rgba(51, 51, 51,0.2)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center vs-logo-box"><span>⛵</span></div>
                <div>
                  <p className="font-bold font-cormorant vs-brand-gradient text-base">Skill Bite</p>
                  <p className="text-[10px] text-[#ffffff]/70 italic font-cormorant">Carve your path</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {menuItems.map(item => (
                <button key={item.target} onClick={() => handleMenu(item.target)} className="app-menu-item">
                  <span>{item.icon}</span><span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-3 border-t" style={{ borderColor: 'rgba(51, 51, 51,0.2)' }}>
              <button onClick={() => { setMenuOpen(false); onLogout() }} className="app-menu-item w-full text-red-400/80">
                <span>🚪</span><span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Settings</h2>
              <button onClick={() => { playUiSound('soft', settings.sound); setSettingsOpen(false) }} className="text-[#ffffff]/70 hover:text-[#ffffff]/80 text-xl">✕</button>
            </div>
            {[
              { key: 'sound', label: 'Sound Effects', sub: 'UI click sounds' },
              { key: 'reminder', label: 'Daily Reminder', sub: 'Practice notifications' },
              { key: 'reducedMotion', label: 'Reduce Motion', sub: 'Fewer animations' },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(51, 51, 51,0.15)' }}>
                <div>
                  <p className="text-sm font-medium text-[#ffffff]/90">{label}</p>
                  <p className="text-xs text-[#ffffff]/70">{sub}</p>
                </div>
                <label className="relative cursor-pointer">
                  <input type="checkbox" className="settings-toggle-input sr-only" checked={!!settings[key]}
                    onChange={e => settings.onChange(key, e.target.checked)} />
                  <span className="settings-toggle-ui" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
