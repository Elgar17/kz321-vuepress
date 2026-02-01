<template>
  <div class="word-conversion-container">
    <div class="header">
      <h2 class="title">
        <span class="icon">🔄</span>
        文字转换工具
      </h2>
      <div class="tab-group">
        <button 
          class="tab-item" 
          :class="{ active: currentTab === 'tote' }" 
          @click="currentTab = 'tote'"
        >
          <span class="tab-icon">📝</span>
          传统文 → 西里尔文
        </button>
        <button 
          class="tab-item" 
          :class="{ active: currentTab === 'cyrillic' }" 
          @click="currentTab = 'cyrillic'"
        >
          <span class="tab-icon">🔤</span>
          西里尔文 → 传统文
        </button>
      </div>
    </div>

    <div class="conversion-area">
      <div class="input-section">
        <div class="section-header">
          <span class="section-label">输入文本</span>
          <button 
            v-if="input" 
            class="clear-btn" 
            @click="clearInput"
            title="清空"
          >
            ✕
          </button>
        </div>
        <textarea 
          class="input-box" 
          :dir="currentTab == 'tote' ? 'rtl' : 'ltr'" 
          v-model="input"
          :placeholder="currentTab == 'tote' ? 'ءماتىندى وسى اراعا جاپسىرىڭىز نەمەسە جازىڭىز ' : 'мәтінді осы араға жапсырыңыз немесе жазыңыз '"
        />
        <div class="char-count">{{ input.length }} 字符</div>
      </div>

      <div class="convert-button-wrapper">
        <button 
          class="convert-button" 
          @click="reshaper"
          :disabled="!input.trim()"
        >
          <span class="button-icon" v-if="buttonText === '转换'">⇅</span>
          <span class="button-icon" v-else>✓</span>
          {{ buttonText }}
        </button>
      </div>

      <div class="output-section">
        <div class="section-header">
          <span class="section-label">转换结果</span>
          <button 
            v-if="result" 
            class="copy-btn" 
            @click="copyResult"
            title="复制"
          >
            📋 复制
          </button>
        </div>
        <textarea 
          class="output-box"
          v-model="result"
          :dir="currentTab == 'tote' ? 'ltr' : 'rtl'"
          readonly
          :placeholder="'转换结果将显示在这里...'"
        />
        <div class="char-count">{{ result.length }} 字符</div>
      </div>
    </div>
  </div>
</template>

<script>

import { Tote2Cyrl, Cyrl2Tote } from "./utils/WordConversion.js"

export default {
  name: "WordConversion",
  data() {
    return {
      input: "",
      currentTab: "",
      buttonText: "转换",
      result: "",
    };
  },
  mounted() {
    const savedTab = localStorage.getItem("currentTab");
    this.currentTab = savedTab || "tote";
  },
  watch: {
    currentTab(newTab) {
      localStorage.setItem("currentTab", newTab);
      this.input = "";
      this.result = "";
    }
  },
  methods: {
    reshaper() {
      if (this.input.trim() == "") return;

      if(this.currentTab == 'tote') {
        this.result = Tote2Cyrl(this.input);
      } else {
        this.result = Cyrl2Tote(this.input);
      }

      navigator.clipboard.writeText(this.result || '');

      this.buttonText = "✓ 已复制到剪贴板";
      setTimeout(() => {
        this.buttonText = "转换";
      }, 2000);
    },
    clearInput() {
      this.input = "";
      this.result = "";
    },
    copyResult() {
      if (this.result) {
        navigator.clipboard.writeText(this.result);
        // 简单的复制反馈
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = "✓ 已复制";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }
    }
  }
};
</script>

<style scoped>
.word-conversion-container {
  max-width: 900px;
  margin: 0 auto;
}

/* 头部区域 */
.header {
  margin-bottom: 1.5rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  border: none;
  color: var(--vp-c-text-1);
}

.icon {
  font-size: 1.75rem;
}

/* Tab 切换 */
.tab-group {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item:hover:not(.active) {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.tab-item.active {
  background: linear-gradient(135deg, #00AFCA 0%, #33C4DA 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 175, 202, 0.25);
}

.tab-icon {
  font-size: 1.1rem;
  line-height: 1;
}

/* 转换区域 */
.conversion-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 输入/输出区域 */
.input-section,
.output-section {
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.clear-btn,
.copy-btn {
  padding: 0.25rem 0.625rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover,
.copy-btn:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.input-box,
.output-box {
  width: 100%;
  min-height: 180px;
  padding: 1rem;
  box-sizing: border-box;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s ease;
}

.input-box:focus {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 175, 202, 0.1);
}

.output-box {
  background: var(--vp-c-bg);
  border-style: dashed;
}

.output-box:focus {
  border-color: var(--vp-c-brand);
  outline: none;
}

/* RTL 支持 */
.input-box[dir="rtl"],
.output-box[dir="rtl"] {
  font-family: 'KazNet', sans-serif;
  font-size: 18px;
  direction: rtl;
}

.input-box[dir="rtl"]::placeholder,
.output-box[dir="rtl"]::placeholder {
  font-family: 'KazNet', sans-serif;
}

/* 字符计数 */
.char-count {
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-align: right;
}

/* 转换按钮区域 */
.convert-button-wrapper {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.convert-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2.5rem;
  background: linear-gradient(135deg, #FEC50A 0%, #FFDB4D 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(254, 197, 10, 0.3);
}

.convert-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #FFDB4D 0%, #FEC50A 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(254, 197, 10, 0.5);
}

.convert-button:active:not(:disabled) {
  transform: translateY(0);
}

.convert-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.25rem;
  line-height: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 1.25rem;
  }

  .tab-item {
    padding: 0.5rem 0.625rem;
    font-size: 0.8rem;
  }

  .tab-icon {
    font-size: 1rem;
  }

  .input-box,
  .output-box {
    min-height: 150px;
    font-size: 15px;
  }

  .convert-button {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
}

/* 暗色模式优化 */
.dark .input-box {
  background: var(--vp-c-bg-soft);
}

.dark .output-box {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
}
</style>

