<template>
  <u-container class="text-center py-8">
    <u-container>
      <h1 class="text-3xl font-bold mb-8 flex items-center justify-center flex-col">
        <p class="text-4xl">
          finland
        </p>
        <p class="text-primary">
          HENKILÖTUNNUS
        </p>
      </h1>
      <p class="text-lg mb-4">
        The personal identity code consists of <strong>11 characters</strong> and is based on the <strong>date of birth</strong>, a <strong>three-digit individual number</strong>, and a <strong>control character</strong>.
        The format of the personal identity code is <strong>DDMMYYCZZZQ</strong>, where <strong>DDMMYY</strong> represents the date of birth, <strong>C</strong> is the century sign, <strong>ZZZ</strong> is the individual number, and <strong>Q</strong> is the control character that uses the modulus 31 algorithm.
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

const formats = ['DDMMYY-NNNNN', 'DDMMYYNNNNN']
const format = ref('DDMMYY-NNNNN')

const output = ref('')
const isValid = ref(true)

const centuryMap: Map<string, number> = new Map()
centuryMap.set('F', 2000)
centuryMap.set('E', 2000)
centuryMap.set('D', 2000)
centuryMap.set('C', 2000)
centuryMap.set('B', 2000)
centuryMap.set('A', 2000)
centuryMap.set('U', 1900)
centuryMap.set('V', 1900)
centuryMap.set('W', 1900)
centuryMap.set('X', 1900)
centuryMap.set('Y', 1900)
centuryMap.set('-', 1900)
centuryMap.set('+', 1800)

const daysInMonthMap: Map<string, number> = new Map()
daysInMonthMap.set('01', 31)
daysInMonthMap.set('02', 28)
daysInMonthMap.set('03', 31)
daysInMonthMap.set('04', 30)
daysInMonthMap.set('05', 31)
daysInMonthMap.set('06', 30)
daysInMonthMap.set('07', 31)
daysInMonthMap.set('08', 31)
daysInMonthMap.set('09', 30)
daysInMonthMap.set('10', 31)
daysInMonthMap.set('11', 30)
daysInMonthMap.set('12', 31)

function yearToPaddedString(year: number): string {
  return year % 100 < 10 ? `0${year}` : year.toString()
}
const checksumTable: string[] = '0123456789ABCDEFHJKLMNPRSTUVWXY'.split('')

const generateFinnishHETU = (dob: string, genderDigit: number): string => {
  const [yyyy, mm, dd] = dob.split('-') as string[]
  let year = parseInt(yyyy!)
  const rollingId = +`${randomDigit(2)}${genderDigit}`

  const possibleCenturySigns: string[] = []
  centuryMap.forEach((value: number, key: string) => {
    if (value === Math.floor(year / 100) * 100) {
      possibleCenturySigns.push(key)
    }
  })
  const centurySign = possibleCenturySigns[Math.floor(Math.random() * possibleCenturySigns.length)]

  year = year % 100
  const yearString = yearToPaddedString(year)
  const checksumBase = parseInt(dd! + mm! + yearString + rollingId, 10)
  const checksum = checksumTable[checksumBase % 31]

  return `${dd}${mm}${yearString}${centurySign}${rollingId}${checksum}`
}

const validator = new Validator()
const maxAttempts = 10
let attempts = 0
const handleChange = (data: formData) => {
  const ssn = generateFinnishHETU(data.dateOfBirth, data.genderDigit)

  if (!validator.isValid(ssn.replace(/[-A]/g, ''), 'FI') && attempts < maxAttempts) {
    console.error('Generated invalid HETU, retrying... ' + attempts)
    attempts++
    handleChange(data)
    return
  }

  switch (format.value) {
    case 'DDMMYY-NNNNN':
      output.value = `${ssn.slice(0, 6)}-${ssn.slice(6)}`
      break
    case 'DDMMYYNNNNN':
      output.value = ssn
      break
  }

  attempts = 0
}

watch(output, (newVal) => {
  isValid.value = validator.isValid(newVal.replace(/[-A]/g, ''), 'FI')
})

useSeoMeta({
  title: 'Finland personal identity code (Henkilötunnus) Generator and Validator',
  description: 'Generate and validate Finnish personal identity code (Henkilötunnus) with ease using this online tool. Generate fake HETU for testing purposes.',
  ogTitle: 'Finland personal identity code (Henkilötunnus) Generator and Validator',
  ogDescription: 'Generate and validate Finnish personal identity code (Henkilötunnus) with ease using this online tool. Generate fake HETU for testing purposes.'
})
</script>
