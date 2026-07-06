import { createSSRApp } from 'vue'

import App from './App.vue'
import { routeInterceptor } from './router/interceptor'
import { requestInterceptor } from './service/http/interceptor'
import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  return {
    app,
  }
}
