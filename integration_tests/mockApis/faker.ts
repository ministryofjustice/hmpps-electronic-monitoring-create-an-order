import { fakerEN_GB as faker } from '@faker-js/faker'
import prisons from '../../server/reference/prisons'
import crownCourts from '../../server/reference/crown-courts'
import magistratesCourts from '../../server/reference/magistrates-courts'
import probationRegions from '../../server/reference/probation-regions'
import yjsRegions from '../../server/reference/youth-justice-service-regions'

const sexOptions = ['Male', 'Female', 'Prefer not to say', 'Not able to provide this information']

const genderOptions = ['Male', 'Female', 'Non binary', 'Not able to provide this information', 'Self identify']

const prisonTypes = Object.values(prisons)
const crownCourtTypes = Object.values(crownCourts)
const magistratesCourtTypes = Object.values(magistratesCourts)
const probationRegionTypes = Object.values(probationRegions)
const yjsRegionTypes = Object.values(yjsRegions)

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
    public line1?: string,
    public line2?: string,
    public line3?: string,
    public line4?: string,
    public postcode?: string,
  ) {}

  toString() {
    return `${this.line1}, ${this.line2}, ${this.postcode}`
  }
}

export type InterestedParties = {
  notifyingOrganisation?: string
  notifyingOrganisationName?: string
  prison?: string
  crownCourt?: string
  magistratesCourt?: string
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
  homeOfficeReferenceNumber?: string

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

export const createFakePerson = (dob: Date): Partial<PersonOfInterest> => {
  const sexType = faker.person.sexType()
  const firstName = faker.person.firstName(sexType)
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
  return faker.helpers.arrayElement<Address>([new Address('10 downing street', '', 'London', 'ENGLAND', 'SW1A 2AA')])
}

export const createFakeInterestedParties = (
  notifyingOrganisation: string,
  responsibleOrganisation: string,
): Partial<InterestedParties> => {
  const sexType = faker.person.sexType()
  const officerName = `${faker.person.firstName(sexType)} ${faker.person.lastName()}`
  const officerContactNumber = createFakeUkPhoneNumber()
  const orgContactNumber = createFakeUkPhoneNumber()
  const orgEmailAddress = `${responsibleOrganisation.toLowerCase().replace(/\s/g, '-')}@example.com`
  const address = createFakeAddress()
  let notifyingOrganisationName = ''
  let responsibleOrganisationRegion = ''
  let prison = ''
  let crownCourt = ''
  let magistratesCourt = ''
  let probationRegion = ''
  let yjsRegion = ''

  if (notifyingOrganisation === 'Prison') {
    prison = faker.helpers.arrayElement(prisonTypes)
    notifyingOrganisationName = prison
  }

  if (notifyingOrganisation === 'Magistrates Court') {
    magistratesCourt = faker.helpers.arrayElement(magistratesCourtTypes)
    notifyingOrganisationName = magistratesCourt
  }

  if (notifyingOrganisation === 'Crown Court') {
    crownCourt = faker.helpers.arrayElement(crownCourtTypes)
    notifyingOrganisationName = crownCourt
  }

  if (responsibleOrganisation === 'Probation') {
    probationRegion = faker.helpers.arrayElement(probationRegionTypes)
    responsibleOrganisationRegion = probationRegion
  }

  if (responsibleOrganisation === 'YJS') {
    yjsRegion = faker.helpers.arrayElement(yjsRegionTypes)
    responsibleOrganisationRegion = yjsRegion
  }

  return {
    notifyingOrganisation,
    notifyingOrganisationName,
    prison,
    magistratesCourt,
    crownCourt,
    responsibleOfficerName: officerName,
    responsibleOfficerContactNumber: officerContactNumber,
    responsibleOrganisation,
    responsibleOrganisationRegion,
    responsibleOrganisationContactNumber: orgContactNumber,
    responsibleOrganisationEmailAddress: orgEmailAddress,
    probationRegion,
    yjsRegion,
    responsibleOrganisationAddress: address,
  }
}

export const createFakeYouth = (): PersonOfInterest => {
  const dob = faker.date.birthdate({ mode: 'age', min: 13, max: 17 })

  return {
    ...createFakePerson(dob),
    is18: false,
  } as PersonOfInterest
}

export const createFakeAdult = (): PersonOfInterest => {
  const dob = faker.date.birthdate({ mode: 'age', min: 18, max: 49 }) // anyone over 50 is apprently considered "older"

  return {
    ...createFakePerson(dob),
    is18: true,
  } as PersonOfInterest
}

export const createFakeAdultDeviceWearer = (): PersonOfInterest => {
  const fakeAdult = createFakeAdult()
  const nomisId = faker.helpers.replaceSymbols('?####??')
  const pncId = faker.helpers.replaceSymbols('??##/######?')
  const deliusId = faker.helpers.replaceSymbols('X#####')
  const prisonNumber = faker.helpers.replaceSymbols('?#####')
  const homeOfficeReferenceNumber = fakeAdult.firstName[0] + faker.helpers.replaceSymbols('#######')

  return {
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    homeOfficeReferenceNumber,
    ...fakeAdult,
  } as PersonOfInterest
}

export const createFakeYouthDeviceWearer = (): PersonOfInterest => {
  const fakeYouth = createFakeYouth()
  const nomisId = faker.helpers.replaceSymbols('?####??')
  const pncId = faker.helpers.replaceSymbols('??##/######?')
  const deliusId = faker.helpers.replaceSymbols('X#####')
  const prisonNumber = faker.helpers.replaceSymbols('?#####')
  const homeOfficeReferenceNumber = fakeYouth.firstName[0] + faker.helpers.replaceSymbols('#######')

  return {
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    homeOfficeReferenceNumber,
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
