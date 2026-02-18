import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'
import ProbationDeliveryUnitPage from '../../../pages/order/contact-information/probation-delivery-unit'

const mockOrderId = uuidv4()
const apiPath = '/interested-parties'
const sampleFormData = {
  notifyingOrganisation: 'Home Office',
  notifyingOrganisationEmailAddress: 'notifying@organisation',
  responsibleOrganisation: 'Police',
  policeArea: 'Cheshire',
  responsibleOrganisationEmailAddress: 'responsible@organisation',
  responsibleOfficerName: 'name',
  responsibleOfficerContactNumber: '01234567891',
}

context('Contact information', () => {
  context('Interested parties', () => {
    context('Submitting valid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'CHESHIRE',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted interested parties submission', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'notifying@organisation',
            responsibleOrganisation: 'POLICE',
            responsibleOrganisationEmail: 'responsible@organisation',
            responsibleOrganisationRegion: 'CHESHIRE',
            responsibleOfficerName: 'name',
            responsibleOfficerPhoneNumber: '01234567891',
          },
        }).should('be.true')
      })

      it('should continue to collect installation and risk details', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(ContactInformationCheckYourAnswersPage, 'Check your answers')
      })

      context('DDv5 feature set to true', () => {
        it('should continue to probation delivery unit page', () => {
          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              notifyingOrganisation: 'HOME_OFFICE',
              notifyingOrganisationName: '',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
          })

          const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: {
              interestedParties: {
                notifyingOrganisation: 'HOME_OFFICE',
                notifyingOrganisationName: '',
                notifyingOrganisationEmail: 'notifying@organisation',
                responsibleOrganisation: 'PROBATION',
                responsibleOrganisationEmail: 'responsible@organisation',
                responsibleOrganisationRegion: 'NORTH_EAST',
                responsibleOfficerName: 'name',
                responsibleOfficerPhoneNumber: '01234567891',
              },
              dataDictionaryVersion: 'DDV5',
            },
          })
          page.form.fillInWith({
            ...sampleFormData,
            responsibleOrganisation: 'Probation',
            probationRegion: 'North East',
          })

          page.form.saveAndContinueButton.click()

          const pduPage = Page.verifyOnPage(
            ProbationDeliveryUnitPage,
            "What is the Responsible Organisation's Probation Delivery Unit (PDU)",
          )
          pduPage.form.unitField.shouldExist()
        })

        it('should submit a correctly formatted interested parties submission for PARC_PRISON_AND_YOUNG_OFFENDER_INSTITUTION prison', () => {
          const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

          const formData = {
            notifyingOrganisation: 'Prison',
            notifyingOrganisationEmailAddress: 'notifying@organisation',
            prison: 'Parc Prison and Young Offender Institute',
            responsibleOrganisation: 'Police',
            policeArea: 'Cheshire',
            responsibleOrganisationEmailAddress: 'responsible@organisation',
            responsibleOfficerName: 'name',
            responsibleOfficerContactNumber: '01234567891',
          }

          page.form.fillInWith(formData)
          page.form.saveAndContinueButton.click()

          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOrderId}${apiPath}`,
            body: {
              notifyingOrganisation: 'PRISON',
              notifyingOrganisationName: 'PARC_PRISON_AND_YOUNG_OFFENDER_INSTITUTION',
              notifyingOrganisationEmail: 'notifying@organisation',
              responsibleOrganisation: 'POLICE',
              responsibleOrganisationEmail: 'responsible@organisation',
              responsibleOrganisationRegion: 'CHESHIRE',
              responsibleOfficerName: 'name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
          }).should('be.true')
        })

        it('should hide region input for Probation Service and submit empty string to API', () => {
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: {
              dataDictionaryVersion: 'DDV5',
              interestedParties: {
                notifyingOrganisation: null,
                notifyingOrganisationName: '',
                notifyingOrganisationEmail: '',
                responsibleOfficerName: '',
                responsibleOfficerPhoneNumber: '',
                responsibleOrganisation: 'PROBATION',
                responsibleOrganisationRegion: '',
                responsibleOrganisationEmail: '',
              },
            },
          })

          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              notifyingOrganisation: 'PROBATION',
              notifyingOrganisationName: '',
              notifyingOrganisationEmail: 'notifying@example.com',
              responsibleOrganisation: 'POLICE',
              responsibleOrganisationEmail: 'responsible@example.com',
              responsibleOrganisationRegion: 'CHESHIRE',
              responsibleOfficerName: 'Officer Name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
          })

          const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

          page.form.notifyingOrganisationFieldDDV5.set('Probation')

          const formData = {
            notifyingOrganisationEmailAddress: 'notifying@example.com',
            responsibleOrganisation: 'Police',
            policeArea: 'Cheshire',
            responsibleOrganisationEmailAddress: 'responsible@example.com',
            responsibleOfficerName: 'Officer Name',
            responsibleOfficerContactNumber: '01234567891',
          }
          page.form.fillInWith(formData)

          cy.get('#notifyingOrgProbationRegion').should('not.exist')

          page.form.saveAndContinueButton.click()

          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOrderId}${apiPath}`,
            body: {
              notifyingOrganisation: 'PROBATION',
              notifyingOrganisationName: '',
              notifyingOrganisationEmail: 'notifying@example.com',
              responsibleOrganisation: 'POLICE',
              responsibleOrganisationEmail: 'responsible@example.com',
              responsibleOrganisationRegion: 'CHESHIRE',
              responsibleOfficerName: 'Officer Name',
              responsibleOfficerPhoneNumber: '01234567891',
            },
          }).should('be.true')
        })

        it('should show region input for YCS and submit to API', () => {
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: {
              dataDictionaryVersion: 'DDV5',
              interestedParties: {
                notifyingOrganisation: null,
                notifyingOrganisationName: '',
                notifyingOrganisationEmail: '',
                responsibleOfficerName: '',
                responsibleOfficerPhoneNumber: '',
                responsibleOrganisation: 'PROBATION',
                responsibleOrganisationRegion: '',
                responsibleOrganisationEmail: '',
              },
            },
          })

          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
              notifyingOrganisationName: 'MIDLANDS',
              notifyingOrganisationEmail: 'ycs@example.com',
              responsibleOrganisation: 'POLICE',
              responsibleOrganisationEmail: 'responsible@example.com',
              responsibleOrganisationRegion: 'CHESHIRE',
              responsibleOfficerName: 'YCS Officer',
              responsibleOfficerPhoneNumber: '01234567891',
            },
          })

          const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

          page.form.notifyingOrganisationFieldDDV5.set('Youth Custody Service (YCS)')

          const formData = {
            notifyingOrganisationEmailAddress: 'ycs@example.com',
            responsibleOrganisation: 'Police',
            policeArea: 'Cheshire',
            responsibleOrganisationEmailAddress: 'responsible@example.com',
            responsibleOfficerName: 'YCS Officer',
            responsibleOfficerContactNumber: '01234567891',
            youthCustodyServiceRegion: 'MIDLANDS',
          }
          page.form.fillInWith(formData)

          cy.get('#youthCustodyServiceRegion').should('exist')

          page.form.saveAndContinueButton.click()

          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOrderId}${apiPath}`,
            body: {
              notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
              notifyingOrganisationName: 'MIDLANDS',
              notifyingOrganisationEmail: 'ycs@example.com',
              responsibleOrganisation: 'POLICE',
              responsibleOrganisationEmail: 'responsible@example.com',
              responsibleOrganisationRegion: 'CHESHIRE',
              responsibleOfficerName: 'YCS Officer',
              responsibleOfficerPhoneNumber: '01234567891',
            },
          }).should('be.true')
        })
      })

      context('DDv6 feature set to true', () => {
        it('should show region input for Police and submit to API', () => {
          cy.task('stubCemoGetOrder', {
            httpStatus: 200,
            id: mockOrderId,
            status: 'IN_PROGRESS',
            order: {
              dataDictionaryVersion: 'DDV6',
              interestedParties: {
                notifyingOrganisation: null,
                notifyingOrganisationName: '',
                notifyingOrganisationEmail: '',
                responsibleOfficerName: '',
                responsibleOfficerPhoneNumber: '',
                responsibleOrganisation: 'POLICE',
                responsibleOrganisationRegion: '',
                responsibleOrganisationEmail: '',
              },
            },
          })

          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            id: mockOrderId,
            subPath: apiPath,
            response: {
              notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
              notifyingOrganisationName: 'MIDLANDS',
              notifyingOrganisationEmail: 'ycs@example.com',
              responsibleOrganisation: 'POLICE',
              responsibleOrganisationEmail: 'responsible@example.com',
              responsibleOrganisationRegion: 'NATIONAL_CRIME_AGENCY',
              responsibleOfficerName: 'Police officer',
              responsibleOfficerPhoneNumber: '02081234567',
            },
          })

          const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

          page.form.notifyingOrganisationFieldDDV5.set('Youth Custody Service (YCS)')

          const formData = {
            notifyingOrganisationEmailAddress: 'ycs@example.com',
            responsibleOrganisation: 'Police',
            responsibleOrganisationEmailAddress: 'responsible@example.com',
            responsibleOfficerName: 'Police officer',
            responsibleOfficerContactNumber: '02081234567',
            youthCustodyServiceRegion: 'MIDLANDS',
            policeArea: 'NATIONAL_CRIME_AGENCY',
          }
          page.form.fillInWith(formData)

          cy.get('#policeArea').should('exist')

          page.form.saveAndContinueButton.click()

          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOrderId}${apiPath}`,
            body: {
              notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
              notifyingOrganisationName: 'MIDLANDS',
              notifyingOrganisationEmail: 'ycs@example.com',
              responsibleOrganisation: 'POLICE',
              responsibleOrganisationEmail: 'responsible@example.com',
              responsibleOrganisationRegion: 'NATIONAL_CRIME_AGENCY',
              responsibleOfficerName: 'Police officer',
              responsibleOfficerPhoneNumber: '02081234567',
            },
          }).should('be.true')
        })
      })

      it('should return to the summary page', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAsDraftButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })

      it('should include screen reader accessibility hints for radio buttons with secondary inputs', () => {
        Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        const ids = [
          '#notifyingOrganisation-item-hint',
          '#notifyingOrganisation-4-item-hint',
          '#notifyingOrganisation-6-item-hint',
        ]

        ids.forEach(id => {
          cy.get(id).find('span').should('have.class', 'govuk-visually-hidden')
          cy.get(id).find('span').contains('Selecting this will reveal an additional input')
        })
      })
    })
  })
})
