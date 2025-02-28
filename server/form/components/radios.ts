type Radios = {
  type: 'radios'
  id: string
  text: string
  hint?: string
  value: string | null
  options: Array<{
    text: string
    value: string
  }>
}

export default Radios
