import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import FormComponent from '../../../../pages/components/formComponent'
import FormSelectComponent from '../../../../pages/components/formSelectComponent'
import FormAutocompleteComponent from '../../../../pages/components/formAutocompleteComponent'
import FormInputComponent from '../../../../pages/components/formInputComponent'

export type ResponsibleOrganisationFormData = {
  responsibleOrganisation?: string
  responsibleOrganisationEmailAddress?: string
  probationRegion?: string
  policeArea?: string
  yjsRegion?: string
}

export default class ResponsibleOrganisationComponent extends FormComponent {
  get responsibleOrganisationField(): FormRadiosComponent {
    const label = "What is the Responsible Officer's organisation?"
    return new FormRadiosComponent(this.form, label, [
      'Youth Justice Service (YJS)',
      'Probation',
      'Field monitoring service',
      'Home Office',
      'Police',
    ])
  }

  get responsibleOrgProbationField(): FormSelectComponent {
    const label = 'Select the Probation region'
    return new FormSelectComponent(this.form, label, [
      'North East',
      'North West',
      'Yorkshire and the Humber',
      'Greater Manchester',
      'East Midlands',
      'Wales',
      'West Midlands',
      'East of England',
      'South West',
      'South Central',
      'London',
      'Kent, Surrey & Sussex',
    ])
  }

  get policeAreaField(): FormAutocompleteComponent {
    const label = 'Select the Police force area'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get yjsRegionField(): FormSelectComponent {
    const label = 'Select the Youth Justice Service region'
    return new FormSelectComponent(this.form, label, [
      'North East and Cumbria',
      'North West',
      'Yorkshire and Humberside',
      'Midlands',
      'Wales',
      'South West and Central',
      'London',
      'East and South East',
    ])
  }

  get responsibleOrganisationEmailAddressField(): FormInputComponent {
    const label = "What is the Responsible Organisation's email address? (optional)"
    return new FormInputComponent(this.form, label)
  }

  fillInWith(profile: ResponsibleOrganisationFormData) {
    if (profile.responsibleOrganisation) {
      this.responsibleOrganisationField.set(profile.responsibleOrganisation)
    }

    if (profile.responsibleOrganisationEmailAddress) {
      this.responsibleOrganisationEmailAddressField.set(profile.responsibleOrganisationEmailAddress)
    }

    if (profile.probationRegion) {
      this.responsibleOrgProbationField.set(profile.probationRegion)
    }

    if (profile.policeArea) {
      this.policeAreaField.set(profile.policeArea)
    }

    if (profile.yjsRegion) {
      this.yjsRegionField.set(profile.yjsRegion)
    }
  }
}
