import 'server-only'

import { datasource } from '@hux/datasource'

import { DATASOURCE_URL, NODE_ENV } from '@/lib/config/server'

export const database = datasource(DATASOURCE_URL, { logger: NODE_ENV === 'development' })
