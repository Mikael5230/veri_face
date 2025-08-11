<template>
  <div class="analysis-main-bg">
    <!-- 背景分层 -->
    <div class="bg-layer stars"></div>
    <div class="bg-layer streams"></div>
    <div class="bg-layer glow-veil"></div>
    <div class="bg-layer specks"></div>
    <div class="bg-layer grain"></div>

    <!-- 页面内容 -->
    <div class="analysis-main-content">
      <ClientOnly>
        <CardContainer>
          <CardBody
              class="group/card relative size-auto rounded-xl border border-black/10 bg-gray-50 p-6 sm:w-[30rem]
                   dark:border-white/20 dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10"
          >
            <CardItem :translate-z="50" class="text-xl font-bold text-neutral-700 dark:text-white">
              Turning Pixels into Age Intelligence
            </CardItem>

            <CardItem as="p" :translate-z="60" class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300">
              Our model blends texture cues, facial geometry, and self-supervised pretraining to estimate age in real
              time—engineering accuracy without sacrificing privacy.
            </CardItem>

            <CardItem :translate-z="100" class="mt-4 w-full">
              <img
                  :src="photo"
                  height="5000"
                  width="1000"
                  class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                  alt="Analysis main background"
              />
            </CardItem>

            <div class="mt-20 flex items-center justify-between">
              <CardItem
                  :translate-z="20"
                  as="a"
                  href="/"
                  class="rounded-xl px-4 py-2 text-xs font-normal text-neutral-700 dark:text-white"
              >
                backhome →
              </CardItem>

              <RouterLink to="/analysis">
                <CardItem
                    :translate-z="20"
                    as="button"
                    class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
                >
                  Get Analysis Started
                </CardItem>
              </RouterLink>
            </div>
          </CardBody>
        </CardContainer>
      </ClientOnly>
    </div>
    <!-- 流星雨（可调数量） -->
    <div class="bg-layer meteor-shower">
      <i style="--x:-15%; --y:6%;  --d:.2s;  --t:9s;"></i>
      <i style="--x:-28%; --y:22%; --d:1.4s; --t:11.5s;"></i>
      <i style="--x:-36%; --y:38%; --d:2.8s; --t:10.2s;"></i>
      <i style="--x:-10%; --y:60%; --d:3.6s; --t:12s;"></i>
      <i style="--x:-24%; --y:75%; --d:4.8s; --t:9.6s;"></i>
      <i style="--x:-32%; --y:85%; --d:6.0s; --t:13s;"></i>
    </div>

  </div>
</template>

<script setup lang="ts">
import photo from '@/assets/analysismain壁纸.jpg'
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d'
</script>

<style scoped>
/* ===== Palette & Base ===== */
.analysis-main-bg{
  --space-0:#02030a;  /* 深空黑 */
  --space-1:#070a18;  /* 过渡 */
  --glow:#f8f9ff;     /* 银白高光 */
  --p1:#6b3bf5;       /* 低饱和紫(主点缀) */
  --p2:#a855f7;       /* 次点缀紫 */
  --indigo:#6366f1;   /* 靛青 */
  --cyan:#6afcff; --amber:#ffd36a; --red:#ff6a6a;

  position:relative;min-height:100vh;overflow:hidden;
  background:
      radial-gradient(1100px 600px at 52% -8%, rgba(255,255,255,.06), transparent 65%),
      linear-gradient(180deg, var(--space-0) 0%, var(--space-1) 60%, var(--space-0) 100%);
  color:#e9eeff;
}
.analysis-main-content{position:relative;z-index:10;max-width:1100px;margin:0 auto;padding:40px 40px 0}

/* Common layer */
.bg-layer{position:absolute;inset:0;pointer-events:none}

