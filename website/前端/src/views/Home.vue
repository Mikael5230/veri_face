<template>
  <!-- 背景极光和星空动画 -->
  <div class="aurora-bg"></div>
  <div class="stars-bg">
    <canvas ref="canvasRef" class="stars-canvas"></canvas>
  </div>

  <!-- 顶部导航栏 -->
  <header class="top-nav">
    <div class="nav-logo">
      <br>
    </div>
    <nav>
      <a @click.prevent="go('/')" :class="{active: $route.path==='/' }">Home</a>
      <a @click.prevent="go('/analysis-main')">Analysis</a>
      <a @click.prevent="go('/docs')">Docs</a>
      <a @click.prevent="go('/pricing')">Pricing</a>
      <a @click.prevent="go('/contact')">Contact</a>
    </nav>
  </header>

  <div class="home-card">
    <div class="hero-row">
      <div class="hero-text">

        <!-- 3d文字 -->
        <Text3d
            class="text-8xl font-black max-md:text-6xl"
            text-color="#e7eaf4"
            stroke-color="#b0baff"
            shadow-color="#364a62"
            :stroke-size="2"
            :shadow1-size="5"
            :shadow2-size="12"
            :animate="true"
        >
          VeriAge Pro
        </Text3d>

        <!-- 文字介绍 -->
        <div class="mx-auto text-[35px] font-normal" style="color:rgba(35,3,97,0.4);">
          <br>
          Harness AI to decode age&nbsp;
          <FlipWords
              :words="['Effortlessly', 'Securely', 'Precisely', 'Intelligently', 'Ethically', 'Reliably']"
              :duration="3000"
              class="inline font-bold text-[44px]"
              style="color:#9a14cf; text-shadow:0 2px 16px #c7e7ff;"
          />
          <div class="mt-2 text-lg" style="color:#360783;">
            Precision Age Analytics for Visionary Enterprises
          </div>
        </div>

        <!-- 主页跳转按钮设计 -->
        <div class="btn-group">
          <el-button class="fancy-btn" type="primary" @click="go('/login')" @mousedown="showParticles">
            <i class="el-icon-search" /> Analysis System
          </el-button>
          <el-button class="fancy-btn" @click="go('/register')" @mousedown="showParticles">
            Register
          </el-button>
          <el-button class="fancy-btn" @click="go('/login')" @mousedown="showParticles">
            Login
          </el-button>
          <el-button class="fancy-btn admin" type="info" @click="go('/Admin')" @mousedown="showParticles">
            Admin System
          </el-button>

        </div>

        <div class="stats-row">
          <div class="stat-block">
            <span class="stat-num">{{ userCount }}</span>
            <span class="stat-label">Analyzed Faces</span>
          </div>
          <div class="stat-block">
            <span class="stat-num">{{ clientCount }}</span>
            <span class="stat-label">Business Clients</span>
          </div>
          <div class="stat-block">
            <span class="stat-num">97.3%</span>
            <span class="stat-label">Accuracy Rate</span>
          </div>
        </div>
      </div>
      <div class="hero-img">
        <CosmicPortal
            style="position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
                 width: 350px; height: 350px; pointer-events: none; z-index: 1;
                 border-radius: 40px; overflow: hidden;
                 box-shadow: 0 0 60px 0 #8de4ff40, 0 0 24px 2px #6f5cff90, 0 0 0 10px #ffffff11 inset;
                 background: radial-gradient(circle at 60% 30%, #5841b0 80%, #000a 100%);
                 backdrop-filter: blur(6px) brightness(1.1); border: 2px solid #a5b8fc60;"
            :primary-color="'#76698c'"
            :secondary-color="'#23C4F8'"
            :accent-color="'#FE7EAF'"
            :vortex-color="'#ACB6FF'"
            :portal-complexity="5"
            :crystal-count="13"
        />
        <div class="face-glow"></div>
      </div>
    </div>

    <div class="relative w-full overflow-hidden rounded-lg bg-black/[0.96]">
      <div
          class="absolute flex w-full flex-col items-center justify-center gap-2 p-8 text-center font-heading text-white"
      >
        <span class="text-4xl font-semibold"> Welcome to VeriAge </span>
        <span class="font-sans font-light">The Eye of Artificial Intelligence</span>
      </div>
      <div class="flex">
        <Spline
            :scene="sceneUrl"
            class="mt-24 size-full"
        />
      </div>
    </div>

    <section class="main-section">
      <FeatureGallery
          :images="images"
          :features="features"
      >
        <template #star>
          <svg viewBox="0 0 24 24" width="32" fill="none">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#FFD600"/>
                <stop offset="1" stop-color="#FF5F6D"/>
              </linearGradient>
            </defs>
            <path fill="url(#g1)" d="M12 2l1.4 5.32h5.6L14 11.36l1.4 5.32L12 15.68 8.6 16.68 10 11.36 5 7.32h5.6z"/>
          </svg>
        </template>
        <template #lock>
          <svg viewBox="0 0 24 24" width="32" fill="none">
            <defs>
              <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#70e1f5"/>
                <stop offset="1" stop-color="#ffd194"/>
              </linearGradient>
            </defs>
            <path fill="url(#g2)" d="M12 2a6 6 0 016 6v1h1a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a1 1 0 011-1h1V8a6 6 0 016-6zm0 2a4 4 0 00-4 4v1h8V8a4 4 0 00-4-4z"/>
          </svg>
        </template>
        <template #check>
          <svg viewBox="0 0 24 24" width="32" fill="none">
            <defs>
              <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#43e97b"/>
                <stop offset="1" stop-color="#38f9d7"/>
              </linearGradient>
            </defs>
            <circle fill="url(#g3)" cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" fill="none"/>
          </svg>
        </template>
      </FeatureGallery>

      <h2>Trusted By</h2>
      <div class="logo-wall">
        <img src="https://static-1305146246.cos.ap-shanghai.myqcloud.com/logo/tencent.png" alt="Tencent" />
        <img src="https://static-1305146246.cos.ap-shanghai.myqcloud.com/logo/huawei.png" alt="Huawei" />
        <img src="https://static-1305146246.cos.ap-shanghai.myqcloud.com/logo/baidu.png" alt="Baidu" />
        <img src="https://static-1305146246.cos.ap-shanghai.myqcloud.com/logo/alibaba.png" alt="Alibaba" />
        <img src="https://static-1305146246.cos.ap-shanghai.myqcloud.com/logo/bytedance.png" alt="Bytedance" />
      </div>


      <!-- 弹幕 ：Rotating user testimonials using the Marquee component -->
      <div class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent backdrop-blur-lg border-none shadow-none">
        <!-- Top row marquee -->
        <Marquee pause-on-hover class="[--duration:20s]">
          <ReviewCard
              v-for="review in firstRow"
              :key="review.username"
              :img="review.img"
              :name="review.name"
              :username="review.username"
              :body="review.body"
          />
        </Marquee>
        <!-- Bottom row marquee scrolling in reverse -->
        <Marquee reverse pause-on-hover class="[--duration:20s]">
          <ReviewCard
              v-for="review in secondRow"
              :key="review.username"
              :img="review.img"
              :name="review.name"
              :username="review.username"
              :body="review.body"
          />
        </Marquee>
        <!-- Gradient overlays for fade effect -->
        <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>


      <h2>Consulting</h2>
      <div class="consult-row">
        <span>Need custom solutions? Our team provides consulting services for implementing face age recognition in your business.</span>
        <el-button type="primary" class="fancy-btn" @click="goContact" @mousedown="showParticles">Contact Us</el-button>
      </div>
    </section>
  </div>

  <!-- Dock放底部 -->
  <!-- Dock component at the bottom of the page -->
  <Dock>
    <DockIcon class="dock-icon">
      <a href="https://google.com" target="_blank">
        <img src="@/assets/图标1.png" class="w-5 h-5" />
      </a>
    </DockIcon>
    <DockIcon class="dock-icon">
      <a href="https://github.com" target="_blank">
        <img src="@/assets/图标2.png" class="w-5 h-5" />
      </a>
    </DockIcon>
    <DockIcon class="dock-icon">
      <a href="https://chatgpt.com/" target="_blank">
        <img src="@/assets/图标3.png" class="w-5 h-5" />
      </a>
    </DockIcon>
    <DockIcon class="dock-icon">
      <a href="https://chatgpt.com/" target="_blank">
        <img src="@/assets/图标4.png" class="w-5 h-5" />
      </a>
    </DockIcon>
  </Dock>

  <footer class="page-footer">
    <div>© 2024 FaceAgePro Inc. | All Rights Reserved.</div>
    <!-- ... footer links ... -->
  </footer>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CosmicPortal from '@/components/CosmicPortal.vue'
import FeatureGallery from '@/components/FeatureGallery.vue'

import Dock from '@/components/ui/dock/Dock.vue'
import DockIcon from '@/components/ui/dock/DockIcon.vue'
import DockSeparator from '@/components/ui/dock/DockSeparator.vue'

import imgFast from '@/assets/feature-fast.png'
import imgSafe from '@/assets/feature-safe.png'
import imgAccurate from '@/assets/feature-accurate.png'



import { Text3d } from '@/components/ui/text-3d'
import { FlipWords } from '@/components/ui/flip-words'
import { Spline } from '@/components/ui/spline'


import { Marquee } from '@/components/ui/marquee'
import ReviewCard from '@/components/ui/marquee/ReviewCard.vue'

const sceneUrl = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const images = [imgFast, imgSafe, imgAccurate]
const features = [
  { title: 'Fast Processing', description: 'Speed and efficiency in age analysis.', icon: 'star' },
  { title: 'Privacy Protection', description: 'Data security and privacy ensured.', icon: 'lock' },
  { title: 'Accuracy Rate', description: 'Accurate age predictions based on facial analysis.', icon: 'check' }
]


// Reviews data for the marquee testimonials
const reviews = [
  { name: 'Jack', username: '@jack', body: "I've never seen anything like this before. It's amazing. I love it.", img: 'https://avatar.vercel.sh/jack' },
  { name: 'Jill', username: '@jill', body: "I don't know what to say. I'm speechless. This is amazing.", img: 'https://avatar.vercel.sh/jill' },
  { name: 'John', username: '@john', body: "I'm at a loss for words. This is amazing. I love it.", img: 'https://avatar.vercel.sh/john' },
  { name: 'Jane', username: '@jane', body: "I'm at a loss for words. This is amazing. I love it.", img: 'https://avatar.vercel.sh/jane' },
  { name: 'Jenny', username: '@jenny', body: "I'm at a loss for words. This is amazing. I love it.", img: 'https://avatar.vercel.sh/jenny' },
  { name: 'James', username: '@james', body: "I'm at a loss for words. This is amazing. I love it.", img: 'https://avatar.vercel.sh/james' },
]

// Split reviews into two groups for the marquee
const firstRow = ref(reviews.slice(0, Math.ceil(reviews.length / 2)))
const secondRow = ref(reviews.slice(Math.ceil(reviews.length / 2)))


const router = useRouter()
const $route = useRoute()

function go(path: string) {
  router.push(path)
}
function goContact() {
  window.open('mailto:business@faceagepro.com')
}
function tryDemo() {
  router.push('/analysis-main?demo=1')
}

// 动态数字动画
const userCount = ref(0)
const clientCount = ref(0)
onMounted(() => {
  let uc = 0, cc = 0
  const t1 = setInterval(() => {
    if (uc < 18012) { uc += 97; userCount.value = uc }
    else { userCount.value = 18012; clearInterval(t1) }
  }, 18)
  const t2 = setInterval(() => {
    if (cc < 102) { cc += 3; clientCount.value = cc }
    else { clientCount.value = 102; clearInterval(t2) }
  }, 25)
})

// 星空动画
const canvasRef = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  let w = window.innerWidth, h = window.innerHeight
  canvas.width = w
  canvas.height = h

  // 星星数组
  const stars: {x: number; y: number; r: number; o: number}[] = []
  function genStars() {
    stars.length = 0
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        o: Math.random() * 0.5 + 0.25
      })
    }
  }
  genStars()

  function auroraGradient() {
    const grd = ctx.createLinearGradient(0, 0, w, h)
    grd.addColorStop(0, '#7F4EEA')
    grd.addColorStop(0.5, '#A6C8FF')
    grd.addColorStop(1, 'rgba(93,65,207,0.95)')
    return grd
  }

  function draw() {
    ctx.clearRect(0, 0, w, h)
    // Aurora
    ctx.save()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = auroraGradient()
    ctx.beginPath()
    ctx.ellipse(w/2, h*0.28, w*0.38, h*0.21, Math.PI/7, 0, Math.PI*2)
    ctx.fill()
    ctx.restore()
    // stars
    stars.forEach(star => {
      ctx.save()
      ctx.beginPath()
      ctx.globalAlpha = star.o
      ctx.arc(star.x, star.y, star.r, 0, Math.PI*2)
      ctx.fillStyle = "#fff"
      ctx.shadowColor = "#C2A8FA"
      ctx.shadowBlur = 6
      ctx.fill()
      ctx.restore()
    })
    requestAnimationFrame(draw)
  }
  draw()
  window.addEventListener('resize', () => {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w
    canvas.height = h
    genStars()
  })
})

