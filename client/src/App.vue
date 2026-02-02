<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
body { font-family: sans-serif; margin: 0; padding: 0; background: #f0f2f5; }
.app-container { max-width: 800px; margin: 0 auto; padding: 20px; }
</style>
