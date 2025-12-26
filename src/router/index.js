// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: 'design/products',
        name: 'DesignProducts',
        component: () => import('@/views/design/ProductDesignView.vue')
      },
      // {
      //   path: 'design/components',
      //   name: 'DesignComponents',
      //   component: () => import('@/views/design/ComponentDesignView.vue')
      // },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/OrdersView.vue')
      },
      {
        path: 'components',
        name: 'Components',
        component: () => import('@/views/ComponentsView.vue')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/ProductsView.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/UsersView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    // 如果是登录页面，已登录则跳转首页
    if (token) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    // 如果不是登录页面，未登录则跳转登录页
    if (!token && to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }
})

export default router