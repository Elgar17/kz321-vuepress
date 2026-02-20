<template>
  <div class="mc" :style="themeVars">
    <header class="mc-toolbar">
      <div class="mc-toolbar-left">
        <span class="mc-logo">📝 RTL MD → Card</span>
      </div>
      <div class="mc-toolbar-right">
        <button class="mc-btn mc-btn-export" @click="exportImage" title="导出图片">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>导出图片</span>
        </button>
      </div>
    </header>

    <main class="mc-main">
      <!-- 功能栏（最左侧，可折叠） -->
      <aside class="mc-sidebar" :class="{ open: sidebarOpen }">
        <button class="mc-sb-toggle" @click="sidebarOpen = !sidebarOpen" :title="sidebarOpen ? '收起设置' : '展开设置'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
        </button>

        <div class="mc-sb-body">
          <div class="mc-sb-section">
            <span class="mc-sb-label">主题</span>
            <div class="mc-sb-themes">
              <button
                v-for="t in themes" :key="t.id"
                class="mc-theme-card"
                :class="{ active: currentTheme === t.id }"
                @click="currentTheme = t.id"
              >
                <div class="mc-theme-swatch" :style="{ background: t.cardBg }">
                  <div class="mc-theme-accent" :style="{ background: t.accent }" />
                </div>
                <span class="mc-theme-name">{{ t.name }}</span>
              </button>
            </div>
          </div>

        <div class="mc-sb-section">
          <span class="mc-sb-label">字体</span>
          <select v-model="currentFont" class="mc-font-select">
            <optgroup v-for="g in allFontGroups" :key="g.label" :label="g.label">
              <option v-for="f in g.fonts" :key="f.id" :value="f.id">{{ f.name }}</option>
            </optgroup>
          </select>
          <label class="mc-font-upload">
            <input type="file" accept=".ttf,.otf,.woff,.woff2" @change="handleFontUpload" hidden />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            上传字体
          </label>
          <div v-if="customFonts.length" class="mc-custom-fonts-list">
            <div v-for="cf in customFonts" :key="cf.id" class="mc-custom-font-item" :class="{ active: currentFont === cf.id }">
              <span class="mc-cf-name" @click="currentFont = cf.id">{{ cf.name }}</span>
              <button class="mc-cf-remove" @click="removeCustomFont(cf.id)" title="移除">×</button>
            </div>
          </div>
        </div>

          <div class="mc-sb-section">
            <span class="mc-sb-label">字号</span>
            <div class="mc-sb-fontsize">
              <button class="mc-sz-btn" @click="adjustFontSize(-1)" :disabled="fontSize <= 12">−</button>
              <span class="mc-sz-value">{{ fontSize }}</span>
              <button class="mc-sz-btn" @click="adjustFontSize(1)" :disabled="fontSize >= 24">+</button>
            </div>
          </div>

          <div class="mc-sb-spacer" />

          <div class="mc-sb-actions">
            <button class="mc-sb-action mc-sb-action-primary" @click="exportImage">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              导出图片
            </button>
            <button class="mc-sb-action" @click="copyText">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              {{ copyBtnText }}
            </button>
          </div>
        </div>
      </aside>

      <!-- 卡片预览（中） -->
      <section class="mc-panel mc-panel-preview">
        <div class="mc-panel-topbar">
          <span class="mc-panel-title">卡片预览</span>
        </div>
        <div class="mc-preview-area">
          <div class="mc-card" ref="cardEl">
            <div
              v-if="markdown.trim()"
              class="mc-card-content"
              dir="rtl"
              v-html="renderedHtml"
              :style="cardContentStyle"
            />
            <p v-else class="mc-card-empty">卡片预览将显示在这里...</p>
            <div v-if="markdown.trim()" class="mc-card-watermark">
              <span>kz321.top</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 编辑器（右，RTL 输入侧） -->
      <section class="mc-panel mc-panel-editor">
        <div class="mc-panel-topbar">
          <span class="mc-panel-title">Markdown</span>
          <div class="mc-panel-actions">
            <span class="mc-charcount">{{ markdown.length }} 字符</span>
            <button class="mc-btn-sm" :class="{ invisible: !markdown }" @click="clearInput">清空</button>
          </div>
        </div>
        <div class="mc-editor-wrap">
          <div class="mc-editor-backdrop" ref="backdrop">
            <pre class="mc-editor-hl" dir="rtl" :style="{ fontFamily: currentFontFamily }" v-html="highlightedMarkdown"></pre>
          </div>
          <textarea
            ref="editor"
            class="mc-textarea"
            dir="rtl"
            v-model="markdown"
            :style="{ fontFamily: currentFontFamily }"
            placeholder="Markdown ءماتىنىن وسى جەرگە جازىڭىز..."
            spellcheck="false"
            @scroll="syncScroll"
          />
        </div>
      </section>
    </main>

    <footer class="mc-footer">
      <span>RTL MD → Card</span>
      <!-- 跳转 支持作者 -->
      <a href="/about">💝 支持作者</a>
      <span>kz321.top</span>
    </footer>

    <Transition name="mc-toast">
      <div v-if="toastMsg" class="mc-toast">{{ toastMsg }}</div>
    </Transition>
  </div>
