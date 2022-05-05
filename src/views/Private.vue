<template>
  <div class="pt60">
    <div class="private-page-head">
      <div class="private-page-head-mes">
        <span class="fs36 bold">{{ userInfo.username }}</span>
        <div class="mt20 op5">
          <span>{{ userInfo.realname }}  •  Age {{ userInfo.age }}  •  Country/{{ userInfo.country }}</span>
        </div>
        <div class="private-page-head-mes-avater mt20">
          <div class="avater">
            <img :src="userInfo.avatar">
            <!-- <el-image
              style="width: 125px; height: 125px; border-radius: 50%;"
              :src="userInfo.avatar">
              <div slot="placeholder" class="image-slot">
                <div class="img-err"></div>
              </div>
              <div slot="error" class="image-slot">
                <div class="img-err"></div> 
              </div>
            </el-image> -->
          </div>
        </div>
        <div v-if="$route.query.uid != 0" class="mt20">
          <el-button v-if="!isConcern" :disabled="$store.state.userInfo.uid == $route.query.uid" type="primary" round @click="addConcernList()">关 注</el-button>
          <el-button v-else type="primary" round plain @click="delConcernList(userInfo.uid)">取消关注</el-button>
        </div>
      </div>
      <div v-if="$route.query.uid == 0" class="head-btn">
          <el-badge :is-dot="isMes" class="mr20"><span style="margin-right: 0" @click="openMesList()">消息</span></el-badge>
          <span @click="edit()">编辑</span>
          <span @click="upload()">上传</span>
      </div>
    </div>
    <div class="private-page-title">
      <span class="private-page-title-tab" 
      :style="privatePageTitleTabShow == 1 ? 'border-bottom: solid #0064f9; color: #0064f9' : ''"
      @click="privatePageTitleTabShowClick(1)">个人简介</span>
      <span class="private-page-title-tab"
      :style="privatePageTitleTabShow == 2 ? 'border-bottom: solid #0064f9; color: #0064f9' : ''"
      @click="privatePageTitleTabShowClick(2)">已发布</span>
      <span class="private-page-title-tab"
      :style="privatePageTitleTabShow == 3 ? 'border-bottom: solid #0064f9; color: #0064f9' : ''"
      @click="privatePageTitleTabShowClick(3)">收藏</span>
      <span class="private-page-title-tab"
      v-if="$route.query.uid == 0"
      :style="privatePageTitleTabShow == 4 ? 'border-bottom: solid #0064f9; color: #0064f9' : ''"
      @click="privatePageTitleTabShowClick(4)">关注</span>
    </div>
    <div v-if="privatePageTitleTabShow == 1" class="grid">
      <span>{{ userInfo.introduction }}</span>
    </div>
    <div v-if="privatePageTitleTabShow == 2" class="grid media-reactive">
      <div>
        <Masonry v-if="privatePageTitleTabShow == 2" :uid="userInfo.uid" :isDel="this.$route.query.uid == 0 ? 1 : 0" :isAllowDownLoad="this.$route.query.uid == 0 ? true : false"></Masonry>
      </div>
    </div>
    <div v-if="privatePageTitleTabShow == 3" class="grid media-reactive">
      <div>
        <Masonry v-if="privatePageTitleTabShow == 3" :likeUid="userInfo.uid"></Masonry>
      </div>
    </div>
    <div v-if="privatePageTitleTabShow == 4" class="grid">
      <div>
        <div v-for="item in userList" :key="item.username" class="search-user-box">
          <div class="item-avatar">
            <img :src="item.avatar" alt="">
          </div>
          <div class="item-username">
            <span class="bold mr20 pointer" style="width: 50px" @click="toUserPage(item.uid)">{{ item.username }}</span>
            <el-button type="primary" round plain @click="delConcernList(item.uid)">取消关注</el-button>
          </div>
          <div class="item-user-introduction">{{ item.introduction }}</div>
        </div>
        <div v-if="userList.length == 0" class="tac">暂无数据</div>
      </div>
    </div>
    <!-- 编辑用户信息 -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editShow"
      width="600px"
      class="edit-dialog">
      <div class="flex mb20">
        <div class="form-label">用户名：</div>
        <el-input v-model="editUserInfo.username" placeholder="请输入内容"></el-input>
      </div>
      <div class="flex mb20">
        <div class="form-label">头像：</div>
        <div v-if="editUserInfo.avatar" class="edit-dialog-avatar">
          <img :src="editUserInfo.avatar">
        </div>
        <el-button v-if="editUserInfo.avatar" size="small" style="height: 36px; margin-top: 112px; margin-left: 15px" @click="changeImg">更换</el-button>
        <el-upload
          v-if="!editUserInfo.avatar"
          ref="upload"
          action="http://localhost:8000/api/img/uploadImg"
          list-type="picture-card"
          :on-success="upLoadSuccess"
          :show-file-list="false">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div class="flex mb20">
        <div class="form-label">真实姓名：</div>
        <el-input v-model="editUserInfo.realname" placeholder="请输入内容"></el-input>
      </div>
      <div class="flex mb20">
        <div class="form-label">年龄：</div>
        <el-input v-model="editUserInfo.age" placeholder="请输入内容"></el-input>
      </div>
      <div class="flex mb20">
        <div class="form-label">简介：</div>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="editUserInfo.introduction"
          maxlength="150"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 5}"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="updateBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传图片 -->
    <el-dialog
      title="上传图片"
      :visible.sync="uploadShow"
      width="600px"
      class="edit-dialog">
      <div class="flex mb20">
        <div class="form-label">图片名称：</div>
        <el-input v-model="uploadImgInfo.imgName" placeholder="请输入内容"></el-input>
      </div>
      <div class="flex mb20">
        <div class="form-label">图片：</div>
        <div v-if="uploadImgInfo.imgSrc" class="edit-dialog-avatar">
          <img :src="uploadImgInfo.imgSrc">
        </div>
        <el-button v-if="uploadImgInfo.imgSrc" size="small" style="height: 36px; margin-top: 112px; margin-left: 15px" @click="changeImg">更换</el-button>
        <el-upload
          v-if="!uploadImgInfo.imgSrc"
          action="http://localhost:8000/api/img/uploadImg"
          list-type="picture-card"
          :on-success="upLoadSuccess"
          :show-file-list="false">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div class="flex mb20">
        <div class="form-label">分类：</div>
        <el-select v-model="uploadImgInfo.category" placeholder="请选择">
          <el-option
            v-for="item in categoryList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="flex mb20">
        <div class="form-label">简介：</div>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="uploadImgInfo.introduction"
          maxlength="150"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 5}"
        ></el-input>
      </div>
      <div class="flex mb20">
        <div class="form-label">是否允许下载：</div>
        <el-switch
          v-model="uploadImgInfo.allowDownload"
          style="margin-top: 10px;">
        </el-switch>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadShow = false">取 消</el-button>
        <el-button type="primary" @click="updateBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 消息列表 -->
    <el-dialog
      title="消息列表"
      :visible.sync="mesShow"
      width="800px">
      <div class="mes-list-box">
        <div class="mes-list-box-left">
          <div class="mes-list-box-left-item" :class="mesListLeftSelect == 0 ? 'left-item-select' : ''" @click="leftItemSelect(0)">待审核</div>
          <div class="mes-list-box-left-item" :class="mesListLeftSelect == 1 ? 'left-item-select' : ''" @click="leftItemSelect(1)">已通过</div>
          <div class="mes-list-box-left-item" :class="mesListLeftSelect == 2 ? 'left-item-select' : ''" @click="leftItemSelect(2)">已拒绝</div>
          <div class="mes-list-box-left-item" :class="mesListLeftSelect == 3 ? 'left-item-select' : ''" @click="leftItemSelect(3)">通知</div>
        </div>
        <div class="mes-list-box-right">
          <div v-for="item in mesShowList" :key="item.aid" class="mes-list-box-right-item">
            <div>{{ item.status == 0 || item.status == 3 || item.status == 4 ? item.startTime : item.endTime }}</div>
            <el-card :body-style="{ padding: '0px' }">
              <div class="flex"><img :src="item.imgSrc"></div>
              <div style="padding: 15px;">
                <span>{{ item.imgName }}</span>
                <el-divider direction="vertical"/>
                <span>{{ item.category }}</span>
                <el-divider/>
                <div class="flex-jsb">
                  <el-button style="padding: 0" type="text" @click="mesDetail(item)">查看更多</el-button>
                  <span v-if="item.status == 3" class="cf5">该作品已被下架</span>
                  <span v-if="item.status == 4" class="c67">该作品已被上架</span>
                </div>
              </div>
            </el-card>
            <div class="w100 tar cblue mt5" :style="item.isRead ? 'color: #909399' : ''">{{ item.isRead ? '已读' : '未读' }}</div>
          </div>
          <div v-if="mesShowList.length == 0" class="tac">暂无数据</div>
        </div>
      </div>
      <el-dialog
        width="500px"
        :title="mesImgInfo.imgName"
        :visible.sync="mesDetailShow"
        append-to-body>
        <div class="mes-detail-box">
          <div class="img-box mb20">
            <div class="img-src">
              <img :src="mesImgInfo.imgSrc">
            </div>
          </div>
          <div>
            <div class="lh24">
              <span class="bold">所属用户：</span>
              {{ mesImgInfo.username }}
            </div>
            <div class="lh24">
              <span class="bold">分类：</span>
              {{ mesImgInfo.category }}
            </div>
            <div class="lh24">
              <span class="bold">是否允许下载：</span>
              {{ mesImgInfo.allowDownload ? '允许' : '不允许' }}
            </div>
            <div class="lh24">
              <span class="bold">状态：</span>
              {{ statusList[mesImgInfo.status] }}
            </div>
            <div class="lh24">
              <span class="bold">处理时间：</span>
              {{ mesImgInfo.endTime ? mesImgInfo.endTime : mesImgInfo.startTime }}
            </div>
            <div class="lh24">
              <span class="bold">简介：</span>
              {{ mesImgInfo.introduction }}
            </div>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import Masonry from '@/components/Masonry'
