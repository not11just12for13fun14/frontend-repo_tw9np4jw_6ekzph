import React, { useState } from 'react'

const ARTISTS = [
  'Headhunterz',
  'Wildstylez',
  'Project One',
  'Headhunterz & Wildstylez',
]

export default function TrackForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    artist: ARTISTS[2],
    year: '',
    link: '',
    cover_url: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          artist: form.artist,
          year: form.year ? Number(form.year) : undefined,
          link: form.link || undefined,
          cover_url: form.cover_url || undefined,
          notes: form.notes || undefined,
        })
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Failed to create track')
      }
      const data = await res.json()
      onCreated?.(data)
      setForm({ title: '', artist: ARTISTS[2], year: '', link: '', cover_url: '', notes: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/60 rounded-xl p-4 border border-white/10 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-200 mb-1">Title</label>
          <input value={form.title} onChange={e=>update('title', e.target.value)} required
            className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Life Beyond Earth" />
        </div>
        <div>
          <label className="block text-sm text-slate-200 mb-1">Artist</label>
          <select value={form.artist} onChange={e=>update('artist', e.target.value)}
            className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {ARTISTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-200 mb-1">Year</label>
          <input type="number" value={form.year} onChange={e=>update('year', e.target.value)}
            className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 2008" />
        </div>
        <div>
          <label className="block text-sm text-slate-200 mb-1">Link</label>
          <input value={form.link} onChange={e=>update('link', e.target.value)}
            className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="YouTube/Spotify URL" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-200 mb-1">Cover URL</label>
          <input value={form.cover_url} onChange={e=>update('cover_url', e.target.value)}
            className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Image URL" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-200 mb-1">Notes</label>
          <textarea value={form.notes} onChange={e=>update('notes', e.target.value)} rows={3}
            className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Extra info (album, version, etc.)" />
        </div>
      </div>
      {error && <p className="text-rose-400 text-sm">{error}</p>}
      <div className="flex justify-end">
        <button disabled={loading} className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60">
          {loading ? 'Adding…' : 'Add track'}
        </button>
      </div>
    </form>
  )
}
