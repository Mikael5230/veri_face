<template>
  <div class="register-bg">
    <!-- 背景流动粒子特效层 -->
    <div class="register-particles"></div>
    <!-- 半透明毛玻璃卡片 -->
    <div class="register-glass">
      <div class="register-card animate__animated animate__fadeInDown">
        <!-- 顶部动态渐变光圈+LOGO -->
        <div class="register-logo">
          <svg width="60" height="60">
            <defs>
              <radialGradient id="shine" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stop-color="#a5fffa" />
                <stop offset="60%" stop-color="#6236ff" />
                <stop offset="100%" stop-color="#1c0e32" />
              </radialGradient>
            </defs>
            <circle cx="30" cy="30" r="26" fill="url(#shine)">
              <animate attributeName="r" values="24;28;24" dur="3.2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
        <h2 class="register-title">Create Your Account</h2>

        <el-form
            :model="form"
            :rules="rules"
            ref="formRef"
            label-width="98px"
            class="reg-form"
        >
          <el-form-item label="Username" prop="username">
            <el-input
                v-model="form.username"
                maxlength="18"
                show-word-limit
                placeholder="Enter your username"
            />
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input
                v-model="form.email"
                placeholder="Enter your email"
            />
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input
                v-model="form.password"
                type="password"
                show-password
                placeholder="Create a password (min 6 chars)"
            />
          </el-form-item>

          <!-- 角色 下拉框 -->
          <el-form-item label="role" prop="role">
            <el-select
                v-model="form.role"
                placeholder="Please select a role for ur business aim"
                filterable
                clearable
            >
              <el-option
                  v-for="item in roles"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
                type="primary"
                class="glow-btn-particles"
                :loading="loading"
                @click="onSubmit"
                @mousemove="btnParticles"
                ref="regBtn"
            >
              <span>Register</span>
              <span class="btn-particles" ref="particles"></span>
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-link">
          Already have an account?
          <el-link type="primary" @click="goLogin">Login here</el-link>
        </div>

        <!-- 卡片下方淡淡极光 -->
        <div class="neon-aurora"></div>
      </div>
    </div>
    <!-- 前景彩色粒子流（极光感） -->
    <div class="register-aurora-particles"></div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios';
import http from '@/api/http'
import { reactive } from 'vue'
import type { FormInstance } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const formRef = ref<FormInstance>()
const regBtn = ref<HTMLElement>()
const particles = ref<HTMLElement>()
const loading = ref(false)

//
const form = reactive({
  username: '',
  email: '',
  password: '',
  role: 'user'
})
const errorMessage = ref('');  // 注册错误提示

// 2. 角色选项
// 仅 label 变更；value 仍与后端一致
const roles = [
  // System
  { label: 'admin', value: 'admin' },


  // Government
  { label: 'ICA', value: 'Government' },
  { label: 'Police security', value: 'Government' },
  { label: 'Airline staff', value: 'Government' },

  // Law limit
  { label: 'Gambling casino', value: 'age-restricted ' },
  { label: 'Alcohol/Cigarette Retailer', value: 'age-restricted ' },
  { label: 'Guardian Model', value: 'age-restricted' },//social medio and home control
  { label: 'Movies/Games retailer or platform', value: 'age-restricted' },
  { label: 'E-commerce - Mature area', value: 'age-restricted' },


  // facility operator
  { label: 'HR / Company onboarding', value: 'Operator' },
  { label: 'Pharmacy / Clinic counter', value: 'Operator' },
  { label: 'Smart-Gate Ops', value: 'Operator' },
  { label: 'Facility Access Control', value: 'Operator' },


  // self - user
  { label: 'dividual', value: 'user' },
  { label: 'student', value: 'user' },
  { label: 'Tourist', value: 'user' },
  { label: 'other', value: 'user' },



]

