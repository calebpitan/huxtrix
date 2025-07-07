export class DatasourceError extends Error {}

export class NoResultFoundError extends DatasourceError {}

export class MultipleResultsFoundError extends DatasourceError {}
