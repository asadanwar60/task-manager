<script setup lang="ts">
import type { BaseInputEmits, BaseInputProps } from '@/BLL/taskManager/types'

withDefaults(defineProps<BaseInputProps>(), {
  control: 'input',
  error: undefined,
  placeholder: undefined,
  rows: 5,
  suggestions: undefined,
  type: 'text',
})

const emit = defineEmits<BaseInputEmits>()

function handleInput(event: Event): void {
  const target = event.target

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    emit('update:modelValue', target.value)
  }
}
</script>

<template>
  <div class="base-input" :for="id">
    <span class="base-input__label">{{ label }}</span>
    <textarea
      v-if="control === 'textarea'"
      :id="id"
      class="base-input__control base-input__control--textarea"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="handleInput"
    />
    <input
      v-else
      :id="id"
      class="base-input__control"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :list="suggestions && suggestions.length > 0 ? `${id}-suggestions` : undefined"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="handleInput"
    />
    <datalist v-if="suggestions && suggestions.length > 0" :id="`${id}-suggestions`">
      <option v-for="suggestion in suggestions" :key="suggestion" :value="suggestion"></option>
    </datalist>
    <span v-if="error" :id="`${id}-error`" class="base-input__error">{{ error }}</span>
  </div>
</template>
