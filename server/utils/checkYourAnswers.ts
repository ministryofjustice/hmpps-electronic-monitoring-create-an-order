import { isNullOrUndefined, convertBooleanToEnum, createAddressPreview } from './utils'
import { Address } from '../models/Address'

type Optional<T> = T | null | undefined

type Action = {
  href: string
  text: string
  visuallyHiddenText: string
}

type Answer = {
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

export const createTextAnswer = (key: string, value: Optional<string>, uri: string): Answer => {
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

export const createHtmlAnswer = (key: string, value: Optional<string>, uri: string): Answer => {
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

const createDatePreview = (value: Optional<string>) =>
  isNullOrUndefined(value) ? '' : new Date(value).toLocaleDateString()

const createTimePreview = (value: Optional<string>) =>
  isNullOrUndefined(value) ? '' : new Date(value).toLocaleTimeString()

export const createDateAnswer = (key: string, value: Optional<string>, uri: string): Answer =>
  createTextAnswer(key, createDatePreview(value), uri)

export const createTimeAnswer = (key: string, value: Optional<string>, uri: string): Answer =>
  createTextAnswer(key, createTimePreview(value), uri)

export const createBooleanAnswer = (key: string, value: boolean | null, uri: string): Answer =>
  createTextAnswer(key, convertBooleanToEnum(value, '', 'Yes', 'No'), uri)

export const createMultipleChoiceAnswer = (key: string, values: Array<string>, uri: string): Answer =>
  createHtmlAnswer(key, values.join('<br/>'), uri)

const createTimeRangePreview = (from: Optional<string>, to: Optional<string>) =>
  isNullOrUndefined(from) && isNullOrUndefined(to)
    ? ''
    : `${isNullOrUndefined(from) ? '' : from} - ${isNullOrUndefined(to) ? '' : to}`

export const createTimeRangeAnswer = (key: string, from: Optional<string>, to: Optional<string>, uri: string): Answer =>
  createTextAnswer(key, createTimeRangePreview(from, to), uri)

export const createMultipleAddressAnswer = (key: string, values: Array<Address>, uri: string): Answer =>
  createMultipleChoiceAnswer(key, isNullOrUndefined(values) ? [] : values.map(createAddressPreview), uri)

export const createAddressAnswer = (key: string, value: Optional<Address>, uri: string): Answer =>
  createMultipleAddressAnswer(key, isNullOrUndefined(value) ? [] : [value], uri)
