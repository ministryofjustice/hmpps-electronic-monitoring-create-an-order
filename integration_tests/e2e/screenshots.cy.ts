import { v4 as uuidv4 } from 'uuid'

import paths from '../../server/constants/paths'

const mockOrderId = uuidv4()

context('Screenshots', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoListOrders')
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
  })

  it.skip('For UAT', () => {
    cy.signIn()

    cy.visit('/')
    cy.screenshot('IndexPage', { overwrite: true })

    cy.visit(paths.ORDER.SUMMARY.replace(':orderId', mockOrderId))
    cy.screenshot('OrderSummaryPage', { overwrite: true })

    // about

    cy.visit(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', mockOrderId))
    cy.screenshot('AboutDeviceWearerPage', { overwrite: true })

    cy.visit(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', mockOrderId))
    cy.screenshot('ResponsibleAdultPage', { overwrite: true })

    // contact information

    cy.visit(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', mockOrderId))
    cy.screenshot('ContactDetailsPage', { overwrite: true })

    cy.visit(paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', mockOrderId))
    cy.screenshot('NoFixedAbodePage', { overwrite: true })

    cy.visit(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', mockOrderId))
    cy.screenshot('InterestedPartiesPage', { overwrite: true })

    cy.visit(
      paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', mockOrderId).replace(
        ':addressType(primary|secondary|tertiary)',
        'primary',
      ),
    )
    cy.screenshot('PrimaryAddressPage', { overwrite: true })

    cy.visit(
      paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', mockOrderId).replace(
        ':addressType(primary|secondary|tertiary)',
        'secondary',
      ),
    )
    cy.screenshot('SecondaryAddressPage', { overwrite: true })

    cy.visit(
      paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', mockOrderId).replace(
        ':addressType(primary|secondary|tertiary)',
        'tertiary',
      ),
    )
    cy.screenshot('TertiaryAddressPage', { overwrite: true })

    // monitoring conditions

    cy.visit(paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', mockOrderId))
    cy.screenshot('MonitoringConditionsPage', { overwrite: true })

    cy.visit(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', mockOrderId))
    cy.screenshot('AlcoholPage', { overwrite: true })

    cy.visit(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', mockOrderId))
    cy.screenshot('AttendancePage', { overwrite: true })

    // cy.visit(paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(':orderId', mockOrderId).replace(':conditionId', '0'))
    // cy.screenshot('AttendanceItemPage', { overwrite: true })

    cy.visit(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', mockOrderId))
    cy.screenshot('CurfewConditionsPage', { overwrite: true })

    cy.visit(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', mockOrderId))
    cy.screenshot('CurfewReleaseDatePage', { overwrite: true })

    cy.visit(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', mockOrderId))
    cy.screenshot('CurfewTimetablePage', { overwrite: true })

    cy.visit(paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', mockOrderId))
    cy.screenshot('TrailPage', { overwrite: true })

    cy.visit(paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', mockOrderId))
    cy.screenshot('ZonePage', { overwrite: true })

    cy.visit(
      paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', mockOrderId).replace(
        ':addressType(installation)',
        'installation',
      ),
    )
    cy.screenshot('InstallationAddressPage', { overwrite: true })

    // submit

    cy.visit(paths.ORDER.SUBMIT_SUCCESS.replace(':orderId', mockOrderId))
    cy.screenshot('SubmitSuccessPage', { overwrite: true })

    cy.visit(paths.ORDER.SUBMIT_FAILED.replace(':orderId', mockOrderId))
    cy.screenshot('SubmitSuccessFail', { overwrite: true })
  })
})
