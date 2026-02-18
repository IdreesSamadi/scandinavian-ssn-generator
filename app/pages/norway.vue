<template>
  <u-container class="text-center py-8">
    <u-container>
      <h1 class="text-3xl font-bold mb-8 flex items-center justify-center flex-col">
        <p class="text-4xl">
          norway
        </p>
        <p class="text-primary">
          FØDSELSNUMMER
        </p>
      </h1>
      <p class="text-lg mb-4">
        The social security number consists of <strong>11 digits</strong> and is divided into three parts: the <strong>date of birth (6 digits)</strong>, the <strong>individual number (3 digits)</strong>, and the <strong>check digit (2 digits)</strong>. The date of birth is represented in the format <strong>DDMMYY</strong>. The individual number is a unique identifier assigned to each person, while the check digit is calculated using a specific algorithm with <strong>modulus 11</strong> to ensure the validity of the social security number.
      </p>

      <u-separator
        size="xl"
        class="py-8 mb-4"
      />
    </u-container>
    <u-container>
      <generator-form
        v-model:output="output"
        v-model:format="format"
        :is-valid="isValid"
        :formats="formats"
        @change="handleChange"
      />
    </u-container>
  </u-container>
</template>

<script setup lang="ts">
import Validator from 'nordic-id-validator'
import type { formData } from '~/components/generator-form.vue'

const CONTROL_WEIGHTS_K1 = [3, 7, 6, 1, 8, 9, 4, 5, 2]
const CONTROL_WEIGHTS_K2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

const formats = ['DDMMYY-NNNNN', 'DDMMYYNNNNN']
const format = ref('DDMMYY-NNNNN')

const output = ref('')
const isValid = ref(true)

function calculateControl(digits: number[], weights: number[]) {
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += digits[i]! * weights[i]!
  }
  const remainder = sum % 11
  if (remainder === 0) return 0
  const result = 11 - remainder
  return result === 10 ? -1 : result
}

/**
 * Generates a Norwegian social security number (Fødselsnummer) based on the provided date of birth and gender digit. The function calculates the control digits using modulus 11 to ensure the validity of the generated number according to Norwegian standards.
 * @param dob - Date of birth in the format YYYY-MM-DD
 * @param genderDigit - The digit representing gender (odd for male, even for female)
 * @returns 11-digit social security number with valid control digits or null if no valid number can be generated
 */

function generateFodselsnummer(dob: string, genderDigit: number): string | null {
  const [yyyy, mm, dd] = dob.split('-') as string[]
  const year = parseInt(yyyy!)
  const yy = yyyy!.slice(-2)

  // Determine Individual Number range based on century
  let range = [0, 499]
  if (year >= 2000 && year <= 2039) range = [500, 999]
  else if (year >= 1854 && year <= 1899) range = [500, 749]

  const controlDigits = randomDigit(2)
  const ssn = `${dd}${mm}${yy}${controlDigits}${genderDigit}`

  const birthDigits = ssn.split('').map(Number)

  // Loop through potential individual numbers until a valid one is found
  for (let i = range[0]!; i <= range[1]!; i++) {
    // k1 Weights: 3, 7, 6, 1, 8, 9, 4, 5, 2
    const k1 = calculateControl(birthDigits, CONTROL_WEIGHTS_K1)
    if (k1 === -1) continue

    // k2 Weights: 5, 4, 3, 2, 7, 6, 5, 4, 3, 2
    const k2 = calculateControl([...birthDigits, k1], CONTROL_WEIGHTS_K2)
    if (k2 === -1) continue

    return `${ssn}${k1}${k2}`
  }

  return null
}

const validator = new Validator()
const maxAttempts = 10
let attempts = 0
const handleChange = ({ dateOfBirth, genderDigit }: formData) => {
  const ssn = generateFodselsnummer(dateOfBirth, genderDigit)

  if (!ssn && attempts < maxAttempts) {
    console.error('Generated invalid Fødselsnummer, retrying... ' + attempts)
    attempts++
    handleChange({ dateOfBirth, genderDigit })
    return
  }

  switch (format.value) {
    case 'DDMMYY-NNNNN':
      output.value = `${ssn!.slice(0, 6)}-${ssn!.slice(6)}`
      break
    case 'DDMMYYNNNNN':
      output.value = ssn!
      break
  }

  attempts = 0
}

watch(output, (newValue) => {
  isValid.value = validator.isValid(newValue.replace(/[-+]/g, ''), 'NO')
})

useSeoMeta({
  title: 'Norway Fødelsnummer Generator',
  description: 'Generate valid Norway Fødelsnummer (social security numbers) with customizable options for date of birth and gender. Generate fake Norwegian social security numbers for testing and development purposes.',
  ogTitle: 'Norway Fødelsnummer Generator',
  ogDescription: 'Generate valid Norway Fødelsnummer (social security numbers) with customizable options for date of birth and gender. Generate fake Norwegian social security numbers for testing and development purposes.',
  ogUrl: 'https://scandinavian-ssn-generator.com/norway'
})
</script>
