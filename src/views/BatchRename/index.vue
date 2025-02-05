<template>
  <div class="batch-rename">
    <el-card class="batch-rename-card">
      <template #header>
        <div class="card-header">
          <span>共 {{ fileCount }} 个文件</span>
          <!-- <div class="header-actions">
            <el-button-group class="history-buttons">
              <el-button
                icon="Back"
                @click="handleUndo"
                :disabled="!canUndo"
              >
                撤销
              </el-button>
              <el-button
                icon="Right"
                @click="handleRedo"
                :disabled="!canRedo"
              >
                重做
              </el-button>
            </el-button-group>
          </div> -->
        </div>
      </template>

      <div class="filter-section">
        <div class="filter-row">
          <el-select v-model="filterForm.type" class="filter-item" placeholder="包含文件">
            <el-option label="包含文件" value="include" />
            <el-option label="排除文件" value="exclude" />
          </el-select>

          <el-select v-model="filterForm.field" class="filter-item">
            <el-option
              v-for="field in filterFields"
              :key="field.value"
              :label="field.label"
              :value="field.value"
            />
          </el-select>

          <template v-if="filterForm.field === 'lastModified'">
            <div class="datetime-group">
              <el-date-picker
                v-model="filterForm.startDate"
                type="datetime"
                placeholder="开始时间（可选）"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="date-picker"
                clearable
              />
              <span class="separator">至</span>
              <el-date-picker
                v-model="filterForm.endDate"
                type="datetime"
                placeholder="结束时间（可选）"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="date-picker"
                clearable
              />
            </div>
          </template>

          <template v-else-if="filterForm.field === 'size'">
            <el-select v-model="filterForm.condition" class="size-condition" placeholder="大于">
              <el-option label="大于" value="gt" />
              <el-option label="大于等于" value="gte" />
              <el-option label="小于" value="lt" />
              <el-option label="小于等于" value="lte" />
              <el-option label="等于" value="equals" />
            </el-select>
            <el-input-number 
              v-model="filterForm.sizeValue" 
              :min="0"
              class="size-input"
              controls-position="right"
            />
            <el-select v-model="filterForm.sizeUnit" class="unit-select">
              <el-option label="B" value="B" />
              <el-option label="KB" value="KB" />
              <el-option label="MB" value="MB" />
              <el-option label="GB" value="GB" />
              <el-option label="TB" value="TB" />
            </el-select>
          </template>

          <template v-else>
            <el-select v-model="filterForm.condition" class="filter-item" placeholder="包含">
              <el-option label="包含" value="contains" />
              <el-option label="不包含" value="notContains" />
              <el-option label="开始于" value="startsWith" />
              <el-option label="结束于" value="endsWith" />
              <el-option label="等于" value="equals" />
            </el-select>

            <el-input 
              v-model="filterForm.value" 
              class="filter-input" 
              placeholder="请输入" 
            />
          </template>

          <el-checkbox 
            v-if="filterForm.field !== 'lastModified' && filterForm.field !== 'size'" 
            v-model="filterForm.ignoreCase"
          >
            忽略大小写
          </el-checkbox>

          <el-button type="primary" @click="addFilter">提交</el-button>
          <el-button type="warning" @click="clearFilters" :disabled="!activeFilters.length">
            <el-icon><delete /></el-icon>
            清除过滤
          </el-button>

          <el-tooltip 
            :content="filterForm.field === 'name' ? '这里的文件名不包括扩展名' : filterForm.field === 'path' ? '后缀名称支持模糊处理' : ''" 
            placement="top"
            v-if="filterForm.field === 'name' || filterForm.field === 'path'"
          >
            <el-icon class="help-icon"><question-filled /></el-icon>
          </el-tooltip>
        </div>

        <div class="filter-tags">
          <el-tag
            v-for="(filter, index) in activeFilters"
            :key="index"
            closable
            class="filter-tag"
            @close="removeFilter(index)"
          >
            {{ getFilterLabel(filter) }}
          </el-tag>
        </div>
      </div>

      <div class="process-section">
        <el-tabs v-model="activeProcessTab">
          <el-tab-pane name="replace">
            <template #label>
              <span class="tab-label">
                删除/替换字符
                <span v-if="processForm.replace.enabled" class="active-dot"></span>
              </span>
            </template>
            <el-form :model="processForm.replace" label-width="120px">
              <el-form-item>
                <el-checkbox v-model="processForm.replace.enabled">启用规则</el-checkbox>
                <el-checkbox v-model="processForm.replace.processExt" class="ml-4">同时处理后缀名</el-checkbox>
                <el-checkbox v-model="processForm.replace.ignoreCase" class="ml-4">忽略大小写</el-checkbox>
              </el-form-item>
              
              <el-form-item label="操作类型">
                <el-select v-model="processForm.replace.type" placeholder="请选择操作类型">
                  <el-option label="指定字符串" value="specific" />
                  <el-option label="前N个字符" value="frontN" />
                  <el-option label="后N个字符" value="backN" />
                  <el-option label="第M位置后的N个字符" value="positionMN" />
                  <el-option label="倒数M位置前的N个字符" value="reversePositionMN" />
                  <el-option label="XX字符串后面的所有字符" value="afterString" />
                  <el-option label="XX字符串前面的所有字符" value="beforeString" />
                  <el-option label="XX字符串后面的N个字符" value="afterStringN" />
                  <el-option label="XX字符串前面的N个字符" value="beforeStringN" />
                </el-select>
              </el-form-item>

              <!-- 根据不同的操作类型显示不同的输入框 -->
              <template v-if="['specific', 'afterString', 'beforeString'].includes(processForm.replace.type)">
                <el-form-item label="字符串">
                  <el-input 
                    v-model="processForm.replace.searchText" 
                    placeholder="请输入字符串的取值"
                  />
                </el-form-item>
              </template>

              <template v-if="['frontN', 'backN'].includes(processForm.replace.type)">
                <el-form-item label="字符数量">
                  <el-input-number 
                    v-model="processForm.replace.count" 
                    :min="1" 
                    :default-value="1"
                  />
                </el-form-item>
              </template>

              <template v-if="['positionMN', 'reversePositionMN'].includes(processForm.replace.type)">
                <el-form-item :label="processForm.replace.type === 'positionMN' ? '起始位置' : '倒数位置'">
                  <el-input-number 
                    v-model="processForm.replace.position" 
                    :min="1" 
                    :default-value="1"
                  />
                </el-form-item>
                <el-form-item label="字符数量">
                  <el-input-number 
                    v-model="processForm.replace.count" 
                    :min="1" 
                    :default-value="1"
                  />
                </el-form-item>
              </template>

              <template v-if="['afterStringN', 'beforeStringN'].includes(processForm.replace.type)">
                <el-form-item label="字符串">
                  <el-input 
                    v-model="processForm.replace.searchText" 
                    placeholder="请输入要查找的字符串"
                  />
                </el-form-item>
                <el-form-item label="字符数量">
                  <el-input-number 
                    v-model="processForm.replace.count" 
                    :min="1" 
                    :default-value="1"
                  />
                </el-form-item>
              </template>

              <el-form-item label="替换为">
                <el-input 
                  v-model="processForm.replace.replaceText" 
                  placeholder="请输入新字符串（如果是删除，则无需输入）"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane name="insert">
            <template #label>
              <span class="tab-label">
                新增/插入字符
                <span v-if="processForm.insert.enabled" class="active-dot"></span>
              </span>
            </template>
            <el-form :model="processForm.insert" label-width="120px">
              <el-form-item>
                <el-checkbox v-model="processForm.insert.enabled">启用规则</el-checkbox>
                <el-checkbox v-model="processForm.insert.processExt" class="ml-4">同时处理后缀名</el-checkbox>
              </el-form-item>
              
              <el-form-item label="插入类型">
                <el-radio-group v-model="processForm.insert.type">
                  <el-radio-button label="text">文本</el-radio-button>
                  <el-radio-button label="sequence">序号</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="插入位置">
                <el-select v-model="processForm.insert.position">
                  <el-option label="开始位置" value="start" />
                  <el-option label="末尾位置" value="end" />
                  <el-option label="第N个字符之后" value="afterN" />
                  <el-option label="倒数N个字符之前" value="beforeN" />
                  <el-option label="XX字符串之后" value="afterString" />
                  <el-option label="XX字符串之前" value="beforeString" />
                </el-select>
              </el-form-item>

              <template v-if="processForm.insert.position === 'afterN' || processForm.insert.position === 'beforeN'">
                <el-form-item label="字符位置">
                  <el-input-number v-model="processForm.insert.charPosition" :min="1" />
                </el-form-item>
              </template>

              <template v-if="processForm.insert.position === 'afterString' || processForm.insert.position === 'beforeString'">
                <el-form-item label="查找字符串">
                  <el-input v-model="processForm.insert.searchString" placeholder="请输入要查找的字符串" />
                </el-form-item>
              </template>

              <template v-if="processForm.insert.type === 'text'">
                <el-form-item label="插入内容">
                  <el-input v-model="processForm.insert.text" placeholder="请输入要插入的内容" />
                </el-form-item>
              </template>

              <template v-else>
                <el-form-item label="序号类型">
                  <el-select v-model="processForm.insert.sequenceType">
                    <el-option label="阿拉伯数字" value="arabic" />
                    <el-option label="小写中文数字" value="chineseSmall" />
                    <el-option label="大写中文数字" value="chineseBig" />
                    <el-option label="英文小写字母" value="englishLower" />
                    <el-option label="英文大写字母" value="englishUpper" />
                    <el-option label="罗马数字" value="roman" />
                  </el-select>
                </el-form-item>

                <el-form-item label="起始序号">
                  <el-input-number v-model="processForm.insert.startNumber" :min="0" />
                </el-form-item>

                <el-form-item label="固定位数">
                  <el-input-number v-model="processForm.insert.digits" :min="1" />
                </el-form-item>

                <el-form-item label="序号前缀">
                  <el-input v-model="processForm.insert.prefix" placeholder="序号前的文本" />
                </el-form-item>

                <el-form-item label="序号后缀">
                  <el-input v-model="processForm.insert.suffix" placeholder="序号后的文本" />
                </el-form-item>
              </template>
            </el-form>
          </el-tab-pane>

          <el-tab-pane name="sequence">
            <template #label>
              <span class="tab-label">
                序号补齐
                <span v-if="processForm.sequence.enabled" class="active-dot"></span>
              </span>
            </template>
            <el-form :model="processForm.sequence" label-width="120px">
              <el-form-item>
                <el-checkbox v-model="processForm.sequence.enabled">启用规则</el-checkbox>
                <el-checkbox v-model="processForm.sequence.processExt" class="ml-4">同时处理后缀名</el-checkbox>
              </el-form-item>
              
              <el-form-item label="对第">
                <el-input-number 
                  v-model="processForm.sequence.groupIndex" 
                  :min="1" 
                  :default-value="1"
                />
                <span class="ml-2">组数字进行补齐，目标长度为：</span>
                <el-input-number 
                  v-model="processForm.sequence.targetLength" 
                  :min="1" 
                  :default-value="2"
                  class="ml-2"
                />
              </el-form-item>
              
              <el-form-item label="填充字符">
                <el-input 
                  v-model="processForm.sequence.fillChar" 
                  maxlength="1" 
                  style="width: 80px"
                  placeholder="默认为0"
                />
                <span class="form-tip ml-2">1 / 1</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane name="newName">
            <template #label>
              <span class="tab-label">
                全新命名
                <span v-if="processForm.newName.enabled" class="active-dot"></span>
              </span>
            </template>
            <el-form :model="processForm.newName" label-width="120px">
              <el-form-item>
                <el-checkbox v-model="processForm.newName.enabled">启用规则</el-checkbox>
                <el-checkbox v-model="processForm.newName.processExt" class="ml-4">同时处理后缀名</el-checkbox>
              </el-form-item>
              <el-form-item label="命名模板">
                <el-input 
                  v-model="processForm.newName.template" 
                  placeholder="输入命名模板，例如：<name>_<date.now:YYYY-MM-DD>_<###>"
                >
                  <template #append>
                    <el-tooltip
                      content="点击查看变量说明"
                      placement="top"
                    >
                      <el-button
                        :icon="QuestionFilled"
                        @click="helpVisible = true"
                      />
                    </el-tooltip>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane name="regex">
            <template #label>
              <span class="tab-label">
                正则替换
                <span v-if="processForm.regex.enabled" class="active-dot"></span>
              </span>
            </template>
            <el-form :model="processForm.regex" label-width="120px">
              <el-form-item>
                <div class="regex-header">
                  <div class="regex-checkboxes">
                    <el-checkbox v-model="processForm.regex.enabled">启用规则</el-checkbox>
                    <el-checkbox v-model="processForm.regex.processExt" class="ml-4">同时处理后缀名</el-checkbox>
                  </div>
                  <el-button type="primary" link @click="showRegexHelp">
                    <el-icon><QuestionFilled /></el-icon>
                    正则表达式帮助
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item label="正则表达式">
                <el-input v-model="processForm.regex.pattern" placeholder="请输入正则表达式" />
              </el-form-item>
              <el-form-item label="替换内容">
                <el-input v-model="processForm.regex.replacement" placeholder="支持$1,$2等捕获组引用" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane name="customJS">
            <template #label>
              <span class="tab-label">
                自定义JS
                <span v-if="processForm.customJS.enabled" class="active-dot"></span>
              </span>
            </template>
            <el-form :model="processForm.customJS" label-width="120px">
              <el-form-item>
                <div class="js-header">
                  <div class="js-checkboxes">
                    <el-checkbox v-model="processForm.customJS.enabled">启用规则</el-checkbox>
                    <el-checkbox v-model="processForm.customJS.processExt" class="ml-4">同时处理后缀名</el-checkbox>
                  </div>
                  <el-button type="primary" link @click="showJsHelp">
                    <el-icon><QuestionFilled /></el-icon>
                    查看使用帮助
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item label="自定义代码">
                <el-input
                  type="textarea"
                  v-model="processForm.customJS.code"
                  :rows="10"
                  placeholder="// 示例代码:
