import React from 'react'

export default function TrackList({ items }) {
  if (!items.length) {
    return (
      <div className="text-center text-slate-300 py-12 border border-dashed border-white/10 rounded-xl">
        No tracks yet. Try seeding or adding some.
      </div>
    )
  }

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((t) => (
        <li key={t.id} className="group rounded-xl bg-slate-800/60 border border-white/10 hover:border-indigo-500/40 transition-colors overflow-hidden">
          <div className="aspect-[16/9] bg-slate-900/50 relative">
            {t.cover_url ? (
              <img src={t.cover_url} alt={t.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">No cover</div>
            )}
          </div>
          <div className="p-4 space-y-1">
            <h3 className="text-white font-semibold leading-tight">{t.title}</h3>
            <p className="text-slate-300 text-sm">{t.artist} {t.year ? `• ${t.year}` : ''}</p>
            {t.notes && <p className="text-slate-400 text-sm line-clamp-2">{t.notes}</p>}
            {t.link && (
              <a href={t.link} target="_blank" rel="noreferrer" className="inline-flex text-indigo-400 hover:text-indigo-300 text-sm mt-2">Listen ↗</a>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
