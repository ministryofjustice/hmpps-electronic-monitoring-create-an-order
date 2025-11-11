import AttendanceMonitoringPage from "../../pages/order/monitoring-conditions/attendance-monitoring"
import Page from "../../pages/page"


export default function fillInAttendanceMonitoringDetailsWith({ attendanceMonitoringDetails }): void {
    const attendanceMonitoringPage = Page.verifyOnPage(AttendanceMonitoringPage)
    attendanceMonitoringPage.form.fillInWith(attendanceMonitoringDetails)
    attendanceMonitoringPage.form.saveAndContinueButton.click()   
  }