import FormAutocompleteComponent from '../../../../pages/components/formAutocompleteComponent'
import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import FormTextareaComponent from '../../../../pages/components/formTextareaComponent'

type formData = {
  notifyingOrganisation?: string
  prison?: string
  familyCourt?: string
  crownCourt?: string
  magistratesCourt?: string
  youthCourt?: string
  notifyingOrganisationEmailAddress?: string
}

export default class NotifyingOrganisationComponent extends FormComponent {
  get organisationField(): FormRadiosComponent {
    const label = 'What organisation or related organisation are you part of?'
    return new FormRadiosComponent(this.form, label, [
      'Prison service',
      'Probation service',
      'Youth Custody Service (YCS)',
      'Crown Court',
      'Magistrates Court',
      'Family Court',
      'Civil and County Court',
      'Youth Court',
      'Scottish Court',
      'Military Court',
      'Home Office',
    ])
  }

  get emailField(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, "What is your team's contact email address?")
  }

  get prisonField(): FormAutocompleteComponent {
    const label = 'Select the name of the Prison'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get civilCountyCourtField(): FormAutocompleteComponent {
    const label = 'Select the name of the Civil and County Court'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get crownCourtField(): FormAutocompleteComponent {
    const label = 'Select the name of the Crown Court'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get familyCourtField(): FormAutocompleteComponent {
    const label = 'Select the name of the Family Court'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get magistratesCourtField(): FormAutocompleteComponent {
    const label = 'Select the name of the Court'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get militaryCourtField(): FormAutocompleteComponent {
    const label = 'Select the name of the Military Court'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get youthCourtField(): FormAutocompleteComponent {
    const label = 'Select the name of the Youth Court'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  fillInWith(data: formData) {
    if (data.notifyingOrganisation) {
      this.organisationField.set(data.notifyingOrganisation)
    }
    if (data.prison) {
      this.prisonField.set(data.prison)
    }

    if (data.crownCourt) {
      this.crownCourtField.set(data.crownCourt)
    }

    if (data.magistratesCourt) {
      this.magistratesCourtField.set(data.magistratesCourt)
    }

    if (data.youthCourt) {
      this.youthCourtField.set(data.youthCourt)
    }
    if (data.familyCourt) {
      this.familyCourtField.set(data.familyCourt)
    }
    if (data.notifyingOrganisationEmailAddress) {
      this.emailField.set(data.notifyingOrganisationEmailAddress)
    }
  }
}
