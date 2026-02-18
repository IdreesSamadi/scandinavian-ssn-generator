<template>
  <u-container class="text-center py-8">
    <u-container>
      <h1 class="text-3xl font-bold mb-8 flex items-center justify-center flex-col">
        <p class="text-4xl">
          sweden
        </p>
        <p class="text-primary">
          PERSONNUMMER
        </p>
      </h1>
      <p class="text-lg mb-4">
        The personal identity number consists of <strong>12 digits</strong> and is based on the <strong>date of birth</strong> and a <strong>four-digit individual number</strong>.
        The format of the personal identity number is <strong>YYYYMMDD-NNNN</strong>, where <strong>YYYYMMDD</strong> represents the date of birth and <strong>NNNN</strong> is the individual that uses <strong>Luhn algorithm</strong>.
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

const formats = ['YYMMDD-NNNN', 'YYYYMMDD-NNNN', 'YYMMDDNNNN', 'YYYYMMDDNNNN']
const format = ref('YYYYMMDD-NNNN')

const output = ref('')
const isValid = ref(true)
/**
 * Generates a Swedish personal identity number (Personnummer) based on the provided date of birth and gender digit. The function uses the Luhn algorithm to calculate the check digit, ensuring that the generated number is valid according to Swedish standards.
 * @see https://en.wikipedia.org/wiki/Luhn_algorithm
 * @param dob - Date of birth in the format YYYYMMDD
 * @param genderDigit - The digit representing gender (odd for male, even for female)
 * @returns 12-digit personal identity number with a valid check digit
 */
const generatePersonnummer = (dob: string, genderDigit: number): string => {
  const controlDigits = randomDigit(2)
  const formatted = `${dob}${controlDigits}${genderDigit}`

  const ssn = formatted.slice(-9) // Get the last 9 digits for Luhn calculation
  let sum = 0

  for (let i = 0; i < ssn.length; i++) {
    let digit = parseInt(ssn[i]!)

    if (i % 2 === 0) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return `${formatted}${checkDigit}`
}

const handleChange = ({ dateOfBirth, genderDigit }: formData) => {
  const ssn = generatePersonnummer(dateOfBirth.replace(/-/g, ''), genderDigit)

  switch (format.value) {
    case 'YYMMDD-NNNN':
      output.value = `${ssn.slice(2, 8)}-${ssn.slice(8)}`
      break
    case 'YYYYMMDD-NNNN':
      output.value = `${ssn.slice(0, 8)}-${ssn.slice(8)}`
      break
    case 'YYMMDDNNNN':
      output.value = `${ssn.slice(2)}`
      break
    case 'YYYYMMDDNNNN':
      output.value = ssn
      break
  }
}

const validator = new Validator()
watch(output, (newValue) => {
  isValid.value = validator.isValid(newValue.replace(/[-+A]/g, ''), 'SE')
})

useSeoMeta({
  title: 'Sweden social security number (Personnummer) Generator and Validator',
  description: 'Generate and validate Swedish identity number (Personnummer) with ease using this online tool. Fake Personnummer generator and validator for testing purposes.',
  ogTitle: 'Sweden social security number (Personnummer) Generator and Validator',
  ogDescription: 'Generate and validate Swedish identity number (Personnummer) with ease using this online tool. Fake Personnummer generator and validator for testing purposes.'
})
</script>