// 3. 校验规则
const rules = {
  username: [
    { required: true, message: 'Username required', trigger: 'blur' },
    { min: 2, message: 'At least 2 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: 'Password required', trigger: 'blur' },
    { min: 6, message: 'Min 6 chars', trigger: 'blur' }
  ],
  role: [
    { required: true, message: 'pls select agin', trigger: 'change' }
  ]
}

//
const onSubmit = () => {
  // 先走 ElementForm 的校验
  formRef.value?.validate(async valid => {
    if (!valid) return

    loading.value = true
    try {
      // 调用后端 /register 接口
      await http.post('/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,              // value 要是后端允许的枚举
      })

      ElMessage.success('注册成功，请登录！')
      // 注册完成后跳转到登录页
      router.push('/login')
    }
    catch (err: unknown) {
      let msg = 'Registration failed！！！！！ Please try again later'
      // 1) 先判断是不是 AxiosError
      if (axios.isAxiosError(err)) {
        // 2) 再判断 err.response、response.data.detail 等是否存在
        msg = err.response?.data?.detail
            || err.response?.data?.message
            || msg
      }
      ElMessage.error(msg)
    }
    finally {
      loading.value = false
    }
  })
}

// 5. 按钮粒子特效
function btnParticles(e: MouseEvent) {
  if (!particles.value) return
  const btn = regBtn.value!
  const rect = btn.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  particles.value.innerHTML = ''
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span')
    p.className = 'particle'
    p.style.left = `${x + Math.random() * 48 - 24}px`
    p.style.top = `${y + Math.random() * 22 - 11}px`
    p.style.background = `radial-gradient(circle at 50% 50%, #a9faff 50%, #6541fa 100%, #fff0)`
    p.style.opacity = String(Math.random() * 0.7 + 0.3)
    particles.value.appendChild(p)
    setTimeout(() => p.remove(), 760)
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
@import 'animate.css';

/* 1. 背景渐变+星星特效 */
.register-bg {
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0; left: 0;
  z-index: 0;
  overflow: auto;
  background: radial-gradient(ellipse 100% 80% at 60% 15%, #25194d 0%, #221943 55%, #130b27 100%),
  linear-gradient(100deg, #4531c2 0%, #292348 52%, #130b27 100%);
}
.register-particles {
  pointer-events: none;
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 0;
  background-image:
      repeating-radial-gradient(circle at 10% 20%, #9dd1ff88 0px, #9dd1ff88 1px, transparent 2px, transparent 100px),
      repeating-radial-gradient(circle at 60% 80%, #86caff99 0px, #86caff99 1px, transparent 2px, transparent 130px),
      repeating-radial-gradient(circle at 90% 10%, #fff1fa44 0px, #fff1fa44 1.4px, transparent 3px, transparent 110px),
      repeating-radial-gradient(circle at 80% 55%, #a7e7d977 0px, #a7e7d977 1.2px, transparent 3px, transparent 140px);
  opacity: .23;
  animation: bgmove 18s linear infinite alternate;
}
@keyframes bgmove {
  0% { background-position: 0 0,0 0,0 0,0 0; }
  100% { background-position:100px 80px,150px 210px,70px 60px,230px 70px; }
}

/* 2. 毛玻璃 & 卡片 */
.register-glass {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(22,14,36,0.08);
  backdrop-filter: blur(18px) brightness(1.08);
}
.register-card {
  position: relative;
  background: rgba(24,22,38,0.98);
  border-radius: 26px;
  box-shadow:0 10px 60px #3e24ff2a,0 3px 22px #00e2ff2c,0 2px 36px #1f005510;
  padding:52px 44px 32px 44px;
  min-width:420px; max-width:450px;
  border:2.4px solid transparent;
  border-image:linear-gradient(120deg,#44e2ff 10%,#9e31ff 45%,#ff90e9 75%,#1cfbff 100%) 1;
  transition:box-shadow .38s,border .28s; z-index:9;
}
.register-card:hover {
  box-shadow:0 8px 44px #34c1ff45,0 2px 32px #ed6cff44,0 0 0 8px #1cfbff18;
  border-color:#8fe3ff #c2a2ff #ffafea #8efeff;
}

/* 3. 顶部 Logo & 标题 */
.register-logo { display:flex;justify-content:center; margin:-18px 0 -6px; }
.register-title {
  font-size:2.1rem;font-weight:800;letter-spacing:1.1px;
  background:linear-gradient(95deg,#d5f7ff 10%,#8e97ff 45%,#ff8be9 70%,#7f54ff 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  margin-bottom:28px;text-align:center;
}

/* 4. 表单 & 控件 */
.el-form-item__label {
  color:#e6d7ff;font-size:1.03rem;font-weight:600;
  letter-spacing:.01em;text-shadow:0 2px 12px #4621ff34;
}
.el-input__inner, .el-input input {
  background:rgba(44,56,98,0.27);
  border:1.5px solid #44e2ff80;border-radius:9px;
  color:#dbfaff;font-size:1.08rem;padding:10px 16px;
  box-shadow:0 1.5px 8px #31f3ff18 inset;transition:border-color .2s;
}
.el-input__inner:focus, .el-input input:focus {
  border-color:#e298ff; box-shadow:0 0 0 3px #bd64ff45;
  background:rgba(255,252,255,0.19);
}

/* 5. 按钮 粒子特效 */
.glow-btn-particles {
  position:relative;overflow:visible!important;
  background:linear-gradient(92deg,#4f6fff 10%,#2af9ff 60%,#ea8fff 100%);
  border:none;color:#fff;font-weight:700;font-size:1.14rem;
  border-radius:13px;box-shadow:0 2px 18px 2px #2af9ff60,0 1px 8px #6e24ff26;
  padding:12px 36px;cursor:pointer;letter-spacing:.08em;transition:box-shadow .2s,background .23s;z-index:2;
}
.glow-btn-particles:hover {
  background:linear-gradient(90deg,#31f3ff 8%,#e98fff 88%);
  box-shadow:0 6px 30px #c0faff9c,0 1px 24px #e98fff60;
}
.btn-particles { pointer-events:none; position:absolute; top:0;left:0;right:0;bottom:0; border-radius:12px; }
.particle {
  position:absolute;width:12px;height:12px;border-radius:50%;opacity:.5;
  animation:particle-fade .88s cubic-bezier(.61,-.26,.7,1.43);filter:blur(1.2px);
}
@keyframes particle-fade { 0%{opacity:1;transform:scale(.7);}100%{opacity:0;transform:scale(1.3);} }

/* 6. 极光前景 & 底部光晕 & 登录链接 */
.register-aurora-particles { pointer-events:none;position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:3; }
.register-aurora-particles::before,
.register-aurora-particles::after {
  content:'';position:absolute;border-radius:50%;filter:blur(68px);opacity:.23;pointer-events:none;
  animation:auroraMove 12s linear infinite alternate;
}
.register-aurora-particles::before {
  width:340px;height:340px;left:18vw;top:38vh;
  background:radial-gradient(circle at 65% 45%,#44fff6 0,#6731d7 60%,#fff0 100%);
}
.register-aurora-particles::after {
  width:400px;height:350px;left:62vw;top:10vh;
  background:radial-gradient(circle at 50% 50%,#ff8be9 0,#2b66d3 60%,#fff0 100%);
  animation-delay:4s;
}
@keyframes auroraMove { 0%{transform:scale(1) translateY(0);opacity:.21;}80%{opacity:.38;}100%{transform:scale(1.18) translateY(28px);opacity:.25;} }

.neon-aurora {
  position:absolute;left:15%;right:15%;bottom:-28px;height:44px;z-index:1;
  border-radius:38px;pointer-events:none;
  background:radial-gradient(circle at 60% 30%,#38faff40 0,#cf78ff22 70%,#fff0 100%);
  filter:blur(12px);
}

.login-link {
  margin-top:28px;text-align:center;color:#b3beff;font-size:1.04rem;
}
.login-link .el-link {
  color:#7ceaff;font-weight:700;margin-left:7px;text-shadow:0 1px 18px #97ffe740;
}

@media (max-width:640px) {
  .register-card {
    min-width:95vw;max-width:99vw;padding:22px 2vw 16px 2vw;
  }
  .register-title { font-size:1.13rem; }
}
</style>
