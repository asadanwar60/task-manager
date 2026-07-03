<script setup lang="ts">
import type { LogoProps } from '@/BLL/taskManager/types'

defineProps<LogoProps>()
</script>

<template>
  <div class="layout-logo" aria-label="Application logo">
    <span class="layout-logo__mark d-grid place-center" aria-hidden="true">
      <span class="layout-logo__mark-icon layout-icon layout-icon--logo-check"></span>
    </span>
    <span class="layout-logo__label text-title text-primary">{{ label }}</span>
  </div>
</template>
