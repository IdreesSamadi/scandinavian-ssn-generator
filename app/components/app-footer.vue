<template>
  <u-footer class="text-center py-4">
    <div class="text-sm text-neutral-500">
      <p class="mb-2">
        If you have any suggestions, or would like to contribute to the project, please feel free to reach out or submit a <a
          href="https://github.com/IdreesSamadi/scandinavian-ssn-generator/pulls"
          target="_blank"
          class="text-primary hover:underline"
        >pull request</a>. Your feedback and contributions are greatly appreciated!
      </p>
      <p>
        &copy; {{ new Date().getFullYear() }} Scandinavian Social Security Number Generator and Validator.
      </p>
    </div>
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