</template>

<script>
import { marked } from "marked";
import { themes } from "./utils/md2card-themes.js";
import { sampleMarkdown } from "./utils/sampleMarkdown.js";

export default {
  name: "RtlMd2Card",
  data() {
    return {
      markdown: "",
      currentTheme: "minimal",
      currentFont: "kaznet",
      fontSize: 16,
      sidebarOpen: true,
      copyBtnText: "复制文本",
      toastMsg: "",
      customFonts: [],
      themes,
      fontGroups: [
        {
          label: "哈萨克语字体",
          fonts: [
            { id: "kaznet", name: "KazNet", family: '"KazNet", sans-serif' },
            { id: "kz-arial", name: "KZ Arial", family: '"KZ Arial", sans-serif' },
          ],
        },
        {
          label: "维吾尔语字体",
          fonts: [
            { id: "ukij-tuz", name: "UKIJ Tuz", family: '"UKIJ Tuz", sans-serif' },
            { id: "ukij-ekran", name: "UKIJ Ekran", family: '"UKIJ Ekran", sans-serif' },
          ],
        },
        {
          label: "阿拉伯语字体",
          fonts: [
            { id: "noto-naskh", name: "Noto Naskh Arabic", family: '"Noto Naskh Arabic", serif' },
            { id: "geeza", name: "Geeza Pro", family: '"Geeza Pro", sans-serif' },
            { id: "amiri", name: "Amiri", family: '"Amiri", serif' },
          ],
        },
      ],
      sampleMarkdown: sampleMarkdown,
    };
  },
  computed: {
    allFontGroups() {
      if (!this.customFonts.length) return this.fontGroups;
      return [
        ...this.fontGroups,
        { label: "自定义字体", fonts: this.customFonts },
      ];
    },
    themeVars() {
      const t = this.themes.find(t => t.id === this.currentTheme);
      return t ? t.vars : {};
    },
    renderedHtml() {
      if (!this.markdown.trim()) return "";
      return marked.parse(this.markdown, { breaks: true, gfm: true });
    },
    currentFontFamily() {
      for (const g of this.allFontGroups) {
        const f = g.fonts.find(f => f.id === this.currentFont);
        if (f) return f.family;
      }
      return '"KazNet", sans-serif';
    },
    cardContentStyle() {
      return {
        fontFamily: this.currentFontFamily,
        fontSize: this.fontSize + "px",
      };
    },
    highlightedMarkdown() {
      if (!this.markdown) return "\n";
      const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const lines = this.markdown.split("\n");
      let inCode = false;
      const out = [];
      for (const line of lines) {
        let h = esc(line);
        if (/^```/.test(line)) {
          inCode = !inCode;
          out.push(`<span class="hl-code">${h}</span>`);
          continue;
        }
        if (inCode) { out.push(`<span class="hl-code">${h}</span>`); continue; }
        if (/^#{1,6}\s/.test(line)) { out.push(`<span class="hl-h">${h}</span>`); continue; }
        if (/^[-*_]{3,}\s*$/.test(line)) { out.push(`<span class="hl-hr">${h}</span>`); continue; }
        if (/^&gt;\s?/.test(h)) { out.push(`<span class="hl-quote">${h}</span>`); continue; }
        h = h.replace(/(`[^`]+`)/g, '<span class="hl-code">$1</span>');
        h = h.replace(/(\*\*.+?\*\*)/g, '<span class="hl-bold">$1</span>');
        h = h.replace(/(\*[^*<]+\*)/g, '<span class="hl-em">$1</span>');
        h = h.replace(/^(\s*[-*+]\s)/, '<span class="hl-list">$1</span>');
        h = h.replace(/^(\s*\d+\.\s)/, '<span class="hl-list">$1</span>');
        h = h.replace(/(\[[^\]]*\]\([^)]*\))/g, '<span class="hl-link">$1</span>');
        out.push(h);
      }
      return out.join("\n") + "\n";
    },
  },
  mounted() {
    this.currentTheme = localStorage.getItem("md2card-theme") || "minimal";
    this.currentFont = localStorage.getItem("md2card-font") || "kaznet";
    this.fontSize = parseInt(localStorage.getItem("md2card-fontsize")) || 16;
    this.sidebarOpen = localStorage.getItem("md2card-sidebar") !== "false";
    const saved = localStorage.getItem("md2card-md");
    this.markdown = saved !== null ? saved : this.sampleMarkdown;
    this.restoreCustomFonts().then(() => {
      const savedFont = localStorage.getItem("md2card-font");
      if (savedFont && savedFont.startsWith("custom-")) {
        const exists = this.customFonts.some(f => f.id === savedFont);
        if (exists) this.currentFont = savedFont;
      }
    });
  },
  watch: {
    currentTheme(v) { localStorage.setItem("md2card-theme", v); },
    currentFont(v) { localStorage.setItem("md2card-font", v); },
    fontSize(v) { localStorage.setItem("md2card-fontsize", String(v)); },
    sidebarOpen(v) { localStorage.setItem("md2card-sidebar", String(v)); },
    markdown(v) {
      localStorage.setItem("md2card-md", v);
      this.$nextTick(() => this.syncScroll());
    },
  },
  methods: {
    syncScroll() {
      const ta = this.$refs.editor;
      const bd = this.$refs.backdrop;
      if (ta && bd) {
        bd.scrollTop = ta.scrollTop;
        bd.scrollLeft = ta.scrollLeft;
      }
    },
    adjustFontSize(delta) {
      this.fontSize = Math.min(24, Math.max(12, this.fontSize + delta));
    },
    handleFontUpload(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      const ext = file.name.split(".").pop().toLowerCase();
      const formats = { ttf: "truetype", otf: "opentype", woff: "woff", woff2: "woff2" };
      const format = formats[ext];
      if (!format) { this.showToast("不支持的字体格式"); return; }

      const baseName = file.name.replace(/\.[^.]+$/, "");
      const fontId = "custom-" + baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      if (this.customFonts.some(f => f.id === fontId)) {
        this.currentFont = fontId;
        this.showToast(`已切换到 ${baseName}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const buf = reader.result;
          const familyName = `Custom-${baseName}`;
          const face = new FontFace(familyName, buf);
          await face.load();
          document.fonts.add(face);
          const fontObj = {
            id: fontId,
            name: baseName,
            family: `"${familyName}", sans-serif`,
          };
          this.customFonts.push(fontObj);
          this.currentFont = fontId;
          this.showToast(`字体 "${baseName}" 加载成功`);
          this.saveCustomFontsToStorage(fontObj, buf);
        } catch (err) {
          this.showToast("字体加载失败: " + (err.message || err));
        }
      };
      reader.readAsArrayBuffer(file);
    },
    saveCustomFontsToStorage(fontObj, buf) {
      try {
        const req = indexedDB.open("md2card-fonts", 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains("fonts")) {
            db.createObjectStore("fonts", { keyPath: "id" });
          }
        };
        req.onsuccess = (e) => {
          const db = e.target.result;
          const tx = db.transaction("fonts", "readwrite");
          tx.objectStore("fonts").put({ ...fontObj, buffer: buf });
        };
      } catch { /* storage not critical */ }
    },
    async restoreCustomFonts() {
      try {
        const db = await new Promise((resolve, reject) => {
          const req = indexedDB.open("md2card-fonts", 1);
          req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains("fonts")) {
              db.createObjectStore("fonts", { keyPath: "id" });
            }
          };
          req.onsuccess = (e) => resolve(e.target.result);
          req.onerror = () => reject(req.error);
        });
        const tx = db.transaction("fonts", "readonly");
        const store = tx.objectStore("fonts");
        const all = await new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        for (const item of all) {
          const face = new FontFace(`Custom-${item.name}`, item.buffer);
          await face.load();
          document.fonts.add(face);
          this.customFonts.push({
            id: item.id,
            name: item.name,
            family: item.family,
          });
        }
      } catch { /* fail silently */ }
    },
    removeCustomFont(fontId) {
      const idx = this.customFonts.findIndex(f => f.id === fontId);
      if (idx === -1) return;
      if (this.currentFont === fontId) this.currentFont = "kaznet";
      this.customFonts.splice(idx, 1);
      try {
        const req = indexedDB.open("md2card-fonts", 1);
        req.onsuccess = (e) => {
          const db = e.target.result;
          const tx = db.transaction("fonts", "readwrite");
          tx.objectStore("fonts").delete(fontId);
        };
      } catch { /* non-critical */ }
      this.showToast("自定义字体已移除");
    },
    clearInput() {
      this.markdown = "";
      this.$refs.editor?.focus();
    },
    showToast(msg) {
      this.toastMsg = msg;
      setTimeout(() => (this.toastMsg = ""), 2200);
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
    async copyText() {
      if (!this.markdown.trim()) return;
      await this.copyToClipboard(this.markdown);
      this.copyBtnText = "已复制 ✓";
      setTimeout(() => (this.copyBtnText = "复制文本"), 1800);
    },
    async exportImage() {
      const card = this.$refs.cardEl;
      if (!card || !this.markdown.trim()) {
        this.showToast("请先输入 Markdown 内容");
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
        link.download = `md2card-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        this.showToast("图片已保存");
      } catch {
        await this.copyToClipboard(this.markdown);
        this.showToast("导出失败，已复制文本到剪贴板");
      }
    },
  },
};
</script>

