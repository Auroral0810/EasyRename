<template>
  <div class="about-container">
    <div class="hero-section animate__animated animate__fadeIn">
      <div class="hero-content">
        <div class="hero-left">
          <h1>关于 EasyRename</h1>
          <p class="version">当前版本: v1.0.0</p>
          <div class="description">{{ description }}</div>
        </div>
        <div class="hero-right">
          <svg width="240" height="240" viewBox="0 0 48 48">
            <!-- 主圆形背景 -->
            <circle cx="24" cy="24" r="22" fill="url(#gradient)" />
            
            <!-- 装饰性圆环 -->
            <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.2)" fill="none" stroke-width="0.5"/>
            
            <!-- 文件夹图标底部 -->
            <path d="M12 14 H22 L24 16 H36 V34 H12 Z" fill="white" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.7;0.9" dur="3s" repeatCount="indefinite"/>
            </path>
            
            <!-- 动态箭头 -->
            <g transform="translate(16,22)">
              <path d="M0 0 H16" stroke="white" stroke-width="2" stroke-linecap="round">
                <animate 
                  attributeName="stroke-dasharray"
                  values="16,16;0,32;16,16"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M12 -4 L16 0 L12 4" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
            </g>
            
            <!-- 重命名符号 -->
            <text x="18" y="28" fill="white" font-size="5" font-weight="bold">A→B</text>
            
            <!-- 装饰性光点 -->
            <circle cx="36" cy="12" r="1" fill="white">
              <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4f46e5"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#10b981"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="features-grid animate__animated animate__fadeInUp">
        <el-card v-for="(advantage, index) in advantages" 
          :key="index" 
          class="feature-card"
          :body-style="{ padding: '30px 20px' }"
        >
          <el-icon :size="36" :color="advantage.color">
            <component :is="advantage.icon" />
          </el-icon>
          <h3>{{ advantage.title }}</h3>
          <p>{{ advantage.description }}</p>
        </el-card>
      </div>

      <div class="info-section">
        <div class="tech-info animate__animated animate__fadeInLeft">
          <h2>技术栈</h2>
          <div class="tech-list">
            <div v-for="tech in techList" :key="tech.name" class="tech-item">
              <img :src="tech.logo" alt="Logo" class="tech-logo" />
              <div class="tech-details">
                <h4>{{ tech.name }} <span>{{ tech.version }}</span></h4>
                <p>{{ tech.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="creator-info animate__animated animate__fadeInRight">
          <h2>作者信息</h2>
          <div class="creator-profile">
            <el-avatar :size="80" src="src/assets/WechatIMG378.jpg" />
            <div class="creator-details">
              <h3>俞云烽</h3>
              <p>南京审计大学</p>
              <div class="creator-bio">热爱编程，致力于开发实用工具，让工作更高效</div>
            </div>
          </div>
          
          <div class="contact-section">
            <div class="quick-links">
              <el-link v-for="link in linkList" 
                :key="link.url"
                :href="link.url"
                :type="link.type"
                target="_blank"
              >
                <el-icon><component :is="link.icon" /></el-icon>
                {{ link.name }}
              </el-link>
            </div>
            <div class="contact-info">
              <p><el-icon><Message /></el-icon> 15968588744@163.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import vuelogo from '@/assets/logos/vue.svg'
import taurilogo from '@/assets/logos/tauri.svg'
import rustlogo from '@/assets/logos/rust.svg'
import tslogo from '@/assets/logos/typescript.svg'

const description = `EasyRename 是一款专业的文件批量重命名工具，致力于为用户提供高效、智能的文件管理解决方案。我们的工具支持多种重命名方式，包括正则表达式、序号生成、日期格式化等，并提供实时预览功能，让您的文件管理工作变得轻松愉快。`

const advantages = [
  {
    title: '简单易用',
    description: '直观的界面设计，零学习成本，任何人都能快速上手',
    icon: 'Sunny',
    color: '#409EFF'
  },
  {
    title: '功能强大',
    description: '支持多种重命名方式，满足各类专业需求',
    icon: 'Star',
    color: '#67C23A'
  },
  {
    title: '安全可靠',
    description: '本地处理，安全无忧，支持操作预览和撤销',
    icon: 'Lock',
    color: '#E6A23C'
  }
]

const techList = [
  { 
    name: 'Tauri', 
    version: 'v1.6.0', 
    logo: taurilogo,
    description: '新一代跨平台应用开发框架'
  },
  { 
    name: 'Rust', 
    version: '1.75+', 
    logo: rustlogo,
    description: '高性能系统编程语言'
  },
  { 
    name: 'Vue 3', 
    version: 'v3.5.13', 
    logo: vuelogo,
    description: '渐进式 JavaScript 框架'
  },
  { 
    name: 'TypeScript', 
    version: 'v5.6.3',
    logo: tslogo,
    description: '类型安全的 JavaScript 超集语言'
  }
]

const linkList = [
  { 
    name: 'GitHub',
    url: 'https://github.com/Auroral0810/FileForge.git',
    type: 'primary' as const,
    icon: 'Platform'
  },
  {
    name: '反馈建议',
    url: 'https://github.com/Auroral0810/FileForge/issues',
    type: 'warning' as const,
    icon: 'Warning'
  },
  {
    name: '使用文档',
    url: 'https://github.com/Auroral0810/FileForge/wiki',
    type: 'success' as const,
    icon: 'Document'
  }
]
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  padding: 80px 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border-radius: 20px;
  margin-bottom: 60px;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 40px;
}

.hero-left {
  flex: 1;
  padding-right: 60px;
}

.hero-left h1 {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 20px;
  background: linear-gradient(45deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.version {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin-bottom: 24px;
}

.description {
  font-size: 18px;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
  border-radius: 16px;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin: 20px 0;
  font-size: 22px;
}

.feature-card p {
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.tech-info, .creator-info {
  background: var(--el-bg-color);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 28px;
  margin: 0 0 30px;
  color: var(--el-text-color-primary);
}

.tech-list {
  display: grid;
  gap: 24px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.tech-item .el-icon {
  font-size: 28px;
  color: var(--el-color-primary);
}

.tech-details h4 {
  margin: 0;
  font-size: 18px;
}

.tech-details h4 span {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-left: 8px;
}

.tech-details p {
  margin: 6px 0 0;
  color: var(--el-text-color-secondary);
}

.tech-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  padding: 4px;
}

.creator-profile {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.creator-details h3 {
  margin: 0;
  font-size: 24px;
}

.creator-details p {
  color: var(--el-text-color-secondary);
  margin: 8px 0;
}

.creator-bio {
  margin-top: 12px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.contact-section {
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 30px;
  margin-top: 30px;
}

.quick-links {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  color: var(--el-text-color-secondary);
  font-size: 16px;
}

.animate__animated {
  animation-duration: 1s;
}
</style>
