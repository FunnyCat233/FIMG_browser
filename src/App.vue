<template>
  <div id="app">
    <div v-if="this.$store.state.pageHeadShow" class="page-head">
      <div class="logo pointer" @click="toHome">
        <img src="@/assets/LOGO.png" alt="">
        <span class="logo-content">FIMG</span>
      </div>
      <div class="page-head-tags">
        <div class="select" @click="toHome">首页</div>
        <div class="select" @click="toCategory">分类</div>
        <div class="select" @click="toPrivate">我的</div>
      </div>
      <div class="flex">
        <div class="background">
          <div class="background-btn" @click="logOut">注销</div>
        </div>
        <!-- <div class="background">
          <div class="background-btn" @click="toManagement">后台</div>
        </div> -->
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created(){
    if (window.location.hash == '#/management' && this.$store.state.pageHeadShow) {
      this.$store.commit('pageHeadShowChange')
    }
  },
  data(){
    return{
    }
  },
  methods: {
    toHome(){
      this.$router.replace('/home')
    },
    toCategory(){
      this.$router.replace('/category')
    },
    toPrivate(){
      this.$router.replace({
        path: '/private',
        query: {
          uid: 0
        }
      })
    },
    // toManagement(){
    //   this.$router.push('/management')
    //   if (this.$store.state.pageHeadShow) {
    //     this.$store.commit('pageHeadShowChange')
    //   }
    // },
    logOut(){
      this.$store.commit('getUserInfo', '')
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss">
span{
  display: inline-block;
}
.page-head {
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 850px;
  height: 60px;
  color: #fff;
  background-color: #232a34;
  display: flex;
  z-index: 5;
  .page-head-tags{
    display: flex;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  img{
    height: 50px;
    width: 50px;
  }
}
.logo {
  height: 100%;
  width: 140px;
  padding: 5px 5px 5px 25px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-content: center;
}
.logo-content{
  margin-left: 10px;
  line-height: 50px;
  font-weight: bold;
}
.select{
  width: 50px;
  padding: 0 15px;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  &:hover{
    color: #DDD;
  }
}
.background{
  height: 60px;
  padding: 10px 0;
  box-sizing: border-box;
}
.background-btn{
  padding: 0 20px;
  margin-right: 20px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  background-color: #05a081;
  border-radius: 5px;
  cursor: pointer;
  &:hover{
    background-color: #06b995;
  }
}
</style>
