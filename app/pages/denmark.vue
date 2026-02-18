<template>
  <u-container class="text-center py-8">
    <u-container>
      <h1 class="text-3xl font-bold mb-8 flex items-center justify-center flex-col">
        <p class="text-4xl">
          denmark
        </p>
        <p class="text-primary">
          PERSONNUMMER
        </p>
      </h1>
      <p class="text-lg mb-4">
        The Danish personal identification number (personnummer), known as the CPR number, consists of <strong>10 digits</strong> and is based on the <strong>date of birth</strong> and a <strong>four-digit individual number</strong>.
        The format of the personnummer is <strong>DDMMYY-NNNN</strong>, where <strong>DDMMYY</strong> represents the date of birth and <strong>NNNN</strong> is the individual number that uses the <strong>Luhn algorithm</strong>.
      </p>
      <p>
        The CPR algorithm is based on the <a
          class="text-primary hover:underline"
          href="https://cdn9.cpr.dk/cpr/media/17534/personnummeret-i-cpr.pdf"
        >Personnummeret i CPR-systemet document</a>.
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
import type { formData } from '~/components/generator-form.vue'
import Validator from 'nordic-id-validator'

const formats = ['DDMMYY-NNNN', 'DDMMYYNNNN']
const format = ref('DDMMYY-NNNN')

const output = ref('')
const isValid = ref(true)

/**
 * Generates a valid Danish CPR based on birthdate and gender parity.
 * @param {string} dob - Date of birth in 'yyyymmdd' format.
 * @param {number} genderDigit - Any number; parity determines gender (odd = male, even = female).
 * @returns {string|null} - A valid 10-digit CPR or null if no match found.
 */
/**
 * Generates a valid Danish CPR number.
 * @param {string} dob - Format 'yyyymmdd' (e.g., '19900101')
 * @param {number} genderDigit - Odd for male, even for female
 */
function generateCPR(dob: string, genderDigit: number): string | null {
  const [yyyy, mm, dd] = dob.split('-') as string[]
  const yy = yyyy!.slice(-2)

  const ddmmyy = `${dd}${mm}${yy}`
  const isMaleTarget = genderDigit % 2 !== 0

  // 2. Identify possible 7th digits based on the official century table
  const getSeventhDigits = (fullYear: number): number[] => {
    const list: number[] = []
    // 1900 - 1999
    if (fullYear >= 1900 && fullYear <= 1999) list.push(0, 1, 2, 3)
    // 1937 - 1999 OR 2000 - 2036
    if ((fullYear >= 1937 && fullYear <= 1999) || (fullYear >= 2000 && fullYear <= 2036)) list.push(4, 9)
    // 1858 - 1899 OR 2000 - 2057
    if ((fullYear >= 1858 && fullYear <= 1899) || (fullYear >= 2000 && fullYear <= 2057)) list.push(5, 6, 7, 8)

    return [...new Set(list)]
  }

  const possibleSeventh = getSeventhDigits(+yyyy!)
  const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2]

  // 3. Loop through possible sequence numbers
  for (const seventh of possibleSeventh) {
    for (let seq = 0; seq <= 99; seq++) {
      const eighthNinth = seq.toString().padStart(2, '0')
      const firstNine = `${ddmmyy}${seventh}${eighthNinth}`

      // Calculate Modulus 11 Sum
      let sum = 0
      for (let i = 0; i < 9; i++) {
        sum += parseInt(firstNine[i]!) * weights[i]!
      }

      const remainder = sum % 11
      let controlDigit

      if (remainder === 0) {
        controlDigit = 0
      } else if (remainder === 1) {
        continue // Checksum would be 10, which is invalid
      } else {
        controlDigit = 11 - remainder
      }

      // 4. Validate Gender and Return
      const isMale = controlDigit % 2 !== 0
      if (isMale === isMaleTarget) {
        return `${ddmmyy}${seventh}${eighthNinth}${controlDigit}`
      }
    }
  }

  return null // Only happens if Modulus 11 is mathematically impossible for this date/gender
}

const maxAttempts = 10
let attempts = 0
const handleChange = (data: formData) => {
  const ssn = generateCPR(data.dateOfBirth, data.genderDigit)

  if (!ssn && attempts < maxAttempts) {
    console.error('Generated invalid CPR, retrying... ' + attempts)
    attempts++
    handleChange(data)
    return
  }

  switch (format.value) {
    case 'DDMMYY-NNNN':
      output.value = `${ssn!.slice(0, 6)}-${ssn!.slice(6)}`
      break
    case 'DDMMYYNNNN':
      output.value = ssn!
      break
  }

  attempts = 0
}

const validator = new Validator()
watch(output, (newValue) => {
  isValid.value = validator.isValid(newValue, 'DK')
})

useSeoMeta({
  title: 'Denmark personal identification number (Personnummer) Generator and Validator',
  description: 'Generate and validate Danish personal identification number (Personnummer) with ease using this online tool. Generate fake CPR numbers for testing purposes and validate real ones to ensure they are correctly formatted.',
  ogTitle: 'Denmark personal identification number (Personnummer) Generator and Validator',
  ogDescription: 'Generate and validate Danish personal identification number (Personnummer) with ease using this online tool. Generate fake CPR numbers for testing purposes and validate real ones to ensure they are correctly formatted.'
})
</script>