<style scoped>
/* ====== 全屏布局 ====== */
.mc {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  color: var(--mc-text);
  background: var(--mc-bg);
  overflow: hidden;
}

/* ====== 顶部栏 ====== */
.mc-toolbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 52px;
  padding: 0 20px;
  background: var(--mc-toolbar-bg);
  border-bottom: 1px solid var(--mc-toolbar-border);
}

.mc-toolbar-left,
.mc-toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mc-logo {
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--mc-text);
}

.mc-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--mc-toolbar-border);
  border-radius: 6px;
  cursor: pointer;
  background: var(--mc-toolbar-bg);
  color: var(--mc-text);
  transition: all 0.2s;
}

.mc-btn:hover {
  background: var(--mc-btn-hover);
}

.mc-btn-export {
  background: var(--mc-accent);
  color: #fff;
  border-color: var(--mc-accent);
}

.mc-btn-export:hover {
  background: var(--mc-accent-hover);
  border-color: var(--mc-accent-hover);
}

.mc-btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--mc-panel-border);
  border-radius: 4px;
  cursor: pointer;
  background: var(--mc-btn-bg);
  color: var(--mc-text-secondary);
  transition: all 0.2s;
}

.mc-btn-sm:hover {
  color: var(--mc-accent);
  border-color: var(--mc-accent);
}

