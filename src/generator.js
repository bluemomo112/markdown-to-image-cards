import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { paginateContent, calculateTitleFontSize } from './paginator.js';
import { themes } from './themes.js';
import { parseMarkdown } from './markdown-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 生成卡片图片
 * @param {object} options - 配置选项
 * @param {string} options.title - 标题文本
 * @param {string} options.content - 正文内容
 * @param {string} options.theme - 主题名称
 * @param {string} options.outputDir - 输出目录
 * @returns {Promise<string[]>} 生成的图片路径数组
 */
export async function generateCards(options) {
  const { title, content, theme: themeName = 'beige', outputDir = 'output' } = options;

  // 验证主题
  const theme = themes[themeName];
  if (!theme) {
    throw new Error(`未知主题: ${themeName}。可用主题: ${Object.keys(themes).join(', ')}`);
  }

  // 确保输出目录存在
  const outputPath = path.resolve(process.cwd(), outputDir);
  await fs.mkdir(outputPath, { recursive: true });

  // 启动浏览器
  console.log('🚀 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const generatedFiles = [];

  try {
    // 生成标题卡
    if (title) {
      console.log('📝 生成标题卡...');
      const titlePath = await generateTitleCard(browser, title, theme, outputPath);
      generatedFiles.push(titlePath);
    }

    // 生成内容卡
    if (content) {
      console.log('📄 分析内容并分页...');
      const templatePath = path.join(__dirname, 'templates', 'content-card.html');
      const pages = await paginateContent(content, browser, templatePath, theme);

      console.log(`📚 共 ${pages.length} 页内容`);

      for (let i = 0; i < pages.length; i++) {
        console.log(`   生成第 ${i + 1}/${pages.length} 页...`);
        const contentPath = await generateContentCard(browser, pages[i], theme, outputPath, i + 1);
        generatedFiles.push(contentPath);
      }
    }

    console.log(`✅ 完成！共生成 ${generatedFiles.length} 张卡片`);
    return generatedFiles;

  } finally {
    await browser.close();
  }
}

/**
 * 生成标题卡
 */
async function generateTitleCard(browser, title, theme, outputPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 2400 });

  // 计算字体大小
  const fontSize = calculateTitleFontSize(title);

  // 读取并渲染模板
  const templatePath = path.join(__dirname, 'templates', 'title-card.html');
  const template = await fs.readFile(templatePath, 'utf-8');
  const html = template
    .replace('{{background}}', theme.background)
    .replace('{{textColor}}', theme.text)
    .replace('{{fontSize}}', fontSize)
    .replace('{{title}}', title);

  await page.setContent(html);

  // 截图
  const timestamp = Date.now();
  const filename = `title-${timestamp}.png`;
  const filepath = path.join(outputPath, filename);

  await page.screenshot({
    path: filepath,
    type: 'png'
  });

  await page.close();
  return filepath;
}

/**
 * 生成内容卡
 */
async function generateContentCard(browser, content, theme, outputPath, pageNumber) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 2400 });

  // 读取并渲染模板
  const templatePath = path.join(__dirname, 'templates', 'content-card.html');
  const template = await fs.readFile(templatePath, 'utf-8');
  const html = template
    .replace('{{background}}', theme.background)
    .replace('{{textColor}}', theme.text)
    .replace('{{content}}', content);

  await page.setContent(html);

  // 截图
  const timestamp = Date.now();
  const filename = `content-${timestamp}-page${pageNumber}.png`;
  const filepath = path.join(outputPath, filename);

  await page.screenshot({
    path: filepath,
    type: 'png'
  });

  await page.close();
  return filepath;
}

/**
 * 从 Markdown 文件生成卡片
 * @param {object} options - 配置选项
 * @param {string} options.mdFile - Markdown 文件路径
 * @param {string} options.theme - 主题名称
 * @param {string} options.outputDir - 输出目录
 * @returns {Promise<string[]>} 生成的图片路径数组
 */
