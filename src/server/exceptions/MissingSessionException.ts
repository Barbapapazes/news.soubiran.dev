export class MissingSessionException extends Error {
  constructor() {
    super('Missing session')
    this.name = 'MissingSessionException'
  }
}
