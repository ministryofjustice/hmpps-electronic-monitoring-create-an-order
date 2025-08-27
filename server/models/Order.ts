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
import ProbationDeliveryUnitModel from './ProbationDeliveryUnit'
import VariationDetailsModel from './VariationDetails'
import InstallationLocationModel from './InstallationLocation'
import InstallationAppointmentModel from './InstallationAppointment'
import OrderParametersModel from './OrderParametersModel'

export const OrderStatusEnum = z.enum(['IN_PROGRESS', 'ERROR', 'SUBMITTED'])
export const OrderTypeEnum = z.enum(['REQUEST', 'VARIATION'])
export const DataDictionaryVersionEnum = z.enum(['DDV4', 'DDV5'])
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
  probationDeliveryUnit: ProbationDeliveryUnitModel.nullable().optional(),
  variationDetails: VariationDetailsModel.nullable(),
  isValid: z.boolean().optional().default(false),
  fmsResultDate: z.string().datetime().optional().nullable(),
  installationLocation: InstallationLocationModel.nullable().optional(),
  installationAppointment: InstallationAppointmentModel.nullable().optional(),
  dataDictionaryVersion: DataDictionaryVersionEnum,
  orderParameters: OrderParametersModel.nullable().optional(),
  submittedBy: z.string().nullable().optional(),
  versionId: z.string().uuid(),
})

export type Order = z.infer<typeof OrderModel>
export type OrderStatus = z.infer<typeof OrderStatusEnum>
export type DataDictionaryVersion = z.infer<typeof DataDictionaryVersionEnum>
export default OrderModel
