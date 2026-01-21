import { DapoFormValidator } from './formModel'

describe('dapo form model', () => {
  describe('validator', () => {
    const validator = DapoFormValidator
    it('accepts valid data', () => {
      const data = {
        clause: 'some clause',
        date: {
          year: '2024',
          month: '1',
          day: '1',
          hours: '0',
          minutes: '0',
        },
      }

      const result = validator.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('error if clause is empty', () => {
      const data = {
        clause: '',
        date: {
          year: '2024',
          month: '1',
          day: '1',
          hours: '0',
          minutes: '0',
        },
      }

      const result = validator.safeParse(data)

      expect(result.success).toBe(false)
      const error = result.error?.errors[0]
      expect(error?.message).toBe('Enter a DAPO order clause number')
      expect(error?.path[0]).toBe('clause')
    })

    it('errors if date is incorrect', () => {
      const data = {
        clause: 'some clause',
        date: {
          year: '',
          month: '',
          day: '',
          hours: '0',
          minutes: '0',
        },
      }

      const result = validator.safeParse(data)

      expect(result.success).toBe(false)
      const error = result.error?.errors[0]
      expect(error?.message).toBe('Enter date of DAPO requirement')
    })
  })
})
