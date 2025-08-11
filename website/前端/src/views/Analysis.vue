<template>
  <!-- 背景极光动画 -->
  <canvas ref="auroraCanvas" class="aurora-canvas"></canvas>
  <div class="analysis-upload-main">
    <h2 class="main-title">Upload an Image for Analysis</h2>
    <div class="upload-cards">
      <div
          class="upload-card upload-drop"
          @dragover.prevent
          @dragenter.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          :class="{ drag: dragOver }"
      >
        <div class="icon"><i class="el-icon-upload"></i></div>
        <div class="title">Drag & Drop Image</div>
        <div class="desc">Or click below to select</div>
        <el-button class="glow-btn" @click="triggerFile">Choose File</el-button>
        <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onFile" />
      </div>
      <div class="upload-card">
        <div class="icon"><i class="el-icon-camera"></i></div>
        <div class="title">Camera</div>
        <div class="desc">Take photo with your camera</div>
        <el-button class="glow-btn" @click="openCamera">Open Camera</el-button>
      </div>
      <div class="upload-card">
        <div class="icon"><i class="el-icon-video-camera"></i></div>
        <div class="title">Realtime Video</div>
        <div class="desc">Face analysis in video stream</div>
        <el-button class="glow-btn" @click="openVideo">Start Video</el-button>
      </div>
    </div>

    <!-- 预览区 -->
    <div
        class="img-preview"
        v-if="imgUrl || cameraOn || videoOn"
        :style="imgUrl ? `background-image:url('${blurredUrl}')` : 'none'"
    >
      <div v-if="imgUrl" class="preview-wrap">
        <span class="close-btn" @click="clearImg">×</span>
        <img
            :src="imgUrl"
            ref="imgRef"
            :style="`transform:scale(${scale});cursor:${dragging ? 'grabbing' : 'grab'}`"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @wheel.prevent="onWheel"
            alt="preview"
        />
      </div>
      <template v-else>
        <video v-if="cameraOn || videoOn" ref="videoRef" autoplay playsinline width="260"></video>
        <el-button v-if="cameraOn" class="glow-btn" @click="capturePhoto">Capture</el-button>
        <el-button v-if="videoOn" class="glow-btn" @click="analyzeVideo">Analyze Video</el-button>
      </template>
    </div>
    <div v-else class="img-preview empty">
      <i class="el-icon-picture-outline" style="font-size: 42px; color: #aaa"></i>
      <div>No image selected. Drag/click upload or capture one.</div>
    </div>
    <div style="text-align: right">
      <el-button
          type="primary"
          class="glow-btn big"
          @click="analyzeImage"
          :loading="loading"
          :disabled="!imgUrl"
      >
        Analyze Image
      </el-button>
    </div>

    <!-- 分析结果弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        title="Analysis Result"
        width="520px"
        :close-on-click-modal="false"
        destroy-on-close
        append-to-body
    >
      <template v-if="result">
        <el-descriptions :column="1" border>
          <!-- 显示年龄、性别、种族 -->
          <el-descriptions-item v-if="result.age !== undefined" label="Predicted Age">
            {{ result.age }}
          </el-descriptions-item>
          <el-descriptions-item v-if="result.gender !== undefined" label="Gender">
            {{ result.gender }}
          </el-descriptions-item>
          <el-descriptions-item v-if="result.race !== undefined" label="Race">
            {{ result.race }}
          </el-descriptions-item>
          <!-- 显示性别置信度（新接口） -->
          <el-descriptions-item
              v-if="result.gender_confidence !== undefined"
              label="Gender Confidence"
          >
            {{ (result.gender_confidence * 100).toFixed(2) }}%
          </el-descriptions-item>
          <!-- 显示种族置信度（新接口） -->
          <el-descriptions-item
              v-if="result.race_confidence !== undefined"
              label="Race Confidence"
          >
            {{ (result.race_confidence * 100).toFixed(2) }}%
          </el-descriptions-item>
          <!-- 兼容老格式返回的单个置信度 -->
          <el-descriptions-item
              v-if="
              result.confidence !== undefined &&
              result.gender_confidence === undefined &&
              result.race_confidence === undefined
            "
              label="Confidence"
          >
            {{ (result.confidence * 100).toFixed(2) }}%
          </el-descriptions-item>
          <el-descriptions-item
              v-if="
              result.score !== undefined &&
              result.confidence === undefined &&
              result.gender_confidence === undefined &&
              result.race_confidence === undefined
            "
              label="Confidence"
          >
            {{ (result.score * 100).toFixed(2) }}%
          </el-descriptions-item>
          <!-- 业务场景提示 -->
          <el-descriptions-item v-if="explanation" label="Analysis Rensult">
            {{ explanation }}
          </el-descriptions-item>
          <!-- 渲染其他未知字段 -->

        </el-descriptions>
      </template>
      <template #footer>
        <el-button @click="dialogVisible = false">OK</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { mlApi } from '@/api/http'

