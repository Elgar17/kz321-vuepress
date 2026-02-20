<template>
  <div class="re" :class="'theme-' + currentTheme">
    <!-- 顶部工具栏 -->
    <header class="re-toolbar">
      <div class="re-toolbar-left">
        <span class="re-logo">🔄 文字转换</span>
        <div class="re-mode-switch">
          <button
            class="re-mode-btn"
            :class="{ active: currentTab === 'cyrillic' }"
            @click="currentTab = 'cyrillic'"
          >西里尔文 → 传统文</button>
          <button
            class="re-mode-btn"
            :class="{ active: currentTab === 'tote' }"
            @click="currentTab = 'tote'"
          >传统文 → 西里尔文</button>
        </div>
      </div>
      <div class="re-toolbar-right">
        <div class="re-theme-picker">
          <button
            v-for="t in themes"
            :key="t.id"
            class="re-theme-dot"
            :class="{ active: currentTheme === t.id }"
            :style="{ background: t.dot }"
            :title="t.name"
            @click="currentTheme = t.id"
          />
        </div>
        <button class="re-btn re-btn-save" @click="saveAsImage" title="保存为图片">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>保存</span>
        </button>
      </div>
    </header>

    <!-- 主体：左右分栏 -->
    <main class="re-main" :class="{ 're-main-reversed': currentTab === 'tote' }">
      <!-- 输入区 -->
      <section class="re-panel re-panel-editor">
        <div class="re-panel-topbar">
          <span class="re-panel-title">输入</span>
          <div class="re-panel-actions">
            <span class="re-charcount">{{ input.length }} 字符</span>
            <button class="re-btn-sm" :class="{ invisible: !input }" @click="clearInput">清空</button>
          </div>
        </div>
        <textarea
          ref="inputArea"
          class="re-textarea"
          :dir="currentTab === 'tote' ? 'rtl' : 'ltr'"
          v-model="input"
          :placeholder="currentTab === 'tote'
            ? 'ءماتىندى وسى اراعا جاپسىرىڭىز نەمەسە جازىڭىز'
            : 'мәтінді осы араға жапсырыңыз немесе жазыңыз'"
          spellcheck="false"
        />
      </section>

      <!-- 预览区 -->
      <section class="re-panel re-panel-preview">
        <div class="re-panel-topbar">
          <span class="re-panel-title">结果</span>
          <div class="re-panel-actions">
            <span class="re-charcount">{{ result.length }} 字符</span>
            <button class="re-btn-sm" :class="{ invisible: !result }" @click="copyResult">
              {{ copyBtnText }}
            </button>
          </div>
        </div>
        <div class="re-preview-wrap" ref="previewWrap">
          <div
            class="re-preview-card"
            ref="previewCard"
            :dir="currentTab === 'tote' ? 'ltr' : 'rtl'"
          >
            <p v-if="result" class="re-preview-text">{{ result }}</p>
            <p v-else class="re-preview-placeholder">转换结果将显示在这里...</p>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部状态栏 -->
    <footer class="re-footer">
      <span>实时转换</span>
      <span>kz321.top</span>
    </footer>

    <!-- 保存提示 Toast -->
    <Transition name="re-toast">
      <div v-if="toastMsg" class="re-toast">{{ toastMsg }}</div>
    </Transition>
  </div>
</template>

<script>
import { Tote2Cyrl, Cyrl2Tote } from "./utils/WordConversion.js"

