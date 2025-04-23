import paths from '../../constants/paths'
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
  createTimeAnswer,
  createMultipleAddressAnswer,
  createMultipleChoiceAnswer,
  createTextAnswer,
} from '../../utils/checkYourAnswers'
import sentenceTypes from '../../reference/sentence-types'
import yesNoUnknown from '../../reference/yes-no-unknown'
import I18n from '../../types/i18n'

const getSelectedMonitoringTypes = (order: Order) => {
  return [
    convertBooleanToEnum(order.monitoringConditions.curfew, '', 'Curfew', ''),
    convertBooleanToEnum(order.monitoringConditions.exclusionZone, '', 'Exlusion zone', ''),
    convertBooleanToEnum(order.monitoringConditions.trail, '', 'Trail', ''),
    convertBooleanToEnum(order.monitoringConditions.mandatoryAttendance, '', 'Mandatory attendance', ''),
    convertBooleanToEnum(order.monitoringConditions.alcohol, '', 'Alcohol', ''),
  ].filter(val => val !== '')
}

const createMonitoringConditionsAnswers = (order: Order, content: I18n) => {
  const uri = paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id)
  const conditionType = lookup(content.reference.conditionTypes, order.monitoringConditions.conditionType)
  const orderType = lookup(content.reference.orderTypes, order.monitoringConditions.orderType)
  const orderTypeDescription = lookup(
    content.reference.orderTypeDescriptions,
    order.monitoringConditions.orderTypeDescription,
  )
  const sentenceType = lookup(sentenceTypes, order.monitoringConditions.sentenceType)
  const issp = lookup(yesNoUnknown, order.monitoringConditions.issp)
  const hdc = lookup(yesNoUnknown, order.monitoringConditions.hdc)
  const prarr = lookup(yesNoUnknown, order.monitoringConditions.prarr)
  const { questions } = content.pages.monitoringConditions

  return [
    createDateAnswer(questions.startDate.text, order.monitoringConditions.startDate, uri),
    createTimeAnswer(questions.startTime.text, order.monitoringConditions.startDate, uri),
    createDateAnswer(questions.endDate.text, order.monitoringConditions.endDate, uri),
    createTimeAnswer(questions.endTime.text, order.monitoringConditions.endDate, uri),
    createTextAnswer(questions.orderType.text, orderType, uri),
    createTextAnswer(questions.orderTypeDescription.text, orderTypeDescription, uri),
    createTextAnswer(questions.conditionType.text, conditionType, uri),
    createTextAnswer(questions.sentenceType.text, sentenceType, uri),
    createTextAnswer(questions.issp.text, issp, uri),
    createTextAnswer(questions.hdc.text, hdc, uri),
    createTextAnswer(questions.prarr.text, prarr, uri),
    createMultipleChoiceAnswer(questions.monitoringRequired.text, getSelectedMonitoringTypes(order), uri),
  ]
}

const createInstallationAddressAnswers = (order: Order, content: I18n) => {
  const uri = paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id)
  const installationAddress = order.addresses.find(
    ({ addressType }) => addressType === AddressTypeEnum.Enum.INSTALLATION,
  )

  return [createAddressAnswer(content.pages.installationAddress.legend, installationAddress, uri)]
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

const createCurfewReleaseDateAnswers = (order: Order, content: I18n) => {
  const releaseDateUri = paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id)
  const { questions } = content.pages.curfewReleaseDate

  if (!order.monitoringConditions.curfew) {
    return []
  }

  return [
    createDateAnswer(questions.releaseDate.text, order.curfewReleaseDateConditions?.releaseDate, releaseDateUri),
    createTimeAnswer(questions.startTime.text, order.curfewReleaseDateConditions?.startTime, releaseDateUri),
    createTimeAnswer(questions.endTime.text, order.curfewReleaseDateConditions?.endTime, releaseDateUri),
    createAddressAnswer(
      questions.address.text,
      order.addresses.find(({ addressType }) => addressType === order.curfewReleaseDateConditions?.curfewAddress),
      releaseDateUri,
    ),
  ]
}

const createCurfewAnswers = (order: Order, content: I18n) => {
  const conditionsUri = paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id)
  const { questions } = content.pages.curfewConditions

  if (!order.monitoringConditions.curfew) {
    return []
  }

  return [
    createDateAnswer(questions.startDate.text, order.curfewConditions?.startDate, conditionsUri),
    createDateAnswer(questions.endDate.text, order.curfewConditions?.endDate, conditionsUri),
    createMultipleAddressAnswer(
      questions.addresses.text,
      order.addresses.filter(({ addressType }) => (order.curfewConditions?.curfewAddress || '').includes(addressType)),
      conditionsUri,
    ),
  ]
}

