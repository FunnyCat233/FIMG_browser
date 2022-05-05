<template>
  <div class="login-page">
    <div class="login-page-head">
      <div class="logo">
        <img src="@/assets/LOGO.png" alt="">
        <span class="logo-content">FIMG</span>
      </div>
      <div class="flex">
        <span class="lh60 fs18 mr20">初次使用FIMG?</span>  
        <div class="background">
          <div class="background-btn" @click="registerDiaShow = true">加入</div>
        </div>
      </div>
    </div>
    <div class="login-page-content">
        <span class="fs36 fw6">欢迎回到FIMG</span>
        <div class="login-page-content-tags">
          <span class="login-page-content-tags-tab" 
          :style="loginTabShow == 1 ? 'border-bottom: 2px solid #05a081; color: #05a081' : ''"
          @click="loginTabShowClick(1)">密码登录</span>
          <span class="login-page-content-tags-tab"
          :style="loginTabShow == 2 ? 'border-bottom: 2px solid #05a081; color: #05a081' : ''"
          @click="loginTabShowClick(2)">验证码登录</span>
       </div>
       <div v-if="loginTabShow == 1">
         <el-input v-model="account" placeholder="请输入账号"></el-input>
         <el-input v-model="password" show-password placeholder="请输入密码"></el-input>
         <div class="w100"><span class="fr cmain pointer" @click="resetPWDiaShow = true">忘记密码？</span></div>
       </div>
       <div v-else>
         <el-input v-model="email" placeholder="请输入邮箱"></el-input>
         <el-input style="width: 250px" v-model="code" placeholder="请输入验证码"></el-input>
         <el-button class="ml10" style="width: 145px" plain :disabled="count < 60" @click="verificationUser">{{ count < 60 ? count + 's后重试' : '获取验证码'}}</el-button>
       </div>
       
       <div class="login-box">
         <div class="login-btn" @click="loginBtn">登录</div>
       </div>
    </div>

    <!-- 注册 -->
    <el-dialog
      title="注册"
      :visible.sync="registerDiaShow"
      width="500px">
      <el-input v-model="reAccount" placeholder="请输入用户名"></el-input>
      <el-input v-model="rePassword" show-password placeholder="请输入密码"></el-input>
      <el-input v-model="rePasswordConfirm" show-password placeholder="请再次输入密码"></el-input>
      <el-input v-model="reEmail" placeholder="请输入邮箱"></el-input>
      <el-input style="width: 305px" v-model="reCode" placeholder="请输入验证码"></el-input>
      <el-button class="ml10" style="width: 145px" plain :disabled="reCount < 60" @click="verificationReUser">{{ reCount < 60 ? reCount + 's后重试' : '获取验证码'}}</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="registerDiaShow = false">取 消</el-button>
        <el-button type="primary" @click="registerBtn">注 册</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="resetPWDiaShow"
      width="500px">
      <el-input v-model="rsEmail" placeholder="请输入邮箱"></el-input>
      <el-input v-model="rsPassword" show-password placeholder="请输入新密码"></el-input>
      <el-input v-model="rsPasswordConfirm" show-password placeholder="请再次输入密码"></el-input>
      <el-input style="width: 305px" v-model="rsCode" placeholder="请输入验证码"></el-input>
      <el-button class="ml10" style="width: 145px" plain :disabled="rsCount < 60" @click="verificationRsUser">{{ rsCount < 60 ? rsCount + 's后重试' : '获取验证码'}}</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPWDiaShow = false">取 消</el-button>
        <el-button type="primary" @click="resetBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Login,
  verificationUser,
  verificationCode,
  getCode
} from '@/api/login_register.js'
import {
  addUser,
  resetPassword
} from '@/api/user.js'
export default {
  created(){
    if (this.$store.state.pageHeadShow) {
        this.$store.commit('pageHeadShowChange')
      }
  },
  data(){
    return{
      loginTabShow: 1,
      account: '',
      password: '',
      email: '',
      code: '',
      count: 60,

      registerDiaShow: false,
      reAccount: '',
      rePassword: '',
      rePasswordConfirm: '',
      reEmail: '',
      reCode: '',
      reCount: 60,

      resetPWDiaShow: false,
      rsEmail: '',
      rsPassword: '',
      rsPasswordConfirm: '',
      rsCode: '',
      rsCount: 60
    }
  },
  methods: {
    loginTabShowClick(e){
      this.account = '',
      this.password = '',
      this.email = '',
      this.code = ''
      this.loginTabShow = e
    },
    loginBtn(){
      if (this.loginTabShow == 1) {
        if (this.account && this.password) {
          this.Login()
        } else {
          this.$message({
            message: '请输入账号或密码',
            type: 'error'
          })
        }
      } else {
        if (this.email) {
          this.verificationCode()
        } else {
          this.$message({
            message: '请输入邮箱',
            type: 'error'
          })
        }
        
      }
    },
    getCode(){
        if (this.registerDiaShow) {
          this.reCount--
          let time = setInterval(() => {
            this.reCount--
            if (this.reCount == 0) {
              clearInterval(time)
              this.reCount = 60
            }
          }, 1000)
        } else if (this.resetPWDiaShow) {
          this.rsCount--
          let time = setInterval(() => {
            this.rsCount--
            if (this.rsCount == 0) {
              clearInterval(time)
              this.rsCount = 60
            }
          }, 1000)
        } else {
          this.count--
          let time = setInterval(() => {
            this.count--
            if (this.count == 0) {
              clearInterval(time)
              this.count = 60
            }
          }, 1000)
        }
        getCode({
          email: this.registerDiaShow ? this.reEmail : this.resetPWDiaShow ? this.rsEmail : this.email
        }).then(res => {

        })
    },
    verificationUser(){
      if (this.email) {
        verificationUser({
          email: this.email
        }).then(res => {
          if (res.data.status == 0) {
            this.getCode()
            this.$message({
              message: '验证码已发送',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.mes,
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '请输入邮箱',
          type: 'error'
        })
      }
      
    },
    verificationReUser(){
      if (this.reIsEmpty()) {
        if (this.rePassword == this.rePasswordConfirm) {
          verificationUser({
            email: this.reEmail
          }).then(res => {
            if (res.data.status == 0 || res.data.status == -1) {
              this.$message({
                message: '该邮箱已注册',
                type: 'error'
              })
            } else {
              this.getCode()
              this.$message({
                message: '验证码已发送',
                type: 'success'
              })
            }
          })
        } else {
          this.$message({
            message: '两次输入的密码不一致，请重新输入',
            type: 'error'
          })
        }
      }
    },
    verificationRsUser(){
      if (this.rsIsEmpty()) {
        if (this.rsPassword == this.rsPasswordConfirm) {
          verificationUser({
            email: this.rsEmail
          }).then(res => {
            if (res.data.status == 0) {
              this.getCode()
              this.$message({
                message: '验证码已发送',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.mes,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '两次输入的密码不一致，请重新输入',
            type: 'error'
          })
        }
      }
    },
    verificationCode(){
      if (this.code) {
        verificationCode({
          email: this.email,
          code: this.code
        }).then(res => {
          if (res.data.status == 0) {
            this.Login()
          } else {
            this.$message({
              message: '登录失败',
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '请输入验证码',
          type: 'error'
        })
      }
      
    },
    reIsEmpty(){
      if (!this.reAccount) {
        this.$message({
          message: '请输入用户名',
          type: 'error'
        })
        return false
      } else if (!this.rePassword) {
        this.$message({
          message: '请输入密码',
          type: 'error'
        })
        return false
      } else if (!this.rePasswordConfirm) {
        this.$message({
          message: '请输入确认密码',
          type: 'error'
        })
        return false
      } else if (!this.reEmail) {
        this.$message({
          message: '请输入邮箱',
          type: 'error'
        })
        return false
      } else {
        return true
      }
    },
    rsIsEmpty(){
      if (!this.rsEmail) {
        this.$message({
          message: '请输入邮箱',
          type: 'error'
        })
        return false
      } else if (!this.rsPassword) {
        this.$message({
          message: '请输入密码',
          type: 'error'
        })
        return false
      } else if (!this.rsPasswordConfirm) {
        this.$message({
          message: '请输入确认密码',
          type: 'error'
        })
        return false
      } else {
        return true
      }
    },
    Login(){
      Login({
        username: this.account,
        password: this.password,
        email: this.email
      }).then(res => {
        if (res.data.status == 0) {
          if (!this.$store.state.pageHeadShow) {
            this.$store.commit('pageHeadShowChange')
          }
          this.$store.commit('getUserInfo', res.data.data[0])
          this.$router.replace('/home')
        } else {
          this.$message({
            message: res.data.mes,
            type: 'error'
          })
        }
      })
    },
    registerBtn(){
      if (this.reCode) {
        verificationCode({
          email: this.reEmail,
          code: this.reCode
        }).then(res => {
          if (res.data.status == 0) {
            addUser({
              username: this.reAccount,
              password: this.rePassword,
              email: this.reEmail
            }).then(res => {
              this.$message({
                message: '注册成功',
                type: 'success'
              })
              this.registerDiaShow = false
            })
          } else {
            this.$message({
              message: '验证码错误',
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '请输入验证码',
          type: 'error'
        })
      }
    },
    resetBtn(){
      if (this.rsCode) {
        verificationCode({
          email: this.rsEmail,
          code: this.rsCode
        }).then(res => {
          if (res.data.status == 0) {
            resetPassword({
              password: this.rsPassword,
              email: this.rsEmail
            }).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.resetPWDiaShow = false
            })
          } else {
            this.$message({
              message: '验证码错误',
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '请输入验证码',
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
    .login-page-head{
        position: fixed;
        width: 100%;
        height: 60px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        z-index: 2;
    }
    /deep/ .login-page-content{
        width: 485px;
        height: 460px;
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
        .login-page-content-tags{
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          margin-bottom: 30px;
          .login-page-content-tags-tab{
            display: flex;
            justify-content: center;
            flex: 1;
            font-size: 17px;
            line-height: 26px;
            font-weight: 600;
            color: #5e5e5e;
            letter-spacing: .4px;
            padding: 1rem;
            cursor: pointer;
            &:hover{
              color: #05a081;
            }
          }
        }
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
</style>