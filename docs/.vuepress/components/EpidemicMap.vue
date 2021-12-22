<template>
  <div>
    <div v-if="obj != null">
      <div>全国简报：</div>
      <div>{{news.report}}</div>
      <div>更新时间：{{news.updateTime}}</div>
      <br>
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
  name: "EpidemicMap",
  data() {
    return {
      obj: null,
      news: "",
    };
  },
  created() {
    jsonp("https://cdn.mdeer.com/data/yqstaticdata.js?").then((data) => {
      console.log(data.nativeQuickNews);
      this.news = data.nativeQuickNews;
      this.obj = data.continentDataList[2].countriesData[12];
    });
  },
};
</script>

<style>
</style>