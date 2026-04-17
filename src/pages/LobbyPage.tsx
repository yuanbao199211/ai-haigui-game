import { Link } from 'react-router-dom'
import { ChevronRight, Search, ShieldAlert } from 'lucide-react'

const cases = [
  { title: '停尸间最后一通电话', difficulty: '进阶', tag: '职业反转' },
  { title: '凌晨四点的海面脚印', difficulty: '烧脑', tag: '空间错觉' },
  { title: '没有乘客的末班电梯', difficulty: '入门', tag: '心理误导' },
]

export function LobbyPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[32px] border border-[var(--panel-border)] bg-[var(--panel)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex items-center gap-3 text-sm text-[var(--muted)]">
          <ShieldAlert className="h-4 w-4 text-[var(--danger)]" />
          深渊档案库已载入，选择一宗案件开始推理。
        </div>

        <div className="max-w-2xl space-y-5">
          <p className="text-xs uppercase tracking-[0.5em] text-white/35">Abyss Truth / Lobby</p>
          <h2 className="font-serif text-4xl leading-tight text-white sm:text-5xl">
            用提问撬开
            <span className="bg-gradient-to-r from-[#9499ff] via-[#b388ff] to-[#ff6b6b] bg-clip-text text-transparent"> 深渊真相 </span>
          </h2>
          <p className="max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            在黑色档案馆中筛选案件，进入游戏房后通过“是 / 否 / 无关”的回答逐步逼近汤底。
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/game"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--danger)] px-6 py-3 text-sm font-medium text-white transition hover:translate-y-[-1px] hover:bg-[#ff5a5a]"
          >
            开始试玩
            <ChevronRight className="h-4 w-4" />
          </Link>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80">
            <Search className="h-4 w-4" />
            AI 动态生成案件
          </button>
        </div>
      </div>

      <aside className="rounded-[32px] border border-[var(--panel-border)] bg-[rgba(8,10,18,0.78)] p-6 backdrop-blur-xl">
        <p className="mb-5 text-xs uppercase tracking-[0.42em] text-white/35">Case Files</p>
        <div className="space-y-4">
          {cases.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-[rgba(179,136,255,0.28)] hover:bg-white/[0.05]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-[rgba(148,153,255,0.12)] px-3 py-1 text-xs text-[#c8cbff]">
                  {item.difficulty}
                </span>
                <span className="text-xs text-white/35">{item.tag}</span>
              </div>
              <h3 className="text-lg text-white">{item.title}</h3>
            </article>
          ))}
        </div>
      </aside>
    </section>
  )
}
