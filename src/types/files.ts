export interface FileWithHandle {
  name: string
  size: number
  type: string
  lastModified: number
  handle?: FileSystemFileHandle
  path: string
  newName?: string
  arrayBuffer: () => Promise<ArrayBuffer>
  slice: (start?: number, end?: number) => Blob
  stream: () => ReadableStream
  text: () => Promise<string>
}
export interface ProcessedFile extends FileWithHandle {
  directory: string
  isSelected?: boolean  
  relativePath: string
}

export interface FilterCondition {
  type: 'include' | 'exclude'
  field: string
  condition: string
  value: string | number
  ignoreCase?: boolean
  startDate?: string
  endDate?: string
  sizeValue?: number
  sizeUnit?: string
}

export interface ProcessForm {
  replace: {
    enabled: boolean
    processExt: boolean
    ignoreCase: boolean
    type: 'specific' | 'frontN' | 'backN' | 'positionMN' | 'reversePositionMN' | 'afterString' | 'beforeString' | 'afterStringN' | 'beforeStringN'
    searchText: string
    replaceText: string
    count: number
    position: number
  }
  insert: {
    enabled: boolean
    processExt: boolean
    type: string
    position: string
    charPosition: number
    searchString: string
    text: string
    sequenceType: string
    startNumber: number
    digits: number
    prefix: string
    suffix: string
  }
  sequence: {
    enabled: boolean
    processExt: boolean
    groupIndex: number
    targetLength: number
    fillChar: string
  }
  newName: {
    enabled: boolean
    processExt: boolean
    template: string
  }
  regex: {
    enabled: boolean
    processExt: boolean
    pattern: string
    replacement: string
    useGlobal: boolean
    ignoreCase: boolean
  }
  customJS: {
    enabled: boolean
    processExt: boolean
    code: string
  }
} 