/* —— Stars：远/近双层视差 —— */
.stars{background-size:220px 220px;background-repeat:repeat;animation:twinkle 9s linear infinite}
.stars-far{
  opacity:.78;
  background-image:
      radial-gradient(1px 1px at 9% 12%, rgba(255,255,255,.95) 1px, transparent 1.3px),
      radial-gradient(1px 1px at 24% 66%, rgba(255,255,255,.7) 1px, transparent 1.3px),
      radial-gradient(1px 1px at 41% 36%, rgba(255,255,255,.85) 1px, transparent 1.3px),
      radial-gradient(1px 1px at 62% 18%, rgba(255,255,255,.6) 1px, transparent 1.3px);
  animation-duration: 12s;
}
.stars-near{
  opacity:.92;
  background-image:
      radial-gradient(1px 1px at 78% 73%, rgba(255,255,255,.9) 1px, transparent 1.3px),
      radial-gradient(1px 1px at 92% 31%, rgba(255,255,255,.75) 1px, transparent 1.3px),
      radial-gradient(1px 1px at 33% 22%, rgba(255,255,255,.8) 1px, transparent 1.3px);
  background-size: 180px 180px;
  animation-duration: 7s;
}
@keyframes twinkle{0%,100%{opacity:.70;filter:brightness(1)}50%{opacity:.95;filter:brightness(1.12)}}

/* —— Aurora：极薄的紫雾带（慢速） —— */
.aurora{
  mix-blend-mode:screen;opacity:.18;
  background:
      radial-gradient(40% 20% at 30% 25%, rgba(107,59,245,.25), transparent 60%),
      radial-gradient(45% 22% at 68% 18%, rgba(168,85,247,.22), transparent 70%),
      conic-gradient(from 200deg at 50% 15%, rgba(99,102,241,.18), transparent 70%);
  filter: blur(24px);
  animation: aurora-sway 20s ease-in-out infinite alternate;
}
@keyframes aurora-sway{
  0%{transform:translateY(0) translateX(0) scale(1)}
  100%{transform:translateY(2%) translateX(1.2%) scale(1.03)}
}

/* —— 流星小 Canvas —— */
.meteor-canvas{z-index:4}

/* —— 银白流线（保持低调） —— */
.streams{
  z-index:5; mix-blend-mode:screen; opacity:.9; filter:blur(14px) saturate(120%);
  background:
      repeating-conic-gradient(from 200deg at 35% 40%,
      rgba(248,249,255,0) 0deg, rgba(248,249,255,.10) 2deg, rgba(248,249,255,0) 4deg),
      repeating-linear-gradient(12deg,
      rgba(248,249,255,0) 0 10px, rgba(248,249,255,.12) 14px, rgba(248,249,255,0) 24px),
      radial-gradient(800px 500px at 30% 38%, rgba(248,249,255,.26), transparent 60%);
  -webkit-mask: radial-gradient(1200px 600px at 28% 42%, #000 35%, rgba(0,0,0,.85) 55%, transparent 80%);
  mask:         radial-gradient(1200px 600px at 28% 42%, #000 35%, rgba(0,0,0,.85) 55%, transparent 80%);
  animation:stream-drift 18s ease-in-out infinite alternate;
}
@keyframes stream-drift{0%{transform:translateX(0) translateY(0) scale(1.02)}100%{transform:translateX(3%) translateY(2%) scale(1.05)}}

/* —— 高光雾幕 —— */
.glow-veil{
  z-index:6; mix-blend-mode:screen;
  background:
      radial-gradient(220px 260px at 30% 24%, rgba(255,255,255,.95), rgba(255,255,255,.55) 35%, transparent 65%),
      radial-gradient(1000px 600px at 45% 15%, rgba(255,255,255,.10), transparent 70%);
  filter:blur(6px);
}

/* —— 彩色星屑少量点缀 —— */
.specks{
  z-index:7; opacity:.9; mix-blend-mode:screen;
  background-image:
      radial-gradient(2px 2px at 40% 58%, var(--cyan) 2px, transparent 3px),
      radial-gradient(2px 2px at 46% 66%, var(--amber) 2px, transparent 3px),
      radial-gradient(2px 2px at 52% 72%, var(--red) 2px, transparent 3px);
  background-repeat:no-repeat; filter:blur(.3px);
  animation:speck-drift 16s ease-in-out infinite alternate;
}
@keyframes speck-drift{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(1.2%,1.2%,0)}}

/* —— 颗粒 + 暗角 —— */
.grain{
  z-index:8; opacity:.10; mix-blend-mode:soft-light;
  background-image:url("data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
  <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>\
  <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0'/></filter>\
  <rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-size:160px 160px; animation:grainMove 3s linear infinite;
}
@keyframes grainMove{from{background-position:0 0}to{background-position:160px 160px}}

.vignette{
  z-index:9;
  background: radial-gradient(80% 60% at 50% 45%, transparent 60%, rgba(0,0,0,.45) 100%);
}

/* —— 卡片：渐变描边 + 玻璃质感 + Sheen —— */
.card-elevated{
  position:relative;
  background:
      linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)) padding-box,
        /* 微紫色渐变描边（很淡） */
      linear-gradient(120deg, rgba(107,59,245,.35), rgba(168,85,247,.25), rgba(255,255,255,.18)) border-box;
  border:1px solid transparent;
  box-shadow:
      0 8px 28px rgba(0,0,0,.35),
      0 0 0 1px rgba(255,255,255,.05) inset;
}
.card-elevated:hover{
  box-shadow:
      0 16px 48px rgba(0,0,0,.45),
      0 0 0 1px rgba(255,255,255,.06) inset;
}
/* 高光sheen */
.card-sheen{
  pointer-events:none; position:absolute; inset:0; border-radius:inherit; opacity:0;
  background: linear-gradient(100deg, transparent 40%, rgba(255,255,255,.22) 50%, transparent 60%);
  transform: translateX(-40%);
  transition: transform .7s ease, opacity .7s ease;
}
.card-elevated:hover .card-sheen{
  transform: translateX(40%); opacity:.9;
}

