import { processTemplate } from './templateProcessor'

export interface RenameRule {
  type: string;
  enabled: boolean;
  processExt: boolean;
  ignoreCase: boolean;
  processFileName: (fileName: string, index: number) => string;
}

// 序号补齐规则
export interface SequenceRule extends RenameRule {
  type: 'sequence';
  startNumber: number;
  increment: number;
  digits: number;
  position: 'prefix' | 'suffix';
  separator: string;
}

// 全新命名规则
export interface NewNameRule extends RenameRule {
  type: 'newName';
  template: string;
  startNumber: number;
  increment: number;
  digits: number;
}

// 正则替换规则
export interface RegexRule extends RenameRule {
  type: 'regex';
  pattern: string;
  replacement: string;
  useGlobal: boolean;
  ignoreCase: boolean;
}

// 自定义JS规则
export interface CustomJSRule extends RenameRule {
  type: 'customJS';
  code: string;
}

export interface ReplaceRule {
  enabled: boolean
  processExt: boolean
  type: 'specific' | 'frontN' | 'backN' | 'positionMN' | 'reversePositionMN' | 
        'afterString' | 'beforeString' | 'afterStringN' | 'beforeStringN'
  searchText: string
  replaceText: string
  count: number
  position: number
}

export interface ProcessForm {
  replace: {
    enabled: boolean
    processExt: boolean
    type: 'specific' | 'frontN' | 'backN' | 'positionMN' | 'reversePositionMN' | 'afterString' | 'beforeString' | 'afterStringN' | 'beforeStringN'
    searchText: string
    replaceText: string
    count: number
    position: number
    ignoreCase: boolean
  }
  insert: {
    enabled: boolean
    processExt: boolean
    type: 'text' | 'sequence'
    position: 'start' | 'end' | 'afterN' | 'beforeN' | 'afterString' | 'beforeString'
    charPosition: number
    searchString: string
    text: string
    sequenceType: 'arabic' | 'chineseSmall' | 'chineseBig' | 'englishLower' | 'englishUpper' | 'roman'
    startNumber: number
    digits: number
    prefix: string
    suffix: string
  }
  sequence: {
    enabled: boolean
    processExt: boolean
    groupIndex: number      // 第几组数字
    targetLength: number    // 目标长度
    fillChar: string       // 填充字符
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
  newName: {
    enabled: boolean
    template: string
    startNumber: number
    increment: number
    digits: number
    processExt: boolean
  }
}

export class RenameProcessor {
  private rules: ProcessForm

  constructor(rules: ProcessForm) {
    this.rules = rules
  }

  // 处理文件名
  public processFileName(fileName: string, index: number): string {
    let result = fileName

    // 按顺序应用所有启用的规则
    if (this.rules.replace.enabled) {
      result = this.processReplaceRule(result)
    }
    
    if (this.rules.insert.enabled) {
      result = this.processInsert(result, index)
    }

    if (this.rules.sequence.enabled) {
      result = this.processSequence(result)
    }

    if (this.rules.regex.enabled) {
      result = this.processRegexRule(result)
    }

    if (this.rules.customJS.enabled) {
      result = this.processCustomJSRule(result, index)
    }

    if (this.rules.newName.enabled) {
      result = this.processNewName(result, index)
    }

    return result
  }

