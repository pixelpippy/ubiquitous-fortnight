# 自动化文章管理指南

## 📋 问题解决方案

之前你需要手动更新两个文件来添加新文章：
- `articles.md` - 文章列表
- `.vitepress/config.ts` - 侧边栏配置

现在只需一条命令就能自动完成！

## 🚀 使用方法

### 第一步：添加新文章
在相应的日期文件夹中添加 Markdown 文件，例如：
```
docs/
  20260331/          ← 日期文件夹
    article1.md      ← 新文章
    article2.md      ← 新文章
```

### 第二步：运行自动化脚本
在项目根目录运行：
```bash
npm run generate
```

就这样！脚本会：
✓ 扫描所有日期文件夹中的 Markdown 文件
✓ 按日期从新到旧自动排序
✓ 更新 `articles.md` 文件
✓ 更新 `.vitepress/config.ts` 中的 sidebar 配置

### 第三步：（可选）启动开发服务器
```bash
npm run dev
```

## 📝 工作流程示例

假设你要添加一篇新文章：

1. **创建文件**
   ```bash
   echo "# 新文章内容" > docs/20260401/新文章标题.md
   ```

2. **运行脚本**
   ```bash
   npm run generate
   ```

3. **查看结果**
   - `articles.md` 会自动更新
   - `config.ts` 会自动更新
   - 网站会显示新文章

## 🔧 脚本功能详解

脚本位置：`scripts/generateArticles.js`

功能：
- 自动检测 `docs/` 目录下所有数字命名的文件夹（日期格式）
- 提取每个文件夹中的所有 `.md` 文件
- 按日期倒序生成文章列表
- 保持格式整洁，易于阅读

## ⚡ 快速命令参考

```bash
# 生成/更新文章列表
npm run generate

# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run serve
```

## 💡 提示

- 日期文件夹名必须是纯数字（如 `20260401`）
- Markdown 文件名就是网站上显示的文章标题
- 文章会按日期文件夹自动分组
- 相同日期内的文章按字母顺序排列

## 🎯 一劳永逸

现在你的工作流程变得很简单：

```
1. 写文章 → 2. 运行 npm run generate → 3. 网站自动更新
```

再也不用手动维护两个配置文件了！
