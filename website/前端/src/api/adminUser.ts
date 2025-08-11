// src/api/adminUser.ts
// 新版封装：符合 REST 风格的四个接口 + 类型定义
import http from '@/api/http'

/** 单个用户信息，对应后端 UserResponse */
export interface User {
    id: number
    username: string
    email: string
    role: string
    is_active: boolean
    created_at?: string
    updated_at?: string
}

/** 分页返回结构 */
export interface UserListResponse {
    total: number
    users: User[]
}

/** 创建用户的请求体 */
export interface CreateUserPayload {
    username: string
    email: string
    password: string
    role?: string
    is_active?: boolean
}

/** 更新用户的请求体：所有字段均可选 */
export interface UpdateUserPayload {
    username?: string
    email?: string
    role?: string
    is_active?: boolean
    password?: string
}

/** 获取用户列表（分页 & 搜索） */
export function fetchUsers(params: { page?: number; page_size?: number; search?: string }) {
    return http.get<UserListResponse>('/admin/users', { params })
}

/** 创建新用户 */
export function createUser(data: CreateUserPayload) {
    return http.post<User>('/admin/users', data)
}

/** 更新指定 ID 的用户 */
export function updateUser(id: number, data: UpdateUserPayload) {
    return http.put<User>(`/admin/users/${id}`, data)
}

/** 删除指定 ID 的用户 */
export function deleteUser(id: number) {
    return http.delete(`/admin/users/${id}`)
}
