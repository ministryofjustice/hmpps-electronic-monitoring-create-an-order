import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { Order } from '../../../models/Order'
import { CurfewConditions } from '../../../models/CurfewConditions'
import { TrailMonitoring } from '../../../models/TrailMonitoring'
import { AlcoholMonitoring } from '../../../models/AlcoholMonitoring'
import { createAnswer, createDatePreview, Answer } from '../../../utils/views/checkYourAnswers'
import paths from '../../../constants/paths'
import { getError } from '../../../utils/validation/errorMessages'
import getIneligibleMonitoringConditionsErrors from '../../../utils/order/ineligibleMonitoringConditions'
import { NotifyingOrganisation } from '../../../models/NotifyingOrganisation'
import { EnforcementZone } from '../../../models/EnforcementZone'
import { AttendanceMonitoring } from '../../../models/AttendanceMonitoring'
import { deserialiseDateTime, deserialiseTime } from '../../../utils/dateTime'
import { CurfewConditionsFormDataValidator } from '../curfew-conditions/formModel'
import { TrailMonitoringFormDataValidator } from '../trail/formModel'
import { AlcoholMonitoringFormDataValidator } from '../alcohol/formModel'
import { AttendanceMonitoringAddToListFormDataValidator } from '../attendance-monitoring/formModel'
import { EnforcementZoneAddToListFormDataValidator } from '../enforcement-zone/formModel'
import { AddToListEnforcementZoneTypes } from '../model'

type MonitoringTypeSummaryItem = Answer

export type TypesOfMonitoringNeededModel = ViewModel<unknown> & {
  items: MonitoringTypeSummaryItem[]
  addAnother: { value: string; error?: { text: string } }
  ineligibleErrors: string[]
  hasIncompleteItems: boolean
  continueDisabled: boolean
  draftDisabled: boolean
}

const MONITORING_TYPE_NAMES = {
  curfew: 'Curfew',
  exclusionZone: 'Exclusion zone monitoring',
  restrictionZone: 'Restriction zone monitoring',
  trail: 'Trail monitoring',
  mandatoryAttendance: 'Mandatory attendance monitoring',
  alcohol: 'Alcohol monitoring',
}

const INCOMPLETE_TAG = '<strong class="govuk-tag govuk-tag--blue govuk-!-margin-left-2">Incomplete</strong>'

const withIncompleteTag = (answer: Answer, isIncomplete: boolean): Answer => {
  if (!isIncomplete) {
    return answer
  }
  // Only date text or html built from stored values is passed here, so wrapping text as html is safe
  const existing = answer.value.html ?? answer.value.text ?? ''
  return { ...answer, value: { html: `${existing}${INCOMPLETE_TAG}` } }
}

// Stored ISO dates are converted back to the split date/time parts the form validators expect
const isCurfewIncomplete = (curfew: CurfewConditions, org: NotifyingOrganisation | null): boolean =>
  !CurfewConditionsFormDataValidator(org).safeParse({
    startDate: deserialiseDateTime(curfew.startDate),
    endDate: deserialiseDateTime(curfew.endDate),
  }).success

const isTrailIncomplete = (trail: TrailMonitoring, org: NotifyingOrganisation | null): boolean =>
  !TrailMonitoringFormDataValidator(org).safeParse({
    startDate: deserialiseDateTime(trail.startDate),
    endDate: deserialiseDateTime(trail.endDate),
    deviceType: trail.deviceType ?? undefined,
  }).success

const isAlcoholIncomplete = (alcohol: AlcoholMonitoring): boolean =>
  !AlcoholMonitoringFormDataValidator.safeParse({
    monitoringType: alcohol.monitoringType ?? '',
    startDate: deserialiseDateTime(alcohol.startDate),
    endDate: deserialiseDateTime(alcohol.endDate),
  }).success

