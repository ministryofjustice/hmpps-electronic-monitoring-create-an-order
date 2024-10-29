import DateValidator from './dateValidator'

describe('DateValidator', () => {
  it('returns true for valid dates', () => {
    ;[
      ['24', '10', '2024'],
      ['1', '1', '1965'],
      ['01', '01', '1965'],
      ['31', '7', '2030'],
    ].forEach(input => {
      const isValid = DateValidator.isValidDateFormat(input[0], input[1], input[2], 'date')
      expect(isValid.result).toBe(true)
    })
  })

  it('treats empty input for all fields as valid', () => {
    const isValid = DateValidator.isValidDateFormat('', '', '', 'date')
    expect(isValid).toEqual({ result: true })
  })

  it('returns false for invalid dates', () => {
    ;[
      ['32', '10', '2024'],
      ['1', '13', '1965'],
      ['01', '7', '1000'],
      ['q', 'q', 'q'],
      ['1', '', ''],
      ['q', '', ''],
    ].forEach(input => {
      const isValid = DateValidator.isValidDateFormat(input[0], input[1], input[2], 'date')
      expect(isValid.result).toBe(false)
      expect(isValid.error?.field).toBe('date')
      expect(isValid.error?.error).toBe(
        'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
      )
    })
  })
})
