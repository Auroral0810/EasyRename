# EasyRename 批量重命名工具

<div align="center">

<img src="./src/assets/logos/logo.jpg" alt="EasyRename Logo" width="200"/>

![Logo](https://img.shields.io/badge/EasyRename-v1.0.0-blue)
[![License](https://img.shields.io/badge/license-MIT-yellow)](./LICENSE)
![Platform](https://img.shields.io/badge/platform-Windows%20|%20macOS%20|%20Linux-brightgreen)
[![Performance](https://img.shields.io/badge/性能-5000+文件/10秒-orange)]()
[![Email](https://img.shields.io/badge/email-15968588744@163.com-red)](mailto:15968588744@163.com)

<p align="center">
  <strong>🚀 简单易用的跨平台文件批量重命名工具</strong>
  <br>
  <i>支持多种重命名规则 | 高性能处理 | 实时预览</i>
</p>

</div>

<div align="center">
  <h3>
    <a href="#features">Features</a>
    <span> | </span>
    <a href="#download">Download</a>
    <span> | </span>
    <a href="http://easyrename.yyf040810.cn/" target="_blank">Try Online</a>
    <span> | </span>
    <a href="#guide">Guide</a>
    <span> | </span>
    <a href="#tech-stack">Tech Stack</a>
  </h3>
</div>

## ✨ 技术栈

<div align="center">
<table>
  <tr>
    <th>核心框架</th>
    <th>前端技术</th>
    <th>构建工具</th>
  </tr>
  <tr>
    <td>
      <img src="https://img.shields.io/badge/Tauri-v1.5-blue?logo=tauri" alt="Tauri"/>
      <br/>
      <img src="https://img.shields.io/badge/Rust-2024-orange?logo=rust" alt="Rust"/>
    </td>
    <td>
      <img src="https://img.shields.io/badge/Vue.js-v3-green?logo=vue.js" alt="Vue.js"/>
      <br/>
      <img src="https://img.shields.io/badge/TypeScript-v5-blue?logo=typescript" alt="TypeScript"/>
      <br/>
      <img src="https://img.shields.io/badge/Element_Plus-v2-409EFF?logo=element" alt="Element Plus"/>
    </td>
    <td>
      <img src="https://img.shields.io/badge/Vite-v5-646CFF?logo=vite" alt="Vite"/>
      <br/>
      <img src="https://img.shields.io/badge/Pinia-v2-yellow?logo=pinia" alt="Pinia"/>
    </td>
  </tr>
</table>
</div>

## 🎯 重命名规则

<details open>
<summary><b>完整的重命名操作支持</b></summary>

- **基础字符操作**
  - 删除指定位置字符
    - 前N个字符
    - 后N个字符
    - 第M位置后的N个字符
    - 倒数第M位置前的N个字符
  - 替换指定字符串
    - 指定字符串前后的字符
    - 全文替换
    - 首次匹配替换

- **智能命名功能**
  - 序号添加与补齐
    - 自定义起始序号
    - 自定义步长
    - 自定义位数补零
  - 日期时间处理
    - 添加创建日期
    - 添加修改日期
    - 自定义日期格式

- **高级处理功能**
  - 正则表达式替换
  - 自定义JS脚本处理
  - 大小写转换
  - 扩展名处理
  - 条件过滤

- **批处理选项**
  - 忽略大小写
  - 保留原始扩展名
  - 处理子文件夹
  - 自动跳过错误

</details>

## ⚡ 性能特点

- **高效处理**: 5000+文件重命名仅需10秒
- **内存优化**: 采用虚拟化表格，支持大量文件无卡顿
- **实时预览**: 即时查看重命名效果
- **操作安全**: 支持撤销/重做，防止误操作

## 🚀 使用指南

### 基础操作流程

1. 选择文件/文件夹
2. 选择重命名规则
3. 设置参数
4. 预览结果
5. 执行重命名

### ⚠️ 使用建议

- 建议单次处理文件不超过5000条
- 重要文件操作前请先备份
- 避免频繁撤销/重做操作

## 🚀 Quick Start

### Try Online
> Try instantly without installation: [EasyRename Online](http://easyrename.yyf040810.cn/)

- ✨ Full Feature Support
- 🌐 Cross-platform Compatible
- 💫 No Installation Required
- ⚡ Instant Access

## 📥 下载安装

### 下载地址

> 所有版本均已通过基础功能测试，如遇问题请及时反馈

<table>
  <tr>
    <th>平台</th>
    <th>下载链接</th>
    <th>文件大小</th>
    <th>校验码</th>
  </tr>
  <tr>
    <td>Windows</td>
    <td><a href="https://github.com/Auroral0810/EasyRename/releases/download/v1.0.0/EasyRename_1.0.0_x64_zh-CN.msi">EasyRename_1.0.0_x64_zh-CN.msi</a></td>
    <td>~2.2MB</td>
    <td>待添加</td>
  </tr>
  <tr>
    <td>macOS</td>
    <td><a href="https://github.com/Auroral0810/EasyRename/releases/download/v1.0.0/EasyRename_1.0.0_aarch64.dmg">EasyRename_1.0.0_aarch64.dmg</a></td>
    <td>~2.2MB</td>
    <td>待添加</td>
  </tr>
  <tr>
    <td>Linux</td>
    <td><a href="https://github.com/Auroral0810/EasyRename/releases/download/v1.0.0/easy-rename_1.0.0_amd64.deb">easy-rename_1.0.0_amd64.deb</a></td>
    <td>~2.2MB</td>
    <td>待添加</td>
  </tr>
</table>

### 安装说明

<details>
<summary><b>Windows 安装指南</b></summary>

1. 下载 `.msi` 安装包
2. 双击安装文件
3. 按照安装向导完成安装
4. 从开始菜单或桌面启动

> 如遇到安全提示，请点击"更多信息"后选择"仍要运行"
</details>

<details>
<summary><b>macOS 安装指南</b></summary>

1. 下载 `.dmg` 文件
2. 打开 DMG 文件
3. 将应用拖入 Applications 文件夹

如遇到"应用已损坏"提示：
```bash
xattr -cr /Applications/EasyRename.app
```

> 首次运行时需要在"系统偏好设置"中允许运行
</details>

<details>
<summary><b>Linux 安装指南</b></summary>

Debian/Ubuntu:
```bash
sudo dpkg -i easy-rename_1.0.0_amd64.deb
sudo apt-get install -f  # 自动安装依赖
```

> 如遇权限问题，请确保具有足够的系统权限
</details>

## 🛠️ 开发环境

```bash
Node.js >= 20
Rust >= 1.75
pnpm >= 8.0
```

## 🤝 开源协作

本项目欢迎各种形式的贡献，包括但不限于：

- 🐛 提交问题和建议
- 🌟 新功能提案
- 📝 完善文档
- 🔨 修复 bug
- 💡 性能优化

### 参与贡献

1. Fork 本仓库
2. 创建新的功能分支
3. 提交您的更改
4. 创建 Pull Request

### 联系方式

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/Issue-报告问题-blue" alt="Issue"/>
        <br>
        提交 Issue
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/Email-联系我们-red" alt="Email"/>
        <br>
        15968588744@163.com
      </td>
    </tr>
  </table>
</div>

## 📜 开源协议

<div align="center">
  
本项目采用 [MIT 许可证](./LICENSE)

**EasyRename** ©2025 Made with ❤️ by 俞云烽

</div>
