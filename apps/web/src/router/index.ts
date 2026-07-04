import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [],
})

export default router
