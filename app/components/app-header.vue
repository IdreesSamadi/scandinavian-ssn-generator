<template>
  <u-header>
    <template #title>
      YYYYMMDD-SSN
    </template>

    <u-navigation-menu :items="items" />

    <template #right>
      <u-color-mode-button />

      <u-tooltip
        text="Open on GitHub"
        :kbds="['meta', 'G']"
      >
        <u-button
          color="neutral"
          variant="ghost"
          to="https://github.com/IdreesSamadi/scandinavian-ssn-generator"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </u-tooltip>
    </template>

    <template #body>
      <u-navigation-menu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </u-header>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Sweden ',
    to: '/sweden',
    active: route.path.startsWith('/sweden'),
  },
  {
    label: 'Denmark',
    to: '/denmark',
    active: route.path.startsWith('/denmark'),
  },
  {
    label: 'Norway',
    to: '/norway',
    active: route.path.startsWith('/norway'),
  },
  {
    label: 'Finland',
    to: '/finland',
    active: route.path.startsWith('/finland'),
  },
  {
    label: 'Iceland',
    to: '/iceland',
    active: route.path.startsWith('/iceland'),
  },
])
</script>
