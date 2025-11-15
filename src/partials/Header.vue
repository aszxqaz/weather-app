<script setup lang="ts">
type Props = {
  loading: boolean;
};
defineProps<Props>();
</script>

<template>
  <header class="py-8 bg-blue-400 text-white shadow-sm shadow-blue-500">
    <div class="constrained">
      <div class="flex items-center gap-4 mb-8 select-none pointer-events-none">
        <img
          class="w-8 h-8"
          :class="loading && 'animate-spin'"
          src="../assets/logo.svg"
        />
        <h1 class="text-2xl font-bold">Weather App</h1>
      </div>
      <slot></slot>
    </div>
  </header>
</template>
