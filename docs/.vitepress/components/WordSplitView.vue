<template>
  <div>
     <h2>文字拆分助手</h2>
    <div class="world-container" v-if="res.length > 0">
      <span v-for="item in res" class="world">{{ item }}</span>
    </div>
    <textarea class="input" dir="rtl" v-model="input" placeholder="ءماتىندى وسى اراعا جاپسىرىڭىز نەمەسە جازىڭىز "></textarea>
    <div style="text-align: right;">字符数量：{{ res.length }}</div>
    <button class="main-button" @click="reshaper">{{ buttonText }}</button>
  </div>
</template>

<script>

import { reshaperKzChars } from "./utils/KazakhCharsReshaper.js"

export default {
  name: "WordSplit",
  data() {
    return {
      input: "",
      buttonText: "拆分",
      res: "",
    };
  },
  methods: {
    reshaper() {
      // 搜索功能
      if (this.input.trim() == "") return;
      navigator.clipboard.writeText((reshaperKzChars(this.input) || '').split('').reverse().join(''));
      this.res = (reshaperKzChars(this.input) || '').split('').reverse()
      this.buttonText = "已添加到剪切板";
      console.log(this.buttonText);
      setTimeout(() => {
        this.buttonText = "拆分";
      }, 2000);
     }
  }
};
</script>

<style scoped>

h2 {
  border: none;
}
.world-container {
  display: flex;
  justify-content: center;
  font-size: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px 0;
  margin-bottom: 16px;
  font-family: 'KazNet', sans-serif;
}

.world {
  margin-left: 8px;
}
.input {
  width: 100%;
  height: 200px;
  padding: 10px;
  margin: 20px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  resize: none;
  font-family: 'KazNet', sans-serif;
  font-size: 18px;
  line-height: 1.6;
}

.input::placeholder {
  font-family: 'KazNet', sans-serif;
}

.main-button {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: linear-gradient(135deg, #FEC50A 0%, #FFDB4D 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(254, 197, 10, 0.3);
}

.main-button:hover {
  background: linear-gradient(135deg, #FFDB4D 0%, #FEC50A 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(254, 197, 10, 0.5);
}

.main-button:active {
  transform: translateY(0);
}
</style>

