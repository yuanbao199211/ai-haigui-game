import { ArrowUpRight, Ghost } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Story } from '../stories'

interface GameCardProps {
  story: Story
}

const difficultyStyles: Record<Story['difficulty'], string> = {
  入门: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  进阶: 'border-violet-400/25 bg-violet-400/10 text-violet-200',
  烧脑: 'border-red-400/25 bg-red-400/10 text-red-200',
}

export function GameCard({ story }: GameCardProps) {
  return (
    <Link
      to={`/game/${story.id}`}
      className="group relative block overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 transition duration-300 hover:-translate-y-1 hover:border-[rgba(179,136,255,0.32)] hover:bg-[linear-gradient(180deg,rgba(179,136,255,0.10),rgba(239,68,68,0.06))] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[rgba(239,68,68,0.12)] blur-2xl transition duration-300 group-hover:bg-[rgba(179,136,255,0.16)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)] text-[var(--danger)]">
            <Ghost className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs tracking-[0.24em] ${difficultyStyles[story.difficulty]}`}
              >
                {story.difficulty}
              </span>
            </div>
            <h3 className="line-clamp-2 text-lg font-medium text-white transition group-hover:text-[#f8f3ff]">
              {story.title}
            </h3>
          </div>
        </div>

        <ArrowUpRight className="h-5 w-5 shrink-0 text-white/30 transition duration-300 group-hover:text-[#ff8f8f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-white/35">
        <span className="tracking-[0.3em]">ABYSS FILE</span>
        <span className="transition duration-300 group-hover:text-white/60">点击进入推理</span>
      </div>
    </Link>
  )
}
