import z from 'zod'
import AddressModel from './Address'
import AlcoholMonitoringModel from './AlcoholMonitoring'
import AttachmentModel from './Attachment'
import AttendanceMonitoringModel from './AttendanceMonitoring'
import DeviceWearerContactDetailsModel from './ContactDetails'
import CurfewConditionsModel from './CurfewConditions'
import CurfewReleaseDateModel from './CurfewReleaseDate'
import CurfewTimetableModel from './CurfewTimetable'
import DeviceWearerModel from './DeviceWearer'
import DeviceWearerResponsibleAdultModel from './DeviceWearerResponsibleAdult'
import EnforcementZoneModel from './EnforcementZone'
import InstallationAndRiskModel from './InstallationAndRisk'
import MonitoringConditionsModel from './MonitoringConditions'
import NotifyingOrganisationModel from './NotifyingOrganisation'
import TrailMonitoringModel from './TrailMonitoring'

export const OrderStatusEnum = z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED'])

const OrderModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  deviceWearer: DeviceWearerModel,
  addresses: z.array(AddressModel),
  deviceWearerResponsibleAdult: DeviceWearerResponsibleAdultModel.nullable(),
  deviceWearerContactDetails: DeviceWearerContactDetailsModel,
  enforcementZoneConditions: z.array(EnforcementZoneModel),
  additionalDocuments: z.array(AttachmentModel),
  installationAndRisk: InstallationAndRiskModel.nullable(),
  monitoringConditions: MonitoringConditionsModel,
  monitoringConditionsTrail: TrailMonitoringModel.nullable(),
  monitoringConditionsAttendance: z.array(AttendanceMonitoringModel).optional(),
  monitoringConditionsAlcohol: AlcoholMonitoringModel.nullable().optional(),
  curfewReleaseDateConditions: CurfewReleaseDateModel.nullable().optional(),
  monitoringConditionsCurfewConditions: CurfewConditionsModel.optional(),
  curfewTimeTable: CurfewTimetableModel.optional(),
  notifyingOrganisation: NotifyingOrganisationModel.optional(),
})

export type Order = z.infer<typeof OrderModel>
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export default OrderModel
