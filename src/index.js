#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { generateCards, generateCardsFromMarkdown } from './generator.js';
import { themes } from './themes.js';

const program = new Command();

program
  .name('text-to-card')
  .description('将文本转换为精美的图片卡片')
  .version('1.0.0')
  .option('-t, --title <text>', '标题文本')
  .option('-c, --content <text>', '正文内容')
  .option('-m, --markdown <file>', 'Markdown 文件路径（支持图文混排）')
  .option('--theme <name>', `主题名称 (${Object.keys(themes).join(', ')})`, 'white')
  .option('-o, --output <dir>', '输出目录', 'output')
  .action(async (options) => {
    try {
      // 如果提供了 Markdown 文件
      if (options.markdown) {
        console.log(chalk.cyan('\n📋 配置信息:'));
        console.log(`   Markdown 文件: ${options.markdown}`);
        console.log(`   主题: ${themes[options.theme]?.name || options.theme}`);
        console.log(`   输出: ${options.output}\n`);

        const files = await generateCardsFromMarkdown({
          mdFile: options.markdown,
          theme: options.theme,
          outputDir: options.output
        });

        console.log(chalk.green('\n✨ 生成的文件:'));
        files.forEach(file => {
          console.log(chalk.gray(`   ${file}`));
        });
        console.log();
        return;
      }

      // 验证输入
      if (!options.title && !options.content) {
        console.error(chalk.red('❌ 错误: 必须提供 --title、--content 或 --markdown'));
        process.exit(1);
      }

      // 显示配置
      console.log(chalk.cyan('\n📋 配置信息:'));
      if (options.title) console.log(`   标题: ${options.title}`);
      if (options.content) console.log(`   内容: ${options.content.substring(0, 50)}${options.content.length > 50 ? '...' : ''}`);
      console.log(`   主题: ${themes[options.theme]?.name || options.theme}`);
      console.log(`   输出: ${options.output}\n`);

      // 生成卡片
      const files = await generateCards({
        title: options.title,
        content: options.content,
        theme: options.theme,
        outputDir: options.output
      });

      // 显示结果
      console.log(chalk.green('\n✨ 生成的文件:'));
      files.forEach(file => {
        console.log(chalk.gray(`   ${file}`));
      });
      console.log();

    } catch (error) {
      console.error(chalk.red(`\n❌ 错误: ${error.message}\n`));
      process.exit(1);
    }
  });

program.parse();
