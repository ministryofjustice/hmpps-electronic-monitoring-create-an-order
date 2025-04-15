import { v4 as uuidv4 } from 'uuid'
import Page from '../../pages/page'
import ReceiptPage from '../../pages/order/receipt'
import AttachmentType from '../../../server/models/AttachmentType'

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
    cy.visit(`/order/${mockOrderId}/receipt`)
    const page = Page.verifyOnPage(ReceiptPage)
    page.pdfDownloadButton().should('exist')
    cy.window().then(w => {
      cy.stub(w, 'print').as('print')
    })
    page.pdfDownloadButton().click()
    cy.get('@print').should('be.calledOnce')
  })

  it('Should should show status section', () => {
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
          riskCategory: ['RISK_TO_GENDER'],
          riskDetails: 'Information about potential risks',
          mappaLevel: 'MAPPA1',
          mappaCaseType: 'TERRORISM_ACT',
        },
        additionalDocuments: [
          {
            id: mockOrderId,
            fileType: AttachmentType.LICENCE,
            fileName: 'Mock Licence',
          },
        ],
      },
    })
    cy.visit(`/order/${mockOrderId}/receipt`)
    const page = Page.verifyOnPage(ReceiptPage)
    page.additionalDocumentsSection.shouldExist()
    page.additionalDocumentsSection.shouldHaveItems([
      { key: 'Licence', value: 'Mock Licence' },
      { key: 'Photo identification (optional)', value: 'No photo ID document uploaded' },
    ])
    page.orderStatusSection.shouldExist()
    page.orderStatusSection.shouldHaveItems([
      { key: 'Status', value: 'IN_PROGRESS' },
      { key: 'Type', value: 'REQUEST' },
      { key: 'Reference number', value: mockOrderId },
    ])
    page.riskInformationSection.shouldExist()
    page.riskInformationSection.shouldHaveItems([
      { key: 'What type of offence did the device wearer commit? (optional)', value: 'SEXUAL_OFFENCES' },
      { key: 'At installation what are the possible risks? (optional)', value: 'RISK_TO_GENDER' },
      { key: 'Any other risks to be aware of? (optional)', value: 'Information about potential risks' },
      { key: 'Which level of MAPPA applies? (optional)', value: 'MAPPA1' },
      { key: 'What is the MAPPA case type? (optional)', value: 'TERRORISM_ACT' },
    ])
    page.deviceWearerSection.shouldExist()
    page.contactInformationSection.shouldExist()
    page.monitoringConditionsSection.shouldExist()
  })
})
