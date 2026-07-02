<template>
  <u-form class="flex flex-col gap-8">
    <ssn-display
      v-model:output="output"
      :segments="segments"
      :is-valid="isValid"
    />

    <div class="rounded-(--ui-radius) border border-(--ui-border) p-5 sm:p-6">
      <p class="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted mb-5">
        Parameters
      </p>
      <div class="grid sm:grid-cols-2 gap-x-6 gap-y-5">
        <u-form-field
          size="lg"
          label="Date of birth"
        >
          <u-input-date
            ref="inputDate"
            v-model="dateOfBirth"
            :max-value="maxDate"
            :min-value="minDate"
            class="w-full"
            size="lg"
          >
            <template #trailing>
              <u-popover :reference="inputDate?.inputsRef[3]?.$el">
                <u-button
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-calendar"
                  aria-label="Select a date"
                  class="px-0"
                />

                <template #content>
                  <u-calendar
                    v-model="dateOfBirth"
                    :max-value="todayDate"
                    :min-value="minDate"
                    class="p-2"
                  />
                </template>
              </u-popover>
            </template>
          </u-input-date>
        </u-form-field>

        <u-form-field
          size="lg"
          label="Age"
        >
          <u-input-number
            v-model="age"
            class="w-full"
            size="lg"
            :min="minAge"
            :max="maxAge"
          />
        </u-form-field>

        <u-form-field
          size="lg"
          label="Gender"
        >
          <u-radio-group
            v-model="gender"
            orientation="horizontal"
            size="sm"
            variant="card"
            :items="['Male', 'Female']"
            class="gender-radio-group"
          />
        </u-form-field>

        <u-form-field
          size="lg"
          label="Output format"
        >
          <u-select
            v-model="format"
            class="w-full font-mono"
            size="lg"
            :items="formats"
            :ui="{ item: 'font-mono' }"
          />
        </u-form-field>
      </div>

      <u-button
        block
        size="lg"
        icon="i-lucide-dices"
        class="mt-6"
        @click="randomizeInputs"
      >
        Randomize
      </u-button>
    </div>
  </u-form>
</template>

<script setup lang="ts">
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import type { SsnSegment } from '~/components/ssn-display.vue';

export interface formData {
  /**
   * Date of birth in the format YYYY-MM-DD
   */
  dateOfBirth: string;

  /**
   * The digit representing gender (odd for male, even for female)
   */
  genderDigit: number;
}

const output = defineModel('output', {
  type: String,
  required: true
});

const format = defineModel('format', {
  type: String,
  required: true
});

const emit = defineEmits<{
  (e: 'change', data: formData): void;
}>();

const { formats, segments, isValid = true } = defineProps<{
  formats: string[];
  segments: SsnSegment[];
  isValid?: boolean;
}>();

const age = ref(1);
const gender = ref<'Male' | 'Female'>('Male');

const minAge = 1;
const maxAge = 150;
const todayDate = today(getLocalTimeZone());
const maxDate = new CalendarDate(todayDate.year, todayDate.month, todayDate.day);
const minDate = new CalendarDate(todayDate.year - maxAge, todayDate.month, todayDate.day);
const dateOfBirth = shallowRef(new CalendarDate(2022, 2, 3));
const inputDate = useTemplateRef('inputDate');

watch(age, (newAge) => {
  const td = today('Europe/Stockholm');
  dateOfBirth.value = new CalendarDate(td.year - newAge, td.month, td.day);
});

watch(dateOfBirth, (newDate) => {
  const td = today('Europe/Stockholm');
  age.value = td.year - newDate.year;
}, { immediate: true });

watch([format, gender, age, dateOfBirth], () => {
  emit('change', {
    dateOfBirth: dateOfBirth.value.toString(),
    genderDigit: gender.value === 'Male' ? randomOddDigit() : randomEvenDigit()
  });
});

const randomizeInputs = () => {
  const td = today('Europe/Stockholm');
  const randomYear = Math.floor(Math.random() * 100) + (td.year - 100);
  const randomMonth = Math.floor(Math.random() * 12) + 1;
  const randomDay = Math.floor(Math.random() * 28) + 1;

  dateOfBirth.value = new CalendarDate(randomYear, randomMonth, randomDay);
  gender.value = Math.random() < 0.5 ? 'Male' : 'Female';
};
</script>

<style>
.gender-radio-group,
.gender-radio-group > div {
  width: 100%;
}

.gender-radio-group label {
  width: 100%;
}
</style>
