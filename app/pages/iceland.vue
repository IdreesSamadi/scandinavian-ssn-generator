<template>
  <u-container class="max-w-3xl py-10 sm:py-14">
    <country-hero
      country="iceland"
      country-name="Iceland"
      title="Kennitala"
      :chips="['10 digits', 'DDMMYY-NNNN', 'Mod 11 checksum']"
    >
      Ten digits: the date of birth, a two-digit sequence number, a modulus 11 check digit, and a final digit marking the century of birth (9 for the 1900s, 0 for the 2000s).
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
        About the Icelandic kennitala
      </h2>
      <div class="mt-4 space-y-4 text-muted">
        <p>
          The kennitala is Iceland's national identification number, maintained by Registers Iceland (Þjóðskrá Íslands). Its ten digits are the date of birth in DDMMYY order, a two-digit sequence number that starts at 20, a modulus 11 check digit, and a final century digit — 8 for the 1800s, 9 for the 1900s and 0 for the 2000s.
        </p>
        <p>
          Unlike most national ID numbers, the kennitala is not treated as a secret in Iceland: it is used openly for everything from banking to gym memberships. Companies and institutions receive kennitölur too, distinguished by adding 40 to the day of the month. The generator above produces personal kennitölur with a valid check digit for any date you pick.
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
      current="iceland"
      class="mt-16"
    />
  </u-container>
</template>

<script setup lang="ts">
import type { formData } from '~/components/generator-form.vue';
import type { SsnSegment } from '~/components/ssn-display.vue';

const formats = ['DDMMYY-NNNN', 'DDMMYYNNNN'];
const format = ref('DDMMYY-NNNN');

const segmentMap: Record<string, SsnSegment[]> = {
  'DDMMYY-NNNN': [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 1, kind: 'sep' },
    { len: 2, kind: 'serial', label: 'sequence' },
    { len: 1, kind: 'check', label: 'checksum' },
    { len: 1, kind: 'century', label: 'century' }
  ],
  'DDMMYYNNNN': [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 2, kind: 'serial', label: 'sequence' },
    { len: 1, kind: 'check', label: 'checksum' },
    { len: 1, kind: 'century', label: 'century' }
  ]
};

const output = ref('');
const isValid = ref(true);

function generateIcelandicKt(dob: string, _genderDigit: number): string | null {
  const [yyyy, mm, dd] = dob.split('-') as string[];
  const yy = yyyy!.slice(-2);
  const fullYear = parseInt(yyyy!, 10);

  // 1. Determine Century Digit (M)
  let centuryDigit = '';
  if (fullYear >= 1800 && fullYear <= 1899) centuryDigit = '8';
  else if (fullYear >= 1900 && fullYear <= 1999) centuryDigit = '9';
  else if (fullYear >= 2000 && fullYear <= 2099) centuryDigit = '0';

  const weights = [3, 2, 7, 6, 5, 4, 3, 2];

  // 2. Iterate through random sequence numbers (RR)
  // Personal kt. usually uses sequence numbers starting from 20.
  for (let r = 20; r <= 99; r++) {
    const rr = r.toString();
    const firstEight = `${dd}${mm}${yy}${rr}`;

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(firstEight[i]!) * weights[i]!;
    }

    // 3. Calculate Checksum (C)
    const remainder = sum % 11;
    const checksumDigit = remainder === 0 ? 0 : 11 - remainder;

    // In Iceland, if checksum is 10, the number is invalid.
    if (checksumDigit < 10) {
      return `${firstEight}${checksumDigit}${centuryDigit}`;
    }
  }
  return null;
}

const handleChange = (data: formData) => {
  const ssn = generateIcelandicKt(data.dateOfBirth, data.genderDigit);

  if (!ssn) {
    isValid.value = false;
    output.value = '';
    return;
  }

  switch (format.value) {
    case 'DDMMYY-NNNN':
      output.value = ssn ? `${ssn.slice(0, 6)}-${ssn.slice(6)}` : '';
      break;
    case 'DDMMYYNNNN':
      output.value = ssn || '';
      break;
  }
};

/**
 * Validates an Icelandic Kennitala.
 * @param {string} kt - The 10-digit Kennitala (with or without dash).
 * @returns {boolean} - True if valid.
 */
function validateIcelandicKt(kt: string): boolean {
  const cleanKt = kt.replace(/[-]/g, '');
  if (!/^\d{10}$/.test(cleanKt)) return false;

  const day = parseInt(cleanKt.substring(0, 2));
  const month = parseInt(cleanKt.substring(2, 4));
  const yearDigits = parseInt(cleanKt.substring(4, 6));
  const checksum = parseInt(cleanKt.substring(8, 9));
  const centuryDigit = cleanKt.substring(9, 10);

  // 1. Validate Century and get Full Year
  let century;
  if (centuryDigit === '8') century = 1800;
  else if (centuryDigit === '9') century = 1900;
  else if (centuryDigit === '0') century = 2000;
  else return false; // Unknown century digit

  const fullYear = century + yearDigits;

  // 2. Validate Date
  // Note: Organizations have days increased by 40 (e.g., 41-71).
  // This validator is for individuals only.
  if (day > 31) return false;
  const date = new Date(fullYear, month - 1, day);
  if (date.getFullYear() !== fullYear || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return false;
  }

  // 3. Verify Checksum
  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleanKt[i]!) * weights[i]!;
  }

  const remainder = sum % 11;
  const expectedChecksum = remainder === 0 ? 0 : 11 - remainder;

  return checksum === expectedChecksum;
}

watch(output, (newValue) => {
  isValid.value = validateIcelandicKt(newValue);
}, { immediate: true });

const faq = [
  {
    question: 'Are the generated kennitölur real?',
    answer: 'No. Each number combines the date of birth you choose with a sequence number and a computed modulus 11 check digit. It is not checked against Registers Iceland, and any match with a real person’s kennitala is coincidental.'
  },
  {
    question: 'Why is the check digit not the last digit?',
    answer: 'The ninth digit is the modulus 11 checksum, computed over the first eight digits. The tenth and final digit marks the century of birth instead: 8 for the 1800s, 9 for the 1900s and 0 for the 2000s.'
  },
  {
    question: 'How do company kennitölur differ from personal ones?',
    answer: 'Organisations registered in Iceland get a kennitala where 40 is added to the day of the month, so a company registered on the 5th starts with 45. This tool generates personal kennitölur only.'
  }
];

usePageSeo({
  title: 'Icelandic Kennitala Generator & Validator — Fake Test Numbers',
  description: 'Generate fake Icelandic kennitala with a valid modulus 11 check digit, or validate an existing national ID number. Choose date of birth, age and format. Free, browser-based test data for developers.',
  breadcrumb: 'Iceland',
  faq
});
</script>
