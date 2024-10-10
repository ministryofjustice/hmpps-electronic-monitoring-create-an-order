import AppPage from '../appPage'
import { PageElement } from '../page'

export default class OrderTasksPage extends AppPage {
  constructor() {
    super('Apply for electronic monitoring')
  }

  orderSections = (): PageElement => cy.get('.govuk-task-list')

  orderSectionsItems = (): PageElement => cy.get('govuk-task-list li')

  AboutTheDeviceWearerSectionItem = (): PageElement => this.orderSections().contains('About the device wearer')

  InformationAndRiskSectionItem = (): PageElement => this.orderSections().contains('Information and risk')

  ContactInformationSectionItem = (): PageElement => this.orderSections().contains('About the device wearer')

  AttachementsSectionItem = (): PageElement => this.orderSections().contains('About the device wearer')

  submissionForm = (): PageElement => cy.get('form[action*="submit"]')

  submissionFormButton = (): PageElement => cy.get('form[action*="submit"] button[type=submit]')

  backToSearchButton = (): PageElement => cy.get('a#backToSearch[href="/"]')
}
