// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/', 
  lang: 'zh-CN',
  title: 'vinson的博客',
  description: '记录一些 Linux、LLM 与部署相关学习笔记。',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于我', link: '/about' }
    ],
    sidebarMenuLabel: '目录',
    outline: [2, 3],
    outlineTitle: '页面导航',
    returnToTopLabel: '回到顶部',
    sidebar: [
    {
      text: '2026年03月31日',
      items: [
        { text: 'tmux使用常用命令和技巧', link: '/20260331/tmux使用常用命令和技巧' }
      ]
    },
    {
      text: '2026年03月30日',
      items: [
        { text: '服务器关闭图形化命令', link: '/20260330/服务器关闭图形化命令' }
      ]
    },
    {
      text: '2025年11月15日',
      items: [
        { text: 'Linux安全运维手册', link: '/20251115/Linux安全运维手册' },
        { text: '服务器部署vllm指南', link: '/20251115/服务器部署vllm指南' }
      ]
    },
    {
      text: '2025年02月27日',
      items: [
        { text: '书生大模型训练营', link: '/20250227/书生大模型训练营' }
      ]
    },
    {
      text: '2024年03月25日',
      items: [
        { text: 'Linux使用clash指南', link: '/20240325/Linux使用clash指南' }
      ]
    },
    {
      text: '2022年10月24日',
      items: [
        { text: 'Linux学习笔记', link: '/20221024/Linux学习笔记' }
      ]
    }
  ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/pixelpippy' }
    ],
    outline: [2, 3],
    outlineTitle: '页面导航'
  }
})
