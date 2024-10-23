import AppPage from '../appPage'
import { PageElement } from '../page'

import paths from '../../../server/constants/paths'

export default class OrderTasksPage extends AppPage {
  constructor() {
    super('Apply for electronic monitoring', paths.ORDER.SUMMARY)
  }

  orderSections = (): PageElement => cy.get('.govuk-task-list')

  orderSectionsItems = (): PageElement => cy.get('govuk-task-list li')

  AboutTheDeviceWearerSectionItem = (): PageElement => this.orderSections().contains('About the device wearer')

  ContactInformationSectionItem = (): PageElement => this.orderSections().contains('Contact information')

  InformationAndRiskSectionItem = (): PageElement => this.orderSections().contains('Information and risk')

  MonitoringConditionsSectionItem = (): PageElement => this.orderSections().contains('Monitoring conditions')

  AttachmentsSectionItem = (): PageElement => this.orderSections().contains('Attachments')

  submissionForm = (): PageElement => cy.get('form[action*="submit"]')

  submissionFormButton = (): PageElement => cy.get('form[action*="submit"] button[type=submit]')

  backToSearchButton = (): PageElement => cy.get('a#backToSearch[href="/"]')
}
