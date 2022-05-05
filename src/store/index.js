import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageHeadShow: true,
    userInfo: JSON.parse(localStorage.getItem("userInfo")),
  },
  mutations: {
    pageHeadShowChange(state){
      state.pageHeadShow = !state.pageHeadShow
    },
    getUserInfo(state, payload){
      localStorage.setItem('userInfo', JSON.stringify(payload))
      state.userInfo = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
