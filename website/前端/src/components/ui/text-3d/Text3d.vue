<template>
  <div
      :class="[
      'text-3d flex items-center justify-center',
      animate ? 'animate-text-3d' : '',
      props.class
    ]"
      :style="customStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  textColor: { type: String, default: "white" },
  letterSpacing: { type: Number, default: -0.1 },
  strokeColor: { type: String, default: "black" },
  shadowColor: { type: String, default: "yellow" },
  strokeSize: { type: Number, default: 2 },
  shadow1Size: { type: Number, default: 4 },
  shadow2Size: { type: Number, default: 6 },
  class: { type: null, required: false },
  animate: { type: Boolean, default: true },
  animationDuration: { type: Number, default: 1500 },
})

const customStyle = computed(() => ({
  color: props.textColor,
  letterSpacing: `${props.letterSpacing}ch`,
  WebkitTextStroke: `${props.strokeSize}px ${props.strokeColor}`,
  textShadow: `
    ${props.shadow1Size}px ${props.shadow1Size}px 0px ${props.strokeColor},
    ${props.shadow2Size}px ${props.shadow2Size}px 0px ${props.shadowColor}
  `,
  animationDuration: props.animate ? `${props.animationDuration}ms` : undefined
}))
</script>

<style scoped>
.text-3d {
  font-family: inherit;
  paint-order: stroke fill;
}
.animate-text-3d {
  animation: wiggle 1.2s ease-in-out infinite alternate;
  transform-origin: center;
}
@keyframes wiggle {
  0% { transform: rotate(0deg);}
  12% { transform: rotate(5deg);}
  25% { transform: rotate(-5deg);}
  38% { transform: rotate(3deg);}
  50% { transform: rotate(0deg);}
  100% { transform: rotate(0deg);}
}
</style>
