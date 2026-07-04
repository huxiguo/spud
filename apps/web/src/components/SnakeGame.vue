<script setup lang="ts">
import { useEventListener, useRafFn, useLocalStorage } from '@vueuse/core'
import { ref, nextTick } from 'vue'

import {
  getNextHead,
  checkCollision,
  spawnFood,
  getSpeed,
  OPPOSITE,
  type Point,
  type Direction,
} from '@/lib/snake-game'

const emit = defineEmits<{
  close: []
}>()

// ── Grid constants ──
const COLS = 20
const ROWS = 20
const CELL = 20
const CANVAS_W = COLS * CELL
const CANVAS_H = ROWS * CELL

// ── Canvas refs ──
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const bgCanvas = ref<HTMLCanvasElement | null>(null)

// ── Game state ──
type GameState = 'playing' | 'paused' | 'dead'
const gameState = ref<GameState>('playing')
const snake = ref<Point[]>([
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
])
const direction = ref<Direction>('RIGHT')
const nextDirection = ref<Direction>('RIGHT')
const food = ref<Point>({ x: 15, y: 10 })
const score = ref(0)
const highScore = useLocalStorage('snake-high-score', 0)

// ── Timing ──
let lastTick = 0

// ── Matrix rain state ──
const MATRIX_CHARS = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF'
interface Drop {
  x: number
  y: number
  speed: number
  length: number
  chars: string[]
}
let drops: Drop[] = []

// ── Drawing helpers ──

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)'
  ctx.lineWidth = 0.5
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath()
    ctx.moveTo(x * CELL, 0)
    ctx.lineTo(x * CELL, CANVAS_H)
    ctx.stroke()
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * CELL)
    ctx.lineTo(CANVAS_W, y * CELL)
    ctx.stroke()
  }
}

function drawSnake(ctx: CanvasRenderingContext2D) {
  snake.value.forEach((seg, i) => {
    const isHead = i === 0
    ctx.fillStyle = isHead ? '#0fff5f' : '#00cc44'
    ctx.shadowBlur = isHead ? 8 : 4
    ctx.shadowColor = '#00ff41'
    ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
    ctx.shadowBlur = 0
  })
}

function drawFood(ctx: CanvasRenderingContext2D, time: number) {
  const cx = food.value.x * CELL + CELL / 2
  const cy = food.value.y * CELL + CELL / 2
  const pulse = 1 + 0.15 * Math.sin(time / 200)
  const r = (CELL / 2 - 2) * pulse

  ctx.shadowBlur = 12
  ctx.shadowColor = '#ff0044'
  ctx.fillStyle = '#ff0044'
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Inner glow
  ctx.fillStyle = '#ff6688'
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2)
  ctx.fill()
}

function drawScanlines(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
  for (let y = 0; y < CANVAS_H; y += 3) {
    ctx.fillRect(0, y, CANVAS_W, 1)
  }
}

// ── Render ──

function render(timestamp: number) {
  const canvas = gameCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  drawGrid(ctx)
  drawFood(ctx, timestamp)
  drawSnake(ctx)
  drawScanlines(ctx)

  // Border glow
  ctx.strokeStyle = '#00ff41'
  ctx.lineWidth = 2
  ctx.shadowBlur = 10
  ctx.shadowColor = '#00ff41'
  ctx.strokeRect(0, 0, CANVAS_W, CANVAS_H)
  ctx.shadowBlur = 0
}

// ── Game loop (driven by useRafFn) ──

function gameLoop({ timestamp }: { delta: number; timestamp: number }) {
  if (gameState.value !== 'playing') {
    render(timestamp)
    return
  }

  const speed = getSpeed(score.value)
  if (timestamp - lastTick < speed) {
    render(timestamp)
    return
  }
  lastTick = timestamp

  // Apply buffered direction
  direction.value = nextDirection.value

  // Move
  const head = getNextHead(snake.value[0], direction.value)

  // Check collision
  if (checkCollision(head, snake.value, COLS, ROWS)) {
    gameState.value = 'dead'
    if (score.value > highScore.value) {
      highScore.value = score.value
    }
    render(timestamp)
    return
  }

  // Add new head
  const newSnake = [head, ...snake.value]

  // Eat food?
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    const newFood = spawnFood(newSnake, COLS, ROWS)
    if (newFood) food.value = newFood
    snake.value = newSnake // don't pop tail → snake grows
  } else {
    newSnake.pop() // remove tail
    snake.value = newSnake
  }

  render(timestamp)
}

// ── Matrix rain background (driven by useRafFn) ──

function initDrops(width: number) {
  drops = []
  const colCount = Math.floor(width / 16)
  for (let i = 0; i < colCount; i++) {
    drops.push({
      x: i * 16,
      y: -(Math.random() * 400),
      speed: 1 + Math.random() * 3,
      length: 5 + Math.floor(Math.random() * 15),
      chars: Array.from(
        { length: 20 },
        () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
      ),
    })
  }
}

