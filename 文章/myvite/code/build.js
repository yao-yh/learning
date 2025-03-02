import path from 'node:path'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { rollup } from 'rollup'
import terser from '@rollup/plugin-terser'
import html from '@rollup/plugin-html'
import commonjs from '@rollup/plugin-commonjs'
import styles from 'rollup-plugin-styles'
import url from '@rollup/plugin-url'
import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace'
import progress from 'rollup-plugin-progress'
import esbuild from 'rollup-plugin-esbuild'

import colors from 'picocolors'

const BUILD_HTMLTITLE = 'my App'
const SOURCE_SCRIPTMODULE = '<script type="module" src="/src/main.ts"></script>'

const clearDir = async (dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }
}

const createBuild = async (root, config) => {
  const { outDir, assetsDir='assets' } = config
  const isJsx = fs.existsSync(path.join(root, 'src/main.jsx'))
  const template = path.join(root, 'index.html')
  const input = path.join(root, isJsx ? 'src/main.jsx' : 'src/main.ts')
  const dir = path.join(root, outDir || 'dist')
  const inputOptions = {
    input,
    plugins: [
      vue(),
      styles({
        mode: 'extract',
        minimize: true,
      }),
      esbuild({ target: 'esnext', loader: 'ts' }), // 使用 esbuild 编译 TypeScript
      resolve(),
      // alias({
      //   entries: [
      //     { find: 'dayjs', replacement: 'dayjs/esm' }
      //   ]
      // }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      commonjs(),
      url({
        include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'],
        limit: 0,
        fileName: `./${assetsDir}/[name]-[hash][extname]`,
      }),
      html({
        title: BUILD_HTMLTITLE,
        template: async ({ files }) => {
          // files 是一个对象，包含了 entrypoints 生成的所有文件
          // 我们需要把他们按顺序引入到 html 模板中
          let fileTags = []
          let code = (await fsp.readFile(template)).toString()
          code = code.replace(SOURCE_SCRIPTMODULE, '')
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
      terser(),
      progress(),
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
  console.log(colors.green(`✓ built in ${Math.round(end - start)}ms`))
}

export { createBuild }
