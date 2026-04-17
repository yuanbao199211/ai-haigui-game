import { Outlet } from 'react-router-dom'
import { Skull, Sparkles } from 'lucide-react'

export function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(179,136,255,0.16)] blur-3xl" />
        <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-[rgba(239,68,68,0.14)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-8 lg:px-12">
        <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5 sm:py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(239,68,68,0.16)] text-[var(--danger)] shadow-[0_0_30px_rgba(239,68,68,0.18)]">
              <Skull className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.38em] text-white/45 sm:text-xs">THREAT LEVEL: LOW</p>
              <h1 className="truncate bg-gradient-to-r from-[#9499ff] via-[#b388ff] to-[#ff6b6b] bg-clip-text text-base font-semibold text-transparent sm:text-lg">
                AI 海龟汤：深渊真相
              </h1>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(148,153,255,0.2)] bg-[rgba(148,153,255,0.08)] px-4 py-2 text-xs text-[var(--muted)] sm:text-sm">
            <Sparkles className="h-4 w-4 text-[#b388ff]" />
            逻辑链路扫描中...
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
