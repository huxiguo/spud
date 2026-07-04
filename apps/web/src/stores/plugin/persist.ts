import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

/**
 * @description pinia 持久化参数配置
 * @param {string} key 存储到持久化的 name
 * @param {Array} pick 需要持久化的 state name
 * @return persist
 */
export function piniaPersistConfig(key: string, pick?: string[]) {
  const persist: PersistenceOptions = {
    key,
    storage: localStorage,
    // storage: sessionStorage,
    pick: pick,
  }
  return persist
}
