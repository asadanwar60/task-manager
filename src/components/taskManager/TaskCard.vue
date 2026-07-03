<script setup lang="ts">
import { computed } from 'vue'
import type {
  ActionMenuItem,
  BaseTone,
  TaskAssigneeAvatar,
  TaskCardEmits,
  TaskCardProps,
} from '@/BLL/taskManager/types'
import BaseActionMenu from '@/components/shared/BaseActionMenu.vue'
import BaseAssigneeStack from '@/components/shared/BaseAssigneeStack.vue'
import BaseChip from '@/components/shared/BaseChip.vue'
import BaseTagList from '@/components/shared/BaseTagList.vue'

const props = defineProps<TaskCardProps>()
const emit = defineEmits<TaskCardEmits>()

const assigneeAvatars = computed<TaskAssigneeAvatar[]>((): TaskAssigneeAvatar[] => {
  return props.manager.getTaskAssigneeAvatars(props.task)
})

const actionItems = computed<ActionMenuItem[]>((): ActionMenuItem[] => [
  {
    id: 'edit',
    label: 'Edit',
    icon: 'edit',
    onClick: handleEdit,
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: 'trash',
    danger: true,
    onClick: handleDelete,
  },
])

const isOverdue = computed<boolean>((): boolean => {
  return props.manager.isOverdue(props.task)
})

const statusLabel = computed<string>((): string => {
  return props.manager.getTaskDisplayStatusLabel(props.task)
})

const priorityLabel = computed<string>((): string => {
  return props.manager.getPriorityLabel(props.task.priority)
})

const dateLabel = computed<string>((): string => {
  return props.manager.formatDisplayDate(props.task.dueDate)
})

const statusTone = computed<BaseTone>((): BaseTone => {
  return props.manager.getTaskDisplayStatusTone(props.task)
})

const priorityTone = computed<BaseTone>((): BaseTone => {
  return props.manager.getPriorityTone(props.task.priority)
})

function handleDragStart(event: DragEvent): void {
  if (!event.dataTransfer) {
    return
  }

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.setData('application/x-task-status', props.task.status)
}

function handleOpen(): void {
  emit('openTask', props.task.id)
}

function handleEdit(): void {
  emit('editTask', props.task.id)
}

function handleDelete(): void {
  emit('deleteTask', props.task.id)
}
</script>

<template>
  <article class="task-card" draggable="true" @click="handleOpen" @dragstart="handleDragStart">
    <div class="task-card__top d-flex align-center justify-between gap-3">
      <BaseChip :label="statusLabel" :tone="statusTone" with-dot />
      <BaseActionMenu :items="actionItems" aria-label="Task actions" />
    </div>

    <h3 class="task-card__title text-card-title text-primary truncate">{{ task.title }}</h3>
    <p class="task-card__description text-card-description text-secondary truncate">
      {{ task.description }}
    </p>

    <div class="task-card__assignee d-flex align-center justify-between gap-3">
      <span class="text-meta text-muted">Assignees :</span>
      <BaseAssigneeStack :avatars="assigneeAvatars" />
    </div>

    <div class="task-card__meta d-flex align-center justify-between gap-3">
      <span class="task-card__date text-meta" :class="{ 'task-card__date--overdue': isOverdue }">
        <span class="layout-icon layout-icon--flag" aria-hidden="true"></span>
        {{ dateLabel }}
      </span>
      <BaseChip :label="priorityLabel" :tone="priorityTone" shape="pill" />
    </div>

    <div v-if="task.tags.length > 0" class="task-card__tags">
      <BaseTagList :tags="task.tags" :max-visible-tags="2" />
    </div>
  </article>
</template>
