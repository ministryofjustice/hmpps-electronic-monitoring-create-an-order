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
  static verifyOnPage<T extends Page, Args extends unknown[]>(constructor: new (...args: Args) => T, ...args: Args): T {
    const page = new constructor(...args)

    page.checkOnPage()
    return page
  }

  static visit<T extends Page, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    params: object = {},
    query: object = {},
    ...args: Args
  ): T {
    const page = new constructor(...args)

    if (!page.uri) {
      throw new Error(`${constructor} has no <uri: string> defined so it is not possible to visit it.`)
    }
    const url = buildUrl(page.uri, params, query)
    cy.visit(url)

    page.checkOnPage()
    return page
  }

  constructor(
    public readonly title: string,
    public readonly uri?: string,
    public readonly subtitle?: string,
  ) {}

  checkOnPage(): void {
    cy.get('h1').contains(this.title)

    if (this.subtitle) cy.get('legend').contains(this.subtitle)
  }

  checkIsAccessible(): void {
    cy.isAccessible()
  }
}
