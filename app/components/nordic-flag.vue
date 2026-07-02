<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 22 16"
    class="nordic-flag"
    aria-hidden="true"
  >
    <rect
      width="22"
      height="16"
      rx="2"
      :fill="flag.field"
    />
    <template v-if="flag.fimbriation">
      <rect
        x="5.5"
        width="5"
        height="16"
        :fill="flag.fimbriation"
      />
      <rect
        y="5.5"
        width="22"
        height="5"
        :fill="flag.fimbriation"
      />
    </template>
    <rect
      x="6.5"
      width="3"
      height="16"
      :fill="flag.cross"
    />
    <rect
      y="6.5"
      width="22"
      height="3"
      :fill="flag.cross"
    />
    <rect
      x="0.5"
      y="0.5"
      width="21"
      height="15"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.15"
    />
  </svg>
</template>

<script setup lang="ts">
import type { NordicCountry } from '~/utils/countries';

const { country, width = 22, height = 16 } = defineProps<{
  country: NordicCountry;
  width?: number;
  height?: number;
}>();

const flags: Record<NordicCountry, { field: string; cross: string; fimbriation?: string }> = {
  sweden: { field: '#006AA7', cross: '#FECC02' },
  norway: { field: '#BA0C2F', cross: '#00205B', fimbriation: '#FFFFFF' },
  denmark: { field: '#C8102E', cross: '#FFFFFF' },
  finland: { field: '#FFFFFF', cross: '#002F6C' },
  iceland: { field: '#02529C', cross: '#DC1E35', fimbriation: '#FFFFFF' }
};

const flag = computed(() => flags[country]);
</script>

<style scoped>
.nordic-flag {
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 2px;
}
</style>
