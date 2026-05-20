import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/page-hero'
import { BACKEND_SYLLABUS } from '@/lib/backend-syllabus'

const STATUS_STYLES = {
  Implemented: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
  Partial: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
  Conceptual: 'bg-[var(--color-accent)]/12 text-[var(--color-accent)]',
  'Not Implemented': 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
  Added: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
}

export const metadata = {
  title: 'Backend Syllabus | Zenith Healthcare',
  description: 'Backend evaluation syllabus aligned with the topics currently reflected in the project folder.',
}

export default function BackendSyllabusPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />
      <PageHero
        title="Backend Evaluation"
        current="Syllabus"
        description="This page includes only the topics from your backend evaluation syllabus. Extra project-only checklist items were left out, and evaluation milestones were added into the syllabus flow."
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

        <div className="grid gap-4">
          {BACKEND_SYLLABUS.map((item) => (
            <section key={`${item.lectureRange}-${item.topic}`} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 shadow-[var(--shadow-card)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="max-w-4xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] mb-2">
                    {item.lectureRange === 'Evaluation' ? 'Project Evaluation' : `Lecture ${item.lectureRange}`}
                  </p>
                  <h2 className="font-serif text-xl font-medium text-[var(--color-foreground)] leading-snug">{item.topic}</h2>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.notes}</p>
                </div>
                <span className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[item.status]}`}>
                  {item.status}
                </span>
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
