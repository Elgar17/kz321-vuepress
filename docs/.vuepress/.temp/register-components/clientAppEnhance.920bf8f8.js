import { defineAsyncComponent } from 'vue'

export default ({ app }) => {
  app.component("InputSearch", defineAsyncComponent(() => import("D:/3-blog/kz321/docs/.vuepress/components/InputSearch.vue")))
}
