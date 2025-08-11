<template>
  <!-- Dock 外层容器，固定右下角 -->
  <div
      class="fixed bottom-4 right-4 z-50"
      ref="dockRef"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
  >
    <!-- 极光渐变边框 -->
    <div class="aurora-border p-[1.5px] rounded-xl shadow-lg">
      <!-- 玻璃模糊背景容器 -->
      <div
          :class="cn(
          'flex gap-3 rounded-xl px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 transition-all',
          orientation === 'vertical' && 'flex-col w-[48px] h-max',
          props.class,
          dockClass,
        )"
      >
        <slot /> <!-- 这里放 DockIcon -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { cn } from '@/lib/utils'
import {
  MOUSE_X_INJECTION_KEY,
  MOUSE_Y_INJECTION_KEY,
  MAGNIFICATION_INJECTION_KEY,
  DISTANCE_INJECTION_KEY,
  ORIENTATION_INJECTION_KEY,
} from './injectionKeys'

const props = defineProps({
  class: { type: null, required: false },
  magnification: { type: Number, default: 10 }, // 缩小默认放大倍率
  distance: { type: Number, default: 300 },
  direction: { type: String, default: "middle" },
  orientation: { type: String, default: "horizontal" },
})

const dockRef = ref(null)
const mouseX = ref(Infinity)
const mouseY = ref(Infinity)
const magnification = computed(() => props.magnification)
const distance = computed(() => props.distance)

const dockClass = computed(() => ({
  "items-start": props.direction === "top",
  "items-center": props.direction === "middle",
  "items-end": props.direction === "bottom",
}))

function onMouseMove(e: MouseEvent) {
  requestAnimationFrame(() => {
    mouseX.value = e.pageX
    mouseY.value = e.pageY
  })
}
function onMouseLeave() {
  requestAnimationFrame(() => {
    mouseX.value = Infinity
    mouseY.value = Infinity
  })
}

provide(MOUSE_X_INJECTION_KEY, mouseX)
provide(MOUSE_Y_INJECTION_KEY, mouseY)
provide(ORIENTATION_INJECTION_KEY, props.orientation)
provide(MAGNIFICATION_INJECTION_KEY, magnification)
provide(DISTANCE_INJECTION_KEY, distance)
</script>

<style scoped>
/* 极光渐变柔光边框 */
.aurora-border {
  background: linear-gradient(100deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3), rgba(255,255,255,0.7));
  background-size: 200% 200%;
  animation: aurora-move 12s ease-in-out infinite;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.3s ease;
}

/* 动画：渐变流动 */
@keyframes aurora-move {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* DockIcon hover 特效 */
::v-deep(.dock-icon img) {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
::v-deep(.dock-icon:hover img) {
  transform: scale(2); /* 轻微放大 */
  box-shadow: 0 4px 12px rgba(255,255,255,0.4);
}
</style>
