# 📁 项目文件浏览器（图床，资源管理器）

> **🌏 Language**: [English](README-en.md) | 中文

现代化的纯前端文件浏览器，支持动态文件清单加载，完美适配 Cloudflare Pages 部署。

## 🎯 在线演示

**演示站点**: [https://source.thinkgin.com/](https://source.thinkgin.com/)

## 💡 作者思路

这个项目如果想做成那种自动化的图床，上传就同步的话，就得将代码放在项目里面，图片传到这个项目的 source，然后钩子会触发 GitHub 提交，GitHub 又会触发 Cloudflare 自动部署，也就等于白嫖一个图床服务了。当然，用这个思路可以在项目里面给一个文件夹传图片，触发提交 GitHub，GitHub 又会触发 Cloudflare 自动部署。我这个项目只是为了便于观看做的。

### 🚀 自动化图床扩展思路

1. **文件上传** → `source/` 目录
2. **Git 钩子** → 自动提交到 GitHub
3. **GitHub Actions** → 触发 Cloudflare Pages 部署
4. **自动更新** → 文件清单自动生成
5. **全球访问** → CDN 加速的图床服务

> 💰 **成本优势**：利用 GitHub 免费仓库 + Cloudflare Pages 免费额度，实现零成本图床服务

## ✨ 主要功能

- 🔍 **动态文件展示** - 自动读取项目真实文件
- 📂 **分类浏览** - 按文件类型分类展示
- 🔎 **实时搜索** - 快速查找文件
- 📊 **统计信息** - 显示文件数量和大小
- 🎨 **现代界面** - 响应式设计，支持移动端

## 🚀 快速开始

### 本地开发

```bash
# 克隆 项目
git clone git@github.com:thinkgin/source.git
cd source

# 安装依赖（可选）
npm install

# 更新文件清单
node main/update-manifest.js


```

💡 **提示**：每次更新项目文件后，记得运行 `node main/update-manifest.js` 更新文件清单！

### Cloudflare Pages 部署

1. **连接仓库**：登录 Cloudflare Pages，连接你的 Git 仓库

2. **构建配置**：

   ```yaml
   Framework preset: None
   Build command: node main/update-manifest.js
   Build output directory: .
   ```

   > 📝 **重要说明**：
   >
   > - **构建输出目录**：填写 `.` 或留空（因为 index.html 在根目录）
   > - **不要填写** `/` 或其他路径
   > - 构建指令会自动扫描 `source` 目录并生成最新文件清单

3. **环境变量（可选）**：

   ```yaml
   NODE_VERSION: 18
   ```

4. **部署流程**：

   - 推送代码到仓库
   - Cloudflare Pages 自动运行构建指令
   - 生成最新的 `main/files-manifest.json`
   - 部署到全球 CDN

5. **验证部署**：访问分配的域名，确认文件列表显示正常

## 📋 文件清单管理

### 自动更新文件清单

```bash
# 扫描项目文件并更新清单
node main/update-manifest.js
```

### 文件清单说明

- `main/files-manifest.json` - 项目文件清单数据
- `main/update-manifest.js` - 自动生成清单的脚本
- 清单包含：文件名、大小、类型、路径、修改时间

### 配置文件类型

编辑 `main/update-manifest.js` 中的 `config` 对象：

```javascript
const config = {
  excludeDirs: [".git", "node_modules"], // 排除目录
  excludeFiles: [".gitignore", ".DS_Store"], // 排除文件
  folders: {
    // 文件夹映射
    js: "js",
    css: "css",
    img: "img",
    other: "other",
  },
};
```

## 🔧 部署故障排除

### ⚠️ 后备数据机制说明

项目采用了智能的后备数据机制来确保在各种环境下都能正常工作：

#### 🔄 何时启用后备数据？

**本地环境（file:// 协议）**：

- 当你直接双击打开 `index.html` 时，浏览器使用 `
