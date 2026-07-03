<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type {
  TaskDisplayStatusOption,
  TaskFormState,
  TaskModalEmits,
  TaskModalProps,
  TaskPriorityOption,
  TaskStatusOption,
  TaskValidationResult,
} from '@/BLL/taskManager/types'
import BaseButton from '@/components/shared/BaseButton.vue'
import BaseDialog from '@/components/shared/BaseDialog.vue'
import BaseInput from '@/components/shared/BaseInput.vue'

const props = defineProps<TaskModalProps>()
const emit = defineEmits<TaskModalEmits>()

const form = reactive<TaskFormState>(
  props.manager.getTaskFormState(props.taskId, props.initialStatus),
)
const validation = ref<TaskValidationResult>(props.manager.getEmptyValidationResult())

const statusOptions = computed<TaskStatusOption[]>((): TaskStatusOption[] => {
  return props.manager.getStatusOptions()
})

const displayStatusOptions = computed<TaskDisplayStatusOption[]>((): TaskDisplayStatusOption[] => {
  return props.manager.getDisplayStatusOptions()
})

const priorityOptions = computed<TaskPriorityOption[]>((): TaskPriorityOption[] => {
  return props.manager.getPriorityOptions()
})

const assigneeOptions = computed<string[]>((): string[] => {
  return props.manager.getAssignees()
})

const tagOptions = computed<string[]>((): string[] => {
  return props.manager.getTags()
})

const dialogTitle = computed<string>((): string => {
  return props.mode === 'create' ? 'Create Task' : 'Edit Task'
})

const primaryActionLabel = computed<string>((): string => {
  return props.mode === 'create' ? 'Create' : 'Save'
})

const formId = computed<string>((): string => {
  return `task-${props.mode}-form`
})

function handleCancel(): void {
  emit('cancel')
}

function handleSubmit(): void {
  validation.value = props.manager.saveTask(props.mode, props.taskId, form)

  if (!validation.value.isValid) {
    return
  }

  emit('saved')
}
</script>

<template>
  <BaseDialog :title="dialogTitle" size="md" @close="handleCancel">
    <form :id="formId" class="task-modal__form" @submit.prevent="handleSubmit">
      <BaseInput
        id="task-title"
        v-model="form.title"
        label="Title"
        placeholder="Task title"
        :error="validation.errors.title"
        class="task-modal__field"
      />

      <label class="task-modal__field task-modal__select-row" for="task-status">
        <span class="task-modal__label">Status</span>
        <select id="task-status" v-model="form.status" class="task-modal__control">
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="task-modal__field task-modal__select-row" for="task-display-status">
        <span class="task-modal__label">Task Status</span>
        <select id="task-display-status" v-model="form.displayStatus" class="task-modal__control">
          <option v-for="option in displayStatusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="task-modal__field task-modal__select-row" for="task-priority">
        <span class="task-modal__label">Priority</span>
        <select id="task-priority" v-model="form.priority" class="task-modal__control">
          <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <BaseInput
        id="task-due-date"
        v-model="form.dueDate"
        label="Due Date"
        type="date"
        :error="validation.errors.dueDate"
        class="task-modal__field"
      />

      <BaseInput
        id="task-assignee"
        v-model="form.assigneesInput"
        label="Assignees"
        placeholder="Maya Chen, Ethan Brooks"
        :suggestions="assigneeOptions"
        :error="validation.errors.assignees"
        class="task-modal__field"
      />

      <BaseInput
        id="task-tags"
        v-model="form.tagsInput"
        label="Tags"
        placeholder="backend, auth, ux"
        :suggestions="tagOptions"
        class="task-modal__field"
      />

      <BaseInput
        id="task-description"
        v-model="form.description"
        class="task-modal__field--full"
        control="textarea"
        label="Description"
        placeholder="Describe the task"
        :rows="5"
      />

    </form>

    <template #footer>
      <footer class="task-modal__footer d-flex justify-end gap-3">
        <BaseButton label="Cancel" variant="outline" type="button" @click="handleCancel" />
        <BaseButton :label="primaryActionLabel" tone="primary" variant="solid" type="submit" :form="formId" />
      </footer>
    </template>
  </BaseDialog>
</template>
