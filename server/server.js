import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import crypto from 'node:crypto'

const app = express()
const PORT = Number(process.env.PORT || 3001)
const HOST = process.env.HOST || 'localhost'
const OPENAI_COMPAT_API_KEY = process.env.OPENAI_COMPAT_API_KEY || process.env.DEEPSEEK_API_KEY
const OPENAI_COMPAT_BASE_URL = process.env.OPENAI_COMPAT_BASE_URL || 'https://api.deepseek.com'
const OPENAI_COMPAT_MODEL = process.env.OPENAI_COMPAT_MODEL || 'deepseek-chat'
const CHAT_COMPLETIONS_URL = `${OPENAI_COMPAT_BASE_URL.replace(/\/$/, '')}/chat/completions`
const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']
const VALID_ANSWERS = ['是', '否', '无关']

class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.details = details
  }
}

function truncateText(value, maxLength = 320) {
  if (!value || typeof value !== 'string') return value
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value
}

function maskSecrets(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer ***')
    .replace(/"?(api[_-]?key|authorization)"?\s*:\s*"[^"]+"/gi, '"$1":"***"')
}

function sanitizeForLog(value, depth = 0) {
  if (value == null) return value
  if (depth > 3) return '[MaxDepth]'
  if (typeof value === 'string') return maskSecrets(truncateText(value))
  if (Array.isArray(value)) return value.slice(0, 8).map((item) => sanitizeForLog(item, depth + 1))
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 12)
        .map(([key, item]) => {
          const normalizedKey = key.toLowerCase()
          if (normalizedKey.includes('key') || normalizedKey.includes('token') || normalizedKey.includes('secret')) {
            return [key, '***']
          }
          return [key, sanitizeForLog(item, depth + 1)]
        }),
    )
  }
  return value
}

function sendJson(res, payload) {
  if (!res.headersSent) {
    res.json(payload)
  }
}

app.use((req, res, next) => {
  req.requestId = crypto.randomUUID().slice(0, 8)
  req.startTime = Date.now()
  res.setHeader('X-Request-Id', req.requestId)
  next()
})

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.use((req, res, next) => {
  const startedAt = new Date().toISOString()
  const bodyPreview =
    req.method === 'POST' && req.body && Object.keys(req.body).length > 0 ? sanitizeForLog(req.body) : null

  console.log(
    `[${startedAt}] [${req.requestId}] -> ${req.method} ${req.originalUrl}${bodyPreview ? ` body=${JSON.stringify(bodyPreview)}` : ''}`,
  )

  res.on('finish', () => {
    const duration = Date.now() - req.startTime
    console.log(`[${new Date().toISOString()}] [${req.requestId}] <- ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`)
  })

  next()
})

function buildPrompt(question, story) {
  return [
    '你是“深渊真相协助者”，负责主持海龟汤推理游戏。',
    '你必须严格只回答：是、否、无关。',
    '不要解释，不要补充，不要泄露汤底。',
    '',
    `案件标题：${story.title}`,
    `汤面：${story.surface}`,
    `汤底：${story.bottom}`,
    '',
    `玩家问题：${question}`,
    '',
    '请只输出一个词：是、否、无关。',
  ].join('\n')
}

function normalizeAnswer(answer) {
  const normalized = answer.replace(/[。！!？?，,、\s]/g, '').trim()
  return VALID_ANSWERS.includes(normalized) ? normalized : null
}

function validateStory(story) {
  if (!story || typeof story !== 'object') {
    throw new HttpError(400, '缺少有效的 story 参数。')
  }

  const requiredFields = ['title', 'surface', 'bottom']
  const missingField = requiredFields.find((field) => typeof story[field] !== 'string' || !story[field].trim())

  if (missingField) {
    throw new HttpError(400, `story.${missingField} 必须是非空字符串。`)
  }
}

app.get('/', (_req, res) => {
  sendJson(res, {
    message: 'AI 海龟汤后端服务运行中',
    endpoints: {
      root: 'GET /',
      test: 'GET /api/test',
      docs: 'GET /api/docs',
      chat: 'POST /api/chat',
    },
  })
})

