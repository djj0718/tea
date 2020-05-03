import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/views/Home.vue'
import MainGoods from '@/views/MainGoods.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import User from '@/views/User.vue';
import AddAddress from '@/views/AddAddress.vue';
import OrderDetail from '@/views/OrderDetail.vue';
import GoodsDetail from '@/views/GoodsDetail.vue';

import Admin from '@/views/admin/Admin.vue';
import AdminLogin from '@/views/admin/AdminLogin.vue';
import Goods from '@/views/admin/Goods.vue';
import EditGoods from '@/views/admin/EditGoods.vue';
import AddGoods from '@/views/admin/AddGoods.vue';
import Orders from '@/views/admin/Orders.vue';
import EditOrder from '@/views/admin/EditOrder.vue';

Vue.use(VueRouter)

const routes = [
  // 首页
  {
    path: '/',
    component: Home,
    children: [
      // 首页展示商品
      {
        path: '',
        name: 'Home',
        component: MainGoods
      },
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
      // 个人中心页面
      {
        path: 'user',
        name: 'User',
        // component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
        component: User,
        // 登录之后才能进入 否则去登录
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('user_name')) return next();
          next('/login');
        }
      },
      // 添加收货地址页
      {
        path: 'address',
        name: 'AddAddress',
        component: AddAddress,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('user_name')) return next();
          next('/login');
        }
      },
      // 订单详情页
      {
        path: 'order',
        name: 'OrderDetail',
        component: OrderDetail,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('user_name')) return next();
          next('/login');
        }
      },
      // 商品详情页面
      {
        path: 'detail',
        name: 'GoodsDetail',
        component: GoodsDetail,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('user_name')) return next();
          next('/login');
        }
      }
    ]
  },
  // 管理员页面
  {
    path: '/admin',
    component: Admin,
    // 看管理员是否登录 登录之后才能进入 否则去登录
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('admin')) return next();
      next('/admin/login');
    },
    children: [
      // 管理员首页 默认商品管理
      {
        path: '',
        name: 'Admin',
        component: Goods
      },
      // 商品编辑页面
      {
        path: 'editgoods',
        name: 'EditGoods',
        component: EditGoods
      },
      // 添加商品页面
      {
        path: 'addgoods',
        name: 'AddGoods',
        component: AddGoods
      },
      // 订单管理页面
      {
        path: 'orders',
        name: 'Orders',
        component: Orders
      },
      // 处理订单页面
      {
        path: 'eidtorder',
        name: 'EditOrder',
        component: EditOrder
      }
    ]
  },
  // 管理员登录页面
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router