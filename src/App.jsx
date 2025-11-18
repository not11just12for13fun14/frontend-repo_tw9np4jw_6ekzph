import { useEffect, useMemo, useState } from 'react'
import { Check, QrCode, RefreshCw, Link as LinkIcon } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

function App() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const backend = useMemo(() => {
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    const t = url.searchParams.get('token')
    if (t) setToken(t)
  }, [])

  const fetchSongs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${backend}/api/songs`)
      if (!res.ok) throw new Error('Failed to load songs')
      const data = await res.json()
      setSongs(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  const createSession = async () => {
    try {
      setCreating(true)
      setError('')
      const res = await fetch(`${backend}/api/session/create`, { method: 'POST' })
      if (!res.ok) throw new Error('Could not create session')
      const data = await res.json()
      const newToken = data.token
      setToken(newToken)
      const url = new URL(window.location.href)
      url.searchParams.set('token', newToken)
      window.history.replaceState({}, '', url)
    } catch (e) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  const toggleSong = async (title) => {
    if (!token) return
    try {
      await fetch(`${backend}/api/songs/toggle/${encodeURIComponent(title)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      await fetchSongs()
    } catch (e) {
      setError('Failed to toggle song')
    }
  }

  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href)
    if (token) url.searchParams.set('token', token)
    return url.toString()
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Ambient background accents inspired by Project One visuals */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[36rem] h-[36rem] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <header className="flex flex-col items-center gap-4 mb-10 text-center">
          <div className="uppercase tracking-[0.35em] text-sm text-cyan-300/90">Headhunterz × Wildstylez</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Project One Setlist
          </h1>
          <p className="text-cyan-200/80 max-w-2xl">
            Check off songs the moment they’re performed. Share access with a QR code so others can help update the list in real time.
          </p>
        </header>

        {/* Session / QR */}
        <section className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-slate-900/70 border border-cyan-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Live Setlist</h2>
              <button
                onClick={fetchSongs}
                className="inline-flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 border border-white/10 px-3 py-1.5 rounded-lg transition"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-10 text-center text-cyan-200/70">Loading songs…</div>
            ) : error ? (
              <div className="py-6 text-red-300">{error}</div>
            ) : (
              <ul className="space-y-2">
                {songs.map((song) => (
                  <li key={song.title}
                      className={`group flex items-center justify-between rounded-xl border px-4 py-3 transition ${song.performed ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/10 bg-slate-800/60'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-6 w-6 rounded-md flex items-center justify-center border ${song.performed ? 'bg-emerald-500/20 border-emerald-400/50' : 'bg-slate-900/50 border-white/15'}`}>
                        {song.performed && <Check className="text-emerald-300" size={16} />}
                      </div>
                      <div className="truncate">
                        <p className={`truncate ${song.performed ? 'line-through decoration-emerald-400/70 text-emerald-200' : 'text-white'}`}>{song.title}</p>
                        <p className="text-xs text-cyan-200/70">{song.artist}{song.year ? ` • ${song.year}` : ''}</p>
                      </div>
                    </div>
                    <button
                      disabled={!token}
                      onClick={() => toggleSong(song.title)}
                      className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg border transition ${token ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/30 text-cyan-200' : 'bg-slate-900 border-white/10 text-white/40 cursor-not-allowed'}`}
                    >
                      {song.performed ? 'Undo' : 'Mark Performed'}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!token && (
              <p className="mt-4 text-xs text-cyan-200/60">Login required to cross off songs. Create a session to get a QR code others can scan.</p>
            )}
          </div>

          <div className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl p-5 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><QrCode size={18}/> Share Access</h3>
            {token ? (
              <div className="w-full flex flex-col items-center">
                <div className="bg-white p-3 rounded-xl">
                  <QRCodeCanvas value={shareUrl} size={160} level="M" includeMargin={false} />
                </div>
                <p className="text-xs text-cyan-200/70 mt-3 text-center">Scan to join this session. Everyone with the QR can toggle songs.</p>
                <div className="w-full mt-4">
                  <label className="text-xs text-cyan-200/70">Share link</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input readOnly value={shareUrl} className="flex-1 bg-slate-800/80 border border-white/10 rounded-md px-2 py-1 text-xs" />
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="inline-flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 border border-white/10 px-2 py-1 rounded-md"
                    >
                      <LinkIcon size={14}/> Copy
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-cyan-200/80 mb-4">Create a session to generate a QR code others can scan.</p>
                <button
                  onClick={createSession}
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg shadow-cyan-900/30 disabled:opacity-60"
                >
                  {creating ? 'Creating…' : 'Create Session'}
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="text-center text-xs text-cyan-200/60">
          Theme inspired by Project One • Built for quick, clean live set tracking
        </footer>
      </div>
    </div>
  )
}

export default App
