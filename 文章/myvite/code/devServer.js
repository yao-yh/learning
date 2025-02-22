import Koa from 'koa'
import staticFiles from 'koa-static' // 静态资源使用的库
import http from 'node:http'

const hostName = 'localhost'
const port = 5173

const app = new Koa()

const createServer = (root, config) => {
  const { server: serverConfig } = config
  const { hostName, port } = serverConfig

  // 配置静态资源路径，将当前目录作为静态资源路径
  app.use(
    staticFiles(root)
  )

  const server = http.createServer(app.callback())

  server.listen(port, hostName, () => {
    console.log(`start dev server:   http://${hostName}:${port}/`)
  })
}
export { createServer }
