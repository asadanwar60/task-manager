<script setup lang="ts">
import { computed } from 'vue'
import type {
  ActionMenuItem,
  BaseTone,
  TaskActivityEntry,
  TaskAssigneeAvatar,
  TaskDetailDrawerEmits,
  TaskDetailDrawerProps,
} from '@/BLL/taskManager/types'
import BaseActionMenu from '@/components/shared/BaseActionMenu.vue'
import BaseAvatar from '@/components/shared/BaseAvatar.vue'
import BaseAssigneeStack from '@/components/shared/BaseAssigneeStack.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import BaseChip from '@/components/shared/BaseChip.vue'
import BaseTagList from '@/components/shared/BaseTagList.vue'

const props = defineProps<TaskDetailDrawerProps>()
const emit = defineEmits<TaskDetailDrawerEmits>()

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

const activityEntries = computed<TaskActivityEntry[]>((): TaskActivityEntry[] => {
  return props.manager.getTaskActivityEntries(props.task)
})

const createdDateTime = computed<string>((): string => {
  return props.manager.formatLongDateTime(props.task.createdAt)
})

const dueDateLabel = computed<string>((): string => {
  return props.manager.formatLongDate(props.task.dueDate)
})

const isOverdue = computed<boolean>((): boolean => {
  return props.manager.isOverdue(props.task)
})

const statusLabel = computed<string>((): string => {
  return props.manager.getTaskDisplayStatusLabel(props.task)
})

const kanbanStatusLabel = computed<string>((): string => {
  return props.manager.getStatusLabel(props.task.status, 'list')
})

const kanbanStatusTone = computed<BaseTone>((): BaseTone => {
  return props.manager.getKanbanStatusTone(props.task.status)
})

const statusTone = computed<BaseTone>((): BaseTone => {
  return props.manager.getTaskDisplayStatusTone(props.task)
})

const priorityLabel = computed<string>((): string => {
  return props.manager.getPriorityLabel(props.task.priority)
})

const priorityTone = computed<BaseTone>((): BaseTone => {
  return props.manager.getPriorityTone(props.task.priority)
})

function handleEdit(): void {
  emit('editTask', props.task.id)
}

function handleDelete(): void {
  emit('deleteTask', props.task.id)
}
</script>

<template>
  <aside class="task-detail" role="presentation">
    <button
      class="task-detail__scrim"
      type="button"
      aria-label="Close task details"
      @click="emit('close')"
    ></button>

    <section class="task-detail__panel" role="dialog" aria-modal="true" :aria-label="task.title">
      <header class="task-detail__header d-flex align-center justify-between gap-4">
        <BaseButton icon="close" aria-label="Close task details" size="md" @click="emit('close')" />
        <div class="d-flex align-center gap-2">
          <BaseButton icon="history" aria-label="Task history" size="md" />
          <BaseButton icon="star" aria-label="Star task" size="md" />
          <BaseActionMenu :items="actionItems" aria-label="Task actions" size="md" />
        </div>
      </header>

      <div class="task-detail__body">
        <h2 class="task-detail__title">{{ task.title }}</h2>

        <section class="task-detail__properties" aria-label="Task properties">
          <div class="task-detail__property">
            <span class="task-detail__property-label">
              <span class="layout-icon layout-icon--clock" aria-hidden="true"></span>
              Created time
            </span>
            <span class="task-detail__property-value">{{ createdDateTime }}</span>
          </div>

          <div class="task-detail__property">
            <span class="task-detail__property-label">
              <span class="layout-icon layout-icon--status" aria-hidden="true"></span>
              Status
            </span>
            <span class="task-detail__property-value">
              <BaseChip :label="statusLabel" :tone="statusTone" with-dot />
            </span>
          </div>

          <div class="task-detail__property">
            <span class="task-detail__property-label">
              <span class="layout-icon layout-icon--board" aria-hidden="true"></span>
              Kanban Status
            </span>
            <span class="task-detail__property-value">
              <BaseChip :label="kanbanStatusLabel" :tone="kanbanStatusTone" with-dot />
            </span>
          </div>

          <div class="task-detail__property">
            <span class="task-detail__property-label">
              <span class="layout-icon layout-icon--flag" aria-hidden="true"></span>
              Priority
            </span>
            <span class="task-detail__property-value">
              <BaseChip :label="priorityLabel" :tone="priorityTone" shape="pill" />
            </span>
          </div>

          <div class="task-detail__property">
            <span class="task-detail__property-label">
              <span class="layout-icon layout-icon--calendar" aria-hidden="true"></span>
              Due Date
            </span>
            <span
              class="task-detail__property-value"
              :class="{ 'task-detail__property-value--danger': isOverdue }"
            >
              {{ dueDateLabel }}
              <BaseChip v-if="isOverdue" label="Overdue" tone="danger" />
            </span>
          </div>

          <div class="task-detail__property">
            <span class="task-detail__property-label">
              <span class="layout-icon layout-icon--tag" aria-hidden="true"></span>
              Tags
            </span>
            <span class="task-detail__property-value">
              <BaseTagList v-if="task.tags.length > 0" :tags="task.tags" />
              <span v-else class="text-muted">No tags</span>
            </span>
          </div>

          <div class="task-detail__property">
            <span class="task-detail__property-label">
              <span class="layout-icon layout-icon--member" aria-hidden="true"></span>
              Assignees
            </span>
            <span class="task-detail__property-value">
              <BaseAssigneeStack :avatars="assigneeAvatars" />
            </span>
          </div>
        </section>

        <section class="task-detail__description">
          <h3 class="task-detail__section-title">Project Description</h3>
          <p v-if="task.description.trim().length > 0">{{ task.description }}</p>
          <p v-else class="text-muted">No description provided.</p>
        </section>

        <nav class="task-detail__tabs" aria-label="Task detail tabs">
          <button class="task-detail__tab task-detail__tab--active" type="button">Activity</button>
          <button class="task-detail__tab" type="button" disabled>My Work</button>
          <button class="task-detail__tab" type="button" disabled>Assigned</button>
          <button class="task-detail__tab" type="button" disabled>Comments</button>
        </nav>

        <section class="task-detail__activity" aria-label="Activity">
          <h3 class="task-detail__activity-heading">History</h3>
          <div class="task-detail__activity-list">
            <article
              v-for="entry in activityEntries"
              :key="entry.id"
              class="task-detail__activity-item"
            >
              <BaseAvatar
                :initials="manager.getAssigneeInitials(entry.actor)"
                :tone="manager.getAvatarTone(entry.actor)"
                :label="entry.actor"
              />
              <div>
                <p class="task-detail__activity-text">
                  <strong>{{ entry.actor }}</strong>
                  <span>{{ entry.action }}</span>
                  <strong v-if="entry.highlight.length > 0">{{ entry.highlight }}</strong>
                </p>
                <p v-if="entry.time.length > 0" class="task-detail__activity-time">
                  {{ entry.time }}
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  </aside>
</template>
