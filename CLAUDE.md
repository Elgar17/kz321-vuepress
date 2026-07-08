# CLAUDE.md

本文件为 Claude / AI 助手提供本仓库的工作指引。回复统一使用中文。

## 项目概述

**KZ321.top** 是一个哈萨克语导航与工具站点，分享优质哈萨克语网站，并内置一系列浏览器端的哈萨克语工具（文字转换、语音合成、字母表、剪影助手等）。

- 框架：**VitePress 1.x**（Vue 3，Options API 为主）
- 语言：站点内容中文（`zh-CN`），面向哈萨克语用户
- 运行时：Node.js（本地实测 v18）

> 仓库名带 `vuepress` 是历史原因，项目**已迁移到 VitePress**，详见 `MIGRATION.md`。

## 常用命令

```bash
npm install              # 安装依赖
npm run dev              # 开发服务器（默认 http://localhost:5173，--host 已开启）
npm run build            # 生产构建，输出到 dist/
npm run preview          # 预览构建产物
```

修改代码后，用 `npm run build` 验证能否编译通过（构建较快，~10s）。piper-tts-web 会产生 `eval` 与 chunk 体积的告警，属库自身问题，可忽略。

## 目录结构

```
docs/
├─ *.md                        各页面（index/about/alphabet/tts/convert/...）
├─ public/                     静态资源（构建时原样拷贝到 dist/ 根）
│  ├─ piper/                   piper-tts-web 的 wasm、espeak 数据、语音模型
│  ├─ onnx/                    onnxruntime-web 的 wasm
│  └─ tts-sw.js                TTS 资源缓存的 Service Worker
└─ .vitepress/
   ├─ config.mjs               站点配置（nav / sidebar / head / outDir=../dist）
   ├─ theme/
   │  ├─ index.js              主题入口：全局注册所有组件（关键文件）
   │  └─ custom.css            全局样式
   ├─ components/              全局 Vue 组件
   │  ├─ utils/                纯 JS 工具（转换算法、键位表等）
   │  └─ tts/                  语音合成模块
   └─ data/                    sites.json（导航数据）、changelog.json
```

`docs/.vuepress/` 是迁移前的旧目录，**已废弃、不再使用**，不要修改。

## 架构要点

### 组件注册与页面引用

所有 `.vue` 组件在 `docs/.vitepress/theme/index.js` 中通过 `app.component()` 全局注册，Markdown 页面直接以 PascalCase 标签引用（如 `<Tts />`、`<Announcement />`）。**新增组件必须在该文件注册**，否则页面里用不了。

页面 ↔ 组件对应示例：
- `index.md` → `<Hero />`、`<Announcement />`、`<SiteCards />`、`<Valine />`
- `tts.md` → `<Tts />`（即 `components/tts/index.vue`）
- `convert.md` / `word-*.md` → 对应转换/剪影组件

### 数据驱动

导航卡片与首页搜索数据来自 `docs/.vitepress/data/sites.json`；更新链接只需改该 JSON。

### 文字转换工具

`components/utils/WordConversion.js` 提供哈萨克语西里尔文 ⇄ 阿拉伯字母（Tote）互转：
- `Cyrl2Tote(text)`：西里尔 → 阿拉伯（依赖 `DOMParser`，仅浏览器可用）
- `Tote2Cyrl(text)`：阿拉伯 → 西里尔（纯函数，可在 Node 中运行，适合验证）

### TTS 模块（`components/tts/`，最复杂）

完全浏览器端、离线的哈萨克语语音合成，基于 `piper-tts-web`（WASM + ONNX）。

- **`index.vue`**：UI 组件。输入（西里尔文/阿拉伯转写双模式 + 自定义西里尔键盘）、语速/音高滑块、多音色、分句合成、逐句高亮跟读、原生播放器、WAV/MP3 下载、历史记录（localStorage）、快捷键、加载进度面板。
- **`piperEngine.js`**：引擎封装。自定义 `ProgressVoiceProvider`（本地 + HuggingFace 音色路由、下载进度）、语速/音高 → `length_scale` 计算、分句、错误分类（`TtsError`）、**Cache Storage 持久缓存**（`clearTtsCache`）。
- **`audioUtils.js`**：音频处理。WAV 解码、`OfflineAudioContext` 变调、缓冲拼接、AudioBuffer→WAV/MP3 编码（用 `@breezystack/lamejs`）。

TTS 关键设计：
- **语速**用 piper 的 `length_scale`（不改音高）；**音高**用 `playbackRate` 变调 + `length_scale` 反向补偿时长，并通过离线渲染烘焙进导出音频。
- **长文本按句合成再拼接**，同时规避了 piper 只取首句的限制，并支撑逐句高亮。
- **持久缓存**双层：`piperEngine.js` 用 Cache Storage 缓存自取的模型/数据；`public/tts-sw.js`（Service Worker，作用域限 `/onnx/`、`/piper/`、HuggingFace piper-voices）额外缓存库内部加载的 onnxruntime wasm，实现「全部资源只下载一次」。改模型时需 bump `tts-sw.js` 与 `RESOURCE_CACHE_NAME` 的版本号。

## 部署

`push.sh`：构建后进入 `dist/`，`git init` 并强推到 `git@github.com:Elgar17/Elgar17.github.io.git` 的 `master`（GitHub Pages）。注意脚本里的 `npm run docs:build` 是注释状态，需先手动 `npm run build`。GitHub Pages 对静态资源只有约 10 分钟 HTTP 缓存，故 TTS 才用 Cache Storage + Service Worker 做持久缓存。

## 约定与注意事项

- **组件风格**：现有组件多用 Vue **Options API**（`data/computed/methods`），新组件保持一致。
- **样式**：优先使用 VitePress 主题 CSS 变量（`--vp-c-brand`、`--vp-c-bg-soft`、`--vp-c-text-2` 等），支持深色模式。
- **SSR 安全**：涉及 `window`/`navigator`/`caches`/`AudioContext` 的逻辑放到 `mounted` 或加客户端判断（如 TTS 的 `isClient`）。
- **提交**：仅在用户明确要求时创建 git commit；`dist/` 已被 `.gitignore` 忽略。
- **依赖**：用包管理器安装最新版本，不要臆造版本号。
