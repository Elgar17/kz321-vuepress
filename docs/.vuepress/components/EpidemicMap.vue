<template>
  <div>
    <div v-if="obj != null">
      <div>哈萨克斯坦疫情</div>
      <div>新增：{{ this.obj.lastIncData.incrConfirm }}</div>
      <div>当前确诊：{{ this.obj.currentConfirm }}</div>
      <div>确诊总数：{{ this.obj.totalConfirmed }}</div>
      <div>累计治愈总数：{{ this.obj.totalCured }}</div>
    </div>
  </div>
</template>

<script>
import { jsonp } from "../utils/request";
export default {
  name: "Carone",
  data() {
    return {
      obj: {},
    };
  },
  created() {
    console.log("oo", { callback: "callbackstaticdata" });
    jsonp("https://cdn.mdeer.com/data/yqstaticdata.js?").then((data) => {
      console.log(data.continentDataList[2].countriesData[12]);
      this.obj = data.continentDataList[2].countriesData[12];
    });
  },
};
</script>

<style>
</style>