function drawMatrixRain() {
  const canvas = bgCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Fade trail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = '14px monospace'

  for (const drop of drops) {
    // Head (bright)
    ctx.fillStyle = '#e0ffe0'
    ctx.fillText(drop.chars[0], drop.x, drop.y)

    // Trail (fading)
    for (let i = 1; i < drop.length; i++) {
      const alpha = 1 - i / drop.length
      ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.5})`
      ctx.fillText(drop.chars[i % drop.chars.length], drop.x, drop.y - i * 18)
    }

    // Move
    drop.y += drop.speed

    // Change head char occasionally
    if (Math.random() < 0.02) {
      drop.chars.unshift(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)])
      drop.chars.pop()
    }

    // Reset when off screen
    if (drop.y > canvas.height + 50) {
      drop.y = -(Math.random() * 200)
      drop.speed = 1 + Math.random() * 3
    }
  }
}

// ── Input handling ──

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
}

function onKeyDown(e: KeyboardEvent) {
  const dir = KEY_MAP[e.key]
  if (dir && gameState.value === 'playing') {
    if (dir !== OPPOSITE[nextDirection.value]) {
      nextDirection.value = dir
    }
    e.preventDefault()
    return
  }

  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault()
    if (gameState.value === 'playing') {
      gameState.value = 'paused'
    } else if (gameState.value === 'paused') {
      gameState.value = 'playing'
      lastTick = performance.now()
    }
    return
  }

  if ((e.key === 'r' || e.key === 'R') && gameState.value === 'dead') {
    restart()
    return
  }

  if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') {
    emit('close')
  }
}

function restart() {
  snake.value = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]
  direction.value = 'RIGHT'
  nextDirection.value = 'RIGHT'
  score.value = 0
  const newFood = spawnFood(snake.value, COLS, ROWS)
  if (newFood) food.value = newFood
  gameState.value = 'playing'
  lastTick = performance.now()
}

// ── Lifecycle (VueUse handles auto cleanup) ──

useEventListener(window, 'keydown', onKeyDown)

useEventListener(window, 'resize', () => {
  const bg = bgCanvas.value
  if (bg) {
    bg.width = window.innerWidth
    bg.height = window.innerHeight
    initDrops(bg.width) // re-init drops for new width
  }
})

// Start the two animation loops
useRafFn(gameLoop)
useRafFn(drawMatrixRain)

// Init matrix rain on next tick (after template refs are available)
nextTick(() => {
  if (bgCanvas.value) {
    bgCanvas.value.width = window.innerWidth
    bgCanvas.value.height = window.innerHeight
    initDrops(bgCanvas.value.width)
  }
  lastTick = performance.now()
})
</script>

<template>
  <div class="snake-overlay">
    <!-- Matrix rain background -->
    <canvas ref="bgCanvas" class="matrix-bg" />

    <!-- Game container -->
    <div class="game-container">
      <!-- Score bar -->
      <div class="score-bar">
        <span class="score-label">SCORE:{{ String(score).padStart(6, '0') }}</span>
        <span class="score-label">HI:{{ String(highScore).padStart(6, '0') }}</span>
      </div>

      <!-- Game canvas -->
      <div class="canvas-wrapper">
        <canvas ref="gameCanvas" :width="CANVAS_W" :height="CANVAS_H" class="game-canvas" />

        <!-- Game state overlays -->
        <div v-if="gameState === 'paused'" class="state-overlay">
          <span class="state-text">PAUSED</span>
          <span class="state-hint">Press SPACE to continue</span>
        </div>

        <div v-if="gameState === 'dead'" class="state-overlay">
          <span class="state-text dead-text">GAME OVER</span>
          <span class="final-score">SCORE: {{ score }}</span>
          <div class="restart-hints">
            <span>R — Restart</span>
            <span>ESC — Exit</span>
          </div>
        </div>
      </div>

      <!-- Controls hint -->
      <div class="controls-hint">
        <span>↑↓←→ / WASD</span>
        <span>SPACE pause</span>
        <span>ESC exit</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snake-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
  font-family: 'Courier New', 'Source Code Pro', monospace;
}

.matrix-bg {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  pointer-events: none;
}

.game-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.score-bar {
  display: flex;
  justify-content: space-between;
  width: 400px;
  color: #00ff41;
  font-size: 16px;
  letter-spacing: 2px;
}

.score-label {
  text-shadow: 0 0 8px rgba(0, 255, 65, 0.6);
}

.canvas-wrapper {
  position: relative;
  line-height: 0;
}

.game-canvas {
  display: block;
}

.state-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.75);
}

.state-text {
  font-size: 36px;
  color: #00ff41;
  letter-spacing: 8px;
  text-shadow: 0 0 16px rgba(0, 255, 65, 0.8);
}

.dead-text {
  color: #ff0044;
  text-shadow: 0 0 16px rgba(255, 0, 68, 0.8);
}

.final-score {
  font-size: 24px;
  color: #00ff41;
  letter-spacing: 4px;
}

.state-hint {
  font-size: 14px;
  color: rgba(0, 255, 65, 0.6);
  letter-spacing: 2px;
}

.restart-hints {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: rgba(0, 255, 65, 0.6);
  letter-spacing: 2px;
}

.controls-hint {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: rgba(0, 255, 65, 0.35);
  letter-spacing: 1px;
}
</style>
