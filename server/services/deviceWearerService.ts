import z from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerModel, { DeviceWearer } from '../models/DeviceWearer'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { serialiseDate } from '../utils/utils'

type UpdateDeviceWearerRequestInput = AuthenticatedRequestInput & {
  orderId: string
  data: {
    nomisId: string
    pncId: string
    deliusId: string
    prisonNumber: string
    firstName: string
    lastName: string
    alias: string
    'dateOfBirth-day': string
    'dateOfBirth-month': string
    'dateOfBirth-year': string
    adultAtTimeOfInstallation: string
    sex: string
    gender: string
    disabilities: Array<string>
  }
}

type UpdateNoFixedAbodeRequest = AuthenticatedRequestInput & {
  orderId: string
  data: {
    noFixedAbode: string
  }
}

const dateModel = z.object({
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900),
})
type DateInput = z.infer<typeof dateModel>

export default class DeviceWearerService {
  constructor(private readonly apiClient: RestClient) {}

  private validateDate(dayStr: string, monthStr: string, yearStr: string) {
    // Convert string inputs to numbers, default to NaN if empty
    const day = dayStr ? parseInt(dayStr, 10) : NaN
    const month = monthStr ? parseInt(monthStr, 10) : NaN
    const year = yearStr ? parseInt(yearStr, 10) : NaN

    console.log(day, month, year)

    // Validate the input against the schema
    try {
      dateModel.parse({ day, month, year })
      return true
    } catch (error) {
      return false
    }
  }

  async updateDeviceWearer(input: UpdateDeviceWearerRequestInput): Promise<DeviceWearer | ValidationResult> {
    const validationErrors: ValidationResult = []

    if (
      !this.validateDate(input.data['dateOfBirth-day'], input.data['dateOfBirth-month'], input.data['dateOfBirth-year'])
    ) {
      return ValidationResultModel.parse([
        {
          field: 'dateOfBirth',
          error:
            'Date of birth is in the incorrect format. Enter your date of birth in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
        },
      ])
    }

    try {
      const {
        'dateOfBirth-day': dobDay,
        'dateOfBirth-month': dobMonth,
        'dateOfBirth-year': dobYear,
        disabilities,
        ...data
      } = input.data

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/device-wearer`,
        data: {
          ...data,
          dateOfBirth: serialiseDate(dobYear, dobMonth, dobDay),
          disabilities: disabilities.join(','),
        },
        token: input.accessToken,
      })

      return DeviceWearerModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }

  async updateNoFixedAbode(input: UpdateNoFixedAbodeRequest): Promise<DeviceWearer | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/device-wearer/no-fixed-abode`,
        data: input.data,
        token: input.accessToken,
      })

      return DeviceWearerModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
