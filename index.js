import { defineNuxtModule, addTemplate, addPlugin } from '@nuxt/kit'
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
    nuxt.hook('autoImports:dirs', dirs => {
      dirs.push(resolve(runtimeDir, 'composable'))
    })
    nuxt.hook('builder:extendPlugins', dirs => {
      console.log(dirs)
    })

    nuxt.options.runtimeConfig.public.pinia = options

    const prefix = typeof options.autoImport == 'boolean' ? 'store' : options.autoImport

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

          script += readFileSync(filepath)
            .toString()
            .replace(/export (const|let|var)\s+/g, `export const ${routequery}`)
            .replace('export default', `export const ${routequery}default =`)
          script += '\n'

          keys = keys.concat([`default`, ...Object.keys(module.default || module)]
            .map(e => `${routequery}${e}`)
            .filter(e => script.indexOf(e) >= 0))
        } catch (error) {
          console.error(error)
        }
      }

      addTemplate({
        filename: `pinia.store.model.mjs`,
        getContents: () => {
          return `
            ${script}
            export default {
              ${keys.join(',')}
            }
          `
        },
        write: true
      })
    }

    addPlugin({
      src: resolve(runtimeDir, 'plugin/init.js')
    })
  }
})
