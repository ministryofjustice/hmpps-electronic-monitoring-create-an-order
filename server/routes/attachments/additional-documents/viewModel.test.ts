import { getMockOrder } from '../../../../test/mocks/mockOrder'
import createViewModel from './viewModel'
import getContent from '../../../i18n'

describe('additional documents check answers', () => {
  it('does not show the court order upload question for a court order', () => {
    const order = getMockOrder({
      interestedParties: { ...getMockOrder().interestedParties!, notifyingOrganisation: 'FAMILY_COURT' },
      orderParameters: { haveCourtOrder: true, havePhoto: false },
    })

    const answers = createViewModel(order, getContent('en', 'DDV7'))

    expect(answers.map(answer => answer.key.text)).toEqual(['Do you have a photo to upload?'])
    expect(answers[0].value.text).toBe('No')
  })

  it('does not show a court order question on a court variation', () => {
    const order = getMockOrder({
      type: 'VARIATION',
      interestedParties: { ...getMockOrder().interestedParties!, notifyingOrganisation: 'CIVIL_COUNTY_COURT' },
      orderParameters: { haveCourtOrder: true, havePhoto: undefined },
    })

    const answers = createViewModel(order, getContent('en', 'DDV7'))

    expect(answers.map(answer => answer.key.text)).toEqual(['Do you have a photo to upload?'])
    expect(answers[0].value.text).toBe('')
  })

  it('shows the photo answer on a court variation', () => {
    const order = getMockOrder({
      type: 'VARIATION',
      interestedParties: { ...getMockOrder().interestedParties!, notifyingOrganisation: 'CIVIL_COUNTY_COURT' },
      orderParameters: { haveCourtOrder: false, havePhoto: false },
    })

    const answers = createViewModel(order, getContent('en', 'DDV7'))

    expect(answers.map(answer => answer.key.text)).toEqual(['Do you have a photo to upload?'])
    expect(answers[0].value.text).toBe('No')
  })
})
