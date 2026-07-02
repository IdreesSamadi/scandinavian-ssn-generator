<template>
  <u-footer class="py-6">
    <template #left>
      <div class="text-sm text-muted">
        <p>
          Numbers are generated in your browser and never leave it. For testing and development only.
        </p>
        <p class="mt-1 text-dimmed">
          &copy; {{ new Date().getFullYear() }} Scandinavian SSN Generator &middot;
          <a
            href="https://github.com/IdreesSamadi/scandinavian-ssn-generator/pulls"
            target="_blank"
            class="hover:text-highlighted transition-colors"
          >Contributions welcome</a>
        </p>
      </div>
    </template>
    <template #right>
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
  </u-footer>
</template>
