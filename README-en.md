# 📁 Project File Browser

> **🌏 Language**: English | [中文](README.md)

A modern pure front-end file browser with dynamic file manifest loading, perfectly compatible with Cloudflare Pages deployment.

## 🎯 Live Demo

**Demo Site**: [https://source.thinkgin.com/](https://source.thinkgin.com/)

## 💡 Author's Vision

If you want to turn this project into an automated image hosting service with real-time sync, you would need to integrate the code into the project, upload images to the `source` directory, then use hooks to trigger GitHub commits, which in turn trigger Cloudflare automatic deployment - essentially getting a free image hosting service. Of course, using this approach, you can set up a folder in the project for uploading images, trigger GitHub commits, and then GitHub triggers Cloudflare automatic deployment. This current project is just made for convenient viewing.

### 🚀 Automated Image Hosting Extension Ideas

1. **File Upload** → `source/` directory
2. **Git Hooks** → Auto-commit to GitHub
3. **GitHub Actions** → Trigger Cloudflare Pages deployment
4. **Auto Update** → File manifest auto-generation
5. **Global Access** → CDN-accelerated image hosting service

> 💰 **Cost Advantage**: Leverage GitHub free repository + Cloudflare Pages free tier to achieve zero-cost image hosting service

## ✨ Main Features

- 🔍 **Dynamic File Display** - Automatically reads real project files
- 📂 **Categorized Browsing** - Display files by type categories
- 🔎 **Real-time Search** - Quick file searching
- 📊 **Statistics** - Show file count and size information
- 🎨 **Modern UI** - Responsive design with mobile support

## 🚀 Quick Start

### Local Development

```bash
# Clone project
git clone git@github.com:thinkgin/source.git
cd source

# Install dependencies (optional)
npm install

# Update file manifest
node main/update-manifest.js
```

💡 **Tip**: Remember to run `node main/update-manifest.js` to update the file manifest after updating project files!

### Cloudflare Pages Deployment

1. **Connect Repository**: Log in to Cloudflare Pages and connect your Git repository

2. **Build Configuration**:

   ```yaml
   Framework preset: None
   Build command: node main/update-manifest.js
   Build output directory: .
   ```

   > 📝 **Important Notes**:
   >
   > - **Build output directory**: Enter `.` or leave empty (since index.html is in root directory)
   > - **Do NOT enter** `/` or other paths
   > - Build command will automatically scan `source` directory and generate latest file manifest

3. **Environment Variables (Optional)**:

   ```yaml
   NODE_VERSION: 18
   ```

4. **Deployment Process**:

   - Push code to repository
   - Cloudflare Pages automatically runs build command
   - Generates latest `main/files-manifest.json`
   - Deploys to global CDN

5. **Verify Deployment**: Visit the assigned domain to confirm file list displays correctly

## 📋 File Manifest Management

### Auto Update File Manifest

```bash
# Scan project files and update manifest
node main/update-manifest.js
```

### File Manifest Description

- `main/files-manifest.json` - Project file manifest data
- `main/update-manifest.js` - Auto-generate manifest script
- Manifest includes: filename, size, type, path, modification time

### Configure File Types

Edit the `config` object in `main/update-manifest.js`:

```javascript
const config = {
  excludeDirs: [".git", "node_modules"], // Exclude directories
  excludeFiles: [".gitignore", ".DS_Store"], // Exclude files
  folders: {
    // Folder mapping
    js: "js",
    css: "css",
    img: "img",
    other: "other",
  },
};
```

## 🔧 Deployment Troubleshooting

### ⚠️ Fallback Data Mechanism

The project uses an intelligent fallback data mechanism to ensure proper functionality across various environments:

#### 🔄 When is Fallback Data Activated?

**Local Environment (file:// protocol)**:

- When you directly double-click to open `index.html`, the browser uses `file://` protocol
- Due to browser security policy restrictions, `fetch()` cannot load local JSON files
- System automatically switches to built-in static fallback data

**Network Issues**:

- When `main/files-manifest.json` fails to load
- When server is unresponsive or file doesn't exist
- Automatically degrades to fallback data to ensure page displays normally

#### 🚀 Solutions

**Local Development Environment**:

```bash
# Method 1: Python server
python -m http.server 8080
# Visit http://localhost:8080

# Method 2: Node.js server
npx http-server -p 8080
# Visit http://localhost:8080

# Method 3: VS Code Live Server extension
# Right-click HTML file → "Open with Live Server"
```

**Environment Comparison**:
| Environment | Protocol | JSON Loading | Data Source | File Count |
|-------------|----------|--------------|-------------|------------|
| Local Direct | `file://` | ❌ Restricted | Fallback data | Fixed 14 files |
| Local Server | `http://` | ✅ Normal | Dynamic manifest | Real-time scan |
| Production | `https://` | ✅ Normal | Dynamic manifest | Real-time scan |

> 💡 **Best Practice**: Deploy to servers like Cloudflare Pages for optimal performance and full functionality

### Common Issues

**Q1: Cloudflare Pages Build Failed**

```bash
# Error: Node.js version incompatible
Solution: Set NODE_VERSION: 18 in environment variables
```

**Q2: Wrong Build Output Directory**

```bash
# Wrong config: Build output directory: /
# Correct config: Build output directory: .
```

**Q3: File Manifest Not Updated**

```bash
# Ensure build command is correct
Build command: node main/update-manifest.js

# Check if script exists
ls -la main/update-manifest.js
```

**Q4: Page Displays But File List Empty**

- Check if `main/files-manifest.json` is generated
- Confirm `source` directory contains files
- Check browser console for errors

### Debug Steps

1. **Local Testing**:

   ```bash
   node main/update-manifest.js
   # Check generated files-manifest.json
   ```

2. **Check File Permissions**: Ensure script has execute permissions

3. **View Build Logs**: Check detailed build logs in Cloudflare Pages

4. **Verify File Structure**: Ensure project structure matches documentation

## 📁 Project Structure

```
project-file-browser/
├── index.html              # Main page
├── main/
│   ├── update-manifest.js  # Manifest generation script
│   ├── files-manifest.json # File manifest (auto-generated)
│   ├── language.json       # Multi-language configuration
│   ├── version.json        # Version information
│   ├── css/                # Style files
│   └── js/                 # JavaScript files
├── source/                 # Directory to display files
│   ├── img/                # Image resources
│   ├── docs/               # Document files
│   ├── styles/             # Style files
│   ├── config/             # Configuration files
│   └── ...                 # Other files
├── README.md               # Project documentation (Chinese)
└── README-en.md            # Project documentation (English)
```

## 🎯 Usage Guide

### File Browsing

- **Category View** - Click folder icons on the left or top tabs
- **Search Files** - Use search box to find files by name
- **File Operations** - Preview images, copy links, view details

### File Update Workflow

1. Add/modify project files
2. Run `node main/update-manifest.js` to update manifest
3. Commit and push to Git repository
4. Cloudflare Pages auto-deploys

## 🔧 Custom Configuration

### Modify File Descriptions

Edit the `getFileDescription` function in `main/update-manifest.js`:

```javascript
function getFileDescription(fileName, folderName) {
  const descriptions = {
    "your-file.js": "Custom file description",
    // Add more file descriptions
  };
  return descriptions[fileName] || `${fileName} in ${folderName} folder`;
}
```

### Custom Styles

Modify style variables in `main/css/main.css` and `main/css/responsive.css`.

## 📊 Supported File Types

| Type       | Extensions                    | Icon |
| ---------- | ----------------------------- | ---- |
| JavaScript | .js                           | 📄   |
| CSS        | .css                          | 🎨   |
| Images     | .jpg, .png, .gif, .svg, .webp | 🖼️   |
| Documents  | .md, .txt                     | 📝   |
| Data       | .json                         | 📊   |
| Pages      | .html                         | 🌐   |
| Config     | .toml, .yaml, .yml            | ⚙️   |

## 🔄 Version Management

- `main/version.json` - Records version information and update logs
- Cache busting mechanism support
- Automatic version number generation

## 📱 Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ✅ Responsive design
- ✅ No external dependencies

## 🚀 Deployment Optimization

### Cloudflare Pages Configuration

```toml
# _headers file
/*
  Cache-Control: public, max-age=3600

/*.css
  Cache-Control: public, max-age=86400

/*.js
  Cache-Control: public, max-age=86400
```

### Performance Optimization

- Enable Gzip compression
- Set appropriate cache strategies
- Use version numbers for cache busting

## 📄 License

MIT License

---

**🌏 Language Versions**

- [中文版本](README.md)
- [English Version](README-en.md)
