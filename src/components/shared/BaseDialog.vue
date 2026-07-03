<script setup lang="ts">
import type { BaseDialogEmits, BaseDialogProps } from '@/BLL/taskManager/types'
import BaseButton from '@/components/shared/BaseButton.vue'

const props = withDefaults(defineProps<BaseDialogProps>(), {
  ariaLabel: undefined,
  description: undefined,
  size: 'md',
})

const emit = defineEmits<BaseDialogEmits>()
</script>

<template>
  <div class="base-dialog" role="presentation" @click.self="emit('close')">
    <section
      class="base-dialog__panel"
      :class="`base-dialog__panel--${props.size}`"
      role="dialog"
      aria-modal="true"
      :aria-label="ariaLabel ?? title"
    >
      <header class="base-dialog__header d-flex align-start justify-between gap-4">
        <div>
          <h2 class="base-dialog__title">{{ title }}</h2>
          <p v-if="description" class="base-dialog__description">{{ description }}</p>
        </div>

        <BaseButton icon="close" aria-label="Close dialog" size="sm" @click="emit('close')" />
      </header>

      <div class="base-dialog__content">
        <slot />
      </div>

      <footer v-if="$slots.footer" class="base-dialog__footer">
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>
