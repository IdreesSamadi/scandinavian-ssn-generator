declare module 'nordic-id-validator' {
  class Validator {
    isValid(id: string, countryCode: 'DK' | 'SE' | 'NO' | 'FI'): boolean
  }
  export default Validator
}
