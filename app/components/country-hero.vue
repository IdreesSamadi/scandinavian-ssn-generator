<template>
  <header class="flex flex-col items-start gap-3">
    <div class="flex items-center gap-2.5">
      <nordic-flag
        :country="country"
        :width="26"
        :height="19"
      />
      <span class="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        {{ countryName }}
      </span>
    </div>
    <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-highlighted">
      {{ title }}
    </h1>
    <p class="text-base sm:text-lg text-muted max-w-2xl">
      <slot />
    </p>
    <div class="flex flex-wrap gap-2 mt-1">
      <u-badge
        v-for="chip in chips"
        :key="chip"
        color="neutral"
        variant="soft"
        class="font-mono text-xs"
      >
        {{ chip }}
      </u-badge>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NordicCountry } from '~/utils/countries';

const { country, countryName, title, chips } = defineProps<{
  country: NordicCountry;
  countryName: string;
  title: string;
  chips: string[];
}>();
</script>
