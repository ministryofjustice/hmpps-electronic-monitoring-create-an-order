import { PageElement } from '../../../page'
import FormComponent from '../../formComponent'

export type ResponsibleAdultFormData = {
  relationship?: string
  otherRelationshipDetails?: string
  fullName?: string
  contactNumber?: string
}

export default class ResponsibleAdultFormComponent extends FormComponent {
  // FIELDS

  setRelationship(relationship: string) {
    this.relationshipField(relationship).click()
  }

  relationshipFieldset = (): PageElement => this.form.getByLegend('How do they know the device wearer')

  relationshipField = (relationship: string): PageElement => this.relationshipFieldset().getByLabel(relationship)

  relationshipParentField = (): PageElement => this.relationshipFieldset().getByLabel('Parent')

  relationshipGuardianField = (): PageElement => this.relationshipFieldset().getByLabel('Guardian')

  relationshipOtherField = (): PageElement => this.relationshipFieldset().getByLabel('Other')

  setOtherRelationshipDetails(otherRelationshipDetails: string) {
    this.otherRelationshipDetailsField().type(otherRelationshipDetails)
  }

  otherRelationshipDetailsField = (): PageElement =>
    this.form.getByLabel('Enter details of relationship to device wearer')

  // CONTACT DETAILS

  setFullName(fullName: string) {
    this.fullNameField().type(fullName)
  }

  fullNameField = (): PageElement => this.form.getByLabel('Full name')

  setContactNumber(contactNumber: string) {
    this.contactNumberField().type(contactNumber)
  }

  contactNumberField = (): PageElement => this.form.getByLabel('Parent / guardian contact number')

  // FORM HELPERS

  fillInWith = (profile: ResponsibleAdultFormData): undefined => {
    if (profile.relationship) {
      this.setRelationship(profile.relationship)
    }

    if (profile.relationship === 'Other' && profile.otherRelationshipDetails) {
      this.setOtherRelationshipDetails(profile.otherRelationshipDetails)
    }

    if (profile.fullName) {
      this.setFullName(profile.fullName)
    }

    if (profile.contactNumber) {
      this.setContactNumber(profile.contactNumber)
    }
  }
}
