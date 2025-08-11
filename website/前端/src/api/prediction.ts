// src/api/prediction.ts
import axios from 'axios'

// 定义后端返回结果的类型接口
interface PredictionResult {
    age: number;
    gender: string;
    gender_confidence: number;
    race: string;
    race_confidence: number;
}

// 调用后端年龄预测API的函数
export async function predictAge(file: File): Promise<PredictionResult> {
    const formData = new FormData()
    formData.append('file', file)
    // 发送 POST 请求到后端 `/predict` 接口，上传文件:contentReference[oaicite:10]{index=10}
    const response = await axios.post<PredictionResult>('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data  // 返回解析后的 JSON 数据
}
