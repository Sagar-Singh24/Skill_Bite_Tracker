let audioCtx = null

function getAudioContext() {
  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) return null
  if (!audioCtx) audioCtx = new Ctor()
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {})
  return audioCtx
}

export function playUiSound(kind = 'menu', soundEnabled = true) {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    const t = ctx.currentTime
    const master = ctx.createGain()
    master.gain.value = 0.92
    const shelf = ctx.createBiquadFilter()
    shelf.type = 'lowshelf'; shelf.frequency.value = 220; shelf.gain.value = 5
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'; tone.frequency.value = 2400; tone.Q.value = 0.6
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14; comp.knee.value = 20; comp.ratio.value = 4
    comp.attack.value = 0.002; comp.release.value = 0.1
    master.connect(shelf); shelf.connect(tone); tone.connect(comp); comp.connect(ctx.destination)

    const presets = {
      open:  { sub:82, subG:0.72, f0:320, f1:95,  ms:72, body:0.62, nF:520, nQ:2.4, nG:0.48, nMs:22 },
      nav:   { sub:76, subG:0.62, f0:280, f1:102, ms:58, body:0.55, nF:460, nQ:2.6, nG:0.42, nMs:18 },
      menu:  { sub:78, subG:0.64, f0:290, f1:98,  ms:60, body:0.57, nF:480, nQ:2.5, nG:0.44, nMs:19 },
      tap:   { sub:80, subG:0.58, f0:340, f1:105, ms:52, body:0.54, nF:620, nQ:2.2, nG:0.46, nMs:16 },
      soft:  { sub:68, subG:0.42, f0:235, f1:88,  ms:44, body:0.38, nF:400, nQ:2.8, nG:0.28, nMs:14 },
    }
    const p = presets[kind] || presets.menu
    const dur = p.ms / 1000; const fEnd = Math.max(p.f1, 55); const nDur = p.nMs / 1000

    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.setValueAtTime(p.sub, t)
    const gSub = ctx.createGain(); gSub.gain.setValueAtTime(0.001, t); gSub.gain.linearRampToValueAtTime(p.subG, t+0.005); gSub.gain.exponentialRampToValueAtTime(0.001, t+0.12)
    sub.connect(gSub); gSub.connect(master)

    const body = ctx.createOscillator(); body.type = 'triangle'; body.frequency.setValueAtTime(p.f0, t); body.frequency.exponentialRampToValueAtTime(fEnd, t+dur)
    const gBody = ctx.createGain(); gBody.gain.setValueAtTime(p.body, t); gBody.gain.exponentialRampToValueAtTime(0.001, t+dur+0.03)
    body.connect(gBody); gBody.connect(master)

    const nLen = Math.ceil(ctx.sampleRate * 0.06); const nBuf = ctx.createBuffer(1, nLen, ctx.sampleRate)
    const nData = nBuf.getChannelData(0); for (let i=0;i<nLen;i++) nData[i]=Math.random()*2-1
    const noise = ctx.createBufferSource(); noise.buffer = nBuf
    const bpf = ctx.createBiquadFilter(); bpf.type='bandpass'; bpf.frequency.value=p.nF; bpf.Q.value=p.nQ
    const gN = ctx.createGain(); gN.gain.setValueAtTime(0.001,t); gN.gain.linearRampToValueAtTime(p.nG,t+0.002); gN.gain.exponentialRampToValueAtTime(0.001,t+nDur)
    noise.connect(bpf); bpf.connect(gN); gN.connect(master)

    sub.start(t); sub.stop(t+0.14); body.start(t); body.stop(t+dur+0.05); noise.start(t); noise.stop(t+nDur+0.012)
  } catch (e) { /* ignore */ }
}
