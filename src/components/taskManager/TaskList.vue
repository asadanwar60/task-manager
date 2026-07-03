<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  ActionMenuItem,
  BaseTone,
  KanbanColumnConfig,
  Task,
  TaskAssigneeAvatar,
  TaskListEmits,
  TaskListProps,
  TaskStatus,
} from '@/BLL/taskManager/types'
import BaseActionMenu from '@/components/shared/BaseActionMenu.vue'
import BaseAssigneeStack from '@/components/shared/BaseAssigneeStack.vue'
import BaseCheckbox from '@/components/shared/BaseCheckbox.vue'
import BaseChip from '@/components/shared/BaseChip.vue'
import BaseTagList from '@/components/shared/BaseTagList.vue'

const props = defineProps<TaskListProps>()
const emit = defineEmits<TaskListEmits>()

const dragOverStatus = ref<TaskStatus | null>(null)
const collapsedStatuses = ref<Record<TaskStatus, boolean>>({
  todo: false,
  'in-progress': false,
  done: false,
})

const sections = computed<KanbanColumnConfig[]>((): KanbanColumnConfig[] => {
  return props.manager.getKanbanColumns()
})

function getSectionTasks(status: TaskStatus): Task[] {
  return props.manager.getTasksByStatus(status)
}

function isSectionCollapsed(status: TaskStatus): boolean {
  return collapsedStatuses.value[status]
}

function toggleSection(status: TaskStatus): void {
  collapsedStatuses.value = {
    ...collapsedStatuses.value,
    [status]: !collapsedStatuses.value[status],
  }
}

function getAssigneeAvatars(task: Task): TaskAssigneeAvatar[] {
  return props.manager.getTaskAssigneeAvatars(task)
}

function getAssigneeLabel(task: Task): string {
  return props.manager.getTaskAssigneeLabel(task)
}

function getPriorityTone(task: Task): BaseTone {
  return props.manager.getPriorityTone(task.priority)
}

function getDueDateLabel(task: Task): string {
  return props.manager.formatLongDate(task.dueDate)
}

function getCreatedDateLabel(task: Task): string {
  return props.manager.formatLongDate(task.createdAt)
}

function getActionItems(task: Task): ActionMenuItem[] {
  return [
    {
      id: `edit-${task.id}`,
      label: 'Edit',
      icon: 'edit',
      onClick: (): void => handleEditTask(task.id),
    },
    {
      id: `delete-${task.id}`,
      label: 'Delete',
      icon: 'trash',
      danger: true,
      onClick: (): void => handleDeleteTask(task.id),
    },
  ]
}

function isOverdue(task: Task): boolean {
  return props.manager.isOverdue(task)
}

function handleEditTask(taskId: string): void {
  emit('editTask', taskId)
}

function handleDeleteTask(taskId: string): void {
  emit('deleteTask', taskId)
}

function handleDragStart(event: DragEvent, task: Task): void {
  if (!event.dataTransfer) {
    return
  }

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', task.id)
  event.dataTransfer.setData('application/x-task-status', task.status)
}

