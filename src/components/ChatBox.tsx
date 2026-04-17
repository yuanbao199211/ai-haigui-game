import { AlertCircle, LoaderCircle, RotateCcw, SendHorizonal, Sparkles, Wand2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ApiError, askAI } from '../api'
import type { Story, StoryHint } from '../stories'
import { Message, type MessageData } from './Message'

interface ChatBoxProps {
  story: Story
  initialMessages?: MessageData[]
}

const suggestionQuestions = ['这起事件和误会有关吗？', '死者其实并没有主动求救吗？', '关键线索和物品有关吗？']

function normalizeQuestion(value: string) {
  return value.replace(/[。！!？?，,、\s]/g, '').trim().toLowerCase()
}

function getHintForQuestion(question: string, story: Story, userMessageIndex: number) {
  const normalizedQuestion = normalizeQuestion(question)
  let bestHint: StoryHint | null = null
  let bestScore = 0

  for (const hint of story.hints) {
    const score = hint.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalizeQuestion(keyword)
      return normalizedKeyword && normalizedQuestion.includes(normalizedKeyword) ? total + 1 : total
    }, 0)

    if (score > bestScore) {
      bestScore = score
      bestHint = hint
    }
  }

  if (bestHint) return bestHint.text
  return story.hints[userMessageIndex % story.hints.length]?.text ?? '【线索提示】：先从题面里最反常的那个细节入手，顺着它追问。'
}

