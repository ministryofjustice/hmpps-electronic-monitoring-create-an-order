import { fakerEN_GB as faker } from '@faker-js/faker'
import civilCountyCourts from '../../server/i18n/en/reference/ddv5/civilCountyCourts'
import crownCourts from '../../server/i18n/en/reference/crownCourts'
import familyCourts from '../../server/i18n/en/reference/ddv5/familyCourts'
import magistratesCourts from '../../server/i18n/en/reference/magistratesCourts'
import prisons from '../../server/i18n/en/reference/ddv5/prisons'
import probationRegions from '../../server/i18n/en/reference/probationRegions'
import militaryCourts from '../../server/i18n/en/reference/ddv5/militaryCourts'
import youthCourts from '../../server/i18n/en/reference/ddv5/youthCourts'
import yjsRegions from '../../server/i18n/en/reference/youthJusticeServiceRegions'

const sexOptions = ['Male', 'Female', 'Prefer not to say', 'Not able to provide this information']

const genderOptions = ['Male', 'Female', 'Non binary', 'Not able to provide this information', 'Self identify']

const extractValues = (values: Array<string | { text: string }>) =>
  values.map(value => (typeof value === 'string' ? value : value.text))

const civilCountyCourtTypes = extractValues(Object.values(civilCountyCourts))
const crownCourtTypes = extractValues(Object.values(crownCourts))
const familyCourtTypes = extractValues(Object.values(familyCourts))
const magistratesCourtTypes = extractValues(Object.values(magistratesCourts))
const militaryCourtTypes = extractValues(Object.values(militaryCourts))
const prisonTypes = extractValues(Object.values(prisons)).filter(it => it !== 'Cookham Wood Young Offender Institution')
const youthCourtTypes = extractValues(Object.values(youthCourts))
const probationRegionTypes = extractValues(Object.values(probationRegions))
const yjsRegionTypes = extractValues(Object.values(yjsRegions))

// https://www.ofcom.org.uk/phones-and-broadband/phone-numbers/numbers-for-drama
const validUkPhoneNumbers = [
  ['Leeds', '0113 496 0', 0, 999],
  ['Sheffield', '0114 496 0', 0, 999],
  // ['Nottingham',	'0115 496 0',	0, 999], // libphonenumber fails these numbers
  ['Leicester', '0116 496 0', 0, 999],
  ['Bristol', '0117 496 0', 0, 999],
  ['Reading', '0118 496 0', 0, 999],
  ['Birmingham', '0121 496 0', 0, 999],
  ['Edinburgh', '0131 496 0', 0, 999],
  ['Glasgow', '0141 496 0', 0, 999],
  ['Liverpool', '0151 496 0', 0, 999],
  ['Manchester', '0161 496 0', 0, 999],
  ['London', '020 7946 0', 0, 999],
  ['Tyneside / Durham / Sunderland', '0191 498 0', 0, 999],
  ['Northern Ireland', '028 9649 6', 0, 999],
  ['Cardiff', '029 2018 0', 0, 999],
  // ['No area',	'01632 960', 0, 999], // libphonenumber fails these numbers
]

export class Address {
  constructor(
    public addressLine1?: string,
    public addressLine2?: string,
    public addressLine3?: string,
    public addressLine4?: string,
    public postcode?: string,
  ) {}

  toString() {
    return `${this.addressLine1}, ${this.addressLine2}, ${this.postcode}`
  }
}

export type InterestedParties = {
  notifyingOrganisation?: string
  notifyingOrganisationName?: string
  civilCountyCourt?: string
  crownCourt?: string
  familyCourt?: string
  magistratesCourt?: string
  militaryCourt?: string
  prison?: string
  ycsRegion?: string
  youthCourt?: string
  notifyingOrganisationEmailAddress?: string

  responsibleOrganisation?: string
  responsibleOrganisationRegion?: string
  responsibleOrganisationContactNumber?: string
  responsibleOrganisationEmailAddress?: string
  probationRegion?: string
  yjsRegion?: string
  responsibleOrganisationAddress?: Partial<Address>

  responsibleOfficerName?: string
  responsibleOfficerContactNumber?: string
}

