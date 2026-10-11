import { useEffect, useState } from 'react'

const listeners = new Set()

export function showToast(message, type = 'info') {
  listeners.forEach(fn => fn(message, type))
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    function handler(message, type) {
      const id = Date.now() + Math.random()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800)
    }
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])

  const colors  = { success: 'rgba(34,197,94,0.2)',   error: 'rgba(239,68,68,0.2)',  info: 'rgba(26, 26, 26,0.35)' }
  const borders = { success: 'rgba(34,197,94,0.3)',   error: 'rgba(239,68,68,0.3)',  info: 'rgba(51, 51, 51,0.45)' }

  return (
    <div className="fixed top-4 left-4 right-4 z-[200] space-y-2 pointer-events-none max-w-md mx-auto">
      {toasts.map(t => (
        <div key={t.id}
          className="px-4 py-3 rounded-xl text-sm font-medium animate-slide-up"
          style={{ background: colors[t.type], border: `1px solid ${borders[t.type]}`, backdropFilter: 'blur(10px)', color: '#ffffff' }}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
