import paths from '../../constants/paths'
import { conditionTypeMap, orderTypeDescriptionMap, orderTypeMap } from '../../constants/monitoring-conditions'
import { monitoringTypeMap } from '../../constants/monitoring-conditions/alcohol'
import {
  convertBooleanToEnum,
  convertToTitleCase,
  createAddressPreview,
  isNullOrUndefined,
  lookup,
} from '../../utils/utils'
import { AddressType, AddressTypeEnum } from '../Address'
import { CurfewSchedule, CurfewTimetable } from '../CurfewTimetable'
import { Order } from '../Order'
import {
  createAddressAnswer,
  createDateAnswer,
  createHtmlAnswer,
  createMultipleAddressAnswer,
  createMultipleChoiceAnswer,
  createTextAnswer,
  createTimeRangeAnswer,
} from '../../utils/checkYourAnswers'

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
  const conditionType = lookup(conditionTypeMap, order.monitoringConditions.conditionType)
  const orderType = lookup(orderTypeMap, order.monitoringConditions.orderType)
  const orderTypeDescription = lookup(orderTypeDescriptionMap, order.monitoringConditions.orderTypeDescription)
  return [
    createDateAnswer('Start date', order.monitoringConditions.startDate, uri),
    createDateAnswer('End date', order.monitoringConditions.endDate, uri),
    createTextAnswer('Order type', orderType, uri),
    createTextAnswer('Order type description', orderTypeDescription, uri),
    createTextAnswer('Condition type', conditionType, uri),
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

const createSchedulePreview = (schedule: CurfewSchedule) =>
  `${convertToTitleCase(schedule.dayOfWeek)} - ${schedule.startTime}-${schedule.endTime}`

const groupTimetableByAddress = (timetable: CurfewTimetable) =>
  timetable.reduce(
    (acc, schedule) => {
      if (schedule.curfewAddress === 'PRIMARY_ADDRESS') {
        acc.PRIMARY.push(schedule)
      }
      if (schedule.curfewAddress === 'SECONDARY_ADDRESS') {
        acc.SECONDARY.push(schedule)
      }
      if (schedule.curfewAddress === 'TERTIARY_ADDRESS') {
        acc.TERTIARY.push(schedule)
      }
      return acc
    },
    {
      PRIMARY: [] as Array<CurfewSchedule>,
      SECONDARY: [] as Array<CurfewSchedule>,
      TERTIARY: [] as Array<CurfewSchedule>,
    } as Record<Partial<AddressType>, Array<CurfewSchedule>>,
  )

const createCurfewTimetableAnswers = (order: Order) => {
  const timetable = order.curfewTimeTable
  const uri = paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id)

  if (!order.monitoringConditions.curfew) {
    return []
  }

  if (isNullOrUndefined(timetable)) {
    return []
  }

  const groups = groupTimetableByAddress(timetable)
  const keys = Object.keys(groups) as Array<keyof typeof groups>

  return keys
    .filter(group => groups[group].length > 0)
    .map(group => {
      const address = order.addresses.find(({ addressType }) => addressType === group)
      const preview = isNullOrUndefined(address)
        ? `${convertToTitleCase(group)} address`
        : createAddressPreview(address)

      return createMultipleChoiceAnswer(preview, groups[group].map(createSchedulePreview), uri)
    })
}

const createCurfewAnswers = (order: Order) => {
  const releaseDateUri = paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id)
  const conditionsUri = paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id)

  if (!order.monitoringConditions.curfew) {
    return []
  }

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
  ]
}

const createExclusionZoneAnswers = (order: Order) => {
  const uri = paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', order.id)

  if (!order.monitoringConditions.exclusionZone) {
    return []
  }

  return order.enforcementZoneConditions
    .sort((a, b) => ((a.zoneId || 0) > (b.zoneId || 0) ? 1 : -1))
    .map(enforcementZone => {
      const zoneType = enforcementZone.zoneType || ''
      const zoneId = enforcementZone.zoneId || 0
      const fileName = enforcementZone.fileName || 'No file selected'
      return createHtmlAnswer(
        `${convertToTitleCase(zoneType)} zone ${zoneId + 1}`,
        `${fileName}<br/><br/>${enforcementZone.description}<br/><br/>${enforcementZone.duration}`,
        uri.replace(':zoneId', zoneId.toString()),
      )
    })
}

const createTrailAnswers = (order: Order) => {
  const uri = paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id)

  if (!order.monitoringConditions.trail) {
    return []
  }

  return [
    createDateAnswer('Date when monitoring starts', order.monitoringConditionsTrail?.startDate, uri),
    createDateAnswer('Date when monitoring ends', order.monitoringConditionsTrail?.endDate, uri),
  ]
}

const createAlcoholAnswers = (order: Order) => {
  const uri = paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id)
  const monitoringType = lookup(monitoringTypeMap, order.monitoringConditionsAlcohol?.monitoringType)

  if (!order.monitoringConditions.alcohol) {
    return []
  }

  return [
    createTextAnswer('What type of alcohol monitoring is needed?', monitoringType, uri),
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
    curfewTimetable: createCurfewTimetableAnswers(order),
    exclusionZone: createExclusionZoneAnswers(order),
    trail: createTrailAnswers(order),
    attendance: [],
    alcohol: createAlcoholAnswers(order),
  }
}

export default createViewModel
