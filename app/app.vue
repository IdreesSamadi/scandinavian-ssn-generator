<template>
  <u-app>
    <app-header />
    <u-main>
      <nuxt-page />
    </u-main>

    <u-separator class="h-px" />
    <app-footer />
  </u-app>
</template>

<script setup lang="ts">
import { joinURL } from 'ufo';

const site = useSiteConfig();
const { app } = useRuntimeConfig();

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Scandinavian SSN Generator and Validator',
  ogImage: joinURL(site.url.replace(/\/$/, ''), app.baseURL, 'og-image.png'),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image'
});
</script>
