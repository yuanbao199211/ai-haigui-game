import { BookOpenText, Eye, LogOut, ScrollText } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChatBox } from '../components/ChatBox'
import { setGameEnded, setGameInProgress } from '../gameState'
import { stories } from '../stories'

export function GamePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const story = stories.find((item) => item.id === id)

  useEffect(() => {
    if (story) {
      setGameInProgress(story.id)
    }
  }, [story])

  if (!story) {
    return (
      <section className="mx-auto max-w-3xl rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[32px] sm:p-10">
        <p className="text-xs uppercase tracking-[0.42em] text-white/35">Story Not Found</p>
        <h2 className="mt-4 text-3xl text-white">档案不存在</h2>
        <p className="mt-4 leading-8 text-[var(--muted)]">
          这份深渊档案可能尚未录入，或已经被黑雾吞没。请返回大厅重新选择案件。
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

  const handleRevealTruth = () => {
    setGameEnded(story.id, 'revealed')
    navigate(`/result/${story.id}`)
  }

  const handleAbandonGame = () => {
    setGameEnded(story.id, 'abandoned')
    navigate('/')
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr] xl:gap-6">
      <aside className="overflow-hidden rounded-[28px] border border-[var(--panel-border)] bg-[linear-gradient(180deg,rgba(12,14,24,0.94),rgba(8,10,18,0.84))] shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:rounded-[32px]">
        <div className="border-b border-white/8 px-5 py-5 sm:px-7 sm:py-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(148,153,255,0.18)] bg-[rgba(148,153,255,0.08)] px-4 py-2 text-xs tracking-[0.28em] text-[#d9dcff]">
            <Eye className="h-4 w-4" />
            ABYSS FILE
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl leading-tight text-white sm:text-4xl">{story.title}</h2>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs tracking-[0.24em] text-emerald-200">
              进行中
            </span>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:space-y-6 sm:px-7 sm:py-6">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:rounded-[28px]">
            <div className="mb-3 flex items-center gap-2 text-sm text-[#ffb7b7]">
              <BookOpenText className="h-4 w-4" />
              汤面
            </div>
            <p className="leading-8 text-[var(--muted)]">{story.surface}</p>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:rounded-[28px]">
            <div className="mb-3 flex items-center gap-2 text-sm text-[#cfc4ff]">
              <ScrollText className="h-4 w-4" />
              推理提示
            </div>
            <p className="text-sm leading-7 text-white/55">
              你可以继续追问，也可以随时放弃当前局并返回大厅。
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-[72vh] flex-col gap-4 sm:min-h-[780px] sm:gap-5">
        <ChatBox story={story} />

        <div className="flex flex-col gap-3 rounded-[24px] border border-white/8 bg-[rgba(8,10,18,0.7)] p-3 backdrop-blur-xl sm:flex-row sm:flex-wrap sm:justify-end sm:gap-4 sm:rounded-[28px] sm:p-4">
          <button
            type="button"
            onClick={handleRevealTruth}
            className="interactive-lift w-full rounded-full border border-[rgba(148,153,255,0.22)] bg-[rgba(148,153,255,0.10)] px-6 py-3 text-sm font-medium text-[#e2e4ff] transition hover:bg-[rgba(148,153,255,0.16)] sm:w-auto"
          >
            查看汤底
          </button>
          <button
            type="button"
            onClick={handleAbandonGame}
            className="interactive-lift inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--danger)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#ff5a5a] sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            结束游戏
          </button>
        </div>
      </div>
    </section>
  )
}
