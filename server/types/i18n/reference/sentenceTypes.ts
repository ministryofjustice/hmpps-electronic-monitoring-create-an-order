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
>

export default SentenceTypes
