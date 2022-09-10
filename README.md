# nuxt3 pinia

A nuxt3 module that helps you easily and powerfully use the Pinia state repository.
Provides state value preservation through web storage(localstorage, sessionstorage), and additional options for specifying expiration times and versions of state values for better utilization.

Easy to use!
1. When you create a store folder and create a status store module, the Pinia store is automatically created globally.
2. Provides auto-imported global functions to easy access to the store without any setup/init
3. Multilayer directories are also automatically recognized, allowing store access through automatically generated distinguished names
4. Auto-imported Nuxt3 global APIs such as useState can be utilized

** Use Case Screenshot
![Alt Text](https://i.imgur.com/3c96lMq.png) 

** Example of Persistent State Values through WebStorage
![Alt Text](https://i.imgur.com/5DAh6tT.gif)

## Readme Translation
한국어 링크: <https://github.com/rubystarashe/nuxt3-pinia/blob/master/README-kor.md>

## Example
<https://github.com/rubystarashe/nuxt3-pinia-playground>

## Installation
```
npm i nuxt3-pinia
```

## Basic Usage
```js
// nuxt.config.js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['nuxt3-pinia']
})
```

```js
// store/index.js
export const store1 = {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
export const store2 = () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
}
```

```js
// app.vue
<script setup>
const { foo } = getStoreRefs('store1')

const store2 = getStore('store2')
const { count, doubleCount } = store2.toRefs()
const { increment } = store2
</script>
```

## Directory based store module Auto-Import
```js
// If you set the store module to store/index.js as follows:
export default {
  state: () => {
    return {
      count: 0
    }
  }
}
// default can be called as getStore('default')
export const test = {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
// test can be called as getStore('test')
```

```js
// If you set the store module to store/othername.js as follows:
export default {
  state: () => {
    return {
      count: 0
    }
  }
}
// default is omitted name and can be called as getStore('othername')
export const nextname = {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
// nextname can be called as getStore('othername/nextname')
```

```js
// If you set the store module to store/depth1/depth2.js as follows:
export default {
  state: () => {
    return {
      count: 0
    }
  }
}
// default is omitted name and can be called as getStore('depth1/depth2')
export const depth3 = {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
// depth3 can be called as getStore('depth1/depth2/depth3')
```

## Autoimport Directory Option
You can specify the name of the directory path from which you want to read the store modules
```js
//  nuxt.config.js
import { defineNuxtConfig } from "nuxt"

export default defineNuxtConfig({
  modules: ['nuxt3-pinia'],
  pinia: {
    autoImport: 'store' // Default value is 'store'. If it is false, it does not read automatically any folder
  }
})
```

## AutoImported API

### Get Store
```js
// get store api
const store1 = getStore('store1')
const store2 = store('store2')

// Gets the states of the store as reactive objects
const store1_refs = store1.toRefs()
const store2_refs = storeToRefs(store2)
const store3_refs = getStoreRefs('store3')
const store4_refs = storeRefs('store4')
```

### Set Store programmically
In addition to creating module files in the specified folder, you can create stores within the vue instance
```js
const newStore = defineStore('storename', {
  state: () => {
    return {
      foo: 'bar'
    }
  }
})
// defineStore creates a store object and registers the created store globally
// Therefore, it can be retrieved from other components through get store api without additional settings
const store_by_get = getStore('storename')
```

### Global Pinia instance and list of stores
You can access the Nuxt app to get global pinia instance.
You can also refer to the list of stores registered as modules by referring to pinia.stores or $pinia
```js
const { pinia, $pinia } = useNuxtApp()
const stores = pinia.stores // === $pinia
const store1 = $pinia['store1']()
const store2 = pinia.stores['store1']()
```

## Store Options

### Persist Option
When you create a store, you can specify that the status is stored in web storage by granting the persist option
```js
export default {
  persist: 'localStorage' // local, localStorage, session, sessionStorage.
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
```
Stores with persist option can see persist point in time through the $persist property of the store
```vue
<template>
<div v-if="store.$persist">
{{store.foo}}
</div>
</template>

<script setup>
const store = getStore('default')
</script>
```

### Expire Option
When you create a store, you can set how long the state is stored on the web storage by granting the expire option
```js
export default {
  persist: true,  // === localStorage
  expire: 1000 * 60 * 60 // expire or expirein key. ms.
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
```

### Version Option
If the version of the saved state changes, the default value of the new version is saved to web storage without recalling the store state that was previously saved
```js
export default {
  persist: true,
  version: 'some version', // any
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
```

## Next
1. Secure mode for persist option
2. Persist state with Cookie mode