  // 处理替换规则
  private processReplaceRule(fileName: string): string {
    const { type, searchText, replaceText, count, position, ignoreCase, processExt } = this.rules.replace
    
    // 如果不处理扩展名，则分离文件名和扩展名
    const { name, extension } = this.getFileNameParts(fileName)
    let result = processExt ? fileName : name

    switch (type) {
        case 'specific':
        const regex = new RegExp(this.escapeRegExp(searchText), ignoreCase ? 'gi' : 'g')
        result = result.replace(regex, replaceText)
          break
        case 'frontN':
        result = replaceText + result.slice(count)
          break
        case 'backN':
        result = result.slice(0, -count) + replaceText
          break
        case 'positionMN':
        result = result.slice(0, position) + replaceText + result.slice(position + count)
          break
        case 'reversePositionMN':
        const pos = result.length - position
        result = result.slice(0, pos) + replaceText + result.slice(pos + count)
          break
        case 'afterString':
        case 'beforeString':
        const searchIndex = ignoreCase 
          ? result.toLowerCase().indexOf(searchText.toLowerCase())
          : result.indexOf(searchText)
        if (searchIndex !== -1) {
          const insertPos = type === 'afterString' ? searchIndex + searchText.length : searchIndex
          result = result.slice(0, insertPos) + replaceText + result.slice(insertPos)
          }
          break
        case 'afterStringN':
      case 'beforeStringN':
        const idx = ignoreCase 
          ? result.toLowerCase().indexOf(searchText.toLowerCase())
          : result.indexOf(searchText)
        if (idx !== -1) {
          const startPos = type === 'afterStringN' ? idx + searchText.length : idx - count
          const endPos = type === 'afterStringN' ? idx + searchText.length + count : idx
          result = result.slice(0, startPos) + replaceText + result.slice(endPos)
          }
          break
    }

    return processExt ? result : result + extension
  }

  // 处理插入规则
  private processInsert(fileName: string, index: number): string {
    const { insert } = this.rules;
    if (!insert.enabled) return fileName;

    let targetName = insert.processExt ? fileName : fileName.substring(0, fileName.lastIndexOf('.') || fileName.length);
    let ext = '';
    
    if (!insert.processExt && fileName.includes('.')) {
      ext = fileName.substring(fileName.lastIndexOf('.'));
    }
    
    let result = targetName;
    let insertContent = '';

    if (insert.type === 'text') {
      insertContent = insert.text;
    } else if (insert.type === 'sequence') {
      const sequenceNumber = insert.startNumber + index;
      let sequenceText = '';
      
      switch (insert.sequenceType) {
        case 'arabic':
          sequenceText = String(sequenceNumber).padStart(insert.digits, '0');
          break;
        case 'chineseSmall':
          sequenceText = convertToChineseNumber(sequenceNumber, false);
          break;
        case 'chineseBig':
          sequenceText = convertToChineseNumber(sequenceNumber, true);
          break;
        case 'englishLower':
          sequenceText = convertToEnglishLetter(sequenceNumber, false);
          break;
        case 'englishUpper':
          sequenceText = convertToEnglishLetter(sequenceNumber, true);
          break;
        case 'roman':
          sequenceText = convertToRomanNumeral(sequenceNumber);
          break;
        default:
          sequenceText = String(sequenceNumber);
      }
      
      insertContent = `${insert.prefix}${sequenceText}${insert.suffix}`;
    }
    
    // 根据不同的插入位置处理
    switch (insert.position) {
      case 'start':
        result = insertContent + result;
        break;
      case 'end':
        result = result + insertContent;
        break;
      case 'afterN':
        const posAfter = Math.min(insert.charPosition, result.length);
        result = result.slice(0, posAfter) + insertContent + result.slice(posAfter);
        break;
      case 'beforeN':
        const totalLength = result.length;
        const posFromEnd = Math.min(insert.charPosition, totalLength);
        const insertPos = totalLength - posFromEnd;
        result = result.slice(0, insertPos) + insertContent + result.slice(insertPos);
        break;
      case 'afterString':
        const afterIdx = result.indexOf(insert.searchString);
        if (afterIdx !== -1) {
          result = result.slice(0, afterIdx + insert.searchString.length) + 
                  insertContent + 
                  result.slice(afterIdx + insert.searchString.length);
        }
        break;
      case 'beforeString':
        const beforeIdx = result.indexOf(insert.searchString);
        if (beforeIdx !== -1) {
          result = result.slice(0, beforeIdx) + 
                  insertContent + 
                  result.slice(beforeIdx);
        }
        break;
    }

    // 如果不处理后缀名，则添加回原始后缀
    return result + (insert.processExt ? '' : ext);
  }

