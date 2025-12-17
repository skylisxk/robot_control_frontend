<!-- src/views/DashboardView.vue -->
<template>
  <div class="dashboard-view">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <h1>欢迎进入智能机器人工程数据管理系统！</h1>
        <p class="subtitle">智能化管理，高效协同工作，提升生产效率</p>
        <div class="stats-overview">
          <div class="stat-item">
            <div class="stat-value">356</div>
            <div class="stat-label">今日访问</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1,248</div>
            <div class="stat-label">总用户数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">89.5%</div>
            <div class="stat-label">系统可用率</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">24.6h</div>
            <div class="stat-label">平均响应时间</div>
          </div>
        </div>
      </div>
      <div class="robot-illustration">
        <div class="robot-icon">🤖</div>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="data-stats-section">
      <h2 class="section-title">数据统计</h2>
      <div class="stats-grid">
        <!-- 系统统计 -->
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-title">
              <el-icon color="#1890ff"><Setting /></el-icon>
              <span>系统</span>
            </div>
            <div class="stat-value">2,845</div>
          </div>
          <div class="stat-chart">
            <div class="chart-placeholder">
              <div class="progress-bar" style="width: 75%"></div>
            </div>
            <div class="stat-change positive">
              <el-icon><Top /></el-icon>
              <span>12.5%</span>
            </div>
          </div>
        </div>

        <!-- 制造统计 -->
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-title">
              <el-icon color="#52c41a"><Operation /></el-icon>
              <span>制造</span>
            </div>
            <div class="stat-value">1,536</div>
          </div>
          <div class="stat-chart">
            <div class="chart-placeholder">
              <div class="progress-bar" style="width: 60%"></div>
            </div>
            <div class="stat-change positive">
              <el-icon><Top /></el-icon>
              <span>8.3%</span>
            </div>
          </div>
        </div>

        <!-- 销售统计 -->
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-title">
              <el-icon color="#fa8c16"><TrendCharts /></el-icon>
              <span>销售</span>
            </div>
            <div class="stat-value">892</div>
          </div>
          <div class="stat-chart">
            <div class="chart-placeholder">
              <div class="progress-bar" style="width: 45%"></div>
            </div>
            <div class="stat-change negative">
              <el-icon><Bottom /></el-icon>
              <span>3.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-row">
        <!-- 订单统计 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>订单统计</h3>
            <div class="chart-actions">
              <span class="chart-subtitle">统计维度：订单类型</span>
              <el-select v-model="orderTimeRange" size="small" style="width: 120px;">
                <el-option label="本月" value="month" />
                <el-option label="本季度" value="quarter" />
                <el-option label="本年" value="year" />
              </el-select>
            </div>
          </div>
          <div class="chart-container">
            <div ref="orderChartRef" style="width: 100%; height: 300px;"></div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color sales"></span>
              <span>销售订单</span>
              <span class="legend-value">1,245</span>
            </div>
            <div class="legend-item">
              <span class="legend-color purchase"></span>
              <span>采购订单</span>
              <span class="legend-value">893</span>
            </div>
          </div>
        </div>

        <!-- 部件统计 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>部件统计</h3>
            <div class="chart-actions">
              <span class="chart-subtitle">统计维度：部件分类</span>
              <el-select v-model="componentTimeRange" size="small" style="width: 120px;">
                <el-option label="本月" value="month" />
                <el-option label="本季度" value="quarter" />
                <el-option label="本年" value="year" />
              </el-select>
            </div>
          </div>
          <div class="chart-container">
            <div ref="componentChartRef" style="width: 100%; height: 300px;"></div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color actuator"></span>
              <span>执行器零件</span>
              <span class="legend-value">356</span>
            </div>
            <div class="legend-item">
              <span class="legend-color control"></span>
              <span>控制零件</span>
              <span class="legend-value">287</span>
            </div>
            <div class="legend-item">
              <span class="legend-color drive"></span>
              <span>驱动零件</span>
              <span class="legend-value">412</span>
            </div>
            <div class="legend-item">
              <span class="legend-color electric"></span>
              <span>电气零件</span>
              <span class="legend-value">198</span>
            </div>
            <div class="legend-item">
              <span class="legend-color sensor"></span>
              <span>传感器零件</span>
              <span class="legend-value">156</span>
            </div>
            <div class="legend-item">
              <span class="legend-color other"></span>
              <span>其他MEP零件</span>
              <span class="legend-value">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h2 class="section-title">快速操作</h2>
      <div class="actions-grid">
        <div class="action-card" @click="goToPage('/design/products')">
          <el-icon class="action-icon"><EditPen /></el-icon>
          <div class="action-title">新建设计</div>
          <div class="action-desc">创建新产品设计</div>
        </div>
        <div class="action-card" @click="goToPage('/orders')">
          <el-icon class="action-icon"><DocumentAdd /></el-icon>
          <div class="action-title">处理订单</div>
          <div class="action-desc">查看待处理订单</div>
        </div>
        <div class="action-card" @click="goToPage('/components')">
          <el-icon class="action-icon"><Box /></el-icon>
          <div class="action-title">部件入库</div>
          <div class="action-desc">管理部件库存</div>
        </div>
        <div class="action-card" @click="goToPage('/products')">
          <el-icon class="action-icon"><Goods /></el-icon>
          <div class="action-title">产品发布</div>
          <div class="action-desc">发布新产品</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { 
  Setting, Operation, TrendCharts, Top, Bottom,
  EditPen, DocumentAdd, Box, Goods
} from '@element-plus/icons-vue'

