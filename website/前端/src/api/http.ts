// src/api/http.ts
import axios, {
    type AxiosInstance,
    type AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'

const APP_BASE = import.meta.env.VITE_APP_API_BASE ?? 'http://localhost:8081'
const ML_BASE  = import.meta.env.VITE_ML_API_BASE  ?? 'http://localhost:8011'

// 注入 token 获取方式（默认用 localStorage）
let _getToken: () => string | null = () => localStorage.getItem('token')
export function initHttp(getToken?: () => string | null) {
    if (getToken) _getToken = getToken
}

function withAuth<T extends AxiosInstance>(instance: T): T {
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = _getToken()
        if (token) {
            config.headers = config.headers ?? {}
            ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
        }
        return config
    })
    instance.interceptors.response.use(
        (res: AxiosResponse) => res,
        (err: AxiosError) => Promise.reject(err)
    )
    return instance
}

/** 业务后端（8081） */
export const appApi = withAuth(
    axios.create({ baseURL: APP_BASE, timeout: 30000 })
)

/** 模型后端（8011） */
export const mlApi = withAuth(
    axios.create({ baseURL: ML_BASE, timeout: 30000 })
)

// 兼容旧代码：默认导出 = 业务后端
export default appApi
