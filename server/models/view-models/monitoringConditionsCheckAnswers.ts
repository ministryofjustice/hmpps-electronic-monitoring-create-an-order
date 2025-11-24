import paths from '../../constants/paths'
import {
  convertBooleanToEnum,
  convertToTitleCase,
  createAddressPreview,
  formatDateTime,
  isNullOrUndefined,
  lookup,
  trimSeconds,
} from '../../utils/utils'
import { AddressType, AddressTypeEnum } from '../Address'
import { CurfewSchedule, CurfewTimetable } from '../CurfewTimetable'
import { Order } from '../Order'
import {
  Answer,
  createAddressAnswer,
  createDateAnswer,
  createTimeAnswer,
  createMultipleChoiceAnswer,
  createAnswer,
  AnswerOptions,
} from '../../utils/checkYourAnswers'
import I18n from '../../types/i18n'
import config from '../../config'
import FeatureFlags from '../../utils/featureFlags'

const createMonitoringOrderTypeDescriptionAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const answers = []
  const data = order.monitoringConditions
  const notifyingOrg = order.interestedParties?.notifyingOrganisation
  if (
    !(notifyingOrg === 'PRISON' || notifyingOrg === 'YOUTH_CUSTODY_SERVICE' || notifyingOrg === 'HOME_OFFICE') &&
    data.orderType !== null
  ) {
    const path = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ORDER_TYPE
    answers.push(
      createAnswer(
        'What is the order type?',
        lookup(content.reference.orderTypes, data.orderType),
        path.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }

  if (data.sentenceType && data.sentenceType !== null) {
    const question =
      data.orderType === 'BAIL'
        ? 'What type of bail has the device wearer been given?'
        : 'What type of sentence has the device wearer been given?'

    const path = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE
    answers.push(
      createAnswer(
        question,
        lookup(content.reference.sentenceTypes, data.sentenceType),
        path.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }

  if (data.hdc !== undefined && data.hdc !== null && data.hdc !== 'UNKNOWN' && data.sentenceType !== 'SECTION_91') {
    const hdcPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC
    answers.push(
      createAnswer(
        content.pages.monitoringConditions.questions.hdc.text,
        lookup(content.reference.yesNoUnknown, data.hdc),
        hdcPath.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }

  if (data.issp !== undefined && data.issp !== null && data.issp !== 'UNKNOWN') {
    const isspPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISSP
    answers.push(
      createAnswer(
        content.pages.monitoringConditions.questions.issp.text,
        lookup(content.reference.yesNoUnknown, data.issp),
        isspPath.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }

  if (data.pilot !== undefined && data.pilot !== null) {
    let text = lookup(content.reference.pilots, data.pilot)
    const pilotPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT
    if (
      FeatureFlags.getInstance().get('ORDER_TYPE_DESCRIPTION_FLOW_ENABLED') &&
      (data.pilot === 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW' || data.pilot === 'GPS_ACQUISITIVE_CRIME_PAROLE')
    ) {
      text = 'GPS acquisitive crime (EMAC)'
    }
    answers.push(
      createAnswer(
        content.pages.monitoringConditions.questions.pilot.text,
        text,
        pilotPath.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }

  if (data.offenceType !== undefined && data.offenceType !== null && data.offenceType !== '') {
    const offenceTypePath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.OFFENCE_TYPE
    answers.push(
      createAnswer(
        content.pages.monitoringConditions.questions.offenceType.text,
        data.offenceType,
        offenceTypePath.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }

  if (data.policeArea !== undefined && data.policeArea !== null && data.policeArea !== '') {
    const text = lookup(content.reference.policeAreas, data.policeArea)
    const policeAreaPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.POLICE_AREA
    answers.push(
      createAnswer(
        content.pages.monitoringConditions.questions.policeArea.text,
        text,
        policeAreaPath.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }

  if (data.prarr !== undefined && data.prarr !== null && data.prarr !== 'UNKNOWN') {
    const prarrPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR
    answers.push(
      createAnswer(
        content.pages.monitoringConditions.questions.prarr.text,
        lookup(content.reference.yesNoUnknown, data.prarr),
        prarrPath.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  }

  if (FeatureFlags.getInstance().getValue('LIST_MONITORING_CONDITION_FLOW_ENABLED')) {
    const monitoringTypesPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED
    const typesSelected = []
    if (order.monitoringConditionsAlcohol?.startDate !== undefined) {
      typesSelected.push('Alcohol monitoring')
    }
    if (order.monitoringConditionsTrail?.startDate !== undefined) {
      typesSelected.push('Trail monitoring')
    }
    if (order.curfewConditions?.startDate !== undefined) {
      typesSelected.push('Curfew')
    }
    if (order.enforcementZoneConditions.length !== 0) {
      typesSelected.push('Exclusion zone monitoring')
    }
    if (order.mandatoryAttendanceConditions.length !== 0) {
      typesSelected.push('Mandatory attendance monitoring')
    }
    answers.push(
      createMultipleChoiceAnswer(
        content.pages.monitoringConditions.questions.monitoringRequired.text,
        typesSelected,
        monitoringTypesPath.replace(':orderId', order.id),
        answerOpts,
      ),
    )
  } else {
    const monitoringTypes = [
      { name: 'Curfew', data: data.curfew },
      { name: 'Exclusion zone monitoring', data: data.exclusionZone },
      { name: 'Trail monitoring', data: data.trail },
      { name: 'Mandatory attendance monitoring', data: data.mandatoryAttendance },
      { name: 'Alcohol monitoring', data: data.alcohol },
    ]
    if (monitoringTypes.every(type => type.data !== undefined)) {
      const monitoringTypesPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES
      answers.push(
        createMultipleChoiceAnswer(
          content.pages.monitoringConditions.questions.monitoringRequired.text,
          monitoringTypes.filter(type => type.data).map(type => type.name),
          monitoringTypesPath.replace(':orderId', order.id),
          answerOpts,
        ),
      )
    }
  }

  return answers
}
const createMonitoringConditionsAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id)
  const orderTypeDescription = lookup(
    content.reference.orderTypeDescriptions,
    order.monitoringConditions.orderTypeDescription,
  )
  const sentenceType = lookup(content.reference.sentenceTypes, order.monitoringConditions.sentenceType)
  const issp = lookup(content.reference.yesNoUnknown, order.monitoringConditions.issp)
  const hdc = lookup(content.reference.yesNoUnknown, order.monitoringConditions.hdc)
  const prarr = lookup(content.reference.yesNoUnknown, order.monitoringConditions.prarr)
  const { questions } = content.pages.monitoringConditions

  const answers: Answer[] = []
  answers.push(createDateAnswer(questions.startDate.text, order.monitoringConditions.startDate, uri, answerOpts))
  if (config.monitoringConditionTimes.enabled)
    answers.push(createTimeAnswer(questions.startTime.text, order.monitoringConditions.startDate, uri, answerOpts))
  answers.push(createDateAnswer(questions.endDate.text, order.monitoringConditions.endDate, uri, answerOpts))
  if (config.monitoringConditionTimes.enabled)
    answers.push(createTimeAnswer(questions.endTime.text, order.monitoringConditions.endDate, uri, answerOpts))
  if (order.dataDictionaryVersion === 'DDV5') {
    let { pilot } = order.monitoringConditions
    if ('pilots' in content.reference) {
      pilot = lookup(content.reference.pilots, order.monitoringConditions.pilot)
    }
    answers.push(createAnswer(questions.pilot.text, pilot, uri, answerOpts))
  } else {
    answers.push(createAnswer(questions.orderTypeDescription.text, orderTypeDescription, uri, answerOpts))
  }
  answers.push(
    ...[
      createAnswer(questions.sentenceType.text, sentenceType, uri, answerOpts),
      createAnswer(questions.issp.text, issp, uri, answerOpts),
      createAnswer(questions.hdc.text, hdc, uri, answerOpts),
      createAnswer(questions.prarr.text, prarr, uri, answerOpts),
      createMultipleChoiceAnswer(questions.monitoringRequired.text, getSelectedMonitoringTypes(order), uri, answerOpts),
    ],
  )
  return answers
}
const getSelectedMonitoringTypes = (order: Order) => {
  return [
    convertBooleanToEnum(order.monitoringConditions.curfew, '', 'Curfew', ''),
    convertBooleanToEnum(order.monitoringConditions.exclusionZone, '', 'Exclusion zone', ''),
    convertBooleanToEnum(order.monitoringConditions.trail, '', 'Trail', ''),
    convertBooleanToEnum(order.monitoringConditions.mandatoryAttendance, '', 'Mandatory attendance', ''),
    convertBooleanToEnum(order.monitoringConditions.alcohol, '', 'Alcohol', ''),
  ].filter(val => val !== '')
}

const createInstallationAddressAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  if (!order.installationLocation || order.installationLocation.location === 'PRIMARY') {
    return []
  }
  const uri = paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id).replace(
    ':addressType(installation)',
    'installation',
  )
  const installationAddress = order.addresses.find(
    ({ addressType }) => addressType === AddressTypeEnum.Enum.INSTALLATION,
  )

  return [createAddressAnswer(content.pages.installationAddress.title, installationAddress, uri, answerOpts)]
}

const createSchedulePreview = (schedule: CurfewSchedule) =>
  `${convertToTitleCase(schedule.dayOfWeek)} - ${trimSeconds(schedule.startTime)}-${trimSeconds(schedule.endTime)}`

const groupTimetableByAddress = (timetable: CurfewTimetable) =>
  timetable.reduce(
    (acc, schedule) => {
      if (schedule.curfewAddress.includes('PRIMARY_ADDRESS')) {
        acc.PRIMARY.push(schedule)
      }
      if (schedule.curfewAddress.includes('SECONDARY_ADDRESS')) {
        acc.SECONDARY.push(schedule)
      }
      if (schedule.curfewAddress.includes('TERTIARY_ADDRESS')) {
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

const createCurfewTimetableAnswers = (order: Order, answerOpts: AnswerOptions) => {
  const timetable = order.curfewTimeTable
  const uri = paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id)
  if (order.curfewConditions?.startDate === undefined) {
    return []
  }

  if (isNullOrUndefined(timetable)) {
    return []
  }

  const groups = groupTimetableByAddress(timetable)
  const keys = Object.keys(groups) as Array<keyof typeof groups>

  const result = keys
    .filter(group => groups[group].length > 0)
    .map(group => {
      const address = order.addresses.find(({ addressType }) => addressType === group)
      const preview = isNullOrUndefined(address)
        ? `${convertToTitleCase(group)} address`
        : createAddressPreview(address)

      return createMultipleChoiceAnswer(preview, groups[group].map(createSchedulePreview), uri, answerOpts)
    })

  return result
}

const createCurfewReleaseDateAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const releaseDateUri = paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id)
  const { questions } = content.pages.curfewReleaseDate

  if (order.curfewConditions?.startDate === undefined) {
    return []
  }

  return [
    createAnswer(
      questions.startTime.text,
      trimSeconds(order.curfewReleaseDateConditions?.startTime),
      releaseDateUri,
      answerOpts,
    ),
    createAnswer(
      questions.endTime.text,
      trimSeconds(order.curfewReleaseDateConditions?.endTime),
      releaseDateUri,
      answerOpts,
    ),
    createAddressAnswer(
      questions.address.text,
      order.addresses.find(({ addressType }) => addressType === order.curfewReleaseDateConditions?.curfewAddress),
      releaseDateUri,
      answerOpts,
    ),
  ]
}

const createCurfewAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const conditionsUri = paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id)
  const curfewAdditionalDetailsUri = paths.MONITORING_CONDITIONS.CURFEW_ADDITIONAL_DETAILS.replace(':orderId', order.id)
  const { questions } = content.pages.curfewConditions
  const curfewAdditionalDetailsQuestions = content.pages.curfewAdditionalDetails.questions

  if (order.curfewConditions?.startDate === undefined) {
    return []
  }
  const answers = [
    createDateAnswer(questions.startDate.text, order.curfewConditions?.startDate, conditionsUri, answerOpts),
    createDateAnswer(questions.endDate.text, order.curfewConditions?.endDate, conditionsUri, answerOpts),
  ]

  if (order.dataDictionaryVersion === 'DDV5') {
    const curfewAdditionalDetails = order.curfewConditions?.curfewAdditionalDetails
    if (curfewAdditionalDetails !== null && curfewAdditionalDetails.length > 0) {
      answers.push(
        createAnswer(
          curfewAdditionalDetailsQuestions.provideDetails.text,
          order.curfewConditions?.curfewAdditionalDetails,
          curfewAdditionalDetailsUri,
          answerOpts,
        ),
      )
    }
  }

  return answers
}

const createExclusionZoneAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = FeatureFlags.getInstance().get('LIST_MONITORING_CONDITION_FLOW_ENABLED')
    ? paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST.replace(':orderId', order.id)
    : paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', order.id)
  const { questions } = content.pages.exclusionZone

  if (order.enforcementZoneConditions.length === 0) {
    return []
  }

  return order.enforcementZoneConditions
    .sort((a, b) => ((a.zoneId || 0) > (b.zoneId || 0) ? 1 : -1))
    .map(enforcementZone => {
      const fileName = enforcementZone.fileName || 'No file selected'
      const zoneId = enforcementZone.zoneId || 0
      const zoneUri = uri ? uri.replace(':zoneId', zoneId.toString()) : ''
      const items = [
        createDateAnswer(questions.startDate.text, enforcementZone.startDate, zoneUri, answerOpts),
        createDateAnswer(questions.endDate.text, enforcementZone.endDate, zoneUri, answerOpts),
        createAnswer(questions.description.text, enforcementZone.description, zoneUri, answerOpts),
        createAnswer(questions.duration.text, enforcementZone.duration, zoneUri, answerOpts),
        createAnswer(questions.file.text, fileName, zoneUri, answerOpts),
      ]
      if (enforcementZone.name) {
        items.push(createAnswer(questions.name.text, enforcementZone.name, zoneUri, answerOpts))
      }
      return { item: items, zoneId: enforcementZone.zoneId }
    })
}

const createTrailAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id)
  const { questions } = content.pages.trailMonitoring

  if (order.monitoringConditionsTrail?.startDate === undefined) {
    return []
  }

  return [
    createDateAnswer(questions.startDate.text, order.monitoringConditionsTrail?.startDate, uri, answerOpts),
    createDateAnswer(questions.endDate.text, order.monitoringConditionsTrail?.endDate, uri, answerOpts),
  ]
}

const createAttendanceAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  if (order.mandatoryAttendanceConditions.length === 0) {
    return []
  }

  return order.mandatoryAttendanceConditions.sort().map(attendance => {
    const uri = paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
      `:conditionId`,
      attendance.id!,
    )
    const { questions } = content.pages.attendance

    return [
      createDateAnswer(questions.startDate.text, attendance.startDate, uri, answerOpts),
      createDateAnswer(questions.endDate.text, attendance.endDate, uri, answerOpts),
      createAnswer(questions.purpose.text, attendance.purpose, uri, answerOpts),
      createAnswer(questions.appointmentDay.text, attendance.appointmentDay, uri, answerOpts),
      createAnswer(questions.startTime.text, trimSeconds(attendance.startTime), uri, answerOpts),
      createAnswer(questions.endTime.text, trimSeconds(attendance.endTime), uri, answerOpts),
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

const createAlcoholAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id)
  const monitoringType = lookup(
    content.reference.alcoholMonitoringTypes,
    order.monitoringConditionsAlcohol?.monitoringType,
  )
  const { questions } = content.pages.alcohol

  if (order.monitoringConditionsAlcohol?.startDate == null) {
    return []
  }
  return [
    createAnswer(questions.monitoringType.text, monitoringType, uri, answerOpts),
    createDateAnswer(questions.startDate.text, order.monitoringConditionsAlcohol?.startDate, uri, answerOpts),
    createDateAnswer(questions.endDate.text, order.monitoringConditionsAlcohol?.endDate, uri, answerOpts),
  ]
}

const createInstallationLocationAnswers = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION.replace(':orderId', order.id)

  const { questions } = content.pages.installationLocation

  if (!order.installationLocation) {
    return []
  }
  return [
    order.installationLocation?.location === 'PRIMARY'
      ? createAddressAnswer(
          questions.location.text,
          order.addresses.find(({ addressType }) => addressType === order.installationLocation?.location),
          uri,
          answerOpts,
        )
      : createAnswer(
          questions.location.text,
          lookup(content.reference.installationLocations, order.installationLocation?.location),
          uri,
          answerOpts,
        ),
  ]
}

const createInstallationAppointmentAnswer = (order: Order, content: I18n, answerOpts: AnswerOptions) => {
  const uri = paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT.replace(':orderId', order.id)

  const { questions } = content.pages.installationAppointment

  if (!order.installationAppointment || order.installationLocation?.location === 'PRIMARY') {
    return []
  }
  return [
    createAnswer(questions.placeName.text, order.installationAppointment?.placeName, uri, answerOpts),
    createDateAnswer(questions.appointmentDate.text, order.installationAppointment?.appointmentDate, uri, answerOpts),
    createTimeAnswer(questions.appointmentTime.text, order.installationAppointment?.appointmentDate, uri, answerOpts),
  ]
}

const createViewModel = (order: Order, content: I18n) => {
  const ignoreActions = {
    ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR',
  }
  return {
    monitoringConditions: FeatureFlags.getInstance().get('ORDER_TYPE_DESCRIPTION_FLOW_ENABLED')
      ? createMonitoringOrderTypeDescriptionAnswers(order, content, ignoreActions)
      : createMonitoringConditionsAnswers(order, content, ignoreActions),
    curfew: createCurfewAnswers(order, content, ignoreActions),
    curfewReleaseDate: createCurfewReleaseDateAnswers(order, content, ignoreActions),
    curfewTimetable: createCurfewTimetableAnswers(order, ignoreActions),
    exclusionZone: createExclusionZoneAnswers(order, content, ignoreActions),
    trail: createTrailAnswers(order, content, ignoreActions),
    attendance: createAttendanceAnswers(order, content, ignoreActions),
    alcohol: createAlcoholAnswers(order, content, ignoreActions),
    installationLocation: createInstallationLocationAnswers(order, content, ignoreActions),
    submittedDate: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
    installationAddress: createInstallationAddressAnswers(order, content, ignoreActions),
    installationAppointment: createInstallationAppointmentAnswer(order, content, ignoreActions),
  }
}

export default createViewModel
