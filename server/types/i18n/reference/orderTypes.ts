import ReferenceData from './reference'

type OrderTypes = ReferenceData<
  'CIVIL' | 'COMMUNITY' | 'IMMIGRATION' | 'POST_RELEASE' | 'PRE_TRIAL' | 'SPECIAL' | 'BAIL'
>

export default OrderTypes
