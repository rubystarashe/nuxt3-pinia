# nuxt3-pinia

Nuxt3 환경의 Pinia 상태 저장소를 쉽고 강력하게 사용할 수 있도록 도와주는 모듈입니다.
웹스토리지를 통한 상태값 보전을 제공하고, 더 잘 활용하기 위해 만료 시간과 상태값의 버전을 지정할 수 있는 추가 옵션을 제공합니다.

사용이 쉽습니다!
1. store 폴더를 만들고 상태 저장소 모듈을 작성하면 Pinia 스토어가 자동으로 전역 생성됩니다.
2. 자동 삽입된 전역 함수를 제공하여 별다른 설정 없이도 스토어에 쉽게 접근할 수 있습니다
3. 다층 구조의 디렉토리도 자동으로 인식하여, 자동 생성된 구별된 이름을 통해 스토어에 접근할 수 있습니다
4. useState 등 자동 삽입된 Nuxt3 API 들을 활용할 수 있습니다

** 사용 예제 스크린샷
![Alt Text](https://i.imgur.com/3c96lMq.png) 

** 웹스토리지를 통한 상태값 보전 예시
![Alt Text](https://i.imgur.com/5DAh6tT.gif) 

# Readme Translation
한국어 링크: <https://github.com/rubystarashe/nuxt3-pinia/blob/master/README-kor.md>

# Example
<https://github.com/rubystarashe/nuxt3-pinia-playground>

# Installation
```
npm i nuxt3-pinia
```

# Basic Usage
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

# Directory based store module Auto-Import
```js
// store/index.js 에 스토어 모듈을 다음과 같이 설정하면,
export default {
  state: () => {
    return {
      count: 0
    }
  }
}
// default 는 getStore('default')로 호출할 수 있습니다
export const test = {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
// test 는 getStore('test')로 호출할 수 있습니다
```

```js
// store/othername.js 에 스토어 모듈을 다음과 같이 설정하면,
export default {
  state: () => {
    return {
      count: 0
    }
  }
}
// default 는 이름이 생략되어 getStore('othername')로 호출할 수 있습니다
export const nextname = {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
// nextname 은 getStore('othername/nextname')로 호출할 수 있습니다
```

```js
// store/depth1/depth2.js 에 스토어 모듈을 다음과 같이 설정하면,
export default {
  state: () => {
    return {
      count: 0
    }
  }
}
// default 는 이름이 생략되어 getStore('depth1/depth2')로 호출할 수 있습니다
export const depth3 = {
  state: () => {
    return {
      foo: 'bar'
    }
  }
}
// depth3 은 getStore('depth1/depth2/depth3')로 호출할 수 있습니다
```

# Autoimport Directory Option
스토어 모듈들을 읽어올 디렉토리 패스의 이름을 지정할 수 있습니다
```js
//  nuxt.config.js
import { defineNuxtConfig } from "nuxt"

export default defineNuxtConfig({
  modules: ['nuxt3-pinia'],
  pinia: {
    autoImport: 'store' // 기본 값은 'store'. 만약 false 라면, 자동으로 읽어오지 않습니다
  }
})
```

# AutoImported API

## Get Store
```js
// 스토어를 가져옵니다
const store1 = getStore('store1')
const store2 = store('store2')

// 스토어의 state 들을 반응성 객체로 가져옵니다
const store1_refs = store1.toRefs()
const store2_refs = storeToRefs(store2)
const store3_refs = getStoreRefs('store3')
```

## Set Store programmically
모듈 파일을 지정한 폴더에 생성하는 방법 외에도, vue 인스턴스 안에서 스토어를 생성할 수 있습니다
```js
const newStore = defineStore('storename', {
  state: () => {
    return {
      foo: 'bar'
    }
  }
})
const store = newStore()
// defineStore 는 스토어 객체를 생성함과 동시에, 만들어진 스토어를 전역적으로 등록합니다
// 따라서 추가적인 설정 없이도 get store api를 통해 다른 컴포넌트에서 불러올 수 있습니다
const store_by_get = getStore('store')
```

## Global Pinia instance and list of stores
Nuxt app 에 접근하여 pinia 인스턴스를 가져올 수 있습니다.
pinia.stores 또는 $pinia 를 참조하여 모듈로 등록된 스토어 목록을 참조할 수도 있습니다
```js
const { pinia, $pinia } = useNuxtApp()
const stores = pinia.stores // === $pinia
const store1 = $pinia['store1']()
const store2 = pinia.stores['store1']()
```

# Store Options

## Persist Option
스토어를 생성할 때, persist 옵션을 부여하는 것으로 상태가 웹스토리지에 저장되도록 지정할 수 있습니다
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
persist 옵션이 부여된 스토어는, $persist 속성을 통해 persist 시점을 확인할 수 있습니다
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

## Expire Option
스토어를 생성할 때, expire 옵션을 부여하는 것으로 웹스토리지에 저장된 상태의 저장 기간을 설정할 수 있습니다
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

## Version Option
저장된 상태의 버전이 바뀌면, 이전에 저장되었던 스토어 상태를 불러오지 않고 새로운 버전의 기본값을 웹스토리지에 저장합니다
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

# Next
1. Secure mode for persist option
2. Persist state with Cookie mode
