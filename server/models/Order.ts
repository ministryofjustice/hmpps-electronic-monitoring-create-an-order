import z from 'zod'
import AddressModel from './Address'
import AlcoholMonitoringModel from './AlcoholMonitoring'
import AttachmentModel from './Attachment'
import AttendanceMonitoringModel from './AttendanceMonitoring'
import DeviceWearerContactDetailsModel from './ContactDetails'
import CurfewReleaseDateModel from './CurfewReleaseDate'
import DeviceWearerModel from './DeviceWearer'
import DeviceWearerResponsibleAdultModel from './DeviceWearerResponsibleAdult'
import EnforcementZoneModel from './EnforcementZone'
import MonitoringConditionsModel from './MonitoringConditions'
import TrailMonitoringModel from './TrailMonitoring'

export const OrderStatusEnum = z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED'])

const OrderModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  deviceWearer: DeviceWearerModel,
  deviceWearerAddresses: z.array(AddressModel),
  deviceWearerResponsibleAdult: DeviceWearerResponsibleAdultModel.nullable(),
  deviceWearerContactDetails: DeviceWearerContactDetailsModel,
  enforcementZoneConditions: z.array(EnforcementZoneModel),
  additionalDocuments: z.array(AttachmentModel),
  monitoringConditions: MonitoringConditionsModel,
  monitoringConditionsTrail: TrailMonitoringModel.nullable(),
  monitoringConditionsAttendance: z.array(AttendanceMonitoringModel).optional(),
  monitoringConditionsAlcohol: AlcoholMonitoringModel.optional(),
  monitoringConditionsCurfewReleaseDate: CurfewReleaseDateModel.optional(),
})

export type Order = z.infer<typeof OrderModel>
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export default OrderModel
