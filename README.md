# Markdown to Image Cards Generator

将 Markdown 文件转换为精美的图片卡片，支持完整的 Markdown 格式和智能分页。

## 功能特点

- 📝 **完整 Markdown 支持**：粗体、斜体、代码块、列表、表格、引用
- 🎨 **3 种配色主题**：白色、米色、深色
- 📏 **固定尺寸**：1440×2400px（适合社交媒体分享）
- 🔤 **智能排版**：自动换行、智能分页、代码块自动缩放
- 🖼️ **图文混排**：支持本地和远程图片，自动等比例缩放
- 💻 **代码高亮**：代码块带灰色背景和等宽字体
- 📊 **表格支持**：完整的表格渲染，带边框和斑马纹
- 🇨🇳 **中文优化**：完美支持中文字体渲染

## 安装

```bash
npm install
```

首次安装会下载 Puppeteer 和 Chromium（约 170MB），请耐心等待。

## 使用方法

### 基础用法

```bash
# 从 Markdown 文件生成图片卡片
node src/index.js --markdown document.md --theme white --output ./cards

# 使用不同主题
node src/index.js --markdown document.md --theme beige

# 直接输入文字（纯文本模式）
node src/index.js --title "标题" --content "内容" --theme white
```

### 参数说明

- `-m, --markdown <file>` - Markdown 文件路径（推荐使用）
- `-t, --title <text>` - 标题文本（纯文本模式）
- `-c, --content <text>` - 正文内容（纯文本模式）
- `--theme <name>` - 主题名称：`white`、`beige`、`dark`（默认：white）
- `-o, --output <dir>` - 输出目录（默认：output）

## Markdown 支持

### 支持的语法

✅ **文本格式**
- 粗体：`**文字**`
- 斜体：`*文字*`
- 行内代码：`` `code` ``

✅ **代码块**
```javascript
function hello() {
  console.log("Hello!");
}
```
- 灰色背景 (#f6f8fa)
- 等宽字体
- 自动换行
- 超长代码自动缩小字体

✅ **列表**
- 无序列表（`-` 或 `*`）
- 有序列表（`1.` `2.`）
- 自动缩进和项目符号

✅ **表格**
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据 | 数据 | 数据 |
- 完整边框
- 表头灰色背景
- 斑马纹效果

✅ **引用**
> 引用文字

✅ **标题**
- H1-H6 支持
- 自动调整字体大小

✅ **图片**
- 本地图片：`![alt](./image.png)`
- 远程图片：`![alt](https://example.com/image.jpg)`
- 自动下载和缓存
- 等比例缩放居中

### 智能分页

- 代码块、列表、表格作为原子单元，不会被截断
- 普通段落在必要时智能拆分
- 自动在句号、换行符等自然断点处分页

## 配色主题

| 主题名 | 背景色 | 文字色 | 风格 |
|--------|--------|--------|------|
| white  | 白色 #FFFFFF | 黑色 #1A1A1A | 简约干净 |
| beige  | 米色 #F5F1E8 | 棕色 #5C4A3A | 复古温暖 |
| dark   | 深灰 #1E1E1E | 浅灰 #E8E8E8 | 暗黑模式 |

## 输出说明

生成的图片保存在 `output/` 目录（或指定目录）：

- Markdown 卡片：`mixed-{timestamp}-page{N}.png`
- 标题卡：`title-{timestamp}.png`
- 内容卡：`content-{timestamp}-page{N}.png`

## 作为 Claude Code Skill 使用

已包含 `2xhs-card` skill，可在 Claude Code 中直接使用：

```
帮我把这个 Markdown 文件转换成图片卡片
```

Claude 会自动识别并调用此工具。

## 技术栈

- **Puppeteer** - 浏览器自动化（高质量渲染）
- **Marked** - Markdown 解析
- **github-markdown-css** - GitHub 风格样式
- **Commander.js** - 命令行参数解析
- **Chalk** - 终端彩色输出

## 常见问题

**Q: 代码块不换行？**
A: 已修复，代码块会自动换行，超长代码会自动缩小字体。

**Q: 表格不显示？**
A: 确保使用标准 Markdown 表格语法，已支持完整表格渲染。

**Q: 首次安装很慢？**
A: Puppeteer 需要下载 Chromium（约 170MB），请确保网络畅通。

**Q: 如何自定义配色？**
A: 编辑 `src/themes.js` 文件，添加新的主题配置。

## License

MIT
