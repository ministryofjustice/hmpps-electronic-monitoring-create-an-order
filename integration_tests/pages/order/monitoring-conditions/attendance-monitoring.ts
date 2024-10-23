import AppPage from '../../appPage'

import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

export default class AttendanceMonitoringPage extends AppPage {
  constructor() {
    super('Monitoring conditions', paths.MONITORING_CONDITIONS.ATTENDANCE, 'Attendance monitoring')
  }

  form = (): PageElement => cy.get('form')

  subHeader = (): PageElement => cy.get('h2')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  fillInForm = (): void => {
    cy.get('#startDate-day').type('27')
    cy.get('#startDate-month').type('3')
    cy.get('#startDate-year').type('2024')
    cy.get('#endDate-day').type('28')
    cy.get('#endDate-month').type('4')
    cy.get('#endDate-year').type('2025')
    cy.get('#purpose').type('The purpose')
    cy.get('#appointmentDay').type('Monday')
    cy.get('#startTime-hours').type('18')
    cy.get('#startTime-minutes').type('15')
    cy.get('#endTime-hours').type('19')
    cy.get('#endTime-minutes').type('30')
    cy.get('#address-line1').type('Address line 1')
    cy.get('#address-line2').type('Address line 2')
    cy.get('#address-line3').type('Address line 3')
    cy.get('#address-line4').type('Address line 4')
    cy.get('#address-postcode').type('Postcode')
  }
}
