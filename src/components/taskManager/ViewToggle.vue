<script setup lang="ts">
import type { TaskViewOption, ViewToggleEmits, ViewToggleProps } from '@/BLL/taskManager/types'

const props = defineProps<ViewToggleProps>()
const emit = defineEmits<ViewToggleEmits>()

function handleSelect(option: TaskViewOption): void {
  if (option.value === props.activeView) {
    return
  }

  emit('change', option.value)
}
</script>

<template>
  <div class="view-toggle d-flex align-center gap-4" role="tablist" aria-label="Task view">
    <button
      v-for="option in options"
      :key="option.value"
      class="view-toggle__item cursor-pointer text-body font-medium"
      :class="{ 'view-toggle__item--active': option.value === activeView }"
      type="button"
      role="tab"
      :aria-selected="option.value === activeView"
      @click="handleSelect(option)"
    >
      <span class="layout-icon" :class="`layout-icon--${option.icon}`" aria-hidden="true"></span>
      {{ option.label }}
    </button>
  </div>
</template>
