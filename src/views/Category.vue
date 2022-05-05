<template>
  <div class="categoryPage">
      <div class="categoryPage-head">
        <span class="categoryPage-head-tab" 
        :style="categoryPageHeadTabShow == 1 ? 'border-bottom: solid #0064f9; color: #0064f9' : ''"
        @click="categoryPageHeadTabShowClick(1)">分类</span>
        <span class="categoryPage-head-tab"
        :style="categoryPageHeadTabShow == 2 ? 'border-bottom: solid #0064f9; color: #0064f9' : ''"
        @click="categoryPageHeadTabShowClick(2)">热门图片排行榜</span>
      </div>
      <div v-if="categoryPageHeadTabShow == 1" class="categoryPage-content grid media-reactive">
        <div>
          <div class="categoryPage-content-title">热门分类</div>
          <ul class="categoryPage-content-tags">
            <li v-for="item in categoryTags" :key="item" @click="getCategory(item)"><a :style="categoryFocus == item ? 'background: #e8e8e8;' : ''">{{ item }}</a></li>
          </ul>
          <Masonry :category="category"></Masonry>
        </div>
      </div>
      <div v-if="categoryPageHeadTabShow == 2" class="grid media-reactive">
        <div class="categoryPage-rankings">
          <ul class="categoryPage-content-tags" style="margin-top: 0">
            <li v-for="item in categoryTags" :key="item" @click="getCategory(item)"><a :style="categoryFocus == item ? 'background: #e8e8e8;' : ''">{{ item }}</a></li>
          </ul>
          <div v-for="(item, i) in rankingsList" :key="item.pid" class="categoryPage-rankings-item">
            <div class="categoryPage-rankings-item-title">
              <span class="fs36 bold">{{ i + 1 }}</span>
              <span class="fs12 c5e bold">{{ item.like }}</span>
              <span class="fs12 c5e lighter">点赞量</span>
            </div>
            <div class="categoryPage-rankings-item-img">
              <img :src="item.imgSrc">
            </div>
            <div class="categoryPage-rankings-item-introduce">
              <div class="fs26 mb10">{{ item.imgName }}</div>
              <div class="c5e mb10">作者：{{ item.username }}</div>
              <div class="flex">
                <span class="nowrap" style="line-height: 1.5;">简介：</span>
                <span>
                  {{ item.introduction }}
                </span> 
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Masonry from '@/components/Masonry'
import {
  getImgLike
} from '@/api/img.js'
export default {
  components: { Masonry },
  created(){
  },
    data() {
      return {
        categoryPageHeadTabShow: 1,
        categoryTags: ['全部', '游戏', '动漫', '美女', '风景', '植物', '汽车'],
        category: '',
        categoryFocus: '全部',
        rankingsList: []
      }
    },
    methods: {
      categoryPageHeadTabShowClick(e){
        this.category = ''
        this.categoryFocus = '全部'
        this.categoryPageHeadTabShow = e
        if (e == 2) {
          this.getImgLike()
        }
      },
      getCategory(e){
        this.categoryFocus = e
        this.category = e == '全部' ? '' : e
        if (this.categoryPageHeadTabShow == 2) {
          this.getImgLike()
        }
      },
      getImgLike(){
        getImgLike({
          category: this.category
        }).then(res => {
          this.rankingsList = res.data.data
        })
      }
    }
}
</script>

<style lang="scss" scoped>
.categoryPage{
  padding-top: 60px;
}
.categoryPage-head{
  height: 60px;
  display: block;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0,0,0, 0.2);
  margin-bottom: 2rem;
  .categoryPage-head-tab{
    font-size: 17px;
    line-height: 26px;
    font-weight: 600;
    color: #5e5e5e;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    text-align: center;
    letter-spacing: .4px;
    padding: 1rem;
    cursor: pointer;
    &:hover{
      color: #0064f9;
    }
  }
}
.categoryPage-content{
  .categoryPage-content-title{
    font-size: 30px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -1px;
  }
  &::before{
    content: '';
  }
}
.categoryPage-content-tags{
  display: block;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0;
  list-style: none;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  padding: 0;
  white-space: nowrap;
  color: #9e9e9e;
  text-transform: capitalize;
  li{
    display: inline;
    a{
      transition: .15s all ease;
      display: inline-block;
      padding: 0.8rem 1.25rem;
      border: 1px solid #e8e8e8;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1);
      border-radius: 6px;
      margin-right: 0.25rem;
      cursor: pointer;
      text-decoration: none;
      &:hover{
        background: #e8e8e8;
      }
    }
  }
}
.categoryPage-rankings{
  display: flex;
  flex-direction: column;
  .categoryPage-rankings-item{
    display: flex;
    margin-bottom: 2rem;
    .categoryPage-rankings-item-title{
      display: flex;
      flex-direction: column;
      width: 80px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      margin-right: 1.25rem;
    }
    .categoryPage-rankings-item-img{
      width: 300px;
      height: 400px;
      margin-right: 1.25rem;
      img{
        width: 300px;
        height: 400px;
      }
    }
    .categoryPage-rankings-item-introduce{
      width: 100%;
    }
  }
}
</style>