app.get('/api/test', (req, res) => {
  sendJson(res, {
    message: '后端服务运行正常',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  })
})

app.get('/api/docs', (_req, res) => {
  sendJson(res, {
    name: 'AI 海龟汤 API',
    version: '1.2.0',
    baseUrl: `http://${HOST}:${PORT}`,
    description: '提供健康检查、接口文档以及海龟汤 AI 判定服务。',
    commonResponseHeaders: {
      'X-Request-Id': '每次请求都会返回一个请求编号，方便排查错误。',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: '服务状态与可用接口概览。',
        responseExample: {
          message: 'AI 海龟汤后端服务运行中',
          endpoints: {
            root: 'GET /',
            test: 'GET /api/test',
            docs: 'GET /api/docs',
            chat: 'POST /api/chat',
          },
        },
      },
      {
        method: 'GET',
        path: '/api/test',
        description: '健康检查接口。',
        responseExample: {
          message: '后端服务运行正常',
          timestamp: '2026-04-17T12:00:00.000Z',
          requestId: 'a1b2c3d4',
        },
      },
      {
        method: 'GET',
        path: '/api/docs',
        description: '返回当前所有接口的说明文档。',
      },
      {
        method: 'POST',
        path: '/api/chat',
        description: '向 AI 判定器发起一次问答请求。',
        requestBody: {
          question: '这起事件和误会有关吗？',
          story: {
            title: '停尸间最后一通电话',
            surface: '守夜人半夜在停尸间接到一通电话……',
            bottom: '死者并没有真的打来电话……',
          },
        },
        responseExample: {
          answer: '是',
        },
        errorExample: {
          error: {
            message: 'story.bottom 必须是非空字符串。',
            details: null,
            requestId: 'a1b2c3d4',
          },
        },
        notes: ['AI 只允许返回：是、否、无关。', '当上游模型返回异常格式时，接口会返回 502。'],
      },
    ],
  })
})

app.post('/api/chat', async (req, res, next) => {
  const { question, story } = req.body ?? {}

  try {
    if (!question || typeof question !== 'string' || !question.trim()) {
      throw new HttpError(400, '缺少有效的 question 参数。')
    }

    validateStory(story)

    if (!OPENAI_COMPAT_API_KEY) {
      throw new HttpError(500, '未配置 OPENAI_COMPAT_API_KEY 或 DEEPSEEK_API_KEY。')
    }

    const response = await fetch(CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_COMPAT_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_COMPAT_MODEL,
        messages: [
          {
            role: 'user',
            content: buildPrompt(question.trim(), story),
          },
        ],
        temperature: 0,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new HttpError(response.status, 'OpenAI 兼容接口请求失败。', truncateText(maskSecrets(errorText), 600))
    }

    const data = await response.json()
    const rawAnswer = data?.choices?.[0]?.message?.content?.trim()

    if (!rawAnswer) {
      throw new HttpError(502, '模型返回内容为空。')
    }

    const normalizedAnswer = normalizeAnswer(rawAnswer)

    if (!normalizedAnswer) {
      throw new HttpError(502, '模型返回格式不符合要求。', truncateText(rawAnswer, 120))
    }

    return sendJson(res, { answer: normalizedAnswer })
  } catch (error) {
    next(error)
  }
})

app.use((req, _res, next) => {
  next(new HttpError(404, `未找到接口：${req.method} ${req.originalUrl}`))
})

app.use((error, req, res, _next) => {
  const status = error instanceof HttpError ? error.status : 500
  const message = error instanceof Error ? error.message : '未知服务器错误。'
  const details = error instanceof HttpError ? error.details : undefined

  console.error(
    `[${new Date().toISOString()}] [${req.requestId}] !! ${message}${details ? ` details=${JSON.stringify(sanitizeForLog(details))}` : ''}`,
  )

  sendJson(res.status(status), {
    error: {
      message,
      details: details ?? null,
      requestId: req.requestId,
    },
  })
})

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
  console.log(`API docs available at http://${HOST}:${PORT}/api/docs`)
})