// return fileName.toUpperCase();
// 可用参数: fileName, index"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="upload-area">
        <div 
          class="drop-zone"
          :class="{ 'drop-zone-active': isDragging }"

          @dragenter.prevent="handleDragEnter"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
        >
          <el-icon class="upload-icon"><upload-filled /></el-icon>
          <div class="upload-text">
            <p>{{ isDragging ? '松开鼠标以上传' : '拖拽文件/文件夹到此处' }}</p>
            <p class="upload-tip">支持单个或多个文件、整个文件夹</p>
          </div>
          <div class="upload-buttons">
            <el-button 
              type="text" 
              class="upload-button"
              @click="handleFileSelect"
            >
              选择文件
            </el-button>
            <el-button 
              type="text" 
              class="upload-button"
              @click="handleSelectFolder"
            >
              选择文件夹
            </el-button>
          </div>
        </div>
      </div>

      <div class="view-options mt-4">
        <div class="view-controls">
          <el-radio-group v-model="previewMode">
            <el-radio-button label="preview">仅显示预览</el-radio-button>
            <el-radio-button label="affected">仅显示受影响文件</el-radio-button>
          </el-radio-group>
          <el-checkbox v-model="showPath" class="show-path-checkbox">
            显示目录
          </el-checkbox>
        </div>
        <div class="selection-actions">
          <el-button 
            type="info" 
            size="default"
            @click="handleDeselectAll"
            :disabled="!selectedFiles.length"
          >
            取消全选
          </el-button>
          <el-button 
          type="primary" 
          size="default"
          @click="handleSelectAll"
        >
          全选
        </el-button>
          <el-button 
            type="danger" 
            size="default"  
            :disabled="!selectedFiles.length"
            @click="removeSelectedFiles"
          >
            删除选中文件
          </el-button>
        </div>
      </div>

      <div class="file-list-container mt-4">
        <VirtualFileList
          ref="virtualListRef"
          :items="tableData"
          :item-height="CONFIG.ITEM_HEIGHT"
          :buffer-size="CONFIG.BUFFER_SIZE"
          :show-path="showPath"
          :sort-config="sortConfig"
          :show-affected-only="previewMode === 'affected'"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          style="height: 400px"
        />
      </div>

      <!-- 在 operation-buttons 前添加进度条 -->
      <div class="progress-section" v-if="isProcessing">
        <el-progress 
          :percentage="processProgress" 
          :status="processStatus"
          :format="progressFormat"
        />
        <div class="progress-details">
          <span>已处理: {{ processedCount }}/{{ totalFiles }} 个文件</span>
          <span>平均速度: {{ processSpeed }} 个/秒</span>
          <span>预计剩余时间: {{ remainingTime }}</span>
        </div>
      </div>

      <div class="operation-buttons">
        <el-button-group>
          <el-button
            type="primary"
            :icon="RefreshRight"
            @click="handleRefresh"
            :disabled="isProcessingSelected"
          >
            刷新
          </el-button>
          <el-button
            type="primary"
            :icon="Delete"
            @click="handleClear"
            :disabled="!hasFiles"
          >
            清空
          </el-button>
        </el-button-group>

        <el-button-group class="history-buttons">
          <el-button
            :icon="Back"
            @click="handleUndo"
            :disabled="!canUndo"
          >
            撤销
          </el-button>
          <el-button
            :icon="Right"
            @click="handleRedo"
            :disabled="!canRedo"
          >
            重做
          </el-button>
        </el-button-group>

        <el-button
          type="success"
          :icon="Check"
          @click="handleExecute"
          :disabled="!hasFilteredFiles || isProcessingSelected"
        >
          执行
        </el-button>
      </div>
    </el-card>
  </div>

  <el-dialog
    v-model="helpVisible"
    width="800px"
    :close-on-click-modal="true"
    :show-close="true"
    class="variable-help-dialog"
  >
    <div class="variable-help">
      <el-carousel 
        height="600px"
        indicator-position="outside" 
        :autoplay="false"
        trigger="click"
      >
        <!-- 第一页：变量说明 -->
        <el-carousel-item>
          <div class="help-page">
            <h4 class="page-title">🔍 可用变量说明</h4>
            <div class="vars-list">
              <!-- 基础变量 -->
              <div class="var-item">
                <code class="code-primary">&lt;name&gt;</code>
                <span class="var-desc">原文件名(不含后缀)</span>
              </div>
              <div class="var-item">
                <code class="code-primary">&lt;ext&gt;</code>
                <span class="var-desc">原后缀名</span>
              </div>
              <div class="var-item">
                <code class="code-primary">&lt;name:upper&gt;</code> / <code class="code-primary">&lt;name:lower&gt;</code>
                <span class="var-desc">转换大小写</span>
              </div>

              <!-- 编号变量 -->
              <div class="var-item">
                <code class="code-success">&lt;#&gt;</code>
                <span class="var-desc">编号，从1开始</span>
              </div>
              <div class="var-item">
                <code class="code-success">&lt;####&gt;</code>
                <span class="var-desc">固定位数编号，如0001</span>
              </div>

              <!-- 日期时间 -->
              <div class="var-item">
                <code class="code-warning">&lt;date&gt;</code> / <code class="code-warning">&lt;date.now&gt;</code>
                <span class="var-desc">当前日期</span>
              </div>
              <div class="var-item">
                <code class="code-warning">&lt;date.modify&gt;</code>
                <span class="var-desc">文件修改日期</span>
              </div>
              <div class="var-item">
                <code class="code-info">&lt;time&gt;</code> / <code class="code-info">&lt;time.now&gt;</code>
                <span class="var-desc">当前时间</span>
              </div>
              <div class="var-item">
                <code class="code-info">&lt;time.modify&gt;</code>
                <span class="var-desc">文件修改时间</span>
              </div>

              <!-- 特殊变量 -->
              <div class="var-item">
                <code class="code-danger">&lt;uuid:8:upper&gt;</code>
                <span class="var-desc">随机字符串，:8指定长度(最长32)，:upper转换大写</span>
              </div>

              <div class="format-note">
                格式化示例：<code class="code-example">&lt;date:YYYY-MM-DD&gt;</code> <code class="code-example">&lt;time:HH-mm-ss&gt;</code>
              </div>
            </div>
          </div>
        </el-carousel-item>

        <!-- 第二页：基础示例 -->
        <el-carousel-item>
          <div class="help-page">
            <h4 class="help-title">📝 基础示例</h4>
            <div class="example-content">
              <div class="example-group">
                <div class="example-title">📸 照片日期编号</div>
                <div class="example-code">
                  <div class="code-label">模板：</div>
                  <code class="code-block">照片_&lt;date.now:YYYY-MM-DD&gt;_&lt;###&gt;</code>
                </div>
                <div class="example-result">
                  <div class="result-label">结果：</div>
                  <div class="result-text">照片_2024-01-20_001.jpg</div>
                </div>
                <div class="example-desc">适用于按日期整理照片，自动编号</div>
              </div>

              <div class="divider"></div>

              <div class="example-group">
                <div class="example-title">📊 报表命名规范</div>
                <div class="example-code">
                  <div class="code-label">模板：</div>
                  <code class="code-block">月度报表_&lt;name:upper&gt;_&lt;date.now:YYYYMM&gt;</code>
                </div>
                <div class="example-result">
                  <div class="result-label">结果：</div>
                  <div class="result-text">月度报表_SALES_202401.xlsx</div>
                </div>
                <div class="example-desc">适用于规范化报表命名，自动大写</div>
              </div>
            </div>
          </div>
        </el-carousel-item>

        <!-- 第三页：进阶示例 -->
        <el-carousel-item>
          <div class="help-page">
            <h4 class="help-title">🚀 进阶示例</h4>
            <div class="example-content">
              <div class="example-group">
                <div class="example-title">🎵 音乐文件整理</div>
                <div class="example-code">
                  <div class="code-label">模板：</div>
                  <code class="code-block">&lt;name:upper&gt;_&lt;date.modify:YYYY-MM&gt;_&lt;uuid:6:upper&gt;</code>
                </div>
                <div class="example-result">
                  <div class="result-label">结果：</div>
                  <div class="result-text">SONG_2024-01_A7B2C3.mp3</div>
                </div>
                <div class="example-desc">使用修改日期和唯一标识符整理音乐文件</div>
              </div>

              <div class="divider"></div>

              <div class="example-group">
                <div class="example-title">📱 截图归档</div>
                <div class="example-code">
                  <div class="code-label">模板：</div>
                  <code class="code-block">Screenshot_&lt;time.now:HHmmss&gt;_&lt;uuid:4&gt;</code>
                </div>
                <div class="example-result">
                  <div class="result-label">结果：</div>
                  <div class="result-text">Screenshot_153022_x4f2.png</div>
                </div>
                <div class="example-desc">使用精确时间和短UUID区分截图</div>
              </div>
            </div>
          </div>
        </el-carousel-item>

        <!-- 第四页：完整示例 -->
        <el-carousel-item>
          <div class="help-page">
            <h4 class="help-title">🎯 完整示例</h4>
            <div class="example-content">
              <div class="example-group">
                <div class="example-title">📁 项目文档管理</div>
                <div class="example-code">
                  <div class="code-label">模板：</div>
                  <code class="code-block">项目文档/&lt;date.now:YYYY&gt;/&lt;date.now:MM&gt;/DOC_&lt;time.now:HH-mm&gt;_&lt;####&gt;</code>
                </div>
                <div class="example-result">
                  <div class="result-label">结果：</div>
                  <div class="result-text">项目文档/2024/01/DOC_15-30_0001.pdf</div>
                </div>
                <div class="example-desc">自动创建年月目录结构，规范化文档命名</div>
              </div>

              <div class="divider"></div>

              <div class="example-group">
                <div class="example-title">🎨 设计稿版本控制</div>
                <div class="example-code">
                  <div class="code-label">模板：</div>
                  <code class="code-block">&lt;name&gt;/v&lt;##&gt;/&lt;name:lower&gt;_&lt;date.now:YYYYMMDDHHmm&gt;</code>
                </div>
                <div class="example-result">
                  <div class="result-label">结果：</div>
                  <div class="result-text">Homepage/v01/homepage_202401201530.psd</div>
                </div>
                <div class="example-desc">按版本号组织设计稿，包含详细时间戳</div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-dialog>

  <!-- 正则表达式帮助对话框 -->
  <el-dialog
    v-model="regexHelpVisible"
    title="正则表达式使用帮助"
    width="800px"
    :close-on-click-modal="true"
  >
    <el-carousel height="400px" :interval="4000" indicator-position="outside">
      <!-- 示例1：基础替换 -->
      <el-carousel-item>
        <div class="help-slide">
          <h3>基础替换示例</h3>
          <div class="example-box">
            <div class="example-item">
              <div class="code-block">
                <p>原文件名：report2024.pdf</p>
                <p>正则表达式：report(\d+)</p>
                <p>替换内容：文档_$1</p>
              </div>
              <div class="result-block">
                <el-icon><ArrowDown /></el-icon>
                <p>结果：文档_2024.pdf</p>
              </div>
            </div>
            <div class="example-desc">
              说明：将"report"替换为"文档_"，并保留后面的数字
            </div>
          </div>
        </div>
      </el-carousel-item>

      <!-- 示例2：日期格式转换 -->
      <el-carousel-item>
        <div class="help-slide">
          <h3>日期格式转换示例</h3>
          <div class="example-box">
            <div class="example-item">
              <div class="code-block">
                <p>原文件名：2024-01-20.jpg</p>
                <p>正则表达式：(\d{4})-(\d{2})-(\d{2})</p>
                <p>替换内容：$1年$2月$3日</p>
              </div>
              <div class="result-block">
                <el-icon><ArrowDown /></el-icon>
                <p>结果：2024年01月20日.jpg</p>
              </div>
            </div>
            <div class="example-desc">
              说明：将短横线日期格式转换为中文日期格式
            </div>
          </div>
        </div>
      </el-carousel-item>

      <!-- 示例3：序号提取 -->
      <el-carousel-item>
        <div class="help-slide">
          <h3>序号提取示例</h3>
          <div class="example-box">
            <div class="example-item">
              <div class="code-block">
                <p>原文件名：IMG_20240120_001.jpg</p>
                <p>正则表达式：IMG_\d+_(\d+)</p>
                <p>替换内容：图片_$1</p>
              </div>
              <div class="result-block">
                <el-icon><ArrowDown /></el-icon>
                <p>结果：图片_001.jpg</p>
              </div>
            </div>
            <div class="example-desc">
              说明：提取文件名中的序号部分
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </el-dialog>

  <!-- 添加自定义JS帮助对话框 -->
  <el-dialog
    v-model="jsHelpVisible"
    title="自定义JS使用帮助"
    width="800px"
    :close-on-click-modal="true"
    class="js-help-dialog"
  >
    <el-carousel 
      height="600px"
      indicator-position="outside"
      :autoplay="false"
      trigger="click"
    >
      <!-- 修改基础介绍轮播页 -->
      <el-carousel-item>
        <div class="help-page">
          <h3 class="page-title">🚀 自定义JS简介</h3>
          <div class="intro-content">
            <!-- 功能说明卡片 -->
            <div class="feature-card">
              <h4>💡 功能说明</h4>
              <p>自定义JS是一个强大的重命名工具，它允许您：</p>
              <ul class="feature-list">
                <li>✨ 通过编写JavaScript代码实现复杂的重命名逻辑</li>
                <li>🔄 批量处理多个文件，每个文件独立调用一次</li>
                <li>📊 访问文件的详细信息（大小、修改时间等）</li>
                <li>🎯 实现其他重命名规则无法完成的自定义需求</li>
              </ul>
            </div>

            <!-- 参数说明卡片 -->
            <div class="feature-card">
              <h4>📝 参数说明</h4>
              <div class="params-table">
                <table>
                  <thead>
                    <tr>
                      <th>参数名</th>
                      <th>类型</th>
                      <th>说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>name</code></td>
                      <td>string</td>
                      <td>完整文件名（根据设置可能包含或不包含后缀）</td>
                    </tr>
                    <tr>
                      <td><code>nameWithoutExt</code></td>
                      <td>string</td>
                      <td>不含后缀的文件名</td>
                    </tr>
                    <tr>
                      <td><code>extension</code></td>
                      <td>string</td>
                      <td>后缀名（包含点，如 ".jpg"）</td>
                    </tr>
                    <tr>
                      <td><code>modifyTime</code></td>
                      <td>number</td>
                      <td>文件修改时间（毫秒时间戳）</td>
                    </tr>
                    <tr>
                      <td><code>size</code></td>
                      <td>number</td>
                      <td>文件大小（字节）</td>
                    </tr>
                    <tr>
                      <td><code>index</code></td>
                      <td>number</td>
                      <td>文件在列表中的序号（从0开始）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 使用提示卡片 -->
            <div class="feature-card">
              <h4>📌 使用提示</h4>
              <div class="tips-content">
                <div class="tip-item">
                  <h5>🎯 返回值说明</h5>
                  <p>函数必须返回一个字符串作为新文件名：</p>
                  <ul>
                    <li>默认情况下返回不含后缀的文件名</li>
                    <li>勾选"同时处理后缀名"时需返回完整文件名</li>
                    <li>返回空值或undefined将跳过该文件</li>
                  </ul>
                </div>
                <div class="tip-item">
                  <h5>⚠️ 注意事项</h5>
                  <ul>
                    <li>代码在本地执行，注意文件名合法性</li>
                    <li>避免使用特殊字符（\ / : * ? " < > |）</li>
                    <li>建议先使用少量文件测试</li>
                    <li>可以使用console.log()调试</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 安全提示卡片 -->
            <div class="feature-card">
              <h4>🔒 安全提示</h4>
              <div class="security-content">
                <p class="security-warning">
                  <el-icon><Warning /></el-icon>
                  所有操作均在本地执行，但请注意：
                </p>
                <ul>
                  <li>请勿运行来源不明的代码</li>
                  <li>代码应只包含文件名处理逻辑</li>
                  <li>不建议使用网络请求相关API</li>
                  <li>使用AI生成的代码时需要仔细检查</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <!-- 基础示例 -->
      <el-carousel-item>
        <div class="help-page">
          <h3 class="page-title">📚 基础示例</h3>
          <div class="example-section">
            <div class="example-card">
              <h4>🔄 转换大小写</h4>
              <pre class="code-block">
