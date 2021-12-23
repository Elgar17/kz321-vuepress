<template>
  <div>
    <div v-if="obj != null">
      <div class="all-country">全国简报</div>
      <!-- <div>更新时间：{{news.updateTime}}</div> -->
      <div>{{news.report}}</div>
      <span class="country">国内疫情</span>
      <div>新增：{{country.lastIncData.incrConfirm}}</div>
      <div>现有确诊：{{ country.currentConfirm }}</div>
      <div>确诊总数：{{ country.totalConfirmed }}</div>
      <div>累计治愈：{{ country.totalCured }}</div>

      <span class="kz">哈萨克斯坦疫情</span>
      <div>新增：{{ this.obj.lastIncData.incrConfirm }}</div>
      <div>现有确诊：{{ this.obj.currentConfirm }}</div>
      <div>确诊总数：{{ this.obj.totalConfirmed }}</div>
      <div>累计治愈：{{ this.obj.totalCured }}</div>
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
      country: null,
    };
  },
  created() {
    jsonp("https://cdn.mdeer.com/data/yqstaticdata.js?").then((data) => {
      console.log(data);
      this.country = data.country
      this.news = data.nativeQuickNews;
      this.obj = data.continentDataList[2].countriesData[12];
    });
  },
};
</script>

<style>
.country, .all-country, .kz {
  display: inline-block;
  background: red;
  color: #fff;
  padding: 2px 5px 4px 5px;
  margin: 3px 0;
  border-radius: 3px;
}

.kz{
  background: #00b8ce;
}
.all-country{
  background: #ab00f8;
}
</style>