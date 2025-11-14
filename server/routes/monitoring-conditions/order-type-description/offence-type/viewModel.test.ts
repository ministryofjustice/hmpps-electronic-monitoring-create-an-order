import { validationErrors } from '../../../../constants/validationErrors'
import { ValidationResult } from '../../../../models/Validation'
import { MonitoringConditions } from '../model'
import constructModel, { OffenceTypeViewModel } from './viewModel'

describe('offence type view model', () => {
  const data: MonitoringConditions = {
    offenceType: 'some offence type',
  }

  const errors: ValidationResult = [
    { error: validationErrors.monitoringConditions.offenceTypeRequired, field: 'offenceType' },
  ]

  it('without errors', () => {
    const result = constructModel(data, [])

    const expected: OffenceTypeViewModel = {
      offenceType: { value: 'some offence type' },
      items: [
        {
          value: 'Burglary in a Dwelling - Indictable only',
          text: 'Burglary in a Dwelling - Indictable only',
        },
        {
          value: 'Burglary in a Dwelling - Triable either way',
          text: 'Burglary in a Dwelling - Triable either way',
        },
        {
          value: 'Aggravated Burglary in a Dwelling',
          text: 'Aggravated Burglary in a Dwelling',
        },
        {
          value: 'Burglary in a Building other than a Dwelling - Indictable only',
          text: 'Burglary in a Building other than a Dwelling - Indictable only',
        },
        {
          value: 'Burglary in a Building other than a Dwelling - Triable either way',
          text: 'Burglary in a Building other than a Dwelling - Triable either way',
        },
        {
          value: 'Aggravated Burglary in a Building not a Dwelling',
          text: 'Aggravated Burglary in a Building not a Dwelling',
        },
        {
          value: 'Theft from the Person of Another',
          text: 'Theft from the Person of Another',
        },
        {
          value: 'Theft from a Vehicle',
          text: 'Theft from a Vehicle',
        },
        {
          value: 'Theft from a Motor Vehicle (excl. aggravated vehicle taking) - Triable either way (MOT)',
          text: 'Theft from a Motor Vehicle (excl. aggravated vehicle taking) - Triable either way (MOT)',
        },
        {
          value: 'Robbery',
          text: 'Robbery',
        },
      ],
      errorSummary: null,
    }

    expect(result).toEqual(expected)
  })

  it('with errors', () => {
    const result = constructModel(data, errors)

    const expected: Partial<OffenceTypeViewModel> = {
      offenceType: {
        value: 'some offence type',
        error: { text: validationErrors.monitoringConditions.offenceTypeRequired },
      },
      errorSummary: {
        errorList: [{ href: '#offenceType', text: validationErrors.monitoringConditions.offenceTypeRequired }],
        titleText: 'There is a problem',
      },
    }

    expect(result).toEqual(expect.objectContaining(expected))
  })
})
