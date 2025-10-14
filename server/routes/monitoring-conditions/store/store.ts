export default interface Store {
  set(key: string, token: string, durationSeconds: number): Promise<void>
  get(key: string): Promise<string | null>
}