export async function generateCardsFromMarkdown(options) {
  const { mdFile, theme: themeName = 'white', outputDir = 'output' } = options;

  // 验证主题
  const theme = themes[themeName];
  if (!theme) {
    throw new Error(`未知主题: ${themeName}。可用主题: ${Object.keys(themes).join(', ')}`);
  }

  // 解析 Markdown 文件
  console.log('📖 解析 Markdown 文件...');
  const blocks = await parseMarkdown(mdFile);
  console.log(`   发现 ${blocks.length} 个内容块`);

  // 将图片转换为 base64
  for (const block of blocks) {
    if (block.type === 'image') {
      const imageBuffer = await fs.readFile(block.content);
      block.base64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    }
  }

  // 确保输出目录存在
  const outputPath = path.resolve(process.cwd(), outputDir);
  await fs.mkdir(outputPath, { recursive: true });

  // 启动浏览器
  console.log('🚀 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const generatedFiles = [];

  try {
    // 生成图文混排卡片
    console.log('🎨 生成图文混排卡片...');
    const cards = await generateMixedContentCards(browser, blocks, theme, outputPath);
    generatedFiles.push(...cards);

    console.log(`✅ 完成！共生成 ${generatedFiles.length} 张卡片`);
    return generatedFiles;

  } finally {
    await browser.close();
  }
}

/**
 * 生成图文混排卡片
 */
async function generateMixedContentCards(browser, blocks, theme, outputPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 2400 });
  // 增加导航超时时间以处理大文档
  await page.setDefaultNavigationTimeout(120000); // 120秒

  // 读取模板
  const templatePath = path.join(__dirname, 'templates', 'mixed-content-card.html');
  const template = (await fs.readFile(templatePath, 'utf-8'))
    .replace('{{backgroundColor}}', theme.background)
    .replace('{{textColor}}', theme.text);

  const generatedFiles = [];
  let currentPageBlocks = [];
  const maxHeight = 2140; // 2400 - 260 (padding)
  let remainingBlocks = [...blocks];

  while (remainingBlocks.length > 0) {
    let block = remainingBlocks.shift();

    // 检查是否为超长代码块
    if (block.type === 'html' && block.isAtomic && block.content.includes('<pre>')) {
      block = await handleOversizedCodeBlock(page, template, block, maxHeight);
    }

    // 尝试添加当前块到页面
    const testBlocks = [...currentPageBlocks, block];
    const testHeight = await measureContentHeight(page, template, testBlocks);

    if (testHeight <= maxHeight) {
      // 放得下，直接添加
      currentPageBlocks.push(block);
    } else if (currentPageBlocks.length === 0) {
      // 当前页为空但单个块就超出了
      if (block.type === 'html' && !block.isAtomic) {
        // 非原子 HTML 块需要拆分
        const { fit, overflow } = await splitTextBlock(page, template, currentPageBlocks, block, maxHeight);
        if (fit) {
          currentPageBlocks.push(fit);
        }
        // 生成当前页
        const filepath = await renderMixedContentCard(page, template, currentPageBlocks, theme, outputPath, generatedFiles.length + 1);
        generatedFiles.push(filepath);
        currentPageBlocks = [];
        // 剩余文字放回队列
        if (overflow) {
          remainingBlocks.unshift(overflow);
        }
      } else {
        // 原子块或图片块，直接放（CSS 会限制 max-height）
        currentPageBlocks.push(block);
        const filepath = await renderMixedContentCard(page, template, currentPageBlocks, theme, outputPath, generatedFiles.length + 1);
        generatedFiles.push(filepath);
        currentPageBlocks = [];
      }
    } else {
      // 当前页有内容但放不下新块
      if (block.type === 'html' && !block.isAtomic) {
        // 尝试拆分文本，先填满当前页
        const { fit, overflow } = await splitTextBlock(page, template, currentPageBlocks, block, maxHeight);
        if (fit) {
          currentPageBlocks.push(fit);
        }
        // 生成当前页
        const filepath = await renderMixedContentCard(page, template, currentPageBlocks, theme, outputPath, generatedFiles.length + 1);
        generatedFiles.push(filepath);
        currentPageBlocks = [];
        // 剩余文字放回队列
        if (overflow) {
          remainingBlocks.unshift(overflow);
        }
      } else {
        // 原子块或图片放不下，先生成当前页，块放到下一页
        const filepath = await renderMixedContentCard(page, template, currentPageBlocks, theme, outputPath, generatedFiles.length + 1);
        generatedFiles.push(filepath);
        currentPageBlocks = [];
        remainingBlocks.unshift(block);
      }
    }
  }

  // 生成最后一页
  if (currentPageBlocks.length > 0) {
    const filepath = await renderMixedContentCard(page, template, currentPageBlocks, theme, outputPath, generatedFiles.length + 1);
    generatedFiles.push(filepath);
  }

  await page.close();
  return generatedFiles;
}

/**
 * 处理超长代码块：自动缩小字体
 */
