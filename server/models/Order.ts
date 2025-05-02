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
import TrailMonitoringModel from './TrailMonitoring'
import InterestedPartiesModel from './InterestedParties'
import VariationDetailsModel from './VariationDetails'

export const OrderStatusEnum = z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED'])
export const OrderTypeEnum = z.enum(['REQUEST', 'VARIATION'])

const OrderModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  type: OrderTypeEnum,
  deviceWearer: DeviceWearerModel,
  addresses: z.array(AddressModel),
  deviceWearerResponsibleAdult: DeviceWearerResponsibleAdultModel.nullable(),
  contactDetails: DeviceWearerContactDetailsModel,
  enforcementZoneConditions: z.array(EnforcementZoneModel),
  additionalDocuments: z.array(AttachmentModel),
  installationAndRisk: InstallationAndRiskModel.nullable(),
  monitoringConditions: MonitoringConditionsModel,
  monitoringConditionsTrail: TrailMonitoringModel.nullable(),
  mandatoryAttendanceConditions: z.array(AttendanceMonitoringModel),
  monitoringConditionsAlcohol: AlcoholMonitoringModel.nullable().optional(),
  curfewReleaseDateConditions: CurfewReleaseDateModel.nullable().optional(),
  curfewConditions: CurfewConditionsModel.nullable().optional(),
  curfewTimeTable: CurfewTimetableModel.optional(),
  interestedParties: InterestedPartiesModel.nullable(),
  variationDetails: VariationDetailsModel.nullable(),
  isValid: z.boolean().optional().default(false),
  fmsResultDate: z.string().datetime().optional().nullable(),
})

export type Order = z.infer<typeof OrderModel>
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export default OrderModel
