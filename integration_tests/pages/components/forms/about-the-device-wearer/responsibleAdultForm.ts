import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type ResponsibleAdultFormData = {
  relationship?: string
  otherRelationshipDetails?: string
  fullName?: string
  contactNumber?: string
}

export default class ResponsibleAdultFormComponent extends FormComponent {
  // FIELDS

  get relationshipField(): FormRadiosComponent {
    const label = "What is the responsible adult's relationship to the device wearer?"
    return new FormRadiosComponent(this.form, label, ['Parent', 'Guardian', 'Other'])
  }

  get relationshipDetailsField(): FormInputComponent {
    const label = 'Relationship to device wearer'
    return new FormInputComponent(this.form, label)
  }

  // CONTACT DETAILS

  get fullNameField(): FormInputComponent {
    const label = "What is the responsible adult's full name?"
    return new FormInputComponent(this.form, label)
  }

  get contactNumberField(): FormInputComponent {
    const label = "What is the responsible adult's telephone number? (optional)"
    return new FormInputComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith = (profile: ResponsibleAdultFormData): undefined => {
    if (profile.relationship) {
      this.relationshipField.set(profile.relationship)
    }

    if (profile.fullName) {
      this.fullNameField.set(profile.fullName)
    }

    if (profile.contactNumber) {
      this.contactNumberField.set(profile.contactNumber)
    }

    if (profile.relationship === 'Other' && profile.otherRelationshipDetails) {
      this.relationshipDetailsField.set(profile.otherRelationshipDetails)
    }
  }
}