const isZoneIncomplete = (
  zone: EnforcementZone,
  zoneType: AddToListEnforcementZoneTypes,
  org: NotifyingOrganisation | null,
): boolean =>
  !EnforcementZoneAddToListFormDataValidator(org, zoneType).safeParse({
    zoneId: zone.zoneId,
    startDate: deserialiseDateTime(zone.startDate),
    endDate: deserialiseDateTime(zone.endDate),
    name: zone.name ?? '',
    description: zone.description ?? '',
    duration: zone.duration ?? '',
  }).success

const isAttendanceIncomplete = (attendance: AttendanceMonitoring): boolean => {
  const [startTimeHours, startTimeMinutes] = deserialiseTime(attendance.startTime)
  const [endTimeHours, endTimeMinutes] = deserialiseTime(attendance.endTime)

  return !AttendanceMonitoringAddToListFormDataValidator.safeParse({
    id: attendance.id ?? null,
    startDate: deserialiseDateTime(attendance.startDate),
    endDate: deserialiseDateTime(attendance.endDate),
    purpose: attendance.purpose ?? '',
    appointmentDay: attendance.appointmentDay ?? '',
    addressLine1: attendance.addressLine1 ?? '',
    addressLine2: attendance.addressLine2 ?? '',
    addressLine3: attendance.addressLine3 ?? '',
    addressLine4: attendance.addressLine4 ?? '',
    postcode: attendance.postcode ?? '',
    startTimeHours,
    startTimeMinutes,
    endTimeHours,
    endTimeMinutes,
  }).success
}

const zoneTypeFor = (zone: EnforcementZone): AddToListEnforcementZoneTypes | null => {
  if (zone.zoneType === 'EXCLUSION') return 'exclusion'
  if (zone.zoneType === 'RESTRICTION') return 'restriction'
  return null
}

export const hasIncompleteMonitoringTypes = (order: Order): boolean => {
  const org = order.interestedParties?.notifyingOrganisation ?? null

  return (
    (!!order.curfewConditions && isCurfewIncomplete(order.curfewConditions, org)) ||
    (!!order.monitoringConditionsTrail && isTrailIncomplete(order.monitoringConditionsTrail, org)) ||
    (!!order.monitoringConditionsAlcohol && isAlcoholIncomplete(order.monitoringConditionsAlcohol)) ||
    (order.enforcementZoneConditions ?? []).some(zone => {
      const zoneType = zoneTypeFor(zone)
      return zoneType !== null && isZoneIncomplete(zone, zoneType, org)
    }) ||
    (order.mandatoryAttendanceConditions ?? []).some(isAttendanceIncomplete)
  )
}

