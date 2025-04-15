type ReferenceData<T extends string = string> = Record<
  T,
  | string
  | {
      text: string
      description: string
    }
>

export default ReferenceData
