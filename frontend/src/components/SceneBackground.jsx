export default function SceneBackground() {
  return (
    <>
      <div className="vs-scene" aria-hidden="true">
        <div className="vs-photo vs-photo--hero" />
        <div className="vs-scene-bloom" />
        <div className="vs-scene-vignette" />
        <div className="vs-scene-aurora" />
        <div className="vs-scene-grad" />
        <div className="vs-scene-noise" />
      </div>
      <div className="app-bg" aria-hidden="true">
        <div className="orb-bg" style={{ width:420,height:420,background:'#1a1a1a',top:-110,left:-90 }} />
        <div className="orb-bg orb-bg--slow" style={{ width:380,height:380,background:'#0a0a0a',bottom:-100,right:-80 }} />
        <div className="orb-bg orb-bg--pink" style={{ width:280,height:280,background:'#0a0a0a',top:'42%',left:'50%',transform:'translate(-50%,-50%)' }} />
        <div className="orb-bg" style={{ width:240,height:240,background:'#333333',top:'58%',left:'4%',opacity:0.09 }} />
        <div className="orb-bg orb-bg--slow" style={{ width:320,height:320,background:'#1a1a1a',top:'8%',right:'10%',opacity:0.16 }} />
      </div>
      <div className="fixed inset-0 grid-pattern pointer-events-none z-[1]" style={{ opacity:0.22 }} aria-hidden="true" />
      <div className="emoji-float-layer" aria-hidden="true">
        {[
          ['⛵','6%','14%','animate-emoji-drift'],['🪓','10%','42%','animate-emoji-drift-delayed'],
          ['🛡️','78%','10%','animate-emoji-bounce-soft'],['⚔️','86%','28%','animate-twinkle'],
          ['🌊','68%','46%','animate-emoji-spin-slow'],['❄️','3%','56%','animate-emoji-drift'],
          ['🦅','48%','5%','animate-emoji-bounce-soft'],['⚓','32%','68%','animate-emoji-drift-delayed'],
          ['🐺','92%','62%','animate-twinkle'],['🗡️','18%','78%','animate-emoji-drift'],
          ['🏔️','54%','34%','animate-emoji-bounce-soft'],['⛰️','40%','18%','animate-emoji-spin-slow'],
        ].map(([emoji, left, top, anim]) => (
          <span key={emoji+left} className={`emoji-float ${anim}`} style={{ left, top }}>{emoji}</span>
        ))}
      </div>
    </>
  )
}
