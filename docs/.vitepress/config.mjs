import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "KZ321.top",
  description: "致力于分享互联网上的优质的哈萨克语网站与内容。",
  lang: 'zh-CN',
  
  // 忽略死链接检查（针对下载文件等）
  ignoreDeadLinks: [
    /^\/b\/kazak\.dmg$/
  ],
  
  head: [
    // 多种格式的 favicon 以确保兼容性
    ['link', { rel: 'icon', href: '/kz321.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/kz321.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/kz321.svg' }],
    // 添加百度统计
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?71706381a5dce1c161d3325b6ee46a94";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `]
  ],

  // 输出目录
  outDir: '../dist',

  themeConfig: {
    logo: '/kz321.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '💝 支持作者', link: '/about' }
    ],

    sidebar: {
      '/b/': [
        {
          text: '博客',
          items: [
            { text: 'windows 11 哈萨克输入法键位图', link: '/b/1-win11-kaq-keyborad' },
            { text: '曾经的 KZ321.COM 网站', link: '/b/2-kz321-site' },
            { text: 'Mac 系统安装哈萨克语输入法', link: '/b/3-mac-kz-keyborad' }
          ]
        }
      ]
    },

    socialLinks: [],

    footer: {
      message: '',
      copyright: 'Copyright © 2021 Elǵar'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  },

  // 多语言配置（预留）
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'kz321.top',
      description: '致力于分享互联网上的优质的哈萨克语网站与内容。'
    }
    // 如需要可以添加哈萨克语版本
    // kz: {
    //   label: 'قازاقشا',
    //   lang: 'kz',
    //   title: 'kz321',
    //   link: '/kz/'
    // }
  }
})
