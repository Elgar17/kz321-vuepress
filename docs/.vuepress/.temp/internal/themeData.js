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
          "text": "提交网址",
          "link": "https://support.qq.com/products/369710"
        },
        {
          "text": "关于",
          "link": "/about.md"
        }
      ]
    },
    "/kz/": {
      "selectLanguageName": "قازاقشا",
      "navbar": [
        {
          "text": "باس بەت",
          "link": "/"
        },
        {
          "text": "سايىت قوسۋ ",
          "link": "https://support.qq.com/products/369710"
        },
        {
          "text": "ءبىزجايلى ",
          "link": "/about.md"
        }
      ]
    }
  },
  "navbar": [],
  "darkMode": true,
  "repo": null,
  "selectLanguageText": "Languages",
  "selectLanguageAriaLabel": "Select language",
  "sidebar": "auto",
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
