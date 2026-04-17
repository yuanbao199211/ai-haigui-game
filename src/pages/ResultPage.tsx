import { ArrowLeft, RotateCcw, Sparkles, WandSparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getGameState } from '../gameState'
import { stories } from '../stories'

const fallbackHistory = [
  { role: '玩家', content: '死者认识关键人物吗？' },
  { role: '深渊真相协助者', content: '是' },
  { role: '玩家', content: '异常现象和通讯设备有关吗？' },
  { role: '深渊真相协助者', content: '是' },
]

export function ResultPage() {
  const { id } = useParams<{ id: string }>()
  const story = stories.find((item) => item.id === id)
  const gameState = getGameState()
  const isCurrentStoryState = !!gameState && gameState.storyId === id
  const statusLabel = isCurrentStoryState ? (gameState.status === 'ended' ? '已结束' : '进行中') : '已结束'
  const endReasonLabel =
    isCurrentStoryState && gameState.endReason === 'abandoned' ? '玩家已中途放弃，本局已结束。' : '你已完成揭晓，真相正式归档。'

  if (!story) {
    return (
      <section className="mx-auto max-w-3xl rounded-[32px] border border-[var(--panel-border)] bg-[var(--panel)] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
        <p className="text-xs uppercase tracking-[0.42em] text-white/35">Result Not Found</p>
        <h2 className="mt-4 text-3xl text-white">无法揭晓这份档案</h2>
        <p className="mt-4 leading-8 text-[var(--muted)]">
          当前案件信息不存在，请返回大厅重新选择一局游戏。
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-[var(--danger)] px-6 py-3 text-sm font-medium text-white"
        >
          返回大厅
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="relative overflow-hidden rounded-[36px] border border-[rgba(239,68,68,0.18)] bg-[linear-gradient(180deg,rgba(24,8,10,0.92),rgba(8,8,16,0.92))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.42)] sm:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.16),transparent_32%)] animate-pulse" />
          <div className="absolute left-1/2 top-12 h-40 w-40 -translate-x-1/2 rounded-full bg-[rgba(179,136,255,0.12)] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-px w-5/6 -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.28)] to-transparent" />
        </div>

        <div className="relative text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)] px-4 py-2 text-sm text-[#ffc3c3]">
            <Sparkles className="h-4 w-4" />
            真相揭晓
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.5em] text-white/30">Abyss Truth / Result</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">{story.title}</h2>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs tracking-[0.24em] text-red-200">
              {statusLabel}
            </span>
            <span className="text-sm text-white/55">{endReasonLabel}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="relative overflow-hidden rounded-[32px] border border-[rgba(239,68,68,0.18)] bg-[linear-gradient(180deg,rgba(18,10,14,0.96),rgba(10,10,18,0.9))] p-7 shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.1),transparent_34%)]" />
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-white/[0.04] px-4 py-2 text-sm text-[#ffd8d8]">
              <WandSparkles className="h-4 w-4" />
              汤底已解封
            </div>
            <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(239,68,68,0.06))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-7">
              <p className="mb-4 text-xs uppercase tracking-[0.42em] text-white/35">Truth Archive</p>
              <p className="text-base leading-9 text-[#fff1f1] sm:text-lg">{story.bottom}</p>
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="rounded-[32px] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.42em] text-white/35">Dialogue History</p>
            <div className="mt-5 space-y-3">
              {fallbackHistory.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/30">{item.role}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.content}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-white/35">当前为示例对话记录，后续可接入真实本局聊天历史。</p>
          </section>

          <div className="flex flex-wrap gap-4 rounded-[32px] border border-white/8 bg-[rgba(8,10,18,0.72)] p-5 backdrop-blur-xl">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--danger)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#ff5a5a]"
            >
              <RotateCcw className="h-4 w-4" />
              再来一局
            </Link>
            <Link
              to={`/game/${story.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 transition hover:bg-white/8"
            >
              <ArrowLeft className="h-4 w-4" />
              返回案件
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
