import { fakerEN_GB as faker } from '@faker-js/faker'

faker.seed(9999)

export const setFakerSeed = (seed: number) => {
  faker.seed(seed)
}

const sexOptions = ['Male', 'Female', 'Prefer not to say', "Don't know"]

const genderOptions = ['Male', 'Female', 'Non-binary', "Don't know", 'Self identify']

const organisationTypes = [
  'Youth Justice Service (YJS)',
  'Youth Custody Service (YCS)',
  'Probation',
  'Field monitoring service',
  'Home Office',
  'Police',
]

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

export type ResponsibleOrganisation = {
  name?: string
  contactNumber?: string
  emailAddress?: string
  region?: string
  address?: Partial<Address>
}

export type PersonOfInterest = {
  nomisId?: string
  pncId?: string
  deliusId?: string
  prisonNumber?: string

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

  organisation?: ResponsibleOrganisation
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
  const fullName = `${firstName} ${lastName}`
  const alias = faker.animal.bird()
  const sex = faker.helpers.arrayElement(sexOptions)
  const genderIdentity = faker.helpers.arrayElement(genderOptions)

  const contactNumber = createFakeUkPhoneNumber()
  const emailAddress = faker.internet.email({ firstName, lastName })

  return {
    firstName,
    firstNames: [firstName, middleName].join(' '),
    lastName,
    fullName,
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
    faker.location.city(),
    faker.location.state(),
    undefined,
    faker.location.zipCode(),
  )
}

export const createFakeOrganisation = (): Partial<ResponsibleOrganisation> => {
  const name = faker.helpers.arrayElement(organisationTypes)
  const contactNumber = createFakeUkPhoneNumber()
  const emailAddress = `${name.toLowerCase().replace(/\s/g, '-')}@example.com`
  const address = createFakeAddress()

  return {
    name,
    contactNumber,
    emailAddress,
    region: undefined,
    address,
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
  const nomisId = faker.helpers.replaceSymbols('?####??')
  const pncId = faker.helpers.replaceSymbols('??##/######?')
  const deliusId = faker.helpers.replaceSymbols('X#####')
  const prisonNumber = faker.helpers.replaceSymbols('?#####')

  return {
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    ...createFakeAdult(),
  } as PersonOfInterest
}

export const createFakeYouthDeviceWearer = (): PersonOfInterest => {
  const nomisId = faker.helpers.replaceSymbols('?####??')
  const pncId = faker.helpers.replaceSymbols('??##/######?')
  const deliusId = faker.helpers.replaceSymbols('X#####')
  const prisonNumber = faker.helpers.replaceSymbols('?#####')

  return {
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    ...createFakeYouth(),
  } as PersonOfInterest
}

export const createFakeResponsibleOfficer = (): PersonOfInterest => {
  const person = createFakeAdult()
  const organisation = createFakeOrganisation()

  return {
    ...person,
    organisation,
  }
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