  // 处理序列规则
  private processSequence(fileName: string): string {
    const { sequence } = this.rules;
    if (!sequence.enabled) return fileName;

    // 分离文件名和扩展名
    const ext = fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.')) : '';
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.') || fileName.length);

    // 从左到右查找数字组，确保按顺序识别
    const regex = /\d+/g;
    let match;
    let currentIndex = 1; // 从1开始计数
    let targetMatch = null;
    
    // 遍历所有匹配项，找到目标组
    while ((match = regex.exec(nameWithoutExt)) !== null) {
      if (currentIndex === sequence.groupIndex) {
        targetMatch = {
          num: match[0],
          index: match.index
        };
        break;
      }
      currentIndex++;
    }

    // 如果找到目标数字组，进行替换
    if (targetMatch) {
      const paddedNum = targetMatch.num.padStart(sequence.targetLength, sequence.fillChar);
      const newName = nameWithoutExt.substring(0, targetMatch.index) + 
                     paddedNum + 
                     nameWithoutExt.substring(targetMatch.index + targetMatch.num.length);
                       
      return sequence.processExt ? newName + ext : newName + ext;
    }

    return fileName;
  }

  // 处理正则规则
  private processRegexRule(fileName: string): string {
    if (!this.rules.regex.enabled) return fileName

    const { pattern, replacement, useGlobal, ignoreCase } = this.rules.regex
    const flags = `${ignoreCase ? 'i' : ''}${useGlobal ? 'g' : ''}`
    const regex = new RegExp(pattern, flags)
    return fileName.replace(regex, replacement)
  }

