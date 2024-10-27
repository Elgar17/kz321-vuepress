export const themeData = {
  "logo": "/log.svg",
  "lastUpdated": true,
  "locales": {
    "title": "语言",
    "/": {
      "selectLanguageName": "简体中文",
      "navbar": [
        {
          "text": "首页",
          "link": "/"
        },
        {
          "text": "字母表",
          "link": "/alphabet.md"
        },
        {
          "text": "资源",
          "link": "/learn.md"
        },
        {
          "text": "博客",
          "link": "/blog/"
        },
        {
          "text": "关于",
          "link": "/about.md"
        }
      ]
    }
  },
  "sidebar": {
    "/blog/": [
      {
        "title": "博客"
      }
    ]
  },
  "darkMode": true,
  "navbar": [],
  "repo": null,
  "selectLanguageText": "Languages",
  "selectLanguageAriaLabel": "Select language",
  "sidebarDepth": 2,
  "editLink": true,
  "editLinkText": "Edit this page",
  "lastUpdatedText": "Last Updated",
  "contributors": true,
  "contributorsText": "Contributors",
  "notFound": [
    "There's nothing here.",
    "How did we get here?",
    "That's a Four-Oh-Four.",
    "Looks like we've got some broken links."
  ],
  "backToHome": "Take me home",
  "openInNewWindow": "open in new window",
  "toggleDarkMode": "toggle dark mode",
  "toggleSidebar": "toggle sidebar"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
