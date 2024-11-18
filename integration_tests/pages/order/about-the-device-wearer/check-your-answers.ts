import AppPage from '../../appPage'
import paths from '../../../../server/constants/paths'
import { PageElement } from '../../page'

export default class DeviceWearerCheckYourAnswersPage extends AppPage {
  constructor() {
    super('Check your answers', paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS)
  }

  phaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  continueButton = (): PageElement => cy.contains('Continue')

  returnButton = (): PageElement => cy.contains('Return back to form section menu')

  responsibleAdultSection = (): PageElement => cy.contains('Responsible adult')
}
