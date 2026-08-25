import next from 'eslint-config-next'

/** Плоский конфиг без FlatCompat: @eslint/eslintrc в зависимостях нет. */
export default [
  ...next,
  { ignores: ['.next/**', 'node_modules/**'] },
]
