export type PageElement = Cypress.Chainable<JQuery>

const buildUrl = (template: string, params: object = {}, query: object = {}) => {
  const parts = template.split('/')

  Object.keys(params).forEach(param => {
    const index = parts.indexOf(`:${param}`)
    if (index > -1) {
      parts[index] = params[param]
    }
  })

  const uri = parts.join('/')

  const querystring: string[] = []
  Object.keys(query).forEach(key => {
    querystring.push(`${key}=${query[key]}`)
  })

  return `${uri}${querystring.length > 0 ? '&' : ''}${querystring.join('&')}`
}

export default abstract class Page {
  static verifyOnPage<T extends Page, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    params?: object,
    query?: object,
    ...args: Args
  ): T

  static verifyOnPage<T extends Page, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    title: string,
    ...args: Args
  ): T

  static verifyOnPage<T extends Page, Args extends unknown[]>(constructor: new (...args: Args) => T, ...args: Args): T

  static verifyOnPage<T extends Page, Args extends unknown[]>(constructor: new (...args: Args) => T, ...args: Args): T {
    let params: object = {}
    let query: object = {}

    if (typeof args[0] !== 'string') {
      params = args.pop() as object
      query = args.pop() as object
    }

    const page = new constructor(...args)

    page.checkOnPage()

    if (page.uri && !(page.uri as RegExp)) {
      page.checkUrl(params, query)
    }

    return page
  }

  static visit<T extends Page, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    params?: object,
    query?: object,
    ...args: Args
  ): T

  static visit<T extends Page, Args extends unknown[]>(constructor: new (...args: Args) => T, ...args: Args): T {
    let params: object = {}
    let query: object = {}

    if (typeof args[0] !== 'string') {
      params = args.pop() as object
      query = args.pop() as object
    }

    const page = new constructor(...args)

    if (!page.uri) {
      throw new Error(`${constructor} has no <uri: string> defined so it is not possible to visit it.`)
    }
    const url = buildUrl(page.uri as string, params, query)
    cy.visit(url)

    page.checkOnPage()
    return page
  }

  constructor(
    public readonly title: string,
    public readonly uri?: string | RegExp,
    public readonly subtitle?: string,
  ) {}

  checkOnPage(): void {
    cy.get('h1', { log: false }).contains(this.title)

    if (this.subtitle) {
      cy.get('h2, legend', { log: false }).contains(this.subtitle)
    }
  }

  checkIsAccessible(): void {
    cy.isAccessible()
  }

  checkUrl(params: object = {}, query: object = {}): void {
    const url = buildUrl(this.uri as string, params, query)

    cy.url().should('equal', `${Cypress.config().baseUrl}${url}`)
  }
}
