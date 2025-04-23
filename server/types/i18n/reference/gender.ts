import ReferenceData from './reference'

type Gender = ReferenceData<
  'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_TO_SELF_DESCRIBE' | 'NOT_ABLE_TO_PROVIDE_THIS_INFORMATION'
>

export default Gender
