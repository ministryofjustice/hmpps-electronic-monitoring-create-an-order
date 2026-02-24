import z from 'zod'
import { ResponsibleOrganisationEnum } from '../../../models/ResponsibleOrganisation'

const ResponsibleOrganisationFormModel = z.object({
  responsibleOrganisation: ResponsibleOrganisationEnum.optional(),
  responsibleOrgProbationRegion: z.string().default(''),
  policeArea: z.string().default(''),
  yjsRegion: z.string().default(''),
  responsibleOrganisationEmail: z.string().default(''),
})

export const ResponsibleOrganisationValidator = ResponsibleOrganisationFormModel.superRefine((data, ctx) => {
  const selection = data.responsibleOrganisation

  const mapping: Record<string, keyof ResponsibleOrganisationInput> = {
    PROBATION: 'responsibleOrgProbationRegion',
    POLICE: 'policeArea',
    YJS: 'yjsRegion',
  }

  if (selection && mapping[selection]) {
    const fieldToVerify = mapping[selection]
    if (!data[fieldToVerify]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select the responsible officer's organisation",
        path: ['responsibleOrganisation'],
      })
    }
  }

  if (!selection) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Select the organisation you are apart of',
      path: ['responsibleOrganisation'],
    })
  }

  const email = data.responsibleOrganisationEmail
  if (email && email.length > 200) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 200,
      type: 'string',
      inclusive: true,
      message: 'Email address must be 200 characters or less',
      path: ['responsibleOrganisationEmail'],
    })
  } else if (email && !z.string().email().safeParse(email).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: 'email',
      message: 'Invalid email address format',
      path: ['responsibleOrganisationEmail'],
    })
  }
}).transform(data => {
  const lookup: Record<string, string> = {
    PROBATION: data.responsibleOrgProbationRegion,
    POLICE: data.policeArea,
    YJS: data.yjsRegion,
  }

  return {
    responsibleOrganisation: data.responsibleOrganisation,
    responsibleOrganisationRegion: (data.responsibleOrganisation ? lookup[data.responsibleOrganisation] : '') ?? '',
    responsibleOrganisationEmail: data.responsibleOrganisationEmail,
  }
})

export type ResponsibleOrganisationInput = z.output<typeof ResponsibleOrganisationFormModel>

export default ResponsibleOrganisationFormModel
