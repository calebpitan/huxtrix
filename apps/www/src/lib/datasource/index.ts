import 'server-only'

import { datasource } from '@hux/datasource'

import { DATASOURCE_URL } from '@/lib/config/server'

export const database = datasource(DATASOURCE_URL, { logger: true })
