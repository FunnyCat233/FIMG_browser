<template>
  <div class="login-page">
      <div class="login-page-content">
          <span class="fs36 fw6 mb20">管理员登录</span>
          <el-input v-model="account" placeholder="请输入账号"></el-input>
          <el-input v-model="password" show-password placeholder="请输入密码"></el-input>
          <div class="login-box">
            <div class="login-btn" @click="loginBtn">登录</div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    created(){
        if (this.$store.state.pageHeadShow) {
        this.$store.commit('pageHeadShowChange')
      }
    },
    data(){
        return{
            account: '',
            password: ''
        }
    },
    methods: {
        loginBtn(){
            if (!this.account) {
                this.$message({
                    message: '请输入账号',
                    type: 'error'
                })
            } else if (!this.password) {
                this.$message({
                    message: '请输入密码',
                    type: 'error'
                })
            } else if (this.account == 'admin' && this.password == '123456') {
                this.$router.push('/management')
            } else {
                this.$message({
                    message: '账号或密码错误',
                    type: 'error'
                })
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.login-page{
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('../assets/bg.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    &::after{
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
    }
    .login-page-content{
        width: 485px;
        height: 360px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        background-color: #fff;
        border-radius: 5px;
        box-sizing: border-box;
        z-index: 2;
        .login-box{
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 30px;
          .login-btn{
            width: 300px;
            height: 50px;
            background-color: #05a081;
            border-radius: 6px;
            color: #fff;
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            letter-spacing: 4px;
            cursor: pointer;
          }
        }
        .el-input{
            margin-bottom: 20px;
        }
        /deep/ .el-input__inner{
            border-radius: 0;
            border: none;
            border-bottom: 1px solid #DCDFE6;
            outline: none;
            &:hover{
                border-bottom: 1px solid #C0C4CC;
            }
            &:focus{
                border-bottom: 1px solid #05a081;
            }
        }
    }
}
</style>