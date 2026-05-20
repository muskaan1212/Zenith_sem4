'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/page-hero'
import { ExternalLink, Search } from 'lucide-react'
import { WELLNESS_ARTICLES } from '@/lib/wellness-articles'

const CATS = ['All', 'Nutrition', 'Fitness', 'Mental Health', 'Sleep', 'Stress']

export default function WellnessPage() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  const filtered = useMemo(() =>
    WELLNESS_ARTICLES.filter((a) =>
      (cat === 'All' || a.cat === cat) &&
      (a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase()))
    ), [search, cat])

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />
      <PageHero
        title="Blog"
        current="Blog"
        description="Discover a wealth of insightful health and wellness materials curated to help patients make better everyday care decisions."
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-3.5 border border-[var(--color-border)] rounded-xl text-sm bg-[var(--color-input)] focus:outline-none focus:border-[var(--color-primary)] shadow-[var(--shadow-card)]" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] rounded-xl transition-colors ${cat === c ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-soft)]' : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0
          ? <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-10 text-center shadow-[var(--shadow-card)]">No articles found. Try a different search.</p>
          : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <a
                key={a.id}
                href={a.href}
                target="_blank"
                rel="noreferrer"
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 flex flex-col gap-3 shadow-[var(--shadow-card)] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">{a.cat}</span>
                  <span className="text-xs text-[var(--color-text-light)]">{a.read} read</span>
                </div>
                <h3 className="text-[30px] leading-tight font-semibold tracking-tight text-[var(--color-foreground)]">{a.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-7 flex-1 text-pretty">{a.excerpt}</p>
                <div className="mt-1 flex items-center justify-between gap-4">
                  <span className="text-xs text-[var(--color-text-muted)]">{a.source}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)]">
                    Read Article <ExternalLink size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        }
      </main>
      <Footer />
    </div>
  )
}
