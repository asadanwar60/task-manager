<script setup lang="ts">
import { computed } from 'vue'
import type {
  KanbanBoardEmits,
  KanbanBoardProps,
  KanbanColumnConfig,
  TaskStatus,
} from '@/BLL/taskManager/types'
import KanbanColumn from '@/components/taskManager/KanbanColumn.vue'
import BaseButton from '@/components/shared/BaseButton.vue'

const props = defineProps<KanbanBoardProps>()
const emit = defineEmits<KanbanBoardEmits>()

const columns = computed<KanbanColumnConfig[]>((): KanbanColumnConfig[] => {
  return props.manager.getKanbanColumns()
})

function handleEditTask(taskId: string): void {
  emit('editTask', taskId)
}

function handleOpenTask(taskId: string): void {
  emit('openTask', taskId)
}

function handleDeleteTask(taskId: string): void {
  emit('deleteTask', taskId)
}

function handleCreateTask(status: TaskStatus): void {
  emit('createTask', status)
}
</script>

<template>
  <section class="kanban-board" aria-label="Task board">
    <KanbanColumn
      v-for="column in columns"
      :key="column.status"
      :manager="manager"
      :status="column.status"
      :label="column.label"
      :tone="column.tone"
      @open-task="handleOpenTask"
      @edit-task="handleEditTask"
      @delete-task="handleDeleteTask"
      @create-task="handleCreateTask"
    />

    <BaseButton icon="add" aria-label="Add column" size="sm" />
  </section>
</template>
