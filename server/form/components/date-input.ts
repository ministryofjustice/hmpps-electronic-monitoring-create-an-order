type DateInput = {
  type: 'date-input'
  id: string
  text: string
  hint?: string
  value: {
    day: string
    month: string
    year: string
  }
}

export default DateInput
