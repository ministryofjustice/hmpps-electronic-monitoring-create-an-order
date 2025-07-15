const DataDictionaryVersions = {
  DDV4: 'DDV4',
  DDV5: 'DDV5',
} as const

type DataDictionaryVersion = keyof typeof DataDictionaryVersions

export default DataDictionaryVersion

export { DataDictionaryVersions }
