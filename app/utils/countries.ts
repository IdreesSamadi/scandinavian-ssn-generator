export type NordicCountry = 'sweden' | 'norway' | 'denmark' | 'finland' | 'iceland';

export interface FormatPart {
  text: string;
  kind: 'date' | 'century' | 'serial' | 'check' | 'sep';
}

export interface CountryInfo {
  country: NordicCountry;
  name: string;
  term: string;
  format: FormatPart[];
  spec: string;
  to: string;
}

export const nordicCountries: CountryInfo[] = [
  {
    country: 'sweden',
    name: 'Sweden',
    term: 'Personnummer',
    format: [
      { text: 'YYYYMMDD', kind: 'date' },
      { text: '-', kind: 'sep' },
      { text: 'NNN', kind: 'serial' },
      { text: 'C', kind: 'check' }
    ],
    spec: '12 digits · Luhn',
    to: '/sweden'
  },
  {
    country: 'denmark',
    name: 'Denmark',
    term: 'CPR-nummer',
    format: [
      { text: 'DDMMYY', kind: 'date' },
      { text: '-', kind: 'sep' },
      { text: 'S', kind: 'century' },
      { text: 'NN', kind: 'serial' },
      { text: 'C', kind: 'check' }
    ],
    spec: '10 digits · Mod 11',
    to: '/denmark'
  },
  {
    country: 'norway',
    name: 'Norway',
    term: 'Fødselsnummer',
    format: [
      { text: 'DDMMYY', kind: 'date' },
      { text: 'NNN', kind: 'serial' },
      { text: 'CC', kind: 'check' }
    ],
    spec: '11 digits · Mod 11',
    to: '/norway'
  },
  {
    country: 'finland',
    name: 'Finland',
    term: 'Henkilötunnus',
    format: [
      { text: 'DDMMYY', kind: 'date' },
      { text: 'S', kind: 'century' },
      { text: 'NNN', kind: 'serial' },
      { text: 'Q', kind: 'check' }
    ],
    spec: '11 chars · Mod 31',
    to: '/finland'
  },
  {
    country: 'iceland',
    name: 'Iceland',
    term: 'Kennitala',
    format: [
      { text: 'DDMMYY', kind: 'date' },
      { text: '-', kind: 'sep' },
      { text: 'NN', kind: 'serial' },
      { text: 'C', kind: 'check' },
      { text: 'S', kind: 'century' }
    ],
    spec: '10 digits · Mod 11',
    to: '/iceland'
  }
];
