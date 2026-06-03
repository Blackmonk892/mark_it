import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error('Context Isolation is not enabled. The preload script will not run.')
}

try {
  contextBridge.exposeInMainWorld('context', {
    //todo
  })
} catch (error) {
  console.error(error)
}

console.log('PRELOAD STARTED')
