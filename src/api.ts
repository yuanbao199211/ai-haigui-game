import type { Story } from './stories'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
const API_URL = `${API_BASE_URL}/api/chat`
const REQUEST_TIMEOUT = 18000
const RETRY_DELAYS = [700, 1400, 2400]
const VALID_ANSWERS = ['是', '否', '无关'] as const

type ValidAnswer = (typeof VALID_ANSWERS)[number]

interface ErrorResponse {
  error?: {
    message?: string
    details?: string | null
    requestId?: string
  }
}

export class ApiError extends Error {
  status?: number
  requestId?: string
  details?: string | null

  constructor(message: string, options?: { status?: number; requestId?: string; details?: string | null }) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.requestId = options?.requestId
    this.details = options?.details
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function normalizeAnswer(answer: string): ValidAnswer | null {
  const normalized = answer.replace(/[。！!？?，,、\s]/g, '').trim()

  if (VALID_ANSWERS.includes(normalized as ValidAnswer)) {
    return normalized as ValidAnswer
  }

  return null
}

function buildFriendlyError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return new ApiError('提问内容或案件数据不完整，请稍后重试。', {
        status: error.status,
        requestId: error.requestId,
        details: error.details,
      })
    }

    if (error.status === 502) {
      return new ApiError('AI 判定结果异常，请换个问法继续追问。', {
        status: error.status,
        requestId: error.requestId,
        details: error.details,
      })
    }

    if ((error.status ?? 0) >= 500) {
      return new ApiError('深渊服务暂时不稳定，请稍后再试。', {
        status: error.status,
        requestId: error.requestId,
        details: error.details,
      })
    }

    return error
  }

  if (error instanceof Error && error.name === 'AbortError') {
    return new ApiError('请求超时，深渊回声没有及时返回。')
  }

  return new ApiError(error instanceof Error ? error.message : '未知网络错误。')
}

export async function askAI(question: string, story: Story): Promise<string> {
  let lastError: ApiError | null = null

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt += 1) {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          story,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        let serverError: ErrorResponse | null = null

        try {
          serverError = (await response.json()) as ErrorResponse
        } catch {
          serverError = null
        }

        throw new ApiError(serverError?.error?.message || 'AI 请求失败。', {
          status: response.status,
          requestId: serverError?.error?.requestId,
          details: serverError?.error?.details,
        })
      }

      const data = (await response.json()) as { answer?: string }
      const answer = data.answer?.trim()

      if (!answer) {
        throw new ApiError('AI 返回内容为空。', { status: 502 })
      }

      const normalizedAnswer = normalizeAnswer(answer)

      if (!normalizedAnswer) {
        throw new ApiError('AI 返回格式不符合要求。', { status: 502, details: answer })
      }

      return normalizedAnswer
    } catch (error) {
      lastError = buildFriendlyError(error)

      if (attempt < RETRY_DELAYS.length && (!lastError.status || lastError.status >= 500)) {
        await sleep(RETRY_DELAYS[attempt])
        continue
      }
    } finally {
      window.clearTimeout(timer)
    }
  }

  throw lastError ?? new ApiError('AI 请求失败。')
}
