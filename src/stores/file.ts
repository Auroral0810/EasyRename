import { defineStore } from 'pinia'
import type { FileWithHandle } from '@/types/files'

export const useFileStore = defineStore('file', {
  state: () => ({
    files: [] as FileWithHandle[]
  }),

  getters: {
    // 获取可以传递给 Worker 的数据
    workerData(): any[] {
      return this.files.map(file => ({
        name: file.name,
        newName: file.newName,
        path: file.path,
        directory: file.path.split('/').slice(0, -1).join('/'),
        size: file.size,
        lastModified: file.lastModified,
        type: file.type
      }))
    }
  },

  actions: {
    addFiles(newFiles: FileWithHandle[]) {
      this.files.push(...newFiles)
    },

    clearFiles() {
      this.files = []
    },

    updateFiles(renamedFiles: Array<{ oldName: string, newName: string, path: string }>) {
      renamedFiles.forEach(({ oldName, newName, path }) => {
        const fileIndex = this.files.findIndex(f => 
          f.name === oldName && f.path === path
        )
        if (fileIndex !== -1) {
          this.files[fileIndex] = {
            ...this.files[fileIndex],
            name: newName
          }
        }
      })
    },

    undoLastOperation(records: Array<{ oldName: string, newName: string, path: string }>) {
      this.updateFiles(records)
    },

    redoOperation(records: Array<{ oldName: string, newName: string, path: string }>) {
      this.updateFiles(records)
    }
  }
}) 