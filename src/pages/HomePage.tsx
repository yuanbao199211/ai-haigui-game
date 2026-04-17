import { Eye, ShieldAlert, Sparkles } from 'lucide-react'
import { GameCard } from '../components/GameCard'
import { stories } from '../stories'

export function HomePage() {
  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-[36px] border border-[var(--panel-border)] bg-[linear-gradient(180deg,rgba(10,12,22,0.96),rgba(8,9,18,0.86))] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[12%] top-8 h-32 w-32 rounded-full bg-[rgba(148,153,255,0.10)] blur-3xl" />
          <div className="absolute right-[8%] top-12 h-28 w-28 rounded-full bg-[rgba(239,68,68,0.12)] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        </div>

        <div className="relative max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)] px-4 py-2 text-sm text-[#ffbcbc]">
            <ShieldAlert className="h-4 w-4" />
            深渊档案库已解封
          </div>

          <p className="text-xs uppercase tracking-[0.5em] text-white/30">Abyss Truth / Home</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI海龟汤
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            这里存放着数个离奇案件。阅读汤面，提出问题，在“是 / 否 / 无关”的迷雾中抽丝剥茧，直到看见真正的深渊真相。
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/60">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
              <Eye className="h-4 w-4 text-[#b388ff]" />
              神秘悬疑 · 多重反转
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
              <Sparkles className="h-4 w-4 text-[#ff6b6b]" />
              从入门到烧脑
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stories.map((story) => (
          <GameCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  )
}
