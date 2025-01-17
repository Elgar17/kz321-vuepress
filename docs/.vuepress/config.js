const { path } = require("@vuepress/utils");

module.exports = {
  title: "KZ321.top",
  base: "/",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/log.svg",
      },
    ],
    // 添加百度统计
    [
      "script",
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?71706381a5dce1c161d3325b6ee46a94";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`,
    ],
  ],
  description: "致力于分享互联网上的优质的哈萨克语网站与内容。", //描述
  dest: "./dist", // 设置输出目录
  port: 8080, // 端口

  themeConfig: {
    // 主题配置
    logo: "/log.svg",
    lastUpdated: true, // string | boolean
    locales: {
      title: "语言",
      "/": {
        selectLanguageName: "简体中文",
        navbar: [
          {
            text: "首页",
            link: "/",
          },
          {
            text: "字母表",
            link: "/alphabet.md",
          },
          {
            text: "资源",
            link: "/learn.md",
          },
          {
            text: "博客",
            link: "/blog/",
          },
          {
            text: "关于",
            link: "/about.md",
          },
        ],
      },
      // "/kz/": {
      //   selectLanguageName: "قازاقشا",
      //   navbar: [
      //     {
      //       text: "باس بەت",
      //       link: "/",
      //     },
      //     {
      //       text: "سايىت قوسۋ ",
      //       link: "https://support.qq.com/products/369710",
      //     },
      //     {
      //       text: "ءبىزجايلى ",
      //       link: "/about.md",
      //     },
      //   ],
      // },
      // sidebar: {
      //   "/blog/": [
      //     {
      //       title: "博客",
      //       children: ["", "1-win11-kaq-keyborad", "test"],
      //     },
      //   ],
      // },
    },
    sidebar: {
      "/blog/": [
        {
          title: "博客",
          // children: ["1-win11-kaq-keyborad", "2-kz321-site.md", "3-mac-kz-keyborad"],
        },
      ],
    },
    darkMode: true,
  },
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    "/": {
      lang: "zh", // 将会被设置为 <html> 的 lang 属性
      title: "kz321.top",
      // description: 'Vue-powered Static Site Generator'
    },
    // "/kz/": {
    //   lang: "kz",
    //   title: "kz321",
    //   description: "kaz",
    // },
  },
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: './docs/.vuepress/components/'
      }
    ]

    // [
    //   "@vuepress/register-components",
    //   {
    //     //componentsDir: "./components",
    //     components: {
    //       InputSearch: path.resolve(__dirname, "./components/InputSearch.vue"),
    //       // EpidemicMap: path.resolve(__dirname, './components/EpidemicMap.vue'),
    //       Valine: path.resolve(__dirname, "./components/Valine.vue"),
    //       // componentsDir: "./components",
    //       // Alphabet: path.resolve(__dirname, "./components/Alphabet.vue")
    //     },
    //   },
    // ],
  ],
};