function rename(options) {
  const { nameWithoutExt } = options;
  return nameWithoutExt.toUpperCase();
}</pre>
              <div class="example-result">
                <p>输入：photo.jpg</p>
                <p>输出：PHOTO.jpg</p>
              </div>
            </div>
            <div class="example-card">
              <h4>🔢 添加序号</h4>
              <pre class="code-block">
function rename(options) {
  const { nameWithoutExt, index } = options;
  return `${String(index + 1).padStart(3, '0')}_${nameWithoutExt}`;
}</pre>
              <div class="example-result">
                <p>输入：photo.jpg</p>
                <p>输出：001_photo.jpg</p>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <!-- 进阶示例 -->
      <el-carousel-item>
        <div class="help-page">
          <h3 class="page-title">🎯 进阶示例</h3>
          <div class="example-section">
            <div class="example-card">
              <h4>📅 添加日期前缀</h4>
              <pre class="code-block">
function rename(options) {
  const { nameWithoutExt, modifyTime } = options;
  const date = new Date(modifyTime);
  const dateStr = date.toISOString().split('T')[0];
  return `${dateStr}_${nameWithoutExt}`;
}</pre>
              <div class="example-result">
                <p>输入：photo.jpg</p>
                <p>输出：2024-01-20_photo.jpg</p>
              </div>
            </div>
            <div class="example-card">
              <h4>📏 文件大小标记</h4>
              <pre class="code-block">
