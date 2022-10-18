<script setup lang="ts">
import { useReactive } from 'micro-reactive'

const count = useReactive(0)
</script>

<template>
  <button type="button" @click="count(count() + 1)">count is {{ count() }}</button>
</template>
