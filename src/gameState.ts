export type GameStatus = 'in_progress' | 'ended'
export type GameEndReason = 'revealed' | 'abandoned' | null

export interface GameState {
  storyId: string
  status: GameStatus
  endReason: GameEndReason
  updatedAt: number
}

const STORAGE_KEY = 'ai-haigui-game-state'

export function getGameState(): GameState | null {
  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as GameState
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function setGameInProgress(storyId: string) {
  const nextState: GameState = {
    storyId,
    status: 'in_progress',
    endReason: null,
    updatedAt: Date.now(),
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  return nextState
}

export function setGameEnded(storyId: string, endReason: Exclude<GameEndReason, null>) {
  const nextState: GameState = {
    storyId,
    status: 'ended',
    endReason,
    updatedAt: Date.now(),
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  return nextState
}

export function clearGameState() {
  window.localStorage.removeItem(STORAGE_KEY)
}
