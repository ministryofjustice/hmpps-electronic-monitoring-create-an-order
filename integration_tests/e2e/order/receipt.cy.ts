import { v4 as uuidv4 } from 'uuid'
import Page from '../../pages/page'
import ReceiptPage from '../../pages/order/receipt'

const mockOrderId = uuidv4()

context('Receipt', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

    cy.signIn()
  })

  it('Should display the page', () => {
    cy.visit(`/order/${mockOrderId}/receipt`)
    const page = Page.verifyOnPage(ReceiptPage)
    page.header.userName().should('contain.text', 'J. Smith')
    page.pdfDownloadBanner().should('exist')
  })

  it('Should have a button that opens the print window to download page as PDF', () => {
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        contactDetails: {
          contactNumber: '01234567890',
        },
        deviceWearer: {
          nomisId: 'nomis',
          pncId: 'pnc',
          deliusId: 'delius',
          prisonNumber: 'prison',
          homeOfficeReferenceNumber: 'ho',
          firstName: 'test',
          lastName: 'tester',
          alias: 'tes',
          dateOfBirth: '2000-01-01T00:00:00Z',
          adultAtTimeOfInstallation: true,
          sex: 'FEMALE',
          gender: 'self-identify',
          otherGender: 'Furby',
          disabilities: 'OTHER',
          otherDisability: 'Broken arm',
          noFixedAbode: true,
          interpreterRequired: false,
        },
        addresses: [
          {
            addressType: 'RESPONSIBLE_ORGANISATION',
            addressLine1: 'line1',
            addressLine2: 'line2',
            addressLine3: 'line3',
            addressLine4: 'line4',
            postcode: 'postcode',
          },
        ],
        interestedParties: {
          notifyingOrganisation: 'HOME_OFFICE',
          notifyingOrganisationName: '',
          notifyingOrganisationEmail: 'notifying@organisation',
          responsibleOrganisation: 'POLICE',
          responsibleOrganisationPhoneNumber: '01234567890',
          responsibleOrganisationEmail: 'responsible@organisation',
          responsibleOrganisationRegion: '',
          responsibleOrganisationAddress: {
            addressType: 'RESPONSIBLE_ORGANISATION',
            addressLine1: 'line1',
            addressLine2: 'line2',
            addressLine3: 'line3',
            addressLine4: 'line4',
            postcode: 'postcode',
          },
          responsibleOfficerName: 'name',
          responsibleOfficerPhoneNumber: '01234567891',
        },
        installationAndRisk: {
          offence: 'SEXUAL_OFFENCES',
          riskCategory: ['RISK_TO_GENDER', 'SAFEGUARDING_ISSUE'],
          riskDetails: 'Information about potential risks',
          mappaLevel: 'MAPPA1',
          mappaCaseType: 'TERRORISM_ACT',
        },
      },
    })
    cy.visit(`/order/${mockOrderId}/receipt`)
    const page = Page.verifyOnPage(ReceiptPage)
    page.pdfDownloadButton().should('exist')
    cy.window().then(w => {
      cy.stub(w, 'print').as('print')
    })
    page.pdfDownloadButton().click()
    cy.get('@print').should('be.calledOnce')
  })
})
