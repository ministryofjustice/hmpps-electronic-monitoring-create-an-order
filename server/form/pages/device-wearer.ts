import { DeviceWearerFormData } from '../../models/form-data/deviceWearer'
import { Order } from '../../models/Order'
import Component from '../components/component'
import DateInput from '../components/date-input'
import Input from '../components/input'
import Radios from '../components/radios'
import RadiosBoolean from '../components/radios-boolean'
import Page from './page'

const deserialiseDate = (dateString: string | null) => {
  if (dateString === null || dateString === '') {
    return {
      day: '',
      month: '',
      year: '',
    }
  }

  const date = new Date(dateString)

  return {
    day: date.getDate().toString(),
    month: (date.getMonth() + 1).toString(),
    year: date.getFullYear().toString(),
  }
}

class DeviceWearerPage implements Page {
  subtitle = ''

  title = 'About the device wearer'

  constructor(
    private readonly order: Order,
    private readonly formData?: DeviceWearerFormData,
  ) {}

  get disabled(): boolean {
    return this.order.status !== 'IN_PROGRESS'
  }

  get firstName(): string {
    if (this.formData) {
      return this.formData.firstName
    }

    return this.order.deviceWearer?.firstName ?? ''
  }

  get lastName(): string {
    if (this.formData) {
      return this.formData.lastName
    }

    return this.order.deviceWearer?.lastName ?? ''
  }

  get alias(): string {
    if (this.formData) {
      return this.formData.alias
    }

    return this.order.deviceWearer?.alias ?? ''
  }

  get dateOfBirth() {
    if (this.formData) {
      return this.formData.dateOfBirth
    }

    return deserialiseDate(this.order.deviceWearer?.dateOfBirth)
  }

  get adultAtTimeOfInstallation() {
    if (this.formData) {
      return this.formData.adultAtTimeOfInstallation
    }

    const adultAtTimeOfInstallation = this.order.deviceWearer?.adultAtTimeOfInstallation

    if (adultAtTimeOfInstallation === null) {
      return null
    }

    return adultAtTimeOfInstallation.toString()
  }

  get sex() {
    if (this.formData) {
      return this.formData.sex
    }

    return this.order.deviceWearer?.sex ?? ''
  }

  get firstNameField(): Input {
    return {
      type: 'input',
      disabled: this.disabled,
      id: 'firstName1',
      text: 'First names',
      value: this.firstName,
    }
  }

  get lastNameField(): Input {
    return {
      type: 'input',
      disabled: this.disabled,
      id: 'lastName1',
      text: 'Last name',
      value: this.lastName,
    }
  }

  get aliasField(): Input {
    return {
      type: 'input',
      disabled: this.disabled,
      id: 'alias1',
      text: 'Preferred name or alias (optional)',
      hint: 'For example a nickname or alias the device wearer is also known as',
      value: this.alias,
    }
  }

  get dateOfBirthField(): DateInput {
    return {
      type: 'date-input',
      id: 'alias',
      text: 'Date of birth',
      hint: 'For example, 21 05 2011',
      value: this.dateOfBirth,
    }
  }

  get adultAtTimeOfInstallationField(): RadiosBoolean {
    return {
      type: 'radios-boolean',
      id: 'adultAtTimeOfInstallation',
      text: 'Will the device wearer be 18 years old when the device is installed?',
      value: this.adultAtTimeOfInstallation,
    }
  }

  get sexField(): Radios {
    return {
      type: 'radios',
      id: 'sex',
      text: 'Sex',
      hint: 'What sex was the devise wearer assigned at birth?',
      value: this.sex,
      options: [
        {
          text: 'Male',
          value: 'male',
        },
        {
          text: 'Female',
          value: 'female',
        },
        {
          text: 'Prefer not to say',
          value: 'prefer not to say',
        },
        {
          text: "Don't know",
          value: 'unknown',
        },
      ],
    }
  }

  get fields(): Array<Component> {
    return [
      this.firstNameField,
      this.lastNameField,
      this.aliasField,
      this.dateOfBirthField,
      this.adultAtTimeOfInstallationField,
      this.sexField,
    ]
  }
}

export default DeviceWearerPage