/* ====== 主体三栏布局 ====== */
.mc-main {
  flex: 1;
  display: flex;
  gap: 0;
  padding: 16px 20px;
  overflow: hidden;
  min-height: 0;
}

/* ====== 左侧功能栏（可折叠） ====== */
.mc-sidebar {
  flex-shrink: 0;
  width: 44px;
  display: flex;
  flex-direction: column;
  background: var(--mc-toolbar-bg);
  border: 1px solid var(--mc-panel-border);
  border-radius: 10px 0 0 10px;
  border-right: none;
  overflow: hidden;
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.mc-sidebar.open {
  width: 180px;
}

.mc-sb-toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  padding: 0;
  border: none;
  border-bottom: 1px solid var(--mc-panel-border);
  background: transparent;
  color: var(--mc-text-secondary);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.mc-sb-toggle:hover {
  color: var(--mc-accent);
  background: var(--mc-btn-bg);
}

.mc-sb-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 12px 12px;
  overflow-y: auto;
  min-width: 156px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.mc-sidebar.open .mc-sb-body {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.2s ease 0.1s;
}

.mc-sb-section {
  padding: 10px 0;
  border-bottom: 1px solid var(--mc-panel-border);
}

.mc-sb-section:first-child {
  padding-top: 8px;
}

.mc-sb-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mc-text-placeholder);
  margin-bottom: 8px;
}

