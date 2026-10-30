import { createInterestedParties, getMockOrder } from '../../../test/mocks/mockOrder'
import paths from '../../constants/paths'
import { DeviceWearerCache } from './store/model'
import { findMissingAnswers, firstUnansweredPage, pageForErrors } from './deviceWearerPages'

const answered: DeviceWearerCache = {
  firstName: 'Jo',
  lastName: 'Bloggs',
  dateOfBirth: '1980-01-01T00:00:00.000Z',
  sex: 'MALE',
  gender: 'MALE',
  disabilities: ['VISION'],
  interpreterRequired: false,
  adultAtTimeOfInstallation: true,
}

const youthOrder = getMockOrder({
  id: '1',
  interestedParties: createInterestedParties({ notifyingOrganisation: 'YOUTH_COURT' }),
})
const probationOrder = getMockOrder({
  id: '1',
  interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
})

describe('deviceWearerPages', () => {
  it('finds no missing answers when every page is answered', () => {
    expect(findMissingAnswers(answered, youthOrder)).toEqual([])
    expect(firstUnansweredPage(answered, youthOrder)).toBeNull()
  })

  it('routes youth and prison orders to the responsible adult question when it is unanswered', () => {
    const answers = { ...answered, adultAtTimeOfInstallation: null }

    expect(firstUnansweredPage(answers, youthOrder)).toEqual(
      paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION.replace(':orderId', '1'),
    )
  })

  it('skips the responsible adult question for other orders', () => {
    const answers = { ...answered, adultAtTimeOfInstallation: null }

    expect(findMissingAnswers(answers, probationOrder)).toEqual([])
    expect(firstUnansweredPage(answers, probationOrder)).toBeNull()
  })

  it('routes to the first page with a missing answer, in page order', () => {
    const answers = { ...answered, disabilities: [], adultAtTimeOfInstallation: null }

    expect(firstUnansweredPage(answers, youthOrder)).toEqual(
      paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', '1'),
    )
  })

  it('treats an unanswered nullable question as missing', () => {
    expect(firstUnansweredPage({ ...answered, interpreterRequired: null }, youthOrder)).toEqual(
      paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', '1'),
    )
  })

  it('maps api errors back to the page that owns the field', () => {
    const page = pageForErrors([{ field: 'disabilities', error: 'x' }], youthOrder)

    expect(page).toEqual({
      path: paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', '1'),
      errors: [{ field: 'disabilities', error: 'x' }],
    })
    expect(pageForErrors([{ field: 'unknown', error: 'x' }], youthOrder)).toBeNull()
  })

  it('maps responsible adult question errors to its page only when the question is asked', () => {
    const errors = [{ field: 'adultAtTimeOfInstallation', error: 'x' }]

    expect(pageForErrors(errors, youthOrder)?.path).toEqual(
      paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION.replace(':orderId', '1'),
    )
    expect(pageForErrors(errors, probationOrder)).toBeNull()
  })

  it('routes otherDisability errors to the disabilities page', () => {
    expect(pageForErrors([{ field: 'otherDisability', error: 'x' }], youthOrder)).toEqual({
      path: paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', '1'),
      errors: [{ field: 'otherDisability', error: 'x' }],
    })
  })

  it.each([undefined, null, '', '   '])('requires a description for OTHER in the cache: %p', otherDisability => {
    const answers: DeviceWearerCache = { ...answered, disabilities: ['OTHER'], otherDisability }

    expect(findMissingAnswers(answers, youthOrder)).toEqual([
      { field: 'otherDisability', error: "Enter the device wearer's disability or health condition" },
    ])
    expect(firstUnansweredPage(answers, youthOrder)).toEqual(
      paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', '1'),
    )
  })

  it('accepts OTHER with a description', () => {
    expect(
      findMissingAnswers({ ...answered, disabilities: ['OTHER'], otherDisability: 'Broken arm' }, youthOrder),
    ).toEqual([])
  })
})
