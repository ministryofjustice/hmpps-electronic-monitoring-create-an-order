function get<T>(name: string, fallback: T): T | string {
  if (Cypress.env(name) !== undefined) {
    return Cypress.env(name)
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

export default {
  screenshots_enabled: get('SCREENSHOTS_ENABLED', true),
}
