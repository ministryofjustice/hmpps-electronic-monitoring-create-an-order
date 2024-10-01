import { dataAccess } from '../data'
import AuditService from './auditService'
import OrderSearchService from './orderSearchService'
import OrderService from './orderService'
import DeviceWearerService from './deviceWearerService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, cemoApiClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const orderService = new OrderService(cemoApiClient)
  const orderSearchService = new OrderSearchService(cemoApiClient)
  const deviceWearerService = new DeviceWearerService(cemoApiClient)

  return {
    applicationInfo,
    auditService,
    deviceWearerService,
    orderService,
    orderSearchService,
  }
}

export type Services = ReturnType<typeof services>

export { AuditService, DeviceWearerService, OrderService, OrderSearchService }
