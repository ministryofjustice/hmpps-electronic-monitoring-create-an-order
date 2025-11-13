import { createAddressPreview } from '../../../server/utils/utils'
import AttendanceMonitoringPage from '../../pages/order/monitoring-conditions/attendance-monitoring'
import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
import Page from '../../pages/page'

export default function fillInAttendanceMonitoringDetailsWith(attendanceMonitoringDetails): void {
  const attendanceMonitoringPage = Page.verifyOnPage(AttendanceMonitoringPage)
  attendanceMonitoringPage.form.fillInWith(attendanceMonitoringDetails)
  attendanceMonitoringPage.form.saveAndContinueButton.click()
}

export function verifyAttendanceMonitoringInCheckYourAnswersPage(attendanceMonitoringDetails = undefined): void {
  const page = Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answer')

  if (attendanceMonitoringDetails) {
    page.attendenceMonitoringSections().shouldExist()
    page.attendenceMonitoringSections().shouldHaveItems([
      {
        key: 'What date does mandatory attendance monitoring start?',
        value: attendanceMonitoringDetails.startDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'What date does mandatory attendance monitoring end?',
        value: attendanceMonitoringDetails.endDate.toLocaleDateString('en-GB'),
      },
      {
        key: 'What is the appointment for?',
        value: attendanceMonitoringDetails.purpose,
      },
      {
        key: 'On what day is the appointment and how frequently does the appointment take place?',
        value: attendanceMonitoringDetails.appointmentDay,
      },
      {
        key: 'What time does the appointment start?',
        value: `${attendanceMonitoringDetails.startTime.hours}:${attendanceMonitoringDetails.startTime.minutes}`,
      },
      {
        key: 'What time does the appointment end?',
        value: `${attendanceMonitoringDetails.endTime.hours}:${attendanceMonitoringDetails.endTime.minutes}`,
      },
      {
        key: 'At what address will the appointment take place?',
        value: createAddressPreview(attendanceMonitoringDetails.address),
      },
    ])
  } else {
    page.attendenceMonitoringSections().shouldNotExist()
  }
}
