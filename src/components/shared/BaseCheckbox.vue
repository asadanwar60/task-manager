<script setup lang="ts">
import type { BaseCheckboxEmits, BaseCheckboxProps } from '@/BLL/taskManager/types'

withDefaults(defineProps<BaseCheckboxProps>(), {
  disabled: false,
})

const emit = defineEmits<BaseCheckboxEmits>()

function handleChange(event: Event): void {
  if (event.target instanceof HTMLInputElement) {
    emit('change', event.target.checked)
  }
}
</script>

<template>
  <label class="base-checkbox" @click.stop @dblclick.stop>
    <input
      class="base-checkbox__input"
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      :aria-label="accessibleLabel"
      @change="handleChange"
    />
    <span class="base-checkbox__control" aria-hidden="true"></span>
  </label>
</template>