async function handleOversizedCodeBlock(page, template, block, maxHeight) {
  // 测量原始高度
  const originalHeight = await measureContentHeight(page, template, [block]);

  if (originalHeight <= maxHeight) {
    return block;
  }

  console.warn(`⚠️  代码块过长（${originalHeight}px > ${maxHeight}px），自动缩小字体`);

  // 添加 oversized 类
  const modifiedContent = block.content.replace(
    /<pre>/,
    '<pre class="oversized">'
  );

  return { ...block, content: modifiedContent };
}

/**
 * 拆分文本块：找到能放入当前页的最大文本量
 * 使用二分查找 + 优先在句号/换行处断开
 */
async function splitTextBlock(page, template, currentPageBlocks, htmlBlock, maxHeight) {
  // 代码块、列表等原子块不拆分
  if (htmlBlock.isAtomic) {
    return { fit: null, overflow: htmlBlock };
  }

  // 只拆分普通段落（<p> 标签）
  const textContent = htmlBlock.content.replace(/<[^>]+>/g, '');

  // 二分查找能放入的最大字符数
  let low = 1;
  let high = textContent.length;
  let bestFit = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const testText = textContent.substring(0, mid);

    // 重新构建 HTML
    const testHtml = htmlBlock.content.replace(
      /(<p>)(.*?)(<\/p>)/,
      `$1${testText}$3`
    );

    const testBlocks = [...currentPageBlocks, { ...htmlBlock, content: testHtml }];
    const testHeight = await measureContentHeight(page, template, testBlocks);

    if (testHeight <= maxHeight) {
      bestFit = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (bestFit === 0) {
    // 一个字都放不下
    return { fit: null, overflow: htmlBlock };
  }

  if (bestFit >= textContent.length) {
    // 全部放得下
    return { fit: htmlBlock, overflow: null };
  }

  // 尝试在句号、换行等自然断点处断开
  let splitPoint = bestFit;
  const searchRange = textContent.substring(Math.max(0, bestFit - 50), bestFit);
  const breakPoints = /[。！？\n]/g;
  let lastBreak = -1;
  let match;

  while ((match = breakPoints.exec(searchRange)) !== null) {
    lastBreak = match.index;
  }

  if (lastBreak >= 0) {
    splitPoint = Math.max(0, bestFit - 50) + lastBreak + 1;
  }

  const fitText = textContent.substring(0, splitPoint).trim();
  const overflowText = textContent.substring(splitPoint).trim();

  return {
    fit: fitText ? {
      ...htmlBlock,
      content: htmlBlock.content.replace(/(<p>)(.*?)(<\/p>)/, `$1${fitText}$3`)
    } : null,
    overflow: overflowText ? {
      ...htmlBlock,
      content: htmlBlock.content.replace(/(<p>)(.*?)(<\/p>)/, `$1${overflowText}$3`)
    } : null
  };
}

/**
 * 测量内容实际渲染高度
 */
async function measureContentHeight(page, template, blocks) {
  let contentHtml = '';

  for (const block of blocks) {
    if (block.type === 'html') {
      contentHtml += `<div class="html-block">${block.content}</div>`;
    } else if (block.type === 'image') {
      contentHtml += `<div class="image-block"><img src="${block.base64}" alt="${block.alt || ''}" /></div>`;
    }
  }

  const html = template.replace('{{content}}', contentHtml);
  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 120000 });

  // 获取 content-wrapper 的实际高度
  const height = await page.evaluate(() => {
    const wrapper = document.querySelector('.content-wrapper');
    return wrapper ? wrapper.scrollHeight : 0;
  });

  return height;
}

/**
 * 渲染单个图文混排卡片
 */
async function renderMixedContentCard(page, template, blocks, theme, outputPath, pageNumber) {
  // 构建 HTML 内容
  let contentHtml = '';

  for (const block of blocks) {
    if (block.type === 'html') {
      contentHtml += `<div class="html-block">${block.content}</div>`;
    } else if (block.type === 'image') {
      contentHtml += `<div class="image-block"><img src="${block.base64}" alt="${block.alt || ''}" /></div>`;
    }
  }

  const html = template.replace('{{content}}', contentHtml);
  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 120000 });

  // 截图
  const timestamp = Date.now();
  const filename = `mixed-${timestamp}-page${pageNumber}.png`;
  const filepath = path.join(outputPath, filename);

  await page.screenshot({
    path: filepath,
    type: 'png'
  });

  return filepath;
}
