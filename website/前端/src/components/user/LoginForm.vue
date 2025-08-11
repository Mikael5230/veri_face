<template>
  <el-card class="login-card" shadow="hover">
    <h2>Login to Your Account</h2>
    <el-form ref="loginForm" :model="form" :rules="rules" label-position="top" class="login-form">
      <!-- 用户名 -->
      <el-form-item label="username" prop="username">
        <el-input v-model="form.username" placeholder="Enter your username" />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="password" prop="password">
        <el-input type="password" v-model="form.password" placeholder="Enter your password" />
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onLogin" class="login-btn">
          Login
        </el-button>
      </el-form-item>

      <!-- 切换到注册 -->
      <el-form-item class="links">
        <span @click="$emit('switchToRegister')" class="link">
          Go to register
        </span>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from '@/api/http';           // 你的全局 axios 实例
import { useAuthStore } from '@/store/auth' // Pinia auth store
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 定义向父组件发出的事件
const emit = defineEmits<{
  (e: 'loginSuccess'): void
  (e: 'switchToRegister'): void
}>()

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = reactive({
  username: '',
  password: ''
})

// Form 校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 引用 el-form 实例以便校验
const loginForm = ref<InstanceType<typeof import('element-plus')['ElForm']>>()
// 按钮 loading 状态
const loading = ref(false)

/**
 * 提交登录表单
 */
function onLogin() {
  loginForm.value?.validate(async valid => {
    if (!valid) return

    loading.value = true
    try {
      // 直接调用，不用再传 baseURL 也不用手动拼 Authorization
      const res = await axios.post('/login', {
        username: form.username,
        password: form.password
      })
      const { access_token: token, role } = res.data
      // 存 Pinia + localStorage
      authStore.setToken(token)
      authStore.setRole(role || '')
      localStorage.setItem('token', token)

      ElMessage.success('登录成功！')
      emit('loginSuccess')
    } catch (err: any) {
      if (err.response?.status === 401) {
        ElMessage.error('用户名或密码错误')
      } else {
        ElMessage.error('登录失败，请稍后再试')
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-card {
  width: 360px;
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(243, 239, 239, 0.6);
  backdrop-filter: blur(12px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  position: relative;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  animation: fadeIn 0.6s ease-out both;
}

/* 外层高光叠层 */
.login-card::before {
  content: "";
  position: absolute;
  top: -30%;
  left: -30%;
  width: 1000%;
  height: 500%;
  background: radial-gradient(circle at top left,
      rgba(230, 217, 255, 0.6),
      transparent 70%);
  transform: rotate(30deg);
  pointer-events: none;
}

.login-form {
  background: rgba(227, 202, 228, 0.81);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.login-title {
  text-align: center;
  margin-bottom: 1.25rem;
  font-size: 1.625rem;
  font-weight: 600;
  /* 渐变文字 */
  background: linear-gradient(90deg, #7b2ff2, #422735);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-form ::v-deep .el-form-item__label {
  color: #f357a8;
}

.login-form ::v-deep .el-input input {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  border: none;
  color: #fff;
  color: #222;
  /* 改成深灰，便于阅读 */
}

.login-form ::v-deep .el-input input::placeholder {
  color: rgba(243, 87, 168, 0.7);
}

.login-btn {
  width: 100%;
  padding: 0.75rem 0;
  margin-top: 1rem;
  background: linear-gradient(90deg, #7b2ff2, #f357a8);
  border: none;
  border-radius: 0.75rem;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(123, 47, 242, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 12px 32px rgba(123, 47, 242, 0.6);
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.links .link {
  font-size: 0.9rem;
  color: #7b2ff2;
  transition: color 0.2s, text-shadow 0.2s;
  cursor: pointer;
}

.links .link:hover {
  color: #f357a8;
  text-shadow: 0 0 6px #ae8fff80;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>
