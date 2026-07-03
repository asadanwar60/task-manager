<script setup lang="ts">
import { computed, ref } from 'vue'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import type { Task, TaskFilters } from '@/BLL/taskManager/types'
import KanbanBoard from '@/components/taskManager/KanbanBoard.vue'
import TaskDetailDrawer from '@/components/taskManager/TaskDetailDrawer.vue'
import TaskList from '@/components/taskManager/TaskList.vue'
import TaskModal from '@/components/taskManager/TaskModal.vue'
import ViewToggle from '@/components/taskManager/ViewToggle.vue'
import FilterDropdown from '@/components/taskManager/toolbar/FilterDropdown.vue'
import SortDropdown from '@/components/taskManager/toolbar/SortDropdown.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import BaseConfirmDialog from '@/components/shared/BaseConfirmDialog.vue'
import { TASK_VIEW_OPTIONS } from '@/constants'
import AppLayout from '@/layouts/AppLayout.vue'

const taskManager = new TaskManager()
const isFilterPanelOpen = ref<boolean>(false)
const isSortPanelOpen = ref<boolean>(false)

const detailTask = computed<Task | null>((): Task | null => {
  return taskManager.getDetailTask()
})

const deleteDialogMessage = computed<string>((): string => {
  return taskManager.getDeleteDialogMessage()
})

const filterState = computed<TaskFilters>((): TaskFilters => {
  return taskManager.getFilterState()
})

const assigneeOptions = computed<string[]>((): string[] => {
  return taskManager.getAssignees()
})

const tagOptions = computed<string[]>((): string[] => {
  return taskManager.getTags()
})

const statusOptions = computed(() => taskManager.getStatusOptions())

const priorityOptions = computed(() => taskManager.getPriorityOptions())

const sortOptions = computed(() => taskManager.getSortOptions())

const selectedSortValue = computed<string>((): string => {
  const sortState = taskManager.getSortState()

  return sortState ? taskManager.getSortOptionValue(sortState) : ''
})

function toggleFilterPanel(): void {
  isFilterPanelOpen.value = !isFilterPanelOpen.value
  isSortPanelOpen.value = false
}

function toggleSortPanel(): void {
  isSortPanelOpen.value = !isSortPanelOpen.value
  isFilterPanelOpen.value = false
}

function closeFilterPanel(): void {
  isFilterPanelOpen.value = false
}

function closeSortPanel(): void {
  isSortPanelOpen.value = false
}
</script>

<template>
  <AppLayout>
    <section class="task-manager-page">
      <section class="task-manager-page__heading d-flex justify-between align-start">
        <ViewToggle
          :active-view="taskManager.getActiveView()"
          :options="TASK_VIEW_OPTIONS"
          @change="taskManager.setActiveView"
        />

        <div class="d-flex align-center gap-3">
          <div class="task-manager-page__controls d-flex align-center gap-4">
            <FilterDropdown
              :is-open="isFilterPanelOpen"
              :filters="filterState"
              :assignee-options="assigneeOptions"
              :priority-options="priorityOptions"
              :status-options="statusOptions"
              :tag-options="tagOptions"
              @toggle="toggleFilterPanel"
              @close="closeFilterPanel"
              @assignee-change="taskManager.setFilter('assignee', $event)"
              @priority-change="taskManager.setFilter('priority', $event)"
              @status-change="taskManager.setFilter('status', $event)"
              @tag-change="taskManager.setFilter('tag', $event)"
              @clear="taskManager.clearFilters"
            />

            <SortDropdown
              :is-open="isSortPanelOpen"
              :options="sortOptions"
              :selected-value="selectedSortValue"
              @toggle="toggleSortPanel"
              @close="closeSortPanel"
              @select="taskManager.setSortFromOptionValue"
              @clear="taskManager.clearSort"
            />
          </div>
          <BaseButton icon="share" label="Share" variant="outline" size="md" />
          <BaseButton
            icon="add"
            label="Add Task"
            tone="primary"
            variant="solid"
            size="md"
            @click="taskManager.openCreateTask()"
          />
        </div>
      </section>

      <section class="task-manager-page__toolbar d-flex justify-between align-center"></section>

      <KanbanBoard
        v-if="taskManager.getActiveView() === 'board'"
        :manager="taskManager"
        @open-task="taskManager.openTaskDetail"
        @edit-task="taskManager.openEditTask"
        @delete-task="taskManager.openDeleteTask"
        @create-task="taskManager.openCreateTask"
      />

      <TaskList
        v-else
        :manager="taskManager"
        @create-task="taskManager.openCreateTask"
        @open-task="taskManager.openTaskDetail"
        @edit-task="taskManager.openEditTask"
        @delete-task="taskManager.openDeleteTask"
      />

      <TaskModal
        v-if="taskManager.isTaskModalOpen()"
        :manager="taskManager"
        :mode="taskManager.getTaskModalMode()"
        :task-id="taskManager.getTaskModalTaskId()"
        :initial-status="taskManager.getTaskModalInitialStatus()"
        @saved="taskManager.closeTaskModal"
        @cancel="taskManager.closeTaskModal"
      />

      <TaskDetailDrawer
        v-if="detailTask"
        :manager="taskManager"
        :task="detailTask"
        @close="taskManager.closeTaskDetail"
        @edit-task="taskManager.editTaskFromDetail"
        @delete-task="taskManager.deleteTaskFromDetail"
      />

      <BaseConfirmDialog
        v-if="taskManager.hasPendingDeleteTask()"
        title="Delete task?"
        :message="deleteDialogMessage"
        confirm-label="Delete task"
        @confirm="taskManager.confirmDeleteTask"
        @cancel="taskManager.closeDeleteDialog"
      />
    </section>
  </AppLayout>
</template>