export type PersonOfInterest = {
  nomisId?: string
  pncId?: string
  deliusId?: string
  prisonNumber?: string
  ceprId?: string
  ccrnId?: string

  firstName: string
  firstNames: string
  lastName: string
  fullName: string
  alias: string

  dob: Date
  emailAddress?: string
  contactNumber?: string

  is18: boolean
  sex: string
  genderIdentity: string

  interestedParties?: InterestedParties
  relationship?: string
}

export const createFakeUkPhoneNumber = (): string => {
  const format = faker.helpers.arrayElement(validUkPhoneNumbers)
  return format[1] + `00${faker.number.int({ min: format[2] as number, max: format[3] as number })}`.slice(-3)
}

export const createFakePerson = (dob: Date, firstNameOverride?: string): Partial<PersonOfInterest> => {
  const sexType = faker.person.sexType()
  const firstName = firstNameOverride ?? faker.person.firstName(sexType)
  const middleName = faker.person.middleName(sexType)
  const lastName = faker.person.lastName()
  const alias = faker.animal.bird()
  const sex = faker.helpers.arrayElement(sexOptions)
  const genderIdentity = faker.helpers.arrayElement(genderOptions)

  const contactNumber = createFakeUkPhoneNumber()
  const emailAddress = faker.internet.email({ firstName, lastName })

  return {
    firstName,
    firstNames: [firstName, middleName].join(' '),
    lastName,
    fullName: [firstName, middleName, lastName].join(' '),
    alias,

    dob,
    contactNumber,
    emailAddress,

    sex,
    genderIdentity,
  }
}

export const createFakeAddress = (): Address => {
  return new Address(
    faker.location.streetAddress(),
    '',
    faker.location.city(),
    faker.location.state(),
    faker.location.zipCode(),
  )
}

export const createKnownAddress = (): Address => {
  return faker.helpers.arrayElement<Address>([
    new Address('10 downing street', '', 'London', 'ENGLAND', 'SW1A 2AA'),
    kelvinCloseAddress,
    new Address('2 Dunlin Close', 'Bolton', 'Greater Manchester', '', 'BL2 1EW'),
  ])
}

export const kelvinCloseAddress = new Address('3 Kelvin Close', 'Birchwood', 'Warrington', '', 'WA3 7PB')

export const createFakeInterestedParties = (
  notifyingOrganisation: string,
  responsibleOrganisation: string,
  notifyingOrganisationNameOverride?: string,
  responsibleOrganisationRegionOverride?: string,
): Partial<InterestedParties> => {
  const sexType = faker.person.sexType()
  const officerName = `${faker.person.firstName(sexType)} ${faker.person.lastName()}`
  const officerContactNumber = createFakeUkPhoneNumber()
  const responsibleOrganisationEmailAddress = 'responsible-org@example.com'
  const notifyingOrganisationEmailAddress = 'notifying-org@example.com'
  let notifyingOrganisationName = ''
  let responsibleOrganisationRegion = ''
  let civilCountyCourt = ''
  let crownCourt = ''
  let familyCourt = ''
  let magistratesCourt = ''
  let militaryCourt = ''
  let prison = ''
  let youthCourt = ''
  let probationRegion = ''
  let yjsRegion = ''

  if (notifyingOrganisation === 'Civil & County Court') {
    civilCountyCourt = notifyingOrganisationNameOverride ?? faker.helpers.arrayElement(civilCountyCourtTypes)
    notifyingOrganisationName = civilCountyCourt
  }

  if (notifyingOrganisation === 'Crown Court') {
    crownCourt = notifyingOrganisationNameOverride ?? faker.helpers.arrayElement(crownCourtTypes)
    notifyingOrganisationName = crownCourt
  }

  if (notifyingOrganisation === 'Family Court') {
    familyCourt = notifyingOrganisationNameOverride ?? faker.helpers.arrayElement(familyCourtTypes)
    notifyingOrganisationName = familyCourt
  }

  if (notifyingOrganisation === 'Magistrates Court') {
    magistratesCourt = notifyingOrganisationNameOverride ?? faker.helpers.arrayElement(magistratesCourtTypes)
    notifyingOrganisationName = magistratesCourt
  }

  if (notifyingOrganisation === 'Military Court') {
    militaryCourt = notifyingOrganisationNameOverride ?? faker.helpers.arrayElement(militaryCourtTypes)
    notifyingOrganisationName = militaryCourt
  }

  if (notifyingOrganisation === 'Prison' || notifyingOrganisation === 'Prison Service') {
    prison = notifyingOrganisationNameOverride ?? faker.helpers.arrayElement(prisonTypes)
    notifyingOrganisationName = prison
  }

  if (notifyingOrganisation === 'Youth Court') {
    youthCourt = notifyingOrganisationNameOverride ?? faker.helpers.arrayElement(youthCourtTypes)
    notifyingOrganisationName = youthCourt
  }

  if (notifyingOrganisation === 'Youth Custody Service') {
    notifyingOrganisationName = ''
  }

  if (responsibleOrganisation === 'Probation') {
    probationRegion = responsibleOrganisationRegionOverride ?? faker.helpers.arrayElement(probationRegionTypes)
    responsibleOrganisationRegion = probationRegion
  }

  if (responsibleOrganisation === 'YJS') {
    yjsRegion = responsibleOrganisationRegionOverride ?? faker.helpers.arrayElement(yjsRegionTypes)
    responsibleOrganisationRegion = yjsRegion
  }

  return {
    notifyingOrganisation,
    notifyingOrganisationName,
    notifyingOrganisationEmailAddress,
    prison,
    magistratesCourt,
    crownCourt,
    familyCourt,
    civilCountyCourt,
    militaryCourt,
    youthCourt,
    responsibleOfficerName: officerName,
    responsibleOfficerContactNumber: officerContactNumber,
    responsibleOrganisation,
    responsibleOrganisationRegion,
    responsibleOrganisationEmailAddress,
    probationRegion,
    yjsRegion,
  }
}

