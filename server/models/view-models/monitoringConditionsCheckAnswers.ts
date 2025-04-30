import paths from '../../constants/paths'
import {
  convertBooleanToEnum,
  convertToTitleCase,
  createAddressPreview,
  formatDateTime,
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
  createAnswer,
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

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
  return [
    createDateAnswer(questions.startDate.text, order.monitoringConditions.startDate, uri, answerOpts),
    createTimeAnswer(questions.startTime.text, order.monitoringConditions.startDate, uri, answerOpts),
    createDateAnswer(questions.endDate.text, order.monitoringConditions.endDate, uri, answerOpts),
    createTimeAnswer(questions.endTime.text, order.monitoringConditions.endDate, uri, answerOpts),
    createAnswer(questions.orderType.text, orderType, uri, answerOpts),
    createAnswer(questions.orderTypeDescription.text, orderTypeDescription, uri, answerOpts),
    createAnswer(questions.conditionType.text, conditionType, uri, answerOpts),
    createAnswer(questions.sentenceType.text, sentenceType, uri, answerOpts),
    createAnswer(questions.issp.text, issp, uri, answerOpts),
    createAnswer(questions.hdc.text, hdc, uri, answerOpts),
    createAnswer(questions.prarr.text, prarr, uri, answerOpts),
    createMultipleChoiceAnswer(questions.monitoringRequired.text, getSelectedMonitoringTypes(order), uri, answerOpts),
  ]
}

const createInstallationAddressAnswers = (order: Order, content: I18n) => {
  const uri = paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id).replace(
    ':addressType(installation)',
    'installation',
  )
  const installationAddress = order.addresses.find(
    ({ addressType }) => addressType === AddressTypeEnum.Enum.INSTALLATION,
  )

  return [
    createAddressAnswer(content.pages.installationAddress.legend, installationAddress, uri, {
      ignoreActions: order.status === 'SUBMITTED',
    }),
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

      return createMultipleChoiceAnswer(preview, groups[group].map(createSchedulePreview), uri, {
        ignoreActions: order.status === 'SUBMITTED',
      })
    })
}

const createCurfewReleaseDateAnswers = (order: Order, content: I18n) => {
  const releaseDateUri = paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id)
  const { questions } = content.pages.curfewReleaseDate

  if (!order.monitoringConditions.curfew) {
    return []
  }

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
  return [
    createDateAnswer(
      questions.releaseDate.text,
      order.curfewReleaseDateConditions?.releaseDate,
      releaseDateUri,
      answerOpts,
    ),
    createTimeAnswer(
      questions.startTime.text,
      order.curfewReleaseDateConditions?.startTime,
      releaseDateUri,
      answerOpts,
    ),
    createTimeAnswer(questions.endTime.text, order.curfewReleaseDateConditions?.endTime, releaseDateUri, answerOpts),
    createAddressAnswer(
      questions.address.text,
      order.addresses.find(({ addressType }) => addressType === order.curfewReleaseDateConditions?.curfewAddress),
      releaseDateUri,
      answerOpts,
    ),
  ]
}

const createCurfewAnswers = (order: Order, content: I18n) => {
  const conditionsUri = paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id)
  const { questions } = content.pages.curfewConditions

  if (!order.monitoringConditions.curfew) {
    return []
  }

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
  return [
    createDateAnswer(questions.startDate.text, order.curfewConditions?.startDate, conditionsUri, answerOpts),
    createDateAnswer(questions.endDate.text, order.curfewConditions?.endDate, conditionsUri, answerOpts),
    createMultipleAddressAnswer(
      questions.addresses.text,
      order.addresses.filter(({ addressType }) => (order.curfewConditions?.curfewAddress || '').includes(addressType)),
      conditionsUri,
      answerOpts,
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
      const zoneUri = uri ? uri.replace(':zoneId', zoneId.toString()) : ''

      const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
      return [
        createDateAnswer(questions.startDate.text, enforcementZone.startDate, zoneUri, answerOpts),
        createDateAnswer(questions.endDate.text, enforcementZone.endDate, zoneUri, answerOpts),
        createAnswer(questions.description.text, enforcementZone.description, zoneUri, answerOpts),
        createAnswer(questions.duration.text, enforcementZone.duration, zoneUri, answerOpts),
        createAnswer(questions.file.text, fileName, zoneUri, answerOpts),
      ]
    })
}

const createTrailAnswers = (order: Order, content: I18n) => {
  const uri = paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id)
  const { questions } = content.pages.trailMonitoring

  if (!order.monitoringConditions.trail) {
    return []
  }

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
  return [
    createDateAnswer(questions.startDate.text, order.monitoringConditionsTrail?.startDate, uri, answerOpts),
    createDateAnswer(questions.endDate.text, order.monitoringConditionsTrail?.endDate, uri, answerOpts),
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

    const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
    return [
      createDateAnswer(questions.startDate.text, attendance.startDate, uri, answerOpts),
      createDateAnswer(questions.endDate.text, attendance.endDate, uri, answerOpts),
      createAnswer(questions.purpose.text, attendance.purpose, uri, answerOpts),
      createAnswer(questions.appointmentDay.text, attendance.appointmentDay, uri, answerOpts),
      createAnswer(questions.startTime.text, attendance.startTime, uri, answerOpts),
      createAnswer(questions.endTime.text, attendance.endTime, uri, answerOpts),
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
        answerOpts,
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

  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' }
  return [
    createAnswer(questions.monitoringType.text, monitoringType, uri, answerOpts),
    createDateAnswer(questions.startDate.text, order.monitoringConditionsAlcohol?.startDate, uri, answerOpts),
    createDateAnswer(questions.endDate.text, order.monitoringConditionsAlcohol?.endDate, uri, answerOpts),
    ['PRIMARY', 'SECONDARY', 'TERTIARY', 'INSTALLATION'].includes(
      order.monitoringConditionsAlcohol?.installationLocation || '',
    )
      ? createAddressAnswer(
          questions.installationLocation.text,
          order.addresses.find(
            ({ addressType }) => addressType === order.monitoringConditionsAlcohol?.installationLocation,
          ),
          uri,
          answerOpts,
        )
      : createAnswer(
          questions.installationLocation.text,
          order.monitoringConditionsAlcohol?.prisonName || order.monitoringConditionsAlcohol?.probationOfficeName,
          uri,
          answerOpts,
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
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
  }
}

export default createViewModel
