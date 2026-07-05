<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <section class="not-found-page d-grid place-center text-center">
      <div class="not-found-page__content">
        <p class="text-overline text-brand font-semibold uppercase mb-3">404</p>
        <h1 class="text-h1 text-primary mb-3">Page not found</h1>
        <p class="text-body text-secondary mb-6">
          The route you opened does not exist in this application.
        </p>
        <RouterLink class="not-found-page__link" to="/task-manager">
          Back to Task Manager
        </RouterLink>
      </div>
    </section>
  </AppLayout>
</template>
