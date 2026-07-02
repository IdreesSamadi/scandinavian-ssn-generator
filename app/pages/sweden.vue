<template>
  <u-container class="max-w-3xl py-10 sm:py-14">
    <country-hero
      country="sweden"
      country-name="Sweden"
      title="Personnummer"
      :chips="['12 digits', 'YYYYMMDD-NNNN', 'Luhn checksum']"
    >
      Twelve digits: the date of birth followed by a three-digit individual number and a check digit computed with the Luhn algorithm. The second-to-last digit is odd for men and even for women.
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
        About the Swedish personnummer
      </h2>
      <div class="mt-4 space-y-4 text-muted">
        <p>
          The personnummer is Sweden's national identity number, issued by the Swedish Tax Agency (Skatteverket) to everyone registered in the country. In its full form it has twelve digits: an eight-digit date of birth, a three-digit birth number, and a check digit. The second-to-last digit encodes gender — odd for men, even for women — and the check digit is a Luhn checksum computed over the ten-digit short form.
        </p>
        <p>
          Real systems accept several spellings of the same number: the ten-digit form with a hyphen (YYMMDD-NNNN), which switches to a plus sign the year a person turns 100, and the twelve-digit machine form used by most modern APIs. The generator above produces these formats with a correct checksum, so you can exercise parsing, storage and validation logic with data that behaves exactly like the real thing.
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
      current="sweden"
      class="mt-16"
    />
  </u-container>
</template>

<script setup lang="ts">
import Validator from 'nordic-id-validator';
import type { formData } from '~/components/generator-form.vue';
import type { SsnSegment } from '~/components/ssn-display.vue';

const formats = ['YYMMDD-NNNN', 'YYYYMMDD-NNNN', 'YYMMDDNNNN', 'YYYYMMDDNNNN'];
const format = ref('YYYYMMDD-NNNN');

const segmentMap: Record<string, SsnSegment[]> = {
  'YYMMDD-NNNN': [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 1, kind: 'sep' },
    { len: 3, kind: 'serial', label: 'individual' },
    { len: 1, kind: 'check', label: 'checksum' }
  ],
  'YYYYMMDD-NNNN': [
    { len: 8, kind: 'date', label: 'birth date' },
    { len: 1, kind: 'sep' },
    { len: 3, kind: 'serial', label: 'individual' },
    { len: 1, kind: 'check', label: 'checksum' }
  ],
  'YYMMDDNNNN': [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 3, kind: 'serial', label: 'individual' },
    { len: 1, kind: 'check', label: 'checksum' }
  ],
  'YYYYMMDDNNNN': [
    { len: 8, kind: 'date', label: 'birth date' },
    { len: 3, kind: 'serial', label: 'individual' },
    { len: 1, kind: 'check', label: 'checksum' }
  ]
};

const output = ref('');
const isValid = ref(true);
/**
 * Generates a Swedish personal identity number (Personnummer) based on the provided date of birth and gender digit. The function uses the Luhn algorithm to calculate the check digit, ensuring that the generated number is valid according to Swedish standards.
 * @see https://en.wikipedia.org/wiki/Luhn_algorithm
 * @param dob - Date of birth in the format YYYYMMDD
 * @param genderDigit - The digit representing gender (odd for male, even for female)
 * @returns 12-digit personal identity number with a valid check digit
 */
const generatePersonnummer = (dob: string, genderDigit: number): string => {
  const controlDigits = randomDigit(2);
  const formatted = `${dob}${controlDigits}${genderDigit}`;

  const ssn = formatted.slice(-9); // Get the last 9 digits for Luhn calculation
  let sum = 0;

  for (let i = 0; i < ssn.length; i++) {
    let digit = parseInt(ssn[i]!);

    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return `${formatted}${checkDigit}`;
};

const handleChange = ({ dateOfBirth, genderDigit }: formData) => {
  const ssn = generatePersonnummer(dateOfBirth.replace(/-/g, ''), genderDigit);

  switch (format.value) {
    case 'YYMMDD-NNNN':
      output.value = `${ssn.slice(2, 8)}-${ssn.slice(8)}`;
      break;
    case 'YYYYMMDD-NNNN':
      output.value = `${ssn.slice(0, 8)}-${ssn.slice(8)}`;
      break;
    case 'YYMMDDNNNN':
      output.value = `${ssn.slice(2)}`;
      break;
    case 'YYYYMMDDNNNN':
      output.value = ssn;
      break;
  }
};

const validator = new Validator();
watch(output, (newValue) => {
  isValid.value = validator.isValid(newValue.replace(/[-+A]/g, ''), 'SE');
});

const faq = [
  {
    question: 'Are the generated personnummer real?',
    answer: 'No. Each number is assembled from the date of birth you choose and random digits, then given a valid Luhn check digit. It is not looked up against any register, and any match with a living person’s number is pure coincidence.'
  },
  {
    question: 'What do the digits in a Swedish personnummer mean?',
    answer: 'The first eight digits (YYYYMMDD) are the date of birth. The next three are the birth number, whose last digit is odd for men and even for women. The final digit is a checksum calculated with the Luhn algorithm over the ten-digit short form.'
  },
  {
    question: 'Can I use these numbers outside of testing?',
    answer: 'They are meant for test and development environments. Using a fabricated identity number to impersonate someone or sign up for real services may be illegal. Skatteverket also publishes official test personnummer for public test data.'
  }
];

usePageSeo({
  title: 'Swedish Personnummer Generator & Validator — Fake Test SSN',
  description: 'Generate fake Swedish personnummer with a valid Luhn checksum, or validate an existing personal identity number. Choose age, gender, date of birth and format. Free and browser-based, for software testing.',
  breadcrumb: 'Sweden',
  faq
});
</script>
