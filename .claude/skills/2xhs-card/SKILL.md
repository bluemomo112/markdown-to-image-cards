---
name: 2xhs-card
description: Generate beautiful image cards from Markdown files with rich formatting support (bold, italic, code blocks, lists, tables, quotes). Use when users want to convert Markdown documents into styled image cards for social media, presentations, or visual content. Triggers on requests like "convert this markdown to images", "generate cards from md file", "create image cards", or when working with .md files that need visual representation.
---

# 2xhs-card - Markdown to Image Cards

## Overview

Convert Markdown files into beautifully styled image cards with full formatting preservation. Supports rich text formatting (bold, italic, code blocks with syntax highlighting, lists, tables, blockquotes) and intelligent pagination.

## Quick Start

First install dependencies in the skill directory:
```bash
cd <skill-directory> && npm install
```

Basic usage:
```bash
node <skill-directory>/src/index.js --markdown <file.md> --theme <theme> --output <dir>
```

Available themes: `white`, `beige`, `dark`, `blue`

## Core Features

### 1. Rich Markdown Rendering

All Markdown elements are rendered with proper styling:
- **Text formatting**: Bold, italic, inline code
- **Code blocks**: Syntax highlighting, auto-wrapping, gray background
- **Lists**: Ordered and unordered with proper indentation
- **Tables**: Full table support with borders and zebra striping
- **Blockquotes**: Styled with left border
- **Headings**: H1-H6 with appropriate sizing
- **Images**: Local and remote, auto download and cache

### 2. Intelligent Pagination

- Automatic page breaks based on content height
- Atomic blocks (code, lists, tables) never split across pages
- Text paragraphs split at natural breakpoints (periods, line breaks)
- Oversized code blocks automatically shrink font size

### 3. Image Support

- Embed images from local paths or URLs
- Automatic image downloading and caching
- GIF detection and skipping
- Images treated as atomic blocks

## Usage Examples

### Example 1: Simple Markdown
```bash
node src/index.js --markdown document.md --theme white --output ./cards
```

### Example 2: Different Themes
```bash
node src/index.js --markdown document.md --theme beige
node src/index.js --markdown document.md --theme dark
```

### Example 3: Plain Text Mode
```bash
node src/index.js --title "Title" --content "Content" --theme white
```

## Project Structure

- `src/index.js` - CLI entry point
- `src/generator.js` - Card generation logic
- `src/markdown-parser.js` - Markdown to HTML conversion
- `src/templates/` - Card HTML templates
- `src/themes.js` - Theme definitions

## Workflow

When user requests to create cards from Markdown:

1. **Verify file exists**: Check the .md file path
2. **Choose theme**: Ask user for theme preference (white/beige/dark/blue) if not specified
3. **Run generation**:
   ```bash
   node src/index.js --markdown <path> --theme <theme> --output <output-dir>
   ```
4. **Report results**: Show generated file paths and page count

## Styling Details

### Code Blocks
- Background: #f6f8fa (light gray)
- Font: Monospace (42px, shrinks to 32px if oversized)
- Padding: 30px
- Border radius: 12px
- Line wrapping: Enabled with `white-space: pre-wrap`

### Tables
- Border: 2px solid #dfe2e5
- Cell padding: 20px 30px
- Header background: #f6f8fa
- Zebra striping: Even rows #f9f9f9
- Font size: 42px

### Text
- Base font: PingFang SC, Microsoft YaHei
- Size: 48px (paragraphs), 42-72px (headings)
- Line height: 1.8
- Text alignment: Justified

## Output

Generated images (1440×2400px PNG):
- `mixed-{timestamp}-page{N}.png` - Markdown cards
- `title-{timestamp}.png` - Title cards
- `content-{timestamp}-page{N}.png` - Content cards
