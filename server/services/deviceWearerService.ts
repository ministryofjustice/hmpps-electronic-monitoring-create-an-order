import z from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerModel, { DeviceWearer } from '../models/DeviceWearer'
import {
  ListValidationResultModel,
  ValidationErrorModel,
  ValidationResult,
  ValidationResultModel,
} from '../models/Validation'
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
  year: z.number().int().min(1900).max(new Date().getFullYear()),
})
type DateInput = z.infer<typeof dateModel>

export default class DeviceWearerService {
  constructor(private readonly apiClient: RestClient) {}

  private validateDate(dayStr: string, monthStr: string, yearStr: string) {
    // Convert string inputs to numbers
    const day = parseInt(dayStr, 10)
    const month = parseInt(monthStr, 10)
    const year = parseInt(yearStr, 10)

    // Validate the input against the schema
    dateModel.parse({ day, month, year })
    console.log('PARSED SUCCESSFULLY')
  }

  async updateDeviceWearer(input: UpdateDeviceWearerRequestInput): Promise<DeviceWearer | ValidationResult> {
    try {
      try {
        console.log('TRYING TO VALIDATE...')
        this.validateDate('dateOfBirth-day', 'dateOfBirth-month', 'dateOfBirth-year')

        console.log('VALIDATION COMPLETE')
      } catch (error: unknown) {
        if (error instanceof z.ZodError) {
          console.log('COULD NOT PARSE')

          return ValidationResultModel.parse([
            {
              field: 'dateOfBirth',
              error: 'Date of birth is in the incorrect format. Please provide only numbers.',
            },
          ])
        }
        console.log('COULD NOT PARSE 2')
        return ValidationResultModel.parse({
          field: 'dateOfBirth-day',
          error: 'Unexpected error with date input.',
        })
      }

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
