import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const Home = () =>
    import ('@/views/Home.vue')
const Category = () =>
    import ('@/views/Category.vue')
const Private = () =>
    import ('@/views/Private.vue')
const Management = () =>
    import ('@/views/Management.vue')
const Login = () =>
    import ('@/views/Login.vue')
const ManagerLogin = () =>
    import ('@/views/ManagerLogin.vue')

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/category',
        component: Category
    },
    {
        path: '/private',
        component: Private
    },
    {
        path: '/management',
        component: Management
    },
    {
        path: '/managerLogin',
        component: ManagerLogin
    }
]

const router = new VueRouter({
    routes
})

export default router