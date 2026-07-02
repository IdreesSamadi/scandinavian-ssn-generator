<template>
  <u-container class="max-w-3xl py-10 sm:py-14">
    <country-hero
      country="norway"
      country-name="Norway"
      title="Fødselsnummer"
      :chips="['11 digits', 'DDMMYYNNNNN', 'Mod 11 checksum']"
    >
      Eleven digits: the date of birth, a three-digit individual number, and two check digits computed with modulus 11. The individual number encodes the century of birth and gender.
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
        About the Norwegian fødselsnummer
      </h2>
      <div class="mt-4 space-y-4 text-muted">
        <p>
          The fødselsnummer is Norway's eleven-digit birth number, administered by the Norwegian Tax Administration (Skatteetaten). It starts with the date of birth in DDMMYY order, followed by a three-digit individual number and two control digits. The individual number doubles as a century marker — separate ranges are reserved for people born in the 1800s, 1900s and 2000s — and its last digit is odd for men and even for women.
        </p>
        <p>
          Both control digits are weighted modulus 11 checksums. Some combinations produce a remainder of 10, which is not allowed, so those individual numbers are skipped entirely. Norway also issues D-numbers to temporary residents, which look like a fødselsnummer with 40 added to the day. The generator above searches for an individual number that yields two valid control digits for your chosen date of birth.
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
      current="norway"
      class="mt-16"
    />
  </u-container>
</template>

<script setup lang="ts">
import Validator from 'nordic-id-validator';
import type { formData } from '~/components/generator-form.vue';
import type { SsnSegment } from '~/components/ssn-display.vue';

const CONTROL_WEIGHTS_K1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const CONTROL_WEIGHTS_K2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

const formats = ['DDMMYY-NNNNN', 'DDMMYYNNNNN'];
const format = ref('DDMMYYNNNNN');

const segmentMap: Record<string, SsnSegment[]> = {
  'DDMMYY-NNNNN': [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 1, kind: 'sep' },
    { len: 3, kind: 'serial', label: 'individual' },
    { len: 2, kind: 'check', label: 'checksum' }
  ],
  'DDMMYYNNNNN': [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 3, kind: 'serial', label: 'individual' },
    { len: 2, kind: 'check', label: 'checksum' }
  ]
};

const output = ref('');
const isValid = ref(true);

function calculateControl(digits: number[], weights: number[]) {
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += digits[i]! * weights[i]!;
  }
  const remainder = sum % 11;
  if (remainder === 0) return 0;
  const result = 11 - remainder;
  return result === 10 ? -1 : result;
}

/**
 * Generates a Norwegian social security number (Fødselsnummer) based on the provided date of birth and gender digit. The function calculates the control digits using modulus 11 to ensure the validity of the generated number according to Norwegian standards.
 * @param dob - Date of birth in the format YYYY-MM-DD
 * @param genderDigit - The digit representing gender (odd for male, even for female)
 * @returns 11-digit social security number with valid control digits or null if no valid number can be generated
 */

function generateFodselsnummer(dob: string, genderDigit: number): string | null {
  const [yyyy, mm, dd] = dob.split('-') as string[];
  const year = parseInt(yyyy!);
  const yy = yyyy!.slice(-2);

  // Determine Individual Number range based on century
  let range = [0, 499];
  if (year >= 2000 && year <= 2039) range = [500, 999];
  else if (year >= 1854 && year <= 1899) range = [500, 749];

  const controlDigits = randomDigit(2);
  const ssn = `${dd}${mm}${yy}${controlDigits}${genderDigit}`;

  const birthDigits = ssn.split('').map(Number);

  // Loop through potential individual numbers until a valid one is found
  for (let i = range[0]!; i <= range[1]!; i++) {
    // k1 Weights: 3, 7, 6, 1, 8, 9, 4, 5, 2
    const k1 = calculateControl(birthDigits, CONTROL_WEIGHTS_K1);
    if (k1 === -1) continue;

    // k2 Weights: 5, 4, 3, 2, 7, 6, 5, 4, 3, 2
    const k2 = calculateControl([...birthDigits, k1], CONTROL_WEIGHTS_K2);
    if (k2 === -1) continue;

    return `${ssn}${k1}${k2}`;
  }

  return null;
}

const validator = new Validator();
const maxAttempts = 10;
let attempts = 0;
const handleChange = ({ dateOfBirth, genderDigit }: formData) => {
  const ssn = generateFodselsnummer(dateOfBirth, genderDigit);

  if (!ssn && attempts < maxAttempts) {
    console.error('Generated invalid Fødselsnummer, retrying... ' + attempts);
    attempts++;
    handleChange({ dateOfBirth, genderDigit });
    return;
  }

  switch (format.value) {
    case 'DDMMYY-NNNNN':
      output.value = `${ssn!.slice(0, 6)}-${ssn!.slice(6)}`;
      break;
    case 'DDMMYYNNNNN':
      output.value = ssn!;
      break;
  }

  attempts = 0;
};

watch(output, (newValue) => {
  isValid.value = validator.isValid(newValue.replace(/[-+]/g, ''), 'NO');
});

const faq = [
  {
    question: 'Are the generated fødselsnummer real?',
    answer: 'No. Each number combines the date of birth you choose with a random individual number and computed control digits. It is not checked against the National Population Register, and any overlap with a real person’s number is coincidental.'
  },
  {
    question: 'Why does the fødselsnummer have two check digits?',
    answer: 'The last two digits are separate weighted modulus 11 checksums: the first is computed over the nine preceding digits and the second over ten digits including the first checksum. Two control digits catch far more typing errors than one.'
  },
  {
    question: 'What is a D-number?',
    answer: 'A D-number is a temporary identity number for people who work or stay in Norway without being registered residents. It follows the fødselsnummer format, but 40 is added to the day of birth, so a person born on the 3rd gets 43 as the first two digits.'
  }
];

usePageSeo({
  title: 'Norwegian Fødselsnummer Generator & Validator — Test ID Numbers',
  description: 'Generate fake Norwegian fødselsnummer with valid modulus 11 control digits, or validate an existing birth number. Choose date of birth, age and gender. Free, browser-based test data for developers.',
  breadcrumb: 'Norway',
  faq
});
</script>
