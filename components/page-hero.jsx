import Link from 'next/link'

export default function PageHero({ title, description, current, ctaLabel, ctaHref }) {
  return (
    <section className="bg-[var(--color-hero)] border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-3xl mx-auto text-base md:text-lg leading-8 text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-[var(--color-text-muted)]">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
            Home
          </Link>
          <span>&rsaquo;</span>
          <span className="text-[var(--color-foreground)]">{current || title}</span>
        </div>
        {ctaHref && ctaLabel && (
          <div className="mt-8">
            <Link
              href={ctaHref}
              className="inline-flex items-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:bg-[var(--color-primary-light)]"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