/* 主题卡片网格 */
.mc-sb-themes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.mc-theme-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border: 2px solid var(--mc-panel-border);
  border-radius: 8px;
  background: var(--mc-panel-bg);
  cursor: pointer;
  transition: all 0.2s;
}

.mc-theme-card:hover {
  border-color: var(--mc-text-placeholder);
}

.mc-theme-card.active {
  border-color: var(--mc-accent);
  box-shadow: 0 0 0 1px var(--mc-accent);
}

.mc-theme-swatch {
  width: 100%;
  height: 28px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
}

.mc-theme-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.mc-theme-name {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--mc-text-secondary);
  white-space: nowrap;
}

/* 字体下拉选择器 */
.mc-font-select {
  width: 100%;
  padding: 7px 26px 7px 10px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--mc-text);
  background-color: var(--mc-panel-bg);
  border: 1px solid var(--mc-panel-border);
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition: border-color 0.2s;
}

.mc-font-select:hover,
.mc-font-select:focus {
  border-color: var(--mc-accent);
}

.mc-font-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
  padding: 6px 0;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--mc-accent);
  border: 1px dashed var(--mc-panel-border);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.mc-font-upload:hover {
  background-color: color-mix(in srgb, var(--mc-accent) 8%, transparent);
  border-color: var(--mc-accent);
}

.mc-custom-fonts-list {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mc-custom-font-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 11.5px;
  color: var(--mc-text-secondary);
  transition: background-color 0.15s;
}

.mc-custom-font-item.active {
  background-color: color-mix(in srgb, var(--mc-accent) 10%, transparent);
  color: var(--mc-accent);
}

.mc-cf-name {
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.mc-cf-remove {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--mc-text-placeholder);
  font-size: 14px;
  cursor: pointer;
  border-radius: 50%;
  transition: color 0.15s, background-color 0.15s;
  padding: 0;
  line-height: 1;
}

.mc-cf-remove:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

/* 字号控制 */
.mc-sb-fontsize {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.mc-sz-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--mc-panel-border);
  border-radius: 6px;
  background: var(--mc-panel-bg);
  color: var(--mc-text);
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
  padding: 0;
}

.mc-sz-btn:hover:not(:disabled) {
  border-color: var(--mc-accent);
  color: var(--mc-accent);
}

