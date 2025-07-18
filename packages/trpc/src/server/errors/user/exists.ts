import { Data } from 'effect'

export interface UserExistsArags {
  info: {
    label: 'email' | 'username'
    value: string
  }
}

export class UserExistsError extends Data.TaggedError('UserExistError')<UserExistsArags> {
  get message() {
    return `User with ${this.info.label} "${this.info.value}" already exists`
  }
}
