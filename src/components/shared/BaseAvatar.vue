<script setup lang="ts">
import type { BaseAvatarProps } from '@/BLL/taskManager/types'

withDefaults(defineProps<BaseAvatarProps>(), {
  isUnassigned: false,
})
</script>

<template>
  <span
    class="base-avatar d-grid place-center font-semibold"
    :class="[
      `base-avatar--${tone}`,
      { 'base-avatar--unassigned': isUnassigned },
    ]"
    :aria-label="label"
    :data-tooltip="label"
    :title="label"
    role="img"
  >
    <template v-if="!isUnassigned">{{ initials }}</template>
  </span>
</template>
