<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'

import SnakeGame from '@/components/SnakeGame.vue'

const showGame = ref(false)

function toggleGame() {
  showGame.value = !showGame.value
}

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if ((e.key === 'g' || e.key === 'G') && !showGame.value) {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
    showGame.value = true
  }
})
</script>

<template>
  <!-- Existing page content goes here -->
  <div class="min-h-screen bg-black text-white flex items-center justify-center">
    <p class="text-green-400 font-mono text-lg">
      Welcome — press
      <kbd class="px-2 py-0.5 border border-green-500/30 rounded text-green-300 bg-green-950/50"
        >G</kbd
      >
      to play Snake
    </p>
  </div>

  <!-- Neon trigger button -->
  <button class="snake-trigger" title="Play Snake (G)" @click="toggleGame">&gt;_</button>

  <!-- Game overlay -->
  <SnakeGame v-if="showGame" @close="showGame = false" />
</template>

<style>
.snake-trigger {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9998;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 65, 0.4);
  background: rgba(0, 0, 0, 0.85);
  color: #00ff41;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 0 8px rgba(0, 255, 65, 0.6);
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.15);
  transition: all 0.3s ease;
  animation: snakeFloat 3s ease-in-out infinite;
}

.snake-trigger:hover {
  border-color: rgba(0, 255, 65, 0.8);
  box-shadow:
    0 0 20px rgba(0, 255, 65, 0.35),
    0 0 40px rgba(0, 255, 65, 0.1);
  text-shadow: 0 0 12px rgba(0, 255, 65, 0.9);
  transform: scale(1.08);
}

@keyframes snakeFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