function rename(options) {
  const { nameWithoutExt, size } = options;
  const sizeInMB = (size / (1024 * 1024)).toFixed(1);
  return `${nameWithoutExt}_${sizeInMB}MB`;
}</pre>
              <div class="example-result">
                <p>输入：document.pdf</p>
                <p>输出：document_2.5MB.pdf</p>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>

      <!-- AI提示使用 -->
      <el-carousel-item>
        <div class="help-page">
          <h3 class="page-title">🤖 AI助手使用指南</h3>
          <div class="ai-guide">
            <div class="prompt-template">
              <h4>💬 AI提示模板</h4>
              <pre class="code-block">
我正在使用 javascript 进行文件的批量重命名工作，请帮我完成以下需求：

需求描述：[在这里描述您的需求]
示例：
  输入文件名：example.jpg
  期望输出：[描述期望的输出格式]

函数模板：
function rename(options) {
  const {name, nameWithoutExt, extension, modifyTime, size, index} = options;
  // 请在这里补充代码
  return name;
}</pre>
            </div>
            <div class="prompt-example">
              <h4>🌟 示例提示</h4>
              <div class="example-content">
                <p>"请帮我写一个重命名函数，要求：</p>
                <ol>
                  <li>在文件名前添加三位数序号</li>
                  <li>添加当前日期作为前缀</li>
                  <li>所有空格替换为下划线"</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted} from 'vue'
import { useFileStore } from '@/stores/file'
import { useHistoryStore } from '@/stores/historyStore'
import { storeToRefs } from 'pinia'
import type { FileWithHandle, ProcessedFile, FilterCondition, ProcessForm } from '@/types/files'
import { RenameProcessor, type ProcessForm as RenameProcessForm } from '@/utils/renameRules'
import { UploadFilled, QuestionFilled, RefreshRight, Delete, Back, Right, Check, ArrowDown, Warning } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import VirtualFileList from '@/components/VirtualFileList.vue'
import { homeDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/api/dialog'
import { invoke } from '@tauri-apps/api'
import { onMounted } from 'vue'
import { listen } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window'
import { useRouter } from 'vue-router'


// 初始化 stores
const historyStore = useHistoryStore()
const fileStore = useFileStore()
const { files } = storeToRefs(fileStore)

const filteredFileList = ref<ProcessedFile[]>([])
const activeFilters = ref<FilterCondition[]>([])
const previewMode = ref('preview')
const selectedFiles = ref<FileWithHandle[]>([])
const isProcessingSelected = ref(false)
// 添加 canUndo 和 canRedo 计算属性
const canUndo = computed(() => historyStore.undoStack.length > 0)
const canRedo = computed(() => historyStore.redoStack.length > 0)

const processForm = ref<ProcessForm>({
  replace: {
    enabled: false,
    processExt: false,
    ignoreCase: false,
    type: 'specific',
    searchText: '',
    replaceText: '',
    count: 1,
    position: 1
  },
  insert: {
    enabled: false,
    processExt: false,
    type: 'text',
    position: 'start',
    charPosition: 1,
    searchString: '',
    text: '',
    sequenceType: 'arabic',
    startNumber: 1,
    digits: 3,
    prefix: '',
    suffix: ''
  },
  sequence: {
    enabled: false,
    processExt: false,
    groupIndex: 1,
    targetLength: 2,
    fillChar: '0'
  },
  newName: {
    enabled: false,
    processExt: false,
    template: ''
  },
  regex: {
    enabled: false,
    processExt: false,
    pattern: '',
    replacement: '',
    useGlobal: true,
    ignoreCase: false
  },
  customJS: {
    enabled: false,
    processExt: false,
    code: ''
  }
})

const activeProcessTab = ref('replace')
const showPath = ref(false)

const filterFields = [
  { label: '文件名', value: 'name' },
  { label: '后缀名', value: 'extension' },
  { label: '大小', value: 'size' },
  { label: '修改时间', value: 'lastModified' }
]

const conditionMap: Record<string, string> = {
  'contains': '包含',
  'notContains': '不包含',
  'startsWith': '开头是',
  'endsWith': '结尾是',
  'equals': '等于',
  'gt': '大于',
  'gte': '大于等于',
  'lt': '小于',
  'lte': '小于等于',
  'between': '介于',
  'after': '晚于',
  'before': '早于'
}

const filterForm = ref<FilterCondition>({
  type: 'include',
  field: 'name',  // 默认选择"文件名"
  condition: 'contains',
  value: '',
  ignoreCase: true,
  startDate: '',
  endDate: '',
  sizeValue: 0,
  sizeUnit: 'MB'
})

const tableData = ref<ProcessedFile[]>([])

const hasFiles = computed(() => files.value?.length > 0)
const hasFilteredFiles = computed(() => filteredFileList.value?.length > 0)


const fileCount = computed(() => files.value?.length || 0)

let isFileDialogOpen = false

const handleFileSelect = async () => {
  if (isFileDialogOpen) return
  try {
    isFileDialogOpen = true
    const selected = await open({
      multiple: true,
      directory: false,
      filters: [{
        name: '所有文件',
        extensions: []
      }],
      defaultPath: await homeDir()
    }) as string | string[] | null

    if (!selected) {
      ElMessage.info('未选择文件')
      return
    }

    const existingPaths = new Set(fileStore.files.map(file => `${file.path}/${file.name}`))
    const files: FileWithHandle[] = []
    const selectedFiles = Array.isArray(selected) ? selected : [selected]
    let duplicateCount = 0
    
    for (const filePath of selectedFiles) {
      try {
        const pathParts = filePath.split(/[/\\]/)
        const fileName = pathParts[pathParts.length - 1]
        const filePath2 = pathParts.slice(0, -1).join('/')
        const fullPath = `${filePath2}/${fileName}`

        // 检查文件是否已存在
        if (existingPaths.has(fullPath)) {
          duplicateCount++
          continue
        }

        // 使用标准的 Tauri fs API
        const metadata = await invoke('tauri', { 
          cmd: 'get_file_metadata',
          path: filePath 
        }) as { size: number, modifiedAt: string }
        
        // 确保修改时间是有效的时间戳
        let lastModified = Date.now()
        if (metadata.modifiedAt) {
          const modifiedDate = new Date(metadata.modifiedAt)
          if (!isNaN(modifiedDate.getTime())) {
            lastModified = modifiedDate.getTime()
          }
        }
        
        const file: FileWithHandle = {
          name: fileName,
          path: filePath2,
          size: metadata.size ?? 0,
          lastModified,
          type: fileName.split('.').pop() ?? '',
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          slice: () => new Blob(),
          stream: () => new ReadableStream(),
          text: () => Promise.resolve('')
        }
        files.push(file)
      } catch (error) {
        console.error('处理文件失败:', error)
        ElMessage.error(`处理文件失败: ${(error as Error).message}`)
      }
    }

    if (duplicateCount > 0) {
      ElMessage.warning(`${duplicateCount} 个文件已存在,已自动跳过`)
    }

    if (files.length > 0) {
      fileStore.addFiles(files)
      ElMessage.success(`成功导入 ${files.length} 个文件`)
    } else if (duplicateCount === selectedFiles.length) {
      ElMessage.info('所选文件均已存在,未导入任何文件')
    }
  } catch (error) {
    if ((error as { name?: string }).name !== 'AbortError') {
      console.error('选择文件失败:', error)
      ElMessage.error(`选择文件失败: ${(error as Error).message}`)
    }
  } finally {
    setTimeout(() => {
      isFileDialogOpen = false
    }, 1000)
  }
}

const handleSelectFolder = async () => {
  if (isFileDialogOpen) return
  try {
    isFileDialogOpen = true
    const selected = await open({
      directory: true,
      multiple: false,
      defaultPath: await homeDir()
    })

    if (!selected) {
      ElMessage.info('未选择文件夹')
      return
    }

    const existingPaths = new Set(fileStore.files.map(file => `${file.path}/${file.name}`))
    let duplicateCount = 0

    // 使用 read_dir 命令获取文件列表
    const entries = await invoke('read_dir', { 
      path: selected
    }) as any[]

    const files: FileWithHandle[] = []

    for (const entry of entries) {
      if (!entry.is_dir) {
        const fullPath = `${entry.path}/${entry.name}`
        
        // 检查文件是否已存在
        if (existingPaths.has(fullPath)) {
          duplicateCount++
          continue
        }

        // 确保修改时间是有效的时间戳
        let lastModified = Date.now()
        if (entry.modified_at) {
          const modifiedDate = new Date(entry.modified_at)
          if (!isNaN(modifiedDate.getTime())) {
            lastModified = modifiedDate.getTime()
          }
        }

        files.push({
          name: entry.name,
          path: entry.path,
          size: entry.size ?? 0,
          lastModified,
          type: entry.name.split('.').pop() ?? '',
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          slice: () => new Blob(),
          stream: () => new ReadableStream(),
          text: () => Promise.resolve('')
        })
      }
    }

    if (duplicateCount > 0) {
      ElMessage.warning(`${duplicateCount} 个文件已存在,已自动跳过`)
    }

    if (files.length > 0) {
      fileStore.addFiles(files)
      ElMessage.success(`成功导入 ${files.length} 个文件`)
    } else if (duplicateCount === entries.filter(e => !e.is_dir).length) {
      ElMessage.info('所选文件夹中的文件均已存在,未导入任何文件')
    } else {
      ElMessage.warning('所选文件夹中没有找到文件')
    }

  } catch (error) {
    ElMessage.error(`处理文件夹失败: ${error}`)
  } finally {
    setTimeout(() => {
      isFileDialogOpen = false
    }, 1000)
  }
}



const handleSelectionChange = (selection: ProcessedFile[]) => {
  // console.log('选择变化:', selection) // 添加日志查看选择变化
  selectedFiles.value = selection
}

const removeSelectedFiles = () => {
  if (!selectedFiles.value.length) return
  
  // 先保存选中的文件数量
  const deletedCount = selectedFiles.value.length
  
  // 从文件存储中移除选中的文件
  const remainingFiles = fileStore.files.filter(file => {
    return !selectedFiles.value.some(selected => 
      selected.name === file.name && selected.path === file.path
    )
  })
  
  fileStore.$patch({ files: remainingFiles })
  
  // 清空选中状态
  selectedFiles.value = []
  
  // 刷新文件列表
  refreshFileList()
  
  // 使用保存的数量显示消息
  ElMessage.success(`已排除${deletedCount} 个文件`)
}

watch(() => files.value, (newFiles) => {
  // 确保所有文件都被加载到表格中
  const processor = new RenameProcessor(processForm.value as RenameProcessForm)
  
  let files: FileWithHandle[] = [...newFiles]
  if (activeFilters.value?.length) {
    files = files.filter(file => {
      return activeFilters.value.every(filter => {
        if (!filter) return true
        const matchesFilter = applyFilter(file, filter)
        return filter.type === 'include' ? matchesFilter : !matchesFilter
      })
    })
  }

  // 更新过滤后的文件列表
  filteredFileList.value = files.map((file, index) => ({
    ...file,
    newName: processor.processFileName(file.name, index)
  })) as ProcessedFile[]

  // 更新表格数据
  tableData.value = filteredFileList.value
}, { deep: true, immediate: true })

watch([processForm, activeFilters], () => {
  nextTick(refreshFileList)
}, { deep: true })

// 检查字符串条件
function checkStringCondition(value: string, pattern: string, condition: string, ignoreCase: boolean) {
  if (ignoreCase) {
    value = value.toLowerCase()
    pattern = pattern.toLowerCase()
  }
  
  switch (condition) {
    case 'contains':
      return value.includes(pattern)
    case 'notContains':
      return !value.includes(pattern)
    case 'startsWith':
      return value.startsWith(pattern)
    case 'endsWith':
      return value.endsWith(pattern)
    case 'equals':
      return value === pattern
    default:
      return true
  }
}

// 检查大小条件
function checkSizeCondition(fileSize: number, targetSize: number, condition: string, unit: string) {
  const unitMultiplier: Record<string, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  }
  
  const targetBytes = targetSize * (unitMultiplier[unit] || 1)
  
  switch (condition) {
    case 'gt': return fileSize > targetBytes
    case 'gte': return fileSize >= targetBytes
    case 'lt': return fileSize < targetBytes
    case 'lte': return fileSize <= targetBytes
    case 'equals': return fileSize === targetBytes
    default: return true
  }
}

