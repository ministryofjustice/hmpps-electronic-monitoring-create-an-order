import { dataAccess } from '../data'
import AddressService from './addressService'
import AlcoholMonitoringService from './alcoholMonitoringService'
import AttachmentService from './attachmentService'
import AttendanceMonitoringService from './attendanceMonitoringService'
import AuditService from './auditService'
import ContactDetailsService from './contactDetailsService'
import CurfewConditionsService from './curfewConditionsService'
import CurfewReleaseDateService from './curfewReleaseDateService'
import CurfewTimetableService from './curfewTimetableService'
import DeviceWearerResponsibleAdultService from './deviceWearerResponsibleAdultService'
import DeviceWearerService from './deviceWearerService'
import EnforcementZoneService from './enforcementZoneServices'
import InstallationAndRiskService from './installationAndRiskService'
import MonitoringConditionsService from './monitoringConditionsService'
import NotifyingOrganisationService from './notifyingOrganisationService'
import OrderSearchService from './orderSearchService'
import OrderService from './orderService'
import TaskListService from './taskListService'
import TrailMonitoringService from './trailMonitoringService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, cemoApiClient } = dataAccess()

  const alcoholMonitoringService = new AlcoholMonitoringService(cemoApiClient)
  const attachmentService = new AttachmentService(cemoApiClient)
  const attendanceMonitoringService = new AttendanceMonitoringService(cemoApiClient)
  const auditService = new AuditService(hmppsAuditClient)
  const contactDetailsService = new ContactDetailsService(cemoApiClient)
  const curfewConditionsService = new CurfewConditionsService(cemoApiClient)
  const curfewReleaseDateService = new CurfewReleaseDateService(cemoApiClient)
  const curfewTimetableService = new CurfewTimetableService(cemoApiClient)
  const addressService = new AddressService(cemoApiClient)
  const deviceWearerResponsibleAdultService = new DeviceWearerResponsibleAdultService(cemoApiClient)
  const deviceWearerService = new DeviceWearerService(cemoApiClient)
  const installationAndRiskService = new InstallationAndRiskService(cemoApiClient)
  const monitoringConditionsService = new MonitoringConditionsService(cemoApiClient)
  const notifyingOrganisationService = new NotifyingOrganisationService(cemoApiClient)
  const zoneService = new EnforcementZoneService(cemoApiClient)
  const orderSearchService = new OrderSearchService(cemoApiClient)
  const orderService = new OrderService(cemoApiClient)
  const taskListService = new TaskListService()
  const trailMonitoringService = new TrailMonitoringService(cemoApiClient)

  return {
    alcoholMonitoringService,
    applicationInfo,
    attachmentService,
    attendanceMonitoringService,
    auditService,
    contactDetailsService,
    curfewReleaseDateService,
    curfewConditionsService,
    curfewTimetableService,
    addressService,
    deviceWearerResponsibleAdultService,
    deviceWearerService,
    installationAndRiskService,
    monitoringConditionsService,
    notifyingOrganisationService,
    orderSearchService,
    orderService,
    taskListService,
    trailMonitoringService,
    zoneService,
  }
}

export type Services = ReturnType<typeof services>
export {
  AlcoholMonitoringService,
  AttachmentService,
  AuditService,
  ContactDetailsService,
  CurfewConditionsService,
  CurfewReleaseDateService,
  CurfewTimetableService,
  DeviceWearerResponsibleAdultService,
  DeviceWearerService,
  EnforcementZoneService,
  InstallationAndRiskService,
  MonitoringConditionsService,
  OrderSearchService,
  OrderService,
  TrailMonitoringService,
}