// 按钮粒子动画
function showParticles(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement
  if (!btn) return
  const part = document.createElement('span')
  part.className = 'btn-particle'
  part.style.left = `${e.offsetX}px`
  part.style.top = `${e.offsetY}px`
  btn.appendChild(part)
  setTimeout(() => btn.removeChild(part), 700)
}
</script>

<style scoped>
/* Aurora、星空背景，与之前类似 */
.aurora-bg {
  position: fixed; z-index: 0; width: 100vw; height: 100vh; top: 0; left: 0; pointer-events: none; overflow: hidden;
}
.aurora-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(100deg,#3b82f6 10%,#a5b4fc 15%,#93c5fd 20%,#ddd6fe 25%,#60a5fa 30%),
  repeating-linear-gradient(100deg,#fff 0%,#fff 7%,transparent 10%,transparent 12%,#fff 16%);
  background-size: 300%, 200%;
  background-position: 50% 50%, 50% 50%;
  opacity: 0.5;
  filter: blur(12px);
  animation: aurora 60s linear infinite;
  z-index: 0;
}
@keyframes aurora { from {background-position: 50% 50%, 50% 50%;} to {background-position: 350% 50%, 350% 50%;}}
.stars-bg {
  position: fixed; z-index: 1; width: 100vw; height: 100vh; top: 0; left: 0; overflow: hidden; pointer-events: none;
}
.stars-canvas { width: 100vw; height: 100vh; display: block; }

/* 顶部导航栏 */
.top-nav {
  z-index: 20; position: relative;
  display: flex; align-items: center; justify-content: space-between;
  max-width: 1180px; margin: 0 auto; padding: 24px 20px 6px 20px;
}
.nav-logo { display: flex; align-items: center; font-size: 1.28rem; font-weight: 700; color: #a394ff;}
.nav-logo img { margin-right: 9px; }
.top-nav nav { display: flex; gap: 24px;}
.top-nav nav a {
  color: #e2e7ffb2; font-weight: 500; text-decoration: none; font-size: 1rem; padding: 3px 11px; border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}
.top-nav nav a.active,
.top-nav nav a:hover { color: #fff; background: #6d6dfd36; }

/* 主体卡片区 */
.home-card {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 36px auto 0;
  padding: 36px 44px 38px 44px;
  color: #421788; /* 改为深灰文字，提升对比 */

  /* 毛玻璃白色背景 */
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);

  /* 细边框 + 柔光渐变 */
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 26px;

  /* 高级感阴影 */
  box-shadow:
      0 4px 30px rgba(0, 0, 0, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.1);

  /* 动态极光边框光效 */
  background-clip: padding-box;
  overflow: hidden;
}

.home-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.5)
  );
  background-size: 200% 200%;
  animation: aurora-border 14s ease-in-out infinite;
  border-radius: inherit;
  pointer-events: none;
}