export function ChatBox({ story, initialMessages }: ChatBoxProps) {
  const [messages, setMessages] = useState<MessageData[]>(initialMessages ?? [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorMeta, setErrorMeta] = useState<{ requestId?: string; details?: string | null } | null>(null)
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  const [revealedHints, setRevealedHints] = useState<Record<number, string>>({})
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const normalizedInitialMessages = useMemo(() => initialMessages ?? [], [initialMessages])
  const hasMessages = messages.length > 0
  const statusText = isRetrying ? '正在重新连线' : isLoading ? '思维展开中' : '等待提问'

  useEffect(() => {
    setMessages(normalizedInitialMessages)
    setError(null)
    setErrorMeta(null)
    setPendingQuestion(null)
    setIsLoading(false)
    setIsRetrying(false)
    setInput('')
    setRevealedHints({})
  }, [normalizedInitialMessages, story])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, error, isLoading, revealedHints])

  const appendAssistantAnswer = (answer: string) => {
    setMessages((current) => [...current, { role: 'ai', content: answer }])
    setPendingQuestion(null)
  }

  const handleFailure = (error: unknown) => {
    const apiError = error instanceof ApiError ? error : new ApiError('连接深渊真相协助者失败，请稍后再试。')
    setError(apiError.message)
    setErrorMeta({ requestId: apiError.requestId, details: apiError.details })
  }

  const handleSend = async (nextQuestion?: string) => {
    const trimmed = (nextQuestion ?? input).trim()
    if (!trimmed || isLoading) return

    setMessages((current) => [...current, { role: 'user', content: trimmed }])
    setPendingQuestion(trimmed)
    setInput('')
    setError(null)
    setErrorMeta(null)
    setIsLoading(true)
    setIsRetrying(false)

    try {
      appendAssistantAnswer(await askAI(trimmed, story))
    } catch (error) {
      handleFailure(error)
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  const retryLastQuestion = async () => {
    if (!pendingQuestion || isLoading) return
    setError(null)
    setErrorMeta(null)
    setIsLoading(true)
    setIsRetrying(true)

    try {
      appendAssistantAnswer(await askAI(pendingQuestion, story))
    } catch (error) {
      handleFailure(error)
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  const handleRevealHint = (messageIndex: number, question: string, userMessageIndex: number) => {
    setRevealedHints((current) => current[messageIndex] ? current : { ...current, [messageIndex]: getHintForQuestion(question, story, userMessageIndex) })
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await handleSend()
    }
  }

  let userMessageCount = -1

  return (
    <section className="panel-glow flex h-[68vh] min-h-[480px] flex-col overflow-hidden rounded-[24px] border border-[var(--panel-border)] bg-[linear-gradient(180deg,rgba(10,12,22,0.96),rgba(8,10,18,0.86))] shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:h-[70vh] sm:min-h-[560px] sm:rounded-[32px]">
      <div className="border-b border-white/8 px-4 py-4 sm:px-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.42em] text-white/35">Game Room / Chat</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(179,136,255,0.2)] bg-[rgba(179,136,255,0.08)] px-3 py-1 text-[11px] tracking-[0.22em] text-[#e5d7ff]">
              <Wand2 className="h-3.5 w-3.5" />实时判定
            </div>
          </div>
          <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-[0.2em] ${isLoading ? 'pulse-ring border border-[rgba(255,255,255,0.08)] bg-white/[0.05] text-white/75' : 'border border-emerald-400/15 bg-emerald-400/10 text-emerald-200/85'}`}>
            <LoaderCircle className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />{statusText}
          </div>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">向深渊真相协助者提问，逐步接近真正的汤底。</p>
      </div>

      <div className="relative flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-5">
        {!hasMessages ? (
          <div className="empty-appear flex h-full flex-col items-center justify-center px-3 text-center">
            <div className="float-gentle mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] border border-[rgba(179,136,255,0.18)] bg-[linear-gradient(180deg,rgba(179,136,255,0.16),rgba(255,255,255,0.04))] text-[#eadfff] shadow-[0_18px_60px_rgba(0,0,0,0.24)]"><Sparkles className="h-7 w-7" /></div>
            <h3 className="text-xl text-white sm:text-2xl">深渊正在等待你的第一个问题</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">试着从人物关系、死亡方式、异常物品或时间线切入。AI 只会回答“是”、“否”或“无关”。</p>
            <div className="hide-scrollbar mt-6 flex w-full max-w-2xl snap-x gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
              {suggestionQuestions.map((question) => (
                <button key={question} type="button" onClick={() => void handleSend(question)} className="interactive-lift shrink-0 snap-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition hover:border-[rgba(179,136,255,0.25)] hover:bg-[rgba(179,136,255,0.08)] hover:text-white">{question}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const currentUserMessageIndex = message.role === 'user' ? (userMessageCount += 1) : userMessageCount
              return <Message key={`${message.role}-${index}-${message.content}`} message={message} hint={message.role === 'user' ? revealedHints[index] : undefined} onHintClick={message.role === 'user' ? () => handleRevealHint(index, message.content, currentUserMessageIndex) : undefined} />
            })}

            {isLoading ? (
              <div className="message-appear flex w-full justify-start">
                <div className="flex max-w-[96%] items-end gap-2 sm:max-w-[85%] sm:gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.10)] text-[#ff9d9d] sm:h-10 sm:w-10"><LoaderCircle className="h-4 w-4 animate-spin" /></div>
                  <div className="rounded-[22px] rounded-bl-md border border-[rgba(239,68,68,0.14)] bg-[linear-gradient(180deg,rgba(239,68,68,0.12),rgba(255,255,255,0.04))] px-4 py-3 text-[#ffe3e3] shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:rounded-[24px] sm:px-5 sm:py-4">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/35">深渊真相协助者</p>
                    <div className="flex items-center gap-3"><p className="text-sm leading-7 sm:text-[15px]">{isRetrying ? '正在重新推演答案' : '正在推演答案'}</p><div className="loading-dots flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#ffd1d1]" /><span className="h-1.5 w-1.5 rounded-full bg-[#ffd1d1]" /><span className="h-1.5 w-1.5 rounded-full bg-[#ffd1d1]" /></div></div>
                    <div className="mt-3 space-y-2"><div className="shimmer-line h-2 w-44 rounded-full sm:w-52" /><div className="shimmer-line h-2 w-28 rounded-full sm:w-36" /></div>
                  </div>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="message-appear rounded-[22px] border border-[rgba(239,68,68,0.20)] bg-[linear-gradient(180deg,rgba(239,68,68,0.12),rgba(239,68,68,0.05))] px-4 py-4 text-sm text-[#ffd4d4] sm:rounded-[24px] sm:px-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.12)]"><AlertCircle className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-[11px] uppercase tracking-[0.28em] text-white/35">连接异常</p><p className="mt-2 leading-7">{error}</p></div>
                      <button type="button" aria-label="关闭错误提示" onClick={() => { setError(null); setErrorMeta(null) }} className="interactive-lift rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/60 hover:text-white"><X className="h-3.5 w-3.5" /></button>
                    </div>
                    {errorMeta?.requestId ? <p className="mt-2 break-all text-xs leading-6 text-white/35">请求编号：{errorMeta.requestId}</p> : null}
                    {errorMeta?.details && errorMeta.details !== error ? <p className="mt-1 break-words text-xs leading-6 text-white/35">附加信息：{errorMeta.details}</p> : null}
                    {pendingQuestion ? <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => void retryLastQuestion()} className="interactive-lift inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white"><RotateCcw className="h-3.5 w-3.5" />重试刚才的问题</button></div> : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-white/8 bg-black/10 px-3 py-3 sm:px-6 sm:py-4">
        <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[28px] sm:p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} rows={2} placeholder="输入你的问题，例如：死者在案发前认识凶手吗？" className="min-h-[56px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-7 text-white outline-none placeholder:text-white/25 disabled:opacity-60" disabled={isLoading} />
            <button type="button" onClick={() => void handleSend()} className="interactive-lift inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--danger)] px-5 text-sm font-medium text-white transition hover:bg-[#ff5a5a] sm:w-auto" disabled={!input.trim() || isLoading}><SendHorizonal className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />{isLoading ? (isRetrying ? '重试中' : '发送中') : '发送'}</button>
          </div>
          <div className="mt-2 flex flex-col gap-1 px-2 pb-1 text-xs text-white/28 sm:flex-row sm:items-center sm:justify-between sm:gap-3"><span>Enter 发送，Shift + Enter 换行</span><span>每条提问都可以点开专属线索提示</span></div>
        </div>
      </div>
    </section>
  )
}
