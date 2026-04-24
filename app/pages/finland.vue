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
import Validator from 'nordic-id-validator';
import type { formData } from '~/components/generator-form.vue';

const formats = ['DDMMYYNNNNN'];
const format = ref('DDMMYYNNNNN');

const output = ref('');
const isValid = ref(true);

function yearToPaddedString(year: number): string {
  return year % 100 < 10 ? `0${year}` : year.toString();
}

function getCenturySign(year: number): string {
  if (year >= 2000) return 'A';
  if (year >= 1900) return '-';
  return '+';
}

const checksumTable: string[] = '0123456789ABCDEFHJKLMNPRSTUVWXY'.split('');

const generateFinnishHETU = (dob: string, genderDigit: number): string => {
  const [yyyy, mm, dd] = dob.split('-') as string[];
  const fullYear = parseInt(yyyy!);
  const rollingId = `${randomDigit(2)}${genderDigit}`;
  const centurySign = getCenturySign(fullYear);

  const year = fullYear % 100;
  const yearString = yearToPaddedString(year);
  const checksumBase = parseInt(dd! + mm! + yearString + rollingId, 10);
  const checksum = checksumTable[checksumBase % 31];

  return `${dd}${mm}${yearString}${centurySign}${rollingId}${checksum}`;
};

const validator = new Validator();
const maxAttempts = 10;
let attempts = 0;
const handleChange = (data: formData) => {
  const ssn = generateFinnishHETU(data.dateOfBirth, data.genderDigit);

  if (!validator.isValid(ssn, 'FI') && attempts < maxAttempts) {
    console.error('Generated invalid HETU, retrying... ' + attempts);
    attempts++;
    handleChange(data);
    return;
  }

  switch (format.value) {
    case 'DDMMYYNNNNN':
      output.value = ssn;
      break;
  }

  attempts = 0;
};

watch(output, (newVal) => {
  isValid.value = validator.isValid(newVal, 'FI');
});

useSeoMeta({
  title: 'Finland personal identity code (Henkilötunnus) Generator and Validator',
  description: 'Generate and validate Finnish personal identity code (Henkilötunnus) with ease using this online tool. Generate fake HETU for testing purposes.',
  ogTitle: 'Finland personal identity code (Henkilötunnus) Generator and Validator',
  ogDescription: 'Generate and validate Finnish personal identity code (Henkilötunnus) with ease using this online tool. Generate fake HETU for testing purposes.'
});
</script>
