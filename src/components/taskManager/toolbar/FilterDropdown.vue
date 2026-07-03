<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type {
  FilterDropdownEmits,
  FilterDropdownProps,
  TaskPriority,
  TaskStatus,
} from '@/BLL/taskManager/types'
import BaseButton from '@/components/shared/BaseButton.vue'

const props = defineProps<FilterDropdownProps>()

const emit = defineEmits<FilterDropdownEmits>()
const dropdownElement = ref<HTMLElement | null>(null)

function getSelectValue(event: Event): string {
  return event.target instanceof HTMLSelectElement ? event.target.value : ''
}

function handleAssigneeChange(event: Event): void {
  const value = getSelectValue(event)
  emit('assigneeChange', value || null)
}

function handlePriorityChange(event: Event): void {
  const value = getSelectValue(event) as TaskPriority | ''
  emit('priorityChange', value || null)
}

function handleStatusChange(event: Event): void {
  const value = getSelectValue(event) as TaskStatus | ''
  emit('statusChange', value || null)
}

function handleTagChange(event: Event): void {
  const value = getSelectValue(event)
  emit('tagChange', value || null)
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
      icon="filter"
      label="Filter"
      variant="ghost"
      size="md"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="emit('toggle')"
    />

    <div v-if="isOpen" class="toolbar-dropdown__panel">
      <label class="toolbar-dropdown__field">
        <span>Assignee</span>
        <select :value="filters.assignee ?? ''" @change="handleAssigneeChange">
          <option value="">All assignees</option>
          <option v-for="assignee in assigneeOptions" :key="assignee" :value="assignee">
            {{ assignee }}
          </option>
        </select>
      </label>

      <label class="toolbar-dropdown__field">
        <span>Priority</span>
        <select :value="filters.priority ?? ''" @change="handlePriorityChange">
          <option value="">All priorities</option>
          <option v-for="priority in priorityOptions" :key="priority.value" :value="priority.value">
            {{ priority.label }}
          </option>
        </select>
      </label>

      <label class="toolbar-dropdown__field">
        <span>Status</span>
        <select :value="filters.status ?? ''" @change="handleStatusChange">
          <option value="">All statuses</option>
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </label>

      <label class="toolbar-dropdown__field">
        <span>Tags</span>
        <select :value="filters.tag ?? ''" @change="handleTagChange">
          <option value="">All tags</option>
          <option v-for="tag in tagOptions" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </label>

      <BaseButton label="Clear Filters" variant="outline" size="sm" @click="handleClear" />
    </div>
  </div>
</template>
