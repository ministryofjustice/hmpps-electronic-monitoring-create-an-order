import { isNullOrUndefined, convertBooleanToEnum, convertToTitleCase } from '../../utils/utils'
import { Address } from '../Address'
import { CurfewSchedule, CurfewTimetable } from '../CurfewTimetable'

type Action = {
  href: string
  text: string
  visuallyHiddenText: string
}

export type Answer = {
  key: {
    text: string
  }
  value: {
    text?: string
    html?: string
  }
  actions: {
    items: Array<Action>
  }
}

export const createTextAnswer = (key: string, value: string | null | undefined, uri: string): Answer => {
  return {
    key: {
      text: key,
    },
    value: {
      text: isNullOrUndefined(value) ? '' : value,
    },
    actions: {
      items: [
        {
          href: uri,
          text: 'Change',
          visuallyHiddenText: key.toLowerCase(),
        },
      ],
    },
  }
}

export const createHtmlAnswer = (key: string, value: string | null, uri: string): Answer => {
  return {
    key: {
      text: key,
    },
    value: {
      html: isNullOrUndefined(value) ? '' : value,
    },
    actions: {
      items: [
        {
          href: uri,
          text: 'Change',
          visuallyHiddenText: key.toLowerCase(),
        },
      ],
    },
  }
}

export const createDateAnswer = (key: string, value: string | null | undefined, uri: string): Answer =>
  createTextAnswer(key, isNullOrUndefined(value) ? '' : new Date(value).toLocaleDateString(), uri)

export const createBooleanAnswer = (key: string, value: boolean | null, uri: string): Answer =>
  createTextAnswer(key, convertBooleanToEnum(value, '', 'Yes', 'No'), uri)

export const createMultipleChoiceAnswer = (key: string, values: Array<string>, uri: string): Answer =>
  createHtmlAnswer(key, values.join('<br/>'), uri)

export const createTimeRangeAnswer = (
  key: string,
  from: string | null | undefined,
  to: string | null | undefined,
  uri: string,
): Answer => {
  if (isNullOrUndefined(from) && isNullOrUndefined(to)) {
    return createTextAnswer(key, '', uri)
  }

  return createTextAnswer(key, `${isNullOrUndefined(from) ? '' : from} - ${isNullOrUndefined(to) ? '' : to}`, uri)
}

const createAddressPreview = (address: Address) =>
  `${address.addressLine1}, ${address.addressLine2}, ${address.postcode}`

export const createMultipleAddressAnswer = (key: string, values: Array<Address>, uri: string): Answer =>
  createMultipleChoiceAnswer(key, isNullOrUndefined(values) ? [] : values.map(createAddressPreview), uri)

export const createAddressAnswer = (key: string, value: Address | null | undefined, uri: string): Answer =>
  createMultipleAddressAnswer(key, isNullOrUndefined(value) ? [] : [value], uri)

const createSchedulePreview = (schedule: CurfewSchedule) =>
  `${convertToTitleCase(schedule.dayOfWeek)}: ${schedule.startTime} - ${schedule.endTime}, ${schedule.curfewAddress}`

export const createTimeTableAnswer = (key: string, values: CurfewTimetable | undefined, uri: string): Answer =>
  createMultipleChoiceAnswer(key, isNullOrUndefined(values) ? [] : values.map(createSchedulePreview), uri)
