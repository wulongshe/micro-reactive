<script setup lang="ts">
import type { Reactive } from 'micro-reactive'

defineProps<{
  count: Reactive<number>
}>()
</script>

<template>
  <button type="button" @click="count(count() + 1)">count is {{ count() }}</button>
</template>
