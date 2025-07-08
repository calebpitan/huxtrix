import 'server-only'

import { datasource } from '@hux/datasource'

import { config } from '@/lib/config/server'

export const database = datasource(config.datasourceUrl, {
  logger: config.env === 'development',
})
