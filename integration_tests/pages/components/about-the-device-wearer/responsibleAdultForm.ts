import { PageElement } from '../../page'

export type ResponsibleAdultFormData = {
  relationship?: string
  otherRelationshipDetails?: string
  fullName?: string
  contactNumber?: string
}

export default class ResponsibleAdultFormComponent {
  private get form(): PageElement {
    return cy.get('form') // [action*="about-the-device-wearer/responsible-adult"]
  }

  checkHasForm(): void {
    this.form.should('exist')
  }

  hasAction = (action: string | RegExp): PageElement => this.form.should('have.attr', 'action', action)

  // RELATIONSHIP

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

  // ACTIONS

  saveAndContinueButton = (): PageElement => this.form.get('button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => this.form.get('button[type=submit][value="back"]')

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
