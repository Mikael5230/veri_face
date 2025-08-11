// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { ElMessage } from 'element-plus'

// —— 路由组件 ——
import Home from '@/views/Home.vue'
const Register     = () => import('@/views/Register.vue')
const Login        = () => import('@/views/Login.vue')
const AnalysisMain = () => import('@/views/AnalysisMain.vue')
const Upload       = () => import('@/views/Upload.vue')
const Analysis     = () => import('@/views/Analysis.vue')
const Admin        = () => import('@/views/Admin.vue')
const NotFound     = () => import('@/views/NotFound.vue')

const routes: RouteRecordRaw[] = [
    { path: '/login',    name: 'Login',        component: Login,        meta: { guest: true } },
    { path: '/register', name: 'Register',     component: Register,     meta: { guest: true } },
    { path: '/',         name: 'Home',         component: Home,         meta: { requiresAuth: true } },
    { path: '/analysis-main', name: 'AnalysisMain', component: AnalysisMain, meta: { requiresAuth: true } },
    { path: '/upload',   name: 'Upload',       component: Upload,       meta: { requiresAuth: true } },
    { path: '/analysis', name: 'Analysis',     component: Analysis,     meta: { requiresAuth: true } },
    { path: '/Admin',    name: 'Admin',        component: Admin,        meta: { requiresAuth: true, roles: ['admin'] }},
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    // —— 临时直接放行 /admin ——
    if (to.path === '/Admin') {
        return next()
    }

    // 1) /login & /register 永远放行
    if (to.path === '/login' || to.path === '/register') {
        return next()
    }

    // 2) /analysis-main：未登录 → 警告 + 跳登录；已登录 → 放行
    if (to.path === '/analysis-main') {
        if (!auth.isAuthenticated) {
            ElMessage.warning('请先登录才能进入分析系统')
            return next({ path: '/login', query: { redirect: to.fullPath } })
        }
        return next()
    }

    // 3) 其它需要登录的页面：meta.requiresAuth && 未登录 → 警告 + 跳登录
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        ElMessage.warning('pls login')
        return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    // 4) 其余场景：放行
    next()
})

export default router
