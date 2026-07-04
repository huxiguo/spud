export interface Point {
  x: number
  y: number
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export const DIRECTION_VECTORS: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

export const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

/** Calculate the next head position given current head and direction. */
export function getNextHead(head: Point, direction: Direction): Point {
  const vec = DIRECTION_VECTORS[direction]
  return { x: head.x + vec.x, y: head.y + vec.y }
}

/**
 * Check if the head collides with walls or the snake body.
 * The last body segment is excluded — it will move away this tick.
 */
export function checkCollision(head: Point, body: Point[], cols: number, rows: number): boolean {
  // Wall collision
  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
    return true
  }
  // Self collision (ignore last segment — it moves away)
  return body.slice(0, -1).some((p) => p.x === head.x && p.y === head.y)
}

/** Spawn food at a random unoccupied cell. Returns null if board is full. */
export function spawnFood(snake: Point[], cols: number, rows: number): Point | null {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  const available: Point[] = []
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y })
      }
    }
  }
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

/**
 * Calculate the game tick interval in ms based on score.
 * Base 150ms, -10ms for every 50 points, min 50ms.
 */
export function getSpeed(score: number): number {
  const BASE = 150
  const STEP = 10
  const MIN = 50
  const reduction = Math.floor(score / 50) * STEP
  return Math.max(MIN, BASE - reduction)
}
