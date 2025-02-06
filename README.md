<div align="right">
  <a href="README.md">English</a> | <a href="README_zh.md">简体中文</a>
</div>

# EasyRename - Batch File Renaming Tool

<div align="center">

<img src="./src/assets/logos/logo.jpg" alt="EasyRename Logo" width="200"/>

![Logo](https://img.shields.io/badge/EasyRename-v1.0.0-blue)
[![License](https://img.shields.io/badge/license-MIT-yellow)](./LICENSE)
![Platform](https://img.shields.io/badge/platform-Windows%20|%20macOS%20|%20Linux-brightgreen)
[![Performance](https://img.shields.io/badge/Performance-5000files/15s-orange)]()
[![Email](https://img.shields.io/badge/email-15968588744@163.com-red)](mailto:15968588744@163.com)

<p align="center">
  <strong>🚀 A Cross-platform Batch File Renaming Tool</strong>
  <br>
  <i>Multiple Rename Rules | High Performance | Real-time Preview</i>
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

## 🚀 Quick Start

### Try Online
> Try instantly without installation: [EasyRename Online](http://easyrename.yyf040810.cn/)

- ✨ Full Feature Support
- 🌐 Cross-platform Compatible
- 💫 No Installation Required
- ⚡ Instant Access

## ✨ Tech Stack

<div align="center">
<table>
  <tr>
    <th>Core Framework</th>
    <th>Frontend</th>
    <th>Build Tools</th>
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

## 🎯 Rename Rules

<details open>
<summary><b>Comprehensive Rename Operations</b></summary>

- **Basic Character Operations**
  - Delete Characters at Specific Positions
    - First N characters
    - Last N characters
    - N characters after position M
    - N characters before last position M
  - Replace Specific Strings
    - Characters before/after specific string
    - Global replacement
    - First match replacement

- **Smart Naming Features**
  - Sequence Number Addition
    - Custom start number
    - Custom step value
    - Custom zero padding
  - Date Time Processing
    - Add creation date
    - Add modification date
    - Custom date format

- **Advanced Processing**
  - Regular Expression Replacement
  - Custom JavaScript Processing
  - Case Conversion
  - Extension Processing
  - Conditional Filtering

- **Batch Processing Options**
  - Case Insensitive
  - Preserve Original Extension
  - Process Subfolders
  - Auto Skip Errors

</details>

## ⚡ Performance

- **Efficient Processing**: Rename 5000+ files in 10 seconds
- **Memory Optimization**: Virtual table for smooth handling of large file sets
- **Real-time Preview**: Instant preview of rename results
- **Safe Operations**: Undo/Redo support to prevent mistakes

## 📥 Download & Installation

### Download Links

> All versions have passed basic functionality testing. Please report any issues.

<table>
  <tr>
    <th>Platform</th>
    <th>Download</th>
    <th>Size</th>
    <th>Checksum</th>
  </tr>
  <tr>
    <td>Windows</td>
    <td><a href="https://github.com/Auroral0810/EasyRename/releases/download/v1.0.0/EasyRename_1.0.0_x64_zh-CN.msi">EasyRename_1.0.0_x64_zh-CN.msi</a></td>
    <td>~2.2MB</td>
    <td>TBD</td>
  </tr>
  <tr>
    <td>macOS</td>
    <td><a href="https://github.com/Auroral0810/EasyRename/releases/download/v1.0.0/EasyRename_1.0.0_aarch64.dmg">EasyRename_1.0.0_aarch64.dmg</a></td>
    <td>~2.2MB</td>
    <td>TBD</td>
  </tr>
  <tr>
    <td>Linux</td>
    <td><a href="https://github.com/Auroral0810/EasyRename/releases/download/v1.0.0/easy-rename_1.0.0_amd64.deb">easy-rename_1.0.0_amd64.deb</a></td>
    <td>~2.2MB</td>
    <td>TBD</td>
  </tr>
</table>

### Installation Guide

<details>
<summary><b>Windows Installation</b></summary>

1. Download the `.msi` installer
2. Double-click the installer
3. Follow the installation wizard
4. Launch from Start menu or desktop

> If you see a security warning, click "More info" and choose "Run anyway"
</details>

<details>
<summary><b>macOS Installation</b></summary>

1. Download the `.dmg` file
2. Open the DMG file
3. Drag the app to Applications folder

If you see "app is damaged" message:
```bash
xattr -cr /Applications/EasyRename.app
```

> First launch requires approval in System Preferences
</details>

<details>
<summary><b>Linux Installation</b></summary>

Debian/Ubuntu:
```bash
sudo dpkg -i easy-rename_1.0.0_amd64.deb
sudo apt-get install -f  # Install dependencies
```

> Ensure you have sufficient system privileges
</details>

## 🛠️ Development Environment

```bash
Node.js >= 20
Rust >= 1.75
pnpm >= 8.0
```

## 🤝 Contributing

We welcome all forms of contributions, including but not limited to:

- 🐛 Bug reports and suggestions
- 🌟 New feature proposals
- 📝 Documentation improvements
- 🔨 Bug fixes
- 💡 Performance optimizations

### How to Contribute

1. Fork this repository
2. Create a feature branch
3. Commit your changes
4. Create Pull Request

### Contact

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/Issue-Report_Bug-blue" alt="Issue"/>
        <br>
        Submit Issue
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/Email-Contact_Us-red" alt="Email"/>
        <br>
        15968588744@163.com
      </td>
    </tr>
  </table>
</div>

## 📜 License

<div align="center">
  
This project is licensed under the [MIT License](./LICENSE)

**EasyRename** ©2025 Made with ❤️ by Yu Yunfeng

</div> 