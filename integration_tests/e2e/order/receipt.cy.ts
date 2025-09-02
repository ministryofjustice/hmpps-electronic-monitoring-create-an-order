import { v4 as uuidv4 } from 'uuid'
import Page from '../../pages/page'
import ReceiptPage from '../../pages/order/receipt'
import AttachmentType from '../../../server/models/AttachmentType'

const mockOrderId = uuidv4()
const mockOrder = {
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    homeOfficeReferenceNumber: null,
    firstName: 'test',
    lastName: 'tester',
    alias: 'tes',
    dateOfBirth: '2000-01-01T00:00:00Z',
    adultAtTimeOfInstallation: true,
    sex: 'FEMALE',
    gender: 'PREFER_TO_SELF_DESCRIBE',
    disabilities: 'OTHER',
    otherDisability: 'Broken arm',
    noFixedAbode: true,
    interpreterRequired: false,
  },
}
context('Receipt', () => {
  context('Receipt when app is submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockOrder,
      })

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

      page.pdfDownloadButton().click()
      const date = new Date().toISOString().slice(0, 10)
      const filename = `${mockOrder.deviceWearer.firstName}-${mockOrder.deviceWearer.lastName}-${date}`
      cy.readFile(`cypress/downloads/${filename}.pdf`).should('exist')
    })

    it('Should should show all sections', () => {
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
            gender: 'Prefer to self-describe',
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
            offenceAdditionalDetails: 'Information about offence',
            riskCategory: ['RISK_TO_GENDER'],
            riskDetails: 'Information about potential risks',
            mappaLevel: 'MAPPA 1',
            mappaCaseType: 'TACT (Terrorism Act, Counter Terrorism)',
          },
          additionalDocuments: [
            {
              id: mockOrderId,
              fileType: AttachmentType.LICENCE,
              fileName: 'Mock Licence',
            },
          ],
          orderParameters: {
            havePhoto: false,
          },
          submittedBy: 'test name',
          fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0),
        },
      })
      cy.visit(`/order/${mockOrderId}/receipt`)
      const page = Page.verifyOnPage(ReceiptPage)
      page.additionalDocumentsSection.shouldExist()
      page.additionalDocumentsSection.shouldHaveItems([
        { key: 'Upload a copy of the licence or court order document', value: 'Mock Licence' },
        { key: 'Do you have a photo to upload?', value: 'No' },
      ])
      page.orderStatusSection.shouldExist()
      page.orderStatusSection.shouldHaveItems([
        { key: 'Status', value: 'IN_PROGRESS' },
        { key: 'Type', value: 'REQUEST' },
        { key: 'Reference number', value: mockOrderId },
        { key: 'Date submitted', value: '01/01/2025, 10:30' },
        { key: 'Submitted by', value: 'test name' },
      ])
      page.riskInformationSection.shouldExist()
      page.riskInformationSection.shouldHaveItems([
        { key: 'What type of offence did the device wearer commit? (optional)', value: 'Sexual offences' },
        {
          key: "At installation what are the possible risks from the device wearer's behaviour?",
          value: 'Offensive towards someone because of their sex or gender',
        },
        { key: 'Any other risks to be aware of? (optional)', value: 'Information about potential risks' },
        { key: 'Which level of MAPPA applies? (optional)', value: 'MAPPA 1' },
        { key: 'What is the MAPPA case type? (optional)', value: 'Terrorism Act, Counter Terrorism' },
      ])
      page.deviceWearerSection.shouldExist()
      page.contactInformationSection.shouldExist()
      page.monitoringConditionsSection.shouldExist()
    })

    it('should show all sections for variation', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        type: 'VARIATION',
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
            gender: 'Prefer to self-describe',
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
            offenceAdditionalDetails: 'Information about offence',
            riskCategory: ['RISK_TO_GENDER'],
            riskDetails: 'Information about potential risks',
            mappaLevel: 'MAPPA 1',
            mappaCaseType: 'TACT (Terrorism Act, Counter Terrorism)',
          },
          additionalDocuments: [
            {
              id: mockOrderId,
              fileType: AttachmentType.LICENCE,
              fileName: 'Mock Licence',
            },
          ],
          orderParameters: {
            havePhoto: false,
          },
          variationDetails: {
            variationDate: new Date(2025, 0, 1, 10, 30, 0, 0),
            variationDetails: 'some variation details',
            variationType: 'OTHER',
          },
          submittedBy: 'test name',
          fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0),
        },
      })
      cy.visit(`/order/${mockOrderId}/receipt`)
      const page = Page.verifyOnPage(ReceiptPage)
      page.variationDetailsSection.shouldExist()
      page.variationDetailsSection.shouldHaveItems([
        { key: 'What is the date you want the changes to take effect?', value: '01/01/2025' },
        { key: 'Enter information on what you have changed', value: 'some variation details' },
      ])
    })

    it('should have no change links', () => {
      cy.visit(`/order/${mockOrderId}/receipt`)
      cy.contains('.govuk-link', 'Change').should('not.exist')
    })
  })
})
