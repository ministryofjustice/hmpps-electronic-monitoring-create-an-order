import Page, { PageElement } from '../page'

export default class DeviceWearerPage extends Page {
  constructor() {
    super('About the device wearer')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  form = (): PageElement => cy.get('form[action*="about-the-device-wearer"]')

  saveAndContinueButton = (): PageElement =>
    cy.get('form[action*="about-the-device-wearer"] button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement =>
    cy.get('form[action*="about-the-device-wearer"] button[type=submit][value="back"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')
}
