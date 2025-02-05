# EasyRename 批量重命名工具

<div align="center">

![Logo](https://img.shields.io/badge/EasyRename-v1.0.0-blue)
[![License](https://img.shields.io/badge/license-MIT-yellow)](./LICENSE)
![Platform](https://img.shields.io/badge/platform-Windows%20|%20macOS%20|%20Linux-brightgreen)
[![Email](https://img.shields.io/badge/email-15968588744@163.com-red)](mailto:15968588744@163.com)

🚀 简单易用的跨平台文件批量重命名工具
</div>

## ✨ 技术栈

### 核心框架
![Tauri](https://img.shields.io/badge/Tauri-v1.5-blue?logo=tauri)
![Vue](https://img.shields.io/badge/Vue.js-v3-green?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue?logo=typescript)
![Rust](https://img.shields.io/badge/Rust-2024-orange?logo=rust)

### 前端技术
![Vite](https://img.shields.io/badge/Vite-v5-646CFF?logo=vite)
![Pinia](https://img.shields.io/badge/Pinia-v2-yellow?logo=pinia)
![Element Plus](https://img.shields.io/badge/Element_Plus-v2-409EFF?logo=element)

- 🛠️ **Tauri**: 构建轻量级、高性能的跨平台桌面应用
- ⚡ **Vite**: 提供极速的开发体验和构建性能
- 🏗️ **Vue 3**: 采用 Composition API，提供更好的代码组织和复用
- 📦 **Pinia**: 直观的状态管理，支持文件操作历史记录
- 🎨 **Element Plus**: 美观的 UI 组件库，提供现代化的用户体验
- 🦀 **Rust**: 保证文件操作的安全性和高性能

## 🌟 特性

### 核心优势
- 🚀 高性能文件处理
  - 虚拟化表格，支持大量文件无卡顿
  - 懒加载技术，优化内存占用
  - 文件操作采用 Rust 实现，确保性能和安全
- 🎯 专业的重命名功能
  - 支持撤销/重做操作
  - 自定义 JavaScript 规则支持
  - 正则表达式匹配和替换
- 💫 人性化设计
  - 实时预览重命名结果
  - 文件拖拽支持
  - 深色模式适配

### 使用限制
> ⚠️ **注意事项**
> - 建议单次处理文件数量不超过 5000 条
> - 频繁的撤销/重做操作可能导致文件状态不一致
> - 处理重要文件前建议先备份

## 📥 下载安装

### Windows
- 下载 `EasyRename_1.0.0_x64_zh-CN.msi`
- 双击安装文件进行安装
- 运行 EasyRename 开始使用

### macOS
- 下载 `EasyRename_1.0.0_aarch64.dmg`
- 打开 DMG 文件，将应用拖入 Applications 文件夹

> ⚠️ **macOS 安全提示解决方法**
> 
> 如果遇到"应用已损坏"的提示，请：
> 1. 打开终端
> 2. 输入命令：`xattr -cr /Applications/EasyRename.app`
> 3. 重新打开应用

### Linux (Ubuntu/Debian)
- 下载 `easy-rename_1.0.0_amd64.deb`（适用于 x86_64 架构）
- 运行以下命令安装：

```bash
sudo dpkg -i easy-rename_1.0.0_amd64.deb
sudo apt-get install -f  # 解决依赖问题（如果有）
```

## 🛠️ 功能说明

### 核心功能
- 📝 添加前缀/后缀
- 🔢 添加序号
- ⚡ 替换文本
- 📋 批量导入
- 🎯 修改扩展名
- 📅 添加日期/时间戳
- 🔍 文件过滤功能
- ↩️ 撤销/重做支持
- 🔄 实时预览

### 高级特性
- 🎯 虚拟化表格，支持大量文件
- 📜 JavaScript 自定义规则
- 🌙 深色模式支持
- 🔍 正则表达式支持
- 🎨 自定义命名模板


### 使用方法
1. 打开应用
2. 拖拽文件/文件夹到应用窗口
3. 选择重命名规则
4. 预览更改
5. 点击"应用"执行重命名

## 💻 开发环境

- Node.js >= 20
- Rust >= 1.75
- pnpm >= 8.0
- 支持 Tauri 开发的操作系统

## 🤝 反馈与支持

如果您：
- 🐛 发现了 bug
- 💡 有新功能建议
- 💭 有任何问题

欢迎通过以下方式联系：
- 📧 Email: [15968588744@163.com](mailto:15968588744@163.com)
- 📝 GitHub Issues

## 📜 开源协议

本项目采用 [MIT 许可证](./LICENSE)。

---

<div align="center">

**EasyRename** ©2025 Made with ❤️ by 俞云烽

</div>
