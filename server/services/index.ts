import { dataAccess } from '../data'
import AttachmentService from './attachmentService'
import AuditService from './auditService'
import ContactDetailsService from './contactDetailsService'
import DeviceWearerService from './deviceWearerService'
import InstallationAndRiskService from './installationAndRiskService'
import MonitoringConditionsService from './monitoringConditionsService'
import OrderSearchService from './orderSearchService'
import OrderService from './orderService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, cemoApiClient } = dataAccess()

  const attachmentService = new AttachmentService(cemoApiClient)
  const auditService = new AuditService(hmppsAuditClient)
  const orderService = new OrderService(cemoApiClient)
  const orderSearchService = new OrderSearchService(cemoApiClient)
  const contactDetailsService = new ContactDetailsService(cemoApiClient)
  const deviceWearerService = new DeviceWearerService(cemoApiClient)
  const installationAndRiskService = new InstallationAndRiskService(cemoApiClient)
  const monitoringConditionsService = new MonitoringConditionsService(cemoApiClient)

  return {
    applicationInfo,
    auditService,
    contactDetailsService,
    deviceWearerService,
    orderService,
    orderSearchService,
    attachmentService,
    installationAndRiskService,
    monitoringConditionsService,
  }
}

export type Services = ReturnType<typeof services>
export {
  AttachmentService,
  AuditService,
  ContactDetailsService,
  DeviceWearerService,
  InstallationAndRiskService,
  MonitoringConditionsService,
  OrderService,
  OrderSearchService,
}
