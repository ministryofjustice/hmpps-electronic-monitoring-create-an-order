import { ResponsibleOrganisationValidator } from './formModel'

describe('ResponsibleOrganisationValidator', () => {
  it('returns the court-specific error when the police force area is missing', () => {
    const result = ResponsibleOrganisationValidator('COURT').safeParse({
      responsibleOrganisation: 'POLICE',
      policeArea: '',
      responsibleOrganisationEmail: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: 'Select the name of the Police Force area',
          path: ['responsibleOrganisationRegion'],
        }),
      )
    }
  })

  it('keeps the existing error for non-court cohorts', () => {
    const result = ResponsibleOrganisationValidator('PROBATION').safeParse({
      responsibleOrganisation: 'POLICE',
      policeArea: '',
      responsibleOrganisationEmail: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "Select the responsible officer's organisation",
          path: ['responsibleOrganisation'],
        }),
      )
    }
  })
})