// 检查时间条件
function checkTimeCondition(fileTime: number, filter: FilterCondition) {
  const fileDate = new Date(fileTime)
  
  switch (filter.condition) {
    case 'between':
      const startDate = filter.startDate ? new Date(filter.startDate) : null
      const endDate = filter.endDate ? new Date(filter.endDate) : null
      return (!startDate || fileDate >= startDate) && (!endDate || fileDate <= endDate)
    case 'after':
      return fileDate >= new Date(filter.startDate as string)
    case 'before':
      return fileDate <= new Date(filter.endDate as string)
    default:
      return true
  }
}

// 修改文件过滤逻辑中的时间判断
function addFilter() {
  // 验证是否为空
  if (filterForm.value.field === 'size') {
    if (filterForm.value.sizeValue === undefined || filterForm.value.sizeValue === null) {
      ElMessage.warning('请输入文件大小值')
      return
    }
  } else if (filterForm.value.field === 'lastModified') {
    if (!filterForm.value.startDate && !filterForm.value.endDate) {
      ElMessage.warning('请至少选择一个时间')
      return
    }
    // 根据输入的时间设置对应的条件
    if (filterForm.value.startDate && filterForm.value.endDate) {
      filterForm.value.condition = 'between'
    } else if (filterForm.value.startDate) {
      filterForm.value.condition = 'after'
    } else {
      filterForm.value.condition = 'before'
    }
  } else if (!filterForm.value.value && filterForm.value.field !== 'size' && filterForm.value.field !== 'lastModified') {
    ElMessage.warning('请输入过滤条件的值')
    return
  }

  // 检查是否存在相同字段的条件
  const existingFilter = activeFilters.value.find(filter => 
    filter.field === filterForm.value.field
  )

  if (existingFilter) {
    const fieldMap: Record<string, string> = {
      'size': '文件大小',
      'lastModified': '修改时间',
      'name': '文件名',
      'path': '目录'
    }
    ElMessage.warning(`已存在${fieldMap[filterForm.value.field]}的过滤条件，请先删除原有条件`)
    return
  }

  const filter: FilterCondition = {
    type: filterForm.value.type,
    field: filterForm.value.field,
    condition: filterForm.value.condition,
    value: filterForm.value.value,
    ignoreCase: filterForm.value.ignoreCase
  }

  if (filterForm.value.field === 'size') {
    filter.sizeValue = filterForm.value.sizeValue
    filter.sizeUnit = filterForm.value.sizeUnit
  } else if (filterForm.value.field === 'lastModified') {
    filter.startDate = filterForm.value.startDate
    filter.endDate = filterForm.value.endDate
  }

  activeFilters.value.push(filter)
  
  // 重置表单
  filterForm.value = {
    type: 'include',
    field: 'name',  // 重置为"文件名"
    condition: 'contains',
    value: '',
    ignoreCase: true,
    startDate: '',
    endDate: '',
    sizeValue: 0,
    sizeUnit: 'MB'
  }

  ElMessage.success('添加过滤条件成功')
}

// 修改过滤条件描述文本
function getFilterLabel(filter: FilterCondition) {
  const fieldLabel = filterFields.find(f => f.value === filter.field)?.label || filter.field
  let conditionText = conditionMap[filter.condition] || filter.condition
  let valueText = ''

  switch (filter.field) {
    case 'size':
      valueText = `${filter.sizeValue}${filter.sizeUnit}`
      break
    case 'lastModified':
      if (filter.condition === 'between') {
        valueText = `${filter.startDate} 至 ${filter.endDate}`
      } else if (filter.condition === 'after') {
        valueText = filter.startDate as string
      } else {
        valueText = filter.endDate as string
      }
      break
    default:
      valueText = filter.value.toString()
  }

  return `${fieldLabel} ${conditionText} ${valueText}`
}

// 监听 field 变化，设置对应的默认条件
watch(() => filterForm.value.field, (newField) => {
  switch (newField) {
    case 'size':
      filterForm.value.condition = 'gt'
      break
    case 'lastModified':
      filterForm.value.condition = 'between'
      break
    default:
      filterForm.value.condition = 'contains'
      break
  }
})

// 清除所有过滤规则
function clearFilters() {
  // 清空过滤条件数组
  activeFilters.value = []
  
  // 重置过滤表单
  filterForm.value = {
    type: 'include',
    field: 'name',
    condition: 'contains',
    value: '',
    ignoreCase: true,
    startDate: '',
    endDate: '',
    sizeValue: 0,
    sizeUnit: 'MB'
  }
  
  ElMessage.success('已清除所有过滤规则')
}

// 添加进度相关的状态
const isProcessing = ref(false)
const processProgress = ref(0)
const processStatus = ref<'success' | 'exception' | ''>('')
const processedCount = ref(0)
const totalFiles = ref(0)
const processSpeed = ref('0.00')
const remainingTime = ref('计算中...')
const startTime = ref(0)
// 添加新的状态变量到这里
const isUndoRedoRefreshing = ref(false)

// 更新进度格式化函数
const progressFormat = (percentage: number) => {
  if (processStatus.value === 'success') {
    return '完成'
  } else if (processStatus.value === 'exception') {
    return '失败'
  }
  return `${percentage}%`
}

