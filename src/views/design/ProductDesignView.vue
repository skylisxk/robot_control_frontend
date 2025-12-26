<!-- src/views/design/ProductDesignView.vue -->
 
<template>
  <div class="product-design-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1><el-icon><DataBoard /></el-icon> 产品设计管理</h1>
      <p class="page-subtitle">管理产品设计蓝图，支持增删改查操作</p>
    </div>

    <!-- 操作工具栏 -->
    <el-card class="operation-card">
      <div class="operation-bar">
        <div class="left-operations">
          <el-button type="primary" @click="handleAdd" icon="Plus">新增产品蓝图</el-button>
          <el-button 
            @click="handleBatchDelete" 
            :disabled="selectedRows.length === 0" 
            icon="Delete"
            type="danger"
          >
            批量删除
          </el-button>
        </div>
        <div class="right-operations">
          <el-input
            v-model="searchParams.code"
            placeholder="蓝图编号"
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
            placeholder="产品名称"
            clearable
            style="width: 180px; margin-right: 10px;"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch" icon="Search">查询</el-button>
          <el-button @click="handleReset" icon="Refresh">重置</el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据统计 -->
    <div class="statistics-row">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon total">
                <el-icon><Collection /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.total }}</div>
                <div class="stat-label">产品蓝图总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon used">
                <el-icon><Link /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.used }}</div>
                <div class="stat-label">已调用蓝图</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon active">
                <el-icon><SuccessFilled /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.active }}</div>
                <div class="stat-label">有效蓝图</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon draft">
                <el-icon><EditPen /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.draft }}</div>
                <div class="stat-label">草稿蓝图</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 产品蓝图列表 -->
    <el-card class="data-card">
      <template #header>
        <div class="card-header">
          <span>产品蓝图列表</span>
          <div class="header-actions">
            <el-button text @click="refreshData" icon="Refresh">刷新</el-button>
            <el-button text @click="exportData" icon="Download">导出</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="displayBlueprintList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        stripe
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="code" label="蓝图编号" width="160" fixed>
          <template #default="{ row }">
            <span class="blueprint-code">{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" width="200">
          <template #default="{ row }">
            <div class="product-info">
              <div class="name">{{ row.name }}</div>
              <div class="model">型号: {{ row.model }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="蓝图说明" width="250">
          <template #default="{ row }">
            <div class="description-text">
              {{ truncateText(row.description, 30) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="usedCount" label="调用次数" width="100" align="center">
          <template #default="{ row }">
            <span :class="{ 'used-count': row.usedCount > 0 }">
              {{ row.usedCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="设计人" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
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
                :disabled="row.usedCount > 0"
                icon="Edit"
              >
                修改
              </el-button>
              <el-button
                size="small"
                type="danger"
                link
                @click="handleDelete(row)"
                :disabled="row.usedCount > 0"
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
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="showEditDialog"
      :title="editDialogTitle"
      width="500px"
      @closed="handleDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item v-if="isEditMode" label="蓝图编号">
          <el-input v-model="editForm.code" disabled />
        </el-form-item>
        
        <el-form-item label="产品名称" prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请输入产品名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="产品型号" prop="model">
          <el-input
            v-model="editForm.model"
            placeholder="请输入产品型号"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="蓝图说明" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入蓝图说明"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="active">有效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
            {{ isEditMode ? '保存修改' : '创建蓝图' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="产品蓝图详情"
      width="600px"
    >
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="蓝图编号">
            {{ currentDetail.code }}
          </el-descriptions-item>
          <el-descriptions-item label="产品名称">
            {{ currentDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="产品型号">
            {{ currentDetail.model }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentDetail.status === 'active' ? 'success' : 'info'" size="small">
              {{ currentDetail.status === 'active' ? '有效' : '草稿' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="调用次数">
            <span :class="{ 'used-text': currentDetail.usedCount > 0 }">
              {{ currentDetail.usedCount }} 次
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="设计人">
            {{ currentDetail.creator }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(currentDetail.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDateTime(currentDetail.updateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="蓝图说明" :span="2">
            <div class="description-box">
              {{ currentDetail.description || '暂无说明' }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
          <el-button
            type="primary"
            @click="handleEdit(currentDetail)"
            :disabled="currentDetail.usedCount > 0"
          >
            修改蓝图
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
  DataBoard, Plus, Delete, Search, Refresh, Download,
  Collection, Link, SuccessFilled, EditPen, View, Edit
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 数据定义
const loading = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const selectedRows = ref([])
const editFormRef = ref(null)

// 搜索参数
const searchParams = reactive({
  code: '',
  name: ''
})

// 统计信息
const statistics = reactive({
  total: 0,
  used: 0,
  active: 0,
  draft: 0
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 当前查看的详情
const currentDetail = ref({
  code: '',
  name: '',
  model: '',
  description: '',
  status: '',
  usedCount: 0,
  creator: '',
  createTime: '',
  updater: '',
  updateTime: ''
})

// 编辑表单
const editForm = reactive({
  code: '',
  name: '',
  model: '',
  description: '',
  status: 'draft'
})

// 表单验证规则
const editFormRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  model: [
    { required: true, message: '请输入产品型号', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入蓝图说明', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ]
}

// 产品蓝图数据
const productBlueprintList = ref([
  {
    id: 1,
    code: 'PROD-20240001',
    name: '六轴工业机器人',
    model: 'IRB-6700',
    description: '六轴工业机器人的总体设计蓝图，包含机械结构、电气控制和运动规划。',
    status: 'active',
    usedCount: 3,
    creator: '张三',
    createTime: '2024-01-15 09:30:00',
    updater: '张三',
    updateTime: '2024-01-20 14:25:00'
  },
  {
    id: 2,
    code: 'PROD-20240002',
    name: '焊接机器人',
    model: 'WR-5000',
    description: '自动焊接机器人的设计蓝图，包含焊接头、送丝系统和控制单元。',
    status: 'active',
    usedCount: 1,
    creator: '李四',
    createTime: '2024-01-18 10:15:00',
    updater: '李四',
    updateTime: '2024-01-22 16:45:00'
  },
  {
    id: 3,
    code: 'PROD-20240003',
    name: '智能巡检机器人',
    model: 'XR-2000',
    description: '用于工厂巡检的智能移动机器人设计蓝图。',
    status: 'draft',
    usedCount: 0,
    creator: '王五',
    createTime: '2024-01-20 13:20:00',
    updater: '王五',
    updateTime: '2024-01-22 09:10:00'
  },
  {
    id: 4,
    code: 'PROD-20240004',
    name: '搬运机器人',
    model: 'TR-3000',
    description: '物料搬运机器人的设计蓝图，包含抓取机构和导航系统。',
    status: 'active',
    usedCount: 2,
    creator: '赵六',
    createTime: '2024-01-22 11:30:00',
    updater: '赵六',
    updateTime: '2024-01-22 17:20:00'
  },
  {
    id: 5,
    code: 'PROD-20240005',
    name: '装配机器人',
    model: 'AR-4000',
    description: '用于产品装配的精密机器人设计蓝图。',
    status: 'draft',
    usedCount: 0,
    creator: '钱七',
    createTime: '2024-01-23 14:45:00',
    updater: '钱七',
    updateTime: '2024-01-23 14:45:00'
  }
])

//原始数据
const originalBlueprintList = ref([
  {
    id: 1,
    code: 'PROD-20240001',
    name: '六轴工业机器人',
    model: 'IRB-6700',
    description: '六轴工业机器人的总体设计蓝图，包含机械结构、电气控制和运动规划。',
    status: 'active',
    usedCount: 3,
    creator: '张三',
    createTime: '2024-01-15 09:30:00',
    updater: '张三',
    updateTime: '2024-01-20 14:25:00'
  },
  {
    id: 2,
    code: 'PROD-20240002',
    name: '焊接机器人',
    model: 'WR-5000',
    description: '自动焊接机器人的设计蓝图，包含焊接头、送丝系统和控制单元。',
    status: 'active',
    usedCount: 1,
    creator: '李四',
    createTime: '2024-01-18 10:15:00',
    updater: '李四',
    updateTime: '2024-01-22 16:45:00'
  },
  {
    id: 3,
    code: 'PROD-20240003',
    name: '智能巡检机器人',
    model: 'XR-2000',
    description: '用于工厂巡检的智能移动机器人设计蓝图。',
    status: 'draft',
    usedCount: 0,
    creator: '王五',
    createTime: '2024-01-20 13:20:00',
    updater: '王五',
    updateTime: '2024-01-22 09:10:00'
  },
  {
    id: 4,
    code: 'PROD-20240004',
    name: '搬运机器人',
    model: 'TR-3000',
    description: '物料搬运机器人的设计蓝图，包含抓取机构和导航系统。',
    status: 'active',
    usedCount: 2,
    creator: '赵六',
    createTime: '2024-01-22 11:30:00',
    updater: '赵六',
    updateTime: '2024-01-22 17:20:00'
  },
  {
    id: 5,
    code: 'PROD-20240005',
    name: '装配机器人',
    model: 'AR-4000',
    description: '用于产品装配的精密机器人设计蓝图。',
    status: 'draft',
    usedCount: 0,
    creator: '钱七',
    createTime: '2024-01-23 14:45:00',
    updater: '钱七',
    updateTime: '2024-01-23 14:45:00'
  }
])

// 显示在表格中的数据（会被搜索过滤）
const displayBlueprintList = ref([])


// 计算属性
const editDialogTitle = computed(() => {
  return isEditMode.value ? '修改产品蓝图' : '新增产品蓝图'
})

// 方法定义
const handleAdd = () => {
  isEditMode.value = false
  resetEditForm()
  showEditDialog.value = true
}

const handleEdit = (row) => {
  if (row.usedCount > 0) {
    ElMessage.warning('该蓝图已被调用，无法修改')
    return
  }
  
  isEditMode.value = true
  Object.assign(editForm, { ...row })
  showEditDialog.value = true
}

const handleDelete = async (row) => {
  if (row.usedCount > 0) {
    ElMessage.warning('该蓝图已被调用，无法删除')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除产品蓝图 "${row.name}" 吗？`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    
    const index = originalBlueprintList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      originalBlueprintList.value.splice(index, 1)
      ElMessage.success('删除成功')
      loadData() // 这会重新加载并更新显示数据
    }
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  const hasUsed = selectedRows.value.some(item => item.usedCount > 0)
  if (hasUsed) {
    ElMessage.warning('选中的蓝图中包含已被调用的蓝图，无法删除')
    return
  }
  
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的蓝图')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个蓝图吗？`,
      '批量删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    
    const idsToDelete = selectedRows.value.map(item => item.id)
    originalBlueprintList.value = originalBlueprintList.value.filter(item => !idsToDelete.includes(item.id))
    selectedRows.value = []
    ElMessage.success(`成功删除 ${idsToDelete.length} 个蓝图`)
    loadData() // 重新加载数据
  } catch {
    // 用户取消
  }
}

const handleViewDetail = (row) => {
  currentDetail.value = { ...row }
  showDetailDialog.value = true
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
  
  // 如果有搜索条件，显示提示
  if (searchParams.code || searchParams.name) {
    ElMessage.info('正在执行搜索...')
  }
}

const handleReset = () => {
  // 清空搜索参数
  searchParams.code = ''
  searchParams.name = ''
  
  // 重置分页
  pagination.current = 1
  
  // 重新加载数据（显示全部）
  loadData()
  
  ElMessage.info('搜索条件已重置')
}

const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadData()
}

const handlePageChange = (page) => {
  pagination.current = page
  loadData()
}

const handleDialogClosed = () => {
  if (editFormRef.value) {
    editFormRef.value.resetFields()
  }
  resetEditForm()
}

const handleEditSubmit = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    submitting.value = true
    
    setTimeout(() => {
      if (isEditMode.value) {
        // 修改操作
        const index = originalBlueprintList.value.findIndex(item => item.code === editForm.code)
        if (index !== -1) {
          originalBlueprintList.value[index] = {
            ...originalBlueprintList.value[index],
            ...editForm,
            updateTime: new Date().toISOString(),
            updater: '当前用户'
          }
        }
        ElMessage.success('修改成功')
      } else {
        // 添加操作
        const newBlueprint = {
          id: Date.now(),
          code: `PROD-${new Date().getFullYear()}${String(originalBlueprintList.value.length + 1).padStart(4, '0')}`,
          ...editForm,
          usedCount: 0,
          creator: '当前用户',
          createTime: new Date().toISOString(),
          updater: '当前用户',
          updateTime: new Date().toISOString()
        }
        originalBlueprintList.value.unshift(newBlueprint)
        ElMessage.success('创建成功')
      }
      
      showEditDialog.value = false
      submitting.value = false
      loadData() // 重新加载数据
    }, 1000)
  } catch (error) {
    submitting.value = false
  }
}

const refreshData = () => {
  loadData()
  ElMessage.success('数据已刷新')
}

const exportData = () => {
  ElMessage.success('导出功能开发中...')
}

const loadData = () => {
  loading.value = true
  
  setTimeout(() => {
    // 1. 每次搜索都从原始数据开始
    let filteredData = [...originalBlueprintList.value]
    
    // 2. 执行搜索过滤
    if (searchParams.code.trim()) {
      const searchCode = searchParams.code.trim().toLowerCase()
      filteredData = filteredData.filter(item => 
        item.code.toLowerCase().includes(searchCode)
      )
    }
    
    if (searchParams.name.trim()) {
      const searchName = searchParams.name.trim().toLowerCase()
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchName)
      )
    }
    
    // 3. 更新统计数据（基于原始数据）
    statistics.total = originalBlueprintList.value.length
    statistics.used = originalBlueprintList.value.filter(item => item.usedCount > 0).length
    statistics.active = originalBlueprintList.value.filter(item => item.status === 'active').length
    statistics.draft = originalBlueprintList.value.filter(item => item.status === 'draft').length
    
    // 4. 计算分页数据
    const total = filteredData.length
    const startIndex = (pagination.current - 1) * pagination.size
    const endIndex = Math.min(startIndex + pagination.size, total)
    
    // 5. 更新显示数据（分页后的过滤数据）
    displayBlueprintList.value = filteredData.slice(startIndex, endIndex)
    
    // 6. 更新分页信息
    pagination.total = total
    
    loading.value = false
  }, 500)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    code: '',
    name: '',
    model: '',
    description: '',
    status: 'draft'
  })
}

// 工具函数
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 生命周期
onMounted(() => {
  // 初始化显示数据
  displayBlueprintList.value = [...originalBlueprintList.value]
  loadData()
})
</script>

<style scoped lang="scss">
.product-design-view {
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

.statistics-row {
  margin-bottom: 20px;
  
  .stat-card {
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
        
        &.used {
          background: linear-gradient(135deg, #fa8c16, #ffec3d);
        }
        
        &.active {
          background: linear-gradient(135deg, #52c41a, #bae637);
        }
        
        &.draft {
          background: linear-gradient(135deg, #722ed1, #eb2f96);
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
  }
}

.blueprint-code {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #1890ff;
}

.product-info {
  .name {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  
  .model {
    font-size: 12px;
    color: #666;
  }
}

.description-text {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.used-count {
  color: #fa8c16;
  font-weight: 500;
}

.used-text {
  color: #fa8c16;
  font-weight: 500;
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

.detail-content {
  .description-box {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;
    line-height: 1.6;
    color: #333;
  }
}
</style>