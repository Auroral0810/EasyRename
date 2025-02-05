import { defineStore } from 'pinia'
// import type { FileWithHandle } from './fileStore'

interface RenameRecord {
  oldName: string
  newName: string
  path: string
}

// 确保 store 名称唯一
export const useHistoryStore = defineStore('historyStore', {
  state: () => ({
    undoStack: [] as RenameRecord[][],
    redoStack: [] as RenameRecord[][]
  }),

  actions: {
    // 清空历史记录并添加新的操作
    addNewOperation(records: RenameRecord[]) {
      // 清空重做栈
      this.redoStack = []
      // 添加新操作到撤销栈
      this.undoStack.push(records)
    },

    // 获取最近的撤销记录
    getLastOperation(): RenameRecord[] | null {
      if (this.undoStack.length === 0) return null
      const records = this.undoStack[this.undoStack.length - 1]
      return records.map(record => ({
        oldName: record.newName, // 交换新旧文件名
        newName: record.oldName,
        path: record.path
      }))
    },

    // 获取最近的重做记录
    getNextOperation(): RenameRecord[] | null {
      if (this.redoStack.length === 0) return null
      const records = this.redoStack[this.redoStack.length - 1]
      return records
    },

    // 确认撤销操作完成
    undo() {
      if (this.undoStack.length > 0) {
        const records = this.undoStack.pop()!
        this.redoStack.push(records)
      }
    },

    // 确认重做操作完成
    redo() {
      if (this.redoStack.length > 0) {
        const records = this.redoStack.pop()!
        this.undoStack.push(records)
      }
    },

    // 清空所有历史记录
    clear() {
      this.undoStack = []
      this.redoStack = []
    }
  }
}) 