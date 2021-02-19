import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/vBs',
    name: 'vBs',
    component: () => import(/* webpackChunkName: "vBs" */ '../views/vBs.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
