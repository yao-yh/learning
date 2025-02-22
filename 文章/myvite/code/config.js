import { merge } from 'lodash-es'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const createConfig = async (root) => {
  const defaultConfig = {
    server: {
      hostName: 'localhost',
      port: 5173,
    },
    build: {
      // todo
    },
  }

  const myConfigName = 'myvite.config.js' // 这里可以配置多个，比如一个数组，然后遍历，找到第一个存在的配置文件
  const importConfig = (
    await import(pathToFileURL(path.join(root, myConfigName)).href)
  ).default

  // 将默认配置和导入配置合并
  const config = merge(defaultConfig, importConfig)
  return config
}

export { createConfig }
