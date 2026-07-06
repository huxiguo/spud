import Uni from '@uni-helper/plugin-uni'
import { isMpWeixin } from '@uni-helper/uni-env'
import UniComponents from '@uni-helper/vite-plugin-uni-components'
// @see https://uni-helper.js.org/vite-plugin-uni-layouts
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
// @see https://github.com/uni-helper/vite-plugin-uni-manifest
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
// @see https://uni-helper.js.org/vite-plugin-uni-pages
import UniPages from '@uni-helper/vite-plugin-uni-pages'
// @see https://github.com/uni-helper/vite-plugin-uni-platform
// 需要与 @uni-helper/vite-plugin-uni-pages 插件一起使用
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
/**
 * 分包优化、模块异步跨包调用、组件异步跨包引用
 * @see https://github.com/uni-ku/bundle-optimizer
 */
import UniOptimization from '@uni-ku/bundle-optimizer'
// https://github.com/uni-ku/root
import UniKuRoot from '@uni-ku/root'
import path from 'node:path'
import process from 'node:process'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import ViteRestart from 'vite-plugin-restart'

import openDevTools from './scripts/open-dev-tools'
import { WotResolver } from './wot-ui-resolver'

export default defineConfig(({ command, mode }) => {
  // mode: 区分生产环境还是开发环境
  console.log('command, mode -> ', command, mode)
  // pnpm dev:h5 时得到 => serve development
  // pnpm build:h5 时得到 => build production
  // pnpm dev:mp-weixin 时得到 => build development (注意区别，command为build)
  // pnpm build:mp-weixin 时得到 => build production
  // pnpm dev:app 时得到 => build development (注意区别，command为build)
  // pnpm build:app 时得到 => build production
  // dev 和 build 命令可以分别使用 .env.development 和 .env.production 的环境变量
  // 非 H5 端 dev 也是 build command，最终加载哪个 env 文件以实际 mode 为准。

  const { UNI_PLATFORM, SKIP_OPEN_DEVTOOLS } = process.env
  console.log('UNI_PLATFORM -> ', UNI_PLATFORM) // 得到 mp-weixin, h5, app 等

  const envDir = path.resolve(process.cwd(), 'env')
  const env = loadEnv(mode, envDir)
  const localEnv = loadEnv(mode, envDir, '')
  const { VITE_DELETE_CONSOLE, VITE_APP_PUBLIC_BASE } = env
  const { WECHAT_DEVTOOLS_CLI_PATH } = localEnv
  console.log('环境变量 env -> ', env)

  return defineConfig({
    envDir: './env', // 自定义env目录
    base: VITE_APP_PUBLIC_BASE,
    plugins: [
      // UniXXX 需要在 Uni 之前引入
      UniLayouts(),
      UniPlatform(),
      UniManifest(),
      UniComponents({
        extensions: ['vue'],
        deep: true, // 是否递归扫描子目录，
        directoryAsNamespace: false, // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名，
        dts: 'src/types/components.d.ts', // 自动生成的组件类型声明文件路径（用于 TypeScript 支持）
        resolvers: [WotResolver()],
      }),
      UniPages({
        exclude: ['**/components/**/**.*'],
        // pages 目录为 src/pages，分包目录不能配置在pages目录下！！
        // 是个数组，可以配置多个，但是不能为pages里面的目录！！
        subPackages: [],
        dts: 'src/types/uni-pages.d.ts',
      }),
      // UniOptimization 插件需要 page.json 文件，故应在 UniPages 插件之后执行
      UniOptimization({
        enable: isMpWeixin,
        dts: {
          base: 'src/types',
        },
        logger: false,
      }),
      // 若存在改变 pages.json 的插件，请将 UniKuRoot 放置其后
      UniKuRoot({
        excludePages: ['**/components/**/**.*'],
      }),
      Uni(),
      {
        // 临时解决 dcloudio 官方的 @dcloudio/uni-mp-compiler 出现的编译 BUG
        // 参考 github issue: https://github.com/dcloudio/uni-app/issues/4952
        // 自定义插件禁用 vite:vue 插件的 devToolsEnabled，强制编译 vue 模板时 inline 为 true
        name: 'fix-vite-plugin-vue',
        configResolved(config) {
          const plugin = config.plugins.find((p) => p.name === 'vite:vue')
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false
          }
        },
      },
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'uni-app'],
        dts: 'src/types/auto-import.d.ts',
        dirs: ['src/hooks'], // 自动导入 hooks
        vueTemplate: true, // default false
      }),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.js'],
      }),
      // 自动打开开发者工具插件 (必须修改 .env 文件中的 VITE_WX_APPID)
      // 上传时通过 SKIP_OPEN_DEVTOOLS=true 跳过
      SKIP_OPEN_DEVTOOLS !== 'true' &&
        openDevTools({
          mode,
          wechatDevtoolsCliPath: WECHAT_DEVTOOLS_CLI_PATH,
        }),
    ],
    css: {
      postcss: {
        plugins: [
          // autoprefixer({
          //   // 指定目标浏览器
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ],
      },
    },

    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
        '@img': path.join(process.cwd(), './src/static/images'),
      },
    },
    esbuild: {
      drop: VITE_DELETE_CONSOLE === 'true' ? ['console', 'debugger'] : [],
    },
    build: {
      sourcemap: false,
      // 方便非h5端调试
      // sourcemap: VITE_SHOW_SOURCEMAP === 'true', // 默认是false
      target: 'es6',
      // 开发环境不用压缩
      minify: mode === 'development' ? false : 'esbuild',
    },
  })
})