function handleDragOver(event: DragEvent, status: TaskStatus): void {
  event.preventDefault()
  dragOverStatus.value = status

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function handleDragLeave(event: DragEvent): void {
  if (
    event.currentTarget instanceof Node &&
    event.currentTarget.contains(event.relatedTarget as Node)
  ) {
    return
  }

  dragOverStatus.value = null
}

function handleDrop(event: DragEvent, destinationStatus: TaskStatus): void {
  event.preventDefault()
  dragOverStatus.value = null

  const taskId = event.dataTransfer?.getData('text/plain') ?? ''

  if (taskId.length === 0) {
    return
  }

  props.manager.moveTo(taskId, destinationStatus)
}

function handleDragEnd(): void {
  dragOverStatus.value = null
}
</script>

<template>
  <section class="task-list" aria-label="Task list grouped by status">
    <section
      v-for="section in sections"
      :key="section.status"
      class="task-list__group"
      :class="[
        `task-list__group--${section.tone}`,
        { 'task-list__group--drag-over': dragOverStatus === section.status },
      ]"
      @dragover="handleDragOver($event, section.status)"
      @dragleave="handleDragLeave"
      @drop="handleDrop($event, section.status)"
    >
      <header class="task-list__group-header">
        <button
          class="task-list__group-toggle-button"
          type="button"
          :aria-expanded="!isSectionCollapsed(section.status)"
          :aria-controls="`task-list-${section.status}`"
          @click="toggleSection(section.status)"
        >
          <span class="task-list__group-summary d-flex align-center gap-3">
            <span class="task-list__group-dot" aria-hidden="true"></span>
            <span class="task-list__group-title">{{ section.label }}</span>
            <span class="task-list__group-count">{{ getSectionTasks(section.status).length }}</span>
          </span>

          <span
            class="task-list__group-toggle layout-icon layout-icon--chevron-down"
            :class="{ 'task-list__group-toggle--collapsed': isSectionCollapsed(section.status) }"
            aria-hidden="true"
          ></span>
        </button>
      </header>

      <Transition name="task-list-section">
        <div
          v-if="!isSectionCollapsed(section.status)"
          :id="`task-list-${section.status}`"
          class="task-list__table-wrap"
        >
          <table class="task-list__table">
            <thead>
              <tr>
                <th class="task-list__name-column" scope="col">
                  <span class="task-list__heading d-flex align-center gap-1">
                    <span class="layout-icon layout-icon--task" aria-hidden="true"></span>
                    Task Name
                  </span>
                </th>
                <th class="task-list__description-column" scope="col">
                  <span class="task-list__heading d-flex align-center gap-1">
                    <span class="layout-icon layout-icon--document" aria-hidden="true"></span>
                    Description
                  </span>
                </th>

                <th class="task-list__people-column" scope="col">
                  <span class="task-list__heading d-flex align-center gap-1">
                    <span class="layout-icon layout-icon--member" aria-hidden="true"></span>
                    People
                  </span>
                </th>
                <th class="task-list__tags-column" scope="col">
                  <span class="task-list__heading d-flex align-center gap-1">
                    <span class="layout-icon layout-icon--tag" aria-hidden="true"></span>
                    Tags
                  </span>
                </th>
                <th class="task-list__timeline-column" scope="col">
                  <span class="task-list__sortable-heading d-flex align-center gap-1">
                    <span class="layout-icon layout-icon--clock" aria-hidden="true"></span>
                    Timeline
                  </span>
                </th>
                <th class="task-list__priority-column" scope="col">
                  <span class="task-list__sortable-heading d-flex align-center gap-1">
                    <span class="layout-icon layout-icon--flag" aria-hidden="true"></span>
                    Priority
                  </span>
                </th>
                <th class="task-list__actions-column" scope="col">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in getSectionTasks(section.status)"
                :key="task.id"
                class="task-list__row"
              >
                <td>
                  <div class="task-list__task d-flex align-center gap-3">
                    <span
                      class="task-list__drag-handle layout-icon layout-icon--drag-handle"
                      draggable="true"
                      role="button"
                      tabindex="0"
                      :aria-label="`Drag ${task.title}`"
                      :title="`Drag ${task.title}`"
                      @dragstart="handleDragStart($event, task)"
                      @dragend="handleDragEnd"
                      @dblclick.stop
                    ></span>
                    <BaseCheckbox
                      :checked="manager.isTaskSelected(task.id)"
                      :accessible-label="`Select ${task.title}`"
                      @change="manager.setTaskSelected(task.id, $event)"
                    />
                    <button
                      class="task-list__task-title truncate"
                      type="button"
                      @click="emit('openTask', task.id)"
                      @dblclick.stop
                    >
                      {{ task.title }}
                    </button>
                  </div>
                </td>
                <td>
                  <p class="task-list__description truncate">{{ task.description }}</p>
                </td>

                <td>
                  <div class="task-list__assignee d-flex align-center gap-2">
                    <BaseAssigneeStack :avatars="getAssigneeAvatars(task)" />
                    <span class="sr-only">{{ getAssigneeLabel(task) }}</span>
                  </div>
                </td>
                <td>
                  <div class="task-list__tags d-flex align-center gap-2">
                    <BaseTagList v-if="task.tags.length > 0" :tags="task.tags" :max-visible-tags="1" />
                    <span v-if="task.tags.length === 0" class="text-muted">No tags</span>
                  </div>
                </td>
                <td>
                  <span class="task-list__timeline-row">
                    <span>{{ getCreatedDateLabel(task) }}</span>
                    <span class="task-list__timeline-separator" aria-hidden="true">-</span>
                    <span
                      class="task-list__timeline-due"
                      :class="{ 'task-list__date--overdue': isOverdue(task) }"
                    >
                      {{ getDueDateLabel(task) }}
                    </span>
                  </span>
                </td>
                <td>
                  <BaseChip
                    :label="manager.getPriorityLabel(task.priority)"
                    :tone="getPriorityTone(task)"
                    shape="pill"
                  />
                </td>
                <td>
                  <BaseActionMenu :items="getActionItems(task)" aria-label="Task actions" />
                </td>
              </tr>
              <tr v-if="getSectionTasks(section.status).length === 0">
                <td class="task-list__empty" colspan="7">Drop a task here</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Transition>
    </section>
  </section>
</template>
