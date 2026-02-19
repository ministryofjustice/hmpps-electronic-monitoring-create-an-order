import z from 'zod'
import { NotifyingOrganisationEnum } from '../../../models/NotifyingOrganisation'

const NotifyingOrganisationFormModel = z.object({
  notifyingOrganisation: NotifyingOrganisationEnum.optional(),
  civilCountyCourt: z.string().default(''),
  crownCourt: z.string().default(''),
  familyCourt: z.string().default(''),
  magistratesCourt: z.string().default(''),
  militaryCourt: z.string().default(''),
  prison: z.string().default(''),
  youthCourt: z.string().default(''),
  youthCustodyServiceRegion: z.string().default(''),
  notifyingOrganisationEmail: z.string().nullable(),
})

export const NotifyingOrganisationValidator = NotifyingOrganisationFormModel.superRefine((data, ctx) => {
  const selection = data.notifyingOrganisation

  const mapping: Record<string, keyof NotifyingOrganisationInput> = {
    PRISON: 'prison',
    YOUTH_CUSTODY_SERVICE: 'youthCustodyServiceRegion',
    CROWN_COURT: 'crownCourt',
    MAGISTRATES_COURT: 'magistratesCourt',
    FAMILY_COURT: 'familyCourt',
    CIVIL_COUNTY_COURT: 'civilCountyCourt',
    YOUTH_COURT: 'youthCourt',
    MILITARY_COURT: 'militaryCourt',
  }

  if (selection && mapping[selection]) {
    const fieldToVerify = mapping[selection]
    if (!data[fieldToVerify]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select the name of the organisation you are apart of',
        path: ['notifyingOrganisationName'],
      })
    }
  }

  if (!selection) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Select the organisation you are apart of',
      path: ['notifyingOrganisation'],
    })
  }

  const email = data.notifyingOrganisationEmail
  if (!email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter your team's email address",
      path: ['notifyingOrganisationEmail'],
    })
  } else if (email.length > 200) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 200,
      type: 'string',
      inclusive: true,
      message: 'Email address must be 200 characters or less',
      path: ['notifyingOrganisationEmail'],
    })
  } else if (!z.string().email().safeParse(email).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: 'email',
      message: 'Invalid email address format',
      path: ['notifyingOrganisationEmail'],
    })
  }
}).transform(data => {
  const lookup: Record<string, string> = {
    PRISON: data.prison,
    YOUTH_CUSTODY_SERVICE: data.youthCustodyServiceRegion,
    CROWN_COURT: data.crownCourt,
    MAGISTRATES_COURT: data.magistratesCourt,
    FAMILY_COURT: data.familyCourt,
    CIVIL_COUNTY_COURT: data.civilCountyCourt,
    YOUTH_COURT: data.youthCourt,
    MILITARY_COURT: data.militaryCourt,
  }

  return {
    notifyingOrganisation: data.notifyingOrganisation,
    notifyingOrganisationName: (data.notifyingOrganisation ? lookup[data.notifyingOrganisation] : '') ?? '',
    notifyingOrganisationEmail: data.notifyingOrganisationEmail,
  }
})

export type NotifyingOrganisationInput = z.output<typeof NotifyingOrganisationFormModel>

export default NotifyingOrganisationFormModel
