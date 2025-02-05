<template>
  <div class="virtual-list">
    <!-- 当没有数据时显示的完整表格 -->
    <el-table
      v-if="!hasData"
      :data="[]"
      :border="true"
      style="width: 100%; height: 100%"
      ref="emptyTableRef"
    >
      <el-table-column width="55" fixed="left">
        <template #default>
          <el-button size="small" disabled>全选</el-button>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="60" fixed="left" />
      <el-table-column prop="name" label="原文件名" min-width="200" fixed="left" />
      <el-table-column prop="newName" label="新文件名" min-width="200" />
      <el-table-column v-if="showPath" prop="path" label="目录" min-width="150" />
      <el-table-column prop="size" label="大小" width="120" />
      <el-table-column prop="lastModified" label="修改时间" width="180" />
      <template #empty>
        <div class="custom-empty">
          <span>没有要处理的文件</span>
        </div>
      </template>
    </el-table>

    <!-- 有数据时显示的分离式表格结构 -->
    <template v-else>
      <!-- 固定表头 -->
      <div class="table-header">
        <el-table
          :data="[{}]"
          :border="true"
          style="width: 100%"
          ref="headerTableRef"
          @sort-change="handleSortChange"
        >
          <el-table-column width="55" fixed="left">
            <template #default>
              <el-button 
                size="small"
                @click="handleSelectAll"
              >
                全选
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="60" fixed="left" />
          <el-table-column 
            prop="name" 
            label="原文件名" 
            sortable="custom"
            min-width="200"
            fixed="left"
          />
          <el-table-column 
            prop="newName" 
            label="新文件名" 
            sortable="custom"
            min-width="200"
          />
          <el-table-column 
            v-if="showPath"
            prop="path" 
            label="目录" 
            sortable="custom"
            min-width="150"
          />
          <el-table-column 
            prop="size" 
            label="大小" 
            sortable="custom"
            width="120"
          />
          <el-table-column 
            prop="lastModified" 
            label="修改时间"
            sortable="custom" 
            width="180"
          />
        </el-table>
      </div>

      <!-- 可滚动的表格主体 -->
      <div class="table-body" ref="tableBodyRef">
        <el-table
          ref="tableRef"
          :data="sortedData"
          :border="true"
          :stripe="false"
          :show-header="false"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" fixed="left" />
          <el-table-column width="60" fixed="left">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column 
            prop="name" 
            min-width="200"
            fixed="left"
          />
          <el-table-column 
            prop="newName" 
            min-width="200"
          >
            <template #default="{ row }">
              <span :class="{ 'changed-name': row.name !== row.newName }">
                {{ row.newName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column 
            v-if="showPath"
            prop="path" 
            min-width="150"
          >
            <template #default="{ row }">
              <el-tooltip 
                :content="row.path" 
                placement="top" 
                :show-after="500"
              >
                <span class="ellipsis-text">{{ row.path }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column 
            prop="size" 
            width="120"
          >
            <template #default="{ row }">
              {{ formatFileSize(row.size) }}
            </template>
          </el-table-column>
          <el-table-column 
            prop="lastModified" 
            width="180"
          >
            <template #default="{ row }">
              {{ formatDate(row.lastModified) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    
    <!-- 加载提示 -->
    <div v-if="isLoading" class="loading-tip">
      loading...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, defineExpose } from 'vue'
import { formatFileSize, formatDate } from '@/utils/file'
import type { ProcessedFile } from '@/types/files'

const props = defineProps<{
  items: ProcessedFile[]
  itemHeight: number
  bufferSize: number
  showPath: boolean
  sortConfig: {
    prop: string
    order: 'ascending' | 'descending' | null
  }
  showAffectedOnly?: boolean
}>()

const emit = defineEmits<{
  'selection-change': [selection: ProcessedFile[]],
  'sort-change': [config: { prop: string; order: 'ascending' | 'descending' | null }]
}>()

const tableRef = ref()
const currentData = ref<ProcessedFile[]>([])
const isLoading = ref(false)
const pageSize = 200
const tableBodyRef = ref<HTMLElement>()
const headerTableRef = ref()
const isAllSelected = ref(false)
const isIndeterminate = ref(false)
const selectedRows = ref<ProcessedFile[]>([])

// 修改排序后的数据计算属性
const sortedData = computed(() => {
  // 首先根据是否只显示受影响文件筛选数据
  let filteredData = props.showAffectedOnly 
    ? currentData.value.filter(item => item.name !== item.newName)
    : currentData.value

  if (!props.sortConfig.prop || !props.sortConfig.order) {
    return filteredData
  }

  return [...filteredData].sort((a, b) => {
    const prop = props.sortConfig.prop as keyof ProcessedFile
    const aValue = a[prop] ?? ''
    const bValue = b[prop] ?? ''

    if (props.sortConfig.order === 'ascending') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
})

// 修改初始化加载数据方法
const initData = () => {
  // 根据是否只显示受影响文件筛选数据
  const filteredItems = props.showAffectedOnly 
    ? props.items.filter(item => item.name !== item.newName)
    : props.items
    
  currentData.value = filteredItems.slice(0, pageSize)
  
  // console.log('%c[虚拟列表] 初始化数据', 'color: #4CAF50; font-weight: bold;', {
  //   显示数据量: currentData.value.length,
  //   总数据量: filteredItems.length,
  //   仅显示受影响: props.showAffectedOnly
  // })
  
  // 初始化后添加滚动监听
  nextTick(() => {
    setupScrollListener()
    // 强制表格重新布局
    if (tableRef.value) {
      tableRef.value.doLayout()
    }
  })
}

// 修改获取滚动容器的方法
const getTableWrapper = () => {
  return tableBodyRef.value
}

// 设置滚动监听
const setupScrollListener = () => {
  const wrapper = getTableWrapper()
  if (wrapper) {
    // 移除可能存在的旧监听器
    wrapper.removeEventListener('scroll', handleScroll)
    // 添加新的监听器
    wrapper.addEventListener('scroll', handleScroll, { passive: true })
    
    // 强制设置内容高度
    const tableBody = wrapper.querySelector('.el-table__body')
    if (tableBody) {
      (tableBody as HTMLElement).style.minHeight = `${currentData.value.length * 40 + 1}px`
    }
    
    nextTick(() => {})
  }
}

// 处理滚动事件
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target || isLoading.value) return

  const { scrollTop, clientHeight, scrollHeight } = target
  const scrollBottom = scrollTop + clientHeight
  const threshold = clientHeight * 0.3 // 当距离底部30%时开始加载
  if (scrollHeight - scrollBottom <= threshold) {
    loadMoreData()
  }
}

// 修改加载更多数据方法
const loadMoreData = () => {

  if (isLoading.value) return
  
  const currentLength = currentData.value.length
  if (currentLength >= props.items.length) {
    return
  }
  
  isLoading.value = true
  
  // 根据是否只显示受影响文件筛选数据
  const filteredItems = props.showAffectedOnly 
    ? props.items.filter(item => item.name !== item.newName)
    : props.items
    
  // 模拟异步加载
  setTimeout(() => {
    const nextData = filteredItems.slice(
      currentLength,
      currentLength + pageSize
    )
    
    currentData.value = [...currentData.value, ...nextData]
    
    isLoading.value = false

    // 检查是否需要继续加载
    nextTick(() => {
      const wrapper = getTableWrapper()
      if (wrapper) {
        const { scrollTop, clientHeight, scrollHeight } = wrapper
        if (scrollHeight - (scrollTop + clientHeight) <= clientHeight * 0.3) {
          loadMoreData()
        }
      }
    })
  }, 100)
}

// 表格行的类名
const tableRowClassName = ({ row, rowIndex }: { row: ProcessedFile; rowIndex: number }) => {
  if (row.name !== row.newName) {
    return rowIndex % 2 === 0 ? 'changed-row even-row' : 'changed-row odd-row'
  }
  return ''
}

// 处理排序变化
const handleSortChange = (column: { prop: string; order: 'ascending' | 'descending' | null }) => {
  emit('sort-change', column)
}

// 处理全选
const handleSelectAll = () => {
  // 先清空当前选择
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
  
  // 将所有数据加载到当前数据中
  currentData.value = [...props.items]
  
  // 在下一个tick中执行全选
  nextTick(() => {
    if (tableRef.value) {
      tableRef.value.toggleAllSelection()
    }
    
    // 触发选择变化事件，传递所有数据
    emit('selection-change', props.items)
  })
}

// 处理选择变化
const handleSelectionChange = (selection: ProcessedFile[]) => {
  selectedRows.value = selection
  const total = sortedData.value.length
  isAllSelected.value = selection.length === total
  isIndeterminate.value = selection.length > 0 && selection.length < total
  emit('selection-change', selection)
}

// 监听数据变化，重置选择状态
watch(() => props.items, () => {
  isAllSelected.value = false
  isIndeterminate.value = false
  
  // 重置每一行的选中状态
  sortedData.value.forEach(row => {
    row.isSelected = false
  })
}, { deep: true })

// 监听数据源变化
watch(() => props.items, () => {
  // console.log('%c[虚拟列表] 数据源变化', 'color: #E91E63; font-weight: bold;')
  const wrapper = getTableWrapper()
  if (wrapper) {
    wrapper.removeEventListener('scroll', handleScroll)
  }
  
  currentData.value = []
  nextTick(() => {
    initData()
  })
}, { deep: true })

// 监听 showPath 变化
watch(() => props.showPath, () => {
  nextTick(() => {
    // 延迟更新表格布局
    setTimeout(() => {
      if (tableRef.value) {
        tableRef.value.doLayout()
      }
      if (headerTableRef.value) {
        headerTableRef.value.doLayout()
      }
    }, 100)
  })
})

// 添加对 showAffectedOnly 的监听
watch(() => props.showAffectedOnly, () => {
  // console.log('%c[虚拟列表] 切换显示模式', 'color: #E91E63; font-weight: bold;')
  const wrapper = getTableWrapper()
  if (wrapper) {
    wrapper.scrollTop = 0
    wrapper.removeEventListener('scroll', handleScroll)
  }
  
  currentData.value = []
  nextTick(() => {
    initData()
  })
})

// 组件挂载时初始化
onMounted(() => {
  // console.log('%c[虚拟列表] 组件挂载', 'color: #E91E63; font-weight: bold;')
  initData()
  nextTick(() => {
    if (headerTableRef.value && tableRef.value) {
      const headerTable = headerTableRef.value.$el
      const bodyTable = tableRef.value.$el
      const resizeObserver = new ResizeObserver(() => {
        const headerCols = headerTable.querySelectorAll('.el-table__header col')
        const bodyCols = bodyTable.querySelectorAll('.el-table__body col')
        headerCols.forEach((col: HTMLElement, index: number) => {
          if (bodyCols[index]) {
            (bodyCols[index] as HTMLTableColElement).width = (col as HTMLTableColElement).width
          }
        })
      })
      resizeObserver.observe(headerTable)
    }
  })
})

// 组件卸载时清理
onUnmounted(() => {
  // console.log('%c[虚拟列表] 组件卸载', 'color: #E91E63; font-weight: bold;')
  const wrapper = getTableWrapper()
  if (wrapper) {
    wrapper.removeEventListener('scroll', handleScroll)
  }
})

// 全选方法
const selectAll = () => {
  // 先清空当前选择
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
  
  // 将所有数据加载到当前数据中
  currentData.value = [...props.items]
  
  // 在下一个tick中执行全选
  nextTick(() => {
    if (tableRef.value) {
      tableRef.value.toggleAllSelection()
    }
    
    // 触发选择变化事件，传递所有数据
    emit('selection-change', props.items)
  })
}

// 添加 deselectAll 方法
const deselectAll = () => {
  if (tableRef.value) {
    tableRef.value.clearSelection()
    // 触发选择变化事件，传递空数组表示没有选中项
    emit('selection-change', [])
  }
}

// 正确暴露方法
defineExpose({
  selectAll,
  deselectAll
})

// 添加判断是否有数据的计算属性
const hasData = computed(() => {
  return props.items && props.items.length > 0
})
</script>

<style scoped>
.virtual-list {
  height: 400px;
  position: relative;
  border: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
}

.table-header {
  flex-shrink: 0;
  background: var(--el-bg-color);
  z-index: 10;
}

.table-header :deep(.el-table__body-wrapper) {
  display: none;
}

.table-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

/* 确保表格主体正确展示 */
.table-body :deep(.el-table) {
  height: auto !important;
}

.table-body :deep(.el-table__inner-wrapper) {
  height: auto !important;
}

.table-body :deep(.el-table__body-wrapper) {
  height: auto !important;
  overflow: visible !important;
}

:deep(.el-table) {
  border: none !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table__row) {
  background-color: #ffffff !important;
}

:deep(.el-table__row:hover) {
  background-color: var(--el-table-row-hover-bg-color) !important;
}

:deep(.changed-row) {
  background-color: var(--el-color-primary-light-9) !important;
}

/* 确保选中行的样式正确 */
:deep(.el-table__row.current-row),
:deep(.el-table__row.hover-row) {
  background-color: var(--el-table-row-hover-bg-color) !important;
}

/* 确保表格内容垂直居中 */
:deep(.el-table__cell) {
  padding: 8px 0 !important;
  vertical-align: middle;
}

.loading-tip {
  text-align: center;
  padding: 10px 0;
  color: #909399;
  font-size: 14px;
  position: sticky;
  bottom: 0;
  background-color: var(--el-bg-color);
  z-index: 1;
}

.ellipsis-text {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table__empty-block) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 !important;
  height: 100% !important;
}

:deep(.empty-block) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}

:deep(.empty-text) {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

:deep(.el-table__body-wrapper) {
  min-height: calc(100% - 1px) !important;
}

:deep(.el-table__inner-wrapper) {
  height: 100%;
}

/* 滚动条样式 */
.table-body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-body::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: var(--el-scrollbar-bg-color);
}

.table-body::-webkit-scrollbar-track {
  border-radius: 3px;
  background: var(--el-fill-color-lighter);
}

/* 确保按钮在列中居中显示 */
.table-header :deep(.el-button--small) {
  padding: 4px 8px;
  font-size: 12px;
  margin: 0 auto;
  display: block;
}

/* 确保单元格内容居中 */
.table-header :deep(.el-table__cell) {
  text-align: center;
  vertical-align: middle;
}

/* 变更的奇数行 - 较深的蓝色 */
:deep(.changed-row.odd-row) {
  background-color: #ecf5ff !important;
  color: var(--el-color-primary);
}

/* 变更的偶数行 - 较浅的蓝色 */
:deep(.changed-row.even-row) {
  background-color: #f5f9ff !important;
  color: var(--el-color-primary);
}

/* 变更行悬停效果 */
:deep(.changed-row:hover td) {
  background-color: #e3effd !important;
}

/* 自定义空数据样式 */
.custom-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 确保空表格填满容器 */
:deep(.el-table__inner-wrapper),
:deep(.el-table__body-wrapper) {
  height: 100% !important;
}

/* 修改表格边框样式 */
.virtual-list :deep(.el-table) {
  height: 100%;
}

/* 确保空表格的表头正确显示 */
.virtual-list :deep(.el-table__header-wrapper) {
  background-color: var(--el-bg-color);
}
</style> 
