import AppPage from '../appPage'
import Page, { PageElement } from '../page'
import paths from '../../../server/constants/paths'
import Task from '../components/task'
import VariationDetailsPage from './variation/variationDetails'
import Timeline from '../components/timeline'

export default class OrderTasksPage extends AppPage {
  constructor(isOldVersionPage: boolean = false) {
    let path: string = paths.ORDER.SUMMARY
    if (isOldVersionPage) {
      path = paths.ORDER.SUMMARY_VERSION
    }
    super('Electronic Monitoring application form', path, '')
  }

  get variationDetailsTask(): Task {
    return new Task('About the changes in this version of the form')
  }

  get interestedPartiesTask(): Task {
    return new Task('About the Responsible Organisation', false)
  }

  get aboutTheDeviceWearerTask(): Task {
    return new Task('About the device wearer')
  }

  get contactInformationTask(): Task {
    return new Task('Contact information')
  }

  get riskInformationTask(): Task {
    return new Task('Risk information')
  }

  get electronicMonitoringTask(): Task {
    return new Task('Electronic monitoring conditions')
  }

  get additionalDocumentsTask(): Task {
    return new Task('Additional documents')
  }

  get submitOrderButton(): PageElement {
    return cy.contains('button', 'Submit form')
  }

  get backToSearchButton(): PageElement {
    return cy.contains('a', 'Back')
  }

  get makeChangesButton(): PageElement {
    return cy.get('#make-changes-button')
  }

  get viewAndDownloadButton(): PageElement {
    return cy.get('#view-and-download-button')
  }

  get viewReasonForReturnButton(): PageElement {
    return cy.contains('a', 'View reason for return')
  }

  get timeline(): Timeline {
    return new Timeline()
  }

  get ownerBanner(): PageElement {
    return cy.get('.moj-alert')
  }

  get assignToMeButton(): PageElement {
    return cy.get('button').contains('Assign form to me')
  }

  makeChanges(): void {
    this.makeChangesButton.click()
  }

  fillInVariationsDetails({ variationDetails }): void {
    this.variationDetailsTask.click()
    const variationDetailsPage = Page.verifyOnPage(VariationDetailsPage)
    variationDetailsPage.form.fillInWith(variationDetails)
    variationDetailsPage.form.saveAndReturnButton.click()
    Page.verifyOnPage(OrderTasksPage)
  }
}
