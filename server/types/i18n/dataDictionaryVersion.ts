const DataDictionaryVersions = {
  DDv4: 'DDv4',
  DDv5: 'DDv5',
} as const

type DataDictionaryVersion = keyof typeof DataDictionaryVersions

export default DataDictionaryVersion

export { DataDictionaryVersions }
