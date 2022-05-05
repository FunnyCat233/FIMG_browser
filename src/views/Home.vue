<template>
  <div class="pt60">
    <div class="homePage-head">
      <div class="homePage-head-content">Welcome to the FIMG</div>
      <div class="relative">
        <div class="search-select">
          <div class="search-select-item"
          :style="searchSelect == 1 ? 'background-color: #DCDFE6; color: #606266' : ''"
          @click="changeSearchSelect(1)">
          图片</div>
          <div class="search-select-item ml10"
          :style="searchSelect == 2 ? 'background-color: #DCDFE6; color: #606266' : ''"
          @click="changeSearchSelect(2)">
          用户</div>
        </div>
        <el-input v-model="searchContent" suffix-icon="el-icon-search" placeholder="Search for images..." @change="search()"/>
      </div>
      
    </div>
    <div v-if="searchSelect == 1">
      <div class="categoryPage-head">
        <span class="categoryPage-head-tab"
        :style="homeHeadTabShow == 1 ? 'border-bottom: solid #0064f9; color: #0064f9' : ''"
        @click="changeHomeHeadTabShow(1)">
        推荐</span>
        <span class="categoryPage-head-tab"
        :style="homeHeadTabShow == 2 ? 'border-bottom: solid #0064f9; color: #0064f9' : ''"
        @click="changeHomeHeadTabShow(2)">
        关注</span>
      </div>
      <div v-if="homeHeadTabShow == 1" class="home-page media-reactive">
        <Masonry :category="imgSearch"></Masonry>
      </div>
      <div v-if="homeHeadTabShow == 2" class="home-page media-reactive">
        <Masonry :isConcern="true"></Masonry>
      </div>
    </div>
    <div v-else class="grid mt20">
      <div>
        <div v-for="item in userList" :key="item.username" class="search-user-box">
          <div class="item-avatar">
            <img :src="item.avatar" alt="">
          </div>
          <div class="item-username">
            <span class="bold mr20 pointer" style="width: 50px" @click="toUserPage(item.uid)">{{ item.username }}</span>
            <el-button v-if="item.isConcern" type="primary" round plain @click="delConcernList(item.uid)">取消关注</el-button>
            <el-button v-else type="primary" :disabled="item.uid == $store.state.userInfo.uid" round @click="addConcernList(item.uid)">关注</el-button>
          </div>
          <div class="item-user-introduction">{{ item.introduction }}</div>
        </div>
        <div v-if="userList.length == 0" class="tac">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import Masonry from '@/components/Masonry'
import {
  getUserList
} from '@/api/user.js'
import {
  getConcernList,
  addConcernList,
  delConcernList
} from '@/api/concern.js'
export default {
  created(){
  },
  components: { Masonry },
  data(){
    return{
      searchContent: '',
      imgSearch: '',
      searchSelect: 1,
      homeHeadTabShow: 1,
      userList: [],
    }
  },
  methods: {
    search(){
      this.imgSearch = ''
      this.userList = []
      if (this.searchSelect == 1) {
        this.imgSearch = this.searchContent
      } else if (this.searchSelect == 2 && this.searchContent) {
        this.getUserList()
      }
    },
    changeHomeHeadTabShow(e){
      this.homeHeadTabShow = e
      this.searchContent = ''
      this.imgSearch = ''
    },
    changeSearchSelect(e){
      this.searchSelect = e
      this.imgSearch = ''
      this.userList = []
      if (e == 1) {
        this.imgSearch = this.searchContent
      } else if (e == 2 && this.searchContent) {
        this.getUserList()
      }
    },
    toUserPage(uid){
      this.$router.replace({
          path: '/private',
          query: {
              uid
          }
      })
    },
    addConcernList(muid){
      addConcernList({
        puid: this.$store.state.userInfo.uid,
        muid
      }).then(res => {
        if (res.data.status == 0) {
          this.$message({
            message: res.data.mes,
            type: 'success'
          })
          this.getUserList()
        }
      })
    },
    delConcernList(muid){
      delConcernList({
        puid: this.$store.state.userInfo.uid,
        muid
      }).then(res => {
        if (res.data.status == 0) {
          this.$message({
            message: res.data.mes,
            type: 'success'
          })
          this.getUserList()
        }
      })
    },
    getUserList(){
      getUserList({
        pageIndex: 1,
        pageSize: 999,
        username: this.searchContent
      }).then(res => {
        getConcernList({
          puid: this.$store.state.userInfo.uid
        }).then(n => {
          res.data.data.forEach(e => {
            for (let i = 0; i < n.data.data.length; i++) {
              if (this.$store.state.userInfo.uid == n.data.data[i].puid && e.uid == n.data.data[i].muid) {
                e.isConcern = true;
                break;
              } else {
                e.isConcern = false;
              }
            }
          });
          this.userList = res.data.data
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.home-page{
  display: grid;
  grid-template-columns: 1fr 800px 1fr;
  &::before{
    content: '';
  }
}
.categoryPage-head{
  height: 60px;
  display: block;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0,0,0, 0.2);
  margin-bottom: 1.5rem;
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
/deep/ .homePage-head{
  position: relative;
  height: 400px;
  width: 100%;
  min-width: 850px;
  background: url('../assets/home_bg.jpg') no-repeat;
  background-position: center;
  z-index: 1;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .search-select{
    position: absolute;
    top: -40px;
    display: flex;
    z-index: 4;
    .search-select-item{
      width: 70px;
      height: 35px;
      background-color: #fff;
      border-radius: 20px;
      text-align: center;
      line-height: 35px;
      color: #909399;
      cursor: pointer;
      &:hover{
        background-color: #E4E7ED;
      }
    }
  }
  .el-input{
    width: 400px;
    z-index: 3;
    &:hover{
      box-shadow: 0 0 0 5px #0000001a;
      border-radius: 4px
    }
    .el-input__inner{
      &:focus{
        box-shadow: 0 0 0 5px #0000001a;
        border-color: #0000001a
      }
    }
  }
}
.homePage-head::after{
  content: "";
  height: 100%;
  width:100%;
  position: absolute;
  left:0;
  top:0;
  background: inherit;
  filter: blur(2px);
  z-index: 2;
}
.homePage-head-content{
  margin-bottom: 80px;
  color: #fff;
  font-size: 44px;
  white-space: nowrap;
  font-weight: bold;
  z-index: 3;
}
.search-user-box{
  display: grid;
  grid-template-columns: 100px auto;
  grid-template-rows: 50px 50px;
  grid-column-gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #DCDFE6;
  .item-avatar{
    grid-row-start: 1;
    grid-row-end: 3;
    img{
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
  .item-username{
    line-height: 50px;
  }
  .item-user-introduction{
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>