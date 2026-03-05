import { FindAddressValidator } from './formModel'

describe('validator', () => {
  it('no errors if postcode is valid', () => {
    const data = { action: 'continue', postcode: 'sa11 1aa' }

    const result = FindAddressValidator.safeParse(data)

    expect(result.success).toBe(true)
  })

  it('errors if no postcode', () => {
    const data = { action: 'continue', postcode: '' }

    const result = FindAddressValidator.safeParse(data)

    expect(result.success).toBe(false)
    expect(result.error?.errors[0].message).toBe('Enter the postcode')
  })
})
