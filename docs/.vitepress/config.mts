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
        },
        {
          text: 'vpn',
          link: '/dev/vpn'
        },
        {
          text: '常用网站',
          link: '/dev/常用网站'
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
      text: 'redis',
      collapsed: true,
      items: [
        {
          text: 'redis场景题',
          link: '/interview/redis/redis场景题'
        },
        {
          text: 'redis的key过期机制',
          link: '/interview/redis/redis的key过期机制'
        },
        {
          text: 'redis的主从复制原理',
          link: '/interview/redis/redis的主从复制原理'
        },
        {
          text: 'redis的分片原理',
          link: '/interview/redis/redis的分片原理'
        },
        {
          text: 'redis的哨兵模式',
          link: '/interview/redis/redis的哨兵模式'
        },
        {
          text: 'redis的持久机制',
          link: '/interview/redis/redis的持久机制'
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
      { icon: 'github', link: 'https://github.com/foldn/blog/tree/master' }
    ]
  }
})
