<template>
  <div>
    <!-- 写一个textare 和转换按钮-->
     <h2>文字转换工具</h2>
     <!-- tab选择器: 内容是 tote转西里尔 ，西里尔转tote -->
    <div class="tab">
      <div class="tab-item" :class="{ active: currentTab === 'tote' }" @click="currentTab = 'tote'">传统文转西里尔文</div>
      <div class="tab-item" :class="{ active: currentTab === 'cyrillic' }" @click="currentTab = 'cyrillic'">西里尔文转传统文</div>
    </div>
  
    <div v-if="currentTab === 'cyrillic'" class="input-label-row">
      <span class="input-label">输入</span>
      <button
        type="button"
        class="kbd-trigger"
        aria-label="打开哈萨克语西里尔文键盘"
        title="哈萨克语西里尔文键盘"
        @click="showKazakhKeyboard = true"
        v-html="kbdTriggerIcon"
      />
    </div>
    <textarea 
      ref="mainInput"
      class="input" 
      :dir="currentTab == 'tote' ? 'rtl' : 'ltr'" v-model="input"
      :placeholder="currentTab == 'tote' ? 'ءماتىندى وسى اراعا جاپسىرىڭىز نەمەسە جازىڭىز ' : 'мәтінді осы араға жапсырыңыз немесе жазыңыз '"
    />
    <KazakhCyrillicKeyboard
      :visible="showKazakhKeyboard"
      @update:visible="showKazakhKeyboard = $event"
      @close="showKazakhKeyboard = false"
      @input-char="onKbdInputChar"
      @backspace="onKbdBackspace"
      @delete-forward="onKbdDeleteForward"
      @enter="onKbdEnter"
    />
    <button class="main-button" @click="reshaper">{{ buttonText }}</button>
    <textarea 
      class="input"
      v-model="result"
      :dir="currentTab == 'tote' ? 'ltr' : 'rtl'"
    />
  </div>
</template>

<script>

import { Tote2Cyrl, Cyrl2Tote } from "./utils/WordConversion.js"
import KazakhCyrillicKeyboard from "./KazakhCyrillicKeyboard.vue"
import { lucideToSvg, iconKeyboard } from "./utils/lucideSvg.js"

export default {
  name: "WordSplit",
  components: {
    KazakhCyrillicKeyboard,
  },
  computed: {
    kbdTriggerIcon() {
      return lucideToSvg(iconKeyboard, { size: 22, className: "kbd-trigger-lucide" });
    },
  },
  data() {
    return {
      input: "",
      Tote2cry: "传统文转西里尔文",
      currentTab: "", // 当前选中的tab
      buttonText: "转换",
      result: "",
      showKazakhKeyboard: false,
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
      this.showKazakhKeyboard = false;
    }
  },
  methods: {
    onKbdInputChar(ch) {
      const el = this.$refs.mainInput;
      if (!el) {
        this.input += ch;
        return;
      }
      const start = el.selectionStart;
      const end = el.selectionEnd;
      this.input = this.input.slice(0, start) + ch + this.input.slice(end);
      const pos = start + ch.length;
      this.$nextTick(() => {
        el.focus();
        el.selectionStart = el.selectionEnd = pos;
      });
    },
    onKbdBackspace() {
      const el = this.$refs.mainInput;
      if (!el) {
        this.input = this.input.slice(0, -1);
        return;
      }
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (start !== end) {
        this.input = this.input.slice(0, start) + this.input.slice(end);
        this.$nextTick(() => {
          el.focus();
          el.selectionStart = el.selectionEnd = start;
        });
        return;
      }
      if (start > 0) {
        this.input = this.input.slice(0, start - 1) + this.input.slice(start);
        this.$nextTick(() => {
          el.focus();
          el.selectionStart = el.selectionEnd = start - 1;
        });
      }
    },
    onKbdDeleteForward() {
      const el = this.$refs.mainInput;
      if (!el) {
        return;
      }
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (start !== end) {
        this.input = this.input.slice(0, start) + this.input.slice(end);
        this.$nextTick(() => {
          el.focus();
          el.selectionStart = el.selectionEnd = start;
        });
        return;
      }
      if (start < this.input.length) {
        this.input = this.input.slice(0, start) + this.input.slice(start + 1);
        this.$nextTick(() => {
          el.focus();
          el.selectionStart = el.selectionEnd = start;
        });
      }
    },
    onKbdEnter() {
      this.$nextTick(() => {
        const el = this.$refs.mainInput;
        if (el) el.focus();
      });
    },
    reshaper() {
      // 搜索功能
      if (this.input.trim() == "") return;

      if(this.currentTab == 'tote') {
        this.result = Tote2Cyrl(this.input);
      } else {
        this.result = Cyrl2Tote(this.input);
      }

      navigator.clipboard.writeText(this.result || '');

      this.buttonText = "已添加到剪切板";
      setTimeout(() => {
        this.buttonText = "转换";
      }, 2000);
     }
  }
};
</script>

<style scoped>

h2 {
  border: none;
}

/* 样式 */
.input {
  width: 100%;
  height: 200px;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  resize: none;
}
.input:focus {
  border-color: #409eff;
  outline: none;
}

.tab {
  display: flex;
  /* margin-bottom: 20px; */
}
.tab-item {
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 5px;
  border: 1px solid #f0f0f0;
  font-weight: 600;
}
.tab-item.active {
  background-color: #409eff;
  color: #fff;
}

.main-button {
  width: 100%;
  padding: 10px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.input-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 2px;
}

.input-label {
  font-weight: 600;
  font-size: 15px;
  color: #333;
}

.kbd-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
  color: #409eff;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.kbd-trigger:hover {
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.kbd-trigger >>> .kbd-trigger-lucide {
  display: block;
}
</style>

