import ReferenceData from '../types/i18n/reference/reference'
import { CheckboxItem } from './govukFrontEndTypes/checkBoxItem'

const toCheckboxItems = (
  reference: ReferenceData,
  disabled: boolean,
  excludedValues: readonly string[] = [],
): CheckboxItem[] =>
  Object.entries(reference)
    .filter(([value]) => !excludedValues.includes(value))
    .map(([value, entry]) =>
      typeof entry === 'string'
        ? { value, text: entry, disabled }
        : { value, text: entry.text, hint: { text: entry.description }, disabled },
    )

export default toCheckboxItems
