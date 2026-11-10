export default class Up3SimulationError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly fieldErrors: { text: string; href: string }[] = [],
  ) {
    super('UP3 simulation request failed')
  }
}
