<template>
  <el-container class="app-wrapper">
    <!-- 侧边栏 -->
    <el-aside width="150px" class="app-sidebar">
      <div class="app-title">
        <img src="@/assets/logos/logo.jpg" alt="EasyRename" class="logo-image" style="width: 100%; height: 100%; object-fit: cover;" />
        <div class="title-decoration" style="width: 100%;"></div>
      </div>
      
      <el-menu
        :default-active="$route.path"
        router
        class="app-menu"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-menu-item index="/batch-rename">
          <el-icon><Document /></el-icon>
          <span>批量重命名</span>
        </el-menu-item>
        
        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <span>关于</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="app-main">

      
      <el-main class="app-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-wrapper {
  height: 100vh;
  background-color: #f6f8fa;
}

.app-sidebar {
  background-color: #fff;
  border-right: 1px solid #e0e3e7;
  display: flex;
  flex-direction: column;
  padding: 0;
  user-select: none;
}

.app-logo {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e0e3e7;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  background: #ecf5ff;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-menu {
  border-right: none;
  padding: 8px;
}

.app-menu :deep(.el-menu-item) {
  border-radius: 4px;
  margin: 4px 0;
}

.app-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e3e7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2328;
}

.app-content {
  padding: 16px;
  overflow-y: auto;
  background-color: #f6f8fa;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.app-title {
  padding: 25px;
  text-align: center;
  position: relative;
  border-bottom: 1px solid #e0e3e7;
}

.logo-image {
  height: 40px; /* 调整大小以适应侧边栏 */
  width: auto;
  object-fit: contain;
  margin: 0 auto;
}

.title-decoration {
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #36cfc9);
  border-radius: 2px;
}
</style>