<template>
  <div>
    <div class="management-page-head">
      <div class="flex">
        <div class="logo">
          <img src="@/assets/LOGO.png" alt="">
          <span class="logo-content">FIMG</span>
        </div>
        <div class="lh60 fs22 ml60">后台管理系统</div>
      </div>
      <!-- <div class="background">
        <div class="background-btn" @click="toHome">首页</div>
      </div> -->
    </div>
    <div class="management-page-content">
      <div class="management-page-left">
        <div class="management-page-left-item" :class="leftItem == 1 ? 'left-item-select' : ''" @click="leftItemSelect(1)">
          <i class="el-icon-user fs18"/>
          <span class="ml15">用户列表</span>
        </div>
        <div class="management-page-left-item" :class="leftItem == 2 ? 'left-item-select' : ''" @click="leftItemSelect(2)">
          <i class="el-icon-picture-outline fs18"/>
          <span class="ml15">图片列表</span>
        </div>
        <div class="management-page-left-item" :class="leftItem == 3 ? 'left-item-select' : ''" @click="leftItemSelect(3)">
          <i class="el-icon-view fs18"/>
          <span class="ml15">审核列表</span>
        </div>
      </div>
      <div class="management-page-right">
        <div v-if="leftItem == 1 || leftItem == 2"  class="management-page-right-search">
          <div>
            <el-input v-model="IDSearch" placeholder="请输入ID"></el-input>
            <el-input v-model="nameSearch" :placeholder="leftItem == 1 ? '请输入用户名' : '请输入图片名称'" class="ml20"></el-input>
            <el-input v-if="leftItem == 2" v-model="categorySearch" placeholder="请输入图片分类" class="ml20"></el-input>
            <el-input v-if="leftItem == 2" v-model="uidSearch" placeholder="请输入用户ID" class="ml20"></el-input>
          </div>
          <div>
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" @click="tableDataSearch">查询</el-button>
          </div>
        </div>
        <div class="management-page-right-table">
           <el-table
            v-if="leftItem == 1 || leftItem == 2" 
            :data="tableData"
            border
            style="width: 100%"
            height="550">
            <el-table-column
              :prop="leftItem == 1 ? 'uid' : 'pid'"
              label="ID"
              width="50"
              fixed="left">
            </el-table-column>
            <el-table-column
              :prop="leftItem == 1 ? 'username' : 'imgName'"
              :label="leftItem == 1 ? '用户名' : '图片名称'"
              width="180">
            </el-table-column>
            <el-table-column
              :label="leftItem == 1 ? '头像' : '图片'"
              width="120px"
              align="center">
              <template slot-scope="scope">
                <img v-if="leftItem == 1" :src="scope.row.avatar" width="50" height="50">
                <img v-else :src="scope.row.imgSrc" width="50" height="50">
              </template>
            </el-table-column>
            <el-table-column
              :prop="leftItem == 1 ? 'realname' : 'username'"
              :label="leftItem == 1 ? '真实姓名' : '所属用户'"
              width="120px">
            </el-table-column>
            <el-table-column
              :prop="leftItem == 1 ? 'pnumber' : 'category'"
              :label="leftItem == 1 ? '作品数量' : '分类'"
              width="80px">
            </el-table-column>
            <el-table-column
              :label="leftItem == 1 ? '用户简介' : '图片简介'"
              min-width="200px">
              <template slot-scope="scope">
                <el-tooltip class="item" placement="top">
                  <div slot="content" style="max-width: 600px">
                    {{ scope.row.introduction ? scope.row.introduction : '无内容' }}
                  </div>
                  <div class="table-introduction">
                    {{ scope.row.introduction }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              :prop="leftItem == 1 ? 'age' : 'like'"
              :label="leftItem == 1 ? '年龄' : '点赞数量'"
              width="80px">
            </el-table-column>
            <el-table-column
              label="状态"
              width="80">
              <template slot-scope="scope">
                <span v-if="leftItem == 1">{{ scope.row.status == 0 ? '正常' : '停用' }}</span>
                <span v-else>{{ scope.row.isDel == 0 ? '未删除' : '已删除' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="leftItem == 1 ? '邮箱' : '上下架信息'"
              :width="leftItem == 1 ? '200' : '120'">
              <template slot-scope="scope">
                <span v-if="leftItem == 1">{{ scope.row.email }}</span>
                <span v-else>{{ scope.row.shelve == 1 ? '已上架' : '已下架' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="leftItem == 1 ? '国家' : '是否封禁'"
              width="120px">
              <template slot-scope="scope">
                <span v-if="leftItem == 1">{{ scope.row.country }}</span>
                <span v-else>{{ scope.row.isBan == 1 ? '是' : '否' }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              v-if="leftItem == 2"
              label="是否允许下载"
              width="120px">
              <template slot-scope="scope">
                <div class="table-introduction">
                  {{ scope.row.allowDownload == 1 ? '允许' : '不允许' }}
                </div>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="160" fixed="right">
              <template slot-scope="scope">
                <div v-if="leftItem == 1">
                  <el-button
                    v-if="scope.row.status == 0"
                    size="mini"
                    type="success" @click="delList(1, scope.row.uid)">封禁</el-button>
                  <el-button
                    v-else
                    size="mini"
                    type="danger" @click="delList(2, scope.row.uid)">解封</el-button>
                </div>
                <div v-else>
                  <el-button
                    v-if="scope.row.shelve == 1"
                    size="mini"
                    type="success" :disabled="scope.row.isDel == 1 || scope.row.isBan == 1" @click="delList(3, scope.row)">下架</el-button>
                  <el-button
                    v-else
                    size="mini"
                    type="danger" @click="delList(4, scope.row)">上架</el-button>
                  <el-button
                    size="mini"
                    type="danger" 
                    :disabled="scope.row.isDel == 0 && scope.row.isBan == 0 && scope.row.shelve == 1"
                    @click="delList(5, scope.row)">清除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="total > 0 && (leftItem == 1 || leftItem == 2)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :current-page="pageIndex"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <el-collapse v-if="leftItem == 3" accordion>
            <el-radio-group v-model="auditRadio" @change="auditRadioChange">
              <el-radio-button :label="0">待审核</el-radio-button>
              <el-radio-button :label="1">已审核</el-radio-button>
              <el-radio-button :label="2">已拒绝</el-radio-button>
            </el-radio-group>
            <el-collapse-item v-for="item in auditShowList" :key="item.aid">
              <template slot="title">
                <span class="mr20">{{ auditRadio == 0 ? item.startTime : item.endTime }}</span>
                {{ '用户：' + item.username}}
              </template>
              <div class="audit-box-item">
                <div class="audit-box-item-img mr20">
                  <el-image
                    style="max-width: 200px; max-height: 200px"
                    :src="item.imgSrc"/>
                </div>
                <div class="flexc-jcsb">
                  <div>
                    <div>
                      <span class="bold">图片名称：</span>{{ item.imgName }}
                      <span class="bold ml20">分类：</span>{{ item.category }}
                      <span class="bold ml20">是否允许下载：</span>{{ item.allowDownload ? '允许' : '不允许' }}
                    </div>
                    <div class="audit-box-item-intro">
                      <span class="bold">简介：</span> 
                      {{ item.introduction }}
                    </div>
                  </div>
                  <div v-if="auditRadio == 0">
                    <el-button type="primary" @click="auditPass(item)">通过</el-button>
                    <el-button type="danger" @click="auditNoPass(item)">拒绝</el-button>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <div v-if="auditShowList.length == 0" class="tac mt20 mb20">暂无数据</div>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import moment from 'moment'
import {
  getUserList,
  delUserList,
  reopenUserList
} from '@/api/user.js'
import {
  getImgList,
  shelveImgList,
  unShelveImgList,
  clearImgList,
  addImgList
} from '@/api/img.js'

import {
  addAuditList,
  getAuditList,
  updateAuditList
} from '@/api/audit.js'

export default {
  created(){
    this.getUserList()
  },
  data(){
    return{
      leftItem: 1,
      IDSearch: '',
      nameSearch: '',
      categorySearch: '',
      uidSearch: '',
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      auditRadio: 0,
      auditList: [],
      auditShowList: [],
      codeList: {
        '1': '是否封禁该用户账号',
        '2': '是否解封该用户账号',
        '3': '是否下架该作品',
        '4': '是否上架该作品',
        '5': '是否清除该作品，此操作将永久删除图片'
      }
    }
  },
  methods: {
    leftItemSelect(e){
      this.leftItem = e
      this.IDSearch = ''
      this.nameSearch = ''
      this.categorySearch = ''
      this.uidSearch = ''
      this.pageIndex = 1
      this.pageSize = 10
      if (e == 1) {
        this.getUserList()
      } else if (e == 2) {
        this.getImgList()
      } else {
        this.getAuditList()
      }
    },
    resetSearch(){
      this.IDSearch = ''
      this.nameSearch = ''
      this.categorySearch = ''
      this.uidSearch = ''
      this.pageIndex = 1
      this.pageSize = 10
      if (this.leftItem == 1) {
        this.getUserList()
      } else {
        this.getImgList()
      }
      
    },
    tableDataSearch(){
      if (this.leftItem == 1) {
        this.getUserList()
      } else {
        this.getImgList()
      }
    },
    auditRadioChange(e){
      this.auditShowList = this.auditList.filter(n => {
        return n.status == e
      })
    },
    getAuditList(){
      getAuditList().then(res => {
        this.auditList = res.data.data
        this.auditShowList = this.auditList.filter(n => {
          return n.status == this.auditRadio
        })
      })
    },
    auditPass(e){
      addImgList({
        uid: e.uid,
        imgName: e.imgName,
        imgSrc: e.imgSrc,
        category: e.category,
        introduction: e.introduction,
        imgFileName: e.imgFileName,
        allowDownload: e.allowDownload
      }).then(res => {
        this.updateAuditList({
          aid: e.aid,
          status: 1,
          isRead: 0,
          endTime: moment().format('YYYY-MM-DD HH:mm')
        })
      })
    },
    auditNoPass(e){
      this.updateAuditList({
        aid: e.aid,
        status: 2,
        isRead: 0,
        endTime: moment().format('YYYY-MM-DD HH:mm')
      })
    },
    updateAuditList(data){
      updateAuditList(data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getAuditList()
      })
    },
    getUserList(){
      getUserList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          uid: this.IDSearch,
          username: this.nameSearch,
          status: 1
        }).then(res => {
        this.total = res.data.total
        this.tableData = res.data.data
      })
    },
    delUserList(uid){
      delUserList({
        uid
      }).then(res => {
        this.getUserList()
        this.$message({
          message: '封禁成功',
          type: 'success'
        })
      })
    },
    reopenUserList(uid){
      reopenUserList({
        uid
      }).then(res => {
        this.getUserList()
        this.$message({
          message: '解封成功',
          type: 'success'
        })
      })
    },
    getImgList(){
      getImgList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          pid: this.IDSearch,
          imgName: this.nameSearch,
          category: this.categorySearch,
          uid: this.uidSearch,
          manager: 1,
        }).then(res => {
        this.total = res.data.total
        this.tableData = res.data.data
      })
    },
    unShelveImgList(pid, uid){
      unShelveImgList({
        pid,
        uid
      }).then(res => {
        this.getImgList()
        this.$message({
          message: '下架成功',
          type: 'success'
        })
      })
    },
    shelveImgList(pid, uid){
      shelveImgList({
        pid,
        uid
      }).then(res => {
        this.getImgList()
        this.$message({
          message: '上架成功',
          type: 'success'
        })
      })
    },
    clearImgList(pid){
      clearImgList({
        pid
      }).then(res => {
        this.getImgList()
        this.$message({
          message: '清除成功',
          type: 'success'
        })
      })
    },
    delList(code, data){
      this.$confirm(`${this.codeList[code]}`, '提示').then(() => {
        switch (code) {
          case 1:
            this.delUserList(data)
            break;
          case 2:
            this.reopenUserList(data)
            break;
          case 3:
            this.unShelveImgList(data.pid, data.uid)
            this.addAuditList(data, 3)
          break;
          case 4:
            this.shelveImgList(data.pid, data.uid)
            this.addAuditList(data, 4)
          break;
          case 5:
            this.clearImgList(data.pid)
          break;
          default:
            break;
        }
      })
    },
    addAuditList(data, status){
      addAuditList({
        uid: data.uid,
        imgName: data.imgName,
        imgSrc: data.imgSrc,
        category: data.category,
        introduction: data.introduction,
        imgFileName: status == 3 ? '下架图片' : '上架图片',
        startTime: moment().format('YYYY-MM-DD HH:mm'),
        allowDownload: data.allowDownload,
        status
      }).then(res => {})
    },
    handleCurrentChange(e){
      this.pageIndex = e
      if (this.leftItem == 1) {
        this.getUserList()
      } else {
        this.getImgList()
      }
      
    },
    handleSizeChange(e){
      this.pageSize = e
      if (this.leftItem == 1) {
        this.getUserList()
      } else {
        this.getImgList()
      }
    },
    // toHome(){
    //   if (!this.$store.state.pageHeadShow) {
    //     this.$store.commit('pageHeadShowChange')
    //   }
    //   this.$router.push('/home')
    // }
  }
}
</script>

<style lang="scss" scoped>

.management-page-head{
  position: fixed;
  width: 100%;
  height: 60px;
  color: #fff;
  background-color: #232a34;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  .logo {
    height: 100%;
    width: 140px;
    padding: 5px 5px 5px 25px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-content: center;
    .logo-content{
    margin-left: 10px;
    line-height: 50px;
    font-weight: bold;
    }
  }
}
.management-page-content{
  display: flex;
  box-sizing: border-box;
  padding-top: 60px;
  .management-page-left{
    width: 200px;
    min-width: 200px;
    height: 100%;
    color: #303133;
    box-sizing: border-box;
    line-height: 55px;
    box-shadow: 1px 0px 5px #b4b6bb;
    z-index: 999;
    .management-page-left-item{
      width: 100%;
      height: 55px;
      box-sizing: border-box;
      padding: 0 20px;
      cursor: pointer;
      &:hover{
        background-color: #F2F6FC;
      }
    }
  }
  .management-page-right{
    width: 100%;
    min-width: 800px;
    background-color: #E4E7ED;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .management-page-right-search{
      width: 100%;
      height: 80px;
      min-height: 80px;
      min-width: 940px;
      display: flex;
      justify-content: space-between;
      padding: 20px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 1px 1px 5px #b4b6bb;
      margin-bottom: 20px;
      .el-input{
        width: 160px;
      }
    }
    .management-page-right-table{
      width: 100%;
      height: 100%;
      min-width: 940px;
      padding: 20px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 1px 1px 5px #b4b6bb;
      .table-introduction{
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-collapse{
        border-top: 0;
        .audit-box-item{
          margin-top: 5px;
          display: flex;
          .audit-box-item-img{
            width: 200px;
            height: 200px;
            min-width: 200px;
            background-color: #EBEEF5;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .audit-box-item-intro{
            width: 100%;
            height: 120px;
            word-break: break-all;
            word-wrap: break-word;
          }
        }
      }
    }
  }
}

.left-item-select{
  color: #606266 !important;
  background-color: #F2F6FC !important;
}
</style>