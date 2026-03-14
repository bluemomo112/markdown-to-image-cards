#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Installing 2xhs-card as Claude Code Skill...${NC}\n"

# Define paths
SKILL_DIR="$HOME/.agents/skills/2xhs-card"
CLAUDE_SKILL_DIR="$HOME/.claude/skills/2xhs-card"

# Clone or update the tool
if [ -d "$SKILL_DIR" ]; then
  echo -e "${YELLOW}Tool directory already exists. Updating...${NC}"
  cd "$SKILL_DIR" && git pull
else
  echo -e "${BLUE}Cloning repository...${NC}"
  git clone https://github.com/bluemomo112/markdown-to-image-cards.git "$SKILL_DIR"
fi

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"
cd "$SKILL_DIR" && npm install

# Create Claude skill directory
echo -e "\n${BLUE}Setting up Claude Code skill...${NC}"
mkdir -p "$CLAUDE_SKILL_DIR"

# Generate SKILL.md with absolute paths
cat > "$CLAUDE_SKILL_DIR/SKILL.md" << EOF
---
name: 2xhs-card
description: Generate beautiful image cards from Markdown files with rich formatting support (bold, italic, code blocks, lists, tables, quotes). Use when users want to convert Markdown documents into styled image cards for social media, presentations, or visual content. Triggers on requests like "convert this markdown to images", "generate cards from md file", "create image cards", or when working with .md files that need visual representation.
---

# 2xhs-card - Markdown to Image Cards

## Overview

Convert Markdown files into beautifully styled image cards with full formatting preservation. Supports rich text formatting (bold, italic, code blocks with syntax highlighting, lists, tables, blockquotes) and intelligent pagination.

## Quick Start

Basic usage:
\`\`\`bash
node $SKILL_DIR/src/index.js --markdown <file.md> --theme <theme> --output <dir>
\`\`\`

Available themes: \`white\`, \`beige\`, \`dark\`, \`blue\`

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
\`\`\`bash
node $SKILL_DIR/src/index.js --markdown document.md --theme white --output ./cards
\`\`\`

### Example 2: Different Themes
\`\`\`bash
node $SKILL_DIR/src/index.js --markdown document.md --theme beige
node $SKILL_DIR/src/index.js --markdown document.md --theme dark
\`\`\`

### Example 3: Plain Text Mode
\`\`\`bash
node $SKILL_DIR/src/index.js --title "Title" --content "Content" --theme white
\`\`\`

## Workflow

When user requests to create cards from Markdown:

1. **Verify file exists**: Check the .md file path
2. **Choose theme**: Ask user for theme preference (white/beige/dark/blue) if not specified
3. **Run generation**:
   \`\`\`bash
   node $SKILL_DIR/src/index.js --markdown <path> --theme <theme> --output <output-dir>
   \`\`\`
4. **Report results**: Show generated file paths and page count

## Output

Generated images (1440×2400px PNG):
- \`mixed-{timestamp}-page{N}.png\` - Markdown cards
- \`title-{timestamp}.png\` - Title cards
- \`content-{timestamp}-page{N}.png\` - Content cards
EOF

echo -e "\n${GREEN}✅ Installation complete!${NC}"
echo -e "${BLUE}📍 Tool location:${NC} $SKILL_DIR"
echo -e "${BLUE}📍 Skill location:${NC} $CLAUDE_SKILL_DIR"
echo -e "\n${GREEN}You can now use the skill in Claude Code by saying:${NC}"
echo -e "  ${YELLOW}\"Convert this markdown to image cards\"${NC}"