.mc-sz-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.mc-sz-value {
  min-width: 36px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--mc-text);
  font-variant-numeric: tabular-nums;
}

.mc-sb-spacer {
  flex: 1;
}

/* 操作按钮 */
.mc-sb-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 10px;
}

.mc-sb-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px 10px;
  font-size: 12.5px;
  font-weight: 500;
  border: 1px solid var(--mc-panel-border);
  border-radius: 8px;
  background: var(--mc-panel-bg);
  color: var(--mc-text);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.mc-sb-action:hover {
  border-color: var(--mc-accent);
  color: var(--mc-accent);
}

.mc-sb-action-primary {
  background: var(--mc-accent);
  color: #fff;
  border-color: var(--mc-accent);
}

.mc-sb-action-primary:hover {
  background: var(--mc-accent-hover);
  border-color: var(--mc-accent-hover);
  color: #fff;
}

/* ====== 面板通用 ====== */
.mc-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--mc-panel-bg);
  border: 1px solid var(--mc-panel-border);
  overflow: hidden;
  min-width: 0;
}

.mc-panel-preview {
  border-left: none;
  border-radius: 0;
}

.mc-panel-editor {
  border-left: none;
  border-radius: 0 10px 10px 0;
}

.mc-panel-topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid var(--mc-panel-border);
}

.mc-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--mc-text-secondary);
}

.mc-panel-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mc-charcount {
  font-size: 11px;
  color: var(--mc-text-placeholder);
}

.invisible {
  visibility: hidden;
  pointer-events: none;
}

/* ====== 编辑器 Overlay ====== */
.mc-editor-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.mc-editor-backdrop {
  position: absolute;
  inset: 0;
  overflow: auto;
  pointer-events: none;
  z-index: 0;
}

.mc-editor-backdrop::-webkit-scrollbar { width: 0; height: 0; }

.mc-editor-hl {
  margin: 0;
  padding: 16px;
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  color: var(--mc-text);
}

.mc-editor-hl :deep(.hl-h) {
  color: var(--mc-hl-heading);
  font-weight: 600;
}

.mc-editor-hl :deep(.hl-bold) {
  color: var(--mc-hl-bold);
  font-weight: 700;
}

.mc-editor-hl :deep(.hl-em) {
  color: var(--mc-hl-italic);
  font-style: italic;
}

.mc-editor-hl :deep(.hl-code) {
  color: var(--mc-hl-code);
  background: var(--mc-hl-code-bg);
  border-radius: 3px;
  padding: 0 2px;
  direction: ltr;
  unicode-bidi: isolate;
}

.mc-editor-hl :deep(.hl-quote) {
  color: var(--mc-hl-quote);
  font-style: italic;
}

.mc-editor-hl :deep(.hl-list) {
  color: var(--mc-hl-list);
  font-weight: 700;
}

.mc-editor-hl :deep(.hl-hr) {
  color: var(--mc-hl-hr);
}

.mc-editor-hl :deep(.hl-link) {
  color: var(--mc-hl-link);
  text-decoration: underline;
}

.mc-textarea {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-family: "KazNet", "Noto Naskh Arabic", "Geeza Pro", sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: transparent;
  caret-color: var(--mc-text);
  background: transparent;
}

.mc-textarea::placeholder {
  color: var(--mc-text-placeholder);
}

.mc-textarea::selection {
  background: rgba(14, 165, 233, 0.25);
  color: transparent;
}

/* ====== 预览区 ====== */
.mc-preview-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background:
    radial-gradient(circle, var(--mc-panel-border) 1px, transparent 1px);
  background-size: 20px 20px;
  min-height: 0;
}

/* ====== 卡片 ====== */
.mc-card {
  width: 100%;
  max-width: 560px;
  min-height: 200px;
  padding: 40px;
  background: var(--mc-card-bg);
  border-radius: 14px;
  box-shadow: var(--mc-card-shadow);
}

