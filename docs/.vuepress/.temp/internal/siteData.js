export const siteData = {
  "base": "/",
  "lang": "en-US",
  "title": "KZ321.top",
  "description": "致力于分享互联网上的优质的哈萨克语网站与内容。",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/log.svg"
      }
    ],
    [
      "script",
      {},
      "var _hmt = _hmt || [];\n      (function() {\n        var hm = document.createElement(\"script\");\n        hm.src = \"https://hm.baidu.com/hm.js?71706381a5dce1c161d3325b6ee46a94\";\n        var s = document.getElementsByTagName(\"script\")[0]; \n        s.parentNode.insertBefore(hm, s);\n      })();"
    ]
  ],
  "locales": {
    "/": {
      "lang": "zh",
      "title": "kz321.top"
    }
  }
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
