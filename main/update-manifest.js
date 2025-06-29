#!/usr/bin/env node

/**
 * 项目文件清单自动生成脚本
 * 扫描 source 目录，按文件类型分类生成 files-manifest.json
 * 版本: 2024-12-03 - 重新生成版本
 */

const fs = require('fs');
const path = require('path');

// 配置选项
const config = {
    // 扫描的源目录
    sourceDir: 'source',
    
    // 输出文件路径
    outputFile: 'main/files-manifest.json',
    
    // 排除的目录
    excludeDirs: ['.git', 'node_modules', '.vscode', '.idea', 'dist', 'build'],
    
    // 排除的文件
    excludeFiles: ['.gitignore', '.DS_Store', 'Thumbs.db', '.gitkeep'],
    
    // 文件类型映射
    fileTypeMap: {
        // JavaScript 文件
        js: { category: 'javascript', icon: '📄', type: 'javascript' },
        mjs: { category: 'javascript', icon: '📄', type: 'javascript' },
        
        // CSS 样式文件
        css: { category: 'stylesheet', icon: '🎨', type: 'stylesheet' },
        scss: { category: 'stylesheet', icon: '🎨', type: 'stylesheet' },
        sass: { category: 'stylesheet', icon: '🎨', type: 'stylesheet' },
        less: { category: 'stylesheet', icon: '🎨', type: 'stylesheet' },
        
        // 图片文件
        jpg: { category: 'image', icon: '🖼️', type: 'image' },
        jpeg: { category: 'image', icon: '🖼️', type: 'image' },
        png: { category: 'image', icon: '🖼️', type: 'image' },
        gif: { category: 'image', icon: '🖼️', type: 'image' },
        svg: { category: 'image', icon: '🖼️', type: 'image' },
        webp: { category: 'image', icon: '🖼️', type: 'image' },
        bmp: { category: 'image', icon: '🖼️', type: 'image' },
        ico: { category: 'image', icon: '🖼️', type: 'image' },
        
        // 文档文件
        md: { category: 'document', icon: '📝', type: 'document' },
        txt: { category: 'document', icon: '📝', type: 'document' },
        doc: { category: 'document', icon: '📝', type: 'document' },
        docx: { category: 'document', icon: '📝', type: 'document' },
        pdf: { category: 'document', icon: '📝', type: 'document' },
        
        // 数据文件
        json: { category: 'data', icon: '📊', type: 'data' },
        xml: { category: 'data', icon: '📊', type: 'data' },
        csv: { category: 'data', icon: '📊', type: 'data' },
        
        // 配置文件
        toml: { category: 'config', icon: '⚙️', type: 'config' },
        yaml: { category: 'config', icon: '⚙️', type: 'config' },
        yml: { category: 'config', icon: '⚙️', type: 'config' },
        ini: { category: 'config', icon: '⚙️', type: 'config' },
        
        // HTML 文件
        html: { category: 'document', icon: '🌐', type: 'html' },
        htm: { category: 'document', icon: '🌐', type: 'html' }
    }
};

/**
 * 获取文件大小的友好显示格式
 * @param {number} bytes 字节数
 * @returns {string} 格式化的文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    if (i === 0) {
        return bytes + ' B';
    }
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * 获取文件的扩展名
 * @param {string} filename 文件名
 * @returns {string} 扩展名（小写，不含点）
 */
function getFileExtension(filename) {
    return path.extname(filename).toLowerCase().slice(1);
}

/**
 * 获取文件描述
 * @param {string} fileName 文件名
 * @param {string} fileType 文件类型
 * @param {string} folderName 文件夹名
 * @returns {string} 文件描述
 */
function getFileDescription(fileName, fileType, folderName) {
    // 特殊文件描述映射
    const specialDescriptions = {
        'README.md': '说明文档',
        'index.html': '主页面文件',
        'app.min.js': 'JavaScript文件 - app.min',
        'utils.js': 'JavaScript文件 - utils',
        'demo.js': 'JavaScript文件 - demo',
        'demo.css': 'CSS样式文件 - demo',
        'main.css': '主样式表',
        'responsive.css': '响应式样式表',
        'config.json': '配置文件',
        'app-config.json': '数据文件 - app-config',
        'package.json': 'Node.js 包配置文件'
    };
    
    if (specialDescriptions[fileName]) {
        return specialDescriptions[fileName];
    }
    
    // 根据文件类型生成描述
    const typeDescriptions = {
        'javascript': 'JavaScript文件',
        'stylesheet': 'CSS样式文件',
        'image': '图片文件',
        'document': '文档文件',
        'data': '数据文件',
        'config': '配置文件',
        'html': 'HTML页面文件'
    };
    
    const baseDescription = typeDescriptions[fileType] || '文件';
    const baseName = path.parse(fileName).name;
    
    return `${baseDescription} - ${baseName}`;
}

/**
 * 获取相对于根目录的文件夹名
 * @param {string} filePath 文件路径
 * @param {string} sourceDir 源目录
 * @returns {string} 文件夹名
 */
function getFolderName(filePath, sourceDir) {
    const relativePath = path.relative(sourceDir, path.dirname(filePath));
    return relativePath === '' ? '.' : relativePath.split(path.sep)[0];
}

/**
 * 递归扫描目录获取所有文件
 * @param {string} dirPath 目录路径
 * @param {Array} fileList 文件列表（递归累积）
 * @returns {Array} 文件路径列表
 */
