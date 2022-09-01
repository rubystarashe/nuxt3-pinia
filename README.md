# nuxt3-pinia

Progressive Nuxt3 pinia module with easy use, perist, expire option

# Installation
```
npm i nuxt3-pinia
```

# Basic Usage
Most basic step where local storage is encrypted automatically.
```js
//  nuxt.config.js
import { defineNuxtConfig } from "nuxt"

export default defineNuxtConfig({
  modules: ['nuxt3-pinia'],
  pinia: {
    autoImport: 'store' // If not entered, “store” is the default value
  }
})
```

```js
// store/index.js
export const test = {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
export default {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}

// store/somedir/any.js
export default {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}

// store/somedir/index.js
export default {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}

// app.vue
<script setup>
const store_1 = getStore('test')
const store_2 = getStore('default')
const store_3 = getStore('somedir/any')
const store_4 = getStore('somedir')

const storeRefs_1 = store_1.toRefs()
const storeRefs_2 = getStoreRefs('default')

const newStore = defineStore('name', () => {
  state: () => {
    return {
      foo: 'bar'
    }
  }
})
</script>
```

# Persist Option
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

# Expire Option
```js
export default {
  expire: 1000 * 60 * 60 // expire or expirein key. ms.
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
```

# Version Option
```js
export default {
  version: 'some version', // any
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
```
