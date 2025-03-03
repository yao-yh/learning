import path from 'node:path'
import fs from 'node:fs'
import { rollup } from 'rollup'
import terser from '@rollup/plugin-terser'
import html from '@rollup/plugin-html'
import commonjs from '@rollup/plugin-commonjs'
import styles from 'rollup-plugin-styles'
import url from '@rollup/plugin-url'
import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import esbuild from 'rollup-plugin-esbuild'
import { fileURLToPath, URL } from 'node:url'

const BUILD_HTMLTITLE = 'my App'

function clearDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }
}

function findInputInRoot(root) {
  const rootPath = path.join(root, 'src')

  for (const file of fs.readdirSync(rootPath)) {
    if (file.startsWith('main')) {
      return `/src/${file}`
    }
  }

  throw new Error('No entry file found in src directory')
}


async function createBuild(root, config) {
  const { outDir, assetsDir='assets' } = config
  const template = path.join(root, 'index.html')
  const dir = path.join(root, outDir || 'dist')
  const main = findInputInRoot(root)
  const input = path.join(root, main)

  const inputOptions = {
    input,
    plugins: [
      // 可以代码中使用 @ 别名
      alias({
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }),
      // 解析 .vue 文件为 sfc
      vue(),
      // 处理css
      styles({
        mode: 'extract',
        minimize: true,
      }),
      // esbuild，这里用来编译 TypeScript
      esbuild({ target: 'esnext', loader: 'ts' }), // 使用 esbuild 编译 TypeScript
      // rollup 能够识别和处理 npm 包
      resolve(),
      // 将代码中的 process.env.NODE_ENV 替换为 production
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      // rollup 能够识别 commonjs 模块
      commonjs(),
      // 处理图片
      url({
        include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'],
        limit: 0,
        fileName: `./${assetsDir}/[name]-[hash][extname]`,
      }),
      // 处理 html 文件。这里为了 html 文件中引入编译新生成的 css 和 js 文件。并删除对开发环境的 css 和 js 的引入
      html({
        title: BUILD_HTMLTITLE,
        template: async ({ files }) => {
          // files 是一个对象，包含了 entrypoints 生成的所有文件
          // 我们需要把他们按顺序引入到 html 模板中

          let code = fs.readFileSync(template).toString()
          code = code.replace(`<script type="module" src="${main}"></script>`, '')

          let fileTags = []
          if (files.css) {
            const cssTags = files.css.map((item) => {
              return '\t' + `<link rel="stylesheet" href="/${item.fileName}">`
            })
            fileTags = [...fileTags, ...cssTags]
          }
          if (files.js) {
            const jsTags = files.js.map((item) => {
              return (
                '\t' + `<script type="module" src="/${item.fileName}"></script>`
              )
            })
            fileTags = [...fileTags, ...jsTags]
          }
          if (fileTags.length) {
            code = code.replace('</head>', fileTags.join('\n') + '\n</head>')
          }
          return code
        },
      }),
      // 压缩 js 文件
      terser()
    ],
  }
  const outputOptions = {
    dir,
    format: 'es',
    entryFileNames: `${assetsDir}/index-[hash].js`,
    assetFileNames: `${assetsDir}/[name]-[hash].[ext]`,
    chunkFileNames: `${assetsDir}/[name]-[hash].js`,
  }
  clearDir(dir)
  const start = Date.now()
  const bundle = await rollup(inputOptions)
  await bundle.write(outputOptions)
  await bundle.close()
  const end = Date.now()
  console.log(`✓ built in ${Math.round(end - start)}ms`)
}

export { createBuild }
