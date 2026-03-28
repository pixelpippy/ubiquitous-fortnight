// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '学习笔记',
  description: '记录一些 Linux、LLM 与部署相关学习笔记。',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于我', link: '/about' }
    ],
    sidebar: [
      {
        text: '20221024',
        items: [
          { text: 'Linux学习笔记', link: '/20221024/Linux学习笔记' }
        ]
      },
      {
        text: '20251115',
        items: [
          { text: 'Linux安全运维手册', link: '/20251115/Linux安全运维手册' },
          { text: '服务器部署vllm指南', link: '/20251115/服务器部署vllm指南' }
        ]
      },
      {
        text: '20240325',
        items: [
          { text: 'Linux使用clash指南', link: '/20240325/Linux使用clash指南' }
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