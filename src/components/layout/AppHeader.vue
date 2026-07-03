<script setup lang="ts">
import type { AppHeaderProps } from '@/BLL/taskManager/types'
import BaseButton from '@/components/shared/BaseButton.vue'

defineProps<AppHeaderProps>()
</script>

<template>
  <header class="layout-header">
    <div>
      <p class="layout-header__greeting text-primary">{{ greeting }}</p>
      <p class="layout-header__date text-caption text-muted">{{ dateLabel }}</p>
    </div>

    <div class="layout-header__actions">
      <BaseButton
        class="layout-header__icon-button"
        icon="notifications"
        aria-label="Notifications"
      />
      <BaseButton class="layout-header__button" icon="invite" label="Invite" />
      <BaseButton class="layout-header__button" icon="settings" label="Settings" />
    </div>
  </header>
</template>