@keyframes aurora-border {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}


.hero-row {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap;
}
.hero-text { flex: 1.22; min-width: 310px;}
.hero-text .hero-desc {font-size: 1.17rem; margin-bottom: 14px;}
.hero-text .highlight { color: #a8e1fd; font-weight: 600;}
.hero-img { flex: 1; display: flex; align-items: center; justify-content: flex-end; position: relative;}
.hero-img img { max-width: 330px; min-width: 150px; border-radius: 20px; filter: drop-shadow(0 8px 40px #826cff45);}
.face-glow {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  width: 350px; height: 350px; border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, #837fff88 10%, #ed8ff680 60%, transparent 100%);
  opacity: 0.65; z-index: 0;
  animation: faceGlowPulse 3.7s ease-in-out infinite;
}
@keyframes faceGlowPulse {
  0%,100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1);}
  50% { opacity: 0.85; transform: translate(-50%,-50%) scale(1.07);}
}
.btn-group { margin: 36px 0 0 0; display: flex; flex-wrap: wrap; gap: 16px;}
.fancy-btn {
  font-weight: 600; letter-spacing: 0.1em; border-radius: 18px !important;
  font-size: 1.04rem; padding: 0.7em 2.3em; position: relative; overflow: hidden;
  background: linear-gradient(90deg, #7c5fff 35%, #ca6de1 100%);
  border: none; color: #fff;
  box-shadow: 0 4px 18px #8e44ff37, 0 0 0 transparent;
  transition: background 0.3s, box-shadow 0.25s, transform 0.13s;
}
.fancy-btn.demo { background: linear-gradient(90deg,#45ffc2 10%,#51c9ff 100%);}
.fancy-btn.admin { background: linear-gradient(90deg, #c794fa 20%, #7367f0 85%);}
.fancy-btn .el-icon-search, .fancy-btn .el-icon-magic-stick { margin-right: 6px; }
.fancy-btn:before {
  content: ""; position: absolute; top: 50%; left: 50%;
  width: 160%; height: 400%; background: radial-gradient(circle, #fff2 10%, transparent 70%);
  opacity: 0; transform: translate(-50%,-50%) scale(0.6);
  transition: opacity .5s, transform .4s; z-index: 0;
}
.fancy-btn:hover, .fancy-btn:focus {
  background: linear-gradient(90deg, #b77fff 5%, #6a49f5 100%);
  box-shadow: 0 2px 32px #a988ff60; transform: translateY(-3px) scale(1.045);
}
.fancy-btn.demo:hover { background: linear-gradient(90deg,#32fcc6 10%,#38bcfc 100%);}
.fancy-btn:active { transform: scale(0.97);}
.fancy-btn:hover:before, .fancy-btn:focus:before { opacity: 1; transform: translate(-50%,-50%) scale(1.03);}
.btn-particle {
  position: absolute; pointer-events: none; width: 38px; height: 38px;
  margin-left: -19px; margin-top: -19px; border-radius: 50%;
  background: radial-gradient(circle, #cfc3f9 10%, #f3e7ff80 80%, transparent 100%);
  animation: btn-burst .7s cubic-bezier(0.1,0.6,0.8,1);
  opacity: 0.76; z-index: 3;
}
@keyframes btn-burst { 0% { opacity: 0.7; transform: scale(0.2);} 85%{ opacity: 0.42;} 100%{ opacity: 0; transform: scale(2);} }

.stats-row {
  margin-top: 32px; display: flex; gap: 36px;
}
.stat-block {
  background: rgba(65,53,110,0.25); border-radius: 13px; padding: 18px 24px 11px 24px;
  display: flex; flex-direction: column; align-items: center; min-width: 120px; box-shadow: 0 4px 18px #7769ff1a;
}
.stat-num { font-size: 1.45em; font-weight: 700; color: #8ad8fe;}
.stat-label { font-size: 1em; color: #e1deffb2;}

.main-section { margin-top: 40px; }
.info-row { display: flex; gap: 24px; margin: 22px 0 34px 0; flex-wrap: wrap;}
.info-card {
  background: rgba(80,60,145,0.22) !important; border: 1px solid #7264d9 !important;
  border-radius: 18px !important; color: #e0dcff; font-size: 1.09rem; min-width: 230px; flex: 1;
  box-shadow: 0 4px 18px #7e61ff20; display: flex; align-items: center; gap: 16px; padding: 18px 18px 14px 18px;
}
.info-card .icon { font-size: 1.8em; margin-right: 4px; display: flex; align-items: center;}
.logo-wall {
  display: flex; align-items: center; gap: 26px; margin: 20px 0 28px 0;
}
.logo-wall img { height: 36px; filter: grayscale(0.5) brightness(1.12) drop-shadow(0 2px 12px #23234323);}
.logo-wall img:hover { filter: grayscale(0) brightness(1.32);}
.testimonials {
  display: flex; gap: 22px; margin-bottom: 14px; flex-wrap: wrap;
}
.testimonial-card {
  background: rgba(61,41,117,0.20); border-radius: 16px; box-shadow: 0 2px 8px #9485ef18;
  padding: 18px 22px; min-width: 210px; flex: 1 1 210px;
}
.testimonial-card .t-user { color: #97bfff; font-weight: 600; margin-bottom: 5px;}
.testimonial-card .t-text { color: #e9e6ff;}
.consult-row { display: flex; align-items: center; gap: 22px; margin-top: 16px;}
@media (max-width: 950px) {
  .hero-row {flex-direction: column;}
  .hero-img {justify-content: center; margin: 22px 0;}
  .stats-row { flex-direction: column; gap: 12px;}
}
@media (max-width: 700px) {
  .home-card { padding: 19px 4vw 28px 4vw;}
  .main-section { font-size: 1rem;}
  .btn-group { gap: 8px;}
  .logo-wall { gap: 10px;}
}

.page-footer {
  text-align: center; margin-top: 34px; color: #cdc6f8b6; font-size: 1.02em;
  padding: 14px 0 32px 0; background: none;
  display: flex; flex-direction: column; gap: 7px; align-items: center;
}
.footer-links { display: flex; gap: 18px; margin-top: 2px;}
.footer-links a { color: #97a7e8d0; text-decoration: underline; cursor: pointer;}
.footer-links a:hover { color: #fff;}



</style>
