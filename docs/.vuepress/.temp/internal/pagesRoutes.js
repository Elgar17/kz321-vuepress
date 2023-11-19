import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/","哈萨克语导航",["/index.html","/README.md"]],
  ["v-22a39d25","/about.html","🎉 关于 KZ321",["/about","/about.md"]],
  ["v-07588cce","/learn.html","学习哈萨克语",["/learn","/learn.md"]],
  ["v-166f873d","/blog/1-win11-kaq-keyborad.html","Windiws11 默认哈萨克语输入法布局图",["/blog/1-win11-kaq-keyborad","/blog/1-win11-kaq-keyborad.md"]],
  ["v-145ac574","/blog/","博客",["/blog/index.html","/blog/README.md"]],
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
