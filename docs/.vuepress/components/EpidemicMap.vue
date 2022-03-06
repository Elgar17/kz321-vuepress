<template>
  <div>
    <div >
      <!-- <div class="all-country">全国简报</div> -->
      <!-- <div>更新时间：{{news.updateTime}}</div> -->
      <!-- <div>{{news.report}}</div> -->
      <div></div>
      <span class="country">国内疫情</span>
      <!-- <div>新增：{{country.lastIncData.incrConfirm}}</div> -->
      <div>现有确诊：{{ country && country.currentConfirm }}</div>
      <div>确诊总数：{{ country && country.totalConfirmed }}</div>
      <div>累计治愈：{{ country && country.totalCured }}</div>

      <span class="kz">哈萨克斯坦疫情</span>
      <div>新增：{{ obj && obj.lastIncData.incrConfirm }}</div>
      <div>现有确诊：{{ obj && obj.currentConfirm }}</div>
      <div>确诊总数：{{ obj && obj.totalConfirmed }}</div>
      <div>累计治愈：{{ obj && obj.totalCured }}</div>
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
      // console.log(data.continentDataList);
      this.country = data.country
      this.news = data.nativeQuickNews;
       this.obj = data.continentDataList[2].countriesData[27];
       let arr = data.continentDataList[2] && data.continentDataList[2].countriesData
       console.log(data)
       for(let i = 0; i < arr.length; i++){
         if(arr[i].childStatistic == "哈萨克斯坦"){
           this.obj = arr[i]
         }
       }
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