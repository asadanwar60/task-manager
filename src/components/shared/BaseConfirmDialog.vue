<script setup lang="ts">
import type { BaseConfirmDialogEmits, BaseConfirmDialogProps } from '@/BLL/taskManager/types'
import BaseButton from '@/components/shared/BaseButton.vue'
import BaseDialog from '@/components/shared/BaseDialog.vue'

withDefaults(defineProps<BaseConfirmDialogProps>(), {
  cancelLabel: 'Cancel',
  tone: 'danger',
})

const emit = defineEmits<BaseConfirmDialogEmits>()
</script>

<template>
  <BaseDialog :title="title" :description="message" size="sm" @close="emit('cancel')">
    <footer class="base-confirm-dialog__actions d-flex justify-end gap-3">
      <BaseButton :label="cancelLabel" variant="outline" @click="emit('cancel')" />
      <BaseButton :label="confirmLabel" :tone="tone" variant="solid" @click="emit('confirm')" />
    </footer>
  </BaseDialog>
</template>