.mc-card-empty {
  color: var(--mc-text-placeholder);
  font-size: 14px;
  text-align: center;
  margin: 40px 0;
}

.mc-card-watermark {
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid var(--mc-card-border);
  text-align: center;
  font-size: 11px;
  color: var(--mc-card-watermark);
  letter-spacing: 0.5px;
}

/* ====== 卡片内容排版 ====== */
.mc-card-content {
  line-height: 1.9;
  color: var(--mc-card-text);
  font-synthesis: weight style;
}

.mc-card-content :deep(h1) {
  font-size: 1.6em;
  font-weight: 700 !important;
  line-height: 1.3;
  color: var(--mc-card-heading);
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 2.5px solid var(--mc-card-accent);
}

.mc-card-content :deep(h1:not(:first-child)) {
  margin-top: 32px;
}

.mc-card-content :deep(h2) {
  font-size: 1.3em;
  font-weight: 600 !important;
  line-height: 1.4;
  color: var(--mc-card-heading);
  margin: 28px 0 14px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid var(--mc-card-border);
}

.mc-card-content :deep(h2:first-child) {
  margin-top: 0;
}

.mc-card-content :deep(h3) {
  font-size: 1.15em;
  font-weight: 600 !important;
  line-height: 1.4;
  color: var(--mc-card-heading);
  margin: 24px 0 10px;
}

.mc-card-content :deep(h3:first-child) {
  margin-top: 0;
}

.mc-card-content :deep(p) {
  margin: 0 0 14px;
}

.mc-card-content :deep(p:last-child) {
  margin-bottom: 0;
}

.mc-card-content :deep(strong),
.mc-card-content :deep(b) {
  font-weight: 700 !important;
  color: var(--mc-card-heading);
}

.mc-card-content :deep(em),
.mc-card-content :deep(i) {
  font-style: italic !important;
}

.mc-card-content :deep(a) {
  color: var(--mc-card-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.mc-card-content :deep(ul) {
  margin: 0 0 14px;
  padding: 0 24px 0 0;
  list-style-type: disc;
}

.mc-card-content :deep(ol) {
  margin: 0 0 14px;
  padding: 0 24px 0 0;
  list-style-type: decimal;
}

.mc-card-content :deep(li) {
  margin: 6px 0;
}

.mc-card-content :deep(li::marker) {
  color: var(--mc-card-accent);
}

/* Task list (checkbox) */
.mc-card-content :deep(ul:has(> li > input[type="checkbox"])) {
  list-style-type: none;
  padding-right: 0;
}

.mc-card-content :deep(li > input[type="checkbox"]) {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--mc-card-accent);
  border-radius: 4px;
  vertical-align: middle;
  margin: 0 0 0 8px;
  cursor: default;
  position: relative;
  flex-shrink: 0;
}

.mc-card-content :deep(li > input[type="checkbox"]:checked) {
  background: var(--mc-card-accent);
  border-color: var(--mc-card-accent);
}

.mc-card-content :deep(li > input[type="checkbox"]:checked::after) {
  content: "";
  position: absolute;
  top: 1px;
  left: 4px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.mc-card-content :deep(blockquote) {
  margin: 16px 0;
  padding: 14px 20px 14px 14px;
  border-right: 4px solid var(--mc-card-blockquote-border);
  border-left: none;
  background: var(--mc-card-blockquote-bg);
  border-radius: 0 8px 8px 0;
}

.mc-card-content :deep(blockquote p) {
  margin: 0;
}

.mc-card-content :deep(code) {
  font-family: "SF Mono", "Fira Code", Menlo, Consolas, monospace;
  background: var(--mc-card-code-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.88em;
  direction: ltr;
  unicode-bidi: isolate;
}

.mc-card-content :deep(pre) {
  background: var(--mc-card-code-bg);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 14px 0;
  direction: ltr;
  unicode-bidi: isolate;
  text-align: left;
}

.mc-card-content :deep(pre code) {
  background: transparent;
  padding: 0;
  font-size: 13px;
  line-height: 1.6;
  unicode-bidi: isolate;
}

.mc-card-content :deep(hr) {
  border: none;
  border-top: 1.5px solid var(--mc-card-hr);
  margin: 24px 0;
}

.mc-card-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 14px 0;
}

.mc-card-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 0.875em;
}

.mc-card-content :deep(th),
.mc-card-content :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--mc-card-border);
  text-align: right;
}

