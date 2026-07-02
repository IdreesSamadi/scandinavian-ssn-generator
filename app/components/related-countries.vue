<template>
  <section>
    <h2 class="text-2xl font-bold tracking-tight text-highlighted">
      Other Nordic ID generators
    </h2>
    <div class="mt-5 grid sm:grid-cols-2 gap-3">
      <nuxt-link
        v-for="item in others"
        :key="item.country"
        :to="item.to"
        class="group flex items-center gap-3 rounded-(--ui-radius) border border-(--ui-border) px-4 py-3 transition-colors hover:border-(--ui-border-inverted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary)"
      >
        <nordic-flag :country="item.country" />
        <span class="text-sm">
          <span class="font-medium text-highlighted">{{ item.name }}</span>
          <span class="text-muted"> — {{ item.term }} generator</span>
        </span>
        <u-icon
          name="i-lucide-arrow-right"
          class="size-4 ml-auto text-dimmed transition-transform group-hover:translate-x-0.5 group-hover:text-highlighted"
        />
      </nuxt-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NordicCountry } from '~/utils/countries';

const { current } = defineProps<{
  current: NordicCountry;
}>();

const others = computed(() => nordicCountries.filter(c => c.country !== current));
</script>
