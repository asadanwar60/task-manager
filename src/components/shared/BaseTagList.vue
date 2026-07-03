<script setup lang="ts">
import { computed } from 'vue'
import type { BaseTagListProps } from '@/BLL/taskManager/types'
import BaseChip from '@/components/shared/BaseChip.vue'

const props = defineProps<BaseTagListProps>()

const visibleLimit = computed<number>(() => {
  if (props.maxVisibleTags === undefined) {
    return props.tags.length
  }

  return Math.max(0, props.maxVisibleTags)
})

const visibleTags = computed<string[]>((): string[] => {
  return props.tags.slice(0, visibleLimit.value)
})

const hiddenTags = computed<string[]>((): string[] => {
  return props.tags.slice(visibleLimit.value)
})

const hiddenCount = computed<number>(() => {
  return hiddenTags.value.length
})

const hiddenTooltip = computed<string>(() => {
  return hiddenTags.value.join(', ')
})
</script>

<template>
  <span class="base-tag-list d-flex align-center gap-2">
    <BaseChip v-for="tag in visibleTags" :key="tag" :label="tag" tone="default" />
    <BaseChip
      v-if="hiddenCount > 0"
      class="base-tag-list__overflow"
      :data-tooltip="hiddenTooltip"
      :label="`+${hiddenCount}`"
      tone="default"
      shape="pill"
    />
  </span>
</template>
