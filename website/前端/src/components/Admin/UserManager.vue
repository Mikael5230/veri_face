<template>
  <div class="user-manager">
    <!-- 顶部工具栏：搜索框 + 添加按钮 -->
    <el-row justify="space-between" align="middle" class="toolbar">
      <el-col>
        <el-input
            v-model="searchText"
            placeholder="search for username or ID"
            clearable
            prefix-icon="el-icon-search"
            @clear="onSearchClear"
            @keyup.enter="onSearch"
            class="search-input"
        />
      </el-col>
      <el-col>
        <el-button type="primary" @click="openDialog('create')">Add user</el-button>
      </el-col>
    </el-row>

    <!-- user form -->
    <el-table
        v-loading="loading"
        :data="users"
        stripe
        border
        style="width: 100%; margin-top: 12px;"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="Username" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="role" label="Role" width="120" />
      <el-table-column label="Ative Status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'info'" size="small">
            {{ row.is_active ? 'Active' : 'Inactive' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="Created Time" />
      <el-table-column prop="updated_at" label="Update Time" />
      <el-table-column label="Action" width="180">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openDialog('edit', row)">Edit</el-button>
          <el-button type="danger" size="small" @click="onDelete(row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        background
        layout="prev, pager, next, ->, total, sizes, jumper"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @current-change="loadUsers"
        class="pagination"
    />

    <!-- 弹窗：新增/编辑表单 -->
    <el-dialog
        :title="dialogMode === 'create' ? '添加用户' : '编辑用户'"
        v-model="dialogVisible"
        width="500px"
        @close="resetForm"
    >
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          size="medium"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="form.role" placeholder="Pls select new role">
            <el-option label="Admin" value="admin" />
            <el-option label="User" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status" prop="is_active">
          <el-switch v-model="form.is_active" active-text="Activation" inactive-text="Ban" />
        </el-form-item>
        <!-- 新增模式下需要密码 -->
        <el-form-item v-if="dialogMode==='create'" label="Password" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 引入
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { User } from '@/api/adminUser'
import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/adminUser'

// 列表与分页状态
const users = ref<User[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const searchText = ref('')

// 弹窗 + 表单状态
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const formRef = ref()
const form = ref<Partial<User> & { password?: string }>({
  username: '',
  email: '',
  role: 'user',
  is_active: true,
  password: ''
})

// 修复1: 使用计算属性动态生成验证规则
const rules = computed(() => ({
  username: [{ required: true, message: 'Pls enter Username', trigger: 'blur' }],
  email: [
    { required: true, message: 'Pls enter email', trigger: 'blur' },
    { type: 'email', message: 'Error email format', trigger: ['blur','change'] }
  ],
  role: [{ required: true, message: 'Pls selet ur role', trigger: 'change' }],
  is_active: [],
  password: dialogMode.value === 'create'
      ? [{ required: true, message: 'Pls enter password', trigger: 'blur' }]
      : []
}))

// 加载列表
async function loadUsers() {
  loading.value = true
  try {
    const res = await fetchUsers({
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchText.value.trim()
    })
    users.value = res.data.users
    total.value = res.data.total
  } catch {
    ElMessage.error('Failed to get list')
  } finally {
    loading.value = false
  }
}
onMounted(loadUsers)

// 搜索
function onSearch() {
  currentPage.value = 1
  loadUsers()
}
function onSearchClear() {
  searchText.value = ''
  onSearch()
}

// 修复2: 确保正确设置表单初始值
function openDialog(mode: 'create' | 'edit', row?: User) {
  dialogMode.value = mode
  if (mode === 'edit' && row) {
    // 复制所有可编辑字段
    form.value = {
      ...row,
      password: '' // 编辑时不显示密码
    }
  } else {
    form.value = {
      username: '',
      email: '',
      role: 'user',
      is_active: true,
      password: ''
    }
  }
  dialogVisible.value = true
}

// 修复3: 正确处理表单提交
async function onSubmit() {
  try {
    // 验证表单
    await formRef.value.validate()

    if (dialogMode.value === 'create') {
      // 创建新用户
      await createUser({
        username: form.value.username!,
        email: form.value.email!,
        password: form.value.password!,
        role: form.value.role!,
        is_active: form.value.is_active!
      })
      ElMessage.success('Successfully created')
    } else {
      // 更新用户信息
      await updateUser(form.value.id!, {
        username: form.value.username!,
        email: form.value.email!,
        role: form.value.role!,
        is_active: form.value.is_active!,
        // 编辑时不更新密码，除非添加密码字段
      })
      ElMessage.success('Successfully updated')
    }

    dialogVisible.value = false
    loadUsers()
  } catch (err: any) {
    if (err.name !== 'Error') {
      ElMessage.error(err.response?.data?.detail || 'operation failure')
    }
  }
}

// 删除操作
async function onDelete(id: number) {
  try {
    await ElMessageBox.confirm('Confirm deletion？', 'prompt message', { type:'warning' })
    await deleteUser(id)
    ElMessage.success(' Successfully deleted')
    loadUsers()
  } catch {}
}

// 关闭时重置验证
function resetForm() {
  formRef.value?.resetFields()
}
</script>

<style scoped>
.user-manager {
  padding: 20px;
  background: #2e2f33;
  border-radius: 8px;
}
.toolbar {
  margin-bottom: 12px;
}
.search-input {
  width: 260px;
}
.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>