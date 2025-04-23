import { isNullOrUndefined, convertBooleanToEnum, createAddressPreview } from './utils'
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

interface AnswerBuilderI {
  setKey(key: string): AnswerBuilder
  setTextValue(value: Optional<string>): AnswerBuilder
  setHtmlValue(value: Optional<string>): AnswerBuilder
  addAction(uri: string): AnswerBuilder
  getAnswer(): Answer
}

export class AnswerBuilder implements AnswerBuilderI {
  private answer: Answer

  constructor() {
    this.answer = {
      key: {
        text: '',
      },
      value: {},
      actions: {
        items: [],
      },
    }
  }

  private reset() {
    this.answer = {
      key: {
        text: '',
      },
      value: {},
      actions: {
        items: [],
      },
    }
  }

  public setKey(key: string): AnswerBuilder {
    this.answer.key.text = key
    return this
  }

  public setTextValue(value: Optional<string>): AnswerBuilder {
    if (this.answer.value.html) {
      throw new Error('Cannot set value text when value html is already set')
    }
    this.answer.value.text = isNullOrUndefined(value) ? '' : value
    return this
  }

  public setHtmlValue(value: Optional<string>): AnswerBuilder {
    if (this.answer.value.text) {
      throw new Error('Cannot set value html when value text is already set')
    }
    this.answer.value.html = isNullOrUndefined(value) ? '' : value
    return this
  }

  public addAction(uri: string): AnswerBuilder {
    this.answer.actions.items.push({
      href: uri,
      text: 'Change',
      visuallyHiddenText: this.answer.key.text.toLowerCase(),
    })
    return this
  }

  public getAnswer(): Answer {
    const result = this.answer
    this.reset()
    return result
  }
}

export default Answer
export const createTextAnswer = (key: string, value: Optional<string>, uri: string): Answer => {
  return new AnswerBuilder().setKey(key).setTextValue(value).addAction(uri).getAnswer()
}

export const createTextAnswerWithoutActions = (key: string, value: Optional<string>): Answer => {
  return new AnswerBuilder().setKey(key).setTextValue(value).getAnswer()
}

export const createHtmlAnswer = (key: string, value: Optional<string>, uri: string): Answer => {
  return new AnswerBuilder().setKey(key).setHtmlValue(value).addAction(uri).getAnswer()
}

export const createHtmlAnswerWithoutActions = (key: string, value: Optional<string>): Answer => {
  return new AnswerBuilder().setKey(key).setHtmlValue(value).getAnswer()
}

const createDatePreview = (value: Optional<string>) =>
  isNullOrUndefined(value) ? '' : new Date(value).toLocaleDateString('en-GB')

const createTimePreview = (value: Optional<string>) =>
  isNullOrUndefined(value) ? '' : new Date(value).toLocaleTimeString('en-GB')

export const createDateAnswer = (key: string, value: Optional<string>, uri: string): Answer =>
  createTextAnswer(key, createDatePreview(value), uri)

export const createTimeAnswer = (key: string, value: Optional<string>, uri: string): Answer =>
  createTextAnswer(key, createTimePreview(value), uri)

export const createBooleanAnswer = (key: string, value: boolean | null, uri: string): Answer =>
  createTextAnswer(key, convertBooleanToEnum(value, '', 'Yes', 'No'), uri)

export const createMultipleChoiceAnswer = (key: string, values: Array<string>, uri: string): Answer =>
  createHtmlAnswer(key, values.join('<br/>'), uri)

export const createMultipleChoiceAnswerWithoutActions = (key: string, values: Array<string>): Answer =>
  createHtmlAnswerWithoutActions(key, values.join('<br/>'))

const createTimeRangePreview = (from: Optional<string>, to: Optional<string>) =>
  isNullOrUndefined(from) && isNullOrUndefined(to)
    ? ''
    : `${isNullOrUndefined(from) ? '' : from} - ${isNullOrUndefined(to) ? '' : to}`

export const createTimeRangeAnswer = (key: string, from: Optional<string>, to: Optional<string>, uri: string): Answer =>
  createTextAnswer(key, createTimeRangePreview(from, to), uri)

export const createMultipleAddressAnswer = (key: string, values: Array<AddressWithoutType>, uri: string): Answer =>
  createMultipleChoiceAnswer(key, isNullOrUndefined(values) ? [] : values.map(createAddressPreview), uri)

export const createAddressAnswer = (key: string, value: Optional<AddressWithoutType>, uri: string): Answer =>
  createMultipleAddressAnswer(key, isNullOrUndefined(value) ? [] : [value], uri)
