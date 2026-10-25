import { Data } from 'effect'

export interface UserNotFoundArags {
  info: {
    label: 'id' | 'email' | 'username'
    value: string
  }
}

export class UserNotFoundError extends Data.TaggedError('UserNotFoundError')<UserNotFoundArags> {
  get message() {
    return `User with ${this.info.label} "${this.info.value}" not found`
  }
}
