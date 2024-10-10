export type ErrorMessage = {
  text: string
}

export type FormField = {
  error?: ErrorMessage
}

export type TextField = FormField & {
  value: string
}

export type DateField = FormField & {
  day: string
  month: string
  year: string
}

export type MultipleChoiceField = FormField & {
  values: Array<string>
}

export type ViewModel<T> = {
  [K in keyof T]: T[K] extends Date ? DateField : T[K] extends string[] ? MultipleChoiceField : TextField
}