// 添加计算速度和剩余时间的函数
const updateProcessMetrics = () => {
  const currentTime = Date.now()
  const elapsedTime = (currentTime - startTime.value) / 1000 // 转换为秒
  
  if (elapsedTime > 0) {
    // 计算处理速度（个/秒）
    const speed = processedCount.value / elapsedTime
    processSpeed.value = speed.toFixed(2)
    
    // 计算剩余时间
    if (speed > 0) {
      const remainingFiles = totalFiles.value - processedCount.value
      const remainingSeconds = remainingFiles / speed
      
      // 更精确的时间显示
      if (remainingSeconds < 1) {
        remainingTime.value = '不到1秒'
      } else if (remainingSeconds < 60) {
        remainingTime.value = `${Math.ceil(remainingSeconds)}秒`
      } else if (remainingSeconds < 3600) {
        const minutes = Math.floor(remainingSeconds / 60)
        const seconds = Math.ceil(remainingSeconds % 60)
        remainingTime.value = `${minutes}分${seconds}秒`
      } else {
        const hours = Math.floor(remainingSeconds / 3600)
        const minutes = Math.floor((remainingSeconds % 3600) / 60)
        remainingTime.value = `${hours}小时${minutes}分钟`
      }
    } else {
      remainingTime.value = '计算中...'
    }
  }
}

// 将所有配置常量统一放在文件顶部
const CONFIG = {
  BATCH_SIZE: 200,    // 批处理数据大小
  VISIBLE_ITEMS: 30,  // 可视区域显示的行数
  BATCH_DELAY: 10,    // 批处理延迟时间(ms)
  BUFFER_SIZE: 10,     // 缓冲区大小(额外渲染的行数)
  ITEM_HEIGHT: 40     // 每行高度(px)
} as const;

// 添加进度相关的响应式变量
const progressVisible = ref(false)

const progressText = ref('')
// 修改 handleExecute 函数中保存 rootDirHandle 的部分
const handleExecute = async () => {
  try {
    isProcessing.value = true
    processProgress.value = 0
    processStatus.value = ''
    processedCount.value = 0
    
    const filesToRename = filteredFileList.value.filter(file => file.name !== file.newName)
    totalFiles.value = filesToRename.length

    if (!filesToRename.length) {
      ElMessage.warning('没有可重命名的文件')
      isProcessing.value = false
      return
    }

    progressVisible.value = true
    startTime.value = Date.now()

    const updateInterval = setInterval(() => {
      updateProcessMetrics()
    }, 1000)

    try {
      const results = await Promise.allSettled(
        filesToRename.map(async (file) => {
          try {
            // 使用完整的原始路径
            const oldPath = `${file.path}/${file.name}`.replace(/\/+/g, '/')
            
            
            progressText.value = `正在重命名: ${oldPath} -> ${file.newName}`
            
            await invoke('rename_file', {
              oldPath,
              newName: file.newName
            })

            processedCount.value++
            processProgress.value = Math.round((processedCount.value / totalFiles.value) * 100)
            
            return { success: true, file }
          } catch (error) {
            return { success: false, file, error }
          }
        })
      )

      clearInterval(updateInterval)

      const failures = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.success)
      )

      if (failures.length > 0) {
        const failedFiles = failures.map(failure => {
          if (failure.status === 'rejected') {
            return `${failure.reason.file?.path}/${failure.reason.file?.name}`
          }
          return `${(failure as any).value.file.path}/${(failure as any).value.file.name}`
        })
        ElMessage.warning(`以下文件重命名失败：\n${failedFiles.join('\n')}`)
      } else {
        const successfulFiles = results
          .filter((result): result is PromiseFulfilledResult<{success: true, file: ProcessedFile}> => 
            result.status === 'fulfilled' && result.value.success
          )
          .map(result => ({
            oldName: result.value.file.name,
            newName: result.value.file.newName!,
            path: result.value.file.path
          }))

        historyStore.addNewOperation(successfulFiles)
        fileStore.updateFiles(successfulFiles)
        ElMessage.success('重命名完成')
      }

      processStatus.value = failures.length > 0 ? 'exception' : 'success'
    } catch (error) {
      // console.error('重命名操作失败:', error)
      ElMessage.error('重命名操作失败: ' + error)
      processStatus.value = 'exception'
    } finally {
      clearInterval(updateInterval)
      setTimeout(() => {
        isProcessing.value = false
        progressVisible.value = false
      }, 1500)
    }
  } catch (error) {
    // console.error('执行失败:', error)
    ElMessage.error('执行失败: ' + error)
    isProcessing.value = false
    progressVisible.value = false
  }
}

const handleClear = () => {
  ElMessageBox.confirm(
    '确定要清空所有文件吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    fileStore.clearFiles()
    historyStore.clear()
    ElMessage.success('已清空所有文件')
  }).catch(() => {})
}

const handleRefresh = () => {
  refreshFileList()
  ElMessage.success('刷新成功')
}

const removeFilter = (index: number) => {
  if (!activeFilters.value) return
  activeFilters.value = activeFilters.value.filter((_, i) => i !== index)
  nextTick(() => {
    refreshFileList()
  })
}

// 修改 refreshFileList 函数
function refreshFileList() {
  // console.log('开始刷新文件列表')
  // console.log('当前文件存储状态:', fileStore.files)
  
  if (!files.value?.length) {
    filteredFileList.value = []
    tableData.value = []
    // console.log('文件列表为空，已清空表格')
    return
  }

  // 如果正在进行撤销或重做操作的后续处理，保持当前的文件名
  if (isUndoRedoRefreshing.value) {
    // console.log('正在处理撤销/重做操作的后续处理，保持当前文件名')
    return
  }

  const processor = new RenameProcessor(processForm.value as RenameProcessForm)
  
  let fileList: FileWithHandle[] = [...files.value]
  // console.log('处理前的文件列表:', files)
  
  if (activeFilters.value?.length) {
    fileList = fileList.filter(file => {
      return activeFilters.value.every(filter => {
        if (!filter) return true
        const matchesFilter = applyFilter(file, filter)
        return filter.type === 'include' ? matchesFilter : !matchesFilter
      })
    })
    // console.log('过滤后的文件列表:', files)
  }

  // 更新过滤后的文件列表
  filteredFileList.value = fileList.map((file, index) => ({
    ...file,
    name: file.name, // 使用存储中的当前文件名
    newName: processor.processFileName(file.name, index) // 基于当前文件名计算新文件名
  })) as ProcessedFile[]

  // 更新表格数据
  tableData.value = [...filteredFileList.value]
  // console.log('更新后的表格数据:', tableData.value)
}

// 过滤器应用函数
function applyFilter(file: FileWithHandle, filter: FilterCondition): boolean {
  switch (filter.field) {
    case 'name': {
      const name = file.name.substring(0, file.name.lastIndexOf('.') || file.name.length)
      return checkStringCondition(name, filter.value.toString(), filter.condition, filter.ignoreCase ?? true)
    }
    case 'extension': {
      const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.') + 1) : ''
      return checkStringCondition(ext, filter.value.toString(), filter.condition, filter.ignoreCase ?? true)
    }
    case 'size':
      return checkSizeCondition(file.size, filter.sizeValue || 0, filter.condition, filter.sizeUnit || 'B')
    case 'lastModified':
      return checkTimeCondition(file.lastModified, filter)
    case 'path':
      return checkStringCondition(file.path, filter.value.toString(), filter.condition, filter.ignoreCase ?? true)
    default:
      return true
  }
}

// 修改撤销功能
const handleUndo = async () => {
  try {
    const lastOperation = historyStore.getLastOperation()
    if (lastOperation) {
      isProcessing.value = true
      processProgress.value = 0
      processStatus.value = ''
      processedCount.value = 0
      totalFiles.value = lastOperation.length
      progressVisible.value = true
      startTime.value = Date.now()

      const updateInterval = setInterval(() => {
        updateProcessMetrics()
      }, 1000)

      try {
        // 并行执行文件重命名操作
        const results = await Promise.allSettled(
          lastOperation.map(async (record) => {
            const params = {
              oldPath: `${record.path}/${record.oldName}`,
              newPath: `${record.path}/${record.newName}`,
              oldName: record.oldName,
              newName: record.newName
            }
            
            progressText.value = `正在撤销: ${params.newPath} -> ${params.oldPath}`
            
            await invoke('rename_file', params)
            
            // 更新 fileStore 中的文件名
            const fileIndex = fileStore.files.findIndex(
              file => file.name === record.oldName && file.path === record.path
            )
            if (fileIndex !== -1) {
              fileStore.files[fileIndex].name = record.newName
            }

            processedCount.value++
            processProgress.value = Math.round((processedCount.value / totalFiles.value) * 100)
            
            return { success: true }
          })
        )

        const failures = results.filter(result => result.status === 'rejected')
        
        if (failures.length > 0) {
          processStatus.value = 'exception'
          throw new Error('部分文件撤销失败')
        }

        historyStore.undo()
        processStatus.value = 'success'
        ElMessage.success('撤销成功')
      } catch (error) {
        processStatus.value = 'exception'
        throw error
      } finally {
        clearInterval(updateInterval)
        setTimeout(() => {
          isProcessing.value = false
          progressVisible.value = false
        }, 1500)
      }
    }
  } catch (error) {
    console.error('撤销失败:', error)
    ElMessage.error(`撤销失败: ${error}`)
  }
}

