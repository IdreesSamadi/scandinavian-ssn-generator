<template>
  <u-container class="py-16 sm:py-24">
    <div class="max-w-2xl">
      <p class="font-mono text-xs uppercase tracking-[0.18em] text-primary mb-4">
        For testing &amp; development
      </p>
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-highlighted text-balance">
        Valid test identity numbers for the Nordic countries
      </h1>
      <p class="mt-5 text-lg text-muted">
        Generate and validate Swedish personnummer, Norwegian fødselsnummer, Danish CPR numbers, Finnish henkilötunnus and Icelandic kennitala — every checksum correct, computed entirely in your browser.
      </p>
    </div>

    <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <nuxt-link
        v-for="item in nordicCountries"
        :key="item.country"
        :to="item.to"
        class="group flex flex-col gap-4 rounded-(--ui-radius) border border-(--ui-border) p-5 transition-colors hover:border-(--ui-border-inverted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <nordic-flag :country="item.country" />
            <span class="font-medium text-highlighted">{{ item.name }}</span>
          </div>
          <u-icon
            name="i-lucide-arrow-right"
            class="size-4 text-dimmed transition-transform group-hover:translate-x-0.5 group-hover:text-highlighted"
          />
        </div>
        <div>
          <p class="font-mono text-lg text-highlighted tracking-wide">
            <span
              v-for="(part, i) in item.format"
              :key="i"
              :class="`seg-${part.kind}`"
            >{{ part.text }}</span>
          </p>
          <p class="mt-1 text-sm text-muted">
            {{ item.term }}
          </p>
        </div>
        <p class="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-dimmed">
          {{ item.spec }}
        </p>
      </nuxt-link>
    </div>

    <section class="mt-20 max-w-2xl">
      <h2 class="text-2xl font-bold tracking-tight text-highlighted">
        Why fake ID numbers for testing?
      </h2>
      <div class="mt-4 space-y-4 text-muted">
        <p>
          Software that serves the Nordic countries almost always has to handle national identity numbers — registration forms, KYC flows, healthcare systems, payroll. Testing those systems with real personal data is a privacy risk and, under the GDPR, usually not allowed. This tool generates numbers that follow each country's official format and pass every checksum, so your validation logic accepts them, without belonging to anyone.
        </p>
        <p>
          Each generator implements the country's real algorithm: the Luhn checksum for Swedish personnummer, modulus 11 for Danish CPR numbers, Norwegian fødselsnummer and Icelandic kennitala, and modulus 31 for the Finnish henkilötunnus. You can pick a date of birth, age and gender, choose an output format, and validate existing numbers by pasting them in. Everything runs locally in your browser — no number you generate or paste is ever sent to a server.
        </p>
      </div>
    </section>
  </u-container>
</template>

<script setup lang="ts">
usePageSeo({
  title: 'Nordic SSN Generator & Validator — Test Personal ID Numbers',
  description: 'Free online generator and validator for Swedish personnummer, Danish CPR numbers, Norwegian fødselsnummer, Finnish henkilötunnus and Icelandic kennitala. Create valid fake ID numbers for software testing, entirely in your browser.'
});
</script>
