<template>
  <u-container class="text-center py-8">
    <u-container>
      <h1 class="text-3xl font-bold mb-8 flex items-center justify-center flex-col">
        <p class="text-4xl">
          iceland
        </p>
        <p class="text-primary">
          KENNITALA
        </p>
      </h1>
      <p class="text-lg mb-4">
        The Icelandic national identification number, known as Kennitala, consists of <strong>10 digits</strong> and is based on the <strong>date of birth</strong> and a <strong>four-digit individual number</strong>. The format of the Kennitala is <strong>DDMMYY-XXXX</strong>, where <strong>DDMMYY</strong> represents the date of birth and <strong>XXXX</strong> is the individual number. The last digit of the individual number is a control digit that uses the modulus 11 algorithm.
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

const formats = ['DDMMYY-NNNN', 'DDMMYYNNNN']
const format = ref('DDMMYY-NNNN')

const output = ref('')
const isValid = ref(true)

function generateIcelandicKt(dob: string, _genderDigit: number): string | null {
  const [yyyy, mm, dd] = dob.split('-') as string[]
  const yy = yyyy!.slice(-2)
  const fullYear = parseInt(yyyy!, 10)

  // 1. Determine Century Digit (M)
  let centuryDigit = ''
  if (fullYear >= 1800 && fullYear <= 1899) centuryDigit = '8'
  else if (fullYear >= 1900 && fullYear <= 1999) centuryDigit = '9'
  else if (fullYear >= 2000 && fullYear <= 2099) centuryDigit = '0'

  const weights = [3, 2, 7, 6, 5, 4, 3, 2]

  // 2. Iterate through random sequence numbers (RR)
  // Personal kt. usually uses sequence numbers starting from 20.
  for (let r = 20; r <= 99; r++) {
    const rr = r.toString()
    const firstEight = `${dd}${mm}${yy}${rr}`

    let sum = 0
    for (let i = 0; i < 8; i++) {
      sum += parseInt(firstEight[i]!) * weights[i]!
    }

    // 3. Calculate Checksum (C)
    const remainder = sum % 11
    const checksumDigit = remainder === 0 ? 0 : 11 - remainder

    // In Iceland, if checksum is 10, the number is invalid.
    if (checksumDigit < 10) {
      return `${firstEight}${checksumDigit}${centuryDigit}`
    }
  }
  return null
}

const handleChange = (data: formData) => {
  const ssn = generateIcelandicKt(data.dateOfBirth, data.genderDigit)

  if (!ssn) {
    isValid.value = false
    output.value = ''
    return
  }

  switch (format.value) {
    case 'DDMMYY-NNNN':
      output.value = ssn ? `${ssn.slice(0, 6)}-${ssn.slice(6)}` : ''
      break
    case 'DDMMYYNNNN':
      output.value = ssn || ''
      break
  }
}

/**
 * Validates an Icelandic Kennitala.
 * @param {string} kt - The 10-digit Kennitala (with or without dash).
 * @returns {boolean} - True if valid.
 */
function validateIcelandicKt(kt: string): boolean {
  const cleanKt = kt.replace(/[-]/g, '')
  if (!/^\d{10}$/.test(cleanKt)) return false

  const day = parseInt(cleanKt.substring(0, 2))
  const month = parseInt(cleanKt.substring(2, 4))
  const yearDigits = parseInt(cleanKt.substring(4, 6))
  const checksum = parseInt(cleanKt.substring(8, 9))
  const centuryDigit = cleanKt.substring(9, 10)

  // 1. Validate Century and get Full Year
  let century
  if (centuryDigit === '8') century = 1800
  else if (centuryDigit === '9') century = 1900
  else if (centuryDigit === '0') century = 2000
  else return false // Unknown century digit

  const fullYear = century + yearDigits

  // 2. Validate Date
  // Note: Organizations have days increased by 40 (e.g., 41-71).
  // This validator is for individuals only.
  if (day > 31) return false
  const date = new Date(fullYear, month - 1, day)
  if (date.getFullYear() !== fullYear || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return false
  }

  // 3. Verify Checksum
  const weights = [3, 2, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleanKt[i]!) * weights[i]!
  }

  const remainder = sum % 11
  const expectedChecksum = remainder === 0 ? 0 : 11 - remainder

  return checksum === expectedChecksum
}

watch(output, (newValue) => {
  isValid.value = validateIcelandicKt(newValue)
}, { immediate: true })

useSeoMeta({
  title: 'Icelandic national identification number (Kennitala) Generator and Validator',
  description: 'Generate and validate Icelandic national identification number (Kennitala) with ease using this online tool. Generate fake Icelandic social security numbers (Kennitala) for testing purposes and validate real ones to ensure they are correctly formatted. ',
  ogTitle: 'Icelandic national identification number (Kennitala) Generator and Validator',
  ogDescription: 'Generate and validate Icelandic national identification number (Kennitala) with ease using this online tool. Generate fake Icelandic social security numbers (Kennitala) for testing purposes and validate real ones to ensure they are correctly formatted.',
})
</script>
