export type ErrorMessage = {
  text: string
}

export type FormField = {
  value?: string
  values?: Array<string>
  error?: ErrorMessage
}