// 极光背景
const auroraCanvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  nextTick(() => {
    const canvas = auroraCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = window.innerWidth,
        h = window.innerHeight
    canvas.width = w
    canvas.height = h
    function drawAurora() {
      ctx.clearRect(0, 0, w, h)
      for (let band = 0; band < 3; band++) {
        const grad = ctx.createLinearGradient(
            0,
            h * (0.11 + 0.09 * band),
            w,
            h * (0.38 + 0.13 * band),
        )
        grad.addColorStop(
            0,
            `rgba(${130 + band * 38},${100 + band * 40},255,${
                0.16 - band * 0.04
            })`,
        )
        grad.addColorStop(
            0.7,
            `rgba(${98 + band * 65},${80 + band * 40},225,${
                0.13 - band * 0.02
            })`,
        )
        grad.addColorStop(1, 'rgba(100,120,255,0)')
        ctx.globalAlpha = 0.42 - band * 0.1
        ctx.beginPath()
        ctx.ellipse(
            w / 2,
            h * 0.29 + band * 28,
            w * 0.61,
            h * 0.16 + band * 14,
            (Math.PI / 16) * band,
            0,
            2 * Math.PI,
        )
        ctx.fillStyle = grad
        ctx.fill()
      }
      ctx.globalAlpha = 1
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * w,
            y = Math.random() * h * 0.92
        ctx.beginPath()
        ctx.arc(x, y, Math.random() * 1.3 + 0.3, 0, 2 * Math.PI)
        ctx.fillStyle = `rgba(255,255,255,${
            Math.random() * 0.15 + 0.03
        })`
        ctx.shadowColor = '#89e1f8'
        ctx.shadowBlur = Math.random() * 9
        ctx.fill()
        ctx.shadowBlur = 0
      }
      requestAnimationFrame(drawAurora)
    }
    drawAurora()
    window.addEventListener('resize', () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    })
  })
})

// 上传+拖拽
const fileInput = ref<HTMLInputElement | null>(null)
const imgUrl = ref<string | null>(null)
const blurredUrl = ref<string | null>(null)
const dragOver = ref(false)
function triggerFile() {
  fileInput.value?.click()
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) loadImg(file)
}
function handleDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) loadImg(file)
}
function loadImg(file: File) {
  // 保存文件以便后续分析
  selectedFile.value = file
  const url = URL.createObjectURL(file)
  imgUrl.value = url
  blurImage(url)
  cameraOn.value = false
  videoOn.value = false
  stopStream()
}
function clearImg() {
  imgUrl.value = null
  blurredUrl.value = null
  scale.value = 1
  dragPos.x = dragPos.y = 0
}

// 图片预览区 - 拖动/缩放
const imgRef = ref<HTMLImageElement | null>(null)
const scale = ref(1)
const dragging = ref(false)
const dragPos = { x: 0, y: 0 }
let dragStart = { x: 0, y: 0 }
function startDrag(e: MouseEvent) {
  dragging.value = true
  dragStart = {
    x: e.clientX - dragPos.x,
    y: e.clientY - dragPos.y,
  }
}
function onDrag(e: MouseEvent) {
  if (dragging.value) {
    dragPos.x = e.clientX - dragStart.x
    dragPos.y = e.clientY - dragStart.y
    if (imgRef.value)
      imgRef.value.style.transform = `translate(${dragPos.x}px,${dragPos.y}px) scale(${scale.value})`
  }
}
function endDrag() {
  dragging.value = false
}
function onWheel(e: WheelEvent) {
  scale.value = Math.max(
      0.55,
      Math.min(3, scale.value + e.deltaY * -0.002),
  )
  if (imgRef.value)
    imgRef.value.style.transform = `translate(${dragPos.x}px,${dragPos.y}px) scale(${scale.value})`
}

// 模糊背景生成
function blurImage(url: string) {
  const img = new window.Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext('2d')!
    ctx.filter = 'blur(28px) brightness(0.6) saturate(1.15)'
    ctx.drawImage(img, 0, 0, c.width, c.height)
    blurredUrl.value = c.toDataURL()
  }
  img.src = url
}

