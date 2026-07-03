<script setup lang="ts">
import { ref } from 'vue'
import type { ActionMenuItem, BaseActionMenuProps } from '@/BLL/taskManager/types'
import BaseButton from '@/components/shared/BaseButton.vue'

withDefaults(defineProps<BaseActionMenuProps>(), {
  ariaLabel: 'Action',
  size: 'sm',
  triggerIcon: 'more',
})

const isOpen = ref<boolean>(false)

function toggleMenu(): void {
  isOpen.value = !isOpen.value
}

function closeMenu(): void {
  isOpen.value = false
}

function closeMenuOnFocusOut(event: FocusEvent): void {
  const nextTarget = event.relatedTarget

  if (
    nextTarget instanceof Node &&
    event.currentTarget instanceof Node &&
    event.currentTarget.contains(nextTarget)
  ) {
    return
  }

  closeMenu()
}

function handleItemClick(item: ActionMenuItem): void {
  if (item.disabled) {
    return
  }

  closeMenu()
  item.onClick()
}
</script>

<template>
  <div class="base-action-menu" @click.stop @focusout="closeMenuOnFocusOut">
    <BaseButton
      :icon="triggerIcon"
      :aria-label="ariaLabel"
      :size="size"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    />

    <div v-if="isOpen" class="base-action-menu__content" role="menu" :aria-label="ariaLabel">
      <button
        v-for="item in items"
        :key="item.id"
        class="base-action-menu__item"
        :class="{ 'base-action-menu__item--danger': item.danger }"
        type="button"
        role="menuitem"
        :disabled="item.disabled"
        @click="handleItemClick(item)"
      >
        <span
          v-if="item.icon"
          class="base-action-menu__icon layout-icon"
          :class="`layout-icon--${item.icon}`"
          aria-hidden="true"
        ></span>
        <span>{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>
