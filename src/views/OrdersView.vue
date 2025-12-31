<!-- src/views/OrdersView.vue -->
<template>
  <div class="orders-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1><el-icon><ShoppingCart /></el-icon> 订单管理</h1>
      <p class="page-subtitle">管理生产订单与采购订单，支持分类查看</p>
    </div>

    <!-- 操作工具栏 -->
    <el-card class="operation-card">
      <div class="operation-bar">
        <div class="left-operations">
          <el-button type="primary" @click="handleAdd" icon="Plus">新增订单</el-button>
        </div>
        <div class="right-operations">
          <el-input
            v-model="searchParams.code"
            placeholder="订单编号"
            clearable
            style="width: 180px; margin-right: 10px;"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-input
            v-model="searchParams.name"
            placeholder="订单名称"
            clearable
            style="width: 180px; margin-right: 10px;"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="searchParams.source"
            placeholder="订单来源"
            clearable
            style="width: 120px; margin-right: 10px;"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="生产订单" value="manufacture" />
            <el-option label="采购订单" value="purchase" />
          </el-select>
          <el-button type="primary" @click="handleSearch" icon="Search">查询</el-button>
          <el-button @click="handleReset" icon="Refresh">重置</el-button>
        </div>
      </div>
    </el-card>

    <!-- 订单统计 -->
    <div class="statistics-row">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover" @click="handleSourceFilter('')">
            <div class="stat-content">
              <div class="stat-icon total">
                <el-icon><List /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.total }}</div>
                <div class="stat-label">订单总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover" @click="handleSourceFilter('manufacture')">
            <div class="stat-content">
              <div class="stat-icon manufacture">
                <el-icon><Factory /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.manufacture }}</div>
                <div class="stat-label">生产订单</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover" @click="handleSourceFilter('purchase')">
            <div class="stat-content">
              <div class="stat-icon purchase">
                <el-icon><ShoppingBag /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.purchase }}</div>
                <div class="stat-label">采购订单</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon recent">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.today }}</div>
                <div class="stat-label">今日新增</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 订单列表 -->
    <el-card class="data-card">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <div class="header-actions">
            <el-button 
              text 
              @click="toggleSourceFilter('')"
              :type="currentSourceFilter === '' ? 'primary' : ''"
            >
              全部
            </el-button>
            <el-button 
              text 
              @click="toggleSourceFilter('manufacture')"
              :type="currentSourceFilter === 'manufacture' ? 'primary' : ''"
            >
              生产订单
            </el-button>
            <el-button 
              text 
              @click="toggleSourceFilter('purchase')"
              :type="currentSourceFilter === 'purchase' ? 'primary' : ''"
            >
              采购订单
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="orderList"
        v-loading="loading"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="code" label="订单编号" width="160">
          <template #default="{ row }">
            <span class="order-code">{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="订单名称" width="200">
          <template #default="{ row }">
            <div class="order-name">
              <span>{{ row.name }}</span>
              <span class="quantity" v-if="row.quantity"> ×{{ row.quantity }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="订单来源" width="120">
          <template #default="{ row }">
            <el-tag :type="row.source === 'manufacture' ? 'primary' : 'success'" size="small">
              {{ row.source === 'manufacture' ? '生产订单' : '采购订单' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" align="center">
          <template #default="{ row }">
            <span class="quantity-text">{{ row.quantity || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="订单日期" width="140">
          <template #default="{ row }">
            <span class="date-text">{{ formatDate(row.orderDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                size="small"
                type="primary"
                link
                @click="handleViewDetail(row)"
                icon="View"
              >
                详情
              </el-button>
              <el-button
                size="small"
                type="primary"
                link
                @click="handleEdit(row)"
                icon="Edit"
              >
                修改
              </el-button>
              <el-button
                size="small"
                type="danger"
                link
                @click="handleDelete(row)"
                icon="Delete"
              >
                删除
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

    <!-- 新增/编辑订单对话框 -->
    <el-dialog
      v-model="showEditDialog"
      :title="editDialogTitle"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item v-if="isEditMode" label="订单编号">
          <el-input v-model="editForm.code" disabled />
        </el-form-item>
        
        <el-form-item label="订单名称" prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请输入订单名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="订单来源" prop="source">
          <el-radio-group v-model="editForm.source">
            <el-radio label="manufacture">生产订单</el-radio>
            <el-radio label="purchase">采购订单</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="数量" prop="quantity">
          <el-input-number
            v-model="editForm.quantity"
            :min="1"
            :max="10000"
            style="width: 100%"
            placeholder="请输入数量"
          />
        </el-form-item>
        
        <el-form-item label="订单日期" prop="orderDate">
          <el-date-picker
            v-model="editForm.orderDate"
            type="date"
            placeholder="选择订单日期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
            {{ isEditMode ? '保存修改' : '创建订单' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="订单详情"
      width="500px"
    >
      <div class="detail-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单编号">
            <span class="detail-value">{{ currentDetail.code }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="订单名称">
            <span class="detail-value">{{ currentDetail.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="订单来源">
            <el-tag :type="currentDetail.source === 'manufacture' ? 'primary' : 'success'" size="small">
              {{ currentDetail.source === 'manufacture' ? '生产订单' : '采购订单' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数量">
            <span class="detail-value">{{ currentDetail.quantity || 0 }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="订单日期">
            <span class="detail-value">{{ formatDate(currentDetail.orderDate) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <span class="detail-value">{{ formatDateTime(currentDetail.createTime) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <span class="detail-value">{{ currentDetail.updateTime ? formatDateTime(currentDetail.updateTime) : '无' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
          <el-button type="primary" @click="handleEdit(currentDetail)">
            修改订单
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  ShoppingCart, Plus, Search, Refresh, View, Edit, Delete,
  List, Factory, ShoppingBag, Calendar
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 数据定义
const loading = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const editFormRef = ref(null)
const currentSourceFilter = ref('') // 当前来源筛选

// 搜索参数
const searchParams = reactive({
  code: '',
  name: '',
  source: ''
})

// 统计信息
const statistics = reactive({
  total: 0,
  manufacture: 0,
  purchase: 0,
  today: 0
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 原始订单数据
const originalOrderList = ref([
  {
    id: 1,
    code: 'ORD-20240001',
    name: '六轴工业机器人生产订单',
    source: 'manufacture',
    quantity: 10,
    orderDate: '2024-01-15',
    createTime: '2024-01-15 09:30:00',
    updateTime: '2024-01-15 09:30:00'
  },
  {
    id: 2,
    code: 'ORD-20240002',
    name: '伺服电机采购订单',
    source: 'purchase',
    quantity: 50,
    orderDate: '2024-01-18',
    createTime: '2024-01-18 10:15:00',
    updateTime: '2024-01-18 10:15:00'
  },
  {
    id: 3,
    code: 'ORD-20240003',
    name: '焊接机器人生产订单',
    source: 'manufacture',
    quantity: 5,
    orderDate: '2024-01-20',
    createTime: '2024-01-20 13:20:00',
    updateTime: '2024-01-20 13:20:00'
  },
  {
    id: 4,
    code: 'ORD-20240004',
    name: '控制器采购订单',
    source: 'purchase',
    quantity: 20,
    orderDate: '2024-01-22',
    createTime: '2024-01-22 11:30:00',
    updateTime: '2024-01-22 11:30:00'
  },
  {
    id: 5,
    code: 'ORD-20240005',
    name: '智能巡检机器人生产订单',
    source: 'manufacture',
    quantity: 3,
    orderDate: '2024-01-23',
    createTime: '2024-01-23 14:45:00',
    updateTime: '2024-01-23 14:45:00'
  },
  {
    id: 6,
    code: 'ORD-20240006',
    name: '传感器采购订单',
    source: 'purchase',
    quantity: 100,
    orderDate: '2024-01-25',
    createTime: '2024-01-25 09:10:00',
    updateTime: '2024-01-25 09:10:00'
  }
])

// 显示的订单列表
const orderList = ref([])

// 当前查看的详情
const currentDetail = ref({
  id: 0,
  code: '',
  name: '',
  source: '',
  quantity: 0,
  orderDate: '',
  createTime: '',
  updateTime: ''
})

// 编辑表单
const editForm = reactive({
  id: 0,
  code: '',
  name: '',
  source: 'manufacture',
  quantity: 1,
  orderDate: ''
})

// 表单验证规则
const editFormRules = {
  name: [
    { required: true, message: '请输入订单名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  source: [
    { required: true, message: '请选择订单来源', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  orderDate: [
    { required: true, message: '请选择订单日期', trigger: 'change' }
  ]
}

// 计算属性
const editDialogTitle = computed(() => {
  return isEditMode.value ? '修改订单信息' : '新增订单'
})

// 搜索功能
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchParams.code = ''
  searchParams.name = ''
  searchParams.source = ''
  currentSourceFilter.value = ''
  pagination.current = 1
  loadData()
  ElMessage.info('搜索条件已重置')
}

// 来源筛选
const toggleSourceFilter = (source) => {
  currentSourceFilter.value = source
  searchParams.source = source
  pagination.current = 1
  loadData()
}

const handleSourceFilter = (source) => {
  toggleSourceFilter(source)
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
    let filteredData = [...originalOrderList.value]
    
    // 2. 编号模糊查询（修复这里）
    if (searchParams.code.trim()) {
      const searchCode = searchParams.code.trim().toLowerCase()
      filteredData = filteredData.filter(item => 
        item.code.toLowerCase().includes(searchCode)  // 改为 includes 模糊匹配
      )
    }
    
    // 3. 名称模糊查询
    if (searchParams.name.trim()) {
      const searchName = searchParams.name.trim().toLowerCase()
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchName)
      )
    }
    
    // 4. 来源筛选
    if (searchParams.source) {
      filteredData = filteredData.filter(item => 
        item.source === searchParams.source
      )
    }
    
    // 5. 计算统计信息
    calculateStatistics()
    
    // 6. 计算分页
    const total = filteredData.length
    const startIndex = (pagination.current - 1) * pagination.size
    const endIndex = Math.min(startIndex + pagination.size, total)
    
    // 7. 更新显示数据
    orderList.value = filteredData.slice(startIndex, endIndex)
    
    // 8. 更新分页信息
    pagination.total = total
    
    loading.value = false
  }, 300)
}

// 计算统计数据
const calculateStatistics = () => {
  statistics.total = originalOrderList.value.length
  statistics.manufacture = originalOrderList.value.filter(item => 
    item.source === 'manufacture'
  ).length
  statistics.purchase = originalOrderList.value.filter(item => 
    item.source === 'purchase'
  ).length
  
  // 今日新增（简化处理：模拟今天）
  const todayStr = new Date().toISOString().split('T')[0]
  statistics.today = originalOrderList.value.filter(item => 
    item.orderDate === todayStr
  ).length
}

// 新增订单
const handleAdd = () => {
  isEditMode.value = false
  resetEditForm()
  // 设置默认日期为今天
  editForm.orderDate = new Date().toISOString().split('T')[0]
  showEditDialog.value = true
}

// 修改订单
const handleEdit = (row) => {
  isEditMode.value = true
  Object.assign(editForm, { ...row })
  showEditDialog.value = true
}

// 删除订单
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除订单 "${row.name}" 吗？`,
    '删除确认',
    {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    }
  ).then(() => {
    const index = originalOrderList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      originalOrderList.value.splice(index, 1)
      ElMessage.success('删除成功')
      loadData()
    }
  }).catch(() => {
    // 用户取消
  })
}

// 查看详情
const handleViewDetail = (row) => {
  currentDetail.value = { ...row }
  showDetailDialog.value = true
}

// 提交编辑
const handleEditSubmit = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    submitting.value = true
    
    setTimeout(() => {
      if (isEditMode.value) {
        // 修改操作
        const index = originalOrderList.value.findIndex(item => item.id === editForm.id)
        if (index !== -1) {
          originalOrderList.value[index] = {
            ...originalOrderList.value[index],
            name: editForm.name,
            source: editForm.source,
            quantity: editForm.quantity,
            orderDate: editForm.orderDate,
            updateTime: new Date().toISOString()
          }
        }
        ElMessage.success('修改成功')
      } else {
        // 新增操作
        const newOrder = {
          id: Date.now(),
          code: `ORD-${new Date().getFullYear()}${String(originalOrderList.value.length + 1).padStart(4, '0')}`,
          name: editForm.name,
          source: editForm.source,
          quantity: editForm.quantity,
          orderDate: editForm.orderDate,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        }
        originalOrderList.value.unshift(newOrder)
        ElMessage.success('创建成功')
      }
      
      showEditDialog.value = false
      submitting.value = false
      loadData()
    }, 500)
  } catch (error) {
    submitting.value = false
  }
}

// 工具函数
const resetEditForm = () => {
  Object.assign(editForm, {
    id: 0,
    code: '',
    name: '',
    source: 'manufacture',
    quantity: 1,
    orderDate: ''
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString // yyyy-mm-dd格式直接返回
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 初始化
onMounted(() => {
  orderList.value = [...originalOrderList.value]
  loadData()
})
</script>

<style scoped lang="scss">
.orders-view {
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
    
    .left-operations, .right-operations {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
}

// 统计卡片
.statistics-row {
  margin-bottom: 20px;
  
  .stat-card {
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        
        &.total {
          background: linear-gradient(135deg, #1890ff, #36cfc9);
        }
        
        &.manufacture {
          background: linear-gradient(135deg, #722ed1, #eb2f96);
        }
        
        &.purchase {
          background: linear-gradient(135deg, #52c41a, #bae637);
        }
        
        &.recent {
          background: linear-gradient(135deg, #fa8c16, #ffec3d);
        }
      }
      
      .stat-info {
        flex: 1;
        
        .stat-value {
          font-size: 22px;
          font-weight: bold;
          color: #333;
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 13px;
          color: #666;
          margin-top: 4px;
        }
      }
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
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
}

.order-code {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #1890ff;
}

.order-name {
  .quantity {
    margin-left: 8px;
    font-size: 12px;
    color: #fa8c16;
  }
}

.quantity-text {
  font-weight: 500;
  color: #333;
}

.date-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

// 详情对话框样式
.detail-content {
  .detail-value {
    font-size: 14px;
    color: #333;
  }
}
</style>