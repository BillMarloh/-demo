<template>
  <div class="datasource-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">数据源管理</h1>
        <p class="page-description">管理和配置各种数据源连接</p>
      </div>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加数据源
      </el-button>
    </div>

    <!-- 数据源列表 -->
    <el-card class="datasource-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">数据源列表</span>
          <div class="actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索数据源..."
              size="small"
              style="width: 200px;"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table
        :data="filteredDataSources"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="name" label="数据源名称" min-width="150">
          <template #default="{ row }">
            <div class="datasource-info">
              <el-icon class="type-icon" :style="{ color: getTypeColor(row.type) }">
                <component :is="getTypeIcon(row.type)" />
              </el-icon>
              <span class="name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTagType(row.type)" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="host" label="连接地址" min-width="200" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'connected' ? 'success' : row.status === 'ready' ? 'warning' : 'danger'"
              size="small"
            >
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="lastSync" label="最后同步" width="150">
          <template #default="{ row }">
            <span class="last-sync">{{ row.lastSync || '未同步' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                size="small"
                @click="testConnection(row)"
                :loading="connectionTesting && currentTestingId === row.id"
              >
                测试连接
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="syncData(row)"
                :loading="syncInProgress && currentSyncingId === row.id"
                :disabled="row.status !== 'connected'"
              >
                同步数据
              </el-button>
              <el-dropdown @command="(command) => handleAction(command, row)">
                <el-button size="small">
                  更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加数据源对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加数据源"
      width="600px"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="数据源名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入数据源名称" />
        </el-form-item>
        
        <el-form-item label="数据源类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择数据源类型" style="width: 100%">
            <el-option
              v-for="type in dataSourceTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            >
              <el-icon><component :is="type.icon" /></el-icon>
              <span style="margin-left: 8px;">{{ type.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="连接地址" prop="host">
          <el-input v-model="formData.host" placeholder="例: localhost:3306" />
        </el-form-item>
        
        <el-form-item v-if="formData.type !== 'csv'" label="数据库名" prop="database">
          <el-input v-model="formData.database" placeholder="请输入数据库名" />
        </el-form-item>
        
        <el-form-item v-if="formData.type === 'csv'" label="文件路径" prop="path">
          <el-input v-model="formData.path" placeholder="请输入CSV文件路径" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  ArrowDown,
  Database,
  Document,
  Connection
} from '@element-plus/icons-vue'

export default {
  name: 'DataSource',
  components: {
    Plus,
    Search,
    ArrowDown,
    Database,
    Document,
    Connection
  },
  setup() {
    const store = useStore()
    const formRef = ref(null)
    
    // 响应式数据
    const searchQuery = ref('')
    const showAddDialog = ref(false)
    const currentTestingId = ref(null)
    const currentSyncingId = ref(null)
    
    // 表单数据
    const formData = ref({
      name: '',
      type: '',
      host: '',
      database: '',
      path: ''
    })
    
    // 表单验证规则
    const formRules = {
      name: [
        { required: true, message: '请输入数据源名称', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择数据源类型', trigger: 'change' }
      ],
      host: [
        { required: true, message: '请输入连接地址', trigger: 'blur' }
      ]
    }
    
    // 数据源类型配置
    const dataSourceTypes = [
      { value: 'mysql', label: 'MySQL数据库', icon: 'Database' },
      { value: 'redis', label: 'Redis缓存', icon: 'Connection' },
      { value: 'csv', label: 'CSV文件', icon: 'Document' }
    ]
    
    // 计算属性
    const dataSources = computed(() => store.getters['dataSource/dataSources'])
    const connectionTesting = computed(() => store.getters['dataSource/connectionTesting'])
    const syncInProgress = computed(() => store.getters['dataSource/syncInProgress'])
    const loading = ref(false)
    
    const filteredDataSources = computed(() => {
      if (!searchQuery.value) return dataSources.value
      return dataSources.value.filter(ds => 
        ds.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        ds.type.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })
    
    // 工具方法
    const getTypeIcon = (type) => {
      const iconMap = {
        mysql: Database,
        redis: Connection,
        csv: Document
      }
      return iconMap[type] || Database
    }
    
    const getTypeColor = (type) => {
      const colorMap = {
        mysql: '#007AFF',
        redis: '#FF3B30',
        csv: '#34C759'
      }
      return colorMap[type] || '#007AFF'
    }
    
    const getTypeLabel = (type) => {
      const labelMap = {
        mysql: 'MySQL',
        redis: 'Redis',
        csv: 'CSV'
      }
      return labelMap[type] || type
    }
    
    const getTagType = (type) => {
      const typeMap = {
        mysql: 'primary',
        redis: 'danger',
        csv: 'success'
      }
      return typeMap[type] || 'info'
    }
    
    const getStatusLabel = (status) => {
      const labelMap = {
        connected: '已连接',
        ready: '就绪',
        pending: '待连接',
        error: '错误'
      }
      return labelMap[status] || status
    }
    
    // 事件处理
    const testConnection = async (dataSource) => {
      currentTestingId.value = dataSource.id
      try {
        const result = await store.dispatch('dataSource/testConnection', dataSource)
        if (result.success) {
          ElMessage.success(result.message)
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        ElMessage.error('连接测试失败')
      } finally {
        currentTestingId.value = null
      }
    }
    
    const syncData = async (dataSource) => {
      currentSyncingId.value = dataSource.id
      try {
        const result = await store.dispatch('dataSource/syncData', dataSource.id)
        if (result.success) {
          ElMessage.success(result.message)
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        ElMessage.error('数据同步失败')
      } finally {
        currentSyncingId.value = null
      }
    }
    
    const handleAction = async (command, row) => {
      if (command === 'edit') {
        // TODO: 实现编辑功能
        ElMessage.info('编辑功能开发中...')
      } else if (command === 'delete') {
        try {
          await ElMessageBox.confirm('确定要删除这个数据源吗？', '确认删除', {
            type: 'warning'
          })
          store.dispatch('dataSource/deleteDataSource', row.id)
          ElMessage.success('删除成功')
        } catch {
          // 用户取消删除
        }
      }
    }
    
    const handleSubmit = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        store.dispatch('dataSource/addDataSource', formData.value)
        ElMessage.success('添加成功')
        showAddDialog.value = false
        resetForm()
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    const handleCloseDialog = () => {
      resetForm()
      showAddDialog.value = false
    }
    
    const resetForm = () => {
      formData.value = {
        name: '',
        type: '',
        host: '',
        database: '',
        path: ''
      }
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }
    
    onMounted(() => {
      // 初始化数据
    })
    
    return {
      searchQuery,
      showAddDialog,
      currentTestingId,
      currentSyncingId,
      formRef,
      formData,
      formRules,
      dataSourceTypes,
      dataSources,
      connectionTesting,
      syncInProgress,
      loading,
      filteredDataSources,
      getTypeIcon,
      getTypeColor,
      getTypeLabel,
      getTagType,
      getStatusLabel,
      testConnection,
      syncData,
      handleAction,
      handleSubmit,
      handleCloseDialog,
      resetForm
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.datasource-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: $spacing-xl;
    
    .header-content {
      .page-title {
        font-size: $font-size-3xl;
        font-weight: $font-weight-bold;
        color: $text-primary;
        margin-bottom: $spacing-sm;
      }
      
      .page-description {
        font-size: $font-size-md;
        color: $text-secondary;
        margin: 0;
      }
    }
  }
  
  .datasource-card {
    border-radius: $border-radius-lg;
    border: 1px solid $gray-200;
    
    :deep(.el-card__header) {
      background-color: $bg-quaternary;
      border-bottom: 1px solid $gray-200;
      padding: $spacing-md $spacing-lg;
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .title {
          font-size: $font-size-lg;
          font-weight: $font-weight-semibold;
          color: $text-primary;
        }
      }
    }
    
    :deep(.el-table) {
      .datasource-info {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        
        .type-icon {
          font-size: 18px;
        }
        
        .name {
          font-weight: $font-weight-medium;
        }
      }
      
      .last-sync {
        color: $text-tertiary;
        font-size: $font-size-sm;
      }
    }
  }
  
  :deep(.el-dialog) {
    border-radius: $border-radius-lg;
    
    .el-dialog__header {
      padding: $spacing-lg $spacing-lg $spacing-md;
      
      .el-dialog__title {
        font-size: $font-size-lg;
        font-weight: $font-weight-semibold;
        color: $text-primary;
      }
    }
    
    .el-dialog__body {
      padding: 0 $spacing-lg;
    }
    
    .el-dialog__footer {
      padding: $spacing-md $spacing-lg $spacing-lg;
    }
  }
}
</style>
