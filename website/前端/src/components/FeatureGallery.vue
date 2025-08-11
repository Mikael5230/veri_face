<template>
  <div class="w-full flex flex-col lg:flex-row gap-6">
    <!-- 图片廊 -->
    <div class="flex h-96 w-full gap-2">
      <div
          v-for="(image, index) in images"
          :key="image"
          class="relative flex h-full flex-1 cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ease-in-out hover:flex-[3]"
          @mouseover="activeIndex = index"
      >
        <img
            class="relative h-full w-full object-cover"
            :src="image"
            :alt="`Feature ${index}`"
        />
      </div>
    </div>

    <!-- 文本区域 -->
    <div class="flex flex-col justify-center gap-6 lg:w-1/3">
      <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="p-4 rounded-xl transition-all duration-300"
          :class="[
          'bg-white/10 backdrop-blur-md shadow-lg',
          activeIndex === index ? 'scale-105 border border-blue-400' : 'opacity-70'
        ]"
      >
        <h3 class="text-xl font-bold text-white">{{ feature.title }}</h3>
        <p class="text-sm text-gray-200">{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ref } from "vue";

interface Feature {
  title: string;
  description: string;
}

interface Props {
  images: string[];
  features: Feature[];
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
const activeIndex = ref(0);
</script>

<style scoped>
/* 自定义过渡 */
</style>
