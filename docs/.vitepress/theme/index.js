// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

// 导入自定义组件
import InputSearch from '../components/InputSearch.vue'
import Alphabet from '../components/Alphabet.vue'
import EpidemicMap from '../components/EpidemicMap.vue'
import Valine from '../components/Valine.vue'
import WordConversion from '../components/WordConversion.vue'
import WordSplit from '../components/WordSplit.vue'
import WordSplitView from '../components/WordSplitView.vue'
import SiteCards from '../components/SiteCards.vue'
import Changelog from '../components/Changelog.vue'
import Hero from '../components/Hero.vue'
import RtlMd2Card from '../components/RtlMd2Card.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('InputSearch', InputSearch)
    app.component('Alphabet', Alphabet)
    app.component('EpidemicMap', EpidemicMap)
    app.component('Valine', Valine)
    app.component('WordConversion', WordConversion)
    app.component('WordSplit', WordSplit)
    app.component('WordSplitView', WordSplitView)
    app.component('SiteCards', SiteCards)
    app.component('Changelog', Changelog)
    app.component('Hero', Hero)
    app.component('RtlMd2Card', RtlMd2Card)
  }
}
