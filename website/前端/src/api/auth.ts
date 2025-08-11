// src/api/auth.ts
import axios from './http'

export interface LoginPayload {
    username: string
    password: string
}



export interface RegisterPayload {
    username: string
    password: string
    email: string
    role: string
}


export interface AuthResponse {
    access_token: string
    role?: string
}

// 登录
export function loginUser(data: LoginPayload) {
    return axios.post<AuthResponse>('/login', data)
}

// 注册
export function registerUser(data: RegisterPayload) {
    return axios.post<AuthResponse>('/register', data)
}
