import { getMockOrder } from '../../../../test/mocks/mockOrder'
import viewModel from './viewModel'

describe('offence other information view model', () => {
  it('shows No when it was explicitly saved', () => {
    const order = getMockOrder({
      offenceAdditionalDetails: { id: 'saved-offence-details-id', additionalDetails: '' },
    })

    const result = viewModel.construct(order, undefined, [])

    expect(result.hasOtherInformation.value).toBe('no')
    expect(result.otherInformationDetails.value).toBe('')
  })

  it.each([undefined, null, '', '   '])('leaves the answer blank when GET details are %s', additionalDetails => {
    const order = getMockOrder({
      offenceAdditionalDetails: additionalDetails === undefined ? null : { additionalDetails },
    })

    const result = viewModel.construct(order, undefined, [])

    expect(result.hasOtherInformation.value).toBe('')
    expect(result.otherInformationDetails.value).toBe('')
  })

  it('shows Yes when GET returns offence details', () => {
    const order = getMockOrder({ offenceAdditionalDetails: { additionalDetails: 'More context' } })

    const result = viewModel.construct(order, undefined, [])

    expect(result.hasOtherInformation.value).toBe('yes')
    expect(result.otherInformationDetails.value).toBe('More context')
  })
})
