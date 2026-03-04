import getContent from '../../../i18n'
import ViewModel from './viewModel'

describe('view model', () => {
  describe('address type is device wearer', () => {
    const content = getContent('en', 'DDV6')
    it('content has correct headings', () => {
      const model = ViewModel.construct(content)

      expect(model.content).toEqual({
        section: 'About the device wearer',
        title: "Find the device wearer's address",
        legend: '',
        helpText: '',
        questions: expect.anything(),
      })
    })

    it('content has correct questions', () => {
      const model = ViewModel.construct(content)

      expect(model.content.questions).toEqual({
        postcode: {
          text: 'Postcode',
          hint: 'For example, AA3 1AB',
        },
        buildingId: {
          text: 'Building number or name (optional)',
          hint: 'For example, 15 or Prospect Cottage',
        },
      })
    })
  })
})
