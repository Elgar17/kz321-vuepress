# KazNet 字体使用说明

## 字体文件位置

字体文件位于：`docs/public/KazNet.ttf`

## 自动应用场景

KazNet 字体已自动应用于以下所有使用哈萨克语（RTL从右到左书写）的地方：

### 1. 全局 RTL 样式
所有设置了 `dir="rtl"` 属性的元素都会自动应用 KazNet 字体。

### 2. 字母表组件 (Alphabet.vue)
- 字母显示
- 单词显示
- 字形容器

### 3. 文字转换工具 (WordConversion.vue)
- 传统文字输入框（RTL）
- 西里尔文输入框结果（RTL）
- 占位符文本

### 4. 剪影文字助手 (WordSplit.vue)
- RTL 输入框
- 占位符文本

### 5. 文字拆分工具 (WordSplitView.vue)
- RTL 输入框
- 拆分结果显示容器
- 占位符文本

## 字体样式配置

### 全局配置 (custom.css)

```css
/* 字体定义 */
@font-face {
  src: url('/KazNet.ttf');
  font-family: 'KazNet';
  font-display: swap;
}

/* 全局 RTL 支持 */
[dir="rtl"] {
  font-family: 'KazNet', sans-serif;
}

/* RTL 输入框 */
textarea[dir="rtl"],
input[dir="rtl"] {
  font-family: 'KazNet', sans-serif;
}

/* RTL 占位符 */
textarea[dir="rtl"]::placeholder,
input[dir="rtl"]::placeholder {
  font-family: 'KazNet', sans-serif;
}
```

### 组件级配置

每个使用哈萨克语的组件都在其 scoped 样式中明确指定了 KazNet 字体：

```css
.input[dir="rtl"] {
  font-family: 'KazNet', sans-serif;
  font-size: 18px;
  line-height: 1.6;
}
```

## 字体特性

- **字体名称**: KazNet
- **格式**: TrueType Font (.ttf)
- **支持**: 哈萨克语阿拉伯字母（传统文字）
- **加载策略**: `font-display: swap` (优先显示后备字体，字体加载完成后切换)

## 使用建议

1. **RTL 文本**: 始终使用 `dir="rtl"` 属性
2. **字号**: RTL 输入框建议使用 18px 或更大
3. **行高**: 建议 1.6 以获得更好的可读性
4. **后备字体**: 始终提供 `sans-serif` 作为后备

## 扩展使用

如果需要在新组件中使用 KazNet 字体：

```vue
<template>
  <div dir="rtl" class="kazakh-text">
    哈萨克语文本
  </div>
</template>

<style scoped>
.kazakh-text {
  font-family: 'KazNet', sans-serif;
  font-size: 18px;
  line-height: 1.6;
}
</style>
```

## 性能优化

- 字体文件通过 VitePress 自动优化
- 使用 `font-display: swap` 避免 FOIT (Flash of Invisible Text)
- 字体仅在需要时加载
