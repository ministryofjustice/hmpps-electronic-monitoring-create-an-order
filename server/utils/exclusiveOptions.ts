import { CheckboxItem } from './govukFrontEndTypes/checkBoxItem'
import { RadiosItem } from './govukFrontEndTypes/radioItem'

const exclusiveOptions = (
  items: Array<CheckboxItem | RadiosItem>,
  exclusiveValues: readonly string[],
): Array<CheckboxItem | RadiosItem> =>
  items.flatMap(item =>
    'value' in item && item.value && exclusiveValues.includes(item.value)
      ? [{ value: '', divider: 'or' } as CheckboxItem, { ...item, behaviour: 'exclusive' } as CheckboxItem]
      : [item],
  )

export default exclusiveOptions