const getItems = (order: Order): Answer[] => {
  const items: Answer[] = []
  const orderId = order.id
  const org = order.interestedParties?.notifyingOrganisation ?? null

  if (order.curfewConditions) {
    items.push(
      withIncompleteTag(
        createAnswer(
          MONITORING_TYPE_NAMES.curfew,
          `From ${createDatePreview(order.curfewConditions.startDate)} to ${createDatePreview(order.curfewConditions.endDate)}`,
          paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', orderId),
          {
            deleteUri: paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE.replace(':orderId', orderId).replace(
              ':monitoringTypeId',
              order.curfewConditions.id!,
            ),
          },
        ),
        isCurfewIncomplete(order.curfewConditions, org),
      ),
    )
  }

  if (order.enforcementZoneConditions && order.enforcementZoneConditions.length > 0) {
    const exclusionZones = order.enforcementZoneConditions.filter(it => it.zoneType === 'EXCLUSION')
    exclusionZones.forEach(zone => {
      items.push(
        withIncompleteTag(
          createAnswer(
            MONITORING_TYPE_NAMES.exclusionZone,
            `${zone.name}<br>From ${createDatePreview(zone.startDate)} to ${createDatePreview(zone.endDate)}`,
            paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST.replace(':orderId', orderId)
              .replace(':zoneId', `${zone.zoneId}`)
              .replace(':zoneType', 'exclusion'),
            {
              deleteUri: paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE.replace(':orderId', orderId).replace(
                ':monitoringTypeId',
                zone.id!,
              ),
              valueType: 'html',
            },
          ),
          isZoneIncomplete(zone, 'exclusion', org),
        ),
      )
    })

    const restrictionZone = order.enforcementZoneConditions.filter(it => it.zoneType === 'RESTRICTION')

    restrictionZone.forEach(zone => {
      items.push(
        withIncompleteTag(
          createAnswer(
            MONITORING_TYPE_NAMES.restrictionZone,
            `${zone.name}<br>From ${createDatePreview(zone.startDate)} to ${createDatePreview(zone.endDate)}`,
            paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST.replace(':orderId', orderId)
              .replace(':zoneId', `${zone.zoneId}`)
              .replace(':zoneType', 'restriction'),
            {
              deleteUri: paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE.replace(':orderId', orderId).replace(
                ':monitoringTypeId',
                zone.id!,
              ),
              valueType: 'html',
            },
          ),
          isZoneIncomplete(zone, 'restriction', org),
        ),
      )
    })
  }

  if (order.monitoringConditionsTrail) {
    items.push(
      withIncompleteTag(
        createAnswer(
          MONITORING_TYPE_NAMES.trail,
          `From ${createDatePreview(order.monitoringConditionsTrail.startDate)} to ${createDatePreview(order.monitoringConditionsTrail.endDate)}`,
          paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', orderId),
          {
            deleteUri: paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE.replace(':orderId', orderId).replace(
              ':monitoringTypeId',
              order.monitoringConditionsTrail.id!,
            ),
          },
        ),
        isTrailIncomplete(order.monitoringConditionsTrail, org),
      ),
    )
  }

  if (order.mandatoryAttendanceConditions && order.mandatoryAttendanceConditions.length > 0) {
    order.mandatoryAttendanceConditions.forEach(attendance => {
      items.push(
        withIncompleteTag(
          createAnswer(
            MONITORING_TYPE_NAMES.mandatoryAttendance,
            `${attendance.purpose}<br>From ${createDatePreview(attendance.startDate)} to ${createDatePreview(attendance.endDate)}`,
            paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM_ADD_TO_LIST.replace(':orderId', orderId).replace(
              ':conditionId',
              `${attendance.id}`,
            ),

            {
              deleteUri: paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE.replace(':orderId', orderId).replace(
                ':monitoringTypeId',
                attendance.id!,
              ),
              valueType: 'html',
            },
          ),
          isAttendanceIncomplete(attendance),
        ),
      )
    })
  }

  if (order.monitoringConditionsAlcohol) {
    items.push(
      withIncompleteTag(
        createAnswer(
          MONITORING_TYPE_NAMES.alcohol,
          `From ${createDatePreview(order.monitoringConditionsAlcohol.startDate)} to ${createDatePreview(order.monitoringConditionsAlcohol.endDate)}`,
          paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', orderId),
          {
            deleteUri: paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE.replace(':orderId', orderId).replace(
              ':monitoringTypeId',
              order.monitoringConditionsAlcohol.id!,
            ),
          },
        ),
        isAlcoholIncomplete(order.monitoringConditionsAlcohol),
      ),
    )
  }

  return items
}

const constructModel = (order: Order, errors: ValidationResult): TypesOfMonitoringNeededModel => {
  const ineligibleErrors = getIneligibleMonitoringConditionsErrors(order)
  const hasIncompleteItems = hasIncompleteMonitoringTypes(order)
  const model: TypesOfMonitoringNeededModel = {
    items: getItems(order),
    addAnother: {
      value: '',
    },
    errorSummary: null,
    ineligibleErrors,
    hasIncompleteItems,
    continueDisabled: ineligibleErrors.length > 0 || hasIncompleteItems,
    draftDisabled: ineligibleErrors.length > 0 || hasIncompleteItems,
  }

  if (errors && errors.length) {
    model.addAnother!.error = getError(errors, 'addAnother')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
