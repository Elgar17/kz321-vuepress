# VuePress 到 VitePress 迁移说明

## 迁移概览

您的网站已成功从 VuePress 2.x 升级到 VitePress 1.x。以下是主要更改的详细说明。

## 主要变更

### 1. 依赖更新

**package.json 变更：**
- 移除：`vuepress`、`@vuepress/plugin-register-components`、`vuepress-plugin-comment`
- 新增：`vitepress` (^1.0.0)、`vue` (^3.4.0)
- 保留：`leancloud-storage`、`lucide-vue-next`、`valine`

**新的脚本命令：**
```json
"dev": "vitepress dev docs",
"build": "vitepress build docs",
"preview": "vitepress preview docs"
```

### 2. 配置文件迁移

**从 `.vuepress/config.js` 迁移到 `.vitepress/config.mjs`**

主要配置变更：
- 使用 ESM 模块语法（`import` 而非 `require`）
- 配置文件扩展名改为 `.mjs`
- 主题配置结构调整：
  - `navbar` → `nav`
  - `sidebar` 项的 `children` → `items`
  - Footer 配置放在 `themeConfig.footer`
  
新增配置：
- `ignoreDeadLinks`：忽略特定的死链接检查（如下载文件）

### 3. 目录结构变更

```
docs/
  ├── .vitepress/           # 新的配置目录（替代 .vuepress）
  │   ├── config.mjs        # 主配置文件
  │   ├── theme/            # 主题自定义
  │   │   ├── index.js      # 主题入口，注册全局组件
  │   │   └── custom.css    # 自定义样式
  │   ├── components/       # 全局组件
  │   └── utils/            # 工具函数
  └── public/               # 静态资源（从 .vuepress/public 迁移）
```

### 4. 组件注册方式

**VuePress 方式（旧）：**
```javascript
plugins: [
  ['@vuepress/register-components', {
    componentsDir: './docs/.vuepress/components/'
  }]
]
```

**VitePress 方式（新）：**
```javascript
// docs/.vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import MyComponent from '../components/MyComponent.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MyComponent', MyComponent)
  }
}
```

### 5. Markdown 文件更新

**首页 (README.md) frontmatter 变更：**
```yaml
# VuePress 旧格式
---
home: true
footer: Copyright © 2021 Elǵar
---

# VitePress 新格式
---
layout: home
hero:
  name: 哈萨克语导航
  text: KZ321.top
  tagline: 致力于分享互联网上的优质的哈萨克语网站与内容
---
```

**组件引用：**
- 从 kebab-case 改为 PascalCase：
  - `<word-conversion />` → `<WordConversion />`
  - `<word-split />` → `<WordSplit />`

### 6. 静态资源路径

**图片引用：**
- 相对路径需要改为绝对路径（从 public 目录）
- 博客中的图片：`./image.png` → `/b/image.png`
- 文件扩展名统一为小写：`.PNG` → `.png`

### 7. 组件更新

**Valine 组件（评论系统）：**
- 从 CommonJS `require` 改为 ESM `import`
- 使用 Vue 3 Composition API：`onMounted` 替代 `mounted`
- 动态导入以确保只在客户端运行

```javascript
// 旧代码
const Valine = require('valine')
window.AV = require('leancloud-storage')

// 新代码
const Valine = (await import('valine')).default
const AV = (await import('leancloud-storage')).default
```

### 8. 样式文件

**从 SCSS 迁移到 CSS：**
- `.vuepress/styles/index.scss` → `.vitepress/theme/custom.css`
- CSS 变量更新以匹配 VitePress 主题：
  - `--c-brand` → `--vp-c-brand`
  - 新增响应式颜色变量（light/dark/lighter/darker）

## 构建输出

- 开发服务器：`npm run dev` （默认端口 5173）
- 构建输出：`npm run build` （输出到 `dist/` 目录）
- 预览构建：`npm run preview`

## 注意事项

1. **旧的 `.vuepress` 目录仍然存在**，但不再被使用。您可以选择保留作为备份或删除。

2. **CNAME 文件**已从 `docs/.vuepress/public/` 复制到 `docs/public/`，构建时会自动包含。

3. **下载文件**（如 `kazak.dmg`）已配置为忽略死链接检查。

4. **百度统计**代码已保留在配置的 `head` 部分。

5. **多语言支持**配置已预留，但当前只启用了中文。

## 验证清单

- ✅ 开发服务器正常启动（`npm run dev`）
- ✅ 生产构建成功（`npm run build`）
- ✅ 所有自定义组件正常工作
- ✅ 静态资源路径正确
- ✅ 评论系统 (Valine) 集成正常
- ✅ 自定义样式应用正确

## 下一步建议

1. 在本地运行 `npm run dev` 测试所有页面和功能
2. 检查所有交互功能是否正常（文字转换工具、剪影助手等）
3. 更新部署配置（如果使用 CI/CD）
4. 考虑删除旧的 `.vuepress` 目录（建议先备份）
5. 更新 README 或文档说明新的开发/构建命令

## 参考资料

- [VitePress 官方文档](https://vitepress.dev/)
- [从 VuePress 迁移指南](https://vitepress.dev/guide/migration-from-vuepress)
