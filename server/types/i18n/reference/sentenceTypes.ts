import ReferenceData from './reference'

type SentenceTypes = ReferenceData<
  | 'EXTENDED_DETERMINATE_SENTENCE'
  | 'IPP'
  | 'LIFE_SENTENCE'
  | 'SOPC'
  | 'EPP'
  | 'SECTION_85_EXTENDED_SENTENCES'
  | 'STANDARD_DETERMINATE_SENTENCE'
  | 'DTO'
  | 'SECTION_91'
  | 'COMMUNITY_YRO'
  | 'COMMUNITY_SDO'
  | 'COMMUNITY_SUSPENDED_SENTENCE'
  | 'COMMUNITY'
  | 'BAIL_SUPERVISION_SUPPORT'
  | 'BAIL_RLAA'
  | 'BAIL'
>

export default SentenceTypes
