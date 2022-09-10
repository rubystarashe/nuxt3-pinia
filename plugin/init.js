import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createPinia } from 'pinia'
import { reactive, watch } from 'vue'
import storeModels from '#build/pinia.store.model.mjs'
import { defineStore } from '../composable'

export default defineNuxtPlugin(async nuxt => {
  const { public: { pinia: { appName, provideName } } } = useRuntimeConfig()

  const pinia = createPinia()
  nuxt[appName] = pinia
  nuxt.vueApp.use(pinia)
  nuxt[appName].stores = reactive({})

  const provide = {}
  provide[provideName] = nuxt[appName].stores

  Object.keys(storeModels).forEach(route => {
    const query = route.replace('$storeModel_', '').replace('$_default', '').replace(/\$_/g, '/')
    const state = defineStore(query, storeModels[route])
    
    if (process.client) {
      let { persist, expire, expirein, version } = typeof storeModels[route] == 'function' ? storeModels[route]() : storeModels[route]
      if (persist === true) persist = 'localStorage'
      if (persist) {
        if (expire || expirein) expire = parseInt(expire || expirein)

        const webstorageHandler = storageType => {
          if (!window[storageType]) return
          const now = new Date().getTime()
          try {
            const lastversion = window[storageType].getItem(`${query}_version`)
            const expirein = parseInt(window[storageType].getItem(`${query}_expirein`))
            if ((expirein && now > expirein) || ((lastversion || version) && lastversion != version)) {
              window[storageType].removeItem(query)
              window[storageType].removeItem(`${query}_expirein`)
              window[storageType].removeItem(`${query}_version`)
            } else state.$patch(JSON.parse(window[storageType].getItem(query)))
          } catch (e) {
            window[storageType].setItem(query, JSON.stringify(state.$state))
            if (expire) window[storageType].setItem(`${query}_expirein`, now + expire)
            if (version) window[storageType].setItem(`${query}_version`, version)
          }
          watch(state.$state, state => {
            window[storageType].setItem(query, JSON.stringify(state))
            if (expire) {
              window[storageType].setItem(`${query}_expirein`, now + expire)
            } else window[storageType].removeItem(`${query}_expirein`)
            if (version) window[storageType].setItem(`${query}_version`, version)
            else window[storageType].removeItem(`${query}_version`)
          })
          state.$persist = storageType
        }
        switch (persist.toLowerCase()) {
          case 'localstorage':
          case 'local':
            nuxt.hook('app:mounted', () => {
              webstorageHandler('localStorage')
            })
            break
          case 'sessionstorage':
          case 'session':
            nuxt.hook('app:mounted', () => {
              webstorageHandler('sessionStorage')
            })
            break
        }
      }
    }
  })

  return {
    provide
  }
})
