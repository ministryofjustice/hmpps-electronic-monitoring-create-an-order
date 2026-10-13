import { getMockOrder } from '../../../test/mocks/mockOrder'
import createViewModel from './additionalDocumentsCheckAnswers'
import getContent from '../../i18n'

describe('additional documents check answers', () => {
  it('shows blank answers when questions are not answered on a court variation', () => {
    const order = getMockOrder({
      type: 'VARIATION',
      interestedParties: { ...getMockOrder().interestedParties!, notifyingOrganisation: 'CIVIL_COUNTY_COURT' },
      orderParameters: { haveCourtOrder: undefined, havePhoto: undefined },
    })

    const [courtOrderAnswer, photoAnswer] = createViewModel(order, getContent('en', 'DDV7'))

    expect(courtOrderAnswer.value.text).toBe('')
    expect(photoAnswer.value.text).toBe('')
  })

  it('shows No when questions are answered false on a court variation', () => {
    const order = getMockOrder({
      type: 'VARIATION',
      interestedParties: { ...getMockOrder().interestedParties!, notifyingOrganisation: 'CIVIL_COUNTY_COURT' },
      orderParameters: { haveCourtOrder: false, havePhoto: false },
    })

    const [courtOrderAnswer, photoAnswer] = createViewModel(order, getContent('en', 'DDV7'))

    expect(courtOrderAnswer.value.text).toBe('No')
    expect(photoAnswer.value.text).toBe('No')
  })
})
