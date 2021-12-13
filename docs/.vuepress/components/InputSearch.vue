<template>
  <div class="input-search-wrap">
    <!-- <select v-model="ingin">
      <option value="baidu">百度</option>
      <option value="google">谷歌</option>
      <option value="bing">必应</option>
    </select> -->
    <div class="logo-wrapper">
      <img src="../public/kz321.top.png" alt="">
    </div>
    <div class="input-search">
      <ul>
        <li>百度</li>
        <li>谷歌</li>
        <li>必应</li>
      </ul>
      <input type="text" v-model="input" placeholder="请输入" />
      <button @click="search">搜索</button>
      <span class="ctrld"> ❤ Ctrl + D 收藏到导航</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputSearch",
  data () {
    return {
      // ingin: "baidu",
      input: "",
      baidu: "https://www.baidu.com/s?ie=UTF-8&wd=",
      google: "https://www.google.com/search?ie=utf-8&q=",
      bing: "https://cn.bing.com/search?q="
    }
  },
  methods: {
    // search(){
    //   if(this.input.trim() == "") return;
    //   switch(this.ingin){
    //     case "baidu":
    //       window.open(this.baidu + this.input)
    //       break;
    //     case "google":
    //       window.open(this.google + this.input)
    //       break;
    //     case "bing":
    //       window.open(this.bing + this.input)
    //       break;
    //   }
    // }
  }
};
</script>

<style scoped>
@media screen and (max-width: 600px) {
  .ctrld {
    display: none;
  }
}

.input-search-wrap {
  padding-top: 20px;
  font-size: 12px;
  height: 80px;
  text-align: center;
  direction: ltr;
  /* background-color: #143bd0; */
}
.logo-wrapper{
  float: left;
  height: 80px;
  width: 200px;
  text-align: center;
}
.input-search{
  margin-left: 200px;
}

select,
input,
button {
  height: 35px;
  line-height: 35px;
  outline: none;
  vertical-align: middle;
  border: 1px solid #ccc;
  font-size: 16px;
  border-radius: 4px 0 0 4px;
}

select {
  border-radius: 4px 0 0 4px;
  box-sizing: border-box;
  vertical-align: middle;
  appearance: none; /*清除select下拉框默认样式*/
  -moz-appearance: none;
  -webkit-appearance: none;
  padding: 0 16px 0 14px; /*为下拉小箭头留出一点位置，避免被文字覆盖*/
  /* font-weight: bold; */
  /* 自定义图片覆盖原有的下三角符号 */
  background: url('./xiala.png') no-repeat scroll right center transparent;
}
select::-ms-expand {
  display: none; /*清除IE默认下拉按钮，但是测试发现IE10以上有效，IE8，9默认下拉按钮仍旧存在*/
}
.input-search-wrap input {
  width: 300px;
  box-sizing: border-box;
  vertical-align: middle;
  padding: 0 14px;
  outline: none;
  margin-left: 1px;
}
.input-search-wrap button {
  padding: 0 14px;
  margin: -1px;
  border-radius: 0 4px 4px 0;
  font-weight: bold;
  background-color: #fff;
}
.input-search-wrap button:hover {
  cursor: pointer;
}
</style>