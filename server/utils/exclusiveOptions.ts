import { CheckboxItem } from './govukFrontEndTypes/checkBoxItem'
import { RadiosItem } from './govukFrontEndTypes/radioItem'

const exclusiveOptions = (
  items: Array<CheckboxItem | RadiosItem>,
  exclusiveValues: string[],
): Array<CheckboxItem | RadiosItem> =>
  items.map(item =>
    'value' in item && item.value && exclusiveValues.includes(item.value)
      ? ({ ...item, behaviour: 'exclusive' } as CheckboxItem)
      : item,
  )

export default exclusiveOptions