export const createFakeYouth = (firstName?: string): PersonOfInterest => {
  const dob = faker.date.birthdate({ mode: 'age', min: 13, max: 17 })

  return {
    ...createFakePerson(dob, firstName),
    is18: false,
  } as PersonOfInterest
}

export const createFakeAdult = (firstName?: string): PersonOfInterest => {
  const dob = faker.date.birthdate({ mode: 'age', min: 18, max: 49 }) // anyone over 50 is apprently considered "older"

  return {
    ...createFakePerson(dob, firstName),
    is18: true,
  } as PersonOfInterest
}

export const createFakeAdultDeviceWearer = (personalId?: string, firstName?: string): PersonOfInterest => {
  // check to see if we need personalId or personalIdName or both
  const fakeAdult = createFakeAdult(firstName)
  const nomisId = faker.helpers.replaceSymbols('?####??')
  const pncId = faker.helpers.replaceSymbols('??##/######?')
  const deliusId = faker.helpers.replaceSymbols('X#####')
  const prisonNumber = faker.helpers.replaceSymbols('?#####')
  // IMPORTANT: check format of ceprId and ccrnId as not sure i.e. each ID has specific format
  const ceprId = fakeAdult.firstName[0] + faker.helpers.replaceSymbols('#######')
  const ccrnId = fakeAdult.firstName[0] + faker.helpers.replaceSymbols('#######')

  return {
    personalId,
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    ceprId,
    ccrnId,
    ...fakeAdult,
  } as PersonOfInterest
}

export const createFakeYouthDeviceWearer = (firstName?: string): PersonOfInterest => {
  const fakeYouth = createFakeYouth(firstName)
  const nomisId = faker.helpers.replaceSymbols('?####??')
  const pncId = faker.helpers.replaceSymbols('??##/######?')
  const deliusId = faker.helpers.replaceSymbols('X#####')
  const prisonNumber = faker.helpers.replaceSymbols('?#####')
  // IMPORTANT: check format of ceprId and ccrnId as not sure
  const ceprId = fakeYouth.firstName[0] + faker.helpers.replaceSymbols('#######')
  const ccrnId = fakeYouth.firstName[0] + faker.helpers.replaceSymbols('#######')

  return {
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    ceprId,
    ccrnId,
    ...fakeYouth,
  } as PersonOfInterest
}

export const createFakeResponsibleAdult = (): PersonOfInterest => {
  const person = createFakeAdult()
  const relationship = faker.helpers.arrayElement(['Parent', 'Guardian'])

  return {
    ...person,
    relationship,
  }
}

export default faker
