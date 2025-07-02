/* eslint-disable @typescript-eslint/no-explicit-any */
export type LooseEnum<T> = T | (string & {})
export type ToStrictEnum<T> = T extends any ? (string extends T ? never : T) : never
export type Discriminate<T extends string, K extends string = 'type'> = { [P in K]: T }
