const Locales = {
  en: 'en',
  cy: 'cy',
} as const

type Locale = keyof typeof Locales

export default Locale

export { Locales }
