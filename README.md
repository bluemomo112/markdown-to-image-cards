# Text-to-Card Generator

将文本转换为精美的图片卡片，支持自动换行和分页。

## 功能特点

- 📝 **三种卡片类型**：标题卡（居中大字）、内容卡（自动分页）、Markdown 图文混排卡
- 🎨 **4 种配色主题**：米色、白色、深色、蓝色
- 📏 **固定尺寸**：1440×2400px（适合社交媒体分享）
- 🔤 **智能排版**：自动换行、自动分页、智能断句
- 🖼️ **图文混排**：支持 Markdown 文件，图片自动等比例缩放居中
- 🇨🇳 **中文优化**：完美支持中文字体渲染

## 安装

```bash
npm install
```

首次安装会下载 Puppeteer 和 Chromium（约 170MB），请耐心等待。

## 使用方法

### 命令行使用

```bash
# 生成标题卡
node src/index.js --title "旅行的意义" --theme white

# 生成内容卡（自动分页）
node src/index.js --content "这是一段很长的正文内容..." --theme white

# 同时生成标题卡和内容卡
node src/index.js --title "我的故事" --content "很久很久以前..." --theme blue

# 生成 Markdown 图文混排卡片（新功能）
node src/index.js --markdown travel.md --theme white

# 指定输出目录
node src/index.js --title "标题" --output ./my-cards
```

### 参数说明

- `-t, --title <text>` - 标题文本（生成标题卡）
- `-c, --content <text>` - 正文内容（生成内容卡，自动分页）
- `-m, --markdown <file>` - Markdown 文件路径（生成图文混排卡片）
- `--theme <name>` - 主题名称，可选：`beige`、`white`、`dark`、`blue`（默认：white）
- `-o, --output <dir>` - 输出目录（默认：output）

### 快速测试

```bash
npm test
```

## 配色主题

| 主题名 | 背景色 | 文字色 | 风格 |
|--------|--------|--------|------|
| beige  | 米色 #F5F1E8 | 棕色 #5C4A3A | 复古温暖 |
| white  | 白色 #FFFFFF | 黑色 #1A1A1A | 简约干净 |
| dark   | 深灰 #1E1E1E | 浅灰 #E8E8E8 | 暗黑模式 |
| blue   | 浅蓝 #E8F4F8 | 深蓝 #2C5F7C | 清新淡雅 |

## 字体规格

- **标题卡**：60px（长标题自动缩小至 48px 或 36px）
- **内容卡**：48px
- **行高**：1.6 倍
- **字体**：PingFang SC, Microsoft YaHei, Hiragino Sans GB

## 输出说明

生成的图片保存在 `output/` 目录（或指定目录）：

- 标题卡：`title-{timestamp}.png`
- 内容卡：`content-{timestamp}-page{N}.png`
- Markdown 图文混排卡：`mixed-{timestamp}-page{N}.png`

## Markdown 图文混排

支持将 Markdown 文件转换为图文混排卡片：

**支持的 Markdown 语法：**
- 段落文本
- 标题（# ## ###）
- 加粗（**text**）、斜体（*text*）
- 图片（`![alt](path)`）
- 列表（- item）

**图片处理：**
- 自动等比例缩放
- 居中显示
- 支持本地图片路径（相对/绝对路径）

**示例：**
```bash
node src/index.js --markdown travel.md --theme white
```

## 作为 Claude Code 技能使用

你可以直接在 Claude Code 中调用此工具：

```
帮我生成一张标题卡，标题是"旅行的意义"，用米色主题
```

Claude 会自动调用命令生成图片。

## 技术栈

- **Puppeteer** - 浏览器自动化（高质量渲染）
- **Commander.js** - 命令行参数解析
- **Chalk** - 终端彩色输出

## 常见问题

**Q: 首次安装很慢？**
A: Puppeteer 需要下载 Chromium（约 170MB），请确保网络畅通。

**Q: 中文字体显示不正常？**
A: 确保系统安装了 PingFang SC 或 Microsoft YaHei 字体。

**Q: 如何自定义配色？**
A: 编辑 `src/themes.js` 文件，添加新的主题配置。

**Q: 分页不准确？**
A: 分页算法基于实际渲染高度，已预留 100px 安全边距。如仍有问题，请提 issue。

## License

MIT
