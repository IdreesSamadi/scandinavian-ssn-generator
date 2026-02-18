<template>
  <div>
    <u-form class="flex gap-8 justify-between flex-col">
      <u-form-field
        size="xl"
        :error="isValid ? undefined : 'Invalid Social Security Number'"
      >
        <u-input
          v-model="output"
          highlight
          :color="isValid ? 'success' : 'error'"
          size="xl"
          class="w-full md:w-xl"
        >
          <template
            v-if="output?.length"
            #trailing
          >
            <UTooltip
              text="Copy to clipboard"
              :content="{ side: 'right' }"
            >
              <UButton
                :color="copied ? 'success' : 'neutral'"
                variant="link"
                size="sm"
                :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                aria-label="Copy to clipboard"
                @click="copy(output)"
              />
            </UTooltip>
          </template>
        </u-input>
      </u-form-field>
      <u-separator
        type="dashed"
        size="md"
        class="mt-4 mb-1"
      />
      <div class="flex gap-8 justify-between md:flex-row flex-col">
        <div class="flex flex-col gap-4 grow justify-between">
          <!-- <div class="flex flex-col gap-4"> -->
          <u-form-field
            size="xl"
            label="Output format"
          >
            <u-select
              v-model="format"
              class="w-full"
              size="xl"
              :items="formats"
            />
          </u-form-field>
          <u-form-field
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
        </div>
        <div class="flex flex-col gap-4 grow">
          <u-form-field
            size="xl"
            label="Age"
          >
            <u-input-number
              v-model="age"
              class="w-full"
              size="xl"
              orientation="vertical"
              :min="minAge"
              :max="maxAge"
            />
          </u-form-field>

          <u-form-field
            size="xl"
            label="Date of Birth"
            class="w-full"
            hint="mm/dd/yyyy"
          >
            <u-input-date
              ref="inputDate"
              v-model="dateOfBirth"
              :max-value="maxDate"
              :min-value="minDate"
              class="w-full"
              size="xl"
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
        </div>
      </div>
      <u-button
        block
        size="xl"
        @click="randomizeInputs"
      >
        Randomize
      </u-button>
    </u-form>
  </div>
</template>

<script setup lang="ts">
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import { useClipboard } from '@vueuse/core'

export interface formData {
  /**
   * Date of birth in the format YYYY-MM-DD
   */
  dateOfBirth: string

  /**
   * The digit representing gender (odd for male, even for female)
   */
  genderDigit: number
}

const { copy, copied } = useClipboard()

const output = defineModel('output', {
  type: String,
  required: true
})

const format = defineModel('format', {
  type: String,
  required: true
})

const emit = defineEmits<{
  (e: 'change', data: formData): void
}>()

const { formats, isValid = true } = defineProps<{
  formats: string[]
  isValid?: boolean
}>()

const age = ref(1)
const gender = ref<'Male' | 'Female'>('Male')

const minAge = 1
const maxAge = 150
const todayDate = today(getLocalTimeZone())
const maxDate = new CalendarDate(todayDate.year, todayDate.month, todayDate.day)
const minDate = new CalendarDate(todayDate.year - maxAge, todayDate.month, todayDate.day)
const dateOfBirth = shallowRef(new CalendarDate(2022, 2, 3))
const inputDate = useTemplateRef('inputDate')

watch(age, (newAge) => {
  const td = today('Europe/Stockholm')
  dateOfBirth.value = new CalendarDate(td.year - newAge, td.month, td.day)
})

watch(dateOfBirth, (newDate) => {
  const td = today('Europe/Stockholm')
  age.value = td.year - newDate.year
}, { immediate: true })

watch([format, gender, age, dateOfBirth], () => {
  emit('change', {
    dateOfBirth: dateOfBirth.value.toString(),
    genderDigit: gender.value === 'Male' ? randomOddDigit() : randomEvenDigit()
  })
})

const randomizeInputs = () => {
  const td = today('Europe/Stockholm')
  const randomYear = Math.floor(Math.random() * 100) + (td.year - 100)
  const randomMonth = Math.floor(Math.random() * 12) + 1
  const randomDay = Math.floor(Math.random() * 28) + 1

  dateOfBirth.value = new CalendarDate(randomYear, randomMonth, randomDay)
  gender.value = Math.random() < 0.5 ? 'Male' : 'Female'
}
</script>

<style>
.gender-radio-group label {
  width: 100%;
}
</style>
