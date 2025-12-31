<!-- src/views/ComponentsView.vue -->
<template>
  <div class="components-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1><el-icon><Cpu /></el-icon> 部件管理</h1>
      <p class="page-subtitle">管理机器人部件信息</p>
    </div>

    <!-- 操作工具栏 -->
    <el-card class="operation-card">
      <div class="operation-bar">
        <div class="left-operations">
          <el-button type="primary" @click="handleAdd" icon="Plus">新增部件</el-button>
        </div>
        <div class="right-operations">
          <el-input
            v-model="searchParams.code"
            placeholder="部件编号"
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
            placeholder="部件名称"
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
            v-model="searchParams.category"
            placeholder="部件分类"
            clearable
            style="width: 120px; margin-right: 10px;"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option 
              v-for="category in categoryOptions" 
              :key="category.value" 
              :label="category.label" 
              :value="category.value"
            />
          </el-select>
          <el-button type="primary" @click="handleSearch" icon="Search">查询</el-button>
          <el-button @click="handleReset" icon="Refresh">重置</el-button>
        </div>
      </div>
    </el-card>

    <!-- 部件列表 -->
    <el-card class="data-card">
      <template #header>
        <div class="card-header">
          <span>部件列表</span>
          <span class="total-text">共 {{ pagination.total }} 个部件</span>
        </div>
      </template>

      <el-table
        :data="componentList"
        v-loading="loading"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="code" label="部件编号" width="150">
          <template #default="{ row }">
            <span class="component-code">{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="部件名称" width="160">
          <template #default="{ row }">
            <div class="component-name">
              <span>{{ row.name }}</span>
              <el-tag :type="row.status === 'normal' ? 'success' : 'warning'" size="small" style="margin-left: 8px;">
                {{ row.status === 'normal' ? '正常' : '维修中' }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="specificName" label="具体名称" width="180">
          <template #default="{ row }">
            {{ row.specificName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryTagType(row.category)" size="small">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" width="250">
          <template #default="{ row }">
            <div class="description-text">
              {{ truncateText(row.description, 20) }}
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
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑部件对话框 -->
    <el-dialog
      v-model="showEditDialog"
      :title="editDialogTitle"
      width="600px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item v-if="isEditMode" label="部件编号">
          <el-input v-model="editForm.code" disabled />
        </el-form-item>
        
        <el-form-item label="部件名称" prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请输入部件名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="具体名称" prop="specificName">
          <el-input
            v-model="editForm.specificName"
            placeholder="请输入具体名称或型号"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="部件分类" prop="category">
          <el-select 
            v-model="editForm.category" 
            placeholder="请选择部件分类"
            @change="handleCategoryChange"
            style="width: 100%"
          >
            <el-option
              v-for="category in categoryOptions"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="部件状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio label="normal">正常</el-radio>
            <el-radio label="maintenance">维修中</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="部件说明" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入部件说明"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <!-- 动态属性字段 -->
        <div v-if="currentCategoryProperties.length > 0" class="dynamic-properties">
          <div class="properties-title">
            <el-divider>
              <span class="divider-text">{{ getCategoryLabel(editForm.category) }}专有属性</span>
            </el-divider>
          </div>
          
          <div v-for="property in currentCategoryProperties" :key="property.key">
            <el-form-item 
              :label="property.label" 
              :prop="`properties.${property.key}`"
              :rules="property.rules"
            >
              <component
                :is="property.component"
                v-model="editForm.properties[property.key]"
                :placeholder="property.placeholder"
                :options="property.options"
                style="width: 100%"
              />
              <span v-if="property.unit" class="property-unit">{{ property.unit }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
            {{ isEditMode ? '保存修改' : '创建部件' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 部件详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="部件详情"
      width="600px"
    >
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="部件编号">
            <span class="detail-value">{{ currentDetail.code }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="部件名称">
            <span class="detail-value">{{ currentDetail.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="具体名称">
            <span class="detail-value">{{ currentDetail.specificName || '--' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="部件分类">
            <el-tag :type="getCategoryTagType(currentDetail.category)" size="small">
              {{ getCategoryLabel(currentDetail.category) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="部件状态">
            <el-tag :type="currentDetail.status === 'normal' ? 'success' : 'warning'" size="small">
              {{ currentDetail.status === 'normal' ? '正常' : '维修中' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="调用次数">
            <span :class="{ 'used-text': currentDetail.usedCount > 0 }">
              {{ currentDetail.usedCount }} 次
              <span v-if="currentDetail.usedCount > 0" class="delete-hint">（无法删除）</span>
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <span class="detail-value">{{ formatDateTime(currentDetail.createTime) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <span class="detail-value">{{ currentDetail.updateTime ? formatDateTime(currentDetail.updateTime) : '无' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="部件说明" :span="2">
            <div class="description-box">
              {{ currentDetail.description || '暂无说明' }}
            </div>
          </el-descriptions-item>
          
          <!-- 动态属性详情 -->
          <template v-if="currentDetail.properties && Object.keys(currentDetail.properties).length > 0">
            <el-descriptions-item label="部件属性" :span="2">
              <div class="properties-box">
                <el-row :gutter="20">
                  <el-col 
                    v-for="(value, key) in currentDetail.properties" 
                    :key="key" 
                    :span="12"
                    style="margin-bottom: 10px;"
                  >
                    <div class="property-item">
                      <span class="property-label">{{ getPropertyLabel(key) }}：</span>
                      <span class="property-value">{{ formatPropertyValue(key, value) }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-descriptions-item>
          </template>
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
            修改部件
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
  Cpu, Plus, Search, Refresh, View, Edit, Delete
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 数据定义
const loading = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const editFormRef = ref(null)

// 搜索参数
const searchParams = reactive({
  code: '',
  name: '',
  category: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 部件分类选项
const categoryOptions = [
  { value: 'actuator', label: '执行器' },
  { value: 'control', label: '控制器' },
  { value: 'sensor', label: '传感器' },
  { value: 'drive', label: '驱动器' },
  { value: 'power', label: '电源' },
  { value: 'structure', label: '结构件' },
  { value: 'other', label: '其他' }
]

// 分类专有属性配置
const categoryProperties = {
  actuator: [
    {
      key: 'torque',
      label: '额定扭矩',
      component: 'el-input',
      placeholder: '请输入额定扭矩',
      unit: 'N·m',
      rules: [
        { required: true, message: '请输入额定扭矩', trigger: 'blur' },
        { pattern: /^\d+(\.\d+)?$/, message: '请输入有效数字', trigger: 'blur' }
      ]
    },
    {
      key: 'speed',
      label: '最大转速',
      component: 'el-input',
      placeholder: '请输入最大转速',
      unit: 'rpm',
      rules: [
        { required: true, message: '请输入最大转速', trigger: 'blur' },
        { pattern: /^\d+$/, message: '请输入整数', trigger: 'blur' }
      ]
    },
    {
      key: 'accuracy',
      label: '重复定位精度',
      component: 'el-input',
      placeholder: '请输入重复定位精度',
      unit: 'mm',
      rules: [
        { pattern: /^\d+(\.\d+)?$/, message: '请输入有效数字', trigger: 'blur' }
      ]
    }
  ],
  sensor: [
    {
      key: 'type',
      label: '传感器类型',
      component: 'el-select',
      placeholder: '请选择传感器类型',
      options: [
        { label: '位移传感器', value: 'displacement' },
        { label: '力传感器', value: 'force' },
        { label: '视觉传感器', value: 'vision' },
        { label: '温度传感器', value: 'temperature' }
      ],
      rules: [
        { required: true, message: '请选择传感器类型', trigger: 'change' }
      ]
    },
    {
      key: 'range',
      label: '测量范围',
      component: 'el-input',
      placeholder: '请输入测量范围',
      rules: [
        { required: true, message: '请输入测量范围', trigger: 'blur' }
      ]
    },
    {
      key: 'accuracy',
      label: '测量精度',
      component: 'el-input',
      placeholder: '请输入测量精度',
      rules: [
        { pattern: /^\d+(\.\d+)?$/, message: '请输入有效数字', trigger: 'blur' }
      ]
    }
  ],
  control: [
    {
      key: 'interface',
      label: '接口类型',
      component: 'el-select',
      placeholder: '请选择接口类型',
      options: [
        { label: 'EtherCAT', value: 'ethercat' },
        { label: 'Profinet', value: 'profinet' },
        { label: 'CANopen', value: 'canopen' },
        { label: 'Modbus', value: 'modbus' }
      ],
      rules: [
        { required: true, message: '请选择接口类型', trigger: 'change' }
      ]
    },
    {
      key: 'cpu',
      label: '处理器型号',
      component: 'el-input',
      placeholder: '请输入处理器型号',
      rules: [
        { required: true, message: '请输入处理器型号', trigger: 'blur' }
      ]
    }
  ],
  drive: [
    {
      key: 'power',
      label: '额定功率',
      component: 'el-input',
      placeholder: '请输入额定功率',
      unit: 'kW',
      rules: [
        { required: true, message: '请输入额定功率', trigger: 'blur' },
        { pattern: /^\d+(\.\d+)?$/, message: '请输入有效数字', trigger: 'blur' }
      ]
    },
    {
      key: 'voltage',
      label: '工作电压',
      component: 'el-input',
      placeholder: '请输入工作电压',
      unit: 'V',
      rules: [
        { required: true, message: '请输入工作电压', trigger: 'blur' },
        { pattern: /^\d+$/, message: '请输入整数', trigger: 'blur' }
      ]
    }
  ]
}

// 原始部件数据
const originalComponentList = ref([
  {
    id: 1,
    code: 'CMP-20240001',
    name: '伺服电机',
    specificName: 'SM-2000',
    category: 'actuator',
    status: 'normal',
    description: '高精度伺服电机，用于机器人关节控制',
    usedCount: 2,
    properties: {
      torque: '50.5',
      speed: '3000',
      accuracy: '±0.01'
    },
    createTime: '2024-01-15 09:30:00',
    updateTime: '2024-01-20 14:25:00'
  },
  {
    id: 2,
    code: 'CMP-20240002',
    name: '力传感器',
    specificName: 'FS-100',
    category: 'sensor',
    status: 'normal',
    description: '六维力传感器，用于测量末端执行器受力',
    usedCount: 1,
    properties: {
      type: 'force',
      range: '0-500N',
      accuracy: '±0.1%'
    },
    createTime: '2024-01-18 10:15:00',
    updateTime: '2024-01-22 16:45:00'
  },
  {
    id: 3,
    code: 'CMP-20240003',
    name: '运动控制器',
    specificName: 'MC-300',
    category: 'control',
    status: 'normal',
    description: '多轴运动控制器，支持EtherCAT总线',
    usedCount: 0,
    properties: {
      interface: 'ethercat',
      cpu: 'ARM Cortex-A9'
    },
    createTime: '2024-01-20 13:20:00',
    updateTime: '2024-01-22 09:10:00'
  },
  {
    id: 4,
    code: 'CMP-20240004',
    name: '伺服驱动器',
    specificName: 'SD-500',
    category: 'drive',
    status: 'maintenance',
    description: '智能伺服驱动器，支持多种控制模式',
    usedCount: 1,
    properties: {
      power: '2.5',
      voltage: '220'
    },
    createTime: '2024-01-22 11:30:00',
    updateTime: '2024-01-25 17:20:00'
  },
  {
    id: 5,
    code: 'CMP-20240005',
    name: '谐波减速器',
    specificName: 'HD-32',
    category: 'structure',
    status: 'normal',
    description: '高精度谐波减速器，用于机器人关节',
    usedCount: 0,
    properties: {},
    createTime: '2024-01-23 14:45:00',
    updateTime: '2024-01-23 14:45:00'
  }
])

// 显示的部件列表
const componentList = ref([])

// 当前查看的详情
const currentDetail = ref({
  id: 0,
  code: '',
  name: '',
  specificName: '',
  category: '',
  status: 'normal',
  description: '',
  usedCount: 0,
  properties: {},
  createTime: '',
  updateTime: ''
})

// 编辑表单
const editForm = reactive({
  id: 0,
  code: '',
  name: '',
  specificName: '',
  category: '',
  status: 'normal',
  description: '',
  properties: {}
})

// 表单验证规则
const editFormRules = {
  name: [
    { required: true, message: '请输入部件名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择部件分类', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择部件状态', trigger: 'change' }
  ]
}

// 计算属性
const editDialogTitle = computed(() => {
  return isEditMode.value ? '修改部件信息' : '新增部件'
})

const currentCategoryProperties = computed(() => {
  return categoryProperties[editForm.category] || []
})

// 工具函数
const getCategoryLabel = (category) => {
  const option = categoryOptions.find(opt => opt.value === category)
  return option ? option.label : category
}

const getCategoryTagType = (category) => {
  const types = {
    'actuator': 'primary',
    'control': 'success',
    'sensor': 'warning',
    'drive': 'danger',
    'power': 'info',
    'structure': '',
    'other': 'info'
  }
  return types[category] || ''
}

const getPropertyLabel = (key) => {
  // 在所有分类属性中查找对应的标签
  for (const category in categoryProperties) {
    const property = categoryProperties[category].find(p => p.key === key)
    if (property) return property.label
  }
  return key
}

const formatPropertyValue = (key, value) => {
  // 查找属性配置，添加单位
  for (const category in categoryProperties) {
    const property = categoryProperties[category].find(p => p.key === key)
    if (property && property.unit) {
      return `${value} ${property.unit}`
    }
  }
  return value
}

// 搜索功能
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchParams.code = ''
  searchParams.name = ''
  searchParams.category = ''
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
    let filteredData = [...originalComponentList.value]
    
    // 2. 编号模糊查询
    if (searchParams.code.trim()) {
      const searchCode = searchParams.code.trim().toLowerCase()
      filteredData = filteredData.filter(item => 
        item.code.toLowerCase().includes(searchCode)
      )
    }
    
    // 3. 名称模糊查询
    if (searchParams.name.trim()) {
      const searchName = searchParams.name.trim().toLowerCase()
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchName) ||
        (item.specificName && item.specificName.toLowerCase().includes(searchName))
      )
    }
    
    // 4. 分类筛选
    if (searchParams.category) {
      filteredData = filteredData.filter(item => 
        item.category === searchParams.category
      )
    }
    
    // 5. 计算分页
    const total = filteredData.length
    const startIndex = (pagination.current - 1) * pagination.size
    const endIndex = Math.min(startIndex + pagination.size, total)
    
    // 6. 更新显示数据
    componentList.value = filteredData.slice(startIndex, endIndex)
    
    // 7. 更新分页信息
    pagination.total = total
    
    loading.value = false
  }, 300)
}

// 新增部件
const handleAdd = () => {
  isEditMode.value = false
  resetEditForm()
  showEditDialog.value = true
}

// 修改部件
const handleEdit = (row) => {
  isEditMode.value = true
  // 深拷贝数据，确保属性对象独立
  Object.assign(editForm, {
    ...row,
    properties: { ...row.properties }
  })
  showEditDialog.value = true
}

// 删除部件（带验证）
const handleDelete = (row) => {
  if (row.usedCount > 0) {
    ElMessage.warning('该部件已被产品调用，无法删除')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除部件 "${row.name}" 吗？`,
    '删除确认',
    {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    }
  ).then(() => {
    const index = originalComponentList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      originalComponentList.value.splice(index, 1)
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

// 分类变化处理
const handleCategoryChange = () => {
  // 清空之前分类的属性
  editForm.properties = {}
  
  // 如果是编辑模式，保留同分类的属性
  if (isEditMode.value) {
    const oldCategory = originalComponentList.value.find(item => item.id === editForm.id)?.category
    if (oldCategory === editForm.category) {
      // 同分类，保留属性
      const original = originalComponentList.value.find(item => item.id === editForm.id)
      if (original && original.properties) {
        editForm.properties = { ...original.properties }
      }
    }
  }
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
        const index = originalComponentList.value.findIndex(item => item.id === editForm.id)
        if (index !== -1) {
          originalComponentList.value[index] = {
            ...originalComponentList.value[index],
            name: editForm.name,
            specificName: editForm.specificName,
            category: editForm.category,
            status: editForm.status,
            description: editForm.description,
            properties: { ...editForm.properties },
            updateTime: new Date().toISOString()
          }
        }
        ElMessage.success('修改成功')
      } else {
        // 新增操作
        const newComponent = {
          id: Date.now(),
          code: `CMP-${new Date().getFullYear()}${String(originalComponentList.value.length + 1).padStart(4, '0')}`,
          name: editForm.name,
          specificName: editForm.specificName,
          category: editForm.category,
          status: editForm.status,
          description: editForm.description,
          usedCount: 0,
          properties: { ...editForm.properties },
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        }
        originalComponentList.value.unshift(newComponent)
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
    specificName: '',
    category: '',
    status: 'normal',
    description: '',
    properties: {}
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

// 初始化
onMounted(() => {
  componentList.value = [...originalComponentList.value]
  loadData()
})
</script>

<style scoped lang="scss">
.components-view {
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

.component-code {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #1890ff;
}

.component-name {
  display: flex;
  align-items: center;
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

.action-buttons {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

// 动态属性表单
.dynamic-properties {
  margin-top: 20px;
  
  .properties-title {
    margin-bottom: 20px;
    
    .divider-text {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  }
  
  .property-unit {
    margin-left: 8px;
    color: #666;
    font-size: 13px;
  }
}

// 详情对话框样式
.detail-content {
  .detail-value {
    font-size: 14px;
    color: #333;
  }
  
  .description-box {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;
    line-height: 1.6;
    color: #333;
  }
  
  .properties-box {
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
    
    .property-item {
      padding: 8px 0;
      
      .property-label {
        font-weight: 500;
        color: #666;
        font-size: 13px;
      }
      
      .property-value {
        color: #333;
        font-size: 14px;
      }
    }
  }
  
  .used-text {
    color: #fa8c16;
    font-weight: 500;
    
    .delete-hint {
      font-size: 12px;
      color: #f56c6c;
      margin-left: 5px;
    }
  }
}
</style>