// 修改重做功能
const handleRedo = async () => {
  try {
    const nextOperation = historyStore.getNextOperation()
    if (nextOperation) {
      isProcessing.value = true
      processProgress.value = 0
      processStatus.value = ''
      processedCount.value = 0
      totalFiles.value = nextOperation.length
      progressVisible.value = true
      startTime.value = Date.now()

      const updateInterval = setInterval(() => {
        updateProcessMetrics()
      }, 1000)

      try {
        // 并行执行文件重命名操作
        const results = await Promise.allSettled(
          nextOperation.map(async (record) => {
            const params = {
              oldPath: `${record.path}/${record.oldName}`,
              newPath: `${record.path}/${record.newName}`,
              oldName: record.oldName,
              newName: record.newName
            }
            
            progressText.value = `正在重做: ${params.oldPath} -> ${params.newPath}`
            
            await invoke('rename_file', params)
            
            // 更新 fileStore 中的文件名
            const fileIndex = fileStore.files.findIndex(
              file => file.name === record.oldName && file.path === record.path
            )
            if (fileIndex !== -1) {
              fileStore.files[fileIndex].name = record.newName
            }

            processedCount.value++
            processProgress.value = Math.round((processedCount.value / totalFiles.value) * 100)
            
            return { success: true }
          })
        )

        const failures = results.filter(result => result.status === 'rejected')
        
        if (failures.length > 0) {
          processStatus.value = 'exception'
          throw new Error('部分文件重做失败')
        }

        historyStore.redo()
        processStatus.value = 'success'
        ElMessage.success('重做成功')
      } catch (error) {
        processStatus.value = 'exception'
        throw error
      } finally {
        clearInterval(updateInterval)
        setTimeout(() => {
          isProcessing.value = false
          progressVisible.value = false
        }, 1500)
      }
    }
  } catch (error) {
    ElMessage.error(`重做失败: ${error}`)
  }
}

filteredFileList.value = files.value.map(file => ({
  ...file,
  name: file.name,
  newName: file.name,
  directory: file.path.split('/').slice(0, -1).join('/'),
  isSelected: false,
  relativePath: file.path
})) as ProcessedFile[]
        

// 添加控制 popover 显示的变量
const helpVisible = ref(false)

declare global {
  interface Window {
    showOpenFilePicker: (options?: {
      multiple?: boolean;
      startIn?: FileSystemDirectoryHandle;
    }) => Promise<FileSystemFileHandle[]>;
    showDirectoryPicker: (options?: { 
      mode?: 'read' | 'readwrite' 
    }) => Promise<FileSystemDirectoryHandle>;
    requestIdleCallback: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number
  }
  
  interface FileSystemDirectoryHandle {
    values: () => AsyncIterableIterator<FileSystemHandle>;
    getFileHandle: (name: string, options?: { create?: boolean }) => Promise<FileSystemFileHandle>;
    removeEntry: (name: string, options?: FileSystemRemoveOptions) => Promise<void>;
  }
  
  interface FileSystemFileHandle {
    getFile: () => Promise<File>;
    move: (newName: string) => Promise<void>;
    getParentDirectory: () => Promise<FileSystemDirectoryHandle | null>;
    createWritable: (options?: FileSystemCreateWritableOptions) => Promise<FileSystemWritableFileStream>;
    getParent: () => Promise<FileSystemDirectoryHandle | null>;
  }
  
  interface FileSystemHandle {
    readonly kind: 'file' | 'directory';
    readonly name: string;
  }

  interface FileSystemWritableFileStream extends WritableStream {
    write: (data: FileSystemWriteChunkType) => Promise<void>;
    close: () => Promise<void>;
  }
}

const regexHelpVisible = ref(false)

const showRegexHelp = () => {
  regexHelpVisible.value = true
}

// 添加排序相关的状态
const sortConfig = ref({
  prop: '',
  order: null as 'ascending' | 'descending' | null
})

// 处理排序变化
const handleSortChange = (config: { prop: string; order: 'ascending' | 'descending' | null }) => {
  sortConfig.value = {
    prop: config.prop,
    order: config.order
  }
}

// 文件元数据接口
interface FileMeta {
  handle: FileSystemFileHandle;
  originalName: string;
  newName?: string;
  status: 'pending' | 'processing' | 'renamed' | 'failed';
  path: string;
  size?: number;
  lastModified?: number;
}

// 文件映射表
const fileMap = new Map<string, FileMeta>();

// 优化的文件加载函数
const loadDirectoryContent = async (dirHandle: FileSystemDirectoryHandle, parentPath = ''): Promise<FileMeta[]> => {
  const entries: FileMeta[] = [];
  try {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const path = parentPath ? `${parentPath}/${entry.name}` : entry.name;
        const fileMeta: FileMeta = {
          handle: entry as FileSystemFileHandle,
          originalName: entry.name,
          status: 'pending',
          path: path
        };
        fileMap.set(path, fileMeta);
        entries.push(fileMeta);
      } else if (entry.kind === 'directory') {
        const newPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
        const subEntries = await loadDirectoryContent(entry as FileSystemDirectoryHandle, newPath);
        entries.push(...subEntries);
      }
    }
  } catch (error) {
    // console.error('加载目录内容失败:', error);
    ElMessage.error('加载目录内容失败');
  }
  return entries;
};

const virtualListRef = ref() // 添加对VirtualFileList组件的引用
// 处理全选
const handleSelectAll = () => {
  if (virtualListRef.value) {
    virtualListRef.value.selectAll()
  }
}

// 添加对话框控制变量
const jsHelpVisible = ref(false)
// 添加显示帮助的方法
const showJsHelp = () => {
  jsHelpVisible.value = true
}

const handleDeselectAll = () => {
  if (virtualListRef.value) {
    virtualListRef.value.deselectAll()
  }
}

// 添加拖拽状态
const isDragging = ref(false)

// 处理拖拽进入
const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
  console.log('文件拖入')
}

// 处理拖拽悬停
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  // 明确指示这是一个复制操作
  event.dataTransfer!.dropEffect = 'copy'
  isDragging.value = true
  console.log('文件悬停中')
}

// 处理拖拽离开
const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
    isDragging.value = false
    console.log('文件离开区域')
  }
}

onMounted(async () => {
  const router = useRouter()
  
  // 确保当前在 BatchRename 页面再执行操作
  const ensureInBatchRename = async (callback: () => void | Promise<void>) => {
    // 如果当前不在 BatchRename 页面，先跳转
    if (router.currentRoute.value.path !== '/batch-rename') {
      await router.push('/batch-rename')
      // 等待路由跳转完成
      await nextTick()
    }
    await callback() // 执行传入的回调函数
  }

  // 创建一个全局锁对象来管理所有事件的执行状态
  const locks = {
    isImporting: false,
    isExecuting: false,
    isClearing: false,
    isProcessing: false
  }

  // 包装文件选择处理函数
  const handleFileSelectWrapper = async () => {
    if (locks.isImporting) return
    try {
      locks.isImporting = true
      await handleFileSelect()
    } finally {
      // 延长锁定时间，确保文件选择对话框完全关闭
      setTimeout(() => {
        locks.isImporting = false
      }, 1000)
    }
  }

  // 包装文件夹选择处理函数
  const handleFolderSelectWrapper = async () => {
    if (locks.isImporting) return
    try {
      locks.isImporting = true
      await handleSelectFolder()
    } finally {
      setTimeout(() => {
        locks.isImporting = false
      }, 1000)
    }
  }

  // 添加事件监听器的辅助函数
  const addListener = async (event: string, callback: () => void | Promise<void>, lockKey: keyof typeof locks = 'isProcessing') => {
    const unlisten = await listen(event, async () => {
      if (locks[lockKey]) return
      
      try {
        locks[lockKey] = true
        await ensureInBatchRename(callback)
      } finally {
        setTimeout(() => {
          locks[lockKey] = false
        }, 500)
      }
    })
    return unlisten
  }

  try {
    const unlisteners: (() => void)[] = []

    // 文件操作 - 使用包装后的处理函数
    unlisteners.push(await addListener('menu-import-files', handleFileSelectWrapper))
    unlisteners.push(await addListener('menu-import-folder', handleFolderSelectWrapper))
    unlisteners.push(await addListener('menu-select-all', handleSelectAll))
    unlisteners.push(await addListener('menu-deselect-all', handleDeselectAll))
    unlisteners.push(await addListener('menu-remove-selected', removeSelectedFiles))
    unlisteners.push(await addListener('menu-clear-all', handleClear, 'isClearing'))
    
    // 视图操作
    unlisteners.push(await addListener('menu-preview-mode', () => { previewMode.value = 'preview' }))
    unlisteners.push(await addListener('menu-affected-mode', () => { previewMode.value = 'affected' }))
    unlisteners.push(await addListener('menu-toggle-path', () => { showPath.value = !showPath.value }))
    
    // 重命名操作 - 使用特定的锁
    unlisteners.push(await addListener('menu-execute', handleExecute, 'isExecuting'))
    unlisteners.push(await addListener('menu-undo', handleUndo))
    unlisteners.push(await addListener('menu-redo', handleRedo))

    // 监听文件拖放事件
    const fileDropUnlisten = await appWindow.onFileDropEvent(async (event) => {
      // 如果正在处理其他导入操作，直接返回
      if (locks.isImporting) return

      // 确保在 BatchRename 页面
      if (router.currentRoute.value.path !== '/batch-rename') {
        await router.push('/batch-rename')
        await nextTick()
      }

      if (event.payload.type === 'hover') {
        isDragging.value = true
      } else if (event.payload.type === 'drop') {
        isDragging.value = false
        try {
          locks.isImporting = true
          isProcessingSelected.value = true
          
          // ... 原有的文件拖放处理逻辑保持不变 ...

        } catch (error) {
          console.error('文件处理失败:', error)
          ElMessage.error(`文件处理失败: ${error}`)
        } finally {
          isProcessingSelected.value = false
          setTimeout(() => {
            locks.isImporting = false
          }, 500)
        }
      } else {
        isDragging.value = false
      }
    })
    unlisteners.push(fileDropUnlisten)

    // 组件卸载时清理所有监听器
    onUnmounted(() => {
      unlisteners.forEach(unlisten => unlisten())
    })

  } catch (error) {
    console.error('设置事件监听器失败:', error)
  }
})
</script>

