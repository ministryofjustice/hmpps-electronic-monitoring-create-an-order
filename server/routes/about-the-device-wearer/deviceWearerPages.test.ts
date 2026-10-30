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

describe('deviceWearerPages', () => {
  it('finds no missing answers when every page is answered', () => {
    expect(findMissingAnswers(answered)).toEqual([])
    expect(firstUnansweredPage(answered, '1')).toBeNull()
  })

  it('routes to the first page with a missing answer, in page order', () => {
    const answers = { ...answered, disabilities: [], adultAtTimeOfInstallation: null }

    expect(firstUnansweredPage(answers, '1')).toEqual(
      paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', '1'),
    )
  })

  it('treats an unanswered nullable question as missing', () => {
    expect(firstUnansweredPage({ ...answered, interpreterRequired: null }, '1')).toEqual(
      paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', '1'),
    )
  })

  it('maps api errors back to the page that owns the field', () => {
    const page = pageForErrors([{ field: 'otherDisability', error: 'x' }], '1')

    expect(page).toEqual({
      path: paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', '1'),
      errors: [{ field: 'otherDisability', error: 'x' }],
    })
    expect(pageForErrors([{ field: 'unknown', error: 'x' }], '1')).toBeNull()
  })
})
