import React from 'react'

export default function HeroHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 shadow-xl">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
      <div className="relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Project One Catalog
        </h1>
        <p className="mt-3 text-indigo-100/90 max-w-2xl">
          A curated list of tracks from Headhunterz, Wildstylez, and their duo alias Project One. Search, filter, and add your favorites.
        </p>
      </div>
    </header>
  )
}
