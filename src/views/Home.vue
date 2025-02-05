<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section animate__animated animate__fadeIn">
      <h1>欢迎使用 EasyRename</h1>
      <p class="subtitle">简单高效的文件批量重命名工具</p>
    </div>

    <!-- 主要功能区 -->
    <div class="main-content animate__animated animate__fadeInUp">
      <!-- 快速开始卡片 -->
      <el-card class="quick-start-card" shadow="hover">
        <div class="start-content">
          <div class="start-header">
            <el-icon class="start-icon"><Document /></el-icon>
            <h2>快速开始您的重命名之旅</h2>
          </div>
          <div class="start-description">
            <p class="primary-text">一键批量重命名,让文件管理更轻松</p>
            <p class="secondary-text">支持多种重命名方式,实时预览,安全可靠</p>
          </div>
          <div class="start-actions">
            <el-button 
              type="primary" 
              size="large"
              class="start-button"
              @click="$router.push('/batch-rename')"
            >
              立即开始使用
              <el-icon class="start-arrow"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 功能特点网格 -->
      <div class="features-section">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-content">
              <el-icon><Edit /></el-icon>
              <h3>基础重命名</h3>
              <ul>
                <li>添加/删除前缀后缀</li>
                <li>替换指定文本</li>
                <li>添加自定义序号</li>
                <li>修改文件扩展名</li>
              </ul>
            </div>
          </el-card>

          <el-card class="feature-card" shadow="hover">
            <div class="feature-content">
              <el-icon><SetUp /></el-icon>
              <h3>高级功能</h3>
              <ul>
                <li>正则表达式匹配</li>
                <li>批量大小写转换</li>
                <li>自定义日期格式</li>
                <li>多文件同时处理</li>
              </ul>
            </div>
          </el-card>

          <el-card class="feature-card" shadow="hover">
            <div class="feature-content">
              <el-icon><RefreshRight /></el-icon>
              <h3>操作保障</h3>
              <ul>
                <li>实时预览效果</li>
                <li>支持撤销重做</li>
                <li>文件过滤筛选</li>
                <li>安全重命名检查</li>
              </ul>
            </div>
          </el-card>

          <el-card class="feature-card" shadow="hover">
            <div class="feature-content">
              <el-icon><TrendCharts /></el-icon>
              <h3>高效便捷</h3>
              <ul>
                <li>拖拽文件导入</li>
                <li>批量快速处理</li>
                <li>智能命名建议</li>
                <li>操作历史记录</li>
              </ul>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 操作流程图 -->
      <div class="workflow-section">
        <h2 class="section-title">使用流程</h2>
        <div class="workflow-steps">
          <div class="step">
            <div class="step-icon">
              <el-icon><Upload /></el-icon>
            </div>
            <div class="step-content">
              <h3>选择文件</h3>
              <p>拖拽或选择需要重命名的文件</p>
            </div>
            <div class="step-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          
          <div class="step">
            <div class="step-icon">
              <el-icon><Setting /></el-icon>
            </div>
            <div class="step-content">
              <h3>设置规则</h3>
              <p>配置重命名规则和参数</p>
            </div>
            <div class="step-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          
          <div class="step">
            <div class="step-icon">
              <el-icon><View /></el-icon>
            </div>
            <div class="step-content">
              <h3>预览结果</h3>
              <p>实时查看重命名效果</p>
            </div>
            <div class="step-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          
          <div class="step">
            <div class="step-icon">
              <el-icon><Check /></el-icon>
            </div>
            <div class="step-content">
              <h3>完成重命名</h3>
              <p>确认无误后执行重命名</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'animate.css'
</script>

<style scoped>
.home-container {
  padding: 32px;
  height: 100%;
  background: #f5f7fa;
}

.welcome-section {
  text-align: center;
  margin-bottom: 48px;
}

.welcome-section h1 {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(45deg, #409eff, #36cfc9);
  -webkit-background-clip: text;
  color: transparent;
  margin: 0;
}

.subtitle {
  font-size: 20px;
  color: #606266;
  margin-top: 12px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: #303133;
  margin: 48px 0 32px;
  font-weight: 600;
}

.quick-start-card {
  margin-bottom: 48px;
  background: linear-gradient(135deg, #409eff08, #36cfc908);
  border: none;
}

.quick-start-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.start-content {
  padding: 32px;
  text-align: center;
}

.start-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.start-content h2 {
  font-size: 28px;
  color: #303133;
  margin: 16px 0;
}

.start-content p {
  color: #606266;
  font-size: 16px;
  margin-bottom: 24px;
}

.start-button {
  padding: 12px 36px;
  font-size: 16px;
  border-radius: 24px;
  gap: 8px;
}

/* 工作流程样式 */
.workflow-section {
  margin: 48px 0;
}

.workflow-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step-icon {
  width: 64px;
  height: 64px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.step-icon .el-icon {
  font-size: 32px;
  color: white;
}

.step-content {
  text-align: center;
}

.step-content h3 {
  font-size: 18px;
  color: #303133;
  margin: 0 0 8px;
}

.step-content p {
  color: #606266;
  font-size: 14px;
  margin: 0;
}

.step-arrow {
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  color: #409eff;
  font-size: 24px;
}

.step:last-child .step-arrow {
  display: none;
}

/* 功能特点样式 */
.features-section {
  margin-top: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.feature-card {
  background: #fff;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.feature-content {
  padding: 24px;
}

.feature-content .el-icon {
  font-size: 32px;
  color: #409eff;
  margin-bottom: 16px;
}

.feature-content h3 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 16px;
}

.feature-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-content li {
  color: #606266;
  margin: 12px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-content li::before {
  content: "✓";
  color: #67c23a;
  font-weight: bold;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .workflow-steps {
    flex-direction: column;
    gap: 32px;
  }
  
  .step-arrow {
    transform: rotate(90deg);
    right: auto;
    top: auto;
    bottom: -40px;
  }
}
</style>