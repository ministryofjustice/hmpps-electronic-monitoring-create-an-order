import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { Order } from '../../../models/Order'
import { getError } from '../../../utils/utils'
import { createAnswer, createDatePreview, Answer } from '../../../utils/checkYourAnswers'
import paths from '../../../constants/paths'

type MonitoringTypeSummaryItem = Answer

export type TypesOfMonitoringNeededModel = ViewModel<unknown> & {
  items: MonitoringTypeSummaryItem[]
  addAnother: { value: string; error?: { text: string } }
}

const MONITORING_TYPE_NAMES = {
  curfew: 'Curfew',
  exclusionZone: 'Exclusion zone monitoring',
  trail: 'Trail monitoring',
  mandatoryAttendance: 'Mandatory attendance monitoring',
  alcohol: 'Alcohol monitoring',
}

const getItems = (order: Order): Answer[] => {
  const items: Answer[] = []
  const orderId = order.id

  if (order.curfewConditions) {
    items.push(
      createAnswer(
        MONITORING_TYPE_NAMES.curfew,
        `From ${createDatePreview(order.curfewConditions.startDate)} to ${createDatePreview(order.curfewConditions.endDate)}`,
        paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', orderId),
      ),
    )
  }

  if (order.enforcementZoneConditions && order.enforcementZoneConditions.length > 0) {
    order.enforcementZoneConditions.forEach(zone => {
      items.push(
        createAnswer(
          MONITORING_TYPE_NAMES.exclusionZone,
          `From ${createDatePreview(zone.startDate)} to ${createDatePreview(zone.endDate)}`,
          paths.MONITORING_CONDITIONS.ZONE.replace(':orderId', orderId).replace(':zoneId', '0'),
        ),
      )
    })
  }

  if (order.monitoringConditionsTrail) {
    items.push(
      createAnswer(
        MONITORING_TYPE_NAMES.trail,
        `From ${createDatePreview(order.monitoringConditionsTrail.startDate)} to ${createDatePreview(order.monitoringConditionsTrail.endDate)}`,
        paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', orderId),
      ),
    )
  }

  if (order.mandatoryAttendanceConditions && order.mandatoryAttendanceConditions.length > 0) {
    order.mandatoryAttendanceConditions.forEach(attendance => {
      items.push(
        createAnswer(
          MONITORING_TYPE_NAMES.mandatoryAttendance,
          `From ${createDatePreview(attendance.startDate)} to ${createDatePreview(attendance.endDate)}`,
          paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', orderId),
        ),
      )
    })
  }

  if (order.monitoringConditionsAlcohol) {
    items.push(
      createAnswer(
        MONITORING_TYPE_NAMES.alcohol,
        `From ${createDatePreview(order.monitoringConditionsAlcohol.startDate)} to ${createDatePreview(order.monitoringConditionsAlcohol.endDate)}`,
        paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', orderId),
      ),
    )
  }

  return items
}

const constructModel = (order: Order, errors: ValidationResult): TypesOfMonitoringNeededModel => {
  const model: TypesOfMonitoringNeededModel = {
    items: getItems(order),
    addAnother: {
      value: '',
    },
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.addAnother!.error = getError(errors, 'addAnother')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
