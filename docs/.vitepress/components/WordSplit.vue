<template>
  <div>
    <!-- 写一个textare 和转换按钮-->
     <h2>Tote 文字剪影助手</h2>
    <textarea class="input" dir="rtl" v-model="input" placeholder="ءماتىندى وسى اراعا جاپسىرىڭىز نەمەسە جازىڭىز "></textarea>
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
      buttonText: "转换",
    };
  },
  methods: {
    reshaper() {
      // 搜索功能
      if (this.input.trim() == "") return;
      navigator.clipboard.writeText((reshaperKzChars(this.input) || '').split('').reverse().join(''));
      this.buttonText = "已添加到剪切板";
      console.log(this.buttonText);
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

