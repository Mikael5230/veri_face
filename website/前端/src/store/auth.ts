// src/store/auth.js
// src/store/auth.ts
import { defineStore } from 'pinia'
import { loginUser, LoginPayload, AuthResponse } from '@/api/auth'
import router from '@/router'
import axios from '@/api/http'   // 或者其他你封装的 axios
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    // state
    const token = ref()
    const role  = ref<string>('')

    function setToken(newToken: string) {
        token.value = newToken
    }

    function setRole(newRole: string) {
        role.value = newRole
    }

    // getters
    const isAuthenticated = () => !!token.value

    // actions
    async function login(credentials: LoginPayload) {
        // credentials 已经有了正确的类型：{ username: string; password: string }
        const res = await loginUser(credentials)
        // res.data.token 一定是 string；res.data.role 可能 undefined
        token.value = res.data.access_token
        role.value  = res.data.role ?? ''   // 如果 undefined，就回退到空字符串

        localStorage.setItem('token', token.value)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

        router.push('/')
    }

    function logout() {
        token.value = ''
        role.value = ''
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        router.push('/login')
    }

    return { token, role, setToken,setRole,isAuthenticated, login, logout }
})