export default {
  name: "WordConversion",
  data() {
    return {
      input: "",
      result: "",
      currentTab: "cyrillic",
      currentTheme: "clean",
      copyBtnText: "复制",
      toastMsg: "",
      themes: [
        { id: "clean", name: "简洁白", dot: "linear-gradient(135deg, #f8f9fa, #e9ecef)" },
        { id: "warm", name: "暖色调", dot: "linear-gradient(135deg, #fff3e0, #ffe0b2)" },
      ],
    };
  },
  mounted() {
    this.currentTab = localStorage.getItem("rtl-tab") || "cyrillic";
    this.currentTheme = localStorage.getItem("rtl-theme") || "clean";
  },
  watch: {
    currentTab(v) {
      localStorage.setItem("rtl-tab", v);
      this.input = "";
      this.result = "";
    },
    currentTheme(v) {
      localStorage.setItem("rtl-theme", v);
    },
    input() {
      this.autoConvert();
    },
  },
  methods: {
    autoConvert() {
      if (!this.input.trim()) {
        this.result = "";
        return;
      }
      this.result = this.currentTab === "tote"
        ? Tote2Cyrl(this.input)
        : Cyrl2Tote(this.input);
    },
    clearInput() {
      this.input = "";
      this.result = "";
      this.$refs.inputArea?.focus();
    },
    copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
      return Promise.resolve();
    },
    copyResult() {
      if (!this.result) return;
      this.copyToClipboard(this.result);
      this.copyBtnText = "已复制 ✓";
      setTimeout(() => (this.copyBtnText = "复制"), 1800);
    },
    showToast(msg) {
      this.toastMsg = msg;
      setTimeout(() => (this.toastMsg = ""), 2200);
    },
    async saveAsImage() {
      const card = this.$refs.previewCard;
      if (!card || !this.result) {
        this.showToast("请先输入文字并转换");
        return;
      }
      try {
        const { default: html2canvas } = await import("html2canvas");
        const canvas = await html2canvas(card, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });
        const link = document.createElement("a");
        link.download = `conversion-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        this.showToast("图片已保存");
      } catch {
        await this.copyToClipboard(this.result);
        this.showToast("已复制文本到剪贴板");
      }
    },
  },
};
</script>

<style scoped>
/* ====== 基础重置 & 全屏布局 ====== */
.re {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  color: var(--re-text);
  background: var(--re-bg);
  overflow: hidden;
}

/* ====== 主题变量 ====== */
.theme-clean {
  --re-bg: #f5f5f5;
  --re-toolbar-bg: #ffffff;
  --re-toolbar-border: #e8e8e8;
  --re-panel-bg: #ffffff;
  --re-panel-border: #e8e8e8;
  --re-text: #1a1a1a;
  --re-text-secondary: #888;
  --re-text-placeholder: #bbb;
  --re-accent: #00AFCA;
  --re-accent-hover: #0097B3;
  --re-btn-bg: #f5f5f5;
  --re-btn-hover: #eaeaea;
  --re-card-bg: #ffffff;
  --re-card-shadow: 0 1px 4px rgba(0,0,0,0.06);
  --re-footer-bg: #fafafa;
}

.theme-warm {
  --re-bg: #fdf6ee;
  --re-toolbar-bg: #fffaf3;
  --re-toolbar-border: #f0e4d4;
  --re-panel-bg: #fffcf7;
  --re-panel-border: #f0e4d4;
  --re-text: #3d2e1e;
  --re-text-secondary: #a08b72;
  --re-text-placeholder: #c4ad90;
  --re-accent: #d4860a;
  --re-accent-hover: #b8740a;
  --re-btn-bg: #f5ead8;
  --re-btn-hover: #eedcc4;
  --re-card-bg: #fffcf7;
  --re-card-shadow: 0 1px 4px rgba(80,50,10,0.08);
  --re-footer-bg: #faf3e8;
}

/* ====== 顶部工具栏 ====== */
.re-toolbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 52px;
  padding: 0 20px;
  background: var(--re-toolbar-bg);
  border-bottom: 1px solid var(--re-toolbar-border);
}

.re-toolbar-left,
.re-toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.re-logo {
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--re-text);
}

.re-mode-switch {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--re-btn-bg);
  border-radius: 6px;
}

.re-mode-btn {
  padding: 5px 14px;
  font-size: 12.5px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: var(--re-text-secondary);
  transition: all 0.2s;
  white-space: nowrap;
}

.re-mode-btn:hover:not(.active) {
  color: var(--re-text);
  background: var(--re-btn-hover);
}

.re-mode-btn.active {
  background: var(--re-accent);
  color: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
}

/* 主题选择器 */
.re-theme-picker {
  display: flex;
  gap: 6px;
  align-items: center;
}

.re-theme-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.re-theme-dot:hover {
  transform: scale(1.15);
}

.re-theme-dot.active {
  border-color: var(--re-accent);
  box-shadow: 0 0 0 2px rgba(0,175,202,0.2);
}

/* 按钮 */
.re-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--re-toolbar-border);
  border-radius: 6px;
  cursor: pointer;
  background: var(--re-toolbar-bg);
  color: var(--re-text);
  transition: all 0.2s;
}

.re-btn:hover {
  background: var(--re-btn-hover);
}

.re-btn-save {
  background: var(--re-accent);
  color: #fff;
  border-color: var(--re-accent);
}

.re-btn-save:hover {
  background: var(--re-accent-hover);
  border-color: var(--re-accent-hover);
}

.re-btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--re-panel-border);
  border-radius: 4px;
  cursor: pointer;
  background: var(--re-btn-bg);
  color: var(--re-text-secondary);
  transition: all 0.2s;
}

.re-btn-sm:hover {
  color: var(--re-accent);
  border-color: var(--re-accent);
}

/* ====== 主体区域 ====== */
.re-main {
  flex: 1;
  display: flex;
  gap: 0;
  padding: 16px 20px;
  overflow: hidden;
  min-height: 0;
}

.re-main-reversed {
  flex-direction: row-reverse;
}

/* 面板 */
.re-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--re-panel-bg);
  border: 1px solid var(--re-panel-border);
  overflow: hidden;
  min-width: 0;
}

.re-panel-editor {
  border-radius: 10px 0 0 10px;
  border-right: none;
}

.re-panel-preview {
  border-radius: 0 10px 10px 0;
}

.re-main-reversed .re-panel-editor {
  border-radius: 0 10px 10px 0;
  border-right: 1px solid var(--re-panel-border);
  border-left: none;
}

.re-main-reversed .re-panel-preview {
  border-radius: 10px 0 0 10px;
}

.re-panel-topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid var(--re-panel-border);
}

.re-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--re-text-secondary);
}

.re-panel-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.re-charcount {
  font-size: 11px;
  color: var(--re-text-placeholder);
}

.invisible {
  visibility: hidden;
  pointer-events: none;
}

/* 输入框 */
.re-textarea {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.7;
  color: var(--re-text);
  background: transparent;
  min-height: 0;
}

.re-textarea::placeholder {
  color: var(--re-text-placeholder);
}

.re-textarea[dir="rtl"] {
  font-family: "KazNet", sans-serif;
  font-size: 17px;
}

/* 预览区 */
.re-preview-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  min-height: 0;
}

.re-preview-card {
  min-height: 100%;
  padding: 24px;
  background: var(--re-card-bg);
  border-radius: 8px;
  box-shadow: var(--re-card-shadow);
}

.re-preview-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--re-text);
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.re-preview-text[dir="rtl"],
.re-preview-card[dir="rtl"] .re-preview-text {
  font-family: "KazNet", sans-serif;
  font-size: 18px;
}

.re-preview-placeholder {
  color: var(--re-text-placeholder);
  font-size: 14px;
  margin: 0;
}

/* ====== 底部状态栏 ====== */
.re-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 32px;
  font-size: 11.5px;
  color: var(--re-text-placeholder);
  background: var(--re-footer-bg);
  border-top: 1px solid var(--re-toolbar-border);
}

/* ====== Toast 提示 ====== */
.re-toast {
  position: fixed;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  background: #333;
  color: #fff;
  font-size: 13px;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 10000;
  pointer-events: none;
}

.re-toast-enter-active,
.re-toast-leave-active {
  transition: all 0.3s ease;
}

.re-toast-enter-from,
.re-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* ====== 响应式 ====== */
@media (max-width: 768px) {
  .re-toolbar {
    height: auto;
    flex-wrap: wrap;
    padding: 10px 12px;
    gap: 8px;
  }

  .re-toolbar-left,
  .re-toolbar-right {
    gap: 8px;
  }

  .re-logo {
    font-size: 14px;
  }

  .re-mode-btn {
    padding: 5px 10px;
    font-size: 11.5px;
  }

  .re-main,
  .re-main.re-main-reversed {
    flex-direction: column;
    padding: 10px 12px;
  }

  .re-panel {
    min-height: 180px;
  }

  .re-panel-editor,
  .re-main-reversed .re-panel-editor {
    border-radius: 10px 10px 0 0;
    border-right: 1px solid var(--re-panel-border);
    border-left: 1px solid var(--re-panel-border);
    border-bottom: none;
  }

  .re-panel-preview,
  .re-main-reversed .re-panel-preview {
    border-radius: 0 0 10px 10px;
  }

  .re-btn-save span {
    display: none;
  }
}
</style>
