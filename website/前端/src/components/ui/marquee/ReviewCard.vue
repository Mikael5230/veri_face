<template>
  <div class="flex items-start gap-4 p-4">
    <img :src="img" alt="" class="w-12 h-12 rounded-full object-cover" />
    <div>
      <div class="font-semibold">{{ name }} <span class="text-gray-500">{{ username }}</span></div>
      <p class="text-gray-700 dark:text-gray-300 text-sm">{{ body }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  img: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  body: { type: String, required: true },
})
</script>

<style scoped>
/* Add any custom styling here if needed */
</style>
