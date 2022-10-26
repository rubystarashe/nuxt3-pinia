import { defineNuxtModule, addTemplate, addPlugin, addPluginTemplate, resolveModule } from '@nuxt/kit'
import { resolve } from 'pathe'
import { getAllFileList } from './src/fs'
import { readFileSync } from 'fs'

export default defineNuxtModule({
  meta: {
    name: 'nuxt3-pinia',
    configKey: 'pinia'
  },
  defaults: {
    appName: 'pinia',
    provideName: 'pinia',
    autoImport: 'store'
  },
  async setup (options, nuxt) {
    const runtimeDir = resolve('./node_modules/nuxt3-pinia')
    nuxt.hook('imports:dirs', dirs => {
      dirs.push(resolve(runtimeDir, 'composable'))
    })

    nuxt.options.alias.pinia = nuxt.options.alias.pinia ||
      resolveModule('pinia/dist/pinia.mjs', {
        paths: [nuxt.options.rootDir, import.meta.url],
      })

    nuxt.options.runtimeConfig.public.pinia = options

    const prefix = typeof options.autoImport == 'boolean' ? 'store' : options.autoImport

    let storeModels = `import { createPinia } from 'pinia'
      const storeModels = {
        global: () => useNuxtApp()
    `

    const storeRoutes = getAllFileList(prefix, 'js')
    if (options.autoImport) {
      let script = ''
      let keys = []
      for (const route of storeRoutes) {
        try {
          const filepath = resolve(`./${prefix}/${route}.js`)
          const module = await import(filepath)

          const replacekey = '$_'
          let routequery = ('$storeModel_' + route.replace(/\//g, replacekey) + replacekey).replace('index$_', '')

          let ns = readFileSync(filepath)
            .toString()
            .replace(/export (const|let|var)\s(.*?)=/g, `,${routequery}$2:`)
            .replace('export default', `,${routequery}default:`)
            .split('\n')

          ns.filter(e => e.trim().startsWith('import')).forEach(e => storeModels = e + '\n' + storeModels)
          ns = ns.filter(e => !e.trim().startsWith('import')).join('\n')

          script += ns
          script += '\n'

          keys = keys.concat([`default`, ...Object.keys(module.default || module)]
            .map(e => `${routequery}${e}`)
            .filter(e => script.indexOf(e) >= 0))
        } catch (error) {
          console.error(error)
        }
      }

      storeModels += `${script}\n}`
    }

    addPluginTemplate({
      filename: '@nuxt3-pinia.mjs',
      getContents: () => {
        return `
          ${storeModels}
          ${readFileSync(resolve(runtimeDir, 'plugin/init.js')).toString()}
        `
      }
    })
  }
})
