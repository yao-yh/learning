#!/usr/bin/env node

// 获取当前目录
const root = process.cwd()
// 获取命令行参数
const mode = process.argv[2] || 'dev'

import { createConfig } from './config.js'
const config = await createConfig(root)

if (mode === 'build') {
  // todo
} else if (mode === 'dev' || mode === 'serve') {
  const {createOptimizer} = await import('./optimize.js')
  createOptimizer(root)

  const { createServer } = await import('./devServer.js')
  createServer(root, config)
} else {
  console.log('mode error')
}
