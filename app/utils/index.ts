export const randomEvenDigit = () => {
  const evenDigits = [0, 2, 4, 6, 8]
  return evenDigits[Math.floor(Math.random() * 5)]!
}

export const randomOddDigit = () => {
  const oddDigits = [1, 3, 5, 7, 9]
  return oddDigits[Math.floor(Math.random() * 5)]!
}

/**
 * Generates a string of random digits of the specified length
 * @param length - The number of random digits to generate
 * @returns A string of random digits of the specified length
 */
export const randomDigit = (length: number) => {
  const digits = Array.from({ length }, () => Math.floor(Math.random() * 10))
  return digits.join('')
}
