import FormComponent from '../../formComponent'
import FormCheckboxesComponent from '../../formCheckboxesComponent'
import { PageElement } from '../../../page'

const label = 'Does the device wearer have any of the disabilities or health conditions listed?'

const ddv4Options = [
  'Visual impairment or blindness not corrected by wearing glasses',
  'Deafness or serious hearing impairment',
  'Physical disability or mobility issue',
  'Fine motor or dexterity impairment',
  'Neurodiversity including conditions affecting learning, understanding or concentration',
  'Condition affecting the memory or retaining information',
  'Mental health condition',
  'Health condition affecting stamina, breathing or causing fatigue',
  'Conditions affecting social skills and behaviour',
  'The device wearer has a disability or health condition not listed',
  'The device wearer does not have any of the disabilities or health conditions listed',
  'Not able to provide this information',
]

const ddv5Options = [...ddv4Options.slice(0, 4), 'Skin condition', ...ddv4Options.slice(4)]

export default class DisabilitiesFormComponent extends FormComponent {
  get disabilitiesField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, label, ddv4Options, true)
  }

  get disabilitiesFieldDDv5(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, label, ddv5Options, true)
  }

  get otherDisabilityField(): PageElement {
    return this.form.find('input[name="otherDisability"]')
  }
}
