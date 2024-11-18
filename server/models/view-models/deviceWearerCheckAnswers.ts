import paths from '../../constants/paths'
import { convertBooleanToEnum, deserialiseDate } from '../../utils/utils'
import { DeviceWearer } from '../DeviceWearer'
import { DeviceWearerResponsibleAdult } from '../DeviceWearerResponsibleAdult'

type DeviceWearerCheckAnswersViewModel = {
  aboutTheDeviceWearerUri: string
  deviceWearerResponsibleAdultUri: string
  orderSummaryUri: string
  displayResponsibleAdult: boolean
  firstName: string
  lastName: string
  alias: string
  dateOfBirth_day: string
  dateOfBirth_month: string
  dateOfBirth_year: string
  adultAtTimeOfInstallation: string
  sex: string
  gender: string
  disabilities: string[]
  language: string
  interpreterRequired: string
  nomisId: string
  pncId: string
  deliusId: string
  prisonNumber: string
  homeOfficeReferenceNumber: string
  responsibleAdultRelationship: string
  responsibleAdultOtherRelationshipDetails: string
  responsibleAdultFullName: string
  responsibleAdultContactNumber: string
}

const createViewModelFromDeviceWearer = (
  deviceWearer: DeviceWearer,
  deviceWearerResponsibleAdult: DeviceWearerResponsibleAdult | null,
  orderId: string,
): DeviceWearerCheckAnswersViewModel => {
  const [year, month, day] = deserialiseDate(deviceWearer.dateOfBirth || '')
  const displayResponsibleAdult = !deviceWearer.adultAtTimeOfInstallation

  return {
    aboutTheDeviceWearerUri: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', orderId),
    deviceWearerResponsibleAdultUri: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', orderId),
    orderSummaryUri: paths.ORDER.SUMMARY.replace(':orderId', orderId),
    displayResponsibleAdult,
    firstName: deviceWearer.firstName || '',
    lastName: deviceWearer.lastName || '',
    alias: deviceWearer.alias || '',
    dateOfBirth_day: day,
    dateOfBirth_month: month,
    dateOfBirth_year: year,
    adultAtTimeOfInstallation: convertBooleanToEnum<string>(deviceWearer.adultAtTimeOfInstallation, '', 'Yes', 'No'),
    sex: deviceWearer.sex || '',
    gender: deviceWearer.gender || '',
    disabilities: deviceWearer.disabilities || [],
    language: deviceWearer.language || '',
    interpreterRequired: convertBooleanToEnum<string>(deviceWearer.interpreterRequired, '', 'Yes', 'No'),
    nomisId: deviceWearer.nomisId || '',
    pncId: deviceWearer.pncId || '',
    deliusId: deviceWearer.deliusId || '',
    prisonNumber: deviceWearer.prisonNumber || '',
    homeOfficeReferenceNumber: deviceWearer.homeOfficeReferenceNumber || '',
    responsibleAdultRelationship: deviceWearerResponsibleAdult?.relationship || '',
    responsibleAdultOtherRelationshipDetails: deviceWearerResponsibleAdult?.otherRelationshipDetails || '',
    responsibleAdultFullName: deviceWearerResponsibleAdult?.fullName || '',
    responsibleAdultContactNumber: deviceWearerResponsibleAdult?.contactNumber || '',
  }
}

const construct = (
  deviceWearer: DeviceWearer,
  deviceWearerResponsibleAdult: DeviceWearerResponsibleAdult | null,
  formAction: string,
): DeviceWearerCheckAnswersViewModel => {
  return createViewModelFromDeviceWearer(deviceWearer, deviceWearerResponsibleAdult, formAction)
}

export default {
  construct,
}
