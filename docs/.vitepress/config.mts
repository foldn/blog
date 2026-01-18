import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "foldndoc",
  description: "foldn doc",
  base : '/blog/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '面试', link: '/interview/home' },
      { text: '开发', link: '/dev/home' }
    ],

    sidebar: {
  '/dev/': [
    {
      items: [
        {
          text: '目录',
          link: '/dev/home'
        }
      ]
    },
    {
      text: '其他',
      collapsed: false,
      items: [
        {
          text: 'jerbrains破解',
          link: '/dev/jerbrains破解'
        }
      ]
    }
  ],
  '/interview/': [
    {
      items: [
        {
          text: '目录',
          link: '/interview/home'
        }
      ]
    },
    {
      text: '消息队列',
      collapsed: true,
      items: [
        {
          text: 'kafka',
          link: '/interview/消息队列/kafka'
        }
      ]
    },
    {
      text: '算法',
      collapsed: true,
      items: [
        {
          text: '其他',
          collapsed: true,
          items: [
            {
              text: '最小路径和（DFS）',
              link: '/interview/算法/其他/最小路径和（DFS）'
            }
          ]
        }
      ]
    }
  ]
},

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