// 摄像头
const cameraOn = ref(false)
const videoOn = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)
let mediaStream: MediaStream | null = null
function openCamera() {
  cameraOn.value = true
  videoOn.value = false
  imgUrl.value = null
  startStream({ video: { facingMode: 'user' } })
}
function openVideo() {
  videoOn.value = true
  cameraOn.value = false
  imgUrl.value = null
  startStream({ video: true })
}
function startStream(constraints: MediaStreamConstraints) {
  stopStream()
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    mediaStream = stream
    if (videoRef.value) videoRef.value.srcObject = stream
  })
}
function stopStream() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
    mediaStream = null
  }
}
function capturePhoto() {
  if (!videoRef.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(videoRef.value, 0, 0)
  const dataUrl = canvas.toDataURL('image/png')
  imgUrl.value = dataUrl
  // 将捕获的图像保存为文件，以便上传
  canvas.toBlob((blob) => {
    if (blob) {
      selectedFile.value = new File([blob], 'capture.png', {
        type: 'image/png',
      })
    }
  }, 'image/png')
  blurImage(dataUrl)
  cameraOn.value = false
  stopStream()
}
function analyzeVideo() {
  ElMessage.info('AI实时视频分析...（Demo）')
}

// 当前选中的文件，用于上传分析
const selectedFile = ref<File | null>(null)

// 加载状态
const loading = ref(false)

// 弹窗控制与结果数据
const dialogVisible = ref(false)
interface AnalysisResult {
  age?: number
  gender?: string
  race?: string
  gender_confidence?: number
  race_confidence?: number
  confidence?: number
  score?: number
  [key: string]: any
}
const result = ref<AnalysisResult | null>(null)

// 读取当前登录角色（假设登录时已将 role 存入 localStorage）
const currentRole = ref<string>('');
try {
  currentRole.value = localStorage.getItem('role') || '';
} catch {}
/*
 * 角色分组映射到业务场景。
 * Government: ICA, Police security, Airline staff, admin
 * Age-Restricted: Gambling casino, Alcohol/Cigarette Retailer, Guardian Model, Movies/Games retailer or platform, E-commerce - Mature area
 * Operator: HR / Company onboarding, Pharmacy / Clinic counter, Smart-Gate Ops, Facility Access Control, Operator
 * User: dividual, student, Tourist, other, user
 */
const ROLE_GROUPS: Record<
    'Government' | 'Age-Restricted' | 'Operator' | 'User',
    string[]
> = {
  Government: ['ICA', 'Police security', 'Airline staff', 'admin'],
  'Age-Restricted': [
    'Gambling casino',
    'Alcohol/Cigarette Retailer',
    'ALcohol/Cigarette Retailer',
    'Guardian Model',
    'Movies/Games retailer or platform',
    'E-commerce - Mature area',
  ],
  Operator: [
    'HR / Company onboarding',
    'Pharmacy / Clinic counter',
    'Smart-Gate Ops',
    'Facility Access Control',
    'Operator',
  ],
  User: ['dividual', 'student', 'Tourist', 'other', 'user'],
}

// 规范化字符串：去除多余空格并转小写，用于比较
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()

// 根据角色名称返回业务场景分类
function getRoleCategory(
    role: string,
): 'Government' | 'Age-Restricted' | 'Operator' | 'User' {
  const r = norm(role || '')
  for (const cat of Object.keys(
      ROLE_GROUPS,
  ) as Array<keyof typeof ROLE_GROUPS>) {
    if (ROLE_GROUPS[cat].some((x) => norm(x) === r)) return cat
  }
  return 'User'
}

// 根据业务场景和年龄生成提示语句
function getBusinessMessage(category: string, age?: number): string {
  const a = age ?? 0
  switch (category) {
    case 'Government':
      return `Government scenario: Use the predicted age (${a}) to verify identity and prevent fraud (ICA), assess suspects or victims (Police), or confirm eligibility for alcohol or content consumption during flights (Airline).`
    case 'Age-Restricted':
      if (a < 18) {
        return `Age-restricted scenario: Predicted age (${a}) indicates underage. Deny access to gambling, alcohol, tobacco, and mature content.`
      }
      return `Age-restricted scenario: Predicted age (${a}) meets the minimum requirement. Verify ID before allowing gambling, alcohol/tobacco purchase, or mature content.`
    case 'Operator':
      return `Operator scenario: Use the predicted age (${a}) to ensure minimal age requirements for onboarding, pharmacy services, smart gates, or facility access. Verify identity for safe operations.`
    case 'User':
    default:
      return `User scenario: Your predicted age is ${a}. Please be aware of age-based restrictions when accessing services like social media, games, or purchases.`
  }
}

// 计算业务提示语，自动根据当前角色分类并结合预测年龄
const explanation = computed(() => {
  if (!result.value) return ''
  const category = getRoleCategory(currentRole.value)
  return getBusinessMessage(category, result.value.age)
})

// 将对象或其他类型格式化为 JSON 字符串
const pretty = (v: any) => {
  try {
    return JSON.stringify(v, null, 2)
  } catch {
    return String(v)
  }
}

async function analyzeImage() {
  if (!imgUrl.value) return
  loading.value = true
  try {
    let file: File
    if (selectedFile.value) {
      // 使用用户上传的文件
      file = selectedFile.value
    } else {
      // 使用预览图，将其转换为 blob 创建文件
      const response = await fetch(imgUrl.value)
      const blob = await response.blob()
      file = new File([blob], 'image.jpg', {
        type: blob.type || 'image/jpeg',
      })
    }
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await mlApi.post('/predict', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    // 根据后端返回格式提取结果
    result.value = (data && (data.result ?? data.data ?? data)) as AnalysisResult
    dialogVisible.value = true
  } catch (err: any) {
    console.error(err)
    const detail =
        err?.response?.data?.detail || err?.message || 'Analysis failed'
    ElMessage.error(detail)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.aurora-canvas {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
.analysis-upload-main {
  position: relative;
  z-index: 2;
  background: rgba(22, 14, 50, 0.88);
  backdrop-filter: blur(18px) saturate(1.12);
  max-width: 1000px;
  margin: 52px auto 0;
  border-radius: 22px;
  box-shadow: 0 8px 36px 0 #7657ee39, 0 1.5px 18px 0 #49edff2a;
  border: 1.8px solid rgba(171, 139, 255, 0.16);
  padding: 44px 36px 28px 36px;
  color: #d6e8ff;
}
.main-title {
  font-size: 2.3rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #eaf3ff;
  text-shadow: 0 2px 18px #9be4fc32;
}
.upload-cards {
  display: flex;
  gap: 34px;
  margin: 32px 0 20px 0;
  justify-content: space-between;
}
.upload-card {
  flex: 1;
  background: linear-gradient(
      122deg,
      rgba(24, 20, 58, 0.97) 64%,
      rgba(91, 203, 244, 0.07),
  );
  border-radius: 15px;
  box-shadow: 0 4px 30px #7c59ff19;
  border: 1.6px solid #b99fff19;
  text-align: center;
  padding: 30px 14px 28px 14px;
  transition: box-shadow 0.21s, transform 0.2s;
  position: relative;
  min-height: 190px;
  overflow: hidden;
}
.upload-drop.drag {
  border: 2.5px dashed #40e8ff;
  box-shadow: 0 8px 26px #76f6ffe0;
}
.upload-card:hover {
  box-shadow: 0 13px 42px #7a4ffd85, 0 2px 20px #5ee4ff31;
  transform: translateY(-4px) scale(1.033);
}
.upload-card .icon {
  font-size: 41px;
  color: #9bbcff;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 13px #8ae2ff5c);
}
.upload-card .title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #e7e7ff;
}
.upload-card .desc {
  font-size: 13px;
  color: #7ad0e3;
  margin-bottom: 13px;
  text-shadow: 0 1px 10px #648aeb17;
}
.img-preview {
  position: relative;
  border: 2.5px dashed #799be6a7;
  min-height: 170px;
  border-radius: 11px;
  background: rgba(19, 18, 33, 0.56);
  margin: 20px 0 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 27px 10px;
  box-shadow: 0 0 24px #b0a1fa32;
  background-size: cover !important;
  background-position: center !important;
  transition: background-image 0.25s;
}
.img-preview.empty {
  background: rgba(19, 18, 33, 0.63);
}
.preview-wrap {
  position: relative;
  display: inline-block;
}
.preview-wrap img {
  max-width: 330px;
  max-height: 185px;
  border-radius: 11px;
  box-shadow: 0 6px 26px #66b7fd48;
  border: 1.2px solid #9ee8ff;
  background: #131b28;
  transition: box-shadow 0.16s;
}
.preview-wrap img:hover {
  box-shadow: 0 14px 40px #98ebfc99;
}
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 26px;
  color: #fff;
  background: #49c2ffa0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 1.5px 12px #2fd2ff49;
  z-index: 3;
  transition: background 0.17s;
}
.close-btn:hover {
  background: #fd6b8daa;
}
.glow-btn {
  background: linear-gradient(95deg, #49c2ff 3%, #b793ff 100%);
  border: none;
  color: #fff;
  font-weight: 700;
  border-radius: 100px;
  font-size: 1.1em;
  padding: 0.6em 1.8em;
  box-shadow: 0 2px 13px #5ce8ff48, 0 2px 18px #7d83ff37;
  transition: filter 0.18s, box-shadow 0.15s, transform 0.15s;
  position: relative;
  overflow: hidden;
}
.glow-btn.big {
  font-size: 1.16em;
  padding: 0.72em 2.6em;
}
.glow-btn:hover {
  filter: brightness(1.17) saturate(1.18) drop-shadow(0 2px 17px #fff9);
  box-shadow: 0 7px 34px #a1e4ff, 0 2px 22px #fff8;
}
.glow-btn:active {
  transform: scale(0.97);
}
.history-list {
  margin-top: 30px;
}
.history-item {
  display: flex;
  align-items: center;
  margin-bottom: 9px;
}
/* 显示 JSON 字符串的格式 */
.extra {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
