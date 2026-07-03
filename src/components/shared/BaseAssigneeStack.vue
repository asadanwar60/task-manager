<script setup lang="ts">
import { computed } from 'vue'
import type { BaseAssigneeStackProps } from '@/BLL/taskManager/types'
import BaseAvatar from '@/components/shared/BaseAvatar.vue'

const props = withDefaults(defineProps<BaseAssigneeStackProps>(), {
  maxVisible: 4,
})

const visibleAvatars = computed(() => {
  return props.avatars.slice(0, props.maxVisible)
})

const overflowCount = computed<number>((): number => {
  return Math.max(props.avatars.length - props.maxVisible, 0)
})

const hasAssignees = computed<boolean>((): boolean => {
  return props.avatars.length > 0
})
</script>

<template>
  <span
    class="base-assignee-stack"
    :aria-label="hasAssignees ? `${avatars.length} assignees` : 'Unassigned'"
  >
    <span v-if="!hasAssignees" class="base-assignee-stack__item">
      <BaseAvatar initials="" tone="avatar-0" label="Unassigned" is-unassigned />
    </span>
    <span
      v-for="avatar in visibleAvatars"
      :key="avatar.label"
      class="base-assignee-stack__item"
    >
      <BaseAvatar :initials="avatar.initials" :tone="avatar.tone" :label="avatar.label" />
    </span>
    <span
      v-if="overflowCount > 0"
      class="base-assignee-stack__overflow d-grid place-center font-semibold"
      :aria-label="`${overflowCount} more assignees`"
    >
      +{{ overflowCount }}
    </span>
  </span>
</template>
