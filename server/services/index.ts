import { dataAccess } from '../data'
import AlcoholMonitoringService from './alcoholMonitoringService'
import AttachmentService from './attachmentService'
import AttendanceMonitoringService from './attendanceMonitoringService'
import AuditService from './auditService'
import ContactDetailsService from './contactDetailsService'
import CurfewDayOfReleaseService from './curfewDayOfReleaseService'
import DeviceWearerService from './deviceWearerService'
import InstallationAndRiskService from './installationAndRiskService'
import MonitoringConditionsService from './monitoringConditionsService'
import OrderSearchService from './orderSearchService'
import OrderService from './orderService'
import TrailMonitoringService from './trailMonitoringService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, cemoApiClient } = dataAccess()

  const alcoholMonitoringService = new AlcoholMonitoringService(cemoApiClient)
  const attachmentService = new AttachmentService(cemoApiClient)
  const attendanceMonitoringService = new AttendanceMonitoringService(cemoApiClient)
  const auditService = new AuditService(hmppsAuditClient)
  const contactDetailsService = new ContactDetailsService(cemoApiClient)
  const curfewDayOfReleaseService = new CurfewDayOfReleaseService(cemoApiClient)
  const deviceWearerService = new DeviceWearerService(cemoApiClient)
  const installationAndRiskService = new InstallationAndRiskService(cemoApiClient)
  const monitoringConditionsService = new MonitoringConditionsService(cemoApiClient)
  const orderSearchService = new OrderSearchService(cemoApiClient)
  const orderService = new OrderService(cemoApiClient)
  const trailMonitoringService = new TrailMonitoringService(cemoApiClient)

  return {
    alcoholMonitoringService,
    applicationInfo,
    attachmentService,
    attendanceMonitoringService,
    auditService,
    contactDetailsService,
    curfewDayOfReleaseService,
    deviceWearerService,
    installationAndRiskService,
    monitoringConditionsService,
    orderSearchService,
    orderService,
    trailMonitoringService,
  }
}

export type Services = ReturnType<typeof services>
export {
  AlcoholMonitoringService,
  AttachmentService,
  AuditService,
  ContactDetailsService,
  CurfewDayOfReleaseService,
  DeviceWearerService,
  InstallationAndRiskService,
  MonitoringConditionsService,
  OrderSearchService,
  OrderService,
  TrailMonitoringService,
}
