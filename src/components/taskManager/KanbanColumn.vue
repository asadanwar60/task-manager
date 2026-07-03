<script setup lang="ts">
import { computed, ref } from 'vue'
import type { KanbanColumnEmits, KanbanColumnProps, Task } from '@/BLL/taskManager/types'
import BaseButton from '@/components/shared/BaseButton.vue'
import TaskCard from '@/components/taskManager/TaskCard.vue'

const props = defineProps<KanbanColumnProps>()
const emit = defineEmits<KanbanColumnEmits>()

const isDragOver = ref<boolean>(false)

const tasks = computed<Task[]>((): Task[] => {
  return props.manager.getTasksByStatus(props.status)
})

const emptyStatusLabel = computed<string>((): string => {
  return props.manager.getStatusLabel(props.status, 'empty')
})

function handleDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragOver.value = true

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function handleDragLeave(event: DragEvent): void {
  const nextTarget = event.relatedTarget

  if (
    nextTarget instanceof Node &&
    event.currentTarget instanceof Node &&
    event.currentTarget.contains(nextTarget)
  ) {
    return
  }

  isDragOver.value = false
}

function handleDrop(event: DragEvent): void {
  event.preventDefault()
  isDragOver.value = false

  const taskId = event.dataTransfer?.getData('text/plain') ?? ''

  if (taskId.length === 0) {
    return
  }

  props.manager.moveTo(taskId, props.status)
}

function handleEditTask(taskId: string): void {
  emit('editTask', taskId)
}

function handleOpenTask(taskId: string): void {
  emit('openTask', taskId)
}

function handleDeleteTask(taskId: string): void {
  emit('deleteTask', taskId)
}

function handleCreateTask(): void {
  emit('createTask', props.status)
}
</script>

<template>
  <section
    class="kanban-column"
    :class="[`kanban-column--${tone}`, { 'kanban-column--drag-over': isDragOver }]"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <header class="kanban-column__header d-flex align-center justify-between gap-3">
      <div class="d-flex align-center gap-2">
        <span class="kanban-column__dot" aria-hidden="true"></span>
        <h2 class="kanban-column__title text-body font-medium">{{ label }}</h2>
        <span class="kanban-column__count d-grid place-center text-badge font-semibold">{{ tasks.length }}</span>
      </div>
      <div class="d-flex align-center gap-2">
        <BaseButton icon="add" aria-label="Add task to column" size="sm" @click="handleCreateTask" />
        <BaseButton icon="more" aria-label="Column actions" size="sm" />
      </div>
    </header>

    <TransitionGroup v-if="tasks.length > 0" name="kanban-card" tag="div" class="kanban-column__cards d-flex flex-column gap-4">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :manager="manager"
        :task="task"
        @open-task="handleOpenTask"
        @edit-task="handleEditTask"
        @delete-task="handleDeleteTask"
      />
    </TransitionGroup>

    <div v-else class="kanban-column__empty d-grid place-center text-center">
      <div>
        <span class="kanban-column__empty-icon layout-icon layout-icon--empty-card" aria-hidden="true"></span>
        <p class="text-title text-secondary mb-2">No {{ emptyStatusLabel }} tasks</p>
        <p class="text-caption text-muted">Drop a task here to update its status.</p>
      </div>
    </div>
  </section>
</template>
