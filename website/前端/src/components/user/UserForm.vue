<template>
  <el-dialog
      :title="mode === 'create' ? '添加用户' : '编辑用户'"
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      width="500px"
  >
    <el-form ref="userFormRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择角色">
          <el-option value="admin" label="管理员" />
          <el-option value="user" label="普通用户" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="is_active">
        <el-switch v-model="form.is_active" active-text="激活" inactive-text="禁用" />
      </el-form-item>
      <!-- 添加模式下显示密码字段 -->
      <el-form-item v-if="mode === 'create'" label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入初始密码" show-password />
      </el-form-item>
    </el-form>
    <!-- 底部操作按钮 -->
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { User } from '@/api/adminUser'

interface UserFormData {
  username: string
  email: string
  role: string
  is_active: boolean
  password?: string
}

// 接收父组件传入的 props
const props = defineProps<{
  visible: boolean
  mode: 'create' | 'edit'
  user: Partial<User>
}>()
const emit = defineEmits(['update:visible', 'submit'])

// 表单本地副本
const form = ref<UserFormData>({
  username: '',
  email: '',
  role: 'user',
  is_active: true,
  password: ''
})

// 当 user 数据变化时更新表单
watch(() => props.user, (newVal) => {
  form.value = {
    username: newVal.username || '',
    email: newVal.email || '',
    role: newVal.role || 'user',
    is_active: newVal.is_active ?? true,
    password: ''
  }
}, { immediate: true })

// 表单验证规则
const rules = computed(() => {
  const baseRules = {
    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
    ],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    is_active: []
  }
  if (props.mode === 'create') {
    return {
      ...baseRules,
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码至少6个字符', trigger: 'blur' }
      ]
    }
  }
  return baseRules
})

const userFormRef = ref()
function submitForm() {
  (userFormRef.value as any).validate((valid: boolean) => {
    if (!valid) return
    // 提交表单数据给父组件
    emit('submit', { ...form.value })
    // 父组件根据返回结果决定是否关闭
  })
}
</script>
