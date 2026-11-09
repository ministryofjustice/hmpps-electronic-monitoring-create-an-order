import { createDeviceWearer, createInterestedParties, getMockOrder } from '../../../../test/mocks/mockOrder'
import paths from '../../../constants/paths'
import getContent from '../../../i18n'
import { NotifyingOrganisation } from '../../../models/NotifyingOrganisation'
import createViewModel from './viewModel'

const QUESTION = 'Is a responsible adult required?'

const responsibleAdultQuestionRow = (
  notifyingOrganisation: NotifyingOrganisation,
  adultAtTimeOfInstallation: boolean | null,
) => {
  const order = getMockOrder({
    interestedParties: createInterestedParties({ notifyingOrganisation }),
    deviceWearer: createDeviceWearer({ adultAtTimeOfInstallation }),
  })
  const row = createViewModel(order, getContent('en', 'DDV5'), true).deviceWearer.find(
    answer => answer.key.text === QUESTION,
  )
  return { order, row }
}

describe('device wearer check your answers view model', () => {
  it.each([undefined, null, '', '   '])('does not show an empty unlisted description: %p', otherDisability => {
    const order = getMockOrder({
      deviceWearer: createDeviceWearer({ disabilities: ['OTHER'], otherDisability }),
    })

    const rows = createViewModel(order, getContent('en', 'DDV5'), true).deviceWearer

    expect(rows.some(answer => answer.key.text === "What is the device wearer's disability or health condition?")).toBe(
      false,
    )
  })

  it('retains a saved unlisted description', () => {
    const order = getMockOrder({
      deviceWearer: createDeviceWearer({ disabilities: ['OTHER'], otherDisability: 'Broken arm' }),
    })

    const rows = createViewModel(order, getContent('en', 'DDV5'), true).deviceWearer

    expect(
      rows.find(answer => answer.key.text === "What is the device wearer's disability or health condition?")?.value,
    ).toEqual({ text: 'Broken arm' })
  })

  it('lists answers in the order the questions are asked', () => {
    const order = getMockOrder({
      interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }),
    })
    const rows = createViewModel(order, getContent('en', 'DDV5'), true).deviceWearer

    expect(rows.map(answer => answer.key.text)).toEqual([
      "What is the device wearer's first name?",
      "What is the device wearer's middle name? (optional)",
      "What is the device wearer's last name?",
      "What is the device wearer's preferred name or names? (optional)",
      "What is the device wearer's date of birth?",
      'What is the sex of the device wearer?',
      "What is the device wearer's gender?",
      'Does the device wearer have any of the disabilities or health conditions listed?',
      'Is an interpreter needed?',
      'What language does the interpreter need to use?',
      QUESTION,
    ])
  })

  it('does not show a stale unlisted description when OTHER is not selected', () => {
    const order = getMockOrder({
      deviceWearer: createDeviceWearer({ disabilities: ['VISION'], otherDisability: 'Previous description' }),
    })

    const rows = createViewModel(order, getContent('en', 'DDV5'), true).deviceWearer

    expect(rows.some(answer => answer.key.text === "What is the device wearer's disability or health condition?")).toBe(
      false,
    )
  })

  describe('responsible adult question', () => {
    it.each<NotifyingOrganisation>(['YOUTH_CUSTODY_SERVICE', 'YOUTH_COURT', 'PRISON'])(
      'is shown for %s orders and links to the responsible adult question page',
      notifyingOrganisation => {
        const { order, row } = responsibleAdultQuestionRow(notifyingOrganisation, false)

        expect(row?.value).toEqual({ text: 'Yes' })
        expect(row?.actions?.items[0].href).toEqual(
          paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION.replace(':orderId', order.id),
        )
      },
    )

    it('shows No when the device wearer is an adult', () => {
      const { row } = responsibleAdultQuestionRow('PRISON', true)

      expect(row?.value).toEqual({ text: 'No' })
    })

    it.each<NotifyingOrganisation>(['PROBATION', 'HOME_OFFICE', 'CROWN_COURT', 'FAMILY_COURT', 'MAGISTRATES_COURT'])(
      'is not shown for %s orders',
      notifyingOrganisation => {
        expect(responsibleAdultQuestionRow(notifyingOrganisation, true).row).toBeUndefined()
      },
    )
  })
})
