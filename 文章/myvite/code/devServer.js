// 负责启动一个 Koa 服务，用于处理请求，对请求进行处理，返回相应的内容

import Koa from 'koa'
import staticFiles from 'koa-static' // 静态资源使用的库
import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from "url"
import { dirname } from "path"
import { parse } from 'es-module-lexer'
import MagicSting from 'magic-string'

import { parse as vueParse, compileTemplate, compileScript } from 'vue/compiler-sfc'
import { OPTIMIZER_PATH } from './config.js'
import { transformSync } from 'esbuild'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CLIENT_FILE = 'client.js'
const CLIENT_PATH = `/@myvite/${CLIENT_FILE}`

const app = new Koa()

function getContent(ctxBodyStream) {
  return new Promise((resolve) => {
    let res = ''

    if (typeof ctxBodyStream === 'string') {
      resolve(ctxBodyStream)
    } else {
      ctxBodyStream.on('data', (chunk) => {
        res += chunk
      })
      ctxBodyStream.on('end', () => {
        resolve(res)
      })
    }
  })
}

function modifyImport(content) {
  const imports = parse(content)[0]
  const magicSting = new MagicSting(content)
  for (const item of imports) {
    if (!/^(\.|\/)/.test(item.n)) {
      const { n, s, e } = item
      magicSting.overwrite(s, e, `${OPTIMIZER_PATH}/${n}.js`)
    } else if (/.(svg|jpg|png)/.test(item.n)) {
      const { n, s, e } = item
      magicSting.overwrite(s, e, `${n}?import`)
    } else if (/.(vue|css)/.test(item.n) && item.n.startsWith('.')) {
      const { s, e } = item
      let { n } = item
      if (n.startsWith('.')) {
        n = n.replace('./', '')
      }
      magicSting.overwrite(s, e, `/src/${n}`)
    }
  }
  return magicSting.toString()
}

async function modifyHtml(ctx) {
  ctx.body = (await getContent(ctx.body)).replace(
    /<\/head>/,
    `<script type="module" src="${CLIENT_PATH}"></script>\n<\/head>`)
}

async function modifyVueToJs(ctx, url) {
  const fileName = ctx.request.url.split('/').pop()

  ctx.set('Content-Type', 'text/javascript')

  const content = await getContent(ctx.body)

  const { descriptor } = vueParse(content, { filename: fileName })

  let code = []
  if (descriptor.styles.length) {
    code.push(`import "${url}?type=style&index=0&scoped=7a7a37b1&lang.css"`)
  }
  
  const { content: vueScriptCode, bindings } = compileScript(descriptor, {
    source: descriptor.scriptSetup.content
  })

  const vueTemplateCode = compileTemplate({
    source: descriptor.template.content,
    filename: fileName,
    compilerOptions: { bindingMetadata: bindings }
  }).code

  const vueScriptCodeJs = transformSync(vueScriptCode, {
    loader: 'ts',
    target: 'esnext'
  }).code

  code = [
    ...code,
    vueScriptCodeJs.replace(
      'export default',
      `const main =`
    ),
    vueTemplateCode,
    `main.render = render`,
    `export default main`,
  ].join('\n')

  ctx.body = modifyImport(code)
}

async function modifyVueToCss(ctx) {
  ctx.set('Content-Type', 'text/javascript')

  const content = await getContent(ctx.body)

  const { descriptor } = vueParse(content)

  const cssContent = descriptor.styles.reduce(
    (init, item) => init + item.content,
    ''
  )

  ctx.set('Content-Type', 'text/javascript')
  const code = [
    `import { updateStyle } from "${CLIENT_PATH}"`,
    `let css = ${JSON.stringify(cssContent)}`,
    `updateStyle(css)`,
  ].join('\n')
  ctx.body = code
}

async function modifyTs(ctx) {
  ctx.set('Content-Type', 'text/javascript')
  
  ctx.body = modifyImport(await getContent(ctx.body))
}

async function modifyCss(ctx) {
  ctx.set('Content-Type', 'text/javascript')
  const content = await getContent(ctx.body)
  const code = [
    `import { updateStyle } from "${CLIENT_PATH}"`,
    `let css = ${JSON.stringify(content)}`,
    `updateStyle(css)`,
  ].join('\n')
  ctx.body = code
}

async function modifySvg(ctx) {
  ctx.set('Content-Type', 'text/javascript')
  const content = await getContent(ctx.body)
  const code = [
    `export default "data:image/svg+xml,`,
    encodeURIComponent(content),
    `"`,
  ].join('')
  ctx.body = code
}

async function modifyResponse(ctx) {
  // ctx.body
  const uri = ctx.request.url.split('?')[0]

  if (ctx.response.is('html')) {
    await modifyHtml(ctx)
  } else if (ctx.request.url === CLIENT_PATH) {
    ctx.set('Content-Type', 'text/javascript')
    ctx.body = await fs.promises.readFile(path.join(__dirname, CLIENT_FILE))
  } else if (ctx.request.url.endsWith('.ts')) {
    await modifyTs(ctx)
  } else if (ctx.request.url.endsWith('.js')) {
    await modifyTs(ctx)
  } else if (uri.endsWith('.css')) {
    await modifyCss(ctx)
  } else if (uri.endsWith('.vue') && !ctx.request.url.includes('?type=style')) {
    await modifyVueToJs(ctx, ctx.request.url)
  } else if (uri.endsWith('.vue') && ctx.request.url.includes('?type=style')) {
    await modifyVueToCss(ctx)
  } else if (uri.endsWith('.svg')) {
    await modifySvg(ctx)
  }
}

const createServer = (root, config) => {
  const { server: serverConfig } = config
  const { hostName, port } = serverConfig

  // 使用中间件，处理所有请求，并对静态资源做相应的处理
  app.use(async (ctx, next) => {
    await next()
    await modifyResponse(ctx)
  })

  // 将预编译路径，加入静态资源中

  // 配置静态资源路径，将当前目录作为静态资源路径
  app.use(staticFiles(root, {
    hidden: true,
  }))

  const server = http.createServer(app.callback())

  server.listen(port, hostName, () => {
    console.log(`start dev server:   http://${hostName}:${port}/`)
  })
}
export { createServer }
