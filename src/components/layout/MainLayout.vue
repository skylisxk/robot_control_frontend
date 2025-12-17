<!-- src/components/layout/MainLayout.vue -->
<template>
  <div class="main-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Logo区域 -->
      <div class="logo-area">
        <div class="logo">
          🤖
        </div>
        <h2 v-show="!sidebarCollapsed">机器人EDMS</h2>
        <div class="collapse-btn" @click="toggleSidebar">
          <el-icon>
            <Fold v-if="!sidebarCollapsed" />
            <Expand v-else />
          </el-icon>
        </div>
      </div>
      
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#1890ff"
        :collapse="sidebarCollapsed"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>设计管理</span>
          </template>
          <el-menu-item index="/design/products">产品设计</el-menu-item>
          <el-menu-item index="/design/components">部件设计</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/orders">
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        
        <el-menu-item index="/components">
          <el-icon><Box /></el-icon>
          <span>部件管理</span>
        </el-menu-item>
        
        <el-menu-item index="/products">
          <el-icon><Goods /></el-icon>
          <span>产品管理</span>
        </el-menu-item>
        
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- 主内容区 -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- 顶部栏 -->
      <header class="topbar">
        <div class="left-actions">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRouteName">{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="right-actions">
          <!-- 搜索框 -->
          <el-input
            v-model="searchText"
            placeholder="搜索..."
            class="search-input"
            :prefix-icon="Search"
            style="width: 200px; margin-right: 20px;"
          />
          
          <!-- 通知 -->
          <el-dropdown trigger="click">
            <div class="notification-btn">
              <el-badge :value="3" class="item">
                <el-icon size="20"><Bell /></el-icon>
              </el-badge>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <div class="notification-item">
                    <div class="notification-title">新订单提醒</div>
                    <div class="notification-time">2分钟前</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="notification-item">
                    <div class="notification-title">设计任务更新</div>
                    <div class="notification-time">1小时前</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="notification-item">
                    <div class="notification-title">系统维护通知</div>
                    <div class="notification-time">3小时前</div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <!-- 用户信息 -->
          <el-dropdown>
            <div class="user-info">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="username">{{ userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="goToSettings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区 -->
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  House, Setting, Document, Box, Goods, User, 
  Search, Bell, ArrowDown, SwitchButton,
  Fold, Expand
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 侧边栏状态
const sidebarCollapsed = ref(false)

// 搜索文本
const searchText = ref('')

// 用户信息
const userName = ref('管理员')
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 当前路由名称
const currentRouteName = computed(() => {
  const nameMap = {
    '/dashboard': '首页',
    '/design/products': '产品设计',
    '/design/components': '部件设计',
    '/orders': '订单管理',
    '/components': '部件管理',
    '/products': '产品管理',
    '/users': '用户管理'
  }
  return nameMap[route.path]
})

// 当前激活菜单
const activeMenu = computed(() => route.path)

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 菜单选择
const handleMenuSelect = (index) => {
  router.push(index)
}

// 跳转个人中心
const goToProfile = () => {
  router.push('/profile')
}

// 跳转系统设置
const goToSettings = () => {
  router.push('/settings')
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background: #001529;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  
  &.collapsed {
    width: 64px;
  }
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #002140;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .logo {
    font-size: 24px;
    margin-right: 10px;
  }
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .collapse-btn {
    cursor: pointer;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.65);
    
    &:hover {
      color: white;
    }
  }
}

.el-menu {
  flex: 1;
  border-right: none;
  
  :deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
    
    &.is-active {
      background-color: #1890ff !important;
    }
  }
  
  :deep(.el-sub-menu__title) {
    height: 48px;
    line-height: 48px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s;
}

.topbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  
  .left-actions {
    .el-breadcrumb {
      font-size: 14px;
    }
  }
  
  .right-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}

.notification-btn {
  cursor: pointer;
  position: relative;
  color: #666;
  
  &:hover {
    color: #1890ff;
  }
  
  :deep(.el-badge__content) {
    transform: translate(50%, -50%);
  }
}

.notification-item {
  padding: 8px 0;
  min-width: 200px;
  
  .notification-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
  }
  
  .notification-time {
    font-size: 12px;
    color: #999;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
  }
  
  .username {
    font-size: 14px;
    color: #333;
  }
}

.content-wrapper {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f0f2f5;
}

// 响应式调整
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    
    &.collapsed {
      transform: translateX(-100%);
    }
  }
  
  .main-content {
    margin-left: 0 !important;
  }
}
</style>