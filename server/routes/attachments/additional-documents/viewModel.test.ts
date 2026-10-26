import { createInterestedParties, createMonitoringConditions, getMockOrder } from '../../../../test/mocks/mockOrder'
import createViewModel from './viewModel'
import getContent from '../../../i18n'
import { Order } from '../../../models/Order'
import AttachmentType from '../../../models/AttachmentType'

const content = getContent('en', 'DDV7')
const licence = { id: 'licence-id', orderId: 'order-id', fileName: 'licence.pdf', fileType: AttachmentType.LICENCE }

const probationChange = (startDate: string, overrides: Partial<Order> = {}) =>
  getMockOrder({
    type: 'VARIATION',
    interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
    monitoringConditions: createMonitoringConditions({ startDate }),
    ...overrides,
  })

const pastDatedProbationChange = (overrides: Partial<Order> = {}) =>
  probationChange('2020-01-01T00:00:00.000Z', overrides)

const answer = (answers: ReturnType<typeof createViewModel>, key: string) => answers.find(a => a.key.text === key)

describe('additional documents check answers', () => {
  describe('past-dated probation change', () => {
    it('shows No and no document when a new document is not needed', () => {
      const order = pastDatedProbationChange({ orderParameters: { haveLicence: false, havePhoto: false } })

      const answers = createViewModel(order, content)

      expect(answers.map(a => a.key.text)).toEqual([
        'Do you need to upload a new document?',
        'Do you have a photo to upload?',
      ])
      expect(answers[0].value.text).toBe('No')
      expect(answers[0].actions?.items[0].href).toBe(`/order/${order.id}/attachments/new-document`)
    })

    it('shows a blank answer when the question has not been answered', () => {
      const order = pastDatedProbationChange({ orderParameters: { haveLicence: null, havePhoto: false } })

      const answers = createViewModel(order, content)

      expect(answer(answers, 'Do you need to upload a new document?')?.value.text).toBe('')
    })

    it('shows Yes and the uploaded licence when a new document is needed', () => {
      const order = pastDatedProbationChange({
        orderParameters: { haveLicence: true, havePhoto: false },
        additionalDocuments: [licence],
      })

      const answers = createViewModel(order, content)

      expect(answers.map(a => a.key.text)).toEqual([
        'Do you need to upload a new document?',
        'Upload a copy of the licence or court order document',
        'Do you have a photo to upload?',
      ])
      expect(answers[0].value.text).toBe('Yes')
      expect(answers[1].value.html).toContain('licence.pdf')
    })

    it('uses recall document wording for a revocation', () => {
      const order = pastDatedProbationChange({
        type: 'REVOCATION',
        orderParameters: { haveLicence: true, havePhoto: false },
        additionalDocuments: [licence],
      })

      const answers = createViewModel(order, content)

      expect(answer(answers, 'Upload a copy of the recall document')?.value.html).toContain('licence.pdf')
    })
  })

  it('shows only the licence for a submitted probation change that had not started when submitted', () => {
    const order = pastDatedProbationChange({
      status: 'SUBMITTED',
      orderParameters: { haveLicence: null, havePhoto: false },
      additionalDocuments: [licence],
    })

    const answers = createViewModel(order, content)

    expect(answers.map(a => a.key.text)).toEqual([
      'Upload a copy of the licence or court order document',
      'Do you have a photo to upload?',
    ])
  })

  it('shows only the licence for a probation change that has not started yet', () => {
    const order = probationChange('2099-01-01T00:00:00.000Z', {
      orderParameters: { haveLicence: null, havePhoto: false },
      additionalDocuments: [licence],
    })

    const answers = createViewModel(order, content)

    expect(answers.map(a => a.key.text)).toEqual([
      'Upload a copy of the licence or court order document',
      'Do you have a photo to upload?',
    ])
  })

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