const createExclusionZoneAnswers = (order: Order, content: I18n) => {
  const uri = paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', order.id)
  const { questions } = content.pages.exclusionZone

  if (!order.monitoringConditions.exclusionZone) {
    return []
  }

  return order.enforcementZoneConditions
    .sort((a, b) => ((a.zoneId || 0) > (b.zoneId || 0) ? 1 : -1))
    .map(enforcementZone => {
      const fileName = enforcementZone.fileName || 'No file selected'
      const zoneId = enforcementZone.zoneId || 0
      const zoneUri = uri.replace(':zoneId', zoneId.toString())

      return [
        createDateAnswer(questions.startDate.text, enforcementZone.startDate, zoneUri),
        createDateAnswer(questions.endDate.text, enforcementZone.endDate, zoneUri),
        createTextAnswer(questions.description.text, enforcementZone.description, zoneUri),
        createTextAnswer(questions.duration.text, enforcementZone.duration, zoneUri),
        createTextAnswer(questions.file.text, fileName, zoneUri),
      ]
    })
}

const createTrailAnswers = (order: Order, content: I18n) => {
  const uri = paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id)
  const { questions } = content.pages.trailMonitoring

  if (!order.monitoringConditions.trail) {
    return []
  }

  return [
    createDateAnswer(questions.startDate.text, order.monitoringConditionsTrail?.startDate, uri),
    createDateAnswer(questions.endDate.text, order.monitoringConditionsTrail?.endDate, uri),
  ]
}

const createAttendanceAnswers = (order: Order, content: I18n) => {
  if (!order.mandatoryAttendanceConditions) {
    return []
  }

  return order.mandatoryAttendanceConditions.sort().map(attendance => {
    const uri = paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
      `:conditionId`,
      attendance.id!,
    )
    const { questions } = content.pages.attendance

    return [
      createDateAnswer(questions.startDate.text, attendance.startDate, uri),
      createDateAnswer(questions.endDate.text, attendance.endDate, uri),
      createTextAnswer(questions.purpose.text, attendance.purpose, uri),
      createTextAnswer(questions.appointmentDay.text, attendance.appointmentDay, uri),
      createTextAnswer(questions.startTime.text, attendance.startTime, uri),
      createTextAnswer(questions.endTime.text, attendance.endTime, uri),
      createAddressAnswer(
        questions.address.text,
        {
          addressLine1: attendance.addressLine1 || '',
          addressLine2: attendance.addressLine2 || '',
          addressLine3: attendance.addressLine3 || '',
          addressLine4: attendance.addressLine4 || '',
          postcode: attendance.postcode || '',
        },
        uri,
      ),
    ]
  })
}

const createAlcoholAnswers = (order: Order, content: I18n) => {
  const uri = paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id)
  const monitoringType = lookup(
    content.reference.alcoholMonitoringTypes,
    order.monitoringConditionsAlcohol?.monitoringType,
  )
  const { questions } = content.pages.alcohol

  if (!order.monitoringConditions.alcohol) {
    return []
  }

  return [
    createTextAnswer(questions.monitoringType.text, monitoringType, uri),
    createDateAnswer(questions.startDate.text, order.monitoringConditionsAlcohol?.startDate, uri),
    createDateAnswer(questions.endDate.text, order.monitoringConditionsAlcohol?.endDate, uri),
    ['PRIMARY', 'SECONDARY', 'TERTIARY', 'INSTALLATION'].includes(
      order.monitoringConditionsAlcohol?.installationLocation || '',
    )
      ? createAddressAnswer(
          questions.installationLocation.text,
          order.addresses.find(
            ({ addressType }) => addressType === order.monitoringConditionsAlcohol?.installationLocation,
          ),
          uri,
        )
      : createTextAnswer(
          questions.installationLocation.text,
          order.monitoringConditionsAlcohol?.prisonName || order.monitoringConditionsAlcohol?.probationOfficeName,
          uri,
        ),
  ]
}

const createViewModel = (order: Order, content: I18n) => {
  return {
    monitoringConditions: createMonitoringConditionsAnswers(order, content),
    installationAddress: createInstallationAddressAnswers(order, content),
    curfew: createCurfewAnswers(order, content),
    curfewReleaseDate: createCurfewReleaseDateAnswers(order, content),
    curfewTimetable: createCurfewTimetableAnswers(order),
    exclusionZone: createExclusionZoneAnswers(order, content),
    trail: createTrailAnswers(order, content),
    attendance: createAttendanceAnswers(order, content),
    alcohol: createAlcoholAnswers(order, content),
  }
}

export default createViewModel
