<template>
  <div class="ssn-display">
    <div
      class="ssn-frame"
      :data-valid="isValid"
    >
      <div
        class="ssn-layer"
        aria-hidden="true"
      >
        <span
          v-for="(segment, i) in renderedSegments"
          :key="i"
          :class="`seg-${segment.kind}`"
        >{{ segment.text }}</span>
      </div>
      <input
        v-model="output"
        class="ssn-input"
        type="text"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="characters"
        aria-label="Identity number — edit to validate"
      >
      <div class="ssn-copy">
        <u-tooltip
          text="Copy to clipboard"
          :content="{ side: 'top' }"
        >
          <u-button
            :color="copied ? 'success' : 'neutral'"
            variant="ghost"
            size="md"
            :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            aria-label="Copy to clipboard"
            @click="copy(output)"
          />
        </u-tooltip>
      </div>
    </div>

    <div class="ssn-meta">
      <span
        class="ssn-badge"
        :data-valid="isValid"
      >
        <u-icon
          :name="isValid ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
          class="size-3.5"
        />
        {{ isValid ? 'valid' : 'invalid' }}
      </span>
      <span
        v-for="item in legend"
        :key="item.kind"
        class="ssn-legend-item"
      >
        <i
          class="ssn-dot"
          :class="`seg-dot-${item.kind}`"
        />
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

export type SegmentKind = 'date' | 'century' | 'serial' | 'check' | 'sep';

export interface SsnSegment {
  len: number;
  kind: SegmentKind;
  label?: string;
}

const { copy, copied } = useClipboard();

const output = defineModel('output', {
  type: String,
  required: true
});

const { segments, isValid = true } = defineProps<{
  segments: SsnSegment[];
  isValid?: boolean;
}>();

const renderedSegments = computed(() => {
  const total = segments.reduce((sum, s) => sum + s.len, 0);
  if (output.value.length !== total) {
    return [{ text: output.value, kind: 'plain' }];
  }

  let cursor = 0;
  return segments.map((segment) => {
    const text = output.value.slice(cursor, cursor + segment.len);
    cursor += segment.len;
    return { text, kind: segment.kind };
  });
});

const legend = computed(() => {
  const seen = new Set<SegmentKind>();
  return segments
    .filter((s) => {
      if (s.kind === 'sep' || !s.label || seen.has(s.kind)) return false;
      seen.add(s.kind);
      return true;
    })
    .map(s => ({ kind: s.kind, label: s.label! }));
});
</script>

<style scoped>
.ssn-frame {
  position: relative;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  background: var(--ui-bg-elevated);
  transition: border-color 0.2s;
}

.ssn-frame:focus-within {
  border-color: var(--ui-primary);
}

.ssn-frame[data-valid="false"] {
  border-color: var(--ui-error);
}

.ssn-layer,
.ssn-input {
  font-family: var(--font-mono);
  font-size: clamp(1.5rem, 5.5vw, 2.625rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.06em;
  text-align: center;
  white-space: pre;
  padding: 2rem 3.5rem;
  width: 100%;
}

.ssn-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: var(--ui-text-highlighted);
  overflow: hidden;
}

.ssn-input {
  position: relative;
  display: block;
  background: transparent;
  border: none;
  outline: none;
  color: transparent;
  caret-color: var(--ui-text-highlighted);
}

.ssn-input::selection {
  background: color-mix(in oklab, var(--ui-primary) 20%, transparent);
  color: transparent;
}

.ssn-copy {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
}

.ssn-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 1.25rem;
  row-gap: 0.375rem;
  margin-top: 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}

.ssn-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  color: var(--seg-check);
}

.ssn-badge[data-valid="false"] {
  color: var(--ui-error);
}

.ssn-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.ssn-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 1px;
  background: currentColor;
}

.seg-dot-date {
  color: var(--ui-text-highlighted);
}

.seg-dot-serial {
  color: var(--seg-serial);
}

.seg-dot-century {
  color: var(--seg-century);
}

.seg-dot-check {
  color: var(--seg-check);
}
</style>
