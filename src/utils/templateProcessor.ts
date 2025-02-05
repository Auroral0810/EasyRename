import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

interface TemplateOptions {
  fileName: string
  fileExt: string
  index: number
  lastModified: number
}

export function processTemplate(template: string, options: TemplateOptions): string {
  const { fileName, fileExt, index, lastModified } = options
  
  return template.replace(/<([^>]+)>/g, (match, variable) => {
    // 分割变量和格式化参数
    const parts = variable.split(':')
    const baseVar = parts[0]
    const modifiers = parts.slice(1)

    // 处理文件名
    if (baseVar === 'name') {
      const name = fileName.substring(0, fileName.lastIndexOf('.') || fileName.length)
      if (modifiers.includes('upper')) return name.toUpperCase()
      if (modifiers.includes('lower')) return name.toLowerCase()
      return name
    }

    // 处理扩展名
    if (baseVar === 'ext') {
      if (modifiers.includes('upper')) return fileExt.toUpperCase()
      if (modifiers.includes('lower')) return fileExt.toLowerCase()
      return fileExt
    }

    // 处理序号
    if (baseVar.includes('#')) {
      const digits = (baseVar.match(/#/g) || []).length
      const startNum = parseInt(modifiers[0] || '1')
      return String(index + startNum).padStart(digits, '0')
    }

    // 处理日期和时间
    if (baseVar.startsWith('date') || baseVar.startsWith('time')) {
      const [type, subType] = baseVar.split('.')
      const format = modifiers[0] || (type === 'date' ? 'YYYY-MM-DD' : 'HH:mm:ss')
      const timestamp = subType === 'modify' ? lastModified : Date.now()
      
      return dayjs(timestamp).format(format)
    }

    // 处理 UUID
    if (baseVar.startsWith('uuid')) {
      const length = parseInt(modifiers[0] || '32')
      const uuid = uuidv4().replace(/-/g, '')
      const result = uuid.slice(0, Math.min(length, 32))
      return modifiers.includes('upper') ? result.toUpperCase() : result
    }

    // 未匹配的变量返回原始文本
    return match
  })
} 