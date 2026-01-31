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

