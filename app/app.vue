<template>
  <u-app>
    <app-header />
    <u-main>
      <nuxt-page />
    </u-main>

    <u-separator
      type="dashed"
      class="h-px"
    />
    <app-footer />
  </u-app>
</template>

<script setup lang="ts">
const title = 'Scandinavian Social Security Number Generator and Validator'
const description = 'Generate and validate Swedish Personnummer, Norwegian Fødselsnummer, Danish CPR Number, Finnish HETU, and Icelandic Kennitala with our easy-to-use online tool. All processing is done in the browser for maximum privacy and security.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>
