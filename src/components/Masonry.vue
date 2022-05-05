<template>
  <div>
    <div class="MContent">
        <div v-for="(item, index) in imgList" :key="index" class="MColumn">
            <div v-for="(item, i) in imgList[index]" :key="i" class="MImgContent" @mouseenter="focusLike(imgList[index][i].imgSrc)" @mouseleave="focusBtn=''">
                <div v-if="focusBtn == imgList[index][i].imgSrc" class="img-like">
                    <div>
                        <i class="el-icon-picture-outline cdc un-like" @click="openImgMesDia(imgList[index][i])"/>
                        <i v-if="isDel" class="el-icon-delete cdc ml5 un-like" @click="delImg(imgList[index][i].pid, imgList[index][i].uid)"/>
                    </div>
                    <i v-if="imgList[index][i].isLike" class="el-icon-star-on cf5 pointer is-like" @click="delLike(imgList[index][i].lid)"/>
                    <i v-else class="el-icon-star-off cdc un-like" @click="addLike(imgList[index][i].pid)"/>
                </div>
                <el-image
                    style="width: 100%; height: 100%"
                    :src="imgList[index][i].imgSrc"
                    :preview-src-list="imgPreList">
                    <div slot="placeholder" class="image-slot">
                        <div class="Loading" :style="'background-color:' + preColor[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 4)]">
                        </div>
                    </div>
                    <div slot="error" class="image-slot">
                        <div class="Loading" :style="'background-color:' + errColor">
                        </div>
                    </div>
                </el-image>
            </div>
        </div>
    </div>
    <div v-if="!imgList[0].length" class="tac">
        暂无数据
    </div>

    <!-- 图片详情 -->
    <el-dialog
        :title="imgMes.imgName || '未命名'"
        :visible.sync="imgMesShow"
        width="90%">
        <div class="img-mes-dia grid media-reactive-dia">
            <div class="img-mes-dia-content">
                <div class="img-box">
                    <div class="img-src">
                        <img :src="imgMes.imgSrc">
                    </div>
                </div>
                <div class="img-mes">
                    <div class="img-mes-top">
                        <div class="user-info pointer" @click="toUserPage(userInfo.uid)">
                            <div class="avater">
                                <el-image
                                style="width: 80px; height: 80px; border-radius: 50%;"
                                :src="userInfo.avatar">
                                    <div slot="placeholder" class="image-slot">
                                        <div class="img-err"></div>
                                    </div>
                                    <div slot="error" class="image-slot">
                                        <div class="img-err"></div> 
                                    </div>
                                </el-image>
                            </div>
                            <div class="flex-c">
                                <div class="fs26 bold flex1">{{ userInfo.username }}</div>
                                <div class="fs16 light flex1">{{ userInfo.age }}</div>
                            </div>
                        </div>
                        <div class="flex mt20">
                            <div class="background flex1">
                                <div class="background-btn">100人点赞</div>
                            </div>
                            <div class="background flex1">
                                <div class="background-btn" @click="imgMesIsLike(imgMes)">{{ imgMes.isLike ? '已点赞' : '点赞' }}</div>
                            </div>
                        </div>
                        <div class="pr20 mt20">
                            <el-button style="width: 100%" :disabled="!imgMes.allowDownload" @click="download(imgMes.imgSrc, imgMes.username)">{{ !imgMes.allowDownload ? '不可下载' : '免费下载' }}</el-button>
                        </div>
                        <div v-if="isAllowDownLoad" class="mt20">
                            <span class="bold">是否允许下载：</span>
                            <el-switch
                                v-model="imgMes.allowDownload"
                                @change="switchAllowDownload(imgMes.allowDownload, imgMes.pid)">
                            </el-switch>
                        </div>
                        
                    </div>
                    <div class="img-mes-bottom">{{ imgMes.introduction }}</div>
                </div>
            </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getImgList,
  delImgList,
  updateImgAllowDownload
} from '@/api/img.js'
import {
  getUserList
} from '@/api/user.js'
import {
  getLikeList,
  getPrivateLikeList,
  addLikeList,
  delLikeList
} from '@/api/like.js'
import {
  getConcernImgList
} from '@/api/concern.js'
import colorList from '@/assets/json/colors.json'
export default {
    watch: {
        category(newValue, oldValue){
            this.pageIndex = 1
            this.getImgList()
        },
        uid(newValue, oldValue){
            if (window.location.hash.includes('#/private') && this.uid) {
              this.pageIndex = 1
              this.getImgList()
            }
        },
        likeUid(newValue, oldValue){
            if (window.location.hash.includes('#/private') && this.likeUid) {
              this.pageIndex = 1
              this.getPrivateLikeList()
            }
        },
        isConcern(newValue, oldValue){
            if (window.location.hash.includes('#/home') && this.isConcern) {
              this.pageIndex = 1
              this.getConcernImgList()
            } else {
              this.pageIndex = 1
              this.getImgList()
            }
        }
    },
    props: {
        category: {
            type: String,
            default: ''
        },
        uid: {
            type: Number,
            default: 0
        },
        likeUid: {
            type: Number,
            default: 0
        },
        isConcern: {
            type: Boolean,
            default: false
        },
        isDel: {
            type: Number,
            default: 0
        },
        isAllowDownLoad: {
            type: Boolean,
            default: false
        }
    },
    created(){
        if (window.location.hash.includes('#/private') && this.uid) {
            this.getImgList()
        } else if (window.location.hash.includes('#/private') && this.likeUid) {
            this.getPrivateLikeList()
        } else {
            this.getImgList()
        }
        this.errColor = colorList.palettes[Math.floor(Math.random() * 40)][Math.floor(Math.random() * 4)]
        this.preColor = colorList.palettes
    },
    data(){
        return{
            pageIndex: 1,
            pageSize: 40,
            imgList: [[], [], [], []],
            imgPreList: [],
            errColor: '',
            preColor: [],
            focusBtn: '',
            imgMesShow: false,
            imgMes: {},
            userInfo: {}
        }
    },
    beforeMount(){
        window.addEventListener('scroll', () => {
            //获取元素内容的总高度
            let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            //获取被隐藏在内容区域上方的像素数
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            //获取当前浏览器窗口内容高度
            let clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
            if(scrollHeight - (scrollTop + clientHeight) <= (scrollHeight / 5))
            {
                this.pageIndex++
                if (window.location.hash.includes('#/private') && this.likeUid) {
                    this.getPrivateLikeList()
                } else if (window.location.hash.includes('#/home') && this.isConcern) {
                    this.getConcernImgList()
                } else {
                    this.getImgList()
                }
                
            }
        })
    },
    beforeDestroy(){
        window.removeEventListener('scroll', () => {
            //获取元素内容的总高度
            let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            //获取被隐藏在内容区域上方的像素数
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            //获取当前浏览器窗口内容高度
            let clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
            if(scrollHeight - (scrollTop + clientHeight) <= (scrollHeight / 5))
            {
                this.pageIndex++
                if (window.location.hash.includes('#/private') && this.likeUid) {
                    this.getPrivateLikeList()
                } else {
                    this.getImgList()
                }
            }
        })
    },
    methods: {
        getImgList(){
            getImgList({
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                category: this.category,
                uid: this.uid
            }).then(res => {
                this.getLikeList(res)
            })
        },
        getConcernImgList(){
            getConcernImgList({
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                puid: this.$store.state.userInfo.uid
            }).then(res => {
                this.getLikeList(res)
            })
        },
        getLikeList(res){
            getLikeList().then(n => {
                    if (this.pageIndex == 1) {
                        this.imgList = [[], [], [], []]
                        this.imgPreList = []
                    }
                    res.data.data.forEach(e => {
                        this.imgPreList.push(e.imgSrc)
                        for (let i = 0; i < n.data.data.length; i++) {
                            if (n.data.data[i].uid == this.$store.state.userInfo.uid && n.data.data[i].pid == e.pid) {
                                e.isLike = true
                                e.lid = n.data.data[i].lid
                                break
                            } else {
                                e.isLike = false
                                e.lid = ''
                            }
                        }
                    });
                    let index = 0
                    res.data.data.forEach(e => {
                        e.allowDownload = e.allowDownload == 1
                        if (index > 3) index = 0
                        this.imgList[index].push(e)
                        index++
                    })
                })
        },
        focusLike(e){
            this.focusBtn = e
        },
        imgMesIsLike(e){
            if (this.imgMes.isLike) {
                this.delLike(e.lid)
            } else {
                this.addLike(e.pid)
            }
        },
        delLike(lid){
            delLikeList({
                lid
            }).then(res => {
                this.imgMes.isLike = !this.imgMes.isLike
                this.pageIndex = 1

                if (window.location.hash.includes('#/home') && this.isConcern) {
                    this.getConcernImgList()
                } else {
                     //收藏
                    !(window.location.hash.includes('#/private') && !this.uid) && this.getImgList()

                    this.likeUid && this.getPrivateLikeList()
                }
            })
        },
        addLike(pid){
            addLikeList({
                uid: this.$store.state.userInfo.uid,
                pid
            }).then(res => {
                this.imgMes.isLike = !this.imgMes.isLike
                this.pageIndex = 1
                if (window.location.hash.includes('#/home') && this.isConcern) {
                    this.getConcernImgList()
                } else {
                    this.getImgList()
                }
            })
        },
        delImg(pid, uid){
            this.$confirm('此操作将永久删除该图片, 是否继续?', '提示').then(() => {
                delImgList({
                    pid,
                    uid
                }).then(res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    this.pageIndex = 1
                    this.getImgList()
                })
            }).catch(() => {
                
            })
        },
        openImgMesDia(e){
            this.imgMes = e
            this.getUserList(this.imgMes.uid)
        },
        getUserList(uid){
            getUserList({
                uid,
                status: 0
            }).then(res => {
                this.userInfo = res.data.data[0]
                this.imgMesShow = true
            })
        },
        toUserPage(uid){
            this.$router.replace({
                path: '/private',
                query: {
                    uid
                }
            })
        },
        getPrivateLikeList(){
            getPrivateLikeList({
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                uid: this.likeUid
            }).then(res => {
                this.getLikeList(res)
            })
        },
        switchAllowDownload(e, pid){
            console.log(e, pid);
            updateImgAllowDownload({
                allowDownload: e ? 1 : 0,
                pid
            }).then(res => {
                this.$message({
                    message: res.data.mes,
                    type: 'success'
                })
            })
        },
        download(url, name){
            const img = new Image();
            img.src = url;
            img.setAttribute('crossOrigin', 'Anonymous');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width
                canvas.height = img.height

                const ctx = canvas.getContext('2d')

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                ctx.font = '26px Microsoft Yahei'
                ctx.fillStyle = 'rgba(255, 255, 255, 1)'

                ctx.fillText(`FIMG@${name}`, 5, canvas.height - 10)

                canvas.toBlob((blob) => {
                    let blobUrl = window.URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = blobUrl
                    a.download = ''

                    a.click()
                    this.$message({
                        message: '下载成功，请稍后查看',
                        type: 'success'
                    })
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.MContent{
    display: flex;
    justify-content: space-between;
    .MColumn{
      flex: 1;
      margin-right: 1.25rem;
      display: flex;
      flex-direction: column;
      .MImgContent{
        width: 100%;
        height: auto;
        margin-bottom: 1.20rem;
        position: relative;
        display: flex;
        .img-like{
          width: 100%;  
          position: absolute;
          bottom: 5px;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          box-sizing: border-box;
          font-size: 24px;
          z-index: 3;
          .un-like{
            cursor: pointer; 
            &:hover{
              color: #fff !important;
            }
          }
          .is-like{
            font-size: 30px;
            position: absolute;
            right: 7px;
            bottom: 4px;
          }
        }
        &:hover::before {
          content: '';
          pointer-events: none;
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 50px;
          box-sizing: border-box;
          background-image: linear-gradient(to top,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 100%);
          transition: opacity .2s;
          z-index: 2;
        }
      }
      .Loading{
          width: 100%;
          height: 300px;
      }
      &:last-child{
        margin-right: 0;
      }
    }
}
.img-mes-dia{
    .img-mes-dia-content{
        display: flex;
        .img-box{
            width: 100%;
            height: 800px;
            background-color: #EBEEF5;
            display: flex;
            justify-content: center;
            align-items: center;
            .img-src{
              max-width: 100%;
              max-height: 800px;
              img{
                  width: 100%;
                  max-height: 800px;
              }  
            }
        }
        .img-mes{
            width: 340px;
            min-width: 340px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            .img-mes-top{
                flex: 1;
                padding: 20px;
                box-sizing: border-box;
                .user-info{
                    display: flex;
                    .avater{
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        margin-right: 20px;
                        .image-slot{
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        }
                        .img-err{
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background-color: #DCDFE6;
                        }
                    }
                }
                
            }
            .img-mes-bottom{
                flex: 1;
                padding: 20px;
            }
        }
    }
    
}
/deep/ .el-dialog{
    min-width: 840px;
    // margin-top: 10vh !important;
}
</style>
