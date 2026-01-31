import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/","哈萨克语导航",["/index.html","/README.md"]],
  ["v-22a39d25","/about.html","🎉 关于 KZ321",["/about","/about.md"]],
  ["v-22f65826","/alphabet.html","",["/alphabet","/alphabet.md"]],
  ["v-4ec0007f","/convert.html","",["/convert","/convert.md"]],
  ["v-07588cce","/learn.html","学习哈萨克语",["/learn","/learn.md"]],
  ["v-0692e939","/word-conversion.html","",["/word-conversion","/word-conversion.md"]],
  ["v-3c3d0bd2","/word-split-view.html","",["/word-split-view","/word-split-view.md"]],
  ["v-4d5746ee","/word-split.html","",["/word-split","/word-split.md"]],
  ["v-56e5a82b","/b/1-win11-kaq-keyborad.html","Windiws11 默认哈萨克语输入法布局图",["/b/1-win11-kaq-keyborad","/b/1-win11-kaq-keyborad.md"]],
  ["v-4a4aba32","/b/2-kz321-site.html","曾经的 KZ321.COM",["/b/2-kz321-site","/b/2-kz321-site.md"]],
  ["v-2309cb50","/b/3-mac-kz-keyborad.html","Mac 系统安装哈萨克输入法",["/b/3-mac-kz-keyborad","/b/3-mac-kz-keyborad.md"]],
  ["v-1a3a24c6","/b/","博客",["/b/index.html","/b/README.md"]],
  ["v-2d0a9f07","/kz/","قازاقشا باس بەت",["/kz/index.html","/kz/README.md"]],
  ["v-3706649a","/404.html","",["/404"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, title, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta: { title },
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)
