import { isNullOrUndefined, convertBooleanToEnum, createAddressPreview, trimSeconds } from './utils'
import { AddressWithoutType } from '../models/Address'

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

export default Answer

interface AnswerOptions {
  ignoreActions?: boolean
  valueType?: 'html' | 'text'
}

export const createAnswer = (key: string, value: Optional<string>, uri: string, opts: AnswerOptions = {}): Answer => {
  const answer: Answer = {
    key: {
      text: key,
    },
    value: {},
    actions: {
      items: [],
    },
  }

  if (opts.valueType === 'html') {
    answer.value.html = isNullOrUndefined(value) ? '' : value
  } else {
    answer.value.text = isNullOrUndefined(value) ? '' : value
  }

  if (opts.ignoreActions !== true) {
    answer.actions.items.push({
      href: uri,
      text: 'Change',
      visuallyHiddenText: key.toLowerCase(),
    })
  }

  return answer
}

const createDatePreview = (value: Optional<string>) =>
  isNullOrUndefined(value) ? '' : new Date(value).toLocaleDateString('en-GB')

const createTimePreview = (value: Optional<string>) =>
  isNullOrUndefined(value) ? '' : trimSeconds(new Date(value).toLocaleTimeString('en-GB'))

export const createDateAnswer = (key: string, value: Optional<string>, uri: string, opts: AnswerOptions = {}): Answer =>
  createAnswer(key, createDatePreview(value), uri, opts)

export const createTimeAnswer = (key: string, value: Optional<string>, uri: string, opts: AnswerOptions = {}): Answer =>
  createAnswer(key, createTimePreview(value), uri, opts)

export const createBooleanAnswer = (
  key: string,
  value: boolean | null,
  uri: string,
  opts: AnswerOptions = {},
): Answer => createAnswer(key, convertBooleanToEnum(value, '', 'Yes', 'No'), uri, opts)

export const createMultipleChoiceAnswer = (
  key: string,
  values: Array<string>,
  uri: string,
  opts: AnswerOptions = {},
): Answer => {
  return createAnswer(key, values.join('<br/>'), uri, { ...opts, valueType: 'html' })
}

const createTimeRangePreview = (from: Optional<string>, to: Optional<string>) =>
  isNullOrUndefined(from) && isNullOrUndefined(to)
    ? ''
    : `${isNullOrUndefined(from) ? '' : from} - ${isNullOrUndefined(to) ? '' : to}`

export const createTimeRangeAnswer = (
  key: string,
  from: Optional<string>,
  to: Optional<string>,
  uri: string,
  opts: AnswerOptions = {},
): Answer => createAnswer(key, createTimeRangePreview(from, to), uri, opts)

export const createMultipleAddressAnswer = (
  key: string,
  values: Array<AddressWithoutType>,
  uri: string,
  opts: AnswerOptions = {},
): Answer =>
  createMultipleChoiceAnswer(key, isNullOrUndefined(values) ? [] : values.map(createAddressPreview), uri, opts)

export const createAddressAnswer = (
  key: string,
  value: Optional<AddressWithoutType>,
  uri: string,
  opts: AnswerOptions = {},
): Answer => createMultipleAddressAnswer(key, isNullOrUndefined(value) ? [] : [value], uri, opts)
