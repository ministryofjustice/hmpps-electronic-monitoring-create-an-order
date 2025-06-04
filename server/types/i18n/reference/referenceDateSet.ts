import ReferenceData from './reference'

type ReferenceDateSet<T extends string = string> = Record<T, ReferenceData>

export default ReferenceDateSet
