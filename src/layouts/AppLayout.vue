<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const greeting = 'Good Morning, Devrizal ☀'
const currentDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date())
const dateLabel = `It’s ${currentDate}`
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <section class="app-layout__body">
      <AppHeader :greeting="greeting" :date-label="dateLabel" />
      <main class="layout-content">
        <slot />
      </main>
    </section>
  </div>
</template>
