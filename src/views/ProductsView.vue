<!-- src/views/ProductsView.vue -->
<template>
  <div class="products-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1><el-icon><Box /></el-icon> 产品管理</h1>
      <p class="page-subtitle">管理产品信息、阶段与关联关系</p>
    </div>

    <!-- 操作工具栏 -->
    <el-card class="operation-card">
      <div class="operation-bar">
        <div class="left-operations">
          <el-button type="primary" @click="handleAdd" icon="Plus">新增产品</el-button>
        </div>
        <div class="right-operations">
          <el-input
            v-model="searchParams.code"
            placeholder="产品编号"
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

    <!-- 产品列表 -->
    <el-card class="data-card">
      <template #header>
        <div class="card-header">
          <span>产品列表</span>
          <span class="total-text">共 {{ pagination.total }} 个产品</span>
        </div>
      </template>

      <el-table
        :data="productList"
        v-loading="loading"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="code" label="产品编号" width="160" />
        <el-table-column prop="name" label="产品名称" width="180">
          <template #default="{ row }">
            <div class="product-name">
              <span>{{ row.name }}</span>
              <span class="model" v-if="row.model">({{ row.model }})</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="产品说明" width="250">
          <template #default="{ row }">
            <div class="description-text">
              {{ truncateText(row.description, 25) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="120" />
        <el-table-column prop="stage" label="产品阶段" width="140">
          <template #default="{ row }">
            <el-tag :type="getStageTagType(row.stage)" size="small">
              {{ getStageLabel(row.stage) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
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

    <!-- 新增/编辑产品对话框 -->
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
        <el-form-item v-if="isEditMode" label="产品编号">
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
        
        <el-form-item label="产品说明" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入产品说明"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="负责人" prop="owner">
          <el-input
            v-model="editForm.owner"
            placeholder="请输入负责人姓名"
            maxlength="20"
          />
        </el-form-item>
        
        <el-form-item label="产品阶段" prop="stage">
          <el-select 
            v-model="editForm.stage" 
            placeholder="请选择产品阶段"
            :disabled="!isAdmin && isEditMode"
          >
            <el-option
              v-for="stage in stageOptions"
              :key="stage.value"
              :label="stage.label"
              :value="stage.value"
            />
          </el-select>
          <span v-if="!isAdmin && isEditMode" class="stage-hint">
            仅管理员可修改产品阶段
          </span>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
            {{ isEditMode ? '保存修改' : '创建产品' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 产品详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="产品详情"
      width="700px"
    >
      <div class="detail-content">
        <!-- 基础信息 -->
        <el-descriptions title="产品基本信息" :column="2" border>
          <el-descriptions-item label="产品编号">
            {{ currentDetail.code }}
          </el-descriptions-item>
          <el-descriptions-item label="产品名称">
            {{ currentDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="负责人">
            {{ currentDetail.owner }}
          </el-descriptions-item>
          <el-descriptions-item label="产品阶段">
            <el-tag :type="getStageTagType(currentDetail.stage)" size="small">
              {{ getStageLabel(currentDetail.stage) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">
            {{ formatDateTime(currentDetail.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="产品说明" :span="2">
            <div class="description-box">
              {{ currentDetail.description || '暂无说明' }}
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 关联蓝图 -->
        <div class="relation-section">
          <div class="section-header">
            <h3>关联蓝图</h3>
            <el-button
              size="small"
              type="primary"
              @click="handleAddBlueprint"
              :disabled="!canEditBlueprint"
              icon="Plus"
            >
              添加蓝图
            </el-button>
          </div>
          <el-table
            :data="currentDetail.blueprints || []"
            v-loading="blueprintLoading"
            style="width: 100%; margin-top: 10px;"
            size="small"
            v-if="currentDetail.blueprints && currentDetail.blueprints.length > 0"
          >
            <el-table-column prop="code" label="蓝图编号" width="120" />
            <el-table-column prop="name" label="蓝图名称" width="150" />
            <el-table-column prop="status" label="蓝图状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                  {{ row.status === 'active' ? '有效' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="danger"
                  link
                  @click="handleRemoveBlueprint(row)"
                  :disabled="!canEditBlueprint"
                  icon="Delete"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="empty-hint">
            暂无关联蓝图
            <span v-if="canEditBlueprint">（可点击上方按钮添加）</span>
          </div>
          <div v-if="!canEditBlueprint" class="edit-hint">
            注意：仅当产品处于<strong>概念化</strong>或<strong>设计</strong>阶段时方可编辑关联蓝图
          </div>
        </div>

        <!-- 关联部件 -->
        <div class="relation-section">
          <div class="section-header">
            <h3>关联部件</h3>
            <el-button
              size="small"
              type="primary"
              @click="handleAddComponent"
              :disabled="!canEditComponent"
              icon="Plus"
            >
              添加部件
            </el-button>
          </div>
          <el-table
            :data="currentDetail.components || []"
            v-loading="componentLoading"
            style="width: 100%; margin-top: 10px;"
            size="small"
            v-if="currentDetail.components && currentDetail.components.length > 0"
          >
            <el-table-column prop="code" label="部件编号" width="120" />
            <el-table-column prop="name" label="部件名称" width="150" />
            <el-table-column prop="type" label="部件类型" width="100" />
            <el-table-column prop="status" label="部件状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'normal' ? 'success' : 'warning'" size="small">
                  {{ row.status === 'normal' ? '正常' : '维修中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="danger"
                  link
                  @click="handleRemoveComponent(row)"
                  :disabled="!canEditComponent"
                  icon="Delete"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="empty-hint">
            暂无关联部件
            <span v-if="canEditComponent">（可点击上方按钮添加）</span>
          </div>
          <div v-if="!canEditComponent" class="edit-hint">
            注意：仅当产品处于<strong>原型开发</strong>阶段时方可编辑关联部件
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
          <el-button type="primary" @click="handleEdit(currentDetail)">
            修改产品
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加蓝图对话框 -->
    <el-dialog
      v-model="showBlueprintDialog"
      title="选择蓝图"
      width="500px"
    >
      <el-input
        v-model="blueprintSearch"
        placeholder="搜索蓝图编号或名称"
        clearable
        style="margin-bottom: 15px;"
      />
      <el-table
        :data="filteredBlueprints"
        @selection-change="handleBlueprintSelection"
        style="width: 100%"
        height="300"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="code" label="蓝图编号" width="120" />
        <el-table-column prop="name" label="蓝图名称" width="150" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '有效' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showBlueprintDialog = false">取消</el-button>
          <el-button type="primary" @click="saveSelectedBlueprints">
            确认选择
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加部件对话框 -->
    <el-dialog
      v-model="showComponentDialog"
      title="选择部件"
      width="500px"
    >
      <el-input
        v-model="componentSearch"
        placeholder="搜索部件编号或名称"
        clearable
        style="margin-bottom: 15px;"
      />
      <el-table
        :data="filteredComponents"
        @selection-change="handleComponentSelection"
        style="width: 100%"
        height="300"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="code" label="部件编号" width="120" />
        <el-table-column prop="name" label="部件名称" width="150" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'warning'" size="small">
              {{ row.status === 'normal' ? '正常' : '维修' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showComponentDialog = false">取消</el-button>
          <el-button type="primary" @click="saveSelectedComponents">
            确认选择
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
/* eslint-disable no-unused-vars */
import { 
  Box, Plus, Search, Refresh, View, Edit, Delete 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
/* eslint-enable no-unused-vars */

// 数据定义
const loading = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const showBlueprintDialog = ref(false)
const showComponentDialog = ref(false)
const blueprintLoading = ref(false)
const componentLoading = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const editFormRef = ref(null)

// 模拟管理员权限（实际应从登录信息获取）
const isAdmin = ref(true)

// 搜索参数
const searchParams = reactive({
  code: '',
  name: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 产品阶段选项
const stageOptions = [
  { value: 'initial', label: '初始阶段' },
  { value: 'concept', label: '概念化' },
  { value: 'design', label: '设计' },
  { value: 'develop', label: '原型开发' },
  { value: 'testing', label: '测试' },
  { value: 'production', label: '生产' },
  { value: 'maintenance', label: '维护' }
]

// 原始产品数据
const originalProductList = ref([
  {
    id: 1,
    code: 'P-20240001',
    name: '六轴工业机器人',
    description: '用于自动化生产线的六轴工业机器人',
    owner: '张三',
    stage: 'design',
    createTime: '2024-01-15 09:30:00',
    blueprints: [
      { id: 1, code: 'PROD-20240001', name: '机器人机械结构图', status: 'active' }
    ],
    components: []
  },
  {
    id: 2,
    code: 'P-20240002',
    name: '焊接机器人',
    description: '自动化焊接机器人系统',
    owner: '李四',
    stage: 'develop',
    createTime: '2024-01-18 10:15:00',
    blueprints: [
      { id: 2, code: 'PROD-20240002', name: '焊接头设计图', status: 'active' }
    ],
    components: [
      { id: 101, code: 'CMP-20240001', name: '焊接头', type: '执行器', status: 'normal' },
      { id: 102, code: 'CMP-20240002', name: '送丝系统', type: '供料', status: 'normal' }
    ]
  },
  {
    id: 3,
    code: 'P-20240003',
    name: '智能巡检机器人',
    description: '用于工厂巡检的智能移动机器人',
    owner: '王五',
    stage: 'concept',
    createTime: '2024-01-20 13:20:00',
    blueprints: [],
    components: []
  },
  {
    id: 4,
    code: 'P-20240004',
    name: '搬运机器人',
    description: '物料搬运机器人',
    owner: '赵六',
    stage: 'initial',
    createTime: '2024-01-22 11:30:00',
    blueprints: [],
    components: []
  }
])

// 显示的产品列表
const productList = ref([])

// 当前查看的详情
const currentDetail = ref({
  id: 0,
  code: '',
  name: '',
  description: '',
  owner: '',
  stage: '',
  createTime: '',
  blueprints: [],
  components: []
})

// 编辑表单
const editForm = reactive({
  id: 0,
  code: '',
  name: '',
  description: '',
  owner: '',
  stage: 'initial'
})

// 表单验证规则
const editFormRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  owner: [
    { required: true, message: '请输入负责人', trigger: 'blur' }
  ],
  stage: [
    { required: true, message: '请选择产品阶段', trigger: 'change' }
  ]
}

// 蓝图相关数据
const blueprintSearch = ref('')
const selectedBlueprints = ref([])
const allBlueprints = ref([
  { id: 1, code: 'PROD-20240001', name: '机器人机械结构图', status: 'active' },
  { id: 2, code: 'PROD-20240002', name: '焊接头设计图', status: 'active' },
  { id: 3, code: 'PROD-20240003', name: '巡检机器人设计图', status: 'draft' },
  { id: 4, code: 'PROD-20240004', name: '搬运机构设计图', status: 'active' }
])

// 部件相关数据
const componentSearch = ref('')
const selectedComponents = ref([])
const allComponents = ref([
  { id: 101, code: 'CMP-20240001', name: '焊接头', type: '执行器', status: 'normal' },
  { id: 102, code: 'CMP-20240002', name: '送丝系统', type: '供料', status: 'normal' },
  { id: 103, code: 'CMP-20240003', name: '伺服电机', type: '驱动', status: 'normal' },
  { id: 104, code: 'CMP-20240004', name: '控制器', type: '控制', status: 'maintenance' }
])

// 计算属性
const editDialogTitle = computed(() => {
  return isEditMode.value ? '修改产品信息' : '新增产品'
})

const canEditBlueprint = computed(() => {
  const stage = currentDetail.value.stage
  return stage === 'concept' || stage === 'design'
})

const canEditComponent = computed(() => {
  return currentDetail.value.stage === 'develop'
})

const filteredBlueprints = computed(() => {
  if (!blueprintSearch.value) return allBlueprints.value
  const search = blueprintSearch.value.toLowerCase()
  return allBlueprints.value.filter(bp => 
    bp.code.toLowerCase().includes(search) || 
    bp.name.toLowerCase().includes(search)
  )
})

const filteredComponents = computed(() => {
  if (!componentSearch.value) return allComponents.value
  const search = componentSearch.value.toLowerCase()
  return allComponents.value.filter(comp => 
    comp.code.toLowerCase().includes(search) || 
    comp.name.toLowerCase().includes(search)
  )
})

// 搜索功能
const handleSearch = () => {
  pagination.current = 1
  loadData()
  if (searchParams.code || searchParams.name) {
    ElMessage.info('正在执行搜索...')
  }
}

const handleReset = () => {
  searchParams.code = ''
  searchParams.name = ''
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
    let filteredData = [...originalProductList.value]
    
    // 2. 编号精确查询
    if (searchParams.code.trim()) {
      const searchCode = searchParams.code.trim()
      filteredData = filteredData.filter(item => 
        item.code === searchCode
      )
    }
    
    // 3. 名称模糊查询
    if (searchParams.name.trim()) {
      const searchName = searchParams.name.trim().toLowerCase()
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchName)
      )
    }
    
    // 4. 计算分页
    const total = filteredData.length
    const startIndex = (pagination.current - 1) * pagination.size
    const endIndex = Math.min(startIndex + pagination.size, total)
    
    // 5. 更新显示数据
    productList.value = filteredData.slice(startIndex, endIndex)
    
    // 6. 更新分页信息
    pagination.total = total
    
    loading.value = false
  }, 300)
}

// 新增产品
const handleAdd = () => {
  isEditMode.value = false
  resetEditForm()
  showEditDialog.value = true
}

// 修改产品
const handleEdit = (row) => {
  isEditMode.value = true
  Object.assign(editForm, { ...row })
  showEditDialog.value = true
}

// 删除产品
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除产品 "${row.name}" 吗？`,
    '删除确认',
    {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    }
  ).then(() => {
    const index = originalProductList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      originalProductList.value.splice(index, 1)
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
        const index = originalProductList.value.findIndex(item => item.id === editForm.id)
        if (index !== -1) {
          originalProductList.value[index] = {
            ...originalProductList.value[index],
            name: editForm.name,
            description: editForm.description,
            owner: editForm.owner,
            stage: editForm.stage
          }
        }
        ElMessage.success('修改成功')
      } else {
        // 新增操作
        const newProduct = {
          id: Date.now(),
          code: `P-${new Date().getFullYear()}${String(originalProductList.value.length + 1).padStart(4, '0')}`,
          name: editForm.name,
          description: editForm.description,
          owner: editForm.owner,
          stage: editForm.stage,
          createTime: new Date().toISOString(),
          blueprints: [],
          components: []
        }
        originalProductList.value.unshift(newProduct)
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

// 蓝图关联操作
const handleAddBlueprint = () => {
  if (!canEditBlueprint.value) {
    ElMessage.warning('当前产品阶段不允许编辑蓝图关联')
    return
  }
  selectedBlueprints.value = []
  showBlueprintDialog.value = true
}

const handleBlueprintSelection = (selection) => {
  selectedBlueprints.value = selection
}

const saveSelectedBlueprints = () => {
  if (selectedBlueprints.value.length === 0) {
    ElMessage.warning('请至少选择一个蓝图')
    return
  }
  
  // 去重处理
  const existingIds = currentDetail.value.blueprints.map(bp => bp.id)
  const newBlueprints = selectedBlueprints.value.filter(bp => !existingIds.includes(bp.id))
  
  currentDetail.value.blueprints = [...currentDetail.value.blueprints, ...newBlueprints]
  
  // 更新原始数据
  const index = originalProductList.value.findIndex(item => item.id === currentDetail.value.id)
  if (index !== -1) {
    originalProductList.value[index].blueprints = currentDetail.value.blueprints
  }
  
  ElMessage.success(`成功添加 ${newBlueprints.length} 个蓝图`)
  showBlueprintDialog.value = false
  blueprintSearch.value = ''
}

const handleRemoveBlueprint = (blueprint) => {
  if (!canEditBlueprint.value) {
    ElMessage.warning('当前产品阶段不允许编辑蓝图关联')
    return
  }
  
  ElMessageBox.confirm(
    `确定要从产品移除蓝图 "${blueprint.name}" 吗？`,
    '移除确认',
    {
      type: 'warning',
      confirmButtonText: '确定移除',
      cancelButtonText: '取消'
    }
  ).then(() => {
    currentDetail.value.blueprints = currentDetail.value.blueprints.filter(
      bp => bp.id !== blueprint.id
    )
    
    // 更新原始数据
    const index = originalProductList.value.findIndex(item => item.id === currentDetail.value.id)
    if (index !== -1) {
      originalProductList.value[index].blueprints = currentDetail.value.blueprints
    }
    
    ElMessage.success('移除成功')
  }).catch(() => {
    // 用户取消
  })
}

// 部件关联操作
const handleAddComponent = () => {
  if (!canEditComponent.value) {
    ElMessage.warning('当前产品阶段不允许编辑部件关联')
    return
  }
  selectedComponents.value = []
  showComponentDialog.value = true
}

const handleComponentSelection = (selection) => {
  selectedComponents.value = selection
}

const saveSelectedComponents = () => {
  if (selectedComponents.value.length === 0) {
    ElMessage.warning('请至少选择一个部件')
    return
  }
  
  // 去重处理
  const existingIds = currentDetail.value.components.map(comp => comp.id)
  const newComponents = selectedComponents.value.filter(comp => !existingIds.includes(comp.id))
  
  currentDetail.value.components = [...currentDetail.value.components, ...newComponents]
  
  // 更新原始数据
  const index = originalProductList.value.findIndex(item => item.id === currentDetail.value.id)
  if (index !== -1) {
    originalProductList.value[index].components = currentDetail.value.components
  }
  
  ElMessage.success(`成功添加 ${newComponents.length} 个部件`)
  showComponentDialog.value = false
  componentSearch.value = ''
}

const handleRemoveComponent = (component) => {
  if (!canEditComponent.value) {
    ElMessage.warning('当前产品阶段不允许编辑部件关联')
    return
  }
  
  ElMessageBox.confirm(
    `确定要从产品移除部件 "${component.name}" 吗？`,
    '移除确认',
    {
      type: 'warning',
      confirmButtonText: '确定移除',
      cancelButtonText: '取消'
    }
  ).then(() => {
    currentDetail.value.components = currentDetail.value.components.filter(
      comp => comp.id !== component.id
    )
    
    // 更新原始数据
    const index = originalProductList.value.findIndex(item => item.id === currentDetail.value.id)
    if (index !== -1) {
      originalProductList.value[index].components = currentDetail.value.components
    }
    
    ElMessage.success('移除成功')
  }).catch(() => {
    // 用户取消
  })
}

// 工具函数
const resetEditForm = () => {
  Object.assign(editForm, {
    id: 0,
    code: '',
    name: '',
    description: '',
    owner: '',
    stage: 'initial'
  })
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getStageTagType = (stage) => {
  const types = {
    'initial': 'info',
    'concept': '',
    'design': 'primary',
    'develop': 'warning',
    'testing': '',
    'production': 'success',
    'maintenance': 'danger'
  }
  return types[stage] || ''
}

const getStageLabel = (stage) => {
  const option = stageOptions.find(opt => opt.value === stage)
  return option ? option.label : stage
}

// 初始化
onMounted(() => {
  productList.value = [...originalProductList.value]
  loadData()
})
</script>

<style scoped lang="scss">
.products-view {
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

.product-name {
  .model {
    margin-left: 8px;
    font-size: 12px;
    color: #666;
  }
}

.description-text {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
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
  .description-box {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;
    line-height: 1.6;
    color: #333;
  }
}

.relation-section {
  margin-top: 25px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    h3 {
      margin: 0;
      font-size: 16px;
      color: #333;
    }
  }
  
  .empty-hint {
    padding: 20px;
    text-align: center;
    color: #999;
    background: #f8f9fa;
    border-radius: 4px;
    margin-top: 10px;
    
    span {
      color: #1890ff;
      font-size: 12px;
    }
  }
  
  .edit-hint {
    margin-top: 10px;
    padding: 8px 12px;
    background: #f0f9ff;
    border-radius: 4px;
    color: #666;
    font-size: 13px;
    
    strong {
      color: #1890ff;
    }
  }
}

// 表单样式
.stage-hint {
  margin-left: 10px;
  font-size: 12px;
  color: #fa8c16;
}
</style>