.mc-card-content :deep(th) {
  background: var(--mc-card-code-bg);
  font-weight: 600;
}

/* ====== 底部 ====== */
.mc-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 32px;
  font-size: 11.5px;
  color: var(--mc-text-placeholder);
  background: var(--mc-footer-bg);
  border-top: 1px solid var(--mc-toolbar-border);
}

/* ====== Toast ====== */
.mc-toast {
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

.mc-toast-enter-active,
.mc-toast-leave-active {
  transition: all 0.3s ease;
}

.mc-toast-enter-from,
.mc-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* ====== 响应式 ====== */
@media (max-width: 768px) {
  .mc-toolbar {
    height: auto;
    flex-wrap: wrap;
    padding: 10px 12px;
    gap: 8px;
  }

  .mc-logo {
    font-size: 14px;
  }

  .mc-main {
    flex-direction: column;
    padding: 10px 12px;
    gap: 0;
  }

  .mc-sidebar {
    order: -1;
    width: 100% !important;
    flex-direction: row;
    flex-wrap: wrap;
    border-radius: 10px 10px 0 0;
    border-right: 1px solid var(--mc-panel-border);
    border-bottom: none;
    transition: none;
  }

  .mc-sb-toggle {
    width: 44px;
    height: 38px;
    border-bottom: none;
    border-right: 1px solid var(--mc-panel-border);
  }

  .mc-sb-body {
    flex: 1;
    flex-direction: row;
    align-items: center;
    gap: 14px;
    padding: 0 12px;
    min-width: 0;
    overflow-x: auto;
  }

  .mc-sidebar:not(.open) .mc-sb-body {
    display: none;
  }

  .mc-sidebar.open .mc-sb-body {
    display: flex;
  }

  .mc-sb-section {
    flex-shrink: 0;
    padding: 0;
    border-bottom: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mc-sb-label {
    margin-bottom: 0;
    white-space: nowrap;
    font-size: 10px;
  }

  .mc-sb-themes {
    display: flex;
    gap: 4px;
  }

  .mc-theme-card {
    padding: 3px;
    gap: 0;
    min-width: 0;
  }

  .mc-theme-name {
    display: none;
  }

  .mc-theme-swatch {
    width: 26px;
    height: 18px;
  }

  .mc-font-select {
    font-size: 11px;
    padding: 5px 22px 5px 8px;
    min-width: 100px;
  }

  .mc-font-upload {
    padding: 4px 8px;
    font-size: 10.5px;
    margin-top: 6px;
  }

  .mc-custom-fonts-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
  }

  .mc-custom-font-item {
    padding: 2px 6px;
    font-size: 10.5px;
  }

  .mc-sz-btn {
    width: 26px;
    height: 26px;
    font-size: 14px;
  }

  .mc-sz-value {
    font-size: 12px;
    min-width: 28px;
  }

  .mc-sb-spacer,
  .mc-sb-actions {
    display: none;
  }

  .mc-panel {
    min-height: 180px;
  }

  .mc-panel-editor {
    order: 0;
    border-radius: 0;
    border: 1px solid var(--mc-panel-border);
    border-bottom: none;
  }

  .mc-panel-preview {
    order: 1;
    border-radius: 0 0 10px 10px;
    border: 1px solid var(--mc-panel-border);
  }

  .mc-preview-area {
    padding: 16px;
  }

  .mc-card {
    padding: 24px;
  }

  .mc-btn-export span {
    display: none;
  }
}
</style>
