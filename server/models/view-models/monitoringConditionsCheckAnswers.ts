import paths from '../../constants/paths'
import { convertBooleanToEnum, convertToTitleCase } from '../../utils/utils'
import { AddressTypeEnum } from '../Address'
import { Order } from '../Order'
import {
  createAddressAnswer,
  createDateAnswer,
  createHtmlAnswer,
  createMultipleAddressAnswer,
  createMultipleChoiceAnswer,
  createTextAnswer,
  createTimeRangeAnswer,
  createTimeTableAnswer,
} from './checkYourAnswersUtils'

const getSelectedMonitoringTypes = (order: Order) => {
  return [
    convertBooleanToEnum(order.monitoringConditions.curfew, '', 'Curfew', ''),
    convertBooleanToEnum(order.monitoringConditions.exclusionZone, '', 'Exlusion zone', ''),
    convertBooleanToEnum(order.monitoringConditions.trail, '', 'Trail', ''),
    convertBooleanToEnum(order.monitoringConditions.mandatoryAttendance, '', 'Mandatory attendance', ''),
    convertBooleanToEnum(order.monitoringConditions.alcohol, '', 'Alcohol', ''),
  ].filter(val => val !== '')
}

const createMonitoringConditionsAnswers = (order: Order) => {
  const uri = paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id)
  return [
    createDateAnswer('Start date', order.monitoringConditions.startDate, uri),
    createDateAnswer('End date', order.monitoringConditions.endDate, uri),
    createTextAnswer('Order type', order.monitoringConditions.orderType, uri),
    createTextAnswer('Order type description', order.monitoringConditions.orderTypeDescription, uri),
    createTextAnswer('Condition type', order.monitoringConditions.conditionType, uri),
    createMultipleChoiceAnswer('What monitoring does the device wearer need?', getSelectedMonitoringTypes(order), uri),
  ]
}

const createInstallationAddressAnswers = (order: Order) => {
  const uri = paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id)
  const installationAddress = order.addresses.find(
    ({ addressType }) => addressType === AddressTypeEnum.Enum.INSTALLATION,
  )
  return [
    createTextAnswer('Address line 1', installationAddress?.addressLine1, uri),
    createTextAnswer('Address line 2', installationAddress?.addressLine2, uri),
    createTextAnswer('Address line 3', installationAddress?.addressLine3, uri),
    createTextAnswer('Address line 4', installationAddress?.addressLine4, uri),
    createTextAnswer('Postcode', installationAddress?.postcode, uri),
  ]
}

const createCurfewAnswers = (order: Order) => {
  const releaseDateUri = paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id)
  const conditionsUri = paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id)
  const timeTableUri = paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id)

  return [
    createDateAnswer('Release date', order.curfewReleaseDateConditions?.releaseDate, releaseDateUri),
    createTimeRangeAnswer(
      'Curfew hours on the day of release',
      order.curfewReleaseDateConditions?.startTime,
      order.curfewReleaseDateConditions?.endTime,
      releaseDateUri,
    ),
    createAddressAnswer(
      'Curfew address on the day of release',
      order.addresses.find(({ addressType }) => addressType === order.curfewReleaseDateConditions?.curfewAddress),
      releaseDateUri,
    ),
    createDateAnswer('Date when monitoring starts', order.curfewConditions?.startDate, conditionsUri),
    createDateAnswer('Date when monitoring ends', order.curfewConditions?.endDate, conditionsUri),
    createMultipleAddressAnswer(
      'What address or addresses will the device wearer use during curfew hours?',
      order.addresses.filter(({ addressType }) => (order.curfewConditions?.curfewAddress || '').includes(addressType)),
      conditionsUri,
    ),
    createTimeTableAnswer('Enter curfew hours and addresses for each day', order.curfewTimeTable, timeTableUri),
  ]
}

const createExclusionZoneAnswers = (order: Order) => {
  const uri = paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', order.id)
  return order.enforcementZoneConditions
    .sort((a, b) => ((a.zoneId || 0) > (b.zoneId || 0) ? 1 : -1))
    .map(enforcementZone => {
      const zoneType = enforcementZone.zoneType || ''
      const zoneId = enforcementZone.zoneId || 0
      const fileName = enforcementZone.fileName || 'No file selected'
      return createHtmlAnswer(
        `${convertToTitleCase(zoneType)} zone ${zoneId + 1}`,
        `${fileName}<br/><br/>${enforcementZone.description}<br><br/>${enforcementZone.duration}`,
        uri.replace(':zoneId', zoneId.toString()),
      )
    })
}

const createTrailAnswers = (order: Order) => {
  const uri = paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id)

  return [
    createDateAnswer('Date when monitoring starts', order.monitoringConditionsTrail?.startDate, uri),
    createDateAnswer('Date when monitoring ends', order.monitoringConditionsTrail?.endDate, uri),
  ]
}

const createAlcoholAnswers = (order: Order) => {
  const uri = paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id)

  return [
    createTextAnswer(
      'What type of alcohol monitoring is needed?',
      order.monitoringConditionsAlcohol?.monitoringType,
      uri,
    ),
    createDateAnswer('Date when monitoring starts', order.monitoringConditionsAlcohol?.startDate, uri),
    createDateAnswer('Date when monitoring ends', order.monitoringConditionsAlcohol?.endDate, uri),
    ['PRIMARY', 'SECONDARY', 'TERTIARY', 'INSTALLATION'].includes(
      order.monitoringConditionsAlcohol?.installationLocation || '',
    )
      ? createAddressAnswer(
          'Where will alcohol monitoring equipment installation take place?',
          order.addresses.find(
            ({ addressType }) => addressType === order.monitoringConditionsAlcohol?.installationLocation,
          ),
          uri,
        )
      : createTextAnswer(
          'Where will alcohol monitoring equipment installation take place?',
          order.monitoringConditionsAlcohol?.prisonName || order.monitoringConditionsAlcohol?.probationOfficeName,
          uri,
        ),
  ]
}

const createViewModel = (order: Order) => {
  return {
    monitoringConditions: createMonitoringConditionsAnswers(order),
    installationAddress: createInstallationAddressAnswers(order),
    curfew: createCurfewAnswers(order),
    exclusionZone: createExclusionZoneAnswers(order),
    trail: createTrailAnswers(order),
    attendance: [],
    alcohol: createAlcoholAnswers(order),
  }
}

export default createViewModel
