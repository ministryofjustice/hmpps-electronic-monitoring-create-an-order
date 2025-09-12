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
import InterestedPartiesService from './interestedPartiesService'
import OrderSearchService from './orderSearchService'
import OrderService from './orderService'
import TaskListService from './taskListService'
import TrailMonitoringService from './trailMonitoringService'
import VariationService from './variationService'
import ProbationDeliveryUnitService from './probationDeliveryUnitService'
import CurfewAdditionalDetailsService from './curfewAdditionalDetailsService'
import InstallationLocationService from './installationLocationService'
import InstallationAppointmentService from './installationAppointmentService'
import OrderChecklistService from './orderChecklistService'
import { createRedisClient } from '../data/redisClient'
import RedisOrderChecklistStore from '../data/orderChecklistStore/redisOrderChecklistStore'
import config from '../config'
import InMemoryOrderChecklistStore from '../data/orderChecklistStore/inMemoryOrderChecklistStore'
import IsRejectionService from '../routes/is-rejection/service'

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
  const interestedPartiesService = new InterestedPartiesService(cemoApiClient)
  const zoneService = new EnforcementZoneService(cemoApiClient)
  const orderSearchService = new OrderSearchService(cemoApiClient)
  const orderService = new OrderService(cemoApiClient)
  const orderChecklistService = new OrderChecklistService(
    config.redis.enabled ? new RedisOrderChecklistStore(createRedisClient()) : new InMemoryOrderChecklistStore(),
  )
  const taskListService = new TaskListService(orderChecklistService)
  const trailMonitoringService = new TrailMonitoringService(cemoApiClient)
  const variationService = new VariationService(cemoApiClient)
  const probationDeliveryUnitService = new ProbationDeliveryUnitService(cemoApiClient)
  const curfewAdditionalDetailsService = new CurfewAdditionalDetailsService(cemoApiClient)
  const installationLocationService = new InstallationLocationService(cemoApiClient)
  const installationAppointmentService = new InstallationAppointmentService(cemoApiClient)
  const isRejectionService = new IsRejectionService(cemoApiClient)
  return {
    alcoholMonitoringService,
    applicationInfo,
    attachmentService,
    attendanceMonitoringService,
    auditService,
    contactDetailsService,
    curfewReleaseDateService,
    curfewConditionsService,
    curfewAdditionalDetailsService,
    curfewTimetableService,
    addressService,
    deviceWearerResponsibleAdultService,
    deviceWearerService,
    installationAndRiskService,
    monitoringConditionsService,
    interestedPartiesService,
    orderSearchService,
    orderService,
    taskListService,
    trailMonitoringService,
    variationService,
    zoneService,
    probationDeliveryUnitService,
    installationLocationService,
    installationAppointmentService,
    orderChecklistService,
    isRejectionService,
  }
}

export type Services = ReturnType<typeof services>
export {
  AlcoholMonitoringService,
  AttachmentService,
  AuditService,
  ContactDetailsService,
  CurfewConditionsService,
  CurfewAdditionalDetailsService,
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
  ProbationDeliveryUnitService,
  InstallationLocationService,
  OrderChecklistService,
  IsRejectionService,
}
