<script setup lang="ts">
import type { SidebarItemProps } from '@/BLL/taskManager/types'

defineProps<SidebarItemProps>()
</script>

<template>
  <button
    class="layout-sidebar-item"
    :class="{
      'layout-sidebar-item--active': item.isActive,
      'layout-sidebar-item--brand-icon': item.iconTone === 'brand',
    }"
    type="button"
  >
    <span class="layout-sidebar-item__icon-frame" aria-hidden="true">
      <span class="layout-sidebar-item__icon layout-icon" :class="`layout-icon--${item.icon}`"></span>
    </span>
    <span class="layout-sidebar-item__label">{{ item.label }}</span>
  </button>
</template>