import moment from 'moment'

import {
  getUserList,
  updateUserList
} from '@/api/user.js'
import {
  addAuditList,
  getAuditList,
  readAuditMes
} from '@/api/audit.js'
import {
  getConcernList,
  addConcernList,
  delConcernList,
  getConcernUserList
} from '@/api/concern.js'

export default {
  components: { Masonry },
  created(){
    this.privatePageTitleTabShow = 1
    if (this.$route.query.uid != 0) {
      getUserList({
          uid: this.$route.query.uid,
          status: 0
      }).then(res => {
          this.userInfo = res.data.data[0]
          this.getConcernList()
      })
    } else {
      this.userInfo = this.$store.state.userInfo
      this.getAuditList()
    }
  },
  watch: {
    '$route' (to, from) {
      this.privatePageTitleTabShow = 1
      if (this.$route.query.uid != 0) {
      getUserList({
          uid: this.$route.query.uid,
          status: 0
      }).then(res => {
          this.userInfo = res.data.data[0]
          this.getConcernList()
      })
    } else {
      this.userInfo = this.$store.state.userInfo
      this.getAuditList()
    }
    }
  },
  data() {
    return {
      privatePageTitleTabShow: 1,
      categoryList: ['游戏', '动漫', '美女', '风景', '植物', '汽车'],
      userInfo: {},
      editUserInfo: {},
      editShow: false,
      uploadImgInfo: {
        imgName: '',
        imgSrc: '1',
        category: '',
        introduction: ''
      },
      uploadShow: false,

      isMes: false,
      mesShow: false,
      mesDetailShow: false,
      mesListLeftSelect: 0,
      mesList: [],
      mesShowList: [],
      mesImgInfo: {},
      statusList: {
        '0': '待审核',
        '1': '已通过',
        '2': '已拒绝',
        '3': '已下架',
        '4': '已上架'
      },
      
      isConcern: false,
      userList: []
    }
  },
  methods: {
    privatePageTitleTabShowClick(e){
      this.privatePageTitleTabShow = e
      if (e == 4) {
        getConcernUserList({
          puid: this.$store.state.userInfo.uid
        }).then(res => {
          this.userList = res.data.data
        })
      }
    },
    edit() {
      this.editUserInfo = JSON.parse(JSON.stringify(this.userInfo))
      this.editShow = true
    },
    upload(){
      this.uploadImgInfo = {
        imgName: '',
        imgSrc: '',
        category: '',
        introduction: '',
        allowDownload: true
      }
      this.uploadShow = true
    },
    openMesList(){
      this.mesShow = true
    },
    upLoadSuccess(res, file, fileList){
      console.log(file);
      if (this.editShow) {
        this.editUserInfo.avatar = res.data
        this.editUserInfo.imgFileName = res.imgFileName
      } else {
        this.uploadImgInfo.imgSrc = res.data
        this.uploadImgInfo.imgFileName = res.imgFileName
      }
    },
    changeImg(){
      if (this.editShow) {
        this.editUserInfo.avatar = ''
      } else {
        this.uploadImgInfo.imgSrc = ''
      }
    },
    updateBtn(){
      if (this.editShow) {
        this.updateUserList()
      } else {
        if (!this.uploadImgInfo.imgName) {
          this.$message({
            message: '请输入图片名称',
            type: 'error'
          })
        } else if (!this.uploadImgInfo.imgSrc) {
          this.$message({
            message: '请上传图片',
            type: 'error'
          })
        } else if (!this.uploadImgInfo.category) {
          this.$message({
            message: '请选择图片分类',
            type: 'error'
          })
        } else if (!this.uploadImgInfo.introduction) {
          this.$message({
            message: '请输入图片简介',
            type: 'error'
          })
        } else {
          this.addAuditList()
        }
        
      }
    },
    mesDetail(e){
      this.readAuditMes(e.aid)
      this.mesImgInfo = e
      this.mesDetailShow = true
    },
    updateUserList(){
      updateUserList({
        uid: this.userInfo.uid,
        username: this.editUserInfo.username,
        avatar: this.editUserInfo.avatar,
        realname: this.editUserInfo.realname,
        age: this.editUserInfo.age,
        introduction: this.editUserInfo.introduction,
        imgFileName: this.editUserInfo.imgFileName
      }).then(res => {
        if (res.data.status == 0) {
          this.getUserList()
        }
      })
    },
    getUserList(){
      getUserList({
        uid: this.userInfo.uid,
        status: 0
      }).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$store.commit('getUserInfo', res.data.data[0])
        this.userInfo = this.$store.state.userInfo
        this.editShow = false
      })
    },
    addAuditList(){
      addAuditList({
        uid: this.userInfo.uid,
        imgName: this.uploadImgInfo.imgName,
        imgSrc: this.uploadImgInfo.imgSrc,
        category: this.uploadImgInfo.category,
        introduction: this.uploadImgInfo.introduction,
        imgFileName: this.uploadImgInfo.imgFileName,
        startTime: moment().format('YYYY-MM-DD HH:mm'),
        allowDownload: this.uploadImgInfo.allowDownload ? 1 : 0,
        status: 0
      }).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.getAuditList()
        this.uploadShow = false
      })
    },
    getAuditList(){
      getAuditList({
        uid: this.userInfo.uid
      }).then(res => {
        this.mesList = res.data.data
        if (this.mesListLeftSelect == 3) {
          this.mesShowList = this.mesList.filter(n => {
            return n.status == 3 || n.status == 4
          })
          this.mesShowList = this.bubbleSort(this.mesShowList, 0)
        } else {
          this.mesShowList = this.mesList.filter(n => {
            return n.status == this.mesListLeftSelect
          })
          this.mesShowList = this.bubbleSort(this.mesShowList, this.mesListLeftSelect == 0 ? 0 : 1)
        }
        this.isMes = false
        this.mesList.forEach(e => {
          if(e.isRead == 0) this.isMes = true
        })
      })
    },
    readAuditMes(aid){
      readAuditMes({
        aid
      }).then(res => {
        this.getAuditList()
      })
    },
    leftItemSelect(e){
      this.mesListLeftSelect = e
      if (e == 3) {
        this.mesShowList = this.mesList.filter(n => {
          return n.status == 3 || n.status == 4
        })
        this.mesShowList = this.bubbleSort(this.mesShowList, 0)
      } else {
        this.mesShowList = this.mesList.filter(n => {
          return n.status == e
        })
        this.mesShowList = this.bubbleSort(this.mesShowList, e == 0 ? 0 : 1)
      }
    },
    bubbleSort(arr, type){
      if (arr.length == 0 || arr.length == 1) {
        return arr
      }
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (type == 0 ? arr[j].startTime < arr[j + 1].startTime : arr[j].endTime < arr[j + 1].endTime) {
            let temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    },
    getConcernList(){
      getConcernList({
        puid: this.$store.state.userInfo.uid,
        muid: this.userInfo.uid
      }).then(res => {
        if (res.data.data.length == 1) {
          this.isConcern = true
        } else {
          this.isConcern = false
        }
      })
    },
    addConcernList(){
      addConcernList({
        puid: this.$store.state.userInfo.uid,
        muid: this.userInfo.uid
      }).then(res => {
        if (res.data.status == 0) {
          this.$message({
            message: res.data.mes,
            type: 'success',
            duration: '1000'
          })
          this.getConcernList()
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
            type: 'success',
            duration: '1000'
          })
          if (this.$route.query.uid != 0) {
            this.getConcernList()
          } else {
            getConcernUserList({
              puid: this.$store.state.userInfo.uid
            }).then(res => {
              this.userList = res.data.data
            })
          }
        }
      })
    },
    toUserPage(uid){
      this.$router.replace({
          path: '/private',
          query: {
              uid
          }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.private-page-head{
  width: 100%;
  height: 340px;
  display: flex;
  justify-content: center;
  position: relative;
  background: url('../assets/private_bg.jpeg');
  color: #fff;
  .private-page-head-mes{
    width: 800px;
    height: 100%;
    padding: 1.25rem 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 3;
    .private-page-head-mes-avater{
      width: 130px;
      height: 130px;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      .avater{
        width: 125px;
        height: 125px;
        border-radius: 50%;
        img{
          width: 125px;
          height: 125px;
          border-radius: 50%;
        }
        .image-slot{
          width: 125px;
          height: 125px;
          border-radius: 50%;
        }
        .img-err{
          width: 125px;
          height: 125px;
          border-radius: 50%;
          background-color: #DCDFE6;
        }
      }
    }
  }
  .head-btn{
    position: absolute;
    right: 0;
    bottom: 20px;
    display: flex;
    z-index: 3;
    span{
      margin-right: 20px;
      color: #fff;
      cursor: pointer;
      opacity: .5;
      font-size: 18px;
      &:hover{
        opacity: 1;
      }
    }
  }
  &::after{
    content: '';
    height: 100%;
    width:100%;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(2px);
    // z-index: 2;
    // background: rgba(0,0,0,0.5);
  }
}
.private-page-title{
  height: 60px;
  display: block;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0,0,0, 0.2);
  margin-bottom: 2rem;
  .private-page-title-tab{
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
.edit-dialog{
  .edit-dialog-avatar{
    width: 148px;
    height: 148px;
    border-radius: 6px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    img{
      width: 148px;
      height: 148px;
      border-radius: 6px;
    }
  }
  .el-input{
    width: 300px;
  }
  .el-select{
    width: 300px;
  }
}
.mes-list-box{
  display: flex;
  box-sizing: border-box;
  .mes-list-box-left{
    width: 100px;
    min-width: 100px;
    height: 100%;
    color: #303133;
    box-sizing: border-box;
    line-height: 55px;
    border-right: 1px solid #eaeefb;
    .mes-list-box-left-item{
      width: 100%;
      height: 55px;
      box-sizing: border-box;
      padding: 0 20px;
      cursor: pointer;
      text-align: center;
      &:hover{
        background-color: #F2F6FC;
      }
    }
  }
  .mes-list-box-right{
    width: 100%;
    height: 800px;
    padding: 20px 0;
    background-color: #E4E7ED;
    box-sizing: border-box;
    overflow-y: scroll;
    .mes-list-box-right-item{
      width: 300px;
      margin: 0 auto;
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .el-card{
      width: 100%;
      margin-top: 5px;
      border-radius: 15px;
      .el-divider--horizontal{
        margin: 10px 0;
      }
      img{
        width: 100%;
      }
    }
  }
  .left-item-select{
    color: #606266 !important;
    background-color: #F2F6FC !important;
  }
}
.mes-detail-box{
  .img-box{
    width: 100%;
    height: 300px;
    background-color: #EBEEF5;
    display: flex;
    justify-content: center;
    align-items: center;
    .img-src{
      max-width: 100%;
      max-height: 300px;
      img{
        width: 100%;
        max-height: 300px;
      }  
    }
  }
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