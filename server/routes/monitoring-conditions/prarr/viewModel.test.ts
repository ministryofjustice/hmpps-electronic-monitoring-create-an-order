import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'
import { MonitoringConditions } from '../model'
import constructModel, { PrarrModel } from './viewModel'

describe('prarr view model', () => {
  const data: MonitoringConditions = {
    prarr: 'YES',
  }

  const errors: ValidationResult = [{ error: validationErrors.monitoringConditions.prarrRequired, field: 'prarr' }]

  it('without errors', () => {
    const result = constructModel(data, [])

    const expected: PrarrModel = {
      prarr: { value: 'YES', error: undefined },
      items: [
        {
          text: 'Yes',
          value: 'YES',
        },
        {
          text: 'No',
          value: 'NO',
        },
        {
          divider: 'or',
        },
        {
          text: 'Not able to provide this information',
          value: 'UNKNOWN',
        },
      ],
      errorSummary: null,
    }

    expect(result).toEqual(expected)
  })

  it('with errors', () => {
    const result = constructModel(data, errors)

    const expected: PrarrModel = {
      prarr: { value: 'YES', error: { text: validationErrors.monitoringConditions.prarrRequired } },
      items: [
        {
          text: 'Yes',
          value: 'YES',
        },
        {
          text: 'No',
          value: 'NO',
        },
        {
          divider: 'or',
        },
        {
          text: 'Not able to provide this information',
          value: 'UNKNOWN',
        },
      ],
      errorSummary: {
        errorList: [{ href: '#prarr', text: 'Select if the device wearer is being released on a P-RARR' }],
        titleText: 'There is a problem',
      },
    }

    expect(result).toEqual(expected)
  })
})
