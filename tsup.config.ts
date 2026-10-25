import { defineConfig } from 'tsup'

console.log(process.cwd())

export default defineConfig((opts) => ({
  ...opts,
  entry: ['src/**'],
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  dts: true,
  sourcemap: true,
  bundle: false,
  experimentalDts: { compilerOptions: { incremental: false } },
}))
