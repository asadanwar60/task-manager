<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { SortDropdownEmits, SortDropdownProps } from '@/BLL/taskManager/types'
import BaseButton from '@/components/shared/BaseButton.vue'

const props = defineProps<SortDropdownProps>()

const emit = defineEmits<SortDropdownEmits>()
const dropdownElement = ref<HTMLElement | null>(null)

function handleSelection(event: Event): void {
  const value = event.target instanceof HTMLSelectElement ? event.target.value : ''
  emit('select', value)
  emit('close')
}

function handleClear(): void {
  emit('clear')
  emit('close')
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (
    props.isOpen &&
    dropdownElement.value &&
    !dropdownElement.value.contains(event.target as Node)
  ) {
    emit('close')
  }
}

function handleDocumentKeyDown(event: KeyboardEvent): void {
  if (props.isOpen && event.key === 'Escape') {
    emit('close')
  }
}

onMounted((): void => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleDocumentKeyDown)
})

onBeforeUnmount((): void => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeyDown)
})
</script>

<template>
  <div ref="dropdownElement" class="toolbar-dropdown">
    <BaseButton
      icon="sort"
      label="Sort"
      variant="ghost"
      size="md"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="emit('toggle')"
    />

    <div v-if="isOpen" class="toolbar-dropdown__panel">
      <label class="toolbar-dropdown__field">
        <span>Sort by</span>
        <select :value="selectedValue" @change="handleSelection">
          <option value="">Default order</option>
          <option
            v-for="option in options"
            :key="`${option.key}-${option.direction}`"
            :value="`${option.key}:${option.direction}`"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <BaseButton label="Clear Sort" variant="outline" size="sm" @click="handleClear" />
    </div>
  </div>
</template>
