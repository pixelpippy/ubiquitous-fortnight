import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.join(__dirname, '../docs');

// 日期格式化函数：20200220 -> 2020年02月20日
function formatDate(dateStr) {
  if (!/^\d{8}$/.test(dateStr)) {
    return dateStr; // 如果不是8位数字，原样返回
  }
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}年${month}月${day}日`;
}

// 获取所有日期文件夹和文章
function getAllArticles() {
  const articles = {};
  const dirs = fs.readdirSync(docsDir);

  for (const dir of dirs) {
    const dirPath = path.join(docsDir, dir);
    const stat = fs.statSync(dirPath);

    // 只处理数字文件夹（日期格式）
    if (stat.isDirectory() && /^\d+$/.test(dir)) {
      const files = fs.readdirSync(dirPath);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      if (mdFiles.length > 0) {
        articles[dir] = mdFiles.map(f => ({
          name: f.replace('.md', ''),
          file: f
        }));
      }
    }
  }

  return articles;
}

// 按日期倒序排列（从新到旧）- 返回有序数组
function sortArticles(articles) {
  return Object.entries(articles).sort((a, b) => {
    const numB = parseInt(b[0]);
    const numA = parseInt(a[0]);
    return numB - numA; // 从大到小，即从新到旧
  });
}

// 生成 articles.md
function generateArticlesMd(sortedArticles) {
  let content = '# 文章目录\n\n按日期排序（由新到旧）：\n\n';

  // sortedArticles 是已排序的数组，按新到旧顺序
  for (const [date, files] of sortedArticles) {
    const formattedDate = formatDate(date);
    content += `## ${formattedDate}\n\n`;
    for (const file of files) {
      const linkPath = `/${date}/${file.name}`;
      content += `- [${file.name}](${linkPath})\n`;
    }
    content += '\n';
  }

  return content;
}

// 生成 sidebar 配置
function generateSidebarConfig(sortedArticles) {
  const sidebar = [];

  // sortedArticles 是已排序的数组，按新到旧顺序
  for (const [date, files] of sortedArticles) {
    const formattedDate = formatDate(date);
    const items = files.map(file => ({
      text: file.name,
      link: `/${date}/${file.name}`
    }));

    sidebar.push({
      text: formattedDate,
      items: items
    });
  }

  return sidebar;
}

// 更新 config.ts
function updateConfigTs(sidebar) {
  const configPath = path.join(docsDir, '.vitepress/config.ts');
  let configContent = fs.readFileSync(configPath, 'utf-8');

  // 生成新的 sidebar 配置字符串
  const sidebarItemStr = sidebar.map(item => 
    `    {\n` +
    `      text: '${item.text}',\n` +
    `      items: [\n` +
    item.items.map(file => `        { text: '${file.text}', link: '${file.link}' }`).join(',\n') +
    `\n      ]\n` +
    `    }`
  ).join(',\n');

  const sidebarStr = `[\n${sidebarItemStr}\n  ]`;

  // 替换 sidebar 配置
  const newContent = configContent.replace(
    /sidebar: \[[\s\S]*?\],/,
    `sidebar: ${sidebarStr},`
  );

  fs.writeFileSync(configPath, newContent, 'utf-8');
  console.log('✓ 已更新 .vitepress/config.ts');
}

// 主函数
function main() {
  try {
    const articles = getAllArticles();
    const sortedArticles = sortArticles(articles);

    // 生成 articles.md
    const articlesMdContent = generateArticlesMd(sortedArticles);
    fs.writeFileSync(
      path.join(docsDir, 'articles.md'),
      articlesMdContent,
      'utf-8'
    );
    console.log('✓ 已生成 articles.md');

    // 更新 config.ts
    const sidebar = generateSidebarConfig(sortedArticles);
    updateConfigTs(sidebar);

    console.log('\n✅ 文章列表已自动更新！');
    console.log(`检测到 ${sortedArticles.length} 个日期文件夹，共 ${
      sortedArticles.reduce((sum, [_, files]) => sum + files.length, 0)
    } 篇文章`);
  } catch (error) {
    console.error('❌ 错误：', error.message);
    process.exit(1);
  }
}

main();
