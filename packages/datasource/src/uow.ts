import { AbstractRepository } from './repositories'
import { DatabaseSession } from './type'

export interface UnitOfWork<R> {
  repository: R
  rollback(): never
}

export function UnitOfWorkFactory<
  S extends DatabaseSession,
  R extends AbstractRepository<S, Record<string, any>>,
>(session: S, repo: R): UnitOfWork<R> {
  return {
    repository: repo,
    rollback() {
      return session.rollback()
    },
  }
}
