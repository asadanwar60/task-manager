<script setup lang="ts">
import LayoutLogo from '@/components/layout/LayoutLogo.vue'
import SidebarItem from '@/components/layout/SidebarItem.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import {
  SIDEBAR_NAVIGATION_ITEMS,
  SIDEBAR_UTILITY_ITEMS,
  SIDEBAR_WORKSPACE_ITEMS,
} from '@/constants'

</script>

<template>
  <aside class="layout-sidebar" aria-label="Application sidebar">
    <div>
      <header class="layout-sidebar__brand">
        <LayoutLogo label="Task.Co" />
        <BaseButton
          class="layout-sidebar__collapse"
          icon="expand"
          size="sm"
          aria-label="Expand application shell"
        />
      </header>

      <label class="layout-sidebar__search">
        <span class="layout-icon layout-icon--search" aria-hidden="true"></span>
        <span class="sr-only">Search</span>
        <input type="search" placeholder="Search" />
        <span aria-hidden="true">⌘</span>
      </label>

      <nav class="layout-sidebar__section" aria-label="Primary navigation">
        <SidebarItem v-for="item in SIDEBAR_NAVIGATION_ITEMS" :key="item.id" :item="item" />
      </nav>

      <section
        class="layout-sidebar__section layout-sidebar__workspace"
        aria-labelledby="workspace-heading"
      >
        <h2 id="workspace-heading" class="layout-sidebar__section-title text-caption text-muted">
          Teamspace
        </h2>
        <SidebarItem v-for="item in SIDEBAR_WORKSPACE_ITEMS" :key="item.id" :item="item" />
      </section>
    </div>

    <nav class="layout-sidebar__bottom" aria-label="Account actions">
      <SidebarItem v-for="item in SIDEBAR_UTILITY_ITEMS" :key="item.id" :item="item" />
    </nav>
  </aside>
</template>
