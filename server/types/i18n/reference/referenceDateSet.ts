type ReferenceDateSet<T extends string = string> = Record<
  T,
  (
    | string
    | {
        text: string
        description: string
      }
  )[]
>

export default ReferenceDateSet
