import AppPage from '../appPage'
import { PageElement } from '../page'

import paths from '../../../server/constants/paths'

export default class OrderTasksPage extends AppPage {
  constructor() {
    super('Tag request form', paths.ORDER.SUMMARY, 'Form sections')
  }

  orderSections = (): PageElement => cy.get('.govuk-task-list')

  orderSectionsItems = (): PageElement => cy.get('govuk-task-list li')

  AboutTheDeviceWearerSectionItem = (): PageElement => this.orderSections().contains('About the device wearer')

  ContactInformationSectionItem = (): PageElement => this.orderSections().contains('Contact information')

  InformationAndRiskSectionItem = (): PageElement => this.orderSections().contains('Information and risk')

  MonitoringConditionsSectionItem = (): PageElement => this.orderSections().contains('Monitoring conditions')

  AttachmentsSectionItem = (): PageElement => this.orderSections().contains('Attachments')

  get submitOrderButton(): PageElement {
    return cy.contains('button', 'Submit order')
  }

  get backToSearchButton(): PageElement {
    return cy.contains('a', 'Back')
  }
}
