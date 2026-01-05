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
      { text: '面试', link: '/interview/最小路径和（DFS）' },
      { text: '开发', link: '/dev/jerbrains破解' }
    ],

    sidebar: {
      '/interview/': [
        {
          text: '面试',
          items: [
            { text: '最小路径和（DFS）', link: '/interview/最小路径和（DFS）' },
          ]
        }
      ],
      '/dev/': [
        {
          text: '开发',
          items: [
            { text: 'jerbrains破解', link: '/dev/jerbrains破解' },
            
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