  // 处理自定义JS规则
  private processCustomJSRule(fileName: string, index: number): string {
    const { customJS } = this.rules;
    if (!customJS.enabled || !customJS.code) return fileName;

    try {
      // 准备文件信息对象
      const ext = fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.')) : '';
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.') || fileName.length);
      
      // 构建options对象
      const options = {
        name: customJS.processExt ? fileName : nameWithoutExt,
        nameWithoutExt: nameWithoutExt,
        extension: ext,
        modifyTime: new Date('2025-02-04 00:48:08').getTime(),
        size: 0,
        index: index
      };

      // 清理代码，移除注释和多余的空白
      let codeToExecute = customJS.code
        .replace(/\/\/[^\n]*/g, '') // 移除单行注释
        .replace(/\/\*[^]*?\*\//g, '') // 移除多行注释
        .trim();

      // 构造安全的函数执行环境
      const functionBody = `
        "use strict";
        return function(options) {
          const name = options.name;
          const nameWithoutExt = options.nameWithoutExt;
          const extension = options.extension;
          const modifyTime = options.modifyTime;
          const size = options.size;
          const index = options.index;
          
          ${codeToExecute}
          
          try {
            return rename(options) || options.name;
          } catch (e) {
            console.error('重命名执行错误:', e);
            return options.name;
          }
        }
      `;

      // 创建并执行函数
      const renameFn = new Function(functionBody);
      const executor = renameFn();
      const result = executor(options);

      // 确保返回有效的文件名
      if (!result) return fileName;
      
      // 根据是否处理后缀返回结果
      return customJS.processExt ? result : (result + ext);

    } catch (error) {
      console.error('自定义JS处理错误:', error);
      return fileName;
    }
  }

  private processNewName(fileName: string, index: number, lastModified?: number): string {
    const { template, processExt } = this.rules.newName
    const fileExt = fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.') + 1) : ''
    
    const newName = processTemplate(template, {
      fileName,
      fileExt,
      index,
      lastModified: lastModified || Date.now()
    })

    // 如果不处理扩展名，则添加原始扩展名
    if (!processExt && fileExt) {
      return `${newName}.${fileExt}`
    }

    return newName
  }

  private getFileNameParts(fileName: string) {
    const lastDotIndex = fileName.lastIndexOf('.')
    if (lastDotIndex === -1) {
      return { name: fileName, extension: '' }
    }
    return {
      name: fileName.substring(0, lastDotIndex),
      extension: fileName.substring(lastDotIndex)
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}

// 将转换函数移到类外部作为独立函数
function convertToChineseNumber(num: number, uppercase: boolean): string {
  if (num >= 1e+16) return '数字过大';
  
  const digits = uppercase 
    ? ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    : ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  
  const units = uppercase
    ? ['', '拾', '佰', '仟']
    : ['', '十', '百', '千'];
  
  const bigUnits = ['', '万', '亿', '兆'];
  
  if (num === 0) return digits[0];
  
  const numStr = num.toLocaleString('fullwide', { useGrouping: false });
  const sections: string[] = [];
  
  for (let i = numStr.length; i > 0; i -= 4) {
    sections.unshift(numStr.slice(Math.max(0, i - 4), i));
  }
  
  const processSection = (section: string): string => {
    let result = '';
    let hasZero = false;
    
    for (let i = 0; i < section.length; i++) {
      const digit = parseInt(section[i]);
      const pos = section.length - 1 - i;
      
      if (digit === 0) {
        hasZero = true;
      } else {
        if (hasZero) {
          result += digits[0];
          hasZero = false;
        }
        result += digits[digit];
        if (pos > 0) {
          result += units[pos];
        }
      }
    }
    
    return result;
  };
  
  let result = '';
  let hasValue = false;
  sections.forEach((section, index) => {
    const sectionStr = processSection(section);
    if (sectionStr) {
      if (hasValue && /^[零]/.test(sectionStr)) {
        result += digits[0];
      }
      result += sectionStr;
      if (sections.length - 1 - index < bigUnits.length) {
        const unit = bigUnits[sections.length - 1 - index];
        if (unit && section !== '0000') {
          result += unit;
        }
      }
      hasValue = true;
    }
  });
  
  result = result
    .replace(/零+/g, '零')
    .replace(/零+$/, '')
    .replace(/零([万亿兆])/g, '$1')
    .replace(/亿万/g, '亿')
    .replace(/兆亿/g, '兆');
  
  if (!uppercase && result.startsWith('一十')) {
    result = result.substring(1);
  }
  
  return result || digits[0];
}

function convertToEnglishLetter(num: number, uppercase: boolean): string {
  if (num <= 0) return '';
  
  const base = uppercase ? 65 : 97;
  let result = '';
  
  while (num > 0) {
    num--;
    result = String.fromCharCode(base + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  
  return result;
}

function convertToRomanNumeral(num: number): string {
  if (num > 100000000) return '数字过大';
  if (num <= 0) return '';
  
  const romanNumerals = [
    { value: 10000000, symbol: 'M̿' },
    { value: 9000000, symbol: 'C̿M̿' },
    { value: 5000000, symbol: 'D̿' },
    { value: 4000000, symbol: 'C̿D̿' },
    { value: 1000000, symbol: 'M̅' },
    { value: 900000, symbol: 'C̅M̅' },
    { value: 500000, symbol: 'D̅' },
    { value: 400000, symbol: 'C̅D̅' },
    { value: 100000, symbol: 'C̅' },
    { value: 90000, symbol: 'X̅C̅' },
    { value: 50000, symbol: 'L̅' },
    { value: 40000, symbol: 'X̅L̅' },
    { value: 10000, symbol: 'X̅' },
    { value: 9000, symbol: 'MX̅' },
    { value: 5000, symbol: 'V̅' },
    { value: 4000, symbol: 'MV̅' },
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];
  
  let result = '';
  for (const { value, symbol } of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  
  return result;
} 