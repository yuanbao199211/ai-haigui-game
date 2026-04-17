import { Ghost, Lightbulb, UserRound } from 'lucide-react'

export interface MessageData {
  role: 'user' | 'ai'
  content: string
}

interface MessageProps {
  message: MessageData
  hint?: string
  onHintClick?: () => void
}

export function Message({ message, hint, onHintClick }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-appear flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[96%] items-end gap-2 sm:max-w-[85%] sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <div
          className={`avatar-bob flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10 ${
            isUser
              ? 'border-[rgba(148,153,255,0.26)] bg-[rgba(148,153,255,0.12)] text-[#d9dcff]'
              : 'border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.10)] text-[#ff9d9d]'
          }`}
        >
          {isUser ? <UserRound className="h-4 w-4" /> : <Ghost className="h-4 w-4" />}
        </div>

        <div className="max-w-full">
          <div
            className={`interactive-lift rounded-[22px] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:rounded-[24px] sm:px-5 sm:py-4 ${
              isUser
                ? 'rounded-br-md border border-[rgba(148,153,255,0.16)] bg-[linear-gradient(180deg,rgba(148,153,255,0.16),rgba(148,153,255,0.08))] text-white'
                : 'rounded-bl-md border border-[rgba(239,68,68,0.14)] bg-[linear-gradient(180deg,rgba(239,68,68,0.12),rgba(255,255,255,0.04))] text-[#ffe3e3]'
            }`}
          >
            <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/35">{isUser ? '玩家' : '深渊真相协助者'}</p>
            <p className="break-words text-sm leading-7 sm:text-[15px]">{message.content}</p>
          </div>

          {isUser ? (
            <div className="mt-2 flex justify-end">
              {hint ? (
                <div className="max-w-[420px] rounded-[18px] border border-[rgba(255,208,92,0.18)] bg-[linear-gradient(180deg,rgba(255,208,92,0.12),rgba(255,255,255,0.03))] px-4 py-3 text-left text-sm leading-7 text-[#ffe9c6] shadow-[0_12px_36px_rgba(0,0,0,0.18)]">
                  <div className="mb-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#ffe0a3]/75">
                    <Lightbulb className="h-3.5 w-3.5" />
                    线索提示
                  </div>
                  <p>{hint}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onHintClick}
                  className="interactive-lift inline-flex items-center gap-2 rounded-full border border-[rgba(255,208,92,0.22)] bg-[rgba(255,208,92,0.08)] px-3 py-1.5 text-xs font-medium text-[#ffe3a3] transition hover:bg-[rgba(255,208,92,0.14)]"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  查看线索提示
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
