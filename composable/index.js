import { storeToRefs as _storeToRefs, defineStore as _defineStore } from 'pinia'
import { useRuntimeConfig, useNuxtApp } from '#app'

export const storeToRefs = _storeToRefs

export const getStore = storeName => {
  try {
    const { public: { pinia: { provideName } } } = useRuntimeConfig()
    const $pinia = useNuxtApp()[`$${provideName}`]
    const store = $pinia[storeName]()
    store.toRefs = () => storeToRefs(store)
    return store
  } catch (error) {
    if (process?.dev) console.error(`[store api] The store name ${storeName} has not been declared, it insteadly declared from getter method. Please check the store specification.`, error)
    const store = defineStore(storeName, {
      state: () => {
        return {}
      }
    })()
    store.toRefs = () => storeToRefs(store)
    return store
  }
}
export const store = getStore

export const getStoreRefs = storeName => {
  try {
    const { public: { pinia: { provideName } } } = useRuntimeConfig()
    const $pinia = useNuxtApp()[`$${provideName}`]
    return storeToRefs($pinia[storeName]())
  } catch (error) {
    if (process?.dev) console.error(`[store api] The store name ${storeName} has not been declared, it insteadly declared from getter method. Please check the store specification.`, error)
    const store = defineStore(storeName, {
      state: () => {
        return {}
      }
    })
    return storeToRefs(store())
  }
}

export const defineStore = (name, option) => {
  const { public: { pinia: { appName } } } = useRuntimeConfig()
  const pinia = useNuxtApp()[`${appName}`]
  pinia.stores[name] = _defineStore(name, option)
  const store = pinia.stores[name]()
  store.toRefs = () => storeToRefs(store)
  return store
}
