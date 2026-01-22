import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

type MappaData = {
  level?: string
  category?: string
}

export default class MappaComponent extends FormComponent {
  get categoryField(): FormRadiosComponent {
    const label = 'Which category of MAPPA applies to the device wearer? (optional)'
    return new FormRadiosComponent(this.form, label, ['MAPPA 1', 'MAPPA 2', 'MAPPA 3'])
  }

  get levelField(): FormRadiosComponent {
    const label = 'Which level of MAPPA applies to the device wearer? (optional)'
    return new FormRadiosComponent(this.form, label, ['Category 1', 'Category 2', 'Category 3'])
  }

  fillInWith(input: MappaData) {
    if (input.level) {
      this.levelField.set(input.level)
    }
    if (input.category) {
      this.categoryField.set(input.category)
    }
  }
}
