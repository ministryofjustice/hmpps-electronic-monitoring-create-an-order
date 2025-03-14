import { ErrorSummary } from '../../utils/govukFrontEndTypes/errorSummary'

export type ErrorMessage = {
  text: string
}

export type FormField = {
  error?: ErrorMessage
}

export type TextField = FormField & {
  value: string
}

export type Address = {
  line1: string
  line2: string
  line3: string
  line4: string
  postcode: string
}

export type AddressField = FormField & {
  value: Address
}

export type Time = {
  hours: string
  minutes: string
}

export type TimeField = FormField & {
  value: Time
}

export type TimeSpan = {
  startHours: string
  startMinutes: string
  endHours: string
  endMinutes: string
}

export type TimeSpanField = FormField & {
  value: TimeSpan
}

export type Date = {
  day: string
  month: string
  year: string
}

export type DateField = FormField & {
  value: Date
}

export type DateTimeField = FormField & {
  value: Date & Time
  dateError?: ErrorMessage
  timeError?: ErrorMessage
}

export type MultipleChoiceField = FormField & {
  values: Array<string>
}

export type ViewModel<T> = {
  errorSummary: ErrorSummary | null
} & {
  [K in keyof T]: T[K] extends Date ? DateField : T[K] extends string[] ? MultipleChoiceField : TextField
}

export type ErrorsViewModel = {
  [field: string]: ErrorMessage
}
