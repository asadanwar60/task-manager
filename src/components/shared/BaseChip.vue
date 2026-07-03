<script setup lang="ts">
import type { BaseChipProps } from '@/BLL/taskManager/types'

withDefaults(defineProps<BaseChipProps>(), {
  shape: 'rounded',
  tone: 'default',
  withDot: false,
})
</script>

<template>
  <span class="base-chip text-badge font-semibold" :class="[`base-chip--${tone}`, `base-chip--${shape}`]">
    <span v-if="withDot" class="base-chip__dot" aria-hidden="true"></span>
    {{ label }}
  </span>
</template>
