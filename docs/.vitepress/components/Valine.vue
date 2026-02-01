<template>
    <section style="border-top: 2px solid #eaecef;padding-top:1rem;margin-top:2rem;direction: ltr;">
      <div>
        <!-- id 将作为查询条件 -->
        <span class="leancloud-visitors"
              data-flag-title="Your Article Title">
          <em class="post-meta-item-text">阅读量： </em>
          <i class="leancloud-visitors-count"></i>
        </span>
      </div>
      <h3>
        <a href="javascript:;"></a>
        评 论：
      </h3>
      <div id="vcomments"></div>
    </section>
  </template>
  
<script>
import { onMounted } from 'vue'

export default {
  name: 'Valine',
  setup() {
    onMounted(async () => {
      // 动态导入以确保只在客户端运行
      if (typeof window !== 'undefined') {
        const Valine = (await import('valine')).default
        const AV = (await import('leancloud-storage')).default
        
        const visitorElement = document.getElementsByClassName('leancloud-visitors')[0]
        if (visitorElement) {
          visitorElement.id = window.location.pathname
        }
        
        window.AV = AV

        new Valine({
          el: '#vcomments',
          appId: 'YP2boJg5nCtTczLFGroERUHb-gzGzoHsz',
          appKey: 'UFA9pw4P1fki9NJNzwZfkL4i',
          notify: false,
          verify: false,
          path: window.location.pathname,
          visitor: true,
          avatar: 'robohash',
          placeholder: 'write here'
        })
      }
    })
  }
}
</script>