function scanDirectory(dirPath, fileList = []) {
    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // 跳过排除的目录
                if (!config.excludeDirs.includes(item)) {
                    scanDirectory(itemPath, fileList);
                }
            } else if (stat.isFile()) {
                // 跳过排除的文件
                if (!config.excludeFiles.includes(item)) {
                    fileList.push(itemPath);
                }
            }
        }
    } catch (error) {
        console.warn(`警告: 无法读取目录 ${dirPath}: ${error.message}`);
    }
    
    return fileList;
}

/**
 * 处理单个文件，生成文件信息
 * @param {string} filePath 文件路径
 * @param {string} sourceDir 源目录
 * @returns {Object|null} 文件信息对象
 */
function processFile(filePath, sourceDir) {
    try {
        const fileName = path.basename(filePath);
        const extension = getFileExtension(fileName);
        const stat = fs.statSync(filePath);
        
        // 获取文件类型信息
        const typeInfo = config.fileTypeMap[extension] || { 
            category: 'other', 
            icon: '📄', 
            type: 'other' 
        };
        
        // 获取相对路径（用于前端访问）
        const relativePath = './' + path.relative('.', filePath).replace(/\\/g, '/');
        
        // 获取文件夹名
        const folderName = getFolderName(filePath, sourceDir);
        
        // 获取修改时间
        const lastModified = stat.mtime.toISOString().split('T')[0];
        
        return {
            name: fileName,
            size: formatFileSize(stat.size),
            type: typeInfo.type,
            path: relativePath,
            description: getFileDescription(fileName, typeInfo.type, folderName),
            lastModified: lastModified,
            icon: typeInfo.icon,
            folder: folderName,
            category: typeInfo.category,
            sizeBytes: stat.size
        };
    } catch (error) {
        console.warn(`警告: 无法处理文件 ${filePath}: ${error.message}`);
        return null;
    }
}

/**
 * 生成文件清单
 */
function generateManifest() {
    console.log('🔍 开始扫描文件...');
    
    // 检查源目录是否存在
    if (!fs.existsSync(config.sourceDir)) {
        console.error(`❌ 错误: 源目录 '${config.sourceDir}' 不存在`);
        process.exit(1);
    }
    
    // 扫描所有文件
    const allFiles = scanDirectory(config.sourceDir);
    console.log(`📁 找到 ${allFiles.length} 个文件`);
    
    // 处理文件并分类
    const categorizedFiles = {
        javascript: [],
        stylesheet: [],
        image: [],
        document: [],
        data: [],
        config: [],
        other: []
    };
    
    let totalSize = 0;
    let processedCount = 0;
    
    for (const filePath of allFiles) {
        const fileInfo = processFile(filePath, config.sourceDir);
        if (fileInfo) {
            categorizedFiles[fileInfo.category].push(fileInfo);
            totalSize += fileInfo.sizeBytes;
            processedCount++;
        }
    }
    
    // 生成统计信息
    const statistics = {
        total_files: processedCount,
        total_size: formatFileSize(totalSize),
        file_types: {
            'JavaScript': categorizedFiles.javascript.length,
            'CSS样式': categorizedFiles.stylesheet.length,
            '图片': categorizedFiles.image.length,
            '文档': categorizedFiles.document.length,
            '数据': categorizedFiles.data.length,
            '配置': categorizedFiles.config.length,
            '其他': categorizedFiles.other.length
        }
    };
    
    // 移除统计信息中值为0的项目
    Object.keys(statistics.file_types).forEach(key => {
        if (statistics.file_types[key] === 0) {
            delete statistics.file_types[key];
        }
    });
    
    // 生成最终清单数据
    const manifest = {
        generated_at: new Date().toISOString(),
        version: new Date().toISOString().split('T')[0].replace(/-/g, '-') + '-001',
        description: 'Source文件夹动态清单 - 按扩展名自动分类',
        source_directory: config.sourceDir,
        files: {},
        statistics: statistics
    };
    
    // 只包含有文件的分类
    Object.keys(categorizedFiles).forEach(category => {
        if (categorizedFiles[category].length > 0) {
            // 移除临时字段
            manifest.files[category] = categorizedFiles[category].map(file => {
                const { category: _, sizeBytes, ...cleanFile } = file;
                return cleanFile;
            });
        }
    });
    
    // 确保输出目录存在
    const outputDir = path.dirname(config.outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入文件
    try {
        fs.writeFileSync(config.outputFile, JSON.stringify(manifest, null, 2), 'utf8');
        console.log(`✅ 文件清单已生成: ${config.outputFile}`);
        console.log(`📊 处理了 ${processedCount} 个文件，总大小 ${formatFileSize(totalSize)}`);
        console.log('📋 文件分类统计:');
        Object.entries(statistics.file_types).forEach(([type, count]) => {
            if (count > 0) {
                console.log(`   ${type}: ${count} 个文件`);
            }
        });
    } catch (error) {
        console.error(`❌ 错误: 无法写入文件清单: ${error.message}`);
        process.exit(1);
    }
}

/**
 * 主函数
 */
function main() {
    console.log('📦 项目文件清单生成器 v2.0');
    console.log('=================================');
    
    try {
        generateManifest();
        console.log('🎉 清单生成完成！');
    } catch (error) {
        console.error(`❌ 生成失败: ${error.message}`);
        process.exit(1);
    }
}

// 如果是直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = {
    generateManifest,
    config
}; 