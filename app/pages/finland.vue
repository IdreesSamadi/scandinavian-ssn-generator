<template>
  <u-container class="max-w-3xl py-10 sm:py-14">
    <country-hero
      country="finland"
      country-name="Finland"
      title="Henkilötunnus"
      :chips="['11 characters', 'DDMMYYCNNNQ', 'Mod 31 checksum']"
    >
      Eleven characters: the date of birth, a century sign (+ for the 1800s, &minus; for the 1900s, A for the 2000s), a three-digit individual number, and a control character computed with modulus 31.
    </country-hero>

    <div class="mt-10">
      <generator-form
        v-model:output="output"
        v-model:format="format"
        :is-valid="isValid"
        :formats="formats"
        :segments="segmentMap[format] ?? []"
        @change="handleChange"
      />
    </div>

    <section class="mt-16">
      <h2 class="text-2xl font-bold tracking-tight text-highlighted">
        About the Finnish henkilötunnus
      </h2>
      <div class="mt-4 space-y-4 text-muted">
        <p>
          The henkilötunnus (personal identity code, often shortened to HETU) is issued by Finland's Digital and Population Data Services Agency (DVV). It has eleven characters: a six-digit date of birth, a century sign, a three-digit individual number — odd for men, even for women — and a control character. The control character is derived by dividing the nine digits by 31 and looking up the remainder in the table 0123456789ABCDEFHJKLMNPRSTUVWXY.
        </p>
        <p>
          The century sign was long a single symbol: + for the 1800s, − for the 1900s and A for the 2000s. Because individual numbers for some dates are running out, a 2023 reform added alternative signs — B–F for people born in the 2000s and U–Y for the 1900s. The classic signs remain valid and are what most systems, including this generator, produce and accept.
        </p>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-2xl font-bold tracking-tight text-highlighted">
        Frequently asked questions
      </h2>
      <div class="mt-6 space-y-6">
        <div
          v-for="item in faq"
          :key="item.question"
        >
          <h3 class="font-semibold text-highlighted">
            {{ item.question }}
          </h3>
          <p class="mt-1.5 text-muted">
            {{ item.answer }}
          </p>
        </div>
      </div>
    </section>

    <related-countries
      current="finland"
      class="mt-16"
    />
  </u-container>
</template>

<script setup lang="ts">
import Validator from 'nordic-id-validator';
import type { formData } from '~/components/generator-form.vue';
import type { SsnSegment } from '~/components/ssn-display.vue';

const formats = ['DDMMYYCNNNQ'];
const format = ref('DDMMYYCNNNQ');

const segmentMap: Record<string, SsnSegment[]> = {
  DDMMYYCNNNQ: [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 1, kind: 'century', label: 'century sign' },
    { len: 3, kind: 'serial', label: 'individual' },
    { len: 1, kind: 'check', label: 'control char' }
  ]
};

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
    case 'DDMMYYCNNNQ':
      output.value = ssn;
      break;
  }

  attempts = 0;
};

watch(output, (newVal) => {
  isValid.value = validator.isValid(newVal, 'FI');
});

const faq = [
  {
    question: 'Are the generated henkilötunnus real?',
    answer: 'No. Each code combines the date of birth you choose with a random individual number and a computed control character. It is not checked against the Population Information System, and any match with a real person’s code is coincidental.'
  },
  {
    question: 'What does the letter in the middle of a henkilötunnus mean?',
    answer: 'The seventh character is the century sign: + means born in the 1800s, − in the 1900s and A in the 2000s. Since 2023, the letters B–F and U–Y can also appear as alternative signs for the 2000s and 1900s respectively.'
  },
  {
    question: 'How is the last character calculated?',
    answer: 'The nine digits — date of birth plus individual number — are read as one number and divided by 31. The remainder is looked up in the character table 0123456789ABCDEFHJKLMNPRSTUVWXY, and that character becomes the control character.'
  }
];

usePageSeo({
  title: 'Finnish Henkilötunnus (HETU) Generator & Validator — Test IDs',
  description: 'Generate fake Finnish personal identity codes (henkilötunnus / HETU) with a valid mod 31 control character, or validate an existing code. Free, browser-based test data for developers.',
  breadcrumb: 'Finland',
  faq
});
</script>
