import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-22a39d25","/about.html","🎉 关于 KZ321",["/about","/about.md"]],
  ["v-8daa1a0e","/","KZ321",["/index.html","/README.md"]],
  ["v-2d0a9f07","/kz/","",["/kz/index.html","/kz/README.md"]],
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
