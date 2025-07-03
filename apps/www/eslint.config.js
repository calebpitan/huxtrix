import { nextJsConfig } from '@hux/eslint/next-js'

export default [
  ...nextJsConfig,
  {
    ignores: ['src/components/ui/**', 'src/components/editor/**'],
  },
]
