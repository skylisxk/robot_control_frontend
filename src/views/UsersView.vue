<!-- src/views/UsersView.vue -->
<template>
  <div class="users-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1><el-icon><User /></el-icon> 用户管理</h1>
      <p class="page-subtitle">管理员可查看和修改用户信息与权限</p>
    </div>

    <!-- 操作工具栏 -->
    <el-card class="operation-card">
      <div class="operation-bar">
        <div class="right-operations">
          <el-input
            v-model="searchParams.username"
            placeholder="用户名"
            clearable
            style="width: 200px; margin-right: 10px;"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="searchParams.role"
            placeholder="权限等级"
            clearable
            style="width: 120px; margin-right: 10px;"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="normal" />
          </el-select>
          <el-button type="primary" @click="handleSearch" icon="Search">查询</el-button>
          <el-button @click="handleReset" icon="Refresh">重置</el-button>
        </div>
      </div>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="data-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <span class="total-text">共 {{ pagination.total }} 个用户</span>
        </div>
      </template>

      <el-table
        :data="userList"
        v-loading="loading"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="phone" label="电话号码" width="150">
          <template #default="{ row }">
            {{ row.phone || '未设置' }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="权限等级" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册日期" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180">
          <template #default="{ row }">
            {{ row.lastLogin ? formatDate(row.lastLogin) : '从未登录' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                size="small"
                type="primary"
                link
                @click="handleEditUser(row)"
                icon="Edit"
              >
                修改用户
              </el-button>
              <el-button
                size="small"
                type="info"
                link
                @click="handleEditInfo(row)"
                icon="User"
              >
                修改信息
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 修改用户权限对话框 -->
    <el-dialog
      v-model="showEditUserDialog"
      title="修改用户信息"
      width="400px"
    >
      <el-form
        ref="editUserFormRef"
        :model="editUserForm"
        :rules="editUserRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" />
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="editUserForm.phone" />
        </el-form-item>
        <el-form-item label="权限等级" prop="role">
          <el-radio-group v-model="editUserForm.role">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="normal">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditUserDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditUserSubmit">
            保存修改
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改个人信息对话框 -->
    <el-dialog
      v-model="showEditInfoDialog"
      title="修改个人信息"
      width="400px"
    >
      <el-form
        ref="editInfoFormRef"
        :model="editInfoForm"
        :rules="editInfoRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editInfoForm.username" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input 
            v-model="editInfoForm.password" 
            type="password" 
            placeholder="留空则不修改"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="editInfoForm.confirmPassword" 
            type="password" 
            show-password
          />
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="editInfoForm.phone" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditInfoDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditInfoSubmit">
            保存修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 数据定义
const loading = ref(false)
const showEditUserDialog = ref(false)
const showEditInfoDialog = ref(false)
const editUserFormRef = ref(null)
const editInfoFormRef = ref(null)

// 搜索参数
const searchParams = reactive({
  username: '',
  role: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 原始用户数据
const originalUserList = ref([
  {
    id: 1,
    username: 'admin',
    phone: '13800138000',
    role: 'admin',
    createTime: '2024-01-01 10:00:00',
    lastLogin: '2024-01-25 15:30:00'
  },
  {
    id: 2,
    username: '张三',
    phone: '13912345678',
    role: 'normal',
    createTime: '2024-01-10 14:20:00',
    lastLogin: '2024-01-24 09:15:00'
  },
  {
    id: 3,
    username: '李四',
    phone: '13787654321',
    role: 'normal',
    createTime: '2024-01-15 11:30:00',
    lastLogin: '2024-01-25 10:45:00'
  },
  {
    id: 4,
    username: '王五',
    phone: '13611223344',
    role: 'normal',
    createTime: '2024-01-20 16:45:00',
    lastLogin: null
  },
  {
    id: 5,
    username: '赵六',
    phone: '13555667788',
    role: 'admin',
    createTime: '2024-01-22 09:10:00',
    lastLogin: '2024-01-25 14:20:00'
  }
])

// 显示的用户列表
const userList = ref([])

// 编辑用户表单
const editUserForm = reactive({
  id: 0,
  username: '',
  phone: '',
  role: 'normal'
})

// 编辑个人信息表单
const editInfoForm = reactive({
  id: 0,
  username: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

// 表单验证规则
const editUserRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const editInfoRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    {
      validator: (rule, value, callback) => {
        if (editInfoForm.password && value !== editInfoForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 搜索功能
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchParams.username = ''
  searchParams.role = ''
  pagination.current = 1
  loadData()
  ElMessage.info('搜索条件已重置')
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.size = size
  loadData()
}

const handlePageChange = (page) => {
  pagination.current = page
  loadData()
}

// 加载数据
const loadData = () => {
  loading.value = true
  
  setTimeout(() => {
    // 1. 从原始数据开始过滤
    let filteredData = [...originalUserList.value]
    
    // 2. 用户名精确查询
    if (searchParams.username.trim()) {
      const searchUsername = searchParams.username.trim()
      filteredData = filteredData.filter(item => 
        item.username === searchUsername
      )
    }
    
    // 3. 权限等级过滤
    if (searchParams.role) {
      filteredData = filteredData.filter(item => 
        item.role === searchParams.role
      )
    }
    
    // 4. 计算分页
    const total = filteredData.length
    const startIndex = (pagination.current - 1) * pagination.size
    const endIndex = Math.min(startIndex + pagination.size, total)
    
    // 5. 更新显示数据
    userList.value = filteredData.slice(startIndex, endIndex)
    
    // 6. 更新分页信息
    pagination.total = total
    
    loading.value = false
  }, 300)
}

// 修改用户权限
const handleEditUser = (row) => {
  Object.assign(editUserForm, { ...row })
  showEditUserDialog.value = true
}

const handleEditUserSubmit = async () => {
  if (!editUserFormRef.value) return
  
  try {
    await editUserFormRef.value.validate()
    
    // 找到并更新用户
    const index = originalUserList.value.findIndex(item => item.id === editUserForm.id)
    if (index !== -1) {
      originalUserList.value[index] = {
        ...originalUserList.value[index],
        username: editUserForm.username,
        phone: editUserForm.phone,
        role: editUserForm.role
      }
      
      ElMessage.success('用户信息修改成功')
      showEditUserDialog.value = false
      loadData()
    }
  } catch (error) {
    // 验证失败
  }
}

// 修改个人信息
const handleEditInfo = (row) => {
  Object.assign(editInfoForm, {
    id: row.id,
    username: row.username,
    phone: row.phone,
    password: '',
    confirmPassword: ''
  })
  showEditInfoDialog.value = true
}

const handleEditInfoSubmit = async () => {
  if (!editInfoFormRef.value) return
  
  try {
    await editInfoFormRef.value.validate()
    
    // 找到并更新用户
    const index = originalUserList.value.findIndex(item => item.id === editInfoForm.id)
    if (index !== -1) {
      const updatedUser = {
        ...originalUserList.value[index],
        username: editInfoForm.username,
        phone: editInfoForm.phone
      }
      
      // 如果有新密码，在这里可以加密处理
      if (editInfoForm.password) {
        // updatedUser.password = encrypt(editInfoForm.password)
        ElMessage.success('密码已更新')
      }
      
      originalUserList.value[index] = updatedUser
      ElMessage.success('个人信息修改成功')
      showEditInfoDialog.value = false
      loadData()
    }
  } catch (error) {
    // 验证失败
  }
}

// 工具函数
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 初始化
onMounted(() => {
  userList.value = [...originalUserList.value]
  loadData()
})
</script>

<style scoped lang="scss">
.users-view {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
  
  h1 {
    margin: 0 0 8px 0;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
  }
  
  .page-subtitle {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
}

.operation-card {
  margin-bottom: 20px;
  
  .operation-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .right-operations {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
}

.data-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      font-weight: 600;
      font-size: 16px;
    }
    
    .total-text {
      font-size: 14px;
      color: #666;
      font-weight: normal;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>