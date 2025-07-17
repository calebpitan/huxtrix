import { config as baseConfig } from './base.js'

/**
 * A shared ESLint configuration for the library packages.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const libsConfig = [
  {
    ignores: ['dist/**', 'eslint.config.js', 'node_modules'],
  },
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