/* 动画可访问性 */
@media (prefers-reduced-motion: reduce){
  .stars,.aurora,.streams,.specks,.grain{animation:none}
}

/* ====== Shooting stars (meteor-shower) —— 亮头 + 渐隐尾巴 ====== */
.meteor-shower{
  z-index: 6;   /* 在粒子前或后都行，看你想要的叠加层次 */
  overflow: hidden;
}

/* 单颗流星 */
.meteor-shower i{
  position: absolute;
  left: var(--x, -20%);         /* 起点 X（可被行内样式覆盖） */
  top:  var(--y, 10%);          /* 起点 Y（可被行内样式覆盖）  */
  height: 1px;                  /* 尾巴粗细 */
  width: 160px;                 /* 尾巴长度 */
  transform: rotate(18deg);     /* 飞行角度（你可改 12~24deg） */
  /* 尾巴颜色：前段白，后段淡紫再到透明 */
  background: linear-gradient(90deg,
  rgba(255,255,255,.95) 0%,
  rgba(190,168,255,.45) 45%,
  rgba(190,168,255,0) 100%);
  box-shadow: 0 0 10px 2px rgba(255,255,255,.22);
  filter: drop-shadow(0 0 6px rgba(255,255,255,.35))
  drop-shadow(0 0 16px rgba(170,140,255,.18));
  border-radius: 2px;

  animation: meteor-fall var(--t, 11s) linear infinite;
  animation-delay: var(--d, 0s);
  will-change: transform, opacity;
  opacity: 0;
}

/* 亮头：小光点 + 发光 */
.meteor-shower i::after{
  content: '';
  position: absolute;
  left: -3px; top: -2px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: radial-gradient(circle,
  #fff 0%, #fff 55%, rgba(255,255,255,.6) 75%, transparent 100%);
  filter: blur(.3px) drop-shadow(0 0 8px rgba(255,255,255,.55))
  drop-shadow(0 0 18px rgba(168,119,255,.28));
}

/* 运动轨迹：从屏幕左上向右下掠过，淡入再淡出 */
@keyframes meteor-fall{
  0%   { transform: translate3d(0,0,0) rotate(18deg); opacity: 0; }
  5%   { opacity: 1; }
  100% { transform: translate3d(120vw, 60vh, 0) rotate(18deg); opacity: 0; }
}

/* （可选）在低性能/节能模式下禁用流星动画 */
@media (prefers-reduced-motion: reduce){
  .meteor-shower i{ animation: none; opacity: .35; }
}

</style>