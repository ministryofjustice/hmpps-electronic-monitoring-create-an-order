import { dataAccess } from '../data'
import AuditService from './auditService'
import OrderSearchService from './orderSearchService'
import OrderService from './orderService'
import DeviceWearerService from './deviceWearerService'
import AttachmentService from './attachmentService'
import ContactDetailsService from './contactDetailsService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, cemoApiClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const orderService = new OrderService(cemoApiClient)
  const orderSearchService = new OrderSearchService(cemoApiClient)
  const attachmentService = new AttachmentService(cemoApiClient)
  const deviceWearerService = new DeviceWearerService(cemoApiClient)
  const contactDetailsService = new ContactDetailsService(cemoApiClient)

  return {
    applicationInfo,
    auditService,
    contactDetailsService,
    deviceWearerService,
    orderService,
    orderSearchService,
    attachmentService,
  }
}

export type Services = ReturnType<typeof services>

export { AuditService, ContactDetailsService, DeviceWearerService, OrderService, OrderSearchService, AttachmentService }
