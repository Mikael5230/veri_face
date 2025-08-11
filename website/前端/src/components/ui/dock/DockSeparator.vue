<script setup>
import { inject } from 'vue'
import { ORIENTATION_INJECTION_KEY } from './injectionKeys'
import { cn } from '@/lib/utils'

const orientation = inject(ORIENTATION_INJECTION_KEY, "vertical")
</script>

<template>
  <div
      :class="cn(
      'relative block',
      orientation === 'vertical'
        ? 'w-4/5 h-0.5 bg-gray-300 dark:bg-gray-600'
        : 'h-4/5 w-0.5 bg-gray-300 dark:bg-gray-600'
    )"
  ></div>
</template>
