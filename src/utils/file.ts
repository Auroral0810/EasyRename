import { RenameProcessor } from './renameRules'
import type { ProcessForm, FileWithHandle } from '@/types/files'
import type { ProcessForm as RenameProcessForm } from './renameRules'

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const generateNewFileName = (
  originalName: string,
  options: {
    prefix?: string
    suffix?: string
    sequence?: number
    sequenceDigits?: number
  }
): string => {
  const { prefix = '', suffix = '', sequence, sequenceDigits = 3 } = options
  const ext = getFileExtension(originalName)
  const nameWithoutExt = originalName.slice(0, -(ext.length + 1))
  
  let newName = `${prefix}${nameWithoutExt}${suffix}`
  if (sequence !== undefined) {
    newName += '_' + String(sequence).padStart(sequenceDigits, '0')
  }
  return `${newName}.${ext}`
}

export const formatDate = (date: Date | number | string): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const processRegexRename = (
  fileName: string,
  pattern: string,
  replacement: string,
  processExt: boolean
): string => {
  try {
    // 默认使用全局替换
    const regex = new RegExp(pattern, 'g')
    
    if (processExt) {
      // 处理整个文件名（包括扩展名）
      return fileName.replace(regex, replacement)
    } else {
      // 只处理文件名部分，保留扩展名
      const ext = getFileExtension(fileName)
      const nameWithoutExt = fileName.slice(0, -(ext.length + 1))
      const newName = nameWithoutExt.replace(regex, replacement)
      return `${newName}.${ext}`
    }
  } catch (error) {
    console.error('正则表达式语法错误:', error)
    return fileName // 如果正则表达式有错，返回原文件名
  }
}

export const processFileName = (
  file: FileWithHandle, 
  rules: ProcessForm,
  fileIndex: number
): string => {
  const processor = new RenameProcessor(rules as RenameProcessForm)
  return processor.processFileName(file.name, fileIndex)
}

// 批量处理文件
export const processFiles = (
  files: FileWithHandle[],
  rules: ProcessForm
): string[] => {
  return files.map((file, index) => processFileName(file, rules, index))
}