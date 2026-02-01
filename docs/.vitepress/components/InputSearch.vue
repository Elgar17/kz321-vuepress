<template>
  <div class="input-search-wrap">
    <!-- <div class="logo-wrapper">
      <img src="../public/kz321.png" alt="" />
    </div> -->
    <div class="input-search">
      <ul class="ingin-wrapper">
        <li
          v-for="(item, index) in ingins"
          :key="index"
          @click="current = item"
          :class="{ slected: current == item }"
        >
          {{ item }}
        </li>
      </ul>
      <input type="text" v-model="input" placeholder="请输入" />
      <button @click="search">搜索</button>
      <span :class="{ heiden: isHeiden }" class="ctrld">
        ❤ Ctrl + D 收藏到导航</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "InputSearch",
  data () {
    return {
      current: "百度",
      ingins: ["百度", "谷歌", "必应", "翻译"],
      input: "",
      isHeiden: false,
      baidu: "https://www.baidu.com/s?ie=UTF-8&wd=",
      google: "https://www.google.com/search?ie=utf-8&q=",
      bing: "https://cn.bing.com/search?q=",
      fanyi: "https://fanyi.baidu.com/translate#zh/en/"
    };
  },
  mounted () {
    this.time = setTimeout(() => {
      this.isHeiden = true
      clearTimeout(this.time)
      this.time = null
    }, 5000)
  },
  methods: {
    search () {
      if (this.input.trim() == "") return;
      switch (this.current) {
        case "百度":
          window.open(this.baidu + this.input);
          break;
        case "谷歌":
          window.open(this.google + this.input);
          break;
        case "必应":
          window.open(this.bing + this.input);
          break;
        case "翻译":
          window.open(this.fanyi + this.input);
          break;
      }
    },
  },
};
</script>

<style scoped>
/* 小于780px */
@media screen and (max-width: 780px) {
  .ctrld {
    display: none;
  }
  .input-search {
    margin-left: 0;
  }
  .input-search,
  .logo-wrapper {
    display: block;
    text-align: center;
  }
  .logo-wrapper {
    float: none;
    height: 80px;
    margin: 0 auto;
  }
}
/* 大于 780px */
@media screen and (min-width: 780px) {
  .logo-wrapper {
    float: left;
  }
  .input-search {
    display: block;
    padding-left: 60px;
    margin-left: 200px;
  }
}
.input-search-wrap {
  padding: 20px 0;
  font-size: 12px;
  direction: ltr;
}
.logo-wrapper {
  height: 80px;
  width: 200px;
  text-align: center;
}
.logo-wrapper img {
  border-radius: 8px;
}

.ingin-wrapper {
  margin: 0;
}
.ingin-wrapper li {
  display: inline-block;
  margin: 0;
  padding: 0;
  border-radius: 5px 5px 0 0;
  list-style: none;
  padding: 0 12px;
  margin: 0 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ingin-wrapper li:hover:not(.slected) {
  background-color: var(--vp-c-bg-soft, #f5f5f5);
}

.slected {
  color: #fff;
  background: linear-gradient(135deg, #00AFCA 0%, #33C4DA 100%);
  box-shadow: 0 2px 6px rgba(0, 175, 202, 0.3);
}

input,
button {
  height: 35px;
  line-height: 35px;
  outline: none;
  vertical-align: middle;
  border: 1px solid var(--vp-c-brand, #00AFCA);
  font-size: 16px;
  border-radius: 4px 0 0 4px;
}
.input-search-wrap .input-search input {
  width: 60%;
  box-sizing: border-box;
  vertical-align: middle;
  padding: 0 14px;
  outline: none;
  margin-left: 1px;
  transition: border-color 0.3s ease;
}

.input-search-wrap .input-search input:focus {
  border-color: var(--vp-c-brand, #00AFCA);
  box-shadow: 0 0 0 2px rgba(0, 175, 202, 0.1);
}

.input-search-wrap .input-search button {
  padding: 0 14px;
  margin: -1px;
  border-radius: 0 4px 4px 0;
  font-weight: 600;
  background: linear-gradient(135deg, #FEC50A 0%, #FFDB4D 100%);
  color: #1a1a1a;
  border: 1px solid #FEC50A;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(254, 197, 10, 0.3);
}
.input-search-wrap .input-search button:hover {
  cursor: pointer;
  background: linear-gradient(135deg, #FFDB4D 0%, #FEC50A 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(254, 197, 10, 0.4);
}

.input-search-wrap .input-search button:active {
  transform: translateY(0);
}
.heiden {
  display: none;
}
</style>