<script setup lang="ts">
import type { BaseButtonProps } from '@/BLL/taskManager/types'

withDefaults(defineProps<BaseButtonProps>(), {
  ariaLabel: undefined,
  form: undefined,
  icon: undefined,
  iconPosition: 'start',
  label: undefined,
  size: 'md',
  tone: 'default',
  type: 'button',
  variant: 'ghost',
})
</script>

<template>
  <button
    class="base-button"
    :class="[
      `base-button--${tone}`,
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--icon-only': icon && !label },
    ]"
    :type="type"
    :aria-label="ariaLabel ?? label"
    :form="form"
  >
    <span
      v-if="icon && iconPosition === 'start'"
      class="layout-icon"
      :class="`layout-icon--${icon}`"
      aria-hidden="true"
    ></span>
    <span v-if="label" class="base-button__label">{{ label }}</span>
    <span
      v-if="icon && iconPosition === 'end'"
      class="layout-icon"
      :class="`layout-icon--${icon}`"
      aria-hidden="true"
    ></span>
  </button>
</template>
