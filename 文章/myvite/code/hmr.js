import path from 'node:path'
import chokidar from 'chokidar'
import { WebSocketServer } from 'ws'
import { timeStamp } from 'node:console'

const hotModules = new Map()

const createWebSockerServer = (root, server) => {
  const wss = new WebSocketServer({
    server,
  })
  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'connected' }))
  })
  createHmr(root, wss)
}

const createHmr = (root, wss) => {
  chokidar
    .watch(path.join(root), { ignoreInitial: true })
    .on('change', (file, status) => {
      console.log('file changed', file)
      if (hotModules.has(file)) {
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(
              JSON.stringify({
                type: 'update', update: {
                  path: hotModules.get(file),
                  type: 'js-update',
                  timestamp: Date.now()
                }
              })
            )
          }
        })
      } else {
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'full-reload' }))
          }
        })
      }
    })
}

export { createWebSockerServer, hotModules }
