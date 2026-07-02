<template>
  <u-container class="max-w-3xl py-10 sm:py-14">
    <country-hero
      country="denmark"
      country-name="Denmark"
      title="CPR-nummer"
      :chips="['10 digits', 'DDMMYY-NNNN', 'Mod 11 checksum']"
    >
      Ten digits: the date of birth followed by a four-digit sequence number whose first digit encodes the century and whose last digit doubles as a modulus 11 check digit — odd for men, even for women. Based on the
      <a
        class="text-primary hover:underline"
        href="https://cdn9.cpr.dk/cpr/media/17534/personnummeret-i-cpr.pdf"
        target="_blank"
      >Personnummeret i CPR-systemet</a> document.
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
        About the Danish CPR number
      </h2>
      <div class="mt-4 space-y-4 text-muted">
        <p>
          The CPR number (CPR-nummer, or personnummer) has identified every resident of Denmark since the Central Person Register was introduced in 1968. It has ten digits: a six-digit date of birth in DDMMYY order followed by a four-digit sequence number. The seventh digit encodes the century of birth according to an official table, and the last digit is odd for men and even for women.
        </p>
        <p>
          Originally every CPR number also satisfied a modulus 11 checksum. Denmark began issuing numbers without a valid check digit in 2007, when the supply for some birth dates ran out — but a large share of real-world systems still enforce the old rule. The generator above always produces numbers that pass modulus 11, so they are accepted by strict and modern validators alike.
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
      current="denmark"
      class="mt-16"
    />
  </u-container>
</template>

<script setup lang="ts">
import type { formData } from '~/components/generator-form.vue';
import type { SsnSegment } from '~/components/ssn-display.vue';
import Validator from 'nordic-id-validator';

const formats = ['DDMMYY-NNNN', 'DDMMYYNNNN'];
const format = ref('DDMMYY-NNNN');

const segmentMap: Record<string, SsnSegment[]> = {
  'DDMMYY-NNNN': [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 1, kind: 'sep' },
    { len: 1, kind: 'century', label: 'century' },
    { len: 2, kind: 'serial', label: 'sequence' },
    { len: 1, kind: 'check', label: 'checksum' }
  ],
  'DDMMYYNNNN': [
    { len: 6, kind: 'date', label: 'birth date' },
    { len: 1, kind: 'century', label: 'century' },
    { len: 2, kind: 'serial', label: 'sequence' },
    { len: 1, kind: 'check', label: 'checksum' }
  ]
};

const output = ref('');
const isValid = ref(true);

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
  const [yyyy, mm, dd] = dob.split('-') as string[];
  const yy = yyyy!.slice(-2);

  const ddmmyy = `${dd}${mm}${yy}`;
  const isMaleTarget = genderDigit % 2 !== 0;

  // 2. Identify possible 7th digits based on the official century table
  const getSeventhDigits = (fullYear: number): number[] => {
    const list: number[] = [];
    // 1900 - 1999
    if (fullYear >= 1900 && fullYear <= 1999) list.push(0, 1, 2, 3);
    // 1937 - 1999 OR 2000 - 2036
    if ((fullYear >= 1937 && fullYear <= 1999) || (fullYear >= 2000 && fullYear <= 2036)) list.push(4, 9);
    // 1858 - 1899 OR 2000 - 2057
    if ((fullYear >= 1858 && fullYear <= 1899) || (fullYear >= 2000 && fullYear <= 2057)) list.push(5, 6, 7, 8);

    return [...new Set(list)];
  };

  const possibleSeventh = getSeventhDigits(+yyyy!);
  const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2];

  // 3. Loop through possible sequence numbers
  for (const seventh of possibleSeventh) {
    for (let seq = 0; seq <= 99; seq++) {
      const eighthNinth = seq.toString().padStart(2, '0');
      const firstNine = `${ddmmyy}${seventh}${eighthNinth}`;

      // Calculate Modulus 11 Sum
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(firstNine[i]!) * weights[i]!;
      }

      const remainder = sum % 11;
      let controlDigit;

      if (remainder === 0) {
        controlDigit = 0;
      } else if (remainder === 1) {
        continue; // Checksum would be 10, which is invalid
      } else {
        controlDigit = 11 - remainder;
      }

      // 4. Validate Gender and Return
      const isMale = controlDigit % 2 !== 0;
      if (isMale === isMaleTarget) {
        return `${ddmmyy}${seventh}${eighthNinth}${controlDigit}`;
      }
    }
  }

  return null; // Only happens if Modulus 11 is mathematically impossible for this date/gender
}

const maxAttempts = 10;
let attempts = 0;
const handleChange = (data: formData) => {
  const ssn = generateCPR(data.dateOfBirth, data.genderDigit);

  if (!ssn && attempts < maxAttempts) {
    console.error('Generated invalid CPR, retrying... ' + attempts);
    attempts++;
    handleChange(data);
    return;
  }

  switch (format.value) {
    case 'DDMMYY-NNNN':
      output.value = `${ssn!.slice(0, 6)}-${ssn!.slice(6)}`;
      break;
    case 'DDMMYYNNNN':
      output.value = ssn!;
      break;
  }

  attempts = 0;
};

const validator = new Validator();
watch(output, (newValue) => {
  isValid.value = validator.isValid(newValue, 'DK');
});

const faq = [
  {
    question: 'Are the generated CPR numbers real?',
    answer: 'No. Each number is built from the date of birth you choose plus a sequence number that satisfies the modulus 11 checksum. It is not checked against the Central Person Register, and any match with a real person’s CPR number is coincidental.'
  },
  {
    question: 'Do all real CPR numbers pass the modulus 11 check?',
    answer: 'No. Since 2007 Denmark has issued CPR numbers without a valid check digit for birth dates where the numbering pool ran out, so validators should not require it. Numbers from this tool always pass modulus 11, which means both strict and lenient systems accept them.'
  },
  {
    question: 'What does the seventh digit of a CPR number mean?',
    answer: 'Together with the two-digit year, the seventh digit determines the century of birth: 0–3 always means the 1900s, while 4, 9 and 5–8 map to the 1800s, 1900s or 2000s depending on the year. This tool picks a seventh digit that matches the date of birth you selected.'
  }
];

usePageSeo({
  title: 'Danish CPR Number Generator & Validator — Fake Test CPR',
  description: 'Generate fake Danish CPR numbers (personnummer) that pass the modulus 11 check, or validate an existing CPR-nummer. Pick age, gender and format. Free, browser-based test data for developers.',
  breadcrumb: 'Denmark',
  faq
});
</script>
