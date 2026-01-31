<template>
  <div>
    <!-- 写一个textare 和转换按钮-->
     <h2>文字转换工具</h2>
     <!-- tab选择器: 内容是 tote转西里尔 ，西里尔转tote -->
    <div class="tab">
      <div class="tab-item" :class="{ active: currentTab === 'tote' }" @click="currentTab = 'tote'">传统文转西里尔文</div>
      <div class="tab-item" :class="{ active: currentTab === 'cyrillic' }" @click="currentTab = 'cyrillic'">西里尔文转传统文</div>
    </div>
  
    <textarea 
      class="input" 
      :dir="currentTab == 'tote' ? 'rtl' : 'ltr'" v-model="input"
      :placeholder="currentTab == 'tote' ? 'ءماتىندى وسى اراعا جاپسىرىڭىز نەمەسە جازىڭىز ' : 'мәтінді осы араға жапсырыңыз немесе жазыңыз '"
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

export default {
  name: "WordSplit",
  data() {
    return {
      input: "",
      Tote2cry: "传统文转西里尔文",
      currentTab: "", // 当前选中的tab
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
</style>

