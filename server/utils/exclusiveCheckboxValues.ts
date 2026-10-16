import z from 'zod'

const exclusiveCheckboxValues = (exclusiveValues: string[]) =>
  z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(val => {
      if (val === undefined) return []
      const values = Array.isArray(val) ? val : [val]
      const exclusive = values.find(value => exclusiveValues.includes(value))
      return exclusive ? [exclusive] : values
    })

export default exclusiveCheckboxValues
