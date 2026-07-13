const DataDictionaryVersions = {
  DDV4: 'DDV4',
  DDV5: 'DDV5',
  DDV6: 'DDV6',
  DDV7: 'DDV7',
} as const

type DataDictionaryVersion = keyof typeof DataDictionaryVersions

export default DataDictionaryVersion

export { DataDictionaryVersions }