const router = useRouter()

// 图表引用
const orderChartRef = ref(null)
const componentChartRef = ref(null)

// 时间范围选择
const orderTimeRange = ref('month')
const componentTimeRange = ref('month')

// 图表实例
let orderChart = null
let componentChart = null

// 初始化订单统计图表
const initOrderChart = () => {
  if (!orderChartRef.value) return
  
  orderChart = echarts.init(orderChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '订单类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: [
          { value: 1245, name: '销售订单' },
          { value: 893, name: '采购订单' }
        ],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        color: ['#1890ff', '#52c41a']
      }
    ]
  }
  
  orderChart.setOption(option)
}

// 初始化部件统计图表
const initComponentChart = () => {
  if (!componentChartRef.value) return
  
  componentChart = echarts.init(componentChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['执行器', '控制', '驱动', '电气', '传感器', '其他'],
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: [356, 287, 412, 198, 156, 89],
        itemStyle: {
          color: function(params) {
            const colorList = [
              '#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', '#13c2c2'
            ]
            return colorList[params.dataIndex]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '60%'
      }
    ]
  }
  
  componentChart.setOption(option)
}

// 页面跳转
const goToPage = (path) => {
  router.push(path)
}

// 监听窗口大小变化，重新渲染图表
const handleResize = () => {
  orderChart?.resize()
  componentChart?.resize()
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initOrderChart()
    initComponentChart()
  })
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  orderChart?.dispose()
  componentChart?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-view {
  .welcome-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 30px 40px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .welcome-content {
      flex: 1;
      
      h1 {
        font-size: 28px;
        margin-bottom: 12px;
        font-weight: 600;
      }
      
      .subtitle {
        font-size: 16px;
        opacity: 0.9;
        margin-bottom: 30px;
      }
    }
    
    .stats-overview {
      display: flex;
      gap: 40px;
      
      .stat-item {
        text-align: center;
        
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }
    
    .robot-illustration {
      .robot-icon {
        font-size: 120px;
        opacity: 0.3;
      }
    }
  }
}

.data-stats-section {
  margin-bottom: 30px;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    
    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        .stat-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: #333;
          
          .el-icon {
            font-size: 20px;
          }
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #333;
        }
      }
      
      .stat-chart {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .chart-placeholder {
          flex: 1;
          height: 8px;
          background: #f5f5f5;
          border-radius: 4px;
          overflow: hidden;
          
          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #1890ff, #36cfc9);
            border-radius: 4px;
            transition: width 0.3s;
          }
        }
        
        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 20px;
          font-size: 14px;
          font-weight: 500;
          
          &.positive {
            color: #52c41a;
          }
          
          &.negative {
            color: #f5222d;
          }
        }
      }
    }
  }
}

.charts-section {
  margin-bottom: 30px;
  
  .chart-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .chart-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
      
      .chart-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .chart-subtitle {
          font-size: 12px;
          color: #666;
        }
      }
    }
    
    .chart-legend {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 20px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #666;
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          
          &.sales { background: #1890ff; }
          &.purchase { background: #52c41a; }
          &.actuator { background: #1890ff; }
          &.control { background: #52c41a; }
          &.drive { background: #fa8c16; }
          &.electric { background: #f5222d; }
          &.sensor { background: #722ed1; }
          &.other { background: #13c2c2; }
        }
        
        .legend-value {
          margin-left: auto;
          font-weight: 600;
          color: #333;
        }
      }
    }
  }
}

.quick-actions {
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }
  
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    
    .action-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        
        .action-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      }
      
      .action-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 12px;
        font-size: 28px;
        color: #666;
        transition: all 0.3s;
      }
      
      .action-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }
      
      .action-desc {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .data-stats-section .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section .chart-row {
    grid-template-columns: 1fr;
  }
  
  .quick-actions .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    text-align: center;
    padding: 20px;
    
    .stats-overview {
      gap: 20px;
      
      .stat-item .stat-value {
        font-size: 24px;
      }
    }
    
    .robot-illustration {
      display: none;
    }
  }
  
  .data-stats-section .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>