<style scoped>
.batch-rename {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  padding: 16px 0;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-item {
  width: 120px;
}

.filter-input {
  width: 200px;
}

.datetime-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-picker {
  width: 180px;
}

.separator {
  color: #606266;
}

.size-condition {
  width: 100px;
}

.size-input {
  width: 120px;
}

.unit-select {
  width: 80px;
}

.help-icon {
  color: #909399;
  cursor: pointer;
  font-size: 16px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 2px;
}

:deep(.el-input__wrapper) {
  border-radius: 2px;
}

:deep(.el-button) {
  border-radius: 2px;
  height: 32px;
  padding: 0 16px;
}

:deep(.el-checkbox) {
  margin-right: 8px;
}

.process-section {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.upload-area {
  margin: 20px 0;
}

.drop-zone {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 40px 0;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.drop-zone-active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  transform: scale(1.02);
}

.drop-zone-active .upload-icon {
  color: var(--el-color-primary);
  transform: scale(1.1);
}

.upload-icon {
  font-size: 48px;
  color: #909399;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.upload-text {
  color: #606266;
}

.upload-text p {
  margin: 4px 0;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
}

.upload-buttons {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.upload-button {
  font-size: 14px;
  color: var(--el-color-primary);
}

.upload-button:hover {
  color: var(--el-color-primary-light-3);
}

.file-list-container {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.mt-4 { margin-top: 16px; }

.view-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selection-actions {
  display: flex;
  gap: 8px;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-button {
  min-width: 120px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.execute-btn {
  background: var(--el-color-primary);
  border: none;
}

.execute-btn:hover {
  background: var(--el-color-primary-light-3);
}

.clear-btn {
  color: var(--el-color-danger);
  border-color: var(--el-color-danger);
}

.clear-btn:hover {
  color: #fff;
  background: var(--el-color-danger);
  border-color: var(--el-color-danger);
}

.refresh-btn {
  color: var(--el-color-info);
  border-color: var(--el-color-info);
}

.refresh-btn:hover {
  color: #fff;
  background: var(--el-color-info);
  border-color: var(--el-color-info);
}

.filter-tags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  display: flex;
  align-items: center;
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

.filter-tag :deep(.el-tag__close) {
  color: #67c23a;
}

.filter-tag :deep(.el-tag__close:hover) {
  background-color: #67c23a;
  color: #fff;
}

.el-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.el-button [class*="el-icon"] {
  font-size: 16px;
}

/* 当按钮禁用时的样式 */
.el-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.ml-4 {
  margin-left: 16px;
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #67C23A;
  display: inline-block;
}

.operation-buttons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
  border-top: 1px solid var(--el-border-color-light);
}

.history-buttons {
  margin-left: auto;
  margin-right: 16px;
}

:deep(.el-button) {
  padding: 8px 16px;
}

:deep(.el-button [class*=el-icon]+span) {
  margin-left: 6px;
}

/* 修改表格样式 */
:deep(.el-table) {
  --el-table-row-hover-bg-color: #f5f7fa;
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

/* 默认所有行都是白色背景 */
:deep(.el-table__row) {
  background-color: #ffffff !important;
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

/* 表格边框和分割线 */
:deep(.el-table) {
  border: 1px solid var(--el-table-border-color);
}

:deep(.el-table__cell) {
  border-bottom: 1px solid var(--el-table-border-color);
}

/* 表头样式 */
:deep(.el-table__header-wrapper th) {
  background-color: var(--el-table-header-bg-color);
  color: var(--el-text-color-primary);
  font-weight: bold;
}

.view-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.show-path-checkbox {
  margin-left: 16px;
}

.variable-help {
  padding: 0px;
}

.help-page {
  height: 680px;
  padding: 12px;
  overflow-y: auto;
  box-sizing: border-box;
}

.help-title {
  color: var(--el-color-primary);
  margin-bottom: 20px;
  font-size: 25px;
  font-weight: 600;
  text-align: center;
}

.vars-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.var-group {
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 20px;
}

.var-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.var-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0;
}

.var-desc {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.var-tip {
  margin-top: 12px;
  padding: 8px;
  background-color: var(--el-color-info-light-9);
  border-radius: 4px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

code {
  font-family: Monaco, Consolas, monospace;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.code-example {
  display: inline-block;
  margin: 4px 0;
  background-color: var(--el-color-info-light-9);
  color: var(--el-color-info);
}

.example-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
}

.divider {
  display: none;
}

.example-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-block {
  margin: 12px 0;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  padding: 10px 16px;
  border-radius: 6px;
  font-family: Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 3;
  word-break: break-all;
}

.result-text {
  margin: 10px 0;
  background-color: var(--el-fill-color-lighter);
  padding: 12px 16px;
  border-radius: 6px;
  font-family: Monaco, Consolas, monospace;
  font-size: 13px;
  color: var(--el-text-color-primary);
  line-height: 1.5;
}

.code-label, .result-label {
  font-weight: 600;
  color: var(--el-text-color-regular);
  margin: 0px 0;
}

.example-desc {
  margin-top: 12px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 2;
  font-style: italic;
}

.code-primary { background-color: var(--el-color-primary-light-9); color: var(--el-color-primary); }
.code-success { background-color: var(--el-color-success-light-9); color: var(--el-color-success); }
.code-warning { background-color: var(--el-color-warning-light-9); color: var(--el-color-warning); }
.code-info { background-color: var(--el-color-info-light-9); color: var(--el-color-info); }
.code-danger { background-color: var(--el-color-danger-light-9); color: var(--el-color-danger); }

.el-dialog__body {
  padding: 0 !important;
}

.variable-help {
  margin: 0;
  padding: 0;
}

/* 调整对话框样式 */
.variable-help-dialog {
  --el-dialog-padding-primary: 0;
}

.variable-help-dialog .el-dialog__header {
  padding: 20px;
  margin-right: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.variable-help-dialog .el-dialog__body {
  padding: 0 !important;
}

/* 调整轮播图指示器位置 */
.variable-help-dialog .el-carousel__indicators {
  bottom: 20px;
}

/* 美化滚动条 */
.help-page::-webkit-scrollbar {
  width: 6px;
}

.help-page::-webkit-scrollbar-thumb {
  background-color: var(--el-border-color);
  border-radius: 3px;
}

.help-page::-webkit-scrollbar-track {
  background-color: transparent;
}

.help-page {
  padding: 20px;
}

.page-title {
  font-size: 20px;
  margin-bottom: 16px;
  text-align: center;
}

.vars-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.var-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.var-desc {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.format-note {
  margin-top: 12px;
  padding: 8px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

code {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: Monaco, Consolas, monospace;
}

.regex-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-row {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.regex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.help-slide {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
}

.help-slide h3 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--el-color-primary);
  font-size: 20px;
}

.example-box {
  background: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.example-item {
  margin-bottom: 16px;
}

.code-block {
  background: var(--el-bg-color);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.code-block p {
  margin: 8px 0;
  font-family: Monaco, Consolas, monospace;
}

.result-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--el-color-success);
}

.example-desc {
  margin-top: 16px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  font-style: italic;
}

:deep(.el-carousel__item) {
  background-color: var(--el-bg-color);
}

/* 添加进度条样式 */
.progress-section {
  margin: 16px 0;
  padding: 0 16px;
}

.progress-details {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

:deep(.el-progress-bar__inner) {
  transition: width 0.3s ease;
}

:deep(.el-progress__text) {
  font-size: 13px !important;
}

/* 添加排序相关样式 */
:deep(.el-table .caret-wrapper) {
  height: 34px;
}

:deep(.el-table .sort-caret.ascending) {
  top: 5px;
}

:deep(.el-table .sort-caret.descending) {
  bottom: 7px;
}

:deep(.el-table .ascending .sort-caret.ascending) {
  border-bottom-color: var(--el-color-primary);
}

:deep(.el-table .descending .sort-caret.descending) {
  border-top-color: var(--el-color-primary);
}

.progress-container {
  padding: 20px;
}

.progress-text {
  margin-top: 15px;
  text-align: center;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

/* 帮助对话框样式 */
.js-help-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.help-page {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: var(--el-color-primary);
  font-size: 24px;
}

.intro-content, .example-section, .ai-guide {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.feature-card, .example-card {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.code-block {
  background: var(--el-bg-color-page);
  border-radius: 4px;
  padding: 15px;
  margin: 10px 0;
  font-family: monospace;
  white-space: pre-wrap;
  color: var(--el-text-color-primary);
}

.example-result {
  margin-top: 15px;
  padding: 10px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.example-result p {
  margin: 5px 0;
  color: var(--el-text-color-secondary);
}

.prompt-template, .prompt-example {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.example-content {
  margin-top: 15px;
}

.example-content ol {
  padding-left: 20px;
}

.example-content li {
  margin: 5px 0;
  color: var(--el-text-color-secondary);
}

/* 轮播图指示器样式 */
:deep(.el-carousel__indicators) {
  transform: translateY(16px);
}

:deep(.el-carousel__indicator) {
  padding: 12px 4px;
}

:deep(.el-carousel__button) {
  width: 30px;
  height: 3px;
  background-color: var(--el-color-primary);
  opacity: 0.24;
}

:deep(.el-carousel__indicator.is-active button) {
  opacity: 1;
}

/* 添加新的样式 */
.intro-content {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: min-content;
}

.feature-card {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.feature-list li {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.params-table table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

.params-table th,
.params-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.params-table th {
  background-color: var(--el-bg-color);
  font-weight: bold;
}

.params-table code {
  background-color: var(--el-bg-color);
  padding: 2px 4px;
  border-radius: 4px;
  color: var(--el-color-primary);
}

.tips-content,
.security-content {
  margin-top: 10px;
}

.tip-item {
  margin-bottom: 15px;
}

.tip-item h5 {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-item ul,
.security-content ul {
  padding-left: 20px;
  margin: 8px 0;
}

.tip-item li,
.security-content li {
  margin: 5px 0;
  color: var(--el-text-color-secondary);
}

.security-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-color-warning);
  margin-bottom: 10px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .intro-content {
    grid-template-columns: 1fr;
  }
}

.test-